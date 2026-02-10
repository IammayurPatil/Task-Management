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
      const projectId = req.query.projectId as string;
      const tasks = store.tasks.filter(t => t.projectId === projectId);
      return res.status(200).json(tasks);
    }

    const { title, description, status, priority, dueDate, dueTime, projectId, assignedUserIds } = req.body || {};
    if (!title || !description || !status || !priority || !dueDate || !dueTime || !projectId) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    if (!Array.isArray(assignedUserIds) || assignedUserIds.length === 0) {
      return res.status(400).json({ error: 'Assign at least one user' });
    }

    const project = store.projects.find(p => p.id === projectId && p.userId === userId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const now = new Date().toISOString();
    const task = {
      id: Math.random().toString(36).slice(2, 9),
      title,
      description: description || '',
      status,
      priority,
      dueDate,
      dueTime: dueTime || '',
      projectId,
      assignedUserIds,
      startedAt: status === 'in-progress' ? now : undefined,
      completedAt: status === 'done' ? now : undefined
    };
    store.tasks.push(task);
    return res.status(200).json(task);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
