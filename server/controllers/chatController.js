import { chats } from '../config/db.js';
import { generateGeminiResponse, generateChatTitle } from '../utils/gemini.js';

// Helper to generate unique string ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// @desc    Send a message to AI & get response
// @route   POST /api/chat/send
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;

    if (!message) {
      res.status(400);
      throw new Error('Please provide a message');
    }

    let chat;
    let isNewChat = !chatId;

    if (isNewChat) {
      // Create new conversation
      const title = await generateChatTitle(message);
      
      chat = {
        _id: generateId(),
        userId: req.user._id,
        title: title,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      chats.push(chat);
    } else {
      // Find the existing conversation
      chat = chats.find((c) => c._id === chatId && c.userId === req.user._id);

      if (!chat) {
        res.status(404);
        throw new Error('Chat conversation not found');
      }
    }

    // Convert existing message list to Gemini history format
    const history = chat.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Generate response from Gemini
    const aiResponseText = await generateGeminiResponse(history, message);

    // Append user prompt & AI response
    chat.messages.push({
      _id: generateId(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    chat.messages.push({
      _id: generateId(),
      role: 'assistant',
      content: aiResponseText,
      timestamp: new Date(),
    });

    chat.updatedAt = new Date();

    res.json(chat);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all chat conversations for logged-in user
// @route   GET /api/chat/history
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    // Filter chats for user, map lightweight list, sort by activity
    const userChats = chats
      .filter((c) => c.userId === req.user._id)
      .map((c) => ({
        _id: c._id,
        title: c.title,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json(userChats);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single chat conversation by ID with messages
// @route   GET /api/chat/:id
// @access  Private
export const getChatById = async (req, res, next) => {
  try {
    const chat = chats.find((c) => c._id === req.params.id && c.userId === req.user._id);

    if (!chat) {
      res.status(404);
      throw new Error('Chat conversation not found');
    }

    res.json(chat);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a single chat conversation by ID
// @route   DELETE /api/chat/:id
// @access  Private
export const deleteChatById = async (req, res, next) => {
  try {
    const chatIndex = chats.findIndex((c) => c._id === req.params.id && c.userId === req.user._id);

    if (chatIndex === -1) {
      res.status(404);
      throw new Error('Chat conversation not found or unauthorized');
    }

    chats.splice(chatIndex, 1);
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all chat conversations for user
// @route   DELETE /api/chat
// @access  Private
export const clearChatHistory = async (req, res, next) => {
  try {
    // Delete in-place for user's chats
    for (let i = chats.length - 1; i >= 0; i--) {
      if (chats[i].userId === req.user._id) {
        chats.splice(i, 1);
      }
    }
    res.json({ message: 'All chat conversations deleted successfully' });
  } catch (error) {
    next(error);
  }
};
