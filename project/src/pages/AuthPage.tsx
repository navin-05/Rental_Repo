import React from 'react';
import AuthForm from '../components/AuthForm';
import { Car } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-full mb-4">
            <Car size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Rentyourcar IN</h1>
          <p className="text-gray-600 mt-2">Your journey begins with us</p>
        </div>
        
        <AuthForm onSuccess={onAuthSuccess} />
        
        <p className="text-center text-gray-500 text-xs mt-8">
          &copy; 2025 CarRent India. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;