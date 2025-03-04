
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../store/authStore';

// Base API URL - update this to your Django backend URL
const API_URL = 'http://localhost:8000/api';

// Helper function to handle response
async function handleResponse(response: Response) {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.detail || data.message || response.statusText;
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
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      
      return handleResponse(response);
    },
    
    register: async (name: string, email: string, password: string, role: UserRole) => {
      // Split name into first_name and last_name (assuming space separation)
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ 
          first_name: firstName,
          last_name: lastName,
          email, 
          password, 
          role 
        }),
      });
      
      return handleResponse(response);
    },
    
    logout: async () => {
      const response = await fetch(`${API_URL}/logout/`, {
        method: 'POST',
        headers: getHeaders(true),
      });
      
      return handleResponse(response);
    },
    
    getUser: async () => {
      const response = await fetch(`${API_URL}/user/`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      
      return handleResponse(response);
    },
  },
  
  // Protected API methods (example)
  protected: {
    getEmployeeData: async () => {
      const response = await fetch(`${API_URL}/employee/data/`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      
      return handleResponse(response);
    },
    
    getManagerData: async () => {
      const response = await fetch(`${API_URL}/manager/data/`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      
      return handleResponse(response);
    },
  },
};
