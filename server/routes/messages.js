import express from 'express';
import { 
  getMessagesByContract, 
} from '../controllers/messages.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:contractId', authenticateToken, getMessagesByContract);

export default router;