const { summarizeContent } = require('../services/gemini.service');
const { getHistory, saveSummary, deleteSummary: storageDeleteSummary } = require('../services/storage.service');
const { consumeCredit } = require('../services/user.service');
const { scrapeUrl } = require('../services/scraper.service');

const summarize = async (req, res, next) => {
    const { content, url, title, userId, tone } = req.body;

    if (!content && !url) {
        return res.status(400).json({ error: 'Content or URL is required' });
    }
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        // Check and consume credit
        await consumeCredit(userId);

        let textToSummarize = content;
        let finalTitle = title || 'Untitled Summary';

        if (url) {
            textToSummarize = await scrapeUrl(url);
            if (!title) {
                finalTitle = `Summary of ${new URL(url).hostname}`;
            }
        }

        const summary = await summarizeContent(textToSummarize, tone);
        const savedSummary = await saveSummary({
            userId,
            title: finalTitle,
            content: textToSummarize,
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

const deleteSummary = async (req, res, next) => {
    const { id } = req.params;
    try {
        await storageDeleteSummary(id);
        res.json({ message: 'Summary deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    summarize,
    getUserHistory,
    deleteSummary
};
