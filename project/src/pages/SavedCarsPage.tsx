import React, { useState } from 'react';
import { useCars } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';
import CarCard from '../components/CarCard';
import CarDetail from '../components/CarDetail';
import { Car } from '../types';
import { LogIn } from 'lucide-react';

interface SavedCarsPageProps {
  onAuthRequired: (action: () => void) => void;
}

const SavedCarsPage: React.FC<SavedCarsPageProps> = ({ onAuthRequired }) => {
  const { getSavedCars } = useCars();
  const { isAuthenticated } = useAuth();
  const savedCars = getSavedCars();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="pb-20">
        <div className="p-4">
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <LogIn className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-white">Sign in to view saved cars</h3>
            <p className="mt-1 text-sm text-gray-400">
              Create an account or sign in to save and view your favorite cars.
            </p>
            <button
              onClick={() => onAuthRequired(() => {})}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-amber-500 hover:bg-amber-600"
            >
              <LogIn size={18} className="mr-2" />
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="p-4">
        <h2 className="text-xl font-bold text-white mb-4">Saved Cars</h2>
        
        {savedCars.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-white">No saved cars</h3>
            <p className="mt-1 text-sm text-gray-400">
              Start saving cars you're interested in.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedCars.map(car => (
              <CarCard 
                key={car.id} 
                car={car} 
                onClick={() => setSelectedCar(car)}
                onAuthRequired={onAuthRequired}
              />
            ))}
          </div>
        )}
      </div>
      
      {selectedCar && (
        <CarDetail 
          car={selectedCar} 
          onClose={() => setSelectedCar(null)}
          onAuthRequired={onAuthRequired}
        />
      )}
    </div>
  );
};

export default SavedCarsPage;