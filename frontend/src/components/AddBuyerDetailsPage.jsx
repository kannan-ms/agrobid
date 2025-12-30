import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddBuyerDetailsPage() {
  const [details, setDetails] = useState({ location: '', phone: '', address: '' });
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  // Submit buyer details to the backend
  const handleSubmit = () => {
    const token = localStorage.getItem('token'); // Get token from local storage

    if (!details.location || !details.phone || !details.address) {
      alert('Please fill in all fields.');
      return;
    }

    axios
      .post('http://localhost:5000/api/buyer/update-details', details, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        alert(response.data.message || 'Details saved successfully!');
        navigate('/available-products'); // Redirect to the available products page
      })
      .catch((error) => {
        console.error('Error saving details:', error);
        alert(error.response?.data?.message || 'Failed to save details.');
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Add Your Details</h2>
        <div className="mb-4">
          <input
            type="text"
            name="location"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Location"
            value={details.location}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="phone"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone Number"
            value={details.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-6">
          <textarea
            name="address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Address"
            rows="4"
            value={details.address}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={handleSubmit}>Save Details</button>
      </div>
    </div>
  );
}

export default AddBuyerDetailsPage;
