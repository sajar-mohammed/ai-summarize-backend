const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Summary = require('./models/summary.model');

dotenv.config();

const cleanupDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Database Cleanup ---');

        // Delete all summaries where userId is missing, null, or undefined
        const result = await Summary.deleteMany({
            $or: [
                { userId: { $exists: false } },
                { userId: null },
                { userId: '' }
            ]
        });

        console.log(`Successfully deleted ${result.deletedCount} orphaned summaries.`);
        process.exit(0);
    } catch (error) {
        console.error('Cleanup error:', error);
        process.exit(1);
    }
};

cleanupDB();
