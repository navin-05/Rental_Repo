import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopNavbarProps {
  onSignInClick: () => void;
  setActiveTab: (tab: string) => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onSignInClick, setActiveTab }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 bg-black z-20 px-4 py-2.5 shadow-md flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => setActiveTab('home')}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-300/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
          <img 
            src="https://ntemcfrqntosbbwljahg.supabase.co/storage/v1/object/public/cars/images/revzone2.png"
            alt="RevZone Logo"
            className="h-8 w-auto relative filter drop-shadow-[0_0_3px_rgba(251,191,36,0.3)] group-hover:drop-shadow-[0_0_5px_rgba(251,191,36,0.5)] transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-300/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <h1 className="text-lg font-bold text-amber-500">RevZone</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/login')}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-amber-500 bg-black hover:bg-gray-900 rounded-lg transition-colors"
        >
          <ShieldCheck size={16} className="mr-1.5" />
          Admin
        </button>
        
        {isAuthenticated ? (
          <div
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-gray-800 p-1.5 rounded-full">
              <User size={18} className="text-amber-500" />
            </div>
            <span className="text-sm font-medium text-amber-500">{user?.name}</span>
          </div>
        ) : (
          <button
            onClick={onSignInClick}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-amber-500 hover:bg-gray-900 rounded-lg transition-colors"
          >
            <LogIn size={16} className="mr-1.5" />
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default TopNavbar;