const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Expense = require('../models/Expense');
const { auth, adminOnly } = require('../middleware/authMiddleware');

// @route   GET api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/users
// @desc    Create a new user
// @access  Private/Admin
router.post('/', auth, adminOnly, async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            username,
            password: password, // Plain text as requested
            role: role || 'user'
        });

        const savedUser = await newUser.save();

        // Return user without password
        const userToReturn = {
            id: savedUser.id,
            username: savedUser.username,
            role: savedUser.role,
            createdAt: savedUser.createdAt
        };

        res.json(userToReturn);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT api/users/:id
// @desc    Update a user
// @access  Private/Admin
router.put('/:id', auth, adminOnly, async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (role) user.role = role;
        if (password && password.trim() !== '') {
            user.password = password; // Plain text as requested
        }

        const updatedUser = await user.save();

        res.json({
            id: updatedUser.id,
            username: updatedUser.username,
            role: updatedUser.role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting the last admin or self (optional safety)
        if (user.role === 'admin' && user.username === 'Manish1212') {
            return res.status(400).json({ message: 'Cannot delete the main admin account' });
        }

        // Delete user's expenses first
        await Expense.deleteMany({ user: req.params.id });

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User and associated expenses deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
