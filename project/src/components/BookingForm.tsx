import React, { useState, useEffect } from 'react';
import { X, Calendar, Upload, CreditCard, Smartphone, Car, AlertCircle, Phone } from 'lucide-react';
import { Car as CarType, BookingFormData, CollateralType } from '../types';
import { useCars } from '../context/CarContext';

interface BookingFormProps {
  car: CarType;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ car, onClose }) => {
  const { bookCar, selectedDate, isCarBookedOnDate, isDateRangeAvailable } = useCars();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Get current date for minimum selectable date
  const currentDate = new Date().toISOString().split('T')[0];

  // Parse the selected date from context
  const startDate = new Date(selectedDate);
  const tomorrow = new Date(startDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [formData, setFormData] = useState<BookingFormData>({
    startDate: startDate,
    endDate: tomorrow,
    name: '',
    mobileNumber: '',
    note: '',
    drivingLicense: null,
    collateralType: 'amount',
    collateral: {
      amount: 0,
      gadgets: '',
      vehicles: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update start date when selectedDate changes
  useEffect(() => {
    const newStartDate = new Date(selectedDate);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + 1);

    setFormData(prev => ({
      ...prev,
      startDate: newStartDate,
      endDate: newEndDate
    }));
  }, [selectedDate]);

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const date = new Date(value);

    // Check if the selected date is already booked
    if (field === 'startDate' && isCarBookedOnDate(car.id, value)) {
      setErrors(prev => ({
        ...prev,
        startDate: 'This date is already booked'
      }));
      return;
    }

    // Update the form data
    setFormData(prev => {
      const newData = { ...prev, [field]: date };

      // If changing start date and it's after or equal to end date, adjust end date
      if (field === 'startDate' && date >= prev.endDate) {
        const newEndDate = new Date(date);
        newEndDate.setDate(newEndDate.getDate() + 1);
        newData.endDate = newEndDate;
      }

      return newData;
    });

    // Clear error if exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Check date range availability
    checkDateRangeAvailability();
  };

  const checkDateRangeAvailability = () => {
    const fromDate = formatDate(formData.startDate);
    const toDate = formatDate(formData.endDate);

    if (!isDateRangeAvailable(car.id, fromDate, toDate)) {
      setErrors(prev => ({
        ...prev,
        dateRange: 'Selected dates overlap with an existing booking'
      }));
    } else {
      // Clear the error if it exists
      if (errors.dateRange) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.dateRange;
          return newErrors;
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof BookingFormData] as Record<string, any>,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error if exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCollateralTypeChange = (type: CollateralType) => {
    setFormData(prev => ({ ...prev, collateralType: type }));

    // Clear errors related to collateral
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors['collateral.amount'];
      delete newErrors['collateral.gadgets'];
      delete newErrors['collateral.vehicles'];
      return newErrors;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, drivingLicense: e.target.files![0] }));

      // Clear error if exists
      if (errors.drivingLicense) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.drivingLicense;
          return newErrors;
        });
      }
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Check if start date is already booked
      const startDateStr = formatDate(formData.startDate);
      if (isCarBookedOnDate(car.id, startDateStr)) {
        newErrors.startDate = 'This date is already booked';
      }

      if (formData.startDate >= formData.endDate) {
        newErrors.endDate = 'End date must be after start date';
      }

      // Check if the date range is available
      const fromDate = formatDate(formData.startDate);
      const toDate = formatDate(formData.endDate);
      if (!isDateRangeAvailable(car.id, fromDate, toDate)) {
        newErrors.dateRange = 'Selected dates overlap with an existing booking';
      }
    } else if (step === 2) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = 'Mobile number is required';
      } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
      }

      if (!formData.drivingLicense) {
        newErrors.drivingLicense = 'Driving license is required';
      }
    } else if (step === 3) {
      // Validate based on selected collateral type
      if (formData.collateralType === 'amount') {
        if (!formData.collateral.amount || formData.collateral.amount <= 0) {
          newErrors['collateral.amount'] = 'Valid amount is required';
        } else if (formData.collateral.amount < 1000) {
          newErrors['collateral.amount'] = 'Minimum collateral amount is ₹1000';
        }
      } else if (formData.collateralType === 'gadgets') {
        if (!formData.collateral.gadgets.trim()) {
          newErrors['collateral.gadgets'] = 'At least one gadget is required';
        }
      } else if (formData.collateralType === 'vehicles') {
        if (!formData.collateral.vehicles.trim()) {
          newErrors['collateral.vehicles'] = 'At least one vehicle is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStep(currentStep)) {
      // Book the car for the selected date range
      const fromDate = formatDate(formData.startDate);
      const toDate = formatDate(formData.endDate);
      bookCar(car.id, fromDate, toDate, formData);
      setBookingSuccess(true);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const calculateTotalPrice = (): number => {
    // Calculate days excluding the end date (checkout date)
    const days = Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days * car.price_per_day;
  };

  // Check if the car is booked on the selected date
  const isBookedOnSelectedDate = isCarBookedOnDate(car.id, formatDate(formData.startDate));

  // Check if the date range is available
  const isRangeAvailable = isDateRangeAvailable(
    car.id,
    formatDate(formData.startDate),
    formatDate(formData.endDate)
  );

  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden w-full max-w-md p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
            <p className="text-gray-400 mb-6">
              Your booking for {car.name} has been confirmed from {formData.startDate.toLocaleDateString()} to {formData.endDate.toLocaleDateString()} (checkout).
            </p>
            <button
              onClick={onClose}
              className="w-full bg-amber-500 text-black py-2 px-4 rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If car is already booked on the selected date, show disabled form
  if (isBookedOnSelectedDate) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden w-full max-w-md relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 bg-gray-800 bg-opacity-80 rounded-full shadow-sm z-10 hover:bg-gray-700"
          >
            <X size={20} className="text-gray-300" />
          </button>

          <div className="p-5">
            <h2 className="text-2xl font-bold text-white mb-4">Book {car.name}</h2>

            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">This car is not available</h3>
              <p className="text-gray-400 mb-4">
                We're sorry, but this car is already booked for {formData.startDate.toLocaleDateString()}.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-gray-700 text-gray-400 py-2 px-4 rounded-md cursor-not-allowed"
              >
                Unavailable
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-gray-800 bg-opacity-80 rounded-full shadow-sm z-10 hover:bg-gray-700"
        >
          <X size={20} className="text-gray-300" />
        </button>

        <div className="p-5">
          <h2 className="text-2xl font-bold text-white mb-4">Book {car.name}</h2>

          <div className="mb-6">
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep === step
                    ? 'bg-amber-500 text-black'
                    : currentStep > step
                      ? 'bg-green-900/50 text-green-400 border border-green-600'
                      : 'bg-gray-800 text-gray-400'
                    }`}
                >
                  {currentStep > step ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-between">
                <span className="text-xs text-gray-500 bg-white px-2">Dates</span>
                <span className="text-xs text-gray-500 bg-white px-2">Details</span>
                <span className="text-xs text-gray-500 bg-white px-2">Collateral</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-2">Select Dates</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    From Date*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar size={18} className="text-amber-500" />
                    </div>
                    <input
                      type="date"
                      value={formatDate(formData.startDate)}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                      min={currentDate}
                      className={`w-full pl-10 pr-3 py-2 bg-gray-800 text-white border ${errors.startDate ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500`}
                    />
                  </div>
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    To Date (Checkout)*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar size={18} className="text-amber-500" />
                    </div>
                    <input
                      type="date"
                      value={formatDate(formData.endDate)}
                      onChange={(e) => handleDateChange('endDate', e.target.value)}
                      min={formatDate(formData.startDate)}
                      className={`w-full pl-10 pr-3 py-2 bg-gray-800 text-white border ${errors.endDate ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500`}
                    />
                  </div>
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    The car will be available for others starting on the checkout date.
                  </p>
                </div>

                {errors.dateRange && (
                  <div className="p-3 bg-red-900/50 border border-red-800 rounded-md flex items-start">
                    <AlertCircle size={18} className="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-400">{errors.dateRange}</p>
                  </div>
                )}

                <div className="mt-2">
                  {!isRangeAvailable && (
                    <div className="p-2 bg-gray-800 rounded-md">
                      <p className="font-medium text-red-400">Selected dates are not available</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Price per day:</span>
                    <span className="font-medium text-white">₹{car.price_per_day}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Number of days:</span>
                    <span className="font-medium text-white">
                      {Math.max(1, Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)) - 1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span className="font-medium text-white">Total:</span>
                    <span className="font-bold text-amber-500">₹{calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-2">Personal Details</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full px-3 py-2 bg-gray-800 text-white border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Mobile Number*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone size={18} className="text-amber-500" />
                    </div>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your 10-digit mobile number"
                      maxLength={10}
                      className={`w-full pl-10 pr-3 py-2 bg-gray-800 text-white border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500`}
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="mt-1 text-sm text-red-400">{errors.mobileNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Note (Optional)
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Any special requests or notes"
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Driving License*
                  </label>
                  <div className={`border-2 border-dashed rounded-md p-4 text-center bg-gray-800 ${errors.drivingLicense ? 'border-red-500' : 'border-gray-700'}`}>
                    {formData.drivingLicense ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 truncate">
                          {formData.drivingLicense.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, drivingLicense: null }))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-1 text-sm text-gray-400">
                          Upload driving license (PDF or Image)
                        </p>
                        <input
                          type="file"
                          id="drivingLicense"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor="drivingLicense"
                          className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-700 text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none cursor-pointer"
                        >
                          Browse Files
                        </label>
                      </div>
                    )}
                  </div>
                  {errors.drivingLicense && (
                    <p className="mt-1 text-sm text-red-400">{errors.drivingLicense}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-2">Collateral Details</h3>

                <div className="bg-gray-800 p-4 rounded-md mb-4">
                  <p className="text-sm text-gray-400 mb-3">Select collateral type:</p>

                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.collateralType === 'amount'}
                        onChange={() => handleCollateralTypeChange('amount')}
                        className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-700 bg-gray-700"
                      />
                      <span className="ml-2 text-white">Amount</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.collateralType === 'gadgets'}
                        onChange={() => handleCollateralTypeChange('gadgets')}
                        className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-700 bg-gray-700"
                      />
                      <span className="ml-2 text-white">Gadgets</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.collateralType === 'vehicles'}
                        onChange={() => handleCollateralTypeChange('vehicles')}
                        className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-700 bg-gray-700"
                      />
                      <span className="ml-2 text-white">Vehicles</span>
                    </label>
                  </div>
                </div>

                {formData.collateralType === 'amount' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Amount (₹)*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CreditCard size={18} className="text-amber-500" />
                      </div>
                      <input
                        type="number"
                        name="collateral.amount"
                        value={formData.collateral.amount}
                        onChange={handleInputChange}
                        placeholder="Enter amount in INR (min ₹1000)"
                        min="1000"
                        className={`w-full pl-10 pr-3 py-2 bg-gray-800 text-white border ${errors['collateral.amount'] ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500`}
                      />
                    </div>
                    {errors['collateral.amount'] && (
                      <p className="mt-1 text-sm text-red-400">{errors['collateral.amount']}</p>
                    )}
                  </div>
                )}

                {formData.collateralType === 'gadgets' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Gadgets*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Smartphone size={18} className="text-amber-500" />
                      </div>
                      <input
                        type="text"
                        name="collateral.gadgets"
                        value={formData.collateral.gadgets}
                        onChange={handleInputChange}
                        placeholder="e.g., Smartphone, Laptop, Tablet"
                        className={`w-full pl-10 pr-3 py-2 bg-gray-800 text-white border ${errors['collateral.gadgets'] ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500`}
                      />
                    </div>
                    {errors['collateral.gadgets'] && (
                      <p className="mt-1 text-sm text-red-400">{errors['collateral.gadgets']}</p>
                    )}
                  </div>
                )}

                {formData.collateralType === 'vehicles' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Vehicles*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Car size={18} className="text-amber-500" />
                      </div>
                      <input
                        type="text"
                        name="collateral.vehicles"
                        value={formData.collateral.vehicles}
                        onChange={handleInputChange}
                        placeholder="e.g., Car.Bike.Scooter"
                        className={`w-full pl-10 pr-3 py-2 bg-gray-800 text-white border ${errors['collateral.vehicles'] ? 'border-red-500' : 'border-gray-700'} rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500`}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Separate multiple vehicles with dots (e.g., Car.Truck.Bike)
                    </p>
                    {errors['collateral.vehicles'] && (
                      <p className="mt-1 text-sm text-red-400">{errors['collateral.vehicles']}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  Cancel
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`px-4 py-2 rounded-md ${currentStep === 1 && errors.dateRange
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-amber-500 text-black hover:bg-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-500'
                    }`}
                  disabled={currentStep === 1 && !!errors.dateRange}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-black rounded-md hover:bg-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;