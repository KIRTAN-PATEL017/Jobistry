import express from 'express';
import { body } from 'express-validator';
import { 
  createProject, 
  getProjects, 
  getProject, 
  sendProposal,
  browseProjects 
} from '../controllers/projects.js';
import { updateProposalStatus } from '../controllers/proposals.js';

import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', [authenticateToken, authorizeRole(['client'])], createProject);

router.get('/client/:userId', authenticateToken, getProjects);
router.get('/:projectId', authenticateToken, getProject);
router.post('/browse', authenticateToken, browseProjects);
router.post('/:projectId/proposals', [authenticateToken, authorizeRole(['freelancer'])], sendProposal);
router.patch('/:projectId/proposals/:proposalId/:action', updateProposalStatus);


export default router;