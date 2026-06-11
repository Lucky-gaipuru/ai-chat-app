import React from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const {
    chats,
    currentChatId,
    fetchChatDetails,
    createNewChat,
    deleteChat,
    clearAllChats,
  } = useChat();
  const navigate = useNavigate();

  const handleSelectChat = (id) => {
    fetchChatDetails(id);
    if (onClose) onClose(); // close mobile drawer
  };

  const handleNewChat = () => {
    createNewChat();
    if (onClose) onClose();
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all your chat conversations? This cannot be undone.')) {
      clearAllChats();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button onClick={handleNewChat} className="btn btn-primary" style={{ width: '100%' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="sidebar-history">
        {chats.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem', textAlign: 'center' }}>
            No chat history yet
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`history-item ${currentChatId === chat._id ? 'active' : ''}`}
              onClick={() => handleSelectChat(chat._id)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="chat-title-span">{chat.title || 'Untitled Chat'}</span>
              <button
                className="delete-chat-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Delete this conversation?')) {
                    deleteChat(chat._id);
                  }
                }}
                aria-label="Delete Chat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        {chats.length > 0 && (
          <button onClick={handleClearHistory} className="btn btn-danger" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>
            Clear All History
          </button>
        )}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0.5rem',
              borderTop: '1px solid var(--card-border)',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/profile')}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: 'white',
                fontSize: '0.85rem',
                textTransform: 'uppercase'
              }}
            >
              {user.username ? user.username.substring(0, 2) : 'U'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user.username}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
