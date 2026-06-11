import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generates a response from Gemini given the conversation history.
 * @param {Array} history - Array of previous messages in { role, content } format.
 * @param {String} newMessage - The latest message content from the user.
 * @returns {Promise<String>} The generated response text.
 */
export const generateGeminiResponse = async (history, newMessage) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Default to gemini-1.5-flash or retrieve from env
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    // Format history for Gemini chat API
    // Gemini expects: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Start a chat session with the conversation history
    const chat = model.startChat({
      history: formattedHistory,
    });

    // Send the new message and get the response
    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(error.message || 'Failed to generate response from Gemini API');
  }
};

/**
 * Generates a short, descriptive title for a chat based on the first user message.
 * @param {String} firstMessage - The first prompt in the chat.
 * @returns {Promise<String>} The generated title.
 */
export const generateChatTitle = async (firstMessage) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return 'New Chat';
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate a very short, concise title (max 4-5 words) for a conversation that starts with the following query. Do not use quotes or punctuation in the output: "${firstMessage}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const title = response.text().trim();
    
    return title || 'New Chat';
  } catch (error) {
    console.error('Error generating chat title:', error);
    return 'New Chat';
  }
};
