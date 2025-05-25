import type { Context } from 'hono';
import { verify } from 'hono/jwt';
import { prisma } from '../index.ts';
 
interface JWTPayload {
    username: string;
    [key: string]: unknown;
}
 
export const verifyAuth = async (c: Context): Promise<number | null> => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        const token = authHeader.split(' ')[1];
        const payload = await verify(token, process.env.KEY || 'your_jwt_secret') as JWTPayload;
       
        if (!payload.username || typeof payload.username !== 'string') {
            console.error('Invalid JWT payload: username is missing or not a string');
            return null;
        }
        const user = await prisma.user.findUnique({
            where: { username: payload.username },
        });
       
        if (!user) {
            return null;
        }
       
        return user.id;
    } catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
};