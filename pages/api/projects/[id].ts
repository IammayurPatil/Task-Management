import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerStore } from '../../../lib/serverStore';
import { verifyToken } from '../../../lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = await verifyToken(req.headers.authorization);
    const userId = payload.id as string | undefined;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.query.id as string;
    const store = getServerStore();

    if (req.method === 'DELETE') {
      store.projects = store.projects.filter(p => !(p.id === id && p.userId === userId));
      store.tasks = store.tasks.filter(t => t.projectId !== id);
      return res.status(200).json({ ok: true });
    }

    const updates = req.body || {};
    const index = store.projects.findIndex(p => p.id === id && p.userId === userId);
    if (index === -1) return res.status(404).json({ error: 'Project not found' });

    store.projects[index] = {
      ...store.projects[index],
      name: typeof updates.name === 'string' ? updates.name : store.projects[index].name,
      description: typeof updates.description === 'string' ? updates.description : store.projects[index].description,
      category: typeof updates.category === 'string' ? updates.category : store.projects[index].category,
      endDate: typeof updates.endDate === 'string' ? updates.endDate : store.projects[index].endDate
    };

    return res.status(200).json(store.projects[index]);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
