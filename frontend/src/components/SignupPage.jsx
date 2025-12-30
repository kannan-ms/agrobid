import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

function SignupPage() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    role: 'farmer', // Default role is 'farmer'
  });

  const [errors, setErrors] = useState({}); // To store validation errors

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate the form inputs
  const validateForm = () => {
    let formErrors = {};
    const { name, age, email, password, role } = formData;

    if (!name) formErrors.name = 'Name is required';
    if (!age || isNaN(age) || age <= 0) formErrors.age = 'Valid age is required';
    if (!email || !/\S+@\S+\.\S+/.test(email)) formErrors.email = 'Email is invalid';
    if (!password || password.length < 6) formErrors.password = 'Password must be at least 6 characters long';
    if (role !== 'farmer' && role !== 'buyer') formErrors.role = 'Role is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Send data to backend
        const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
        alert(response.data.message);

        // Navigate to login page after successful signup
        navigate('/login');
      } catch (error) {
        console.error('Error during signup:', error);
        alert('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Role:</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>
            {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
