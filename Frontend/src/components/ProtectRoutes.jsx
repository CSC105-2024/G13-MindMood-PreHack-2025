import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" replace />;
  }
  
  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;