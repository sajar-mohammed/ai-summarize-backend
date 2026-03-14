const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
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
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true
        }));
        app.use(express.json());
        app.use(logger);

        // Core Routes
        app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

        // Debug Route
        app.get('/api/debug/routes', (req, res) => {
            const routes = [];
            app._router.stack.forEach((middleware) => {
                if (middleware.route) {
                    routes.push(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
                } else if (middleware.name === 'router') {
                    middleware.handle.stack.forEach((handler) => {
                        const route = handler.route;
                        if (route) {
                            routes.push(`${Object.keys(route.methods)} ${middleware.regexp} ${route.path}`);
                        }
                    });
                }
            });
            res.json(routes);
        });

        app.use('/api/user', userRoutes);
        app.use('/api/summarize', summaryRoutes);

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
