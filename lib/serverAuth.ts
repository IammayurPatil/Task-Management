import { SignJWT, jwtVerify } from 'jose';

const getJwtSecret = () => process.env.JWT_SECRET || 'dev-only-secret';
const getJwtKey = () => new TextEncoder().encode(getJwtSecret());

export const signToken = async (payload: Record<string, unknown>) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(getJwtKey());
};

export const verifyToken = async (authHeader?: string) => {
  if (!authHeader) throw new Error('401 Unauthorized');
  const token = authHeader.replace('Bearer ', '');
  const { payload } = await jwtVerify(token, getJwtKey());
  return payload;
};
