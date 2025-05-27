import type { Context } from 'hono';
import { ActivityModel } from '../models/activity.model.ts';
import { SubmissionModel } from '../models/submission.model.ts';
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
        mood: mood || 'Neutral',
        week,
        day,
        userId,
      });

      return c.json({ message: 'Activity created successfully', activity }, 201);
    } catch (error) {
      console.error('Create activity error:', error);
      return c.json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
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
      return c.json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
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
      return c.json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
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

      if (!id || isNaN(id)) {
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
      return c.json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
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

      if (!id || isNaN(id)) {
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
      return c.json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
    }
  }

  // Submit day and generate mood summary
  static async submitDay(c: Context) {
    try {
      console.log('Submit day endpoint called');
      
      const userId = await verifyAuth(c);
      if (!userId) {
        console.log('Unauthorized user');
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const body = await c.req.json();
      console.log('Request body:', body);
      
      const { week, day } = body;

      if (week === undefined || day === undefined) {
        console.log('Missing week or day');
        return c.json({ error: 'Week and day are required' }, 400);
      }

      if (week < 1 || week > 4 || day < 1 || day > 7) {
        console.log('Invalid week or day values');
        return c.json({ error: 'Invalid week (1-4) or day (1-7)' }, 400);
      }

      // Check if this day has already been submitted
      const existingSubmission = await SubmissionModel.findByUserAndDate(userId, week, day);
      if (existingSubmission) {
        return c.json({ 
          error: 'This day has already been submitted',
          submission: existingSubmission
        }, 400);
      }

      console.log(`Getting activities for user ${userId}, week ${week}, day ${day}`);
      
      // Get all activities for the specified day
      const activities = await ActivityModel.findByUserAndDate(userId, week, day);
      console.log('Found activities:', activities.length);

      if (activities.length === 0) {
        console.log('No activities found');
        return c.json({ error: 'No activities found for this day' }, 400);
      }

      // Check if all activities are completed
      const incompleteActivities = activities.filter(activity => !activity.completed);
      console.log('Incomplete activities:', incompleteActivities.length);
      
      if (incompleteActivities.length > 0) {
        console.log('Some activities are incomplete');
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

      const summaryData = {
        week,
        day,
        totalActivities,
        moodCounts,
        moodPercentages,
        overallMood,
        overallMessage,
        activities: activities.map(a => ({
          name: a.name,
          mood: a.mood,
          completed: a.completed
        }))
      };

      // Save the submission to database
      const submission = await SubmissionModel.create({
        userId,
        week,
        day,
        overallMood,
        overallMessage,
        totalActivities,
        calmCount: moodCounts.calm,
        neutralCount: moodCounts.neutral,
        stressedCount: moodCounts.stressed,
        calmPercentage: moodPercentages.calm,
        neutralPercentage: moodPercentages.neutral,
        stressedPercentage: moodPercentages.stressed,
        activitiesData: JSON.stringify(summaryData.activities)
      });

      console.log('Submission saved:', submission);

      return c.json({ 
        message: 'Day submitted successfully',
        summary: summaryData
      });

    } catch (error) {
      console.error('Submit day error:', error);
      return c.json({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
    }
  }

  // Get submission by date
  static async getSubmission(c: Context) {
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

      const submission = await SubmissionModel.findByUserAndDate(userId, week, day);
      
      if (!submission) {
        return c.json({ error: 'No submission found for this day' }, 404);
      }

      return c.json({ submission });
    } catch (error) {
      console.error('Get submission error:', error);
      return c.json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
    }
  }

  // Get all submissions for user
  static async getAllSubmissions(c: Context) {
    try {
      const userId = await verifyAuth(c);
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const submissions = await SubmissionModel.findAllByUser(userId);
      return c.json({ submissions });
    } catch (error) {
      console.error('Get all submissions error:', error);
      return c.json({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
    }
  }
}