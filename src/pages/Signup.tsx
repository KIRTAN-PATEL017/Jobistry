import React from 'react';
import SignupForm from '../components/auth/SignupForm';

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-secondary-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignupForm />
    </div>
  );
};

export default Signup;