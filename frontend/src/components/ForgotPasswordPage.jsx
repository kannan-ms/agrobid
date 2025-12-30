import React, { useState } from 'react';
import axios from 'axios';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });

      if (response.status === 200) {
        setMessage('A password reset link has been sent to your email.');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);  // Show error message from backend
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        <form onSubmit={handleForgotPassword}>
          <h2 className="text-3xl font-bold text-center mb-6">Forgot Password</h2>
          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Enter your email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
