import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Overall from './pages/OverAll.jsx'
import SignUp from './pages/SignUp.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import ProfilePage from './pages/Profile.jsx'
import ProtectedRoute from './components/ProtectRoutes.jsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

// Force React to check local storage before initializing routes
const token = localStorage.getItem('token');
console.log("Initial Token Check:", token ? "Token exists" : "No token found");

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { 
        path: '/', 
        element: token ? <Navigate to="/Home" /> : <Login /> 
      },
      { 
        path: '/Home', 
        element: <ProtectedRoute><Home /></ProtectedRoute> 
      },
      { 
        path: '/Overall', 
        element: <ProtectedRoute><Overall /></ProtectedRoute> 
      },
      { 
        path: '/Signup', 
        element: <SignUp /> 
      },
      { 
        path: '/ResetPassword/:token', 
        element: <ResetPassword /> 
      },
      { 
        path: '/ForgotPassword', 
        element: <ForgetPassword /> 
      },
      { 
        path: '/profile', 
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute> 
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)