import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerStore } from '../../../lib/serverStore';
import { verifyToken } from '../../../lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = await verifyToken(req.headers.authorization);
    const userId = payload.id as string | undefined;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const store = getServerStore();

    if (req.method === 'GET') {
      const projects = store.projects.filter(p => p.userId === userId);
      return res.status(200).json(projects);
    }

    const { name, description, category, endDate } = req.body || {};
    if (!name) return res.status(400).json({ error: 'Missing project name' });

    const project = {
      id: Math.random().toString(36).slice(2, 9),
      name,
      description: description || '',
      category: category || '',
      endDate: endDate || '',
      createdAt: new Date().toISOString(),
      userId
    };
    store.projects.push(project);
    return res.status(200).json(project);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
