import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
 
const ForgetPassword = () => {
 
  const navigate = useNavigate()
 
  const [email, setEmail] = useState('')
 
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/auth/forgot-password", {
      email,
    }).then(response => {
      if(response.data.status){
        alert("check your email for reset password link")
        navigate('/')
      }
    }).catch(err => {
      console.log(err)
    })
  }
 
  return (
    <div className="flex justify-center items-center min-h-screen bg-amber-50">
      <div className="bg-white p-8 rounded-md shadow-sm w-full max-w-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">Forget Password</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
 
          <div>
            <label htmlFor="email" className="block font-semibold">Email</label>
            <input
              type="email"
              autoComplete="off"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-amber-300 bg-amber-50 p-2 rounded"
            />
          </div>
 
          <button
            type="submit"
            className="w-full bg-amber-400 text-gray-800 py-2 rounded hover:bg-amber-500 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
 
export default ForgetPassword;