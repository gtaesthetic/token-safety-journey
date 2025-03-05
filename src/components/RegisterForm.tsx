
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRole, useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from 'react-router-dom';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.enum(['employee', 'manager', 'admin'] as const),
});

type FormData = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const { register: registerUser, error, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'employee',
    },
  });

  const watchRole = watch('role');

  const onSubmit = async (data: FormData) => {
    try {
      setRegisterError(null);
      
      // Call registration function from auth store
      await registerUser(data.name, data.email, data.password, data.role as UserRole);
      
      // Redirect to appropriate dashboard based on role
      switch (data.role) {
        case 'employee':
          navigate('/dashboard/employee');
          break;
        case 'manager':
          navigate('/dashboard/manager');
          break;
        case 'admin':
          navigate('/dashboard/admin');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setRegisterError(error || 'Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-group">
        <Label htmlFor="name" className="form-label">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          {...register('name')}
          className={`form-input ${errors.name ? 'border-destructive' : ''}`}
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>
      
      <div className="form-group">
        <Label htmlFor="email" className="form-label">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          {...register('email')}
          className={`form-input ${errors.email ? 'border-destructive' : ''}`}
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>
      
      <div className="form-group">
        <Label htmlFor="password" className="form-label">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className={`form-input ${errors.password ? 'border-destructive' : ''}`}
        />
        {errors.password && <p className="form-error">{errors.password.message}</p>}
      </div>
      
      <div className="form-group">
        <Label htmlFor="role" className="form-label">Role</Label>
        <Select
          onValueChange={(value) => setValue('role', value as UserRole)}
          defaultValue={watchRole}
        >
          <SelectTrigger id="role" className="h-12 w-full">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="form-error">{errors.role.message}</p>}
      </div>
      
      {registerError && (
        <div className="bg-destructive/15 text-destructive text-sm p-2 rounded-md">
          {registerError}
        </div>
      )}
      
      <Button type="submit" className="auth-button" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Create Account'}
      </Button>
      
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="auth-link">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
