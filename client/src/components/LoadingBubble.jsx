import React from 'react';

const LoadingBubble = () => {
  return (
    <div className="message-row ai">
      <div className="message-bubble" style={{ display: 'inline-flex', padding: '0.75rem 1.25rem' }}>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingBubble;
