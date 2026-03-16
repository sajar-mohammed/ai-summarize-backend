# AI Summarizer - Backend 🧠

The backend API for the AI Summarizer application, powered by Node.js, Express, and Google's Gemini AI. This service handles web scraping, document parsing, and AI-driven content summarization.

## ✨ Features

- **Gemini AI Integration**: Uses Google's generative AI to produce high-quality, configurable summaries.
- **Web Scraping**: Built-in scraper to extract meaningful text from URLs.
- **Document Parsing**: Support for parsing PDF files and extracting text for summarization.
- **User Management**: Simple user profiling and history tracking.
- **Error Tracking**: Full integration with Sentry for server-side error monitoring and profiling.
- **3-Layer Architecture**: Clean codebase organized into Controllers, Services, and Models for scalability.

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **AI Engine**: [Google Gemini Pro](https://ai.google.dev/)
- **Scraping**: [Cheerio](https://cheerio.js.org/)
- **Monitoring**: [Sentry](https://sentry.io/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sajar-mohammed/ai-summarize-backend.git
   cd ai-summarize-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your credentials:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   SENTRY_DSN=your_sentry_backend_dsn
   FRONTEND_URL=your_deployed_frontend_url
   ```

4. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🌐 Deployment

This service is optimized for deployment on **Render**.

- **Environment Setup**: Ensure all variables from `.env` are set in the Render Dashboard.
- **Health Check**: The API includes a `/api/health` endpoint for monitoring service status.

## 🔒 Security

- **CORS**: Configured to allow requests from specific frontend origins.
- **Error Handling**: Centralized middleware to handle and log errors globally.

---
Built with ❤️ by Sajar Mohammed
