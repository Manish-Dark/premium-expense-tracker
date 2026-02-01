require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB Connected successfully');
        seedAdmin();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Seed Admin User
const seedAdmin = async () => {
    try {
        // Check for admin with case-insensitive search to avoid duplicates like 'Manish1212' vs 'manish1212'
        const adminExists = await User.findOne({ username: { $regex: new RegExp("^manish1212$", "i") } });
        const adminPassword = 'manish@2004'; // Plain Text as requested

        if (!adminExists) {
            const adminUser = new User({
                username: 'manish1212', // Lowercase as requested
                password: adminPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Admin user seeded successfully: manish1212');
        } else {
            // Force update to ensure credentials match exactly what the user wants
            adminExists.username = 'manish1212';
            adminExists.password = adminPassword;
            adminExists.role = 'admin';
            await adminExists.save();
            console.log('Admin user synced successfully: manish1212');

            // Optional: Delete other admins if "not create the other one" means "only one admin"
            // But for now, safe to just ensure THIS one is correct.
        }

    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

// Test Route
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});

// Routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const expenseRoutes = require('./routes/expenses');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/expenses', expenseRoutes);

// Export for Vercel
module.exports = app;

// Start Server if local
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
