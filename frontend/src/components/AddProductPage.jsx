import React, { useState, useEffect } from 'react';
import { useNotification } from './GlobalNotification';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProductsPage() {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    video: null,
    category: '',
    unit: '',
    duration: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    // Check if farmer details are filled
    const checkFarmerDetails = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage
      try {
        const response = await axios.get('http://localhost:5000/api/farmer/check-details', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.detailsFilled);
        if (!response.data.detailsFilled) {
          showNotification('Please fill in your details before adding a product.', 'error');
          navigate('/add-details'); // Redirect to Add Details page
        }
      } catch (err) {
        console.error('Error checking farmer details:', err);
        showNotification('Error verifying your details. Please try again.', 'error');
        navigate('/add-details'); // Redirect as fallback
      }
    };

    checkFarmerDetails();
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setProduct({ ...product, video: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.quantity || !product.category || !product.unit || !product.duration || !product.video) {
      setError('All fields are required, including the video file.');
      return;
    }

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('quantity', product.quantity);
    formData.append('category', product.category);
    formData.append('unit', product.unit);
    formData.append('duration', product.duration);
    formData.append('video', product.video);

    const token = localStorage.getItem('token'); // Get the token from localStorage

    try {
      const response = await axios.post('http://localhost:5000/api/products/add-product', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      showNotification(response.data.message || 'Product added successfully!', 'success');
      navigate('/view-products'); // Redirect to products page
    } catch (err) {
      console.error('Error adding product:', err);
      showNotification(err.response?.data?.message || 'Failed to add product.', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Add Product</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Category</label>
            <select
              id="category"
              name="category"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={product.category}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Millets">Millets</option>
              <option value="Coconut">Coconut</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Variety</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter Variety name"
              value={product.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 font-medium mb-2">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter price"
              value={product.price}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter quantity"
              value={product.quantity}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Unit</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="unit"
                  value="kg"
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                  id="unitKg"
                  checked={product.unit === 'kg'}
                  onChange={handleChange}
                />
                <label className="ml-2 text-gray-700" htmlFor="unitKg">Kilograms (kg)</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="unit"
                  value="number"
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                  id="unitNumber"
                  checked={product.unit === 'number'}
                  onChange={handleChange}
                />
                <label className="ml-2 text-gray-700" htmlFor="unitNumber">Number</label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">Duration (in days)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter duration in days"
              value={product.duration}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="video" className="block text-gray-700 font-medium mb-2">Upload Video</label>
            <input
              type="file"
              id="video"
              name="video"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              accept="video/*"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">Add Product</button>
        </form>
      </div>
    </div>
  );
}

export default AddProductsPage;
