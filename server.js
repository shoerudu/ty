import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ================================
// Rebrandly API Proxy
// ================================
app.post('/shorten', async (req, res) => {
  const { destination } = req.body;

  if (!destination) return res.status(400).json({ error: 'Destination URL missing' });

  const API_KEY = 'YOUR_REBRANDLY_API_KEY'; // Backend এ safe রাখো

  try {
    const response = await fetch('https://api.rebrandly.com/v1/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      },
      body: JSON.stringify({
        destination,
        domain: { fullName: 'rebrand.ly' } // default domain
      })
    });

    const data = await response.json();

    if (data.shortUrl) {
      res.json({ shortUrl: `https://${data.shortUrl}` });
    } else {
      res.status(400).json({ error: data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
