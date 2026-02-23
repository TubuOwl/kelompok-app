// pages/api/members/index.js
import { getPool } from '../../../lib/db';

export default async function handler(req, res) {
  const pool = getPool();

  if (req.method === 'POST') {
    const { group_id, name, nim } = req.body;
    if (!group_id || !name) return res.status(400).json({ error: 'group_id dan name wajib diisi' });

    try {
      const result = await pool.query(
        'INSERT INTO members (group_id, name, nim) VALUES ($1, $2, $3) RETURNING *',
        [group_id, name, nim || null]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
