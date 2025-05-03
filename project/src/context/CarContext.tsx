import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Car, SavedCar, Booking } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CarContextType {
  cars: Car[];
  savedCars: string[];
  searchTerm: string;
  selectedDate: string;
  selectedLocation: string;
  locations: string[];
  setSearchTerm: (term: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedLocation: (location: string) => void;
  toggleSaved: (carId: string) => Promise<void>;
  bookCar: (carId: string, fromDate: string, toDate: string, bookingData: any) => Promise<boolean>;
  isCarBookedOnDate: (carId: string, date: string) => boolean;
  isDateRangeAvailable: (carId: string, fromDate: string, toDate: string) => boolean;
  getNextAvailableDate: (carId: string) => string | null;
  filteredCars: Car[];
  getSavedCars: () => Car[];
  addCar: (car: Omit<Car, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCar: (carId: string, carData: Partial<Omit<Car, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  deleteCar: (carId: string) => Promise<void>;
  uploadImage: (files: File[]) => Promise<string[]>;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [savedCars, setSavedCars] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const { user } = useAuth();

  useEffect(() => {
    // Fetch cars immediately when component mounts
    fetchCars();

    // Set up a real-time subscription to cars table
    const carsSubscription = supabase
      .channel('cars_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, () => {
        fetchCars();
      })
      .subscribe();

    if (user) {
      fetchSavedCars();
      fetchBookings();
    }

    // Cleanup subscription on unmount
    return () => {
      carsSubscription.unsubscribe();
    };
  }, [user]);

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from('cars')
      .select('*');

    if (error) {
      console.error('Error fetching cars:', error);
      return;
    }

    setCars(data || []);
  };

  const fetchSavedCars = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_cars')
      .select('car_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching saved cars:', error);
      return;
    }

    setSavedCars(data.map(item => item.car_id));
  };

  const fetchBookings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('bookings')
      .select('*');

    if (error) {
      console.error('Error fetching bookings:', error);
      return;
    }

    setBookings(data || []);
  };

  const locations = Array.from(new Set(cars.map(car => car.location))).sort();

  const addCar = async (carData: Omit<Car, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('cars')
      .insert([carData])
      .select()
      .single();

    if (error) {
      console.error('Error adding car:', error);
      toast.error(`Failed to add car: ${error.message}`);
      return;
    }

    if (data) {
      await fetchCars();
      toast.success('Car added successfully');
    } else {
      toast.error('Failed to add car: No data returned');
    }
  };

  const toggleSaved = async (carId: string) => {
    if (!user) return;

    const isSaved = savedCars.includes(carId);

    if (isSaved) {
      const { error } = await supabase
        .from('saved_cars')
        .delete()
        .eq('user_id', user.id)
        .eq('car_id', carId);

      if (error) {
        console.error('Error removing saved car:', error);
        return;
      }

      setSavedCars(prev => prev.filter(id => id !== carId));
    } else {
      const { error } = await supabase
        .from('saved_cars')
        .insert([{ user_id: user.id, car_id: carId }]);

      if (error) {
        console.error('Error saving car:', error);
        return;
      }

      setSavedCars(prev => [...prev, carId]);
    }
  };

  const bookCar = async (
    carId: string,
    fromDate: string,
    toDate: string,
    bookingData: any
  ): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to book a car');
      return false;
    }

    try {
      console.log('Booking car with data:', {
        carId,
        fromDate,
        toDate,
        bookingData,
        userId: user.id
      });

      // Validate date range
      if (!isDateRangeAvailable(carId, fromDate, toDate)) {
        toast.error('Selected dates are not available');
        return false;
      }

      // Upload driving license if provided
      let driving_license_url = '';
      if (bookingData.drivingLicense) {
        try {
          const fileExt = bookingData.drivingLicense.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}.${fileExt}`;

          console.log('Uploading driving license:', fileName);

          const { error: uploadError, data } = await supabase.storage
            .from('driving-licenses')
            .upload(fileName, bookingData.drivingLicense);

          if (uploadError) {
            console.error('Error uploading driving license:', uploadError);
            toast.error('Failed to upload driving license. Please try again or contact support.');
            return false;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('driving-licenses')
            .getPublicUrl(fileName);

          driving_license_url = publicUrl;
          console.log('Driving license uploaded successfully:', driving_license_url);
        } catch (error) {
          console.error('Error handling driving license upload:', error);
          toast.error('Error handling driving license. Please try again or contact support.');
          return false;
        }
      }

      console.log('Creating booking record...');

      // Create booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          user_id: user.id,
          car_id: carId,
          start_date: fromDate,
          end_date: toDate,
          name: bookingData.name,
          mobile_number: bookingData.mobileNumber,
          note: bookingData.note,
          driving_license_url: driving_license_url || null,
          collateral_type: bookingData.collateralType,
          collateral_details: {
            amount: bookingData.collateral.amount,
            gadgets: bookingData.collateral.gadgets,
            vehicles: bookingData.collateral.vehicles
          }
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        toast.error(`Failed to create booking: ${error.message}`);
        return false;
      }

      if (!data) {
        console.error('No data returned from booking creation');
        toast.error('No data returned from booking creation');
        return false;
      }

      console.log('Booking created successfully:', data);

      // Refresh bookings list
      await fetchBookings();
      toast.success('Car booked successfully!');
      return true;
    } catch (error) {
      console.error('Error booking car:', error);
      toast.error('Failed to book car');
      return false;
    }
  };

  const isCarBookedOnDate = (carId: string, date: string): boolean => {
    return bookings.some(booking =>
      booking.car_id === carId &&
      new Date(date) >= new Date(booking.start_date) &&
      new Date(date) < new Date(booking.end_date)
    );
  };

  const isDateRangeAvailable = (carId: string, fromDate: string, toDate: string): boolean => {
    return !bookings.some(booking =>
      booking.car_id === carId &&
      new Date(fromDate) < new Date(booking.end_date) &&
      new Date(toDate) > new Date(booking.start_date)
    );
  };

  const getNextAvailableDate = (carId: string): string | null => {
    const carBookings = bookings
      .filter(b => b.car_id === carId)
      .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());

    if (carBookings.length === 0) return null;

    const lastBooking = carBookings[carBookings.length - 1];
    const nextDate = new Date(lastBooking.end_date);
    return nextDate.toISOString().split('T')[0];
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = !selectedLocation || car.location === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  const getSavedCars = () => {
    return cars.filter(car => savedCars.includes(car.id));
  };

  const updateCar = async (carId: string, carData: Partial<Omit<Car, 'id' | 'created_at' | 'updated_at'>>) => {
    const { error } = await supabase
      .from('cars')
      .update(carData)
      .eq('id', carId);

    if (error) {
      console.error('Error updating car:', error);
      toast.error(`Failed to update car: ${error.message}`);
      return;
    }

    await fetchCars();
    toast.success('Car updated successfully');
  };

  const deleteCar = async (carId: string) => {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', carId);

    if (error) {
      console.error('Error deleting car:', error);
      toast.error(`Failed to delete car: ${error.message}`);
      return;
    }

    await fetchCars();
    toast.success('Car deleted successfully');
  };

  const uploadImage = async (files: File[]): Promise<string[]> => {
    try {
      const uploadPromises = files.map(async (file) => {
        // Generate a unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `images/${fileName}`;

        // Attempt to upload
        const { data, error: uploadError } = await supabase.storage
          .from('cars')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          if (uploadError.message.includes('bucket')) {
            throw new Error('Storage not properly configured. Please contact support.');
          }
          throw uploadError;
        }

        if (!data) {
          throw new Error('Upload successful but no data returned');
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('cars')
          .getPublicUrl(filePath);

        if (!publicUrl) {
          throw new Error('Failed to get public URL for uploaded image');
        }

        return publicUrl;
      });

      // Wait for all uploads to complete
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  return (
    <CarContext.Provider
      value={{
        cars,
        savedCars,
        searchTerm,
        selectedDate,
        selectedLocation,
        locations,
        setSearchTerm,
        setSelectedDate,
        setSelectedLocation,
        toggleSaved,
        bookCar,
        isCarBookedOnDate,
        isDateRangeAvailable,
        getNextAvailableDate,
        filteredCars,
        getSavedCars,
        addCar,
        updateCar,
        deleteCar,
        uploadImage
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
};

export default CarProvider;