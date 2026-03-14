const Summary = require('../models/summary.model');

const getHistory = async (userId) => {
    try {
        if (!userId) return [];
        return await Summary.find({ userId }).sort({ timestamp: -1 });
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
};

const saveSummary = async (summaryData) => {
    try {
        const newSummary = new Summary(summaryData);
        return await newSummary.save();
    } catch (error) {
        console.error('Error saving summary detail:', error);
        throw error;
    }
};

const getSummaryCount = async (userId) => {
    try {
        if (!userId) return 0;
        return await Summary.countDocuments({ userId });
    } catch (error) {
        console.error('Error counting summaries:', error);
        return 0;
    }
};

module.exports = { getHistory, saveSummary, getSummaryCount };
