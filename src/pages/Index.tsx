
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const navigateToDashboard = () => {
    if (isAuthenticated && user) {
      if (user.role === 'employee') {
        navigate('/employee-dashboard');
      } else if (user.role === 'manager') {
        navigate('/manager-dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Authentication System Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A beautiful, minimalist authentication system with role-based access control 
            for employees and managers.
          </p>
          <div className="mt-10">
            <Button
              onClick={navigateToDashboard}
              className="h-12 px-8 rounded-full animate-pulse"
            >
              {isAuthenticated
                ? 'Go to Dashboard'
                : 'Get Started'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-card border border-border/50 animate-slide-up">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor" />
                <path d="M20 12C20 12.3545 19.9555 12.7091 19.865 13.05C19.3872 13.0172 18.8978 13 18.4 13C14.4 13 11.1 16.3 11.1 20.3C11.1 20.7978 11.1172 21.2872 11.15 21.765C10.809 21.8555 10.4545 21.9 10.1 21.9C5.6 21.9 2 17.4 2 12C2 6.6 6.6 2 12 2C17.4 2 22 6.6 22 12C22 12.3545 21.9555 12.7091 21.865 13.05C21.3871 13.0172 20.8978 13 20.4 13C16.4 13 13.1 16.3 13.1 20.3C13.1 20.7978 13.1172 21.2872 13.15 21.765C12.8091 21.8555 12.4545 21.9 12.1 21.9C7.6 21.9 4 17.4 4 12C4 6.6 8.6 2 14 2C19.4 2 24 6.6 24 12Z" fill="currentColor" />
              </svg>
            </div>
            <h3 className="text-xl font-medium">Secure Authentication</h3>
            <p className="text-muted-foreground">
              JWT-based authentication with secure token storage and validation.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-card border border-border/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M7 21H17C19.2091 21 21 19.2091 21 17V7C21 4.79086 19.2091 3 17 3H7C4.79086 3 3 4.79086 3 7V17C3 19.2091 4.79086 21 7 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium">Role-Based Access</h3>
            <p className="text-muted-foreground">
              Different dashboards and permissions for employees and managers.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl bg-card border border-border/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium">Beautiful UI</h3>
            <p className="text-muted-foreground">
              Elegant, minimalist design with smooth animations and transitions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
