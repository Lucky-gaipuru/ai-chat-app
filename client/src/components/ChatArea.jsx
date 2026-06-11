import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import LoadingBubble from './LoadingBubble';

const ChatArea = () => {
  const {
    messages,
    aiGenerating,
    chatError,
    sendMessageToAI,
    clearChatError,
  } = useChat();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom of the chat list on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiGenerating]);

  // Adjust textarea height dynamically to fit multi-line queries
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || aiGenerating) return;

    sendMessageToAI(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    // Send message on Enter, but support newlines with Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (promptText) => {
    sendMessageToAI(promptText);
  };

  const suggestions = [
    {
      title: 'Explain Concepts',
      desc: 'Explain quantum computing in simple terms',
      prompt: 'Explain quantum computing in simple terms, using an analogy suitable for a high school student.',
    },
    {
      title: 'Write Code',
      desc: 'Write a JavaScript helper function',
      prompt: 'Write a JavaScript utility function to deep-clone an object, explaining how it works with nested structures.',
    },
    {
      title: 'Compose Emails',
      desc: 'Draft an email requesting sick leave',
      prompt: 'Draft a polite and professional email to my manager requesting a sick leave for 2 days due to a sudden cold.',
    },
    {
      title: 'Creative Ideas',
      desc: 'Brainstorm gifts for a designer',
      prompt: 'Give me 5 unique, creative gift ideas for a UX/UI designer friend who loves typography and clean aesthetics.',
    },
  ];

  return (
    <div className="chat-container">
      {/* Error Banner */}
      {chatError && (
        <div style={{ padding: '0.5rem 1.5rem', background: 'transparent', position: 'absolute', top: '10px', left: 0, right: 0, zIndex: 5 }}>
          <div className="alert alert-danger" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', margin: 0 }}>
            <span>{chatError}</span>
            <button
              onClick={clearChatError}
              style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', marginLeft: 'auto' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Messages Viewport */}
      {messages.length === 0 ? (
        <div className="empty-chat">
          <h2>How can I help you today?</h2>
          <p>Start a conversation with Google Gemini API. Ask a question, solve a bug, or write a draft.</p>
          <div className="suggestions-grid">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                className="suggestion-card"
                onClick={() => handleSuggestionClick(s.prompt)}
              >
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <MessageBubble key={msg._id} message={msg} />
          ))}
          {aiGenerating && <LoadingBubble />}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Bottom Message Input controls */}
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <textarea
            ref={textareaRef}
            rows="1"
            className="chat-input"
            placeholder="Ask AI anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={aiGenerating}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() || aiGenerating}
            aria-label="Send Message"
          >
            {aiGenerating ? (
              // Spinner
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="16" />
                <style>{`
                  @keyframes spin { 100% { transform: rotate(360deg); } }
                `}</style>
              </svg>
            ) : (
              // Send Paper Plane icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" x2="11" y1="2" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
