import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-96 px-4 py-3 rounded shadow-lg ${
          notification.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
          notification.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
          'bg-blue-100 border border-blue-400 text-blue-700'
        }`}>
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}
