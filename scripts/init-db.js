// scripts/init-db.js
// Jalankan: node scripts/init-db.js
// Pastikan DATABASE_URL sudah diset di .env.local

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function init() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        nim VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Database tables created successfully!');
  } catch (err) {
    console.error('❌ Error creating tables:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

init();
