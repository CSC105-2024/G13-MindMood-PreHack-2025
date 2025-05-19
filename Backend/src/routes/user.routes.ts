import { Hono } from 'hono';
import { signup, login, forgotPassword, resetPassword , getProfile , updateProfile , verifyToken } from '../controllers/user.controller.ts';
 
 
const router = new Hono();
 
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', getProfile);
router.put('/update-profile', updateProfile);
router.get('/verify-token', verifyToken);
export default router;