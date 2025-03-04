
import React from 'react';
import AuthLayout from '../components/AuthLayout';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Enter your details to get started"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
