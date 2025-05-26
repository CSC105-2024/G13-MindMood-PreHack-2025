import type { Context } from 'hono';
import { ActivityModel } from '../models/activity.model.ts';
import { verifyAuth } from '../middlewares/auth.ts';

export class ActivityController {
  // Create new activity
  static async create(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const { name, mood, week, day } = await c.req.json();

      if (!name || week === undefined || day === undefined) {
        return c.json({ error: 'Name, week, and day are required' }, 400);
      }

      if (week < 1 || week > 4 || day < 1 || day > 7) {
        return c.json({ error: 'Invalid week (1-4) or day (1-7)' }, 400);
      }

      const validMoods = ['Calm', 'Neutral', 'Stressed'];
      if (mood && !validMoods.includes(mood)) {
        return c.json({ error: 'Invalid mood. Must be Calm, Neutral, or Stressed' }, 400);
      }

      const activity = await ActivityModel.create({
        name,
        mood,
        week,
        day,
        userId,
      });

      return c.json({ message: 'Activity created successfully', activity }, 201);
    } catch (error) {
      console.error('Create activity error:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  // Get activities by week and day
  static async getByDate(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const week = parseInt(c.req.query('week') || '1');
      const day = parseInt(c.req.query('day') || '1');

      if (week < 1 || week > 4 || day < 1 || day > 7) {
        return c.json({ error: 'Invalid week (1-4) or day (1-7)' }, 400);
      }

      const activities = await ActivityModel.findByUserAndDate(userId, week, day);
      return c.json({ activities });
    } catch (error) {
      console.error('Get activities error:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  // Get all activities for user
  static async getAll(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const activities = await ActivityModel.findAllByUser(userId);
      return c.json({ activities });
    } catch (error) {
      console.error('Get all activities error:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  // Update activity
  static async update(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const id = parseInt(c.req.param('id'));
      const { name, mood, completed } = await c.req.json();

      if (!id) {
        return c.json({ error: 'Invalid activity ID' }, 400);
      }

      // Check if activity exists and belongs to user
      const existingActivity = await ActivityModel.findById(id, userId);
      if (!existingActivity) {
        return c.json({ error: 'Activity not found' }, 404);
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (completed !== undefined) updateData.completed = completed;
      
      if (mood !== undefined) {
        const validMoods = ['Calm', 'Neutral', 'Stressed'];
        if (!validMoods.includes(mood)) {
          return c.json({ error: 'Invalid mood. Must be Calm, Neutral, or Stressed' }, 400);
        }
        updateData.mood = mood;
      }

      const activity = await ActivityModel.update(id, userId, updateData);
      return c.json({ message: 'Activity updated successfully', activity });
    } catch (error) {
      console.error('Update activity error:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  // Delete activity
  static async delete(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const id = parseInt(c.req.param('id'));

      if (!id) {
        return c.json({ error: 'Invalid activity ID' }, 400);
      }

      // Check if activity exists and belongs to user
      const existingActivity = await ActivityModel.findById(id, userId);
      if (!existingActivity) {
        return c.json({ error: 'Activity not found' }, 404);
      }

      await ActivityModel.delete(id, userId);
      return c.json({ message: 'Activity deleted successfully' });
    } catch (error) {
      console.error('Delete activity error:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }

  // Submit day and generate mood summary
  static async submitDay(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const { week, day } = await c.req.json();

      if (week === undefined || day === undefined) {
        return c.json({ error: 'Week and day are required' }, 400);
      }

      if (week < 1 || week > 4 || day < 1 || day > 7) {
        return c.json({ error: 'Invalid week (1-4) or day (1-7)' }, 400);
      }

      // Get all activities for the specified day
      const activities = await ActivityModel.findByUserAndDate(userId, week, day);

      if (activities.length === 0) {
        return c.json({ error: 'No activities found for this day' }, 400);
      }

      // Check if all activities are completed
      const incompleteActivities = activities.filter(activity => !activity.completed);
      if (incompleteActivities.length > 0) {
        return c.json({ 
          error: 'Please complete all activities before submitting',
          incompleteCount: incompleteActivities.length,
          totalCount: activities.length
        }, 400);
      }

      // Calculate mood summary
      const moodCounts = {
        calm: activities.filter(a => a.mood === 'Calm').length,
        neutral: activities.filter(a => a.mood === 'Neutral').length,
        stressed: activities.filter(a => a.mood === 'Stressed').length
      };

      const totalActivities = activities.length;
      const moodPercentages = {
        calm: Math.round((moodCounts.calm / totalActivities) * 100),
        neutral: Math.round((moodCounts.neutral / totalActivities) * 100),
        stressed: Math.round((moodCounts.stressed / totalActivities) * 100)
      };

      // Determine overall mood based on highest percentage
      let overallMood = 'Neutral';
      let overallMessage = 'You had a balanced day with mixed feelings.';

      if (moodPercentages.calm >= moodPercentages.neutral && moodPercentages.calm >= moodPercentages.stressed) {
        overallMood = 'Calm';
        overallMessage = 'Great job! You had a mostly calm and peaceful day.';
      } else if (moodPercentages.stressed >= moodPercentages.neutral && moodPercentages.stressed >= moodPercentages.calm) {
        overallMood = 'Stressed';
        overallMessage = 'It seems like you had a challenging day. Remember to take care of yourself.';
      }

      const summary = {
        week,
        day,
        totalActivities,
        moodCounts,
        moodPercentages,
        overallMood,
        overallMessage
      };

      return c.json({ 
        message: 'Day submitted successfully',
        summary 
      });

    } catch (error) {
      console.error('Submit day error:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }
}