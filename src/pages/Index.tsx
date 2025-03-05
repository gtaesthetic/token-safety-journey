
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Redirect to appropriate dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
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
          // Stay on index page if role is unknown
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          Employee Management System
        </h1>
        <p className="text-muted-foreground mb-8">
          A comprehensive platform for managers and employees to track work assignments, manage time off, and collaborate efficiently.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
