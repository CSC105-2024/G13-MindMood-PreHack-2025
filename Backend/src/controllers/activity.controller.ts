import type { Context } from 'hono';
import * as activityModel from '../models/activityModel.ts';
 
const getUserIdFromContext = (c: Context): number => {
  const jwtPayload = c.get('jwtPayload');
  if (!jwtPayload || !jwtPayload.userId) {
    // For testing purposes, return a default user ID
    // In production, you should have JWT middleware that sets jwtPayload
    console.log('Warning: No JWT payload found, using test user ID');
    return 1; // Default test user ID
  }
  return jwtPayload.userId;
};
 
export const getActivitiesByUser = async (c: Context) => {
  try {
    const userId = getUserIdFromContext(c);
    console.log('[GET ACTIVITIES] userId:', userId);
    const activities = await activityModel.getActivitiesByUser(userId);
    return c.json(activities);
  } catch (error) {
    console.error('[GET ACTIVITIES] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};
 
export const getActivityById = async (c: Context) => {
  try {
    const userId = getUserIdFromContext(c);
    const id = Number(c.req.param('id'));
    console.log('[GET ACTIVITY] userId:', userId, 'activityId:', id);
   
    const activity = await activityModel.getActivityById(id, userId);
    if (!activity) return c.json({ error: 'Not found' }, 404);
    return c.json(activity);
  } catch (error) {
    console.error('[GET ACTIVITY] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};
 
export const createActivity = async (c: Context) => {
  try {
    const userId = getUserIdFromContext(c);
    console.log('[CREATE ACTIVITY] userId from token:', userId);
 
    const body = await c.req.json();
    console.log('[CREATE ACTIVITY] Request body:', body);
   
    const { name, date, mood = 'Neutral', completed = false } = body;
   
    if (!name || !date) {
      console.log('[CREATE ACTIVITY] Missing fields:', { name, date });
      return c.json({ error: 'Missing fields: name and date are required' }, 400);
    }
 
    await activityModel.checkAndResetMonthly();
 
    const activity = await activityModel.createActivity(
      userId,
      name,
      new Date(date),
      mood,
      completed
    );
 
    console.log('[CREATE ACTIVITY] Created activity:', activity);
    return c.json(activity, 201);
  } catch (error) {
    console.error('[CREATE ACTIVITY] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Internal server error', details: errorMessage }, 500);
  }
};
 
export const updateActivity = async (c: Context) => {
  try {
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
  } catch (error) {
    console.error('[UPDATE ACTIVITY] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};
 
export const deleteActivity = async (c: Context) => {
  try {
    const userId = getUserIdFromContext(c);
    const id = Number(c.req.param('id'));
 
    const deleted = await activityModel.deleteActivity(id, userId);
    if (!deleted) return c.json({ error: 'Not found' }, 404);
 
    return c.json({ message: 'Deleted', deleted });
  } catch (error) {
    console.error('[DELETE ACTIVITY] Error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
};