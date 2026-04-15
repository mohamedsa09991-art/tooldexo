// api/claude.js
// POST /api/claude   Authorization: Bearer <token>
// Supports two token types:
//   1. OAuth JWT (eyJ...) — validated via supabase.auth.getUser()
//   2. Magic link session token — looked up in sessions table

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
    // ── 1. Extract token ──────────────────────────────────────
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return res.status(401).json({ error: 'No session token. Please log in.' });
    }

    // ── 2. Resolve user — two paths depending on token type ───
    let userId;
    const isJWT = token.startsWith('eyJ');

    if (isJWT) {
      // OAuth JWT — validate with Supabase Auth directly
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ error: 'Session expired. Please sign in again.' });
      }
      userId = user.id;

      // Ensure user row exists (first OAuth login creates it)
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (!existingUser) {
        await supabase.from('users').insert({
          id: userId,
          email: user.email,
          plan: 'free',
          created_at: new Date().toISOString()
        });
      }
    } else {
      // Magic link session token — look up in sessions table
      const { data: session, error: sessionErr } = await supabase
        .from('sessions')
        .select('id, user_id')
        .eq('session_token', token)
        .single();

      if (sessionErr || !session) {
        return res.status(401).json({ error: 'Session expired. Please sign in again.' });
      }

      userId = session.user_id;

      // Update last_used_at in background
      supabase.from('sessions')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', session.id)
        .then(() => {});
    }

    // ── 3. Look up user plan ──────────────────────────────────
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, plan')
      .eq('id', userId)
      .single();

    if (userErr || !user) {
      return res.status(401).json({ error: 'User not found. Please sign in again.' });
    }

    const isPro = user.plan === 'pro';

    // ── 4. Check usage limit (free users only) ────────────────
    if (!isPro) {
      const { count, error: usageErr } = await supabase
        .from('usage_log')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', getMonthStart());

      if (usageErr) {
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
        max_tokens: max_tokens || 2000,
        system:     system     || '',
        messages
      })
    });

    const anthropicData = await anthropicRes.json();
    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json({
        error: anthropicData.error?.message || 'Claude API error'
      });
    }

    // ── 7. Log usage ──────────────────────────────────────────
    await supabase.from('usage_log').insert({ user_id: userId, action: 'parse' });

    // ── 8. Return response + metadata ─────────────────────────
    const usedAfter = isPro ? null : await getMonthlyUsage(userId);
    return res.status(200).json({
      ...anthropicData,
      _meta: { plan: user.plan, used: usedAfter, limit: isPro ? null : FREE_LIMIT }
    });

  } catch (err) {
    console.error('[claude] Unhandled error:', err?.message || err);
    return res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}

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
