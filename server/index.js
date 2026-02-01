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
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected successfully');
        seedAdmin();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Seed Admin User
const seedAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash('Manish@2004', 10);

        if (!adminExists) {
            const adminUser = new User({
                username: 'Manish1212',
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Admin user seeded successfully');
        } else {
            // Always update password and role to ensure access
            adminExists.password = hashedPassword;
            adminExists.role = 'admin';
            await adminExists.save();
            console.log('Admin user updated (password reset) successfully');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const expenseRoutes = require('./routes/expenses');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/expenses', expenseRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
