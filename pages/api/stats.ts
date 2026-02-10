import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerStore } from '../../lib/serverStore';
import { verifyToken } from '../../lib/serverAuth';
import { TaskStatus } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = await verifyToken(req.headers.authorization);
    const userId = payload.id as string | undefined;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const store = getServerStore();
    const projects = store.projects.filter(p => p.userId === userId);
    const tasks = store.tasks.filter(t => projects.some(p => p.id === t.projectId));

    const finishedProjects = projects.filter((project) => {
      const projectTasks = tasks.filter(t => t.projectId === project.id);
      return projectTasks.length > 0 && projectTasks.every(t => t.status === TaskStatus.DONE);
    }).length;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const pendingTasks = totalTasks - completedTasks;
    const totalMembers = store.users.length;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const timeTrackedMinutesWeek = Math.max(0, Math.round(tasks.reduce((sum, task) => {
      if (!task.startedAt) return sum;
      const startedAt = Date.parse(task.startedAt);
      if (Number.isNaN(startedAt)) return sum;
      const endTs = task.completedAt ? Date.parse(task.completedAt) : Date.now();
      if (Number.isNaN(endTs)) return sum;
      const clampedStart = Math.max(startedAt, oneWeekAgo);
      const clampedEnd = Math.max(endTs, clampedStart);
      const minutes = (clampedEnd - clampedStart) / (1000 * 60);
      return sum + Math.max(0, minutes);
    }, 0)));

    return res.status(200).json({
      finishedProjects,
      timeTrackedMinutesWeek,
      totalTasks,
      completedTasks,
      pendingTasks,
      totalMembers
    });
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
