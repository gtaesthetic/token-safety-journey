
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, or default to dashboard paths
  const from = (location.state as { from?: string })?.from || null;
  
  // Effect to redirect after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      let redirectPath;
      
      // Try to redirect to the original requested URL if it exists and matches the user's role
      if (from) {
        const isEmployeePath = from.includes('/dashboard/employee') || from === '/employee-dashboard';
        const isManagerPath = from.includes('/dashboard/manager') || from === '/manager-dashboard';
        
        if ((user.role === 'employee' && isEmployeePath) || 
            (user.role === 'manager' && isManagerPath)) {
          redirectPath = from;
        }
      }
      
      // If no valid from path, redirect based on role
      if (!redirectPath) {
        redirectPath = user.role === 'employee' 
          ? '/dashboard/employee' 
          : '/dashboard/manager';
      }
      
      navigate(redirectPath, { replace: true });
      
      toast({
        title: "Welcome!",
        description: `You've successfully signed in as a ${user.role}.`,
      });
    }
  }, [isAuthenticated, user, navigate, from]);

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
      // Redirection is handled by the useEffect above
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
        {formErrors.email && <p className="text-sm text-destructive mt-1">{formErrors.email}</p>}
      </div>
      
      <div className="form-group">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="/forgot-password" className="text-xs text-primary hover:underline">
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
        {formErrors.password && <p className="text-sm text-destructive mt-1">{formErrors.password}</p>}
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
          <a href="/register" className="text-primary font-medium hover:underline">
            Sign up
          </a>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
