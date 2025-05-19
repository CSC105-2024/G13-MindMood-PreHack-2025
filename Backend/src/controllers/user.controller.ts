import type { Context } from 'hono';
import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendResetEmail } from '../utils/mailer.ts';
 
const prisma = new PrismaClient();
 
const JWT_SECRET = process.env.KEY || 'your_jwt_secret';
 
export const signup = async (c: Context) => {
  try {
    const { username, email, password } = await c.req.json();
    const existing = await prisma.user.findUnique({ where: { email } });
 
    if (existing) return c.json({ status: false, message: 'User already exists' }, 400);
 
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashed }
    });
 
    return c.json({
      status: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ status: false, message: 'Registration failed' }, 500);
  }
};
 
export const login = async (c: Context) => {
  try {
    const { email, password, rememberMe } = await c.req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return c.json({ status: false, message: 'User not found' }, 404);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return c.json({ status: false, message: 'Invalid password' }, 401);

    // Set token expiration based on rememberMe flag
    const expiresIn = rememberMe ? '30d' : '1d';
    
    const token = jwt.sign({
      username: user.username,
      id: user.id
    }, JWT_SECRET, { expiresIn });
   
    // Set cookie expiry based on rememberMe flag
    // Short session (1 day): 86400 seconds
    // Long session (30 days): 2592000 seconds
    const maxAge = rememberMe ? 2592000 : 86400;
    c.header('Set-Cookie', `token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}`);

    return c.json({
      status: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return c.json({ status: false, message: 'Internal Server Error' }, 500);
  }
};
 
export const forgotPassword = async (c: Context) => {
  try {
    const { email } = await c.req.json();
    const user = await prisma.user.findUnique({ where: { email } });
 
    if (!user) return c.json({ status: false, message: 'User not found' }, 404);
 
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '5m' });
    await sendResetEmail(email, token);
 
    return c.json({ status: true, message: 'Reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return c.json({ status: false, message: 'Failed to process request' }, 500);
  }
};
 
export const resetPassword = async (c: Context) => {
  try {
    const { token } = c.req.param();
    const { password } = await c.req.json();
 
    const { id } = jwt.verify(token, JWT_SECRET) as { id: number };
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id }, data: { password: hashed } });
 
    return c.json({ status: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({ status: false, message: 'Invalid or expired token' }, 400);
  }
};
 
export const getProfile = async (c: Context) => {
  try {
    const authHeader = c.req.header('Authorization');
    let token;
   
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      const cookieHeader = c.req.header('Cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
       
        token = cookies['token'];
      }
    }
   
    if (!token) {
      return c.json({ status: false, message: 'Unauthorized' }, 401);
    }
   
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string, id: number };
   
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true
      }
    });
   
    if (!user) {
      return c.json({ status: false, message: 'User not found' }, 404);
    }
   
    return c.json({
      status: true,
      user
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    return c.json({ status: false, message: 'Unauthorized or invalid token' }, 401);
  }
};

export const updateProfile = async (c: Context) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ status: false, message: 'Unauthorized' }, 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    const { username } = await c.req.json();

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: { username },
      select: { id: true, username: true, email: true },
    });

    return c.json({ status: true, user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ status: false, message: 'Failed to update profile' }, 500);
  }
};

export const verifyToken = async (c: Context) => {
  try {
    const authHeader = c.req.header('Authorization');
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      const cookieHeader = c.req.header('Cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
       
        token = cookies['token'];
      }
    }
    
    if (!token) {
      return c.json({ status: false, message: 'No token provided' }, 401);
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { username: string, id: number };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, username: true, email: true }
      });
      
      if (!user) {
        return c.json({ status: false, message: 'User no longer exists' }, 401);
      }
      
      return c.json({ 
        status: true, 
        message: 'Token is valid',
        user 
      });
    } catch (error) {
      return c.json({ status: false, message: 'Invalid or expired token' }, 401);
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return c.json({ status: false, message: 'Server error' }, 500);
  }
};