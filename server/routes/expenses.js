const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { auth } = require('../middleware/authMiddleware');

// @route   GET api/expenses
// @desc    Get all expenses for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

        // Transform _id to id for frontend compatibility
        const formattedExpenses = expenses.map(expense => ({
            id: expense._id,
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            paymentMethod: expense.paymentMethod,
            username: expense.username
        }));

        res.json(formattedExpenses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', auth, async (req, res) => {
    const { description, amount, category, date, paymentMethod } = req.body;

    if (!description || !amount || !category) {
        return res.status(400).json({ message: 'Please provide description, amount and category' });
    }

    try {
        const newExpense = new Expense({
            description,
            amount,
            category,
            date: date || Date.now(),
            paymentMethod: paymentMethod || 'Cash',
            user: req.user.id,
            username: req.user.username // Add username from token
        });

        const expense = await newExpense.save();

        res.json({
            id: expense._id,
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            paymentMethod: expense.paymentMethod,
            username: expense.username
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT api/expenses/:id
// @desc    Update expense
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { description, amount, category, date, paymentMethod } = req.body;

    console.log('--- PUT /api/expenses/:id Request ---');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('User:', req.user.id);

    try {
        const expenseFields = {};
        if (description !== undefined) expenseFields.description = description;
        if (amount !== undefined) expenseFields.amount = amount;
        if (category !== undefined) expenseFields.category = category;
        if (date !== undefined) expenseFields.date = date;
        if (paymentMethod !== undefined) expenseFields.paymentMethod = paymentMethod;

        console.log('Constructed Fields:', expenseFields);

        // Construct query: Admin can update by ID only, User must match ID and User ID
        const query = { _id: req.params.id };
        if (req.user.role !== 'admin') {
            query.user = req.user.id;
        }

        const expense = await Expense.findOneAndUpdate(
            query,
            { $set: expenseFields },
            { new: true }
        );

        if (!expense) {
            console.log('Update failed: Expense not found or user not authorized');
            return res.status(404).json({ message: 'Expense not found or not authorized' });
        }

        console.log('Update Result:', expense);

        res.json({
            id: expense._id,
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            paymentMethod: expense.paymentMethod,
            username: expense.username
        });
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE api/expenses/:id
// @desc    Delete expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Make sure user owns expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Expense.findByIdAndDelete(req.params.id);

        res.json({ message: 'Expense removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
