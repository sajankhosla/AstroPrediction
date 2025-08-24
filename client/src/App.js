import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/LandingPage';
import PredictionForm from './components/PredictionForm';
import ResultsPage from './components/ResultsPage';
import DemoInsights from './components/DemoInsights';
import TestForm from './components/TestForm';
import DebugData from './components/DebugData';
import BirthStarTimeline from './components/BirthStarTimeline';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile';
import OAuthCallback from './components/Auth/OAuthCallback';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Redirect to dashboard after login
    window.location.href = '/dashboard';
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    // Redirect to dashboard after registration
    window.location.href = '/dashboard';
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>;
    }
    
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
    
    return children;
  };

  // Redirect to dashboard if user is logged in and tries to access auth
  const AuthRoute = ({ children }) => {
    if (isLoading) {
      return <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>;
    }
    
    if (user) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return children;
  };

  // Timeline wrapper component
  const TimelineWrapper = ({ user }) => {
    const navigate = useNavigate();
    return (
      <BirthStarTimeline 
        birthDate={user?.birthDate}
        birthPlace={user?.birthPlace}
        latitude={user?.latitude}
        longitude={user?.longitude}
        onClose={() => navigate('/dashboard')}
      />
    );
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  return (
    <Router>
      <div className="App min-h-screen bg-gray-950">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #4f46e5'
            },
          }}
        />
        
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<DemoInsights />} />
          <Route path="/test" element={<TestForm />} />
          <Route path="/debug" element={<DebugData />} />
          
          {/* Authentication routes */}
          <Route path="/auth" element={
            <AuthRoute>
              {authMode === 'login' ? (
                <Login 
                  onSwitchToRegister={() => setAuthMode('register')}
                  onLoginSuccess={handleLoginSuccess}
                />
              ) : (
                <Register 
                  onSwitchToLogin={() => setAuthMode('login')}
                  onRegisterSuccess={handleRegisterSuccess}
                />
              )}
            </AuthRoute>
          } />
          
          {/* OAuth callback route */}
          <Route path="/auth/callback" element={
            <OAuthCallback onLoginSuccess={handleLoginSuccess} />
          } />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard 
                user={user} 
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          } />
          <Route path="/prediction" element={
            <ProtectedRoute>
              <PredictionForm user={user} />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute>
              <ResultsPage user={user} />
            </ProtectedRoute>
          } />
          <Route path="/timeline" element={
            <ProtectedRoute>
              <TimelineWrapper user={user} />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile 
                user={user} 
                onLogout={handleLogout}
                onUpdateProfile={handleUpdateProfile}
              />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
