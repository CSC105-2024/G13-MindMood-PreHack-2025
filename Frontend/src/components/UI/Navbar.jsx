import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-amber-100 p-4 flex justify-between items-center shadow-md relative z-50">
        <h1 className="text-xl font-medium text-gray-700">Mind Mood</h1>

        <nav className="hidden md:flex space-x-4">
          <NavLink to="/" end className="px-4 py-2 bg-amber-300 rounded-md text-gray-700 hover:bg-amber-400 transition">
            Home
          </NavLink>
          <NavLink to="/overall" className="px-4 py-2 text-gray-700 hover:text-black transition">
            Overall
          </NavLink>
          <NavLink to="/profile" className="px-4 py-2 text-gray-700 hover:text-black transition">
            Profile
          </NavLink>
          <NavLink to="/login" className="px-4 py-2 text-gray-700 hover:text-black transition">
            Login
          </NavLink>
          <NavLink to="/signup" className="px-4 py-2 text-gray-700 hover:text-black transition">
            Sign Up
          </NavLink>
        </nav>

        <div className="md:hidden text-3xl cursor-pointer text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <i className="bx bx-menu"></i>
        </div>
      </header>

      {isMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-40 z-40" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 w-3/4 h-full bg-amber-100 z-50 p-6 flex flex-col gap-4 text-gray-700 font-medium shadow-md transition-all">
            <NavLink to="/" end className="hover:text-black" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/overall" className="hover:text-black" onClick={() => setIsMenuOpen(false)}>Overall</NavLink>
            <NavLink to="/profile" className="hover:text-black" onClick={() => setIsMenuOpen(false)}>Profile</NavLink>
            <NavLink to="/login" className="hover:text-black" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
            <NavLink to="/signup" className="hover:text-black" onClick={() => setIsMenuOpen(false)}>Sign Up</NavLink>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
