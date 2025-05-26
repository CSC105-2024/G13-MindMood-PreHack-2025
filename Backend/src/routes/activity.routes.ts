import { Hono } from 'hono';
import { ActivityController } from '../controllers/activity.controller.js';

const activityRoutes = new Hono();

// POST /activities - Create new activity
activityRoutes.post('/', ActivityController.create);

// GET /activities - Get activities by week and day
activityRoutes.get('/', ActivityController.getByDate);

// GET /activities/all - Get all activities for user
activityRoutes.get('/all', ActivityController.getAll);

// PUT /activities/:id - Update activity
activityRoutes.put('/:id', ActivityController.update);

// DELETE /activities/:id - Delete activity
activityRoutes.delete('/:id', ActivityController.delete);

export default activityRoutes;