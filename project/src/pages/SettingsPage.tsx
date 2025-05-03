import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Phone, Globe } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState('english');

  if (!user) {
    return null;
  }

  return (
    <div className="pb-20">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
        
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">Profile</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center">
              <div className="bg-amber-500/20 p-2 rounded-full mr-3">
                <User size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="font-medium text-white">{user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-amber-500/20 p-2 rounded-full mr-3">
                <Mail size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-medium text-white">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-amber-500/20 p-2 rounded-full mr-3">
                <Phone size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="font-medium text-white">{user.phone}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">Preferences</h3>
          </div>
          
          <div className="p-4">
            <div className="flex items-center">
              <div className="bg-amber-500/20 p-2 rounded-full mr-3">
                <Globe size={20} className="text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400">Language</p>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-white bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;