/*
  # Seed Initial Cars Data

  This migration adds initial car data to the cars table.

  1. Changes
    - Insert 3 initial cars with their details:
      - Maruti Swift (Hatchback)
      - Hyundai Creta (SUV)
      - Tata Nexon (Compact SUV)

  2. Notes
    - Each car includes complete details including images, specifications, and pricing
    - Images are sourced from Unsplash
*/

DO $$ 
BEGIN
  -- Check if the cars table exists
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'cars'
  ) THEN
    -- Insert initial cars
    INSERT INTO cars (
      name, type, image, images, fuel_type, transmission, 
      seating_capacity, mileage, rating, price_per_day, location
    ) VALUES 
    (
      'Maruti Swift',
      'Hatchback',
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24',
      ARRAY[
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2',
        'https://images.unsplash.com/photo-1583267746897-2cf415887172'
      ],
      'Petrol',
      'Manual',
      5,
      '23.2 km/l',
      4.3,
      1200,
      'Delhi'
    ),
    (
      'Hyundai Creta',
      'SUV',
      'https://images.unsplash.com/photo-1609152958068-7d12aa3b804a',
      ARRAY[
        'https://images.unsplash.com/photo-1609152958068-7d12aa3b804a',
        'https://images.unsplash.com/photo-1550355291-bbee04a92027',
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8'
      ],
      'Diesel',
      'Automatic',
      5,
      '17.8 km/l',
      4.5,
      2200,
      'Mumbai'
    ),
    (
      'Tata Nexon',
      'Compact SUV',
      'https://images.unsplash.com/photo-1633116519557-6d3ee273d3d1',
      ARRAY[
        'https://images.unsplash.com/photo-1633116519557-6d3ee273d3d1',
        'https://images.unsplash.com/photo-1542362567-b07e54358753',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70'
      ],
      'Petrol',
      'Manual',
      5,
      '21.5 km/l',
      4.2,
      1800,
      'Bangalore'
    );
  END IF;
END $$;