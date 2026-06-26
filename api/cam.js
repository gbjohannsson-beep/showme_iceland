const ALLOWED = ['artunsbrekka','kringlan','bustadabru','arnarneshaed','engidalur','leirvogstungumelar','kambar','hellisheidi','hellisbru','kotstrond'];

module.exports = async (req, res) => {
  const { cam, n = '1' } = req.query;
  if (!cam || !ALLOWED.includes(cam)) return res.status(400).send('Invalid');
  const url = `https://www.vegagerdin.is/vgdata/vefmyndavelar/${cam}_${n}.jpg`;
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.vegagerdin.is/',
        'Accept': 'image/jpeg,image/*',
      }
    });
    if (!r.ok) return res.status(r.status).send('Unavailable');
    const buf = await r.arrayBuffer();
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=25');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(Buffer.from(buf));
  } catch (e) {
    res.status(502).send('Error: ' + e.message);
  }
};
