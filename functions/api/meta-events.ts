/**
 * Cloudflare Pages Function: /api/meta-events
 * Executes server-side on Cloudflare Edge (Workers) with ZERO CORS restrictions.
 * Forwards Meta Conversions API (CAPI) events securely to https://graph.facebook.com
 */

interface Env {}

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    const body: any = await context.request.json();
    const { pixelId, token, payload } = body || {};

    if (!pixelId || !token || !payload) {
      return new Response(
        JSON.stringify({ error: 'Missing pixelId, token, or payload' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const apiUrl = `https://graph.facebook.com/v19.0/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(token)}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: corsHeaders,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'Conversions API proxy error',
        message: error?.message || String(error),
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};
