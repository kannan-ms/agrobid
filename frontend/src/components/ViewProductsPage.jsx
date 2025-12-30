import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewProductsPage() {
  const [products, setProducts] = useState([]);
  const [bids, setBids] = useState([]);
  const [buyerDetails, setBuyerDetails] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  // Fetch products added by the farmer
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to load products.');
      }
    };

    fetchProducts();
  }, []);

  // Fetch bids for a specific product
  const fetchBids = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/api/bids/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBids(response.data); // Bids will include populated buyer details
    } catch (error) {
      console.error('Error fetching bids:', error);
      alert('Failed to load bids.');
    }
  };

  // View buyer details
  const viewBuyerDetails = async (buyerId) => {
    const token = localStorage.getItem('token');
    if (!buyerId) {
      alert('No buyer selected.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/bids/buyer/${buyerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        console.log('Buyer Details:', response.data);
        setBuyerDetails([response.data]); // Wrap the response in an array for consistent rendering
      } else {
        alert('No details found for this buyer.');
      }
    } catch (error) {
      console.error('Error fetching buyer details:', error);
      alert('Failed to load buyer details. Please try again later.');
    }
  };

  // Select a winning bid
  const selectWinningBid = async (bidId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/bids/select',
        { bidId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Winning bid selected successfully!');
      setBids([]);
    } catch (error) {
      console.error('Error selecting winning bid:', error);
      alert('Failed to select winning bid.');
    }
  };

  // Update a product
  const updateProduct = async (product) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:5000/api/products/${product._id}`, product, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Product updated successfully!');
      setEditProduct(null);
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === product._id ? response.data : p))
      );
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  // Delete a product
  const deleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Product deleted successfully!');
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Your Products</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id}>
            <div className="bg-white rounded-lg shadow-lg h-full">
              <div className="p-6">
                <h5 className="text-xl font-bold mb-3">{product.name}</h5>
                <p className="text-gray-700 mb-2"><strong>Price:</strong> ₹{product.price}</p>
                <p className="text-gray-700 mb-4"><strong>Quantity:</strong> {product.quantity} {product.unit}</p>
                <div className="flex flex-col gap-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm" onClick={() => fetchBids(product._id)}>View Bids</button>
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition text-sm" onClick={() => setEditProduct(product)}>Edit</button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm" onClick={() => deleteProduct(product._id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editProduct && (
        <div className="bg-white rounded-lg shadow-xl mt-8 p-6">
          <h3 className="text-2xl font-bold mb-6">Edit Product</h3>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Product name"
              value={editProduct.name}
              onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Price"
              value={editProduct.price}
              onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Quantity"
              value={editProduct.quantity}
              onChange={(e) => setEditProduct({ ...editProduct, quantity: e.target.value })}
            />
          </div>
          <div className="mb-6">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Unit"
              value={editProduct.unit}
              onChange={(e) => setEditProduct({ ...editProduct, unit: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition" onClick={() => updateProduct(editProduct)}>Save</button>
            <button className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition" onClick={() => setEditProduct(null)}>Cancel</button>
          </div>
        </div>
      )}

      {bids.length > 0 && (
        <div className="bg-white rounded-lg shadow-xl mt-8 p-6">
          <h3 className="text-2xl font-bold mb-6">Bids for Product</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {bids.map((bid) => (
              <div key={bid._id}>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <p className="mb-2"><strong>Bid Amount:</strong> ₹{bid.amount}</p>
                  <p className="mb-4"><strong>Buyer:</strong> {bid.buyerId?.name || 'Unknown'}</p>
                  <div className="flex flex-col gap-2">
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm" onClick={() => selectWinningBid(bid._id)}>Select as Winning Bid</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm" onClick={() => viewBuyerDetails(bid.buyerId?._id)}>View Buyer Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {buyerDetails && buyerDetails.length > 0 && (
        <div className="bg-white rounded-lg shadow-xl mt-8 p-6">
          <h3 className="text-2xl font-bold mb-6">Buyer Details</h3>
          {buyerDetails.map((buyer) => (
            <div key={buyer._id} className="mb-6">
              <p className="mb-2"><strong>Name:</strong> {buyer.buyerId?.name || buyer.name || 'N/A'}</p>
              <p className="mb-2"><strong>Email:</strong> {buyer.buyerId?.email || buyer.email || 'N/A'}</p>
              <p className="mb-2"><strong>Phone:</strong> {buyer.phone || 'N/A'}</p>
              <p className="mb-2"><strong>Location:</strong> {buyer.location || 'N/A'}</p>
              <p className="mb-2"><strong>Address:</strong> {buyer.address || 'N/A'}</p>
            </div>
          ))}
          <button className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition" onClick={() => setBuyerDetails(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default ViewProductsPage;
