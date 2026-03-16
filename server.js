const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});

const connectDB = require('./config/db');

// Route Imports
const userRoutes = require('./routes/user.routes');
const summaryRoutes = require('./routes/summary.routes');

// Middleware Imports
const errorHandler = require('./middleware/error.middleware');
const logger = require('./middleware/logger.middleware');

dotenv.config();

// Connect to Database and Start Server
const startServer = async () => {
    try {
        await connectDB();

        const app = express();
        const PORT = process.env.PORT || 5001;

        // Global Middleware
        app.use(cors({
            origin: [
                'http://localhost:5173',
                'https://ai-summarize-frontend-eta.vercel.app',
                process.env.FRONTEND_URL
            ].filter(Boolean),
            credentials: true
        }));
        app.use(express.json());
        app.use(logger);

        // Core Routes
        app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
        app.use('/api/user', userRoutes);
        app.use('/api/summarize', summaryRoutes);

        // The error handler must be registered before any other error middleware and after all controllers
        Sentry.setupExpressErrorHandler(app);

        // Global Error Handling (Must be last)
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
