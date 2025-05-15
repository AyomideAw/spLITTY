import express from 'express';
import { parseExpense } from '../controllers/expenseController.js';

const router = express.Router();

// ✅ this must be POST
router.post('/parse', parseExpense);

export default router;
