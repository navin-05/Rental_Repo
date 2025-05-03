import React from 'react';
import { Car } from '../types';
import { Heart, Star, Users, Fuel, Gauge } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';

interface CarCardProps {
  car: Car;
  onClick: () => void;
  onAuthRequired: (action: () => void) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onClick, onAuthRequired }) => {
  const { savedCars, toggleSaved, selectedDate, isCarBookedOnDate } = useCars();
  const { isAuthenticated } = useAuth();
  const isSaved = savedCars.includes(car.id);
  const isBookedOnSelectedDate = isCarBookedOnDate(car.id, selectedDate);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onAuthRequired(() => toggleSaved(car.id));
      return;
    }
    toggleSaved(car.id);
  };

  return (
    <div
      onClick={onClick}
      className="relative bg-black rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform hover:translate-y-[-5px]"
    >
      {/* Tag for car type */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-amber-500 text-black text-xs font-semibold px-2 py-1 rounded">
          {car.type === 'SUV' ? 'SUV' : car.type === 'sports' ? 'Sport' : 'Premium'}
        </div>
      </div>

      {/* Car image */}
      <div className="relative aspect-[4/3]">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleSaveClick}
          className="absolute top-3 right-3 p-1.5 bg-black rounded-full shadow-md z-10"
        >
          <Heart
            size={16}
            className={isSaved ? 'fill-amber-500 text-amber-500' : 'text-gray-400'}
          />
        </button>
        {isBookedOnSelectedDate && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
              Booked on {new Date(selectedDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Car details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-white">{car.name}</h3>
          <div className="flex items-center">
            <Star size={14} className="text-amber-500 fill-amber-500 mr-1" />
            <span className="text-amber-500 font-medium text-sm">{car.rating}</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 mb-3">
          {car.type === 'Sedan' 
            ? 'Luxury sedan with premium features and exceptional comfort.' 
            : car.type === 'SUV' 
              ? 'Flagship SUV with unmatched comfort and capability.'
              : 'Cutting-edge hybrid sports car with futuristic design.'}
        </p>

        {/* Car features */}
        <div className="flex space-x-2 mb-4">
          <div className="flex items-center text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
            <Users size={14} className="text-amber-500 mr-1" />
            <span className="mr-1 font-medium">{car.seating_capacity || 5}</span>
            <span>Seats</span>
          </div>
          <div className="flex items-center text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mr-1">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
            <span className="capitalize">{car.transmission}</span>
          </div>
          {car.fuel_type && (
            <div className="flex items-center text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              <Fuel size={14} className="text-amber-500 mr-1" />
              <span className="capitalize">{car.fuel_type === 'petrol' ? 'Hybrid' : car.fuel_type}</span>
            </div>
          )}
        </div>

        {/* Price and reserve button */}
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-amber-500">₹{car.price_per_day}</span>
            <span className="text-gray-400 text-sm">/day</span>
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-black text-sm font-medium px-3 py-1.5 rounded">
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;