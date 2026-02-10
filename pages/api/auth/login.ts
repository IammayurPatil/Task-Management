import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerStore } from '../../../lib/serverStore';
import { signToken } from '../../../lib/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const store = getServerStore();
  const user = store.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = await signToken({ id: user.id });
  return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, token });
}
