
import { useAuthStore } from '../store/authStore';

// Base API URL
const API_URL = '/api';

// Helper function to handle response
async function handleResponse(response: Response) {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.message || response.statusText;
    throw new Error(error);
  }
  
  return data;
}

// Create headers with authorization token when needed
function getHeaders(requiresAuth = false) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (requiresAuth) {
    const token = useAuthStore.getState().token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

// API service methods
export const api = {
  // Authentication methods
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      
      return handleResponse(response);
    },
    
    register: async (userData: { name: string; email: string; password: string; role: string }) => {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      
      return handleResponse(response);
    },
  },
  
  // Protected API methods (example)
  protected: {
    getEmployeeData: async () => {
      const response = await fetch(`${API_URL}/employee/data`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      
      return handleResponse(response);
    },
    
    getManagerData: async () => {
      const response = await fetch(`${API_URL}/manager/data`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      
      return handleResponse(response);
    },
  },
};
