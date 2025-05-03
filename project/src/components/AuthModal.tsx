import React from 'react';
import { X } from 'lucide-react';
import AuthForm from './AuthForm';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <AuthForm onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
};

export default AuthModal;