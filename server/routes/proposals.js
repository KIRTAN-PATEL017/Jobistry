import express from 'express';
import { body } from 'express-validator';
import { 
  createProposal, 
  getProposals, 
  getProposal,
  updateProposal,
  acceptProposal,
  rejectProposal 
} from '../controllers/proposals.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/:projectId', [
  authenticateToken,
  authorizeRole(['freelancer']),
  body('coverLetter').trim().notEmpty().withMessage('Cover letter is required'),
  body('bidAmount').isNumeric().withMessage('Bid amount must be a number'),
  body('estimatedDays').isNumeric().withMessage('Estimated days must be a number')
], createProposal);

router.get('/', authenticateToken, getProposals);
router.get('/:id', authenticateToken, getProposal);
router.put('/:id', authenticateToken, authorizeRole(['freelancer']), updateProposal);
router.post('/:id/accept', authenticateToken, authorizeRole(['client']), acceptProposal);
router.post('/:id/reject', authenticateToken, authorizeRole(['client']), rejectProposal);

export default router;