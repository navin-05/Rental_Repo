import React from 'react';
import { Search, MapPin, Calendar, Car } from 'lucide-react';
import { useCars } from '../context/CarContext';

const SearchBar: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedLocation,
    setSelectedLocation,
    selectedDate,
    setSelectedDate,
    locations
  } = useCars();

  // Get current date for minimum selectable date
  const currentDate = new Date().toISOString().split('T')[0];

  // Calculate max date (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Vehicle types
  const vehicleTypes = [
    "All Types",
    "Sedan",
    "SUV",
    "Luxury",
    "Sports",
    "Electric",
    "Hybrid"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Pickup Location */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin size={18} className="text-amber-500" />
        </div>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full pl-10 pr-3 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 appearance-none"
        >
          <option value="">All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar size={18} className="text-amber-500" />
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={currentDate}
          max={maxDateString}
          className="w-full pl-10 pr-3 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {/* Vehicle Type */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Car size={18} className="text-amber-500" />
        </div>
        <select
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 appearance-none"
        >
          {vehicleTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg flex items-center justify-center">
        <Search size={18} />
      </button>
    </div>
  );
};

export default SearchBar;