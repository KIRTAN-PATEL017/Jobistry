import express from 'express';
import { body } from 'express-validator';
import { 
  createProposal, 
  getUserProposals, 
  getProposal,
  updateProposal
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

router.get('/:userId', authenticateToken, authorizeRole(['freelancer']), getUserProposals);
router.get('/:proposalId', authenticateToken, getProposal);
router.put('/:id', authenticateToken, authorizeRole(['freelancer']), updateProposal);


export default router;