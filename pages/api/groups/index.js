// pages/api/groups/index.js
import { getPool } from '../../../lib/db';

export default async function handler(req, res) {
  const pool = getPool();

  if (req.method === 'GET') {
    // Ambil semua kelompok beserta anggotanya
    try {
      const groupsResult = await pool.query('SELECT * FROM groups ORDER BY created_at ASC');
      const groups = groupsResult.rows;

      // Ambil semua anggota sekaligus
      const membersResult = await pool.query('SELECT * FROM members ORDER BY created_at ASC');
      const members = membersResult.rows;

      // Gabungkan
      const data = groups.map(g => ({
        ...g,
        members: members.filter(m => m.group_id === g.id),
      }));

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    // Tambah kelompok baru
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nama kelompok wajib diisi' });

    try {
      const result = await pool.query(
        'INSERT INTO groups (name) VALUES ($1) RETURNING *',
        [name]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
