import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// __dirname fix for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Rebrandly API proxy
app.post('/shorten', async (req, res) => {
  const { destination } = req.body;
  if (!destination) return res.status(400).json({ error: 'Destination URL missing' });

  const API_KEY = 'YOUR_REBRANDLY_API_KEY'; // Replace with your key

  try {
    const response = await fetch('https://api.rebrandly.com/v1/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      },
      body: JSON.stringify({
        destination,
        domain: { fullName: 'rebrand.ly' }
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

// Catch-all route for frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
