import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FarmerDashboard() {
  const [farmerName, setFarmerName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    if (!token) {
      console.error('No token found');
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    // Fetch farmer name (already done)
    axios
      .get('http://localhost:5000/api/farmer/details', {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in headers
        },
      })
      .then((response) => {
        setFarmerName(response.data.farmerName);
        console.log("Farmer Name:", response.data.farmerName);
      })
      .catch((error) => {
        console.error('Error fetching farmer data:', error.response?.data?.message || error.message);
        if (error.response?.status === 403 || error.response?.status === 401) {
          navigate('/login'); // Redirect to login on authorization errors
        }
      });

    // Fetch farmer additional details (location, phone, address)
    // Note: Details are fetched but not displayed in this dashboard
    axios
      .get('http://localhost:5000/api/farmer/details', { 
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // Farmer details available if needed in future
      })
      .catch(error => {
        console.error('Error fetching farmer details:', error);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token on logout
    alert('You have been logged out.');
    navigate('/login');
  };

  return (
    <div>
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <span className="text-2xl font-bold">Farmer Portal</span>
            <ul className="flex space-x-6 items-center">
              <li><a className="hover:text-green-200 transition" href="/add-product">Add Products</a></li>
              <li><a className="hover:text-green-200 transition" href="/view-products">View Products</a></li>
              <li><a className="hover:text-green-200 transition" href="/add-details">Add Details</a></li>
              <li><button onClick={handleLogout} className="border border-white px-4 py-2 rounded hover:bg-white hover:text-green-600 transition">Logout</button></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 my-12">
        <h1 className="text-5xl font-bold">Welcome, {farmerName}</h1>
      </div>

      {/* Display Farmer Details */}
      {/* <div className="farmer-details">
        <h3>Farmer Details:</h3>
        <p><strong>Location:</strong> {farmerDetails.location || 'Not provided'}</p>
        <p><strong>Phone:</strong> {farmerDetails.phone || 'Not provided'}</p>
        <p><strong>Address:</strong> {farmerDetails.address || 'Not provided'}</p>
      </div> */}
    </div>
  );
}

export default FarmerDashboard;
