
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { ShieldX, Home } from 'lucide-react';

const Forbidden = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const handleGoToDashboard = () => {
    if (user) {
      if (user.role === 'employee') {
        navigate('/dashboard/employee');
      } else if (user.role === 'manager') {
        navigate('/dashboard/manager');
      } else {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <div className="mb-6 flex justify-center">
          <ShieldX className="h-24 w-24 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-xl text-muted-foreground mb-6">
          You don't have permission to access this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
          <Button onClick={handleGoToDashboard}>
            Go to Your Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
