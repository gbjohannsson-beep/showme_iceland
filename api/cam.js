// Vercel Serverless Function — proxy for Vegagerðin webcam images
// CommonJS format (no ESM export)

module.exports = async function handler(req, res) {
  const cam = req.query.cam;
  const n   = req.query.n || '1';

  const ALLOWED = [
    'artunsbrekka','kringlan','bustadabru','arnarneshaed',
    'engidalur','leirvogstungumelar','kambar','hellisheidi',
    'hellisbru','kotstrond'
  ];

  if (!cam || !ALLOWED.includes(cam)) {
    return res.status(400).send('Invalid camera');
  }

  const imgUrl = `https://www.vegagerdin.is/vgdata/vefmyndavelar/${cam}_${n}.jpg`;

  try {
    const response = await fetch(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer':    'https://www.vegagerdin.is/',
        'Accept':     'image/jpeg,image/*,*/*',
      }
    });

    if (!response.ok) {
      return res.status(response.status).send('Image not available');
    }

    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=25, s-maxage=25');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(Buffer.from(buffer));

  } catch (e) {
    res.status(502).send('Proxy error: ' + e.message);
  }
};
