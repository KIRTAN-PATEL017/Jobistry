import express from 'express';
import { getProfile, updateProfile, getFreelancers } from '../controllers/users.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile/:userId', getProfile);

router.put('/profile/:userId', authenticateToken, updateProfile);

router.get('/freelancers', getFreelancers);

export default router;