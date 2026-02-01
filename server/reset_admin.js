const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function resetAdmin() {
    if (!process.env.MONGO_URI) {
        console.error("No MONGO_URI found in .env");
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    try {
        const adminUsername = "Manish1212";
        let admin = await User.findOne({ username: adminUsername });

        if (!admin) {
            console.log(`Admin user '${adminUsername}' not found. Creating it...`);
            admin = new User({
                username: adminUsername,
                password: "123", // Temporary Plain Text Password
                role: "admin"
            });
            await admin.save();
            console.log("Admin created with password: '123'");
        } else {
            console.log(`Admin found. Current password value: '${admin.password}'`);
            admin.password = "123"; // Reset to simple plain text
            await admin.save();
            console.log("Admin password RESET to: '123'");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

resetAdmin();
