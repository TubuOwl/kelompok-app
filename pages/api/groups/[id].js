// pages/api/groups/[id].js
import { getPool } from '../../../lib/db';

export default async function handler(req, res) {
  const pool = getPool();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await pool.query('DELETE FROM groups WHERE id = $1', [id]);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
