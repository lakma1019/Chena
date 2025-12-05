// API Base Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ============================================
// Token Management
// ============================================
export const tokenManager = {
  // Get access token from localStorage
  getAccessToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },

  // Get refresh token from localStorage
  getRefreshToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  },

  // Set tokens in localStorage
  setTokens: (accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
  },

  // Clear all tokens
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Also clear old auth data
      localStorage.removeItem('farmerLoggedIn');
      localStorage.removeItem('farmerEmail');
      localStorage.removeItem('farmerData');
      localStorage.removeItem('customerLoggedIn');
      localStorage.removeItem('customerEmail');
      localStorage.removeItem('customerData');
      localStorage.removeItem('transportLoggedIn');
      localStorage.removeItem('transportEmail');
      localStorage.removeItem('transportData');
    }
  },
};

// ============================================
// Generic API Request Handler with JWT
// ============================================
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get access token
    const accessToken = tokenManager.getAccessToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    // If token expired, try to refresh
    if (response.status === 403 && data.message?.includes('expired')) {
      const refreshToken = tokenManager.getRefreshToken();

      if (refreshToken) {
        try {
          // Try to refresh the token
          const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          const refreshData = await refreshResponse.json();

          if (refreshResponse.ok && refreshData.accessToken) {
            // Save new tokens
            tokenManager.setTokens(refreshData.accessToken, refreshData.refreshToken);

            // Retry original request with new token
            config.headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
            const retryResponse = await fetch(url, config);
            const retryData = await retryResponse.json();

            if (!retryResponse.ok) {
              throw new Error(retryData.message || 'API request failed');
            }

            return retryData;
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          tokenManager.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          throw new Error('Session expired. Please login again.');
        }
      }
    }

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// Authentication API
// ============================================
export const authAPI = {
  // Signup new user
  signup: async (userData) => {
    const response = await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store tokens if signup is successful
    if (response.success && response.accessToken) {
      tokenManager.setTokens(response.accessToken, response.refreshToken);
    }

    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store tokens if login is successful
    if (response.success && response.accessToken) {
      tokenManager.setTokens(response.accessToken, response.refreshToken);
    }

    return response;
  },

  // Reset password
  resetPassword: async (resetData) => {
    return apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  },

  // Get current logged in user
  getCurrentUser: async () => {
    return apiRequest('/api/auth/me', {
      method: 'GET',
    });
  },

  // Refresh access token
  refreshToken: async () => {
    const refreshToken = tokenManager.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiRequest('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Store new tokens
    if (response.success && response.accessToken) {
      tokenManager.setTokens(response.accessToken, response.refreshToken);
    }

    return response;
  },

  // Logout user
  logout: () => {
    tokenManager.clearTokens();
  },
};

// ============================================
// Export API base URL for other uses
// ============================================
export { API_BASE_URL };

