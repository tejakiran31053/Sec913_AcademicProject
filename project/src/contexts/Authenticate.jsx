import React, { createContext, useState, useEffect } from 'react';

export const AuthenContext = createContext();

export const AuthenProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthenContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthenContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthenContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthenProvider');
  }
  return context;
};
