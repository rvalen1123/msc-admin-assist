import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_URL = import.meta.env.MODE === 'production'
  ? '/api' // Same domain in production (React app served by NestJS)
  : 'http://localhost:3000/api'; // Development server

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/authentication
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          handleAuthError();
          return Promise.reject(error);
        }
        
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );
        
        if (response.data.accessToken) {
          // Save new tokens
          localStorage.setItem('auth_token', response.data.accessToken);
          localStorage.setItem('refresh_token', response.data.refreshToken);
          
          // Update authorization header
          apiClient.defaults.headers.common['Authorization'] = 
            `Bearer ${response.data.accessToken}`;
          
          // Retry original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed, redirect to login
        handleAuthError();
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

// Helper function to handle authentication errors
const handleAuthError = () => {
  // Clear stored tokens
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  
  // Redirect to login page
  window.location.href = '/login';
};

// API methods for different endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) => 
      apiClient.post('/auth/login', { email, password }),
    
    logout: () => 
      apiClient.post('/auth/logout'),
    
    forgotPassword: (email: string) => 
      apiClient.post('/auth/forgot-password', { email }),
    
    resetPassword: (token: string, password: string) => 
      apiClient.post('/auth/reset-password', { token, password }),
  },
  
  // Users endpoints
  users: {
    getCurrent: () => 
      apiClient.get('/users/me'),
    
    update: (userId: string, userData: any) => 
      apiClient.put(`/users/${userId}`, userData),
    
    list: (params?: any) => 
      apiClient.get('/users', { params }),
    
    getById: (userId: string) => 
      apiClient.get(`/users/${userId}`),
    
    create: (userData: any) => 
      apiClient.post('/users', userData),
    
    delete: (userId: string) => 
      apiClient.delete(`/users/${userId}`),
  },
  
  // Customers endpoints
  customers: {
    list: (params?: any) => 
      apiClient.get('/customers', { params }),
    
    getById: (customerId: string) => 
      apiClient.get(`/customers/${customerId}`),
    
    create: (customerData: any) => 
      apiClient.post('/customers', customerData),
    
    update: (customerId: string, customerData: any) => 
      apiClient.put(`/customers/${customerId}`, customerData),
    
    delete: (customerId: string) => 
      apiClient.delete(`/customers/${customerId}`),
    
    // Customer contacts
    contacts: {
      list: (customerId: string) => 
        apiClient.get(`/customers/${customerId}/contacts`),
      
      create: (customerId: string, contactData: any) => 
        apiClient.post(`/customers/${customerId}/contacts`, contactData),
      
      update: (customerId: string, contactId: string, contactData: any) => 
        apiClient.put(`/customers/${customerId}/contacts/${contactId}`, contactData),
      
      delete: (customerId: string, contactId: string) => 
        apiClient.delete(`/customers/${customerId}/contacts/${contactId}`),
    },
  },
  
  // Products endpoints
  products: {
    list: (params?: any) => 
      apiClient.get('/products', { params }),
    
    getById: (productId: string) => 
      apiClient.get(`/products/${productId}`),
    
    create: (productData: any) => 
      apiClient.post('/products', productData),
    
    update: (productId: string, productData: any) => 
      apiClient.put(`/products/${productId}`, productData),
    
    delete: (productId: string) => 
      apiClient.delete(`/products/${productId}`),
    
    getPriceHistory: (productId: string) => 
      apiClient.get(`/products/${productId}/price-history`),
  },
  
  // Forms endpoints
  forms: {
    templates: {
      list: (params?: any) => 
        apiClient.get('/forms/templates', { params }),
      
      getById: (templateId: string) => 
        apiClient.get(`/forms/templates/${templateId}`),
      
      create: (templateData: any) => 
        apiClient.post('/forms/templates', templateData),
      
      update: (templateId: string, templateData: any) => 
        apiClient.put(`/forms/templates/${templateId}`, templateData),
      
      delete: (templateId: string) => 
        apiClient.delete(`/forms/templates/${templateId}`),
    },
    
    submissions: {
      list: (params?: any) => 
        apiClient.get('/forms/submissions', { params }),
      
      getById: (submissionId: string) => 
        apiClient.get(`/forms/submissions/${submissionId}`),
      
      create: (submissionData: any) => 
        apiClient.post('/forms/submissions', submissionData),
      
      update: (submissionId: string, submissionData: any) => 
        apiClient.put(`/forms/submissions/${submissionId}`, submissionData),
      
      delete: (submissionId: string) => 
        apiClient.delete(`/forms/submissions/${submissionId}`),
    },
  },
  
  // Orders endpoints
  orders: {
    list: (params?: any) => 
      apiClient.get('/orders', { params }),
    
    getById: (orderId: string) => 
      apiClient.get(`/orders/${orderId}`),
    
    create: (orderData: any) => 
      apiClient.post('/orders', orderData),
    
    update: (orderId: string, orderData: any) => 
      apiClient.put(`/orders/${orderId}`, orderData),
    
    delete: (orderId: string) => 
      apiClient.delete(`/orders/${orderId}`),
    
    // Order items
    items: {
      list: (orderId: string) => 
        apiClient.get(`/orders/${orderId}/items`),
      
      create: (orderId: string, itemData: any) => 
        apiClient.post(`/orders/${orderId}/items`, itemData),
      
      update: (orderId: string, itemId: string, itemData: any) => 
        apiClient.put(`/orders/${orderId}/items/${itemId}`, itemData),
      
      delete: (orderId: string, itemId: string) => 
        apiClient.delete(`/orders/${orderId}/items/${itemId}`),
    },
  },
};

export default api;
