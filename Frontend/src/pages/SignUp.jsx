import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/signup', { username, email, password });
      if (res.data.status) navigate('/');
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-amber-50">
      <div className="bg-white p-8 rounded-md shadow-sm w-full max-w-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block font-semibold">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full border border-amber-300 bg-amber-50 p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-amber-300 bg-amber-50 p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-amber-300 bg-amber-50 p-2 pr-10 rounded"
                required
              />
              <span
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-xl text-gray-600 cursor-pointer"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="w-full bg-amber-400 text-gray-800 py-2 rounded hover:bg-amber-500 transition-colors">
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <a href="/" className="ffont-semibold text-amber-500 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
