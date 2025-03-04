
// Simulates backend authentication service for development/testing
import { UserRole } from '../store/authStore';
import { jwtDecode } from 'jwt-decode';

// Mock user database
const users = [
  {
    id: '1',
    name: 'John Employee',
    email: 'employee@example.com',
    password: 'password123',
    role: 'employee' as UserRole,
  },
  {
    id: '2',
    name: 'Jane Manager',
    email: 'manager@example.com',
    password: 'password123',
    role: 'manager' as UserRole,
  },
];

// Generate a JWT token (this is a simplified version)
const generateToken = (user: any) => {
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
  };
  
  // In a real app, you would use a library like jsonwebtoken to sign this
  // This is a simplified representation for mock purposes
  return btoa(JSON.stringify(payload));
};

// Simulated API responses with delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthApi = {
  login: async (email: string, password: string) => {
    // Simulate network delay
    await delay(800);
    
    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Check credentials
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    // Generate token
    const token = generateToken(user);
    
    return { token };
  },
  
  register: async (name: string, email: string, password: string, role: UserRole) => {
    // Simulate network delay
    await delay(800);
    
    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user (in a real app, this would be saved to a database)
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password,
      role,
    };
    
    // Add to our "database"
    users.push(newUser);
    
    // Generate token
    const token = generateToken(newUser);
    
    return { token };
  },
  
  validateToken: (token: string) => {
    try {
      // Decode token and check expiration
      const decoded = jwtDecode<{exp: number}>(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }
};
