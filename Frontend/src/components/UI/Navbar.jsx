import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="bg-amber-100 p-4 flex justify-between items-center shadow-md relative z-50">
        <h1 className="text-xl font-medium text-gray-700">Mind Mood</h1>
        <nav className="hidden md:flex space-x-4">
          {isAuthenticated ? (
            <>
              <NavLink to="/Home" end className="px-4 py-2 text-gray-700 hover:text-black transition hover:bg-amber-400 rounded-2xl">
                Home
              </NavLink>
              <NavLink to="/overall" className="px-4 py-2 text-gray-700 hover:text-black transition hover:bg-amber-400 rounded-2xl">
                Overall
              </NavLink>
              <NavLink to="/profile" className="px-4 py-2 text-gray-700 hover:text-black transition hover:bg-amber-400 rounded-2xl">
                Profile
              </NavLink>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-gray-700 hover:text-black transition hover:bg-red-400 rounded-2xl"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" className="px-4 py-2 text-gray-700 hover:text-black transition">
                Login
              </NavLink>
              <NavLink to="/signup" className="px-4 py-2 text-gray-700 hover:text-black transition">
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-40 z-40"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-amber-100 z-50 px-6 py-5 flex flex-col gap-6 text-gray-700 font-medium shadow-lg">
            <h1 className="text-xl font-medium text-gray-700">Mind Mood</h1>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/Home"
                  end
                  className="hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/overall"
                  className="hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Overall
                </NavLink>
                <NavLink
                  to="/profile"
                  className="hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left hover:text-black"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  className="hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;