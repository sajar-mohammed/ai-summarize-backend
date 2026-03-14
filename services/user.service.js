const User = require('../models/user.model');

const getOrCreateUser = async (userData) => {
    const { userId } = userData;
    let user = await User.findOne({ userId });

    if (!user) {
        user = new User({
            userId,
            email: userData.email,
            displayName: userData.displayName,
            credits: 20,
            lastResetDate: new Date()
        });
        await user.save();
    } else {
        // Check for credit reset
        const now = new Date();
        const lastReset = new Date(user.lastResetDate);

        // Reset if it's a new day (UTC)
        if (now.getUTCDate() !== lastReset.getUTCDate() ||
            now.getUTCMonth() !== lastReset.getUTCMonth() ||
            now.getUTCFullYear() !== lastReset.getUTCFullYear()) {

            user.credits = 20;
            user.lastResetDate = now;
            await user.save();
        }
    }
    return user;
};

const consumeCredit = async (userId) => {
    const user = await User.findOne({ userId });
    if (!user || user.credits <= 0) {
        throw new Error('Insufficient credits');
    }
    user.credits -= 1;
    return await user.save();
};

module.exports = { getOrCreateUser, consumeCredit };
