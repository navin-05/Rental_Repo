import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CarProvider } from './context/CarContext';
import HomePage from './pages/HomePage';
import SavedCarsPage from './pages/SavedCarsPage';
import SettingsPage from './pages/SettingsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import BottomNavigation from './components/BottomNavigation';
import TopNavbar from './components/TopNavbar';
import AuthModal from './components/AuthModal';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRedirectAction, setAuthRedirectAction] = useState<(() => void) | null>(null);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (authRedirectAction) {
      authRedirectAction();
      setAuthRedirectAction(null);
    }
  };

  const requireAuth = (action: () => void) => {
    setAuthRedirectAction(() => action);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <TopNavbar 
        onSignInClick={() => setShowAuthModal(true)} 
        setActiveTab={setActiveTab}
      />
      
      {activeTab === 'home' && <HomePage onAuthRequired={requireAuth} />}
      {activeTab === 'saved' && <SavedCarsPage onAuthRequired={requireAuth} />}
      {activeTab === 'settings' && <SettingsPage />}
      
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {showAuthModal && (
        <AuthModal 
          onClose={() => {
            setShowAuthModal(false);
            setAuthRedirectAction(null);
          }}
          onSuccess={handleAuthSuccess}
        />
      )}
      
      <Toaster position="top-center" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CarProvider>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/*" element={<MainApp />} />
          </Routes>
        </CarProvider>
      </AuthProvider>
    </Router>
  );
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export default App;