import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerStore } from '../../../lib/serverStore';
import { signToken } from '../../../lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const store = getServerStore();
  if (store.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const id = Math.random().toString(36).slice(2, 9);
  const user = { id, name, email, password };
  store.users.push(user);

  const token = await signToken({ id: user.id });
  return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, token });
}
