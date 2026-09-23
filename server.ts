import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 📡 Meta Conversions API (CAPI) Proxy
app.post('/api/meta-events', async (req, res) => {
  try {
    const { pixelId, token, payload } = req.body || {};
    if (!pixelId || !token || !payload) {
      return res.status(400).json({ error: 'Missing pixelId, token, or payload' });
    }

    const apiUrl = `https://graph.facebook.com/v19.0/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(token)}`;
    const fbRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await fbRes.json();
    return res.status(fbRes.status).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: 'Conversions API error', message: error?.message });
  }
});

// Health check endpoint for Render / monitoring
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// Serve compiled static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA client routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SpeedAuto server running on port ${PORT}`);
});
