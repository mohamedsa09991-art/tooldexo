// api/claude.js
// POST /api/claude   Authorization: Bearer <session_token>
// Checks: valid session → usage limit → proxy to Anthropic → log usage

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const FREE_LIMIT    = 5;
const APP_URL       = process.env.APP_URL || 'https://tooldexo.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', APP_URL);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // ── 1. Extract session token ──────────────────────────────
    const authHeader = req.headers.authorization || '';
    const sessionToken = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!sessionToken) {
      return res.status(401).json({ error: 'No session token. Please log in.' });
    }

    // ── 2. Look up session ────────────────────────────────────
    const { data: session, error: sessionErr } = await supabase
      .from('sessions')
      .select('id, user_id, last_used_at')
      .eq('session_token', sessionToken)
      .single();

    if (sessionErr || !session) {
      return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    }

    // ── 3. Look up user separately ────────────────────────────
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, plan')
      .eq('id', session.user_id)
      .single();

    if (userErr || !user) {
      return res.status(401).json({ error: 'User not found. Please log in again.' });
    }

    const isPro = user.plan === 'pro';

    // ── 4. Check usage limit (free users only) ─────────────────
    if (!isPro) {
      const { count, error: usageErr } = await supabase
        .from('usage_log')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', getMonthStart());

      if (usageErr) {
        console.error('[claude] Usage check error:', usageErr);
        return res.status(500).json({ error: 'Could not check usage' });
      }

      const used = count ?? 0;

      if (used >= FREE_LIMIT) {
        return res.status(402).json({
          error: 'free_limit_reached',
          used,
          limit: FREE_LIMIT,
          message: `You've used all ${FREE_LIMIT} free parses this month. Upgrade to Pro for unlimited access.`
        });
      }
    }

    // ── 5. Validate request body ──────────────────────────────
    const { messages, model, max_tokens, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // ── 6. Forward to Anthropic ───────────────────────────────
    const anthropicRes = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model:      model      || 'claude-sonnet-4-20250514',
        max_tokens: max_tokens || 1200,
        system:     system     || '',
        messages
      })
    });

    const anthropicData = await anthropicRes.json();

    if (!anthropicRes.ok) {
      console.error('[claude] Anthropic error:', anthropicData);
      return res.status(anthropicRes.status).json({
        error: anthropicData.error?.message || 'Claude API error'
      });
    }

    // ── 7. Log usage + update session ─────────────────────────
    await Promise.all([
      supabase.from('usage_log').insert({ user_id: user.id, action: 'parse' }),
      supabase.from('sessions').update({ last_used_at: new Date().toISOString() }).eq('id', session.id)
    ]);

    // ── 8. Return response + usage metadata ───────────────────
    const usedAfter = isPro ? null : await getMonthlyUsage(user.id);

    return res.status(200).json({
      ...anthropicData,
      _meta: {
        plan:  user.plan,
        used:  usedAfter,
        limit: isPro ? null : FREE_LIMIT
      }
    });

  } catch (err) {
    console.error('[claude] Unhandled error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getMonthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

async function getMonthlyUsage(userId) {
  const { count } = await supabase
    .from('usage_log')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', getMonthStart());
  return count ?? 0;
}
