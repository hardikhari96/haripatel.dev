import type { APIRoute } from 'astro';

export const prerender = false;

// First-party visitor IP lookup: on Vercel the edge sets x-forwarded-for and
// x-vercel-ip-* geo headers, so no third-party service is needed. The chatbot's
// get_public_ip browser tool calls this and falls back to external lookups only
// when this returns a private/local address (e.g. in local dev).
export const GET: APIRoute = async ({ request, clientAddress }) => {
  const h = request.headers;

  let address = h.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  if (!address) {
    try {
      address = clientAddress;
    } catch {
      address = '';
    }
  }

  const city = h.get('x-vercel-ip-city');
  const payload = {
    ip: address,
    city: city ? decodeURIComponent(city) : undefined,
    region: h.get('x-vercel-ip-country-region') ?? undefined,
    country: h.get('x-vercel-ip-country') ?? undefined,
    timezone: h.get('x-vercel-ip-timezone') ?? undefined,
    source: 'haripatel.dev',
  };

  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
};
