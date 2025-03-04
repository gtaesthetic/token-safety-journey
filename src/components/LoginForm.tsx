
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    let valid = true;
    
    if (!email.trim()) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      valid = false;
    }
    
    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    }
    
    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    try {
      await login(email, password);
      
      // Get updated state after login
      const { user, isAuthenticated } = useAuthStore.getState();
      
      if (isAuthenticated && user) {
        // Redirect based on user role
        if (user.role === 'employee') {
          navigate('/employee-dashboard');
          toast({
            title: "Welcome!",
            description: "You've successfully signed in as an employee.",
          });
        } else if (user.role === 'manager') {
          navigate('/manager-dashboard');
          toast({
            title: "Welcome!",
            description: "You've successfully signed in as a manager.",
          });
        }
      }
    } catch (err) {
      // Error is handled in the store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={formErrors.email ? 'border-destructive' : ''}
        />
        {formErrors.email && <p className="form-error">{formErrors.email}</p>}
      </div>
      
      <div className="form-group">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="/forgot-password" className="auth-link text-xs">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={formErrors.password ? 'border-destructive' : ''}
        />
        {formErrors.password && <p className="form-error">{formErrors.password}</p>}
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md animate-fade-in">
          {error}
        </div>
      )}
      
      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
      
      <div className="text-center mt-6">
        <span className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a href="/register" className="auth-link font-medium">
            Sign up
          </a>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
