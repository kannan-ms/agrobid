import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode

const YourBidsPage = () => {
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token is missing. Please log in again.");
      return;
    }

    let buyerId;
    try {
      // Decode token to get buyerId
      const decodedToken = jwtDecode(token);
      console.log(decodedToken)
      buyerId = decodedToken.userId; // Ensure this matches the key in your JWT payload
    } catch (err) {
      setError("Failed to decode token. Please log in again.");
      return;
    }

    if (!buyerId) {
      setError("Buyer ID is missing in the token. Please log in again.");
      return;
    }

    const fetchBids = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/bids/your-bids/${buyerId}`, // Adjusted URL to match backend route
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response Data: ", response.data);
        setBids(response.data); // Set fetched bids
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch bids. Try again later."
        );
      }
    };

    fetchBids();
  }, []); // Empty dependency array ensures it only runs once

  return (
    <div className="max-w-7xl mx-auto my-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Your Bids</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {!error && bids.length === 0 && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded text-center">You have not placed any bids yet.</div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bids.map((bid) => (
          <div key={bid.bidId}>
            <div className="bg-white rounded-lg shadow-lg h-full">
              <div className="p-6">
                <h5 className="text-xl font-bold mb-3">{bid.productName}</h5>
                <p className="text-gray-700 mb-2"><strong>Bid Amount:</strong> ₹{bid.bidAmount}</p>
                <p className="text-gray-700 mb-2"><strong>Status:</strong> <span className={`inline-block px-3 py-1 rounded text-white text-sm ${bid.status === 'pending' ? 'bg-yellow-500' : 'bg-green-600'}`}>{bid.status}</span></p>
                <p className="text-gray-700"><strong>Winning Bid:</strong> <span className={`inline-block px-3 py-1 rounded text-white text-sm ${bid.isWinningBid ? 'bg-green-600' : 'bg-gray-500'}`}>{bid.isWinningBid ? "Yes" : "No"}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourBidsPage;
