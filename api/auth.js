// api/auth.js
// POST /api/auth        { email }           → sends magic link
// GET  /api/auth?token= { magic_token }     → verifies + returns session_token

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY   // service-role key — bypasses RLS
);

const resend = new Resend(process.env.RESEND_API_KEY);

const FREE_PLAN = 'free';
const MAGIC_LINK_TTL_MINUTES = 15;
const APP_URL = process.env.APP_URL || 'https://tooldexo.com';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', APP_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') return await handleSendMagicLink(req, res);
    if (req.method === 'GET')  return await handleVerifyToken(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[auth] Unhandled error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ── POST: receive email, create/find user, send magic link ──────────────────
async function handleSendMagicLink(req, res) {
  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const normalised = email.trim().toLowerCase();

  if (!isValidEmail(normalised)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Upsert user — creates if new, returns existing if not
  const { data: user, error: upsertErr } = await supabase
    .from('users')
    .upsert({ email: normalised }, { onConflict: 'email' })
    .select('id, email, plan')
    .single();

  if (upsertErr) {
    console.error('[auth] Upsert error:', upsertErr);
    return res.status(500).json({ error: 'Could not create account' });
  }

  // Generate a cryptographically secure magic token
  const magicToken   = crypto.randomBytes(32).toString('hex');
  const magicExpires = new Date(Date.now() + MAGIC_LINK_TTL_MINUTES * 60 * 1000);

  // Upsert session row — one active session per user (simplest model)
  const { error: sessionErr } = await supabase
    .from('sessions')
    .upsert(
      {
        user_id:       user.id,
        session_token: crypto.randomBytes(32).toString('hex'), // will be replaced on verify
        magic_token:   magicToken,
        magic_expires: magicExpires.toISOString(),
        last_used_at:  new Date().toISOString()
      },
      { onConflict: 'user_id' }  // one row per user
    );

  if (sessionErr) {
    console.error('[auth] Session upsert error:', sessionErr);
    return res.status(500).json({ error: 'Could not create session' });
  }

  // Send the magic link email via Resend
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

  return res.status(200).json({ ok: true, message: 'Magic link sent — check your inbox.' });
}

// ── GET: verify magic token, return session_token to browser ─────────────────
async function handleVerifyToken(req, res) {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return redirectWithError(res, 'Missing token');
  }

  // Find the session row with this magic token
  const { data: session, error: findErr } = await supabase
    .from('sessions')
    .select('id, user_id, magic_token, magic_expires, session_token')
    .eq('magic_token', token)
    .single();

  if (findErr || !session) {
    return redirectWithError(res, 'Link not found or already used');
  }

  // Check expiry
  if (new Date(session.magic_expires) < new Date()) {
    return redirectWithError(res, 'Link expired — request a new one');
  }

  // Issue a fresh session token and consume the magic token
  const newSessionToken = crypto.randomBytes(40).toString('hex');

  const { error: updateErr } = await supabase
    .from('sessions')
    .update({
      session_token: newSessionToken,
      magic_token:   null,   // consume — can't reuse
      magic_expires: null,
      last_used_at:  new Date().toISOString()
    })
    .eq('id', session.id);

  if (updateErr) {
    console.error('[auth] Token update error:', updateErr);
    return redirectWithError(res, 'Verification failed — try again');
  }

  // Redirect browser to frontend with the session token in the URL fragment
  // The fragment (#) is never sent to the server — safe to carry the token this way
  return res.redirect(302, `${APP_URL}/app#confirm=${token}`);
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function redirectWithError(res, msg) {
  return res.redirect(302, `${APP_URL}/app#auth-error=${encodeURIComponent(msg)}`);
}

function buildEmailHtml(link, ttl) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f7f7f7;margin:0;padding:40px 16px">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5">
    <div style="background:#7C6FFF;padding:28px 32px">
      <div style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.02em">Tooldexo</div>
    </div>
    <div style="padding:32px">
      <div style="font-size:20px;font-weight:700;color:#111;margin-bottom:10px">Your login link</div>
      <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px">
        Click the button below to sign in. This link expires in ${ttl} minutes and can only be used once.
      </p>
      <a href="${link}"
         style="display:inline-block;background:#7C6FFF;color:#fff;font-weight:700;font-size:14px;
                padding:14px 28px;border-radius:8px;text-decoration:none;letter-spacing:-0.01em">
        Sign in to Tooldexo →
      </a>
      <p style="color:#999;font-size:12px;margin-top:24px;line-height:1.6">
        If you didn't request this, ignore this email — your account is safe.<br>
        Or copy this link: <span style="color:#7C6FFF;word-break:break-all">${link}</span>
      </p>
    </div>
  </div>
</body>
</html>`;
}
