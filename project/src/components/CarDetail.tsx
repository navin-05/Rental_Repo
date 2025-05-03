import React, { useState } from 'react';
import { Car } from '../types';
import { X, Star, Users, Fuel, Gauge, ArrowLeft, Calendar } from 'lucide-react';
import { useCars } from '../context/CarContext';
import { useAuth } from '../context/AuthContext';
import BookingForm from './BookingForm';
import ImageCarousel from './ImageCarousel';

interface CarDetailProps {
  car: Car;
  onClose: () => void;
  onAuthRequired: (action: () => void) => void;
}

const CarDetail: React.FC<CarDetailProps> = ({ car, onClose, onAuthRequired }) => {
  const { selectedDate, isCarBookedOnDate } = useCars();
  const { isAuthenticated } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const isBookedOnSelectedDate = isCarBookedOnDate(car.id, selectedDate);

  const handleBookingClick = () => {
    if (isBookedOnSelectedDate) return;

    if (!isAuthenticated) {
      onAuthRequired(() => setShowBookingForm(true));
      return;
    }

    setShowBookingForm(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 bg-gray-800 bg-opacity-80 rounded-full shadow-sm z-10 hover:bg-gray-700"
          >
            <X size={20} className="text-gray-300" />
          </button>

          <div className="relative h-64">
            <ImageCarousel
              images={car.images}
              alt={car.name}
              className="h-full"
              aspectRatio="wide"
              showControls={true}
            />
            <button
              onClick={onClose}
              className="absolute top-2 left-2 p-2 bg-gray-800 bg-opacity-80 rounded-full shadow-sm z-10 hover:bg-gray-700"
            >
              <ArrowLeft size={20} className="text-gray-300" />
            </button>
            {isBookedOnSelectedDate && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <span className="px-3 py-1 bg-red-500 text-white font-medium rounded-md">
                  Booked on {new Date(selectedDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-2xl font-bold text-white">{car.name}</h2>
              <div className="flex items-center">
                <Star size={18} className="text-amber-500 fill-amber-500 mr-1" />
                <span className="font-medium text-amber-500">{car.rating}/5</span>
              </div>
            </div>

            <p className="text-gray-400 mb-4">{car.type} • {car.location}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Fuel size={18} className="text-amber-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-medium text-gray-300">{car.fuel_type}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users size={18} className="text-amber-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Seating</p>
                  <p className="font-medium text-gray-300">{car.seating_capacity} People</p>
                </div>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mr-2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Transmission</p>
                  <p className="font-medium text-gray-300">{car.transmission}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Gauge size={18} className="text-amber-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Mileage</p>
                  <p className="font-medium text-gray-300">{car.mileage}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="text-amber-500 mr-2" />
                <p className="text-sm text-gray-500">Availability</p>
              </div>
              {isBookedOnSelectedDate ? (
                <div className="bg-gray-800 p-3 rounded-md">
                  <p className="text-sm mb-2 text-gray-300">
                    <span className="font-medium">Booked on:</span> {new Date(selectedDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Note: Cars are available for new bookings starting on checkout dates.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-green-400 flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Available on {new Date(selectedDate).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">Rental Price</p>
                <p className="text-xl font-bold text-amber-500">₹{car.price_per_day}<span className="text-sm font-normal text-gray-500">/day</span></p>
              </div>
              <button
                onClick={handleBookingClick}
                disabled={isBookedOnSelectedDate}
                className={`px-6 py-2 rounded-lg font-medium ${isBookedOnSelectedDate
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-amber-500 text-black hover:bg-amber-600'
                  }`}
              >
                {isBookedOnSelectedDate ? 'Unavailable' : 'Book Now'}
              </button>
            </div>

            {isBookedOnSelectedDate && (
              <div className="mt-2 p-3 bg-red-900/50 border border-red-800 rounded-md">
                <p className="text-sm text-red-400">
                  This car is already booked for {new Date(selectedDate).toLocaleDateString()}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showBookingForm && (
        <BookingForm
          car={car}
          onClose={() => {
            setShowBookingForm(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default CarDetail;