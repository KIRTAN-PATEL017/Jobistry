import express from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile, getFreelancers } from '../controllers/users.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', [
  authenticateToken,
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('bio').optional().trim(),
  body('skills').optional().isArray(),
  body('hourlyRate').optional().isNumeric(),
  body('location').optional().trim()
], updateProfile);

router.get('/freelancers', getFreelancers);

export default router;