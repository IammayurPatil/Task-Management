import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerStore } from '../../lib/serverStore';
import { verifyToken } from '../../lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization || (typeof req.query.token === 'string' ? `Bearer ${req.query.token}` : undefined);
    await verifyToken(authHeader);
    const store = getServerStore();
    const usersById = new Map(store.users.map(u => [u.id, u]));
    const items = store.activities
      .slice()
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 20)
      .map((a) => {
        const user = usersById.get(a.userId);
        return {
          id: a.id,
          name: user?.name || 'User',
          activity: `${a.type === 'create' ? 'Created' : a.type === 'update' ? 'Edited' : 'Deleted'} ${a.entity} ${a.title}`,
          time: a.createdAt
        };
      });
    return res.status(200).json(items);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
