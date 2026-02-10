import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerStore } from '../../lib/serverStore';
import { verifyToken } from '../../lib/serverAuth';

type ActivityRow = {
  id: string;
  name: string;
  taskName: string;
  projectName: string;
  deadline: string;
  status: string;
};

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
    const projectById = new Map(projects.map(p => [p.id, p]));
    const usersById = new Map(store.users.map(u => [u.id, u]));

    const rows: ActivityRow[] = [];

    store.tasks
      .filter(t => projectById.has(t.projectId))
      .forEach((task) => {
        const projectName = projectById.get(task.projectId)?.name || 'Project';
        const deadline = task.dueDate ? `${task.dueDate}${task.dueTime ? ` ${task.dueTime}` : ''}` : '—';
        const assigned = Array.isArray(task.assignedUserIds) && task.assignedUserIds.length > 0
          ? task.assignedUserIds
          : [''];

        assigned.forEach((userIdOrEmpty, index) => {
          const name = userIdOrEmpty ? (usersById.get(userIdOrEmpty)?.name || 'User') : 'Unassigned';
          rows.push({
            id: `${task.id}-${index}`,
            name,
            taskName: task.title || 'Task',
            projectName,
            deadline,
            status: task.status || 'Unknown'
          });
        });
      });

    return res.status(200).json(rows);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
