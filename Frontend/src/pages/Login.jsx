import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../utils/validationSchemas';
import Navbar from '../components/UI/Navbar';
 
const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
   
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
 
    try {
      // Validate form data with Zod
      const validatedData = loginSchema.parse(formData);
 
      const result = await login(validatedData.email, validatedData.password);
 
      if (result.success) {
        navigate('/home');
      } else {
        setErrors({ general: result.message || 'Login failed' });
      }
    } catch (err) {
      if (err.name === 'ZodError') {
        // Handle Zod validation errors
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error(err);
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-amber-50">
        <div className="bg-white p-8 rounded-md shadow-sm w-full max-w-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
 
          {errors.general && (
            <div className="text-red-500 text-center mb-4 text-sm bg-red-50 p-3 rounded border border-red-200">
              {errors.general}
            </div>
          )}
 
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block font-semibold text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="off"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full border p-2 rounded bg-amber-50 text-gray-800 ${
                  errors.email ? 'border-red-300 focus:ring-red-500' : 'border-amber-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
 
            <div>
              <label htmlFor="password" className="block font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full border p-2 pr-10 rounded bg-amber-50 text-gray-800 ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-amber-300'
                  }`}
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-xl text-gray-600 cursor-pointer"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
 
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-amber-500 border-amber-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
 
              <Link to="/forgotpassword" className="text-sm font-medium text-gray-600 hover:text-gray-800 underline">
                Forgot Password?
              </Link>
            </div>
 
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-amber-400 text-gray-800 py-2 rounded hover:bg-amber-500 transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
 
          <p className="text-center text-sm mt-4 text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-amber-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
 
export default Login;