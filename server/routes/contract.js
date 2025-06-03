
import express from 'express';
import { getContracts } from '../controllers/contract.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/',authenticateToken ,getContracts);

export default router;
