const { GoogleGenerativeAI } = require("@google/generative-ai");

const summarizeContent = async (content) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using 'gemini-flash-latest' - found to be working via diagnostic script
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Please provide a concise and clear summary of the following content:
        
        ${content}
        
        Format the summary using markdown.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error Detail:", error);
        // Fallback or rethrow
        throw new Error(error.message || "Failed to summarize content");
    }
};


module.exports = { summarizeContent };
