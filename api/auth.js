// api/auth.js
// POST /api/auth        { email }      → sends magic link
// GET  /api/auth?token= { token }      → redirects to confirm page (does NOT consume token)
// POST /api/auth/verify { token }      → actually verifies + issues session

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

const MAGIC_LINK_TTL_MINUTES = 30;
const APP_URL = process.env.APP_URL || 'https://tooldexo.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', APP_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // POST /api/auth — send magic link
    if (req.method === 'POST' && !req.url?.includes('/verify')) {
      return await handleSendMagicLink(req, res);
    }

    // POST /api/auth/verify — user clicked the confirm button, now actually verify
    if (req.method === 'POST' && req.url?.includes('/verify')) {
      return await handleVerifyToken(req, res);
    }

    // GET /api/auth?token= — email link clicked, just redirect to confirm page
    // DO NOT consume the token here — email scanners hit this URL automatically
    if (req.method === 'GET') {
      return await handleEmailClick(req, res);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[auth] Unhandled error:', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ── POST: send magic link email ───────────────────────────────────────────────
async function handleSendMagicLink(req, res) {
  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const normalised = email.trim().toLowerCase();

  if (!isValidEmail(normalised)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Upsert user
  const { data: user, error: upsertErr } = await supabase
    .from('users')
    .upsert({ email: normalised }, { onConflict: 'email' })
    .select('id, email, plan')
    .single();

  if (upsertErr) {
    console.error('[auth] Upsert error:', upsertErr);
    return res.status(500).json({ error: 'Could not create account' });
  }

  const magicToken   = crypto.randomBytes(32).toString('hex');
  const magicExpires = new Date(Date.now() + MAGIC_LINK_TTL_MINUTES * 60 * 1000);

  const { error: sessionErr } = await supabase
    .from('sessions')
    .upsert(
      {
        user_id:       user.id,
        session_token: crypto.randomBytes(32).toString('hex'),
        magic_token:   magicToken,
        magic_expires: magicExpires.toISOString(),
        last_used_at:  new Date().toISOString()
      },
      { onConflict: 'user_id' }
    );

  if (sessionErr) {
    console.error('[auth] Session upsert error:', sessionErr);
    return res.status(500).json({ error: 'Could not create session' });
  }

  // The link in the email goes to GET /api/auth?token=xxx
  // That just redirects to the confirm page — it does NOT verify yet
  const magicLink = `${APP_URL}/api/auth?token=${magicToken}`;

  const { error: emailErr } = await resend.emails.send({
    from:    'Tooldexo <noreply@tooldexo.com>',
    to:      normalised,
    subject: 'Your Tooldexo login link',
    html:    buildEmailHtml(magicLink, MAGIC_LINK_TTL_MINUTES)
  });

  if (emailErr) {
    console.error('[auth] Email send error:', emailErr);
    return res.status(500).json({ error: 'Could not send email. Try again.' });
  }

  return res.status(200).json({ ok: true });
}

// ── GET: email link clicked — redirect to confirm page, do NOT verify yet ─────
// Email security scanners visit this URL automatically.
// We just pass the token to the frontend as a URL fragment (never sent to server).
async function handleEmailClick(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.redirect(302, `${APP_URL}/app#auth-error=${encodeURIComponent('Missing token')}`);
  }

  // Just redirect to the app with the raw token in the fragment.
  // The frontend will show a "Confirm sign in" button.
  // Only when the user clicks that button does the token get verified.
  return res.redirect(302, `${APP_URL}/app#confirm=${token}`);
}

// ── POST /api/auth/verify: user clicked confirm button, now verify ────────────
async function handleVerifyToken(req, res) {
  const { token } = req.body || {};

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Missing token' });
  }

  const { data: session, error: findErr } = await supabase
    .from('sessions')
    .select('id, user_id, magic_token, magic_expires, session_token')
    .eq('magic_token', token)
    .single();

  if (findErr || !session) {
    return res.status(400).json({ error: 'Link not found or already used. Please request a new one.' });
  }

  if (new Date(session.magic_expires) < new Date()) {
    return res.status(400).json({ error: 'Link expired. Please request a new one.' });
  }

  const newSessionToken = crypto.randomBytes(40).toString('hex');

  const { error: updateErr } = await supabase
    .from('sessions')
    .update({
      session_token: newSessionToken,
      magic_token:   null,
      magic_expires: null,
      last_used_at:  new Date().toISOString()
    })
    .eq('id', session.id);

  if (updateErr) {
    console.error('[auth] Token update error:', updateErr);
    return res.status(500).json({ error: 'Verification failed. Please try again.' });
  }

  return res.status(200).json({ ok: true, session_token: newSessionToken });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildEmailHtml(link, ttl) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0D0D12;margin:0;padding:40px 16px">
  <div style="max-width:480px;margin:0 auto;background:#090D17;border-radius:8px;overflow:hidden;border:1px solid rgba(196,145,61,0.2)">
    <div style="background:#05080F;padding:24px 32px;border-bottom:1px solid rgba(196,145,61,0.15)">
      <div style="font-size:18px;font-weight:500;color:#F2EFE9;font-family:Georgia,serif;display:flex;align-items:center;gap:10px">
        <span style="color:#C4913D">★</span> Tooldexo
      </div>
    </div>
    <div style="padding:32px">
      <div style="font-size:22px;font-weight:400;color:#F2EFE9;margin-bottom:12px;font-family:Georgia,serif">Your sign-in link</div>
      <p style="color:#9E9A90;font-size:14px;line-height:1.7;margin:0 0 28px">
        Click the button below to sign in to Tooldexo. This link expires in ${ttl} minutes.
      </p>
      <a href="${link}"
         style="display:inline-block;background:#F2EFE9;color:#05080F;font-weight:700;font-size:13px;
                padding:14px 28px;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase">
        Sign in to Tooldexo →
      </a>
      <p style="color:#4A4740;font-size:12px;margin-top:28px;line-height:1.6">
        If you didn't request this, you can safely ignore this email.<br>
        Link: <span style="color:#C4913D;word-break:break-all">${link}</span>
      </p>
    </div>
  </div>
</body>
</html>`;
}
