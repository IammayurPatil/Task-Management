import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerStore } from '../../../lib/serverStore';
import { verifyToken } from '../../../lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await verifyToken(req.headers.authorization);
    const store = getServerStore();
    const users = store.users.map(u => ({ id: u.id, name: u.name, email: u.email }));
    return res.status(200).json(users);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
