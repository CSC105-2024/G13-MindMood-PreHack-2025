import { Hono } from 'hono';
import { ActivityController } from '../controllers/activity.controller.js';

const activityRoutes = new Hono();

// Create new activity
activityRoutes.post('/', ActivityController.create);

// Get activities by date
activityRoutes.get('/', ActivityController.getByDate);

// Get all activities
activityRoutes.get('/all', ActivityController.getAll);

// Update activity
activityRoutes.put('/:id', ActivityController.update);

// Delete activity
activityRoutes.delete('/:id', ActivityController.delete);

// Submit day
activityRoutes.post('/submit', ActivityController.submitDay);

// Get submission by date
activityRoutes.get('/submission', ActivityController.getSubmission);

// Get all submissions
activityRoutes.get('/submissions/all', ActivityController.getAllSubmissions);

// Clear all activities for a specific day
activityRoutes.post('/clear-day', ActivityController.clearDay);

// Clear all activities and submissions for user
activityRoutes.post('/clear-all', ActivityController.clearAll);

export default activityRoutes;