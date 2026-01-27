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

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Logout user
  logout: () => {
    tokenManager.clearTokens();
  },
};

// ============================================
// Product API
// ============================================
export const productAPI = {
  // Get all products with minimum prices (for home page)
  getAllProducts: async () => {
    return apiRequest('/api/products', {
      method: 'GET',
    });
  },

  // Get product catalog
  getProductCatalog: async () => {
    return apiRequest('/api/products/catalog', {
      method: 'GET',
    });
  },

  // Get product details with all farmers selling it
  getProductDetails: async (catalogId) => {
    return apiRequest(`/api/products/${catalogId}/details`, {
      method: 'GET',
    });
  },

  // Get logged-in farmer's products
  getFarmerProducts: async () => {
    return apiRequest('/api/products/farmer/my-products', {
      method: 'GET',
    });
  },

  // Add product to farmer's inventory
  addFarmerProduct: async (productData) => {
    return apiRequest('/api/products/farmer', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update farmer's product
  updateFarmerProduct: async (farmerProductId, productData) => {
    return apiRequest(`/api/products/farmer/${farmerProductId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete farmer's product
  deleteFarmerProduct: async (farmerProductId) => {
    return apiRequest(`/api/products/farmer/${farmerProductId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// Order API
// ============================================
export const orderAPI = {
  // Create new order
  createOrder: async (orderData) => {
    return apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get all orders for logged-in customer
  getCustomerOrders: async () => {
    return apiRequest('/api/orders', {
      method: 'GET',
    });
  },

  // Get specific order details
  getOrderDetails: async (orderId) => {
    return apiRequest(`/api/orders/${orderId}`, {
      method: 'GET',
    });
  },
};

// ============================================
// Farmer Order API
// ============================================
export const farmerOrderAPI = {
  // Get all orders containing farmer's products
  getFarmerOrders: async () => {
    return apiRequest('/api/farmer/orders', {
      method: 'GET',
    });
  },

  // Get farmer analytics and sales reports
  getFarmerAnalytics: async () => {
    return apiRequest('/api/farmer/analytics', {
      method: 'GET',
    });
  },

  // Get available transport providers with vehicles
  getTransportProviders: async () => {
    return apiRequest('/api/farmer/transport-providers', {
      method: 'GET',
    });
  },

  // Assign transport provider to an order
  assignTransport: async (orderId, transportData) => {
    return apiRequest(`/api/farmer/orders/${orderId}/assign-transport`, {
      method: 'POST',
      body: JSON.stringify(transportData),
    });
  },
};

// ============================================
// Transport Provider API
// ============================================
export const transportAPI = {
  // Add a new vehicle
  addVehicle: async (vehicleData) => {
    return apiRequest('/api/transport/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  // Get all vehicles for transport provider
  getVehicles: async () => {
    return apiRequest('/api/transport/vehicles', {
      method: 'GET',
    });
  },

  // Get all deliveries assigned to transport provider
  getDeliveries: async () => {
    return apiRequest('/api/transport/deliveries', {
      method: 'GET',
    });
  },

  // Get specific delivery details
  getDeliveryDetails: async (deliveryId) => {
    return apiRequest(`/api/transport/deliveries/${deliveryId}`, {
      method: 'GET',
    });
  },

  // Update delivery status and notes
  updateDeliveryStatus: async (deliveryId, statusData) => {
    return apiRequest(`/api/transport/deliveries/${deliveryId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  },
};

// ============================================
// Admin API
// ============================================
export const adminAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    return apiRequest('/api/admin/dashboard/stats', {
      method: 'GET',
    });
  },

  // Get all users with filters
  getAllUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.userType) params.append('userType', filters.userType);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/api/admin/users?${queryString}` : '/api/admin/users';

    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // Update user status
  updateUserStatus: async (userId, isActive) => {
    return apiRequest(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    return apiRequest(`/api/admin/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Delete user
  deleteUser: async (userId) => {
    return apiRequest(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Get all products
  getAllProducts: async () => {
    return apiRequest('/api/admin/products', {
      method: 'GET',
    });
  },

  // Get all orders with filters
  getAllOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/api/admin/orders?${queryString}` : '/api/admin/orders';

    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    return apiRequest(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// ============================================
// Export API base URL for other uses
// ============================================
export { API_BASE_URL };

