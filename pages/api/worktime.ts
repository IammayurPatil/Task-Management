import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerStore } from '../../lib/serverStore';
import { verifyToken } from '../../lib/serverAuth';

const toDateKey = (d: Date) => d.toISOString().split('T')[0];
const toDate = (value: string | undefined) => {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization || (typeof req.query.token === 'string' ? `Bearer ${req.query.token}` : undefined);
    const payload = await verifyToken(authHeader);
    const userId = payload.id as string | undefined;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const store = getServerStore();

    if (req.method === 'POST') {
      const { date, minutes, projectId, taskId } = req.body || {};
      const parsed = toDate(typeof date === 'string' ? date : undefined);
      if (!parsed || typeof minutes !== 'number' || minutes <= 0) {
        return res.status(400).json({ error: 'Invalid time entry' });
      }

      const entry = {
        id: Math.random().toString(36).slice(2, 9),
        userId,
        date: toDateKey(parsed),
        minutes: Math.round(minutes),
        projectId,
        taskId
      };
      store.timeEntries.push(entry);
      return res.status(200).json(entry);
    }

    const startParam = typeof req.query.start === 'string' ? req.query.start : undefined;
    const startDate = toDate(startParam) || new Date();
    const days = typeof req.query.days === 'string' ? Math.max(1, Math.min(14, parseInt(req.query.days, 10))) : 7;

    const buckets = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      buckets.set(toDateKey(d), 0);
    }

    for (const entry of store.timeEntries) {
      if (entry.userId !== userId) continue;
      if (buckets.has(entry.date)) {
        buckets.set(entry.date, (buckets.get(entry.date) || 0) + entry.minutes);
      }
    }

    const data = Array.from(buckets.entries()).map(([date, minutes]) => ({
      date,
      minutes
    }));

    return res.status(200).json(data);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
