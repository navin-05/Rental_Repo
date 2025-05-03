import React, { useState } from 'react';
import { useCars } from '../context/CarContext';
import SearchBar from '../components/SearchBar';
import CarCard from '../components/CarCard';
import CarDetail from '../components/CarDetail';
import { Car } from '../types';
import { CarFront } from 'lucide-react';

interface HomePageProps {
  onAuthRequired: (action: () => void) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAuthRequired }) => {
  const { filteredCars, setSearchTerm, setSelectedLocation, setSelectedDate } = useCars();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const scrollToFeatured = () => {
    const featuredSection = document.getElementById('featured-cars');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    // Reset all filters
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedDate('');
  };

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="bg-black text-white relative h-[400px] flex items-center">
        <div className="absolute inset-0 z-0 opacity-50">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Luxury Car"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-6 z-10">
          <h1 className="text-4xl font-bold mb-4">Drive with Ease</h1>
          <p className="text-lg mb-6 max-w-lg">Revzone offers a reliable fleet of well-maintained cars for every journey. Experience comfort, convenience, and hassle-free rentals wherever you go.</p>
          <button 
            onClick={scrollToFeatured}
            className="relative bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black px-6 py-3 rounded font-medium flex items-center gap-2 
              hover:from-amber-600 hover:via-amber-500 hover:to-amber-600 
              transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 
              transition-all duration-300 ease-in-out
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] 
              hover:before:translate-x-[100%] before:transition-transform before:duration-1000 before:ease-in-out">
            <CarFront size={20} />
            Explore Cars
          </button>
        </div>
      </div>
      
      {/* Search section */}
      <div className="bg-gray-900 py-6">
        <div className="container mx-auto px-6">
          <div className="bg-black rounded-lg p-6 shadow-lg -mt-8 relative">
            <h3 className="text-white text-lg font-bold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-amber-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              Find Your Perfect Car
            </h3>
            <SearchBar />
          </div>
        </div>
      </div>
      
      {/* Featured cars */}
      <div id="featured-cars" className="bg-gray-900 py-10">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-amber-500">Featured Collection</h2>
            <a 
              href="#" 
              onClick={handleViewAll}
              className="relative text-amber-500 hover:text-amber-400 flex items-center group transition-all duration-300
                before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px] before:bg-gradient-to-r before:from-amber-500 before:via-amber-400 before:to-amber-500
                before:transform before:scale-x-0 before:origin-left before:transition-transform before:duration-300
                hover:before:scale-x-100"
            >
              View All 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </a>
          </div>
          
          {filteredCars.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">No cars found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map(car => (
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

export default HomePage;