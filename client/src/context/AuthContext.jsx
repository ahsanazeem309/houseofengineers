import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('hoe_admin_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('hoe_admin_token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${savedToken}`
          }
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
          setToken(savedToken);
        } else {
          logout();
        }
      } catch (err) {
        console.error('[AuthContext] Verification error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok && data.success) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('hoe_admin_token', data.token);
      return { success: true };
    }

    return {
      success: false,
      message: data.message || 'Authentication failed. Please check credentials.'
    };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hoe_admin_token');
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!token) return { success: false, message: 'Not authenticated' };

    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
