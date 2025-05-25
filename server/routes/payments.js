import express from 'express';
import { createPaymentIntent, confirmPayment, getPaymentStatus } from '../controllers/payments.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-payment-intent', authenticateToken, authorizeRole(['client']), createPaymentIntent);
router.post('/confirm-payment/:paymentId', authenticateToken, authorizeRole(['client']), confirmPayment);
router.get('/status/:paymentId', authenticateToken, getPaymentStatus);

export default router;