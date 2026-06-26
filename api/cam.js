const ALLOWED = [
  'artunsbrekka','kringlan','bustadabru','arnarneshaed',
  'engidalur','leirvogstungumelar','kambar','hellisheidi',
  'hellisbru','kotstrond'
];

export default async function handler(request) {
  const url = new URL(request.url);
  const cam = url.searchParams.get('cam');
  const n   = url.searchParams.get('n') || '1';

  if (!cam || !ALLOWED.includes(cam)) {
    return new Response('Invalid camera', { status: 400 });
  }

  const imgUrl = `https://www.vegagerdin.is/vgdata/vefmyndavelar/${cam}_${n}.jpg`;

  try {
    const res = await fetch(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
        'Referer':    'https://www.vegagerdin.is/',
        'Accept':     'image/jpeg,image/*',
      }
    });

    if (!res.ok) {
      return new Response('Image unavailable', { status: res.status });
    }

    const data = await res.arrayBuffer();

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type':                'image/jpeg',
        'Cache-Control':               'public, max-age=25, s-maxage=25',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (e) {
    return new Response('Error: ' + e.message, { status: 502 });
  }
}

export const config = { runtime: 'edge' };
