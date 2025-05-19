import React, { useState } from 'react';
import { NavLink } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Example validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Simulated login logic
    console.log('Logging in with:', { email, password });
    setError('');
    // Redirect or further logic here...
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <div className="bg-amber-100 p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-xl border border-amber-300 bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-xl border border-amber-300 bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <NavLink to="/ResetPassword" className="underline cursor-pointer text-sm">Forgot Password?</NavLink>
          <button
            type="submit"
            className="bg-black hover:bg-gray-500 text-white text-lg font-semibold py-3 rounded-xl transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          Don’t have an account? <NavLink to="/Singup" className="underline cursor-pointer">Sign up</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
