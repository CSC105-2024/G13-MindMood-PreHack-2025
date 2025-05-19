import type { MiddlewareHandler } from 'hono';
import jwt from 'jsonwebtoken';

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return c.json({ message: 'Unauthorized: No token provided' }, 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY!);
    c.set('user', decoded);
    await next();
  } catch (err) {
    return c.json({ message: 'Invalid token' }, 403);
  }
};
