import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerStore } from '../../../lib/serverStore';
import { verifyToken } from '../../../lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = await verifyToken(req.headers.authorization);
    const userId = payload.id as string | undefined;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const store = getServerStore();
    const id = req.query.id as string;

    if (req.method === 'DELETE') {
      store.tasks = store.tasks.filter(t => t.id !== id);
      return res.status(200).json({ ok: true });
    }

    const updates = req.body || {};
    if (!updates.title || !updates.description || !updates.status || !updates.priority || !updates.dueDate || !updates.dueTime) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    if (!Array.isArray(updates.assignedUserIds) || updates.assignedUserIds.length === 0) {
      return res.status(400).json({ error: 'Assign at least one user' });
    }
    const taskIndex = store.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

    const task = store.tasks[taskIndex];
    const project = store.projects.find(p => p.id === task.projectId);
    if (!project || project.userId !== userId) return res.status(404).json({ error: 'Task not found' });

    const statusChanged = typeof updates.status === 'string' && updates.status !== task.status;
    const now = new Date().toISOString();
    const nextStartedAt = statusChanged && updates.status === 'in-progress'
      ? (task.startedAt || now)
      : task.startedAt;
    const nextCompletedAt = statusChanged && updates.status === 'done'
      ? now
      : updates.status === 'done'
      ? task.completedAt
      : undefined;

    store.tasks[taskIndex] = {
      ...task,
      ...updates,
      dueTime: typeof updates.dueTime === 'string' ? updates.dueTime : task.dueTime,
      assignedUserIds: Array.isArray(updates.assignedUserIds) ? updates.assignedUserIds : task.assignedUserIds,
      startedAt: nextStartedAt,
      completedAt: nextCompletedAt
    };
    return res.status(200).json(store.tasks[taskIndex]);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
