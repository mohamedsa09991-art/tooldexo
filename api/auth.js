// api/auth/oauth.js — Supabase OAuth redirect handler
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { provider, redirect_url } = req.body;
  const validProviders = ['google', 'azure', 'github'];

  if (!provider || !validProviders.includes(provider)) {
    return res.status(400).json({ error: 'Invalid provider. Use: google, azure, or github' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirect_url || `${process.env.APP_URL}/app`,
        // Azure requires this scope for email access
        scopes: provider === 'azure' ? 'email profile openid' : undefined,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('No OAuth URL returned from Supabase');

    return res.status(200).json({ url: data.url });
  } catch (err) {
    console.error('OAuth error:', err);
    return res.status(500).json({ error: err.message || 'OAuth failed' });
  }
}
