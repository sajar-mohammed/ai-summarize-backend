const { summarizeContent } = require('../services/gemini.service');
const { getHistory, saveSummary } = require('../services/storage.service');
const { consumeCredit } = require('../services/user.service');

const summarize = async (req, res, next) => {
    const { content, title, userId } = req.body;

    if (!content || !userId) {
        return res.status(400).json({ error: 'Content and userId are required' });
    }

    try {
        // Check and consume credit
        await consumeCredit(userId);

        const summary = await summarizeContent(content);
        const savedSummary = await saveSummary({
            userId,
            title: title || 'Untitled Summary',
            content,
            summary
        });

        res.json(savedSummary);
    } catch (error) {
        next(error);
    }
};

const getUserHistory = async (req, res, next) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const history = await getHistory(userId);
        res.json(history);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    summarize,
    getUserHistory
};
