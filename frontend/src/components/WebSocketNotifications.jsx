import React, { useEffect, useState } from 'react';

function WebSocketNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to WebSocket server
    const ws = new window.WebSocket('ws://localhost:5000');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'bid-new' || data.type === 'bid-update') {
          const notif = {
            type: data.type,
            message: data.message,
            bid: data.bid,
            timestamp: new Date().toLocaleTimeString(),
          };
          setNotifications((prev) => [notif, ...prev]);
          // Auto-hide after 5 seconds
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n !== notif));
          }, 5000);
        }
      } catch (e) {
        // Ignore invalid JSON
      }
    };

    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      {notifications.slice(0, 5).map((notif, idx) => (
        <div key={idx} className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-2 shadow-lg">
          <strong>{notif.type === 'bid-new' ? 'New Bid' : 'Bid Updated'}:</strong> {notif.message}<br />
          <span className="text-xs">Product ID: {notif.bid.productId} | Amount: {notif.bid.amount} | {notif.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

export default WebSocketNotifications;
