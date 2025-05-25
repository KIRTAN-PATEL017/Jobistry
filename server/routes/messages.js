import express from 'express';
import { body } from 'express-validator';
import { 
  sendMessage, 
  getMessages, 
  getConversations,
  markAsRead 
} from '../controllers/messages.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', [
  authenticateToken,
  body('recipientId').notEmpty().withMessage('Recipient ID is required'),
  body('content').trim().notEmpty().withMessage('Message content is required')
], sendMessage);

router.get('/conversations', authenticateToken, getConversations);
router.get('/:conversationId', authenticateToken, getMessages);
router.post('/:messageId/read', authenticateToken, markAsRead);

export default router;