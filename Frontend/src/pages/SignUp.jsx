import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { signUpSchema } from '../utils/validationSchemas';
 
const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
 
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
      const validatedData = signUpSchema.parse(formData);
 
      const res = await axios.post('http://localhost:3000/auth/signup', validatedData);
     
      if (res.data.status) {
        navigate('/');
      } else {
        setErrors({ general: res.data.message || 'Registration failed' });
      }
    } catch (err) {
      if (err.name === 'ZodError') {
        // Handle Zod validation errors
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
      } else if (err.response?.data?.message) {
        // Handle server errors
        setErrors({ general: err.response.data.message });
      } else {
        console.error('Registration failed', err);
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="flex justify-center items-center min-h-screen bg-amber-50">
      <div className="bg-white p-8 rounded-md shadow-sm w-full max-w-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Register</h2>
       
        {errors.general && (
          <div className="text-red-500 text-center mb-4 text-sm bg-red-50 p-3 rounded border border-red-200">
            {errors.general}
          </div>
        )}
 
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block font-semibold text-gray-700">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className={`w-full border p-2 rounded bg-amber-50 text-gray-800 ${
                errors.username ? 'border-red-300 focus:ring-red-500' : 'border-amber-300'
              }`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
 
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="off"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
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
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full border p-2 pr-10 rounded bg-amber-50 text-gray-800 ${
                  errors.password ? 'border-red-300 focus:ring-red-500' : 'border-amber-300'
                }`}
              />
              <span
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-xl text-gray-600 cursor-pointer"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            <div className="text-xs text-gray-500 mt-1">
              Password must contain at least 8 characters with uppercase, lowercase, and a number
            </div>
          </div>
 
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-amber-400 text-gray-800 py-2 rounded hover:bg-amber-500 transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
 
        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="font-semibold text-amber-500 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
 
export default SignUp;