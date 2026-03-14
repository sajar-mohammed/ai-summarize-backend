const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Summary = require('./models/summary.model');
const User = require('./models/user.model');

dotenv.config();

const diagnoseDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Database Diagnostic ---');

        // Check User Collection
        const allUsers = await User.find({});
        console.log(`Total Users: ${allUsers.length}`);
        if (allUsers.length > 0) {
            console.log('User Credits Status:');
            const userTable = allUsers.map(u => ({
                ID: u.userId,
                Name: u.displayName || 'N/A',
                Credits: u.credits,
                LastReset: u.lastResetDate
            }));
            console.table(userTable);
        } else {
            console.log('No users found in "users" collection yet.');
        }

        // Check Summary Collection
        const allDocs = await Summary.find({});
        console.log(`\nTotal Summaries: ${allDocs.length}`);

        const userStats = {};
        allDocs.forEach(doc => {
            const uid = doc.userId || 'MISSING_UID';
            userStats[uid] = (userStats[uid] || 0) + 1;
        });

        console.log('Summaries per User:');
        console.table(userStats);

        process.exit(0);
    } catch (error) {
        console.error('Diagnostic error:', error);
        process.exit(1);
    }
};

diagnoseDB();
