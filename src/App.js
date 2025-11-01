import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import ChatroomPage from './components/ChatroomPage';
import GalleryPage from './components/GalleryPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="h-screen flex flex-col bg-secondary">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || user.email}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <h2 className="font-semibold text-text">
              {user?.displayName || user?.email || 'User'}
            </h2>
            <p className="text-xs text-gray-500">Decentralized Chat</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'chat' ? 'gallery' : 'chat')}
            className={`px-4 py-1.5 text-sm rounded-lg transition ${
              activeTab === 'gallery'
                ? 'bg-primary text-white'
                : 'text-text hover:bg-secondary'
            }`}
          >
            {activeTab === 'chat' ? 'View Gallery' : 'View Chat'}
          </button>
          <button
            onClick={logout}
            className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? (
          <ChatroomPage activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
          <GalleryPage />
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

