import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);
  
  // Add debugging to verify authentication state
  useEffect(() => {
    console.log('Protected Route - Auth state:', { isAuthenticated, loading, path: location.pathname });
    
    // Only show content when we're either authenticated or still loading
    if (isAuthenticated || loading) {
      setShowContent(true);
    } else {
      setShowContent(false);
    }
  }, [isAuthenticated, loading, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-amber-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-amber-800">Verifying your login...</p>
        </div>
      </div>
    );
  }

  // Only redirect if we're definitely not authenticated AND we're not loading
  if (!isAuthenticated && !loading) {
    console.log('Redirecting to login page');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;