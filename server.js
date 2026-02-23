const express = require('express');
const cors    = require('cors');
const { Pool } = require('pg');
const path    = require('path');

const app  = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── DB init ──────────────────────────────────────────────────────────────────
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stats (
      id            SERIAL PRIMARY KEY,
      reveals       BIGINT NOT NULL DEFAULT 0,
      snakes_found  BIGINT NOT NULL DEFAULT 0
    );
    INSERT INTO stats (id, reveals, snakes_found)
    SELECT 1, 0, 0
    WHERE NOT EXISTS (SELECT 1 FROM stats WHERE id = 1);
  `);
  console.log('✅ DB ready');
}

// ── Routes ───────────────────────────────────────────────────────────────────

// Called when the user hits "Reveal The Snakes"
// Body: { snake_count: number }
app.post('/api/reveal', async (req, res) => {
  const count = parseInt(req.body.snake_count) || 0;
  try {
    const result = await pool.query(`
      UPDATE stats
      SET reveals      = reveals + 1,
          snakes_found = snakes_found + $1
      WHERE id = 1
      RETURNING reveals, snakes_found
    `, [count]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Called on page load to show the live counter
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query('SELECT reveals, snakes_found FROM stats WHERE id = 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Catch-all → serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
initDB().then(() => {
  app.listen(PORT, () => console.log(`🐍 Reveal Snakes running on port ${PORT}`));
});
