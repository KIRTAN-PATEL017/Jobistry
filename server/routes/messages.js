import express from 'express';
import { getConversations, getMessages } from '../controllers/messages.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', authenticateToken, getConversations);
router.get('/:conversationId', authenticateToken, getMessages);

export default router;