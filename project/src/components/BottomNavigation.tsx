import React from 'react';
import { Home, Heart, Settings } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center h-16 z-50 shadow-lg">
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center w-full h-full bg-black hover:bg-gray-900 transition-transform duration-200 hover:scale-110 ${activeTab === 'home' ? 'text-amber-500' : 'text-amber-400'
          }`}
      >
        <Home size={20} />
        <span className="text-xs mt-1">Home</span>
      </button>

      <button
        onClick={() => onTabChange('saved')}
        className={`flex flex-col items-center justify-center w-full h-full bg-black hover:bg-gray-900 transition-transform duration-200 hover:scale-110 ${activeTab === 'saved' ? 'text-amber-500' : 'text-amber-400'
          }`}
      >
        <Heart size={20} />
        <span className="text-xs mt-1">Saved</span>
      </button>

      <button
        onClick={() => onTabChange('settings')}
        className={`flex flex-col items-center justify-center w-full h-full bg-black hover:bg-gray-900 transition-transform duration-200 hover:scale-110 ${activeTab === 'settings' ? 'text-amber-500' : 'text-amber-400'
          }`}
      >
        <Settings size={20} />
        <span className="text-xs mt-1">Settings</span>
      </button>
    </div>
  );
};

export default BottomNavigation;