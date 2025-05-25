import type { Context } from 'hono';
import * as activityModel from '../models/activityModel.ts';

const getUserIdFromContext = (c: Context): number => {
  const jwtPayload = c.get('jwtPayload');
  if (!jwtPayload || !jwtPayload.userId) {
    throw new Error('Unauthorized: User ID not found in token');
  }
  return jwtPayload.userId;
};

export const getActivitiesByUser = async (c: Context) => {
  const userId = getUserIdFromContext(c);
  const activities = await activityModel.getActivitByUser(userId);
  return c.json(activities);
};

export const getActivityById = async (c: Context) => {
  const userId = getUserIdFromContext(c);
  const id = Number(c.req.param('id'));
  const activity = await activityModel.getActivityById(id, userId);
  if (!activity) return c.json({ error: 'Not found' }, 404);
  return c.json(activity);
};

export const createActivity = async (c: Context) => {
  const userId = getUserIdFromContext(c);
  console.log('[CREATE ACTIVITY] userId from token:', userId);

  const { name, date, mood = 'Neutral', completed = false } = await c.req.json();
  if (!name || !date) return c.json({ error: 'Missing fields' }, 400);

  await activityModel.checkAndResetMonthly();

  const activity = await activityModel.createActivity(
    userId,
    name,
    new Date(date),
    mood,
    completed
  );

  return c.json(activity, 201);
};

export const updateActivity = async (c: Context) => {
  const userId = getUserIdFromContext(c);
  const id = Number(c.req.param('id'));
  const { name, date, mood, completed } = await c.req.json();

  if (!name || !date || mood === undefined || completed === undefined) {
    return c.json({ error: 'Missing fields' }, 400);
  }

  const updated = await activityModel.updateActivity(
    id,
    userId,
    name,
    new Date(date),
    mood,
    completed
  );

  if (!updated) return c.json({ error: 'Not found' }, 404);
  return c.json(updated);
};

export const deleteActivity = async (c: Context) => {
  const userId = getUserIdFromContext(c);
  const id = Number(c.req.param('id'));

  const deleted = await activityModel.deleteActivity(id, userId);
  if (!deleted) return c.json({ error: 'Not found' }, 404);

  return c.json({ message: 'Deleted', deleted });
};
