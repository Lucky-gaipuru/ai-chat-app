import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [chatError, setChatError] = useState(null);

  // Fetch all chat history
  const fetchChats = useCallback(async () => {
    if (!user) return;
    try {
      setChatLoading(true);
      const { data } = await API.get('/chat/history');
      setChats(data);
    } catch (err) {
      setChatError(err.response?.data?.message || 'Failed to fetch chat history.');
    } finally {
      setChatLoading(false);
    }
  }, [user]);

  // Load chat list when user changes
  useEffect(() => {
    if (user) {
      fetchChats();
    } else {
      setChats([]);
      setCurrentChatId(null);
      setMessages([]);
    }
  }, [user, fetchChats]);

  // Fetch full details of a specific chat
  const fetchChatDetails = async (id) => {
    try {
      setChatLoading(true);
      setChatError(null);
      const { data } = await API.get(`/chat/${id}`);
      setCurrentChatId(data._id);
      setMessages(data.messages);
    } catch (err) {
      setChatError(err.response?.data?.message || 'Failed to load conversation.');
    } finally {
      setChatLoading(false);
    }
  };

  // Start a brand new empty chat conversation
  const createNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setChatError(null);
  };

  // Send message
  const sendMessageToAI = async (messageContent) => {
    if (!messageContent.trim()) return;

    // 1. Optimistically append user's message
    const tempUserMsg = {
      _id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, tempUserMsg]);
    setAiGenerating(true);
    setChatError(null);

    try {
      // 2. Post to API
      const { data } = await API.post('/chat/send', {
        chatId: currentChatId,
        message: messageContent,
      });

      // 3. Update active conversation details
      setCurrentChatId(data._id);
      setMessages(data.messages);
      
      // Refresh sidebar list to update title / sorting order
      await fetchChats();
    } catch (err) {
      setChatError(err.response?.data?.message || 'Failed to get response from Gemini.');
      // Remove the optimistic user message or keep it and show error? We'll keep it and show error bar
    } finally {
      setAiGenerating(false);
    }
  };

  // Delete specific chat
  const deleteChat = async (id) => {
    try {
      await API.delete(`/chat/${id}`);
      await fetchChats();
      // If deleted chat was the active one, start a new chat
      if (currentChatId === id) {
        createNewChat();
      }
    } catch (err) {
      setChatError(err.response?.data?.message || 'Failed to delete conversation.');
    }
  };

  // Clear all chats
  const clearAllChats = async () => {
    try {
      await API.delete('/chat');
      setChats([]);
      createNewChat();
    } catch (err) {
      setChatError(err.response?.data?.message || 'Failed to clear chat history.');
    }
  };

  const clearChatError = () => setChatError(null);

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        messages,
        chatLoading,
        aiGenerating,
        chatError,
        fetchChats,
        fetchChatDetails,
        createNewChat,
        sendMessageToAI,
        deleteChat,
        clearAllChats,
        clearChatError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
