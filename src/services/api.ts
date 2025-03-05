
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../store/authStore';

// Base API URL - update this to your Django backend URL
const API_URL = 'http://localhost:8000/api';

// Helper function to handle response
async function handleResponse(response: Response) {
  // First check if the response is ok before trying to parse JSON
  if (!response.ok) {
    // Try to get error details from the response if possible
    try {
      const errorData = await response.json();
      const errorMessage = errorData.detail || errorData.message || errorData.error || response.statusText;
      throw new Error(errorMessage);
    } catch (e) {
      // If we can't parse the error as JSON, just throw the status text
      throw new Error(response.statusText || 'Network request failed');
    }
  }
  
  // If response is ok, then parse JSON
  try {
    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Failed to parse JSON response:', e);
    throw new Error('Invalid response format');
  }
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
      console.log('Attempting login with:', { email, password });
      
      try {
        const response = await fetch(`${API_URL}/login/`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ email, password }),
          credentials: 'include', // Include cookies if any
        });
        
        console.log('Login response status:', response.status);
        return handleResponse(response);
      } catch (error) {
        console.error('Login request failed:', error);
        throw error;
      }
    },
    
    register: async (name: string, email: string, password: string, role: UserRole) => {
      console.log('Attempting registration with:', { name, email, role });
      
      // Split name into first_name and last_name (assuming space separation)
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      try {
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
          credentials: 'include', // Include cookies if any
        });
        
        console.log('Registration response status:', response.status);
        return handleResponse(response);
      } catch (error) {
        console.error('Registration request failed:', error);
        throw error;
      }
    },
    
    logout: async () => {
      try {
        const response = await fetch(`${API_URL}/logout/`, {
          method: 'POST',
          headers: getHeaders(true),
          credentials: 'include', // Include cookies if any
        });
        
        console.log('Logout response status:', response.status);
        return handleResponse(response);
      } catch (error) {
        console.error('Logout request failed:', error);
        throw error;
      }
    },
    
    getUser: async () => {
      try {
        const response = await fetch(`${API_URL}/user/`, {
          method: 'GET',
          headers: getHeaders(true),
          credentials: 'include', // Include cookies if any
        });
        
        console.log('Get user response status:', response.status);
        return handleResponse(response);
      } catch (error) {
        console.error('Get user request failed:', error);
        throw error;
      }
    },
  },
  
  // Protected API methods
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
    
    getAdminData: async () => {
      const response = await fetch(`${API_URL}/admin/data/`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      
      return handleResponse(response);
    },
    
    getAllUsers: async () => {
      const response = await fetch(`${API_URL}/admin/users/`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      
      return handleResponse(response);
    },
    
    addUser: async (userData: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      role: UserRole;
      employment_date: string;
      department?: string;
      position?: string;
      managed_department?: string;
    }) => {
      // Before submitting, ensure all required fields are present
      const requiredFields = ['first_name', 'last_name', 'email', 'password', 'role'];
      for (const field of requiredFields) {
        if (!userData[field as keyof typeof userData]) {
          throw new Error(`Field ${field} is required`);
        }
      }
      
      const response = await fetch(`${API_URL}/admin/users/`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(userData),
      });
      
      return handleResponse(response);
    },
    
    updateUser: async (userId: string, userData: Partial<{
      first_name: string;
      last_name: string;
      email: string;
      role: UserRole;
      employment_date: string;
      department: string;
      position: string;
      managed_department: string;
      is_active: boolean;
    }>) => {
      const response = await fetch(`${API_URL}/admin/users/${userId}/`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify(userData),
      });
      
      return handleResponse(response);
    },
    
    deleteUser: async (userId: string) => {
      const response = await fetch(`${API_URL}/admin/users/${userId}/`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      
      if (response.status === 204) {
        return { success: true };
      }
      
      return handleResponse(response);
    },
  },
};
