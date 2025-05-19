import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate , useParams } from 'react-router-dom';
 
const ResetPassword = () => {
 
    const navigate = useNavigate()
 
    const [password, setPassword] = useState('');
    const {token} = useParams();
 
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3000/auth/reset-password/" + token, {
            password,
        }).then(response => {
            if (response.data.status) {
                navigate('/')
            }
            console.log(response.data)
        }).catch(err => {
            console.log(err)
        })
    }
 
    return (
        <div className="flex justify-center items-center min-h-screen bg-amber-50">
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-sm border border-amber-300">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
 
                    <div>
                        <label htmlFor="password" className="block font-semibold">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-amber-300 bg-amber-50 p-2 rounded"
                        />
                    </div>
 
                    <button
                        type="submit"
                        className="w-full bg-amber-400 text-gray-800 py-2 rounded hover:bg-amber-500 transition-colors"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};
 
export default ResetPassword;