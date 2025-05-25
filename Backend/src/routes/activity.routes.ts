import { Hono } from 'hono';
import * as activityController from '../controllers/activity.controller.ts';

const router = new Hono();

router.get('/:id', activityController.getActivityById);
router.post('/', activityController.createActivity);
router.patch('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);

export default router;
