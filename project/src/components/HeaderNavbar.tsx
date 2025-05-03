import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useCars } from '../context/CarContext';

const HeaderNavbar: React.FC = () => {
  const { 
    selectedDate, 
    setSelectedDate,
    selectedLocation,
    setSelectedLocation,
    locations 
  } = useCars();
  
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
  const maxDate = thirtyDaysLater.toISOString().split('T')[0];
  
  return (
    <div className="z-10 shadow-md">
      {/* Black navigation bar */}
      <div className="bg-black text-white px-6 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">Luxury Cars</div>
        <nav className="flex space-x-6">
          <a href="#" className="text-white hover:text-amber-500">Home</a>
          <a href="#" className="text-white hover:text-amber-500">Fleet</a>
          <a href="#" className="text-white hover:text-amber-500">Services</a>
          <a href="#" className="text-white hover:text-amber-500">Locations</a>
          <a href="#" className="text-white hover:text-amber-500">About</a>
          <a href="#" className="text-white hover:text-amber-500">Contact</a>
        </nav>
        <button className="bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-1.5 rounded">
          Sign In
        </button>
      </div>
    </div>
  );
};

export default HeaderNavbar;