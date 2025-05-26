import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from './routes/user.routes.js';
import activityRoutes from './routes/activity.routes.js';
import 'dotenv/config';
import { PrismaClient } from './generated/prisma/index.js';
 
export const prisma = new PrismaClient();
const app = new Hono()

app.use('*', cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

// Routes
app.route('/auth', authRoutes);
app.route('/api/activities', activityRoutes);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'OK', message: 'Server is running' });
});

serve({ fetch: app.fetch, port: Number(process.env.PORT || 3000) }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
