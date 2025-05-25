import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './routes/user.routes.ts';  // your auth routes if any
import activityRoutes from './routes/activity.routes.ts';
import 'dotenv/config';
import { PrismaClient } from './generated/prisma/index.js';
 
export const prisma = new PrismaClient();
const app = new Hono();
 
app.use('*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
 
// Change this line - use '/activities' instead of '/activity'
app.route('/auth', authRoutes);
app.route('/activities', activityRoutes);
 
serve({ fetch: app.fetch, port: Number(process.env.PORT || 3000) }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});