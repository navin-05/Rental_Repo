export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Car {
  id: string;
  name: string;
  type: string;
  image: string;
  images: string[];
  fuel_type: string;
  transmission: 'Manual' | 'Automatic' | 'AMT';
  seating_capacity: number;
  mileage: string;
  rating: number;
  price_per_day: number;
  location: string;
  created_at?: string;
  updated_at?: string;
}

export interface SavedCar {
  id: string;
  user_id: string;
  car_id: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  name: string;
  mobile_number: string;
  note?: string;
  driving_license_url: string;
  collateral_type: CollateralType;
  collateral_details: {
    amount?: number;
    gadgets?: string;
    vehicles?: string;
  };
  created_at: string;
  updated_at: string;
}

export type CollateralType = 'amount' | 'gadgets' | 'vehicles';

export interface BookingFormData {
  startDate: Date;
  endDate: Date;
  name: string;
  mobileNumber: string;
  note: string;
  drivingLicense: File | null;
  collateralType: CollateralType;
  collateral: {
    amount: number;
    gadgets: string;
    vehicles: string;
  };
}