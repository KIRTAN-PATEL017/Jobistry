import express from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile, getFreelancers } from '../controllers/users.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile/:userId', getProfile);

router.put('/profile/:userId', authenticateToken, updateProfile);

router.get('/freelancers', getFreelancers);

export default router;