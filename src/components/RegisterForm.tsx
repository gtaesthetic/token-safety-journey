
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '../store/authStore';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let valid = true;
    
    if (!name.trim()) {
      errors.name = 'Name is required';
      valid = false;
    }
    
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
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      await register(name, email, password, role);
      
      // Get updated state after registration
      const { user, isAuthenticated } = useAuthStore.getState();
      
      if (isAuthenticated && user) {
        // Redirect based on user role
        if (user.role === 'employee') {
          navigate('/employee-dashboard');
          toast({
            title: "Account created!",
            description: "You've successfully registered as an employee.",
          });
        } else if (user.role === 'manager') {
          navigate('/manager-dashboard');
          toast({
            title: "Account created!",
            description: "You've successfully registered as a manager.",
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
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={formErrors.name ? 'border-destructive' : ''}
        />
        {formErrors.name && <p className="form-error">{formErrors.name}</p>}
      </div>
      
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
        <Label htmlFor="password">Password</Label>
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
      
      <div className="form-group">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={formErrors.confirmPassword ? 'border-destructive' : ''}
        />
        {formErrors.confirmPassword && (
          <p className="form-error">{formErrors.confirmPassword}</p>
        )}
      </div>
      
      <div className="form-group">
        <Label>Account Type</Label>
        <RadioGroup 
          value={role} 
          onValueChange={(value) => setRole(value as UserRole)}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="employee" id="employee" />
            <Label htmlFor="employee" className="cursor-pointer">Employee</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manager" id="manager" />
            <Label htmlFor="manager" className="cursor-pointer">Manager</Label>
          </div>
        </RadioGroup>
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md animate-fade-in">
          {error}
        </div>
      )}
      
      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
      
      <div className="text-center mt-6">
        <span className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="/login" className="auth-link font-medium">
            Sign in
          </a>
        </span>
      </div>
    </form>
  );
};

export default RegisterForm;
