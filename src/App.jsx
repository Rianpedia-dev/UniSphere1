import React, { useState, useEffect, Component } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Loader, AlertCircle } from 'lucide-react';
import Home from './pages/Home/Home.jsx';
import ChatPage from './pages/Chat/ChatPage.jsx';
import ForumPage from './pages/Forum/ForumPage.jsx';
import AdminPage from './pages/Admin/AdminPage.jsx';
import ComplaintPage from './pages/Complaint/ComplaintPage.jsx';
import Login from './components/Auth/Login.jsx';
import Profile from './components/Auth/Profile.jsx';
import Navbar from './components/common/Navbar.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import './index.css';

// Error Boundary untuk seluruh aplikasi
class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="unisphere-app-error">
          <div className="unisphere-error-container">
            <div className="unisphere-error-icon-wrapper">
              <AlertCircle size={64} className="unisphere-error-icon" />
              <div className="unisphere-error-pulse"></div>
            </div>
            <h2 className="unisphere-error-title">Something went wrong</h2>
            <p className="unisphere-error-message">An unexpected error has occurred. Please refresh the page to continue.</p>
            <div className="unisphere-error-actions">
              <button 
                className="unisphere-btn unisphere-btn-primary"
                onClick={() => window.location.reload()}
              >
                🔄 Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function LoadingScreen() {
  // Static loading screen with no dynamic elements to prevent DOM issues
  return (
    <div className="unisphere-loading-container">
      <div className="unisphere-loading-content">
        <div className="unisphere-loading-spinner">
          <Loader size={48} />
          <div className="unisphere-loading-ring"></div>
          <div className="unisphere-loading-ring unisphere-ring-2"></div>
        </div>
        <h2 className="unisphere-loading-text">
          Loading UniSphere
        </h2>
        <p className="unisphere-loading-subtitle">Initializing your mental health companion</p>
      </div>
      {/* Fixed particles with static positions to prevent DOM manipulation issues */}
      <div className="unisphere-loading-bg">
        <div className="unisphere-loading-particle" style={{left: '10%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '20%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '30%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '40%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '50%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '60%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '70%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '80%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '90%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '15%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '25%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '35%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '45%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '55%'}}></div>
        <div className="unisphere-loading-particle" style={{left: '65%'}}></div>
      </div>
    </div>
  );
}
function ErrorScreen({ error }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="unisphere-app-error">
      <div className="unisphere-error-container">
        <div className="unisphere-error-icon-wrapper">
          <AlertCircle size={64} className="unisphere-error-icon" />
          <div className="unisphere-error-pulse"></div>
        </div>
        
        <h2 className="unisphere-error-title">Oops! Something went wrong</h2>
        <p className="unisphere-error-message">{error.message}</p>
        
        <div className="unisphere-error-actions">
          <button 
            className="unisphere-btn unisphere-btn-primary"
            onClick={() => window.location.reload()}
          >
            🔄 Reload Page
          </button>
          <button 
            className="unisphere-btn unisphere-btn-outline"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '🔼 Hide' : '🔽 Show'} Details
          </button>
        </div>

        {showDetails && (
          <div className="unisphere-error-details">
            <h3>Configuration Help</h3>
            <div className="unisphere-error-help">
              <p>🔧 Please make sure you have properly configured your Supabase environment variables.</p>
              <div className="unisphere-code-block">
                <code>
                  VITE_SUPABASE_URL=your_supabase_url<br/>
                  VITE_SUPABASE_ANON_KEY=your_anon_key
                </code>
              </div>
              <p>💡 Create a <strong>.env</strong> file in your project root with these variables.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const { user, loading, error, signOut } = useAuth();
  const location = useLocation();
  const [pageTransition, setPageTransition] = useState(false);

  // useEffect(() => {
  //   setPageTransition(true);
  //   const timer = setTimeout(() => setPageTransition(false), 300);
  //   return () => clearTimeout(timer);
  // }, [location]);

  // Handle loading state more gracefully to prevent rapid state changes
  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <AppErrorBoundary>
      <div className="unisphere-App">
        <ScrollToTop />
        <Navbar user={user} signOut={signOut} />
        
        <main className={`unisphere-main-content ${pageTransition ? 'transitioning' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/login" />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/complaints" element={user ? <ComplaintPage /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user ? <AdminPage /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </AppErrorBoundary>
  );
}

export default App;