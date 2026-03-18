import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserProfile({ role }) {
  const [profile, setProfile] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setProfile(res.data)).catch(() => setProfile(null));
    if (role === 'farmer') {
      axios.get('http://localhost:5000/api/farmer/details', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setDetails(res.data)).catch(() => setDetails(null));
    } else if (role === 'buyer') {
      axios.get('http://localhost:5000/api/buyer/details', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setDetails(res.data)).catch(() => setDetails(null));
    }
  }, [role]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div><strong>Name:</strong> {profile.name}</div>
      <div><strong>Email:</strong> {profile.email}</div>
      <div><strong>Age:</strong> {profile.age}</div>
      <div><strong>Role:</strong> {profile.role}</div>
      {details && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Details</h3>
          <div><strong>Location:</strong> {details.location}</div>
          <div><strong>Phone:</strong> {details.phone}</div>
          <div><strong>Address:</strong> {details.address}</div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
