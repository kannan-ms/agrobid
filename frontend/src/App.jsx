import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SignupPage from './components/SignupPage.jsx'; // Signup Page
import LoginPage from './components/LoginPage.jsx'; // Login Page
import FarmerDashboard from './components/FarmerDashboard.jsx'; // Farmer Dashboard
import BuyerDashboard from './components/BuyerDashboard.jsx'; // Buyer Dashboard
import AddProductPage from './components/AddProductPage.jsx'; // Add Product Page
import ViewProductsPage from './components/ViewProductsPage.jsx'; // View Products Page
import AvailableProducts from './components/AvailableProductsPage.jsx'; // Available Products Page
import YourBids from './components/YourBids.jsx'; // Your Bids Page
import AddFarmerDetailsPage from './components/AddFarmerDetailsPage.jsx';
import AddBuyerDetailsPage from './components/AddBuyerDetailsPage.jsx'; // Import the AddBuyerDetailsPage component
import ForgotPasswordPage from './components/ForgotPasswordPage.jsx'; // Import the new page

//import heroAgriculture from './assets/Images/dalle.webp';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Make a GET request to the backend API (running on port 5000)
    axios.get('http://localhost:5000/api/welcome')
      .then((response) => {
        setMessage(response.data.message); // Set the response message to state
      })
      .catch((error) => {
        console.error('There was an error making the request:', error);
      });
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Welcome message */}
        <h1 className="text-center my-8 text-3xl font-bold">{message}</h1>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home route with Login and Signup buttons */}
          <Route path="/signup" element={<SignupPage />} /> {/* Signup Page */}
          <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} /> {/* Farmer Dashboard */}
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} /> {/* Buyer Dashboard */}
          <Route path="/add-product" element={<AddProductPage />} /> {/* Add Product Page */}
          <Route path="/view-products" element={<ViewProductsPage />} /> {/* View Products Page */}
          <Route path="/available-products" element={<AvailableProducts />} /> {/* Available Products Page */}
          <Route path="/your-bids" element={<YourBids />} /> {/* Your Bids Page */}
          <Route path="/add-details" element={<AddFarmerDetailsPage />} />
          <Route path="/add-buyer-details" element={<AddBuyerDetailsPage />} /> {/* Add Buyer Details */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Home component to show Login and Signup buttons
function Home() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <header className="bg-green-600 text-white py-12 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to AgroBidding</h1>
          <p className="text-xl">Your gateway to a transparent and efficient agricultural marketplace.</p>
        </div>
      </header>

      {location.pathname === '/' && (
        <div className="max-w-7xl mx-auto px-4 text-center my-12">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">Login</button>
            </Link>
            <Link to="/signup">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition">Signup</button>
            </Link>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 my-12">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose AgroBidding?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Direct Connections</h3>
            <p className="text-gray-600">Connect directly with farmers and retailers without middlemen.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Transparency</h3>
            <p className="text-gray-600">Fair pricing and transparent bidding processes for all users.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Expanded Market Reach</h3>
            <p className="text-gray-600">Access a wider audience, breaking the barriers of local markets.</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 my-12">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Sign Up</h3>
            <p className="text-gray-600">Create an account to get started on the platform.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Place Bids</h3>
            <p className="text-gray-600">Farmers set prices; retailers bid and secure deals.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
            <p className="text-gray-600">Transactions made safe and easy with secure payment options.</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white text-center py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2024 AgroBidding. Empowering farmers and retailers with technology.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
