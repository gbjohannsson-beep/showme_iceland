// Vercel Serverless Function — proxy for Vegagerðin webcam images
// This bypasses hotlink protection by fetching server-side

export const config = { runtime: 'edge' };

export default async function handler(request) {
  const url = new URL(request.url);
  const cam = url.searchParams.get('cam');
  const n   = url.searchParams.get('n') || '1';

  // Whitelist — only allow Vegagerðin cameras
  const ALLOWED = [
    'artunsbrekka','kringlan','bustadabru','arnarneshaed',
    'engidalur','leirvogstungumelar','kambar','hellisheidi',
    'hellisbru','kotstrond'
  ];

  if (!cam || !ALLOWED.includes(cam)) {
    return new Response('Invalid camera', { status: 400 });
  }

  const imgUrl = `https://www.vegagerdin.is/vgdata/vefmyndavelar/${cam}_${n}.jpg`;

  try {
    const res = await fetch(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ShowMeIceland/1.0)',
        'Referer': 'https://www.vegagerdin.is/',
        'Accept': 'image/jpeg,image/*',
      },
      cf: { cacheTtl: 25 } // Cache for 25s (refresh every 30s)
    });

    if (!res.ok) {
      return new Response('Image not available', { status: res.status });
    }

    const img = await res.arrayBuffer();

    return new Response(img, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=25, s-maxage=25',
        'Access-Control-Allow-Origin': '*',
        'X-Proxy': 'showme-iceland',
      }
    });
  } catch (e) {
    return new Response('Fetch failed: ' + e.message, { status: 502 });
  }
}

