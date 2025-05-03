import { Car } from '../types';

export const cars: Car[] = [
  {
    id: '1',
    name: 'Maruti Swift',
    type: 'Hatchback',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bWFydXRpJTIwc3dpZnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bWFydXRpJTIwc3dpZnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNhciUyMGludGVyaW9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1583267746897-2cf415887172?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXV0b21vYmlsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    ],
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 5,
    mileage: '23.2 km/l',
    rating: 4.3,
    pricePerDay: 1200,
    location: 'Delhi',
    bookedDates: []
  },
  {
    id: '2',
    name: 'Hyundai Creta',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1609152958068-7d12aa3b804a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHl1bmRhaSUyMGNyZXRhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    images: [
      'https://images.unsplash.com/photo-1609152958068-7d12aa3b804a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHl1bmRhaSUyMGNyZXRhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNhciUyMGludGVyaW9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
    ],
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seatingCapacity: 5,
    mileage: '17.8 km/l',
    rating: 4.5,
    pricePerDay: 2200,
    location: 'Mumbai',
    bookedDates: [new Date().toISOString().split('T')[0]] // Current date is booked
  },
  {
    id: '3',
    name: 'Tata Nexon',
    type: 'Compact SUV',
    image: 'https://images.unsplash.com/photo-1633116519557-6d3ee273d3d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dGF0YSUyMG5leG9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    images: [
      'https://images.unsplash.com/photo-1633116519557-6d3ee273d3d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dGF0YSUyMG5leG9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGNhciUyMGludGVyaW9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8Y2FyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
    ],
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 5,
    mileage: '21.5 km/l',
    rating: 4.2,
    pricePerDay: 1800,
    location: 'Bangalore',
    bookedDates: []
  },
  {
    id: '4',
    name: 'Mahindra Scorpio',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1616788494672-ec7ca25fdda9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFoaW5kcmElMjBzY29ycGlvfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    images: [
      'https://images.unsplash.com/photo-1616788494672-ec7ca25fdda9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFoaW5kcmElMjBzY29ycGlvfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGNhciUyMGludGVyaW9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    ],
    fuelType: 'Diesel',
    transmission: 'Manual',
    seatingCapacity: 7,
    mileage: '15.4 km/l',
    rating: 4.0,
    pricePerDay: 2500,
    location: 'Chennai',
    bookedDates: []
  },
  {
    id: '5',
    name: 'Toyota Innova',
    type: 'MPV',
    image: 'https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dG95b3RhJTIwaW5ub3ZhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    images: [
      'https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dG95b3RhJTIwaW5ub3ZhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8Y2FyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyJTIwaW50ZXJpb3J8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    ],
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seatingCapacity: 7,
    mileage: '14.5 km/l',
    rating: 4.7,
    pricePerDay: 3000,
    location: 'Hyderabad',
    bookedDates: [
      // Add a date 1 day after current date
      new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
    ]
  },
  {
    id: '6',
    name: 'Honda City',
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1609059233178-e5c679a4c6df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG9uZGElMjBjaXR5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    images: [
      'https://images.unsplash.com/photo-1609059233178-e5c679a4c6df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG9uZGElMjBjaXR5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1583267746897-2cf415887172?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YXV0b21vYmlsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2FyJTIwaW50ZXJpb3J8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    ],
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 5,
    mileage: '19.5 km/l',
    rating: 4.4,
    pricePerDay: 1900,
    location: 'Pune',
    bookedDates: []
  }
];