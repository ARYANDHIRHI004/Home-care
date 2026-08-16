import Expense from '../models/expense.model.js';

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private/Admin
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1, createdAt: -1 });
        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private/Admin
export const createExpense = async (req, res) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json({
            success: true,
            data: expense
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private/Admin
export const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
