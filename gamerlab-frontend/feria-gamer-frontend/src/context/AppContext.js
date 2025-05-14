import React, { createContext, useState, useContext } from 'react';

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(current => current.filter(n => n.id !== id));
    }, 5000);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(current => current.filter(n => n.id !== id));
  };

  // Value object to be provided to consumers
  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    error,
    setError,
    notifications,
    addNotification,
    removeNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};