import React from 'react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Format the timestamp
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper to parse message text and render code blocks or formatted text blocks
  const renderMessageContent = (text) => {
    if (!text) return null;
    
    // Split by markdown code block marker: ```
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : '';
        const code = match ? match[2] : part.slice(3, -3).trim();

        return (
          <div key={index} style={{ margin: '1rem 0', position: 'relative' }}>
            {language && (
              <span style={{
                position: 'absolute',
                top: '-10px',
                right: '10px',
                background: 'var(--primary-color)',
                color: 'white',
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                textTransform: 'uppercase'
              }}>
                {language}
              </span>
            )}
            <pre style={{
              background: 'rgba(0, 0, 0, 0.4)',
              color: '#38bdf8',
              padding: '1rem',
              borderRadius: '8px',
              overflowX: 'auto',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              fontSize: '0.9rem',
              border: '1px solid var(--card-border)',
              lineHeight: '1.4'
            }}>
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Render standard paragraph blocks, styling inline code blocks: `code`
      const inlineParts = part.split(/(`[^`\n]+`)/g);
      return (
        <span key={index}>
          {inlineParts.map((subPart, subIndex) => {
            if (subPart.startsWith('`') && subPart.endsWith('`')) {
              return (
                <code key={subIndex} style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  color: 'var(--accent-color)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.9em'
                }}>
                  {subPart.slice(1, -1)}
                </code>
              );
            }
            
            // Format standard line breaks
            return subPart.split('\n').map((line, lineIdx, array) => (
              <React.Fragment key={lineIdx}>
                {line}
                {lineIdx < array.length - 1 && <br />}
              </React.Fragment>
            ));
          })}
        </span>
      );
    });
  };

  return (
    <div className={`message-row ${isUser ? 'user' : 'ai'}`}>
      <div className="message-bubble">
        <div className="message-text">
          {renderMessageContent(message.content)}
        </div>
        <span className="message-meta">
          {formatTime(message.timestamp || message.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
