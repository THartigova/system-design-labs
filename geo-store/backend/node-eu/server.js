const express = require('express');
const app = express();
const fetch = require("node-fetch");
const cors = require("cors");

app.use(cors());     
app.use(express.json());

const REGION = 'EU';
const LATENCY_MS = 50;
let data = { value: null, lastUpdated: null };

app.post('/write', (req, res) => {
  const { value } = req.body;
  data.value = value;
  data.lastUpdated = new Date().toISOString();
  res.json({ region: REGION, status: 'ok', data });
});

app.get('/read', (req, res) => {
  res.json({ region: REGION, data });
});

app.post('/sync', async (req, res) => {
  const { targetUrl } = req.body;

  await new Promise(r => setTimeout(r, LATENCY_MS));

  try {
    await fetch(`${targetUrl}/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: data.value })
    });

    res.json({ region: REGION, status: 'synced', target: targetUrl });
  } catch (err) {
    console.error("SYNC ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/latency', (req, res) => {
  res.json({ region: REGION, latency: LATENCY_MS });
});

app.listen(3001, () => console.log(`EU node on 3001`));
