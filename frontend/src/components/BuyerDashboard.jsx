import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BuyerDashboard() {
  const [buyerName, setBuyerName] = useState('');
  const navigate = useNavigate(); // Initialize navigate for navigation

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
  
    if (!token) {
      console.error('No token found');
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }
  
    // Fetch buyer name
    axios
      .get('http://localhost:5000/api/buyer/getName', {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in headers
        },
      })
      .then((response) => {
        setBuyerName(response.data.buyerName); // Set buyer name from the response
        console.log("Buyer Name:", response.data.buyerName);
      })
      .catch((error) => {
        console.error('Error fetching buyer data:', error.response?.data?.message || error.message);
        if (error.response?.status === 403 || error.response?.status === 401) {
          navigate('/login'); // Redirect to login on authorization errors
        }
      });
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token on logout
    alert('You have been logged out.');
    navigate('/login');
  };

  return (
    <div>
      {/* Navbar Section */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <span className="text-2xl font-bold">Buyer Portal</span>
            <ul className="flex space-x-6 items-center">
              <li><a className="hover:text-blue-200 transition" href="/available-products">Available Products</a></li>
              <li><a className="hover:text-blue-200 transition" href="/your-bids">Your Bids</a></li>
              <li><a className="hover:text-blue-200 transition" href="/add-buyer-details">Add Details</a></li>
              <li><button onClick={handleLogout} className="border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition">Logout</button></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Buyer Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 my-12">
        <h1 className="text-5xl font-bold">Welcome, {buyerName}</h1>
      </div>
    </div>
  );
}

export default BuyerDashboard;
