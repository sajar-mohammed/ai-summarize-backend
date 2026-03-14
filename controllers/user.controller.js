const { getOrCreateUser, consumeCredit } = require('../services/user.service');
const { getSummaryCount } = require('../services/storage.service');

const getUserStatus = async (req, res, next) => {
    const { userId, email, displayName } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'userId required' });
    }

    try {
        const user = await getOrCreateUser({ userId, email, displayName });
        const summaryCount = await getSummaryCount(userId);
        res.json({ ...user.toObject(), summaryCount });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserStatus
};
