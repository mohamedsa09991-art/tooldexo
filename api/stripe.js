// api/stripe.js
// POST /api/stripe/checkout   → create Stripe Checkout session
// POST /api/stripe/webhook    → handle Stripe events (payment + cancellation)

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const APP_URL        = process.env.APP_URL || 'https://tooldexo.com';
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const PRICE_ID       = process.env.STRIPE_PRICE_ID;  // your $9/mo recurring price ID

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', APP_URL);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, stripe-signature');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const path = req.url?.split('?')[0] || '';

  if (path.endsWith('/checkout')) return handleCheckout(req, res);
  if (path.endsWith('/webhook'))  return handleWebhook(req, res);

  return res.status(404).json({ error: 'Not found' });
}

// ── CREATE CHECKOUT SESSION ───────────────────────────────────────────────────
async function handleCheckout(req, res) {
  try {
    // Verify the user is logged in
    const authHeader = req.headers.authorization || '';
    const sessionToken = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!sessionToken) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { data: session, error } = await supabase
      .from('sessions')
      .select('user_id, users(id, email, stripe_customer_id, plan)')
      .eq('session_token', sessionToken)
      .single();

    if (error || !session) {
      return res.status(401).json({ error: 'Session invalid' });
    }

    const user = session.users;

    if (user.plan === 'pro') {
      return res.status(400).json({ error: 'Already subscribed' });
    }

    // Reuse existing Stripe customer or create new one
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email:    user.email,
        metadata: { supabase_user_id: user.id }
      });
      customerId = customer.id;

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer:             customerId,
      payment_method_types: ['card'],
      mode:                 'subscription',
      line_items: [{
        price:    PRICE_ID,
        quantity: 1
      }],
      success_url: `${APP_URL}/#checkout=success`,
      cancel_url:  `${APP_URL}/#checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id
      },
      subscription_data: {
        metadata: { supabase_user_id: user.id }
      }
    });

    return res.status(200).json({ url: checkoutSession.url });

  } catch (err) {
    console.error('[stripe/checkout] Error:', err);
    return res.status(500).json({ error: 'Could not create checkout session' });
  }
}

// ── STRIPE WEBHOOK ────────────────────────────────────────────────────────────
// Stripe sends events here — we verify the signature then update the DB
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    // req.body must be the raw buffer — set in vercel.json (see below)
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('[stripe/webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  console.log('[stripe/webhook] Event:', event.type);

  try {
    switch (event.type) {

      // Payment succeeded — activate pro plan
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId  = session.metadata?.supabase_user_id;
        if (!userId) break;

        await supabase.from('users').update({
          plan:                    'pro',
          stripe_subscription_id:  session.subscription,
          subscribed_at:           new Date().toISOString()
        }).eq('id', userId);

        console.log('[stripe/webhook] Activated pro for user:', userId);
        break;
      }

      // Subscription renewed — keep plan active (already pro, no-op needed)
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const sub     = await stripe.subscriptions.retrieve(invoice.subscription);
        const userId  = sub.metadata?.supabase_user_id;
        if (userId) {
          await supabase.from('users')
            .update({ plan: 'pro' })
            .eq('id', userId);
        }
        break;
      }

      // Subscription cancelled or payment failed — downgrade to free
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const obj    = event.data.object;
        const subId  = obj.subscription || obj.id;
        if (!subId) break;

        await supabase.from('users').update({
          plan:                    'free',
          stripe_subscription_id:  null,
          subscribed_at:           null
        }).eq('stripe_subscription_id', subId);

        console.log('[stripe/webhook] Downgraded subscription:', subId);
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error('[stripe/webhook] Handler error:', err);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}
