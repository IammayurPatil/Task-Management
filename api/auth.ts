
import { User } from '../types';
import { SignJWT, jwtVerify } from 'jose';

const getUsers = (): any[] => JSON.parse(localStorage.getItem('tf_users') || '[]');

const getJwtSecret = () => process.env.NEXT_PUBLIC_JWT_SECRET || process.env.JWT_SECRET || 'dev-only-secret';
const getJwtKey = () => new TextEncoder().encode(getJwtSecret());

export const register = async (data: any) => {
  const users = getUsers();
  if (users.find(u => u.email === data.email)) throw new Error('User already exists');

  const newUser = { ...data, id: Math.random().toString(36).substr(2, 9) };
  users.push(newUser);
  localStorage.setItem('tf_users', JSON.stringify(users));

  const token = await new SignJWT({ id: newUser.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1m')
    .sign(getJwtKey());
  return { user: { id: newUser.id, email: newUser.email, name: newUser.name }, token };
};

export const login = async (data: any) => {
  const users = getUsers();
  const user = users.find(u => u.email === data.email && u.password === data.password);
  if (!user) throw new Error('Invalid credentials');

  const token = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1m')
    .sign(getJwtKey());
  return { user: { id: user.id, email: user.email, name: user.name }, token };
};

export const verify = async (authHeader: string) => {
  if (!authHeader) throw new Error('401 Unauthorized');
  const token = authHeader.replace('Bearer ', '');
  try {``
    const { payload } = await jwtVerify(token, getJwtKey());
    if (!payload?.id) throw new Error('401 Unauthorized');
    return payload;
  } catch {
    throw new Error('401 Unauthorized');
  }
};
