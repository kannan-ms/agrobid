import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function AvailableProductsPage() {
  const [products, setProducts] = useState([]);
  const [bidAmount, setBidAmount] = useState({});
  const [categories, setCategories] = useState([]); // To store categories for filter
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default to 'All'
  const navigate = useNavigate();

  useEffect(() => {
    // Check if buyer details are complete
    const checkBuyerDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await axios.get('http://localhost:5000/api/buyer/details', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data.detailsFilled) {
          // Redirect to AddBuyerDetailsPage if details are incomplete
          alert('Please complete your profile details before proceeding.');
          navigate('/add-buyer-details');
        }
      } catch (error) {
        console.error('Error checking buyer details:', error);
        alert('Error verifying your details. Please log in again.');
      }
    };

    checkBuyerDetails();
  }, [navigate]);

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/availableProducts/categories');
        setCategories(['All', ...response.data]); // Add 'All' as the first category
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const url =
          selectedCategory === 'All'
            ? 'http://localhost:5000/api/availableProducts/category/All'
            : `http://localhost:5000/api/availableProducts/category/${selectedCategory}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Handle bid submission
  const handleBidSubmit = async (productId) => {
    const amount = bidAmount[productId];
    if (!amount || amount <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/bids/bid', { productId, amount }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Bid placed successfully!');
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Failed to place bid.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div>
      {/* Navbar */}
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

      <div className="max-w-7xl mx-auto my-8 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Available Products</h2>

        {/* Category Filter */}
        <div className="mb-8 max-w-md mx-auto">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Filter by Category:</label>
          <select
            id="category"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Products Container */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id}>
              <div className="bg-white rounded-lg shadow-lg h-full">
                <div className="p-6">
                  <h5 className="text-xl font-bold mb-3">{product.name}</h5>
                  <p className="text-gray-700 mb-2"><strong>Price:</strong> ₹{product.price}</p>
                  <p className="text-gray-700 mb-2"><strong>Quantity:</strong> {product.quantity} {product.unit}</p>
                  <p className="text-gray-700 mb-3"><strong>Category:</strong> {product.category}</p>

                  {/* Display Product Video */}
                  {product.video && (
                    <video
                      controls
                      src={`http://localhost:5000/${product.video}`}
                      className="w-full rounded mt-2"
                      style={{maxHeight: '200px'}}
                      type="video/mp4"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {/* Input for placing a bid */}
                  <div className="mt-4">
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                      placeholder="Enter your bid amount"
                      value={bidAmount[product._id] || ''}
                      onChange={(e) => setBidAmount({ ...bidAmount, [product._id]: e.target.value })}
                    />
                    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition" onClick={() => handleBidSubmit(product._id)}>Place Bid</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AvailableProductsPage;
