import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Navbar Header */}
      <Navbar onToggleSidebar={toggleSidebar} />

      {/* Main View Area */}
      <div className="dashboard-viewport">
        {/* Chat History Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Mobile Sidebar overlay */}
        {isSidebarOpen && (
          <div
            onClick={closeSidebar}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 8,
            }}
          />
        )}

        {/* Messaging Pane */}
        <ChatArea />
      </div>
    </div>
  );
};

export default Dashboard;
