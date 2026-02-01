const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') }));
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function verify() {
    console.log("1. Creating Test User with Plain Text Password...");

    // Login as admin first (assuming 'Manish1212' / 'Manish1212' exists or I can hack it? 
    // Wait, I need a token to create users.
    // I will try to create a user directly via Mongoose in this script to bypass Auth middleware for creating, 
    // BUT the user's issue is likely the API route.

    // Actually, let's just use Mongoose directly to simulate what the Route does.
    // If the Route code is `new User({ password: password })`, then Mongoose is what matters.

    const mongoose = require('mongoose');
    const User = require('./models/User');

    // Connect to DB (using the URI from .env or hardcoded common one?)
    // I'll assume local or standard connection string, but the user is using Atlas.
    // I don't have the connection string handy in this context without reading .env
    // Let's read .env

    require('dotenv').config();
    if (!process.env.MONGO_URI) {
        console.error("No MONGO_URI found in .env");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const testUsername = "AutoTestUser_" + Date.now();
    const testPassword = "VisiblePassword123";

    try {
        // Simulate Route Logic
        const newUser = new User({
            username: testUsername,
            password: testPassword, // Plain
            role: 'user'
        });
        await newUser.save();
        console.log("User saved via Mongoose.");

        // Fetch back
        const fetchedUser = await User.findOne({ username: testUsername });
        console.log("\nFetched User:", fetchedUser.username);
        console.log("Password:", fetchedUser.password);

        if (fetchedUser.password === testPassword) {
            console.log("\nSUCCESS: Created Password is PLAIN TEXT.");
        } else {
            console.log("\nFAILURE: Created Password is NOT plain text.");
        }

        // 2. Test UPDATE
        console.log("\n2. Testing Update (Hash -> Plain)...");
        // Manually set to hash
        fetchedUser.password = "$2a$10$FakeHashForTesting1234567890";
        await fetchedUser.save();
        console.log("User reset to Hash.");

        // Simulate Route Update Logic
        // In route: user.password = password; await user.save();
        fetchedUser.password = "UpdatedPlainPass";
        await fetchedUser.save();

        const updatedUser = await User.findOne({ username: testUsername });
        console.log("Updated Password:", updatedUser.password);

        if (updatedUser.password === "UpdatedPlainPass") {
            console.log("\nSUCCESS: Updated Password is PLAIN TEXT.");
        } else {
            console.log("\nFAILURE: Updated Password is NOT plain text.");
        }

        // Cleanup
        await User.deleteOne({ _id: fetchedUser._id });
        console.log("Test user cleaned up.");

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
