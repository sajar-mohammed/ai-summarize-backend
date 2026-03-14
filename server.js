const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { summarizeContent } = require('./services/gemini.service');
const { getHistory, saveSummary, getSummaryCount } = require('./services/storage.service');
const { getOrCreateUser, consumeCredit } = require('./services/user.service');


dotenv.config();

// Connect to Database and Start Server
const startServer = async () => {
    try {
        await connectDB();
        const app = express();
        const PORT = process.env.PORT || 5001;

        app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true
        }));
        app.use(express.json());

        app.get('/api/health', (req, res) => {
            res.json({ status: 'ok' });
        });

        app.post('/api/user/status', async (req, res) => {
            const { userId, email, displayName } = req.body;
            if (!userId) return res.status(400).json({ error: 'userId required' });

            try {
                const user = await getOrCreateUser({ userId, email, displayName });
                const summaryCount = await getSummaryCount(userId);
                res.json({ ...user.toObject(), summaryCount });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.post('/api/summarize', async (req, res) => {
            const { content, title, userId } = req.body;
            console.log('--- New Summarize Request ---');
            console.log('User ID:', userId);

            if (!content || !userId) {
                console.error('Missing content or userId:', { content: !!content, userId: !!userId });
                return res.status(400).json({ error: 'Content and userId are required' });
            }

            try {
                // Check and consume credit
                await consumeCredit(userId);

                const summary = await summarizeContent(content);
                console.log('Summary generated successfully');
                const savedSummary = await saveSummary({
                    userId,
                    title: title || 'Untitled Summary',
                    content,
                    summary
                });
                console.log('Saved to DB with ID:', savedSummary._id);
                res.json(savedSummary);
            } catch (error) {
                console.error('Summarize Error:', error.message);
                res.status(500).json({ error: error.message });
            }
        });

        app.get('/api/history', async (req, res) => {
            const { userId } = req.query;
            if (!userId) {
                return res.status(400).json({ error: 'userId is required' });
            }
            try {
                const history = await getHistory(userId);
                res.json(history);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
