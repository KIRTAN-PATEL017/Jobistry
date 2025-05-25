import express from 'express';
import { body } from 'express-validator';
import { 
  createProject, 
  getProjects, 
  getProject, 
  updateProject,
  deleteProject 
} from '../controllers/projects.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', [
  authenticateToken,
  authorizeRole(['client']),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('skills').isArray().withMessage('Skills must be an array'),
  body('budget.min').isNumeric().withMessage('Minimum budget must be a number'),
  body('budget.max').isNumeric().withMessage('Maximum budget must be a number'),
  body('deadline').isISO8601().withMessage('Invalid deadline date')
], createProject);

router.get('/', authenticateToken, getProjects);
router.get('/:id', authenticateToken, getProject);
router.put('/:id', authenticateToken, authorizeRole(['client']), updateProject);
router.delete('/:id', authenticateToken, authorizeRole(['client']), deleteProject);

export default router;