import express from 'express';
import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense
} from '../controllers/expense.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);

router
    .route('/')
    .get(getExpenses)
    .post(createExpense);

router
    .route('/:id')
    .put(updateExpense)
    .delete(deleteExpense);

export default router;
