import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car as CarIcon, LogOut, Upload, Edit2, Trash2, Link, Image, MapPin, Users, Fuel } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCars } from '../context/CarContext';
import { Car } from '../types';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { addCar, updateCar, deleteCar, cars, uploadImage } = useCars();
  const [isLoading, setIsLoading] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    pricePerDay: '',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seatingCapacity: '5',
    mileage: '',
    image: '',
    images: [] as string[]
  });

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.type || !formData.location || !formData.pricePerDay || !formData.image) {
        throw new Error('Please fill in all required fields');
      }

      // Create new car object
      const newCar = {
        name: formData.name,
        type: formData.type,
        location: formData.location,
        price_per_day: parseInt(formData.pricePerDay),
        transmission: formData.transmission as 'Manual' | 'Automatic' | 'AMT',
        fuel_type: formData.fuelType,
        seating_capacity: parseInt(formData.seatingCapacity),
        mileage: formData.mileage || '20 km/l',
        rating: 4.0,
        image: formData.image,
        images: [formData.image, ...formData.images]
      };

      // Add car to context
      await addCar(newCar);

      // Reset form
      setFormData({
        name: '',
        type: '',
        location: '',
        pricePerDay: '',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        seatingCapacity: '5',
        mileage: '',
        image: '',
        images: []
      });

      toast.success('Car added successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add car');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      type: car.type,
      location: car.location,
      pricePerDay: car.price_per_day.toString(),
      transmission: car.transmission,
      fuelType: car.fuel_type,
      seatingCapacity: car.seating_capacity.toString(),
      mileage: car.mileage,
      image: car.image,
      images: car.images
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;

    setIsLoading(true);
    try {
      const updatedCar = {
        name: formData.name,
        type: formData.type,
        location: formData.location,
        price_per_day: parseInt(formData.pricePerDay),
        transmission: formData.transmission as 'Manual' | 'Automatic' | 'AMT',
        fuel_type: formData.fuelType,
        seating_capacity: parseInt(formData.seatingCapacity),
        mileage: formData.mileage || '20 km/l',
        image: formData.image,
        images: [formData.image, ...formData.images]
      };

      await updateCar(editingCar.id, updatedCar);
      setEditingCar(null);
      setFormData({
        name: '',
        type: '',
        location: '',
        pricePerDay: '',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        seatingCapacity: '5',
        mileage: '',
        image: '',
        images: []
      });
      toast.success('Car updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update car');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (carId: string) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await deleteCar(carId);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete car');
      }
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    try {
      setIsLoading(true);
      const files = Array.from(e.target.files);
      const urls = await uploadImage(files);

      // If it's the main image input
      if (e.target.name === 'image') {
        setFormData(prev => ({
          ...prev,
          image: urls[0] // Use the first image as main image
        }));
      } else {
        // If it's the additional images input
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...urls]
        }));
      }
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <CarIcon className="h-8 w-8 text-amber-500" />
            <h1 className="ml-2 text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingCar ? 'Edit Car' : 'Add New Car'}
          </h2>
          <form onSubmit={editingCar ? handleUpdate : handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Car Name*
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
                  placeholder="e.g., Maruti Swift"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Car Type*
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="MUV/MPV">MUV/MPV</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location*
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
                  placeholder="e.g., Delhi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price Per Day (₹)*
                </label>
                <input
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
                  placeholder="e.g., 1200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Transmission
                </label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData(prev => ({ ...prev, transmission: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="AMT">AMT (Automatic Manual Transmission)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Fuel Type
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="EV">EV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Seating Capacity
                </label>
                <select
                  value={formData.seatingCapacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, seatingCapacity: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
                >
                  <option value="2">2</option>
                  <option value="5">5</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9+">9+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mileage
                </label>
                <input
                  type="text"
                  value={formData.mileage}
                  onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
                  placeholder="e.g., 20 km/l"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Upload Image*
                </label>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setUploadMethod('url')}
                      className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${uploadMethod === 'url'
                        ? 'bg-amber-500 text-black'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                      <Link size={18} className="text-gray-300" />
                      URL Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('file')}
                      className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${uploadMethod === 'file'
                        ? 'bg-amber-500 text-black'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                      <Image size={18} className="text-gray-300" />
                      File Upload
                    </button>
                  </div>

                  {uploadMethod === 'url' ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Upload size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
                        placeholder="e.g., https://example.com/car.jpg"
                        required={uploadMethod === 'url'}
                      />
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        name="image"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-8 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-amber-500 transition-colors"
                      >
                        <Upload size={24} className="text-gray-400" />
                        <div className="text-sm text-gray-300">
                          {formData.image ? (
                            <div className="flex flex-col items-center">
                              <img
                                src={formData.image}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg mb-2"
                              />
                              <span>Click to change image</span>
                            </div>
                          ) : (
                            <span>Click to upload image</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Additional Images</label>
                <input
                  type="file"
                  name="additionalImages"
                  onChange={handleImageChange}
                  multiple
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gray-700 file:text-gray-300
                    hover:file:bg-gray-600"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              {editingCar && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCar(null);
                    setFormData({
                      name: '',
                      type: '',
                      location: '',
                      pricePerDay: '',
                      transmission: 'Automatic',
                      fuelType: 'Petrol',
                      seatingCapacity: '5',
                      mileage: '',
                      image: '',
                      images: []
                    });
                  }}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
              >
                {isLoading ? 'Saving...' : (editingCar ? 'Update Car' : 'Add Car')}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Manage Cars</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div key={car.id} className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48 w-full">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-semibold text-white">{car.name}</h3>
                      <p className="text-sm text-gray-300">{car.type}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-gray-300">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">{car.location}</span>
                      </div>
                      <div className="text-amber-500 font-semibold">
                        ₹{car.price_per_day}/day
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-300">
                        <Users size={16} className="mr-1" />
                        <span className="text-sm">{car.seating_capacity} Seats</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Fuel size={16} className="mr-1" />
                        <span className="text-sm">{car.fuel_type}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(car)}
                        className="px-3 py-1.5 bg-amber-500 text-black rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-700 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-700 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;