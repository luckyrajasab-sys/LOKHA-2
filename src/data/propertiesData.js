export const initialProperties = [
  {
    id: 'lokha-101',
    title: 'Prestige Lakeside Habitat 3 BHK Apartment',
    locality: 'Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    purpose: 'sale', // 'sale' | 'rent' | 'commercial'
    propertyType: 'Apartment', // 'Apartment' | 'Villa' | 'Plot' | 'Office' | 'PG'
    price: 8500000, // ₹85 Lakh
    maintenance: 4500,
    bhk: 3,
    bathrooms: 3,
    parking: 2,
    area: 1450,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: '2 days ago',
    verified: true,
    featured: true,
    furnishing: 'Semi-Furnished',
    floor: '7th of 18 Floors',
    facing: 'East Facing',
    mapCoords: { x: 38, y: 44, lat: 12.9698, lng: 77.7499 },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Elegantly crafted 3 BHK sunlit apartment in prime Whitefield near ITPL corridor. Features expansive balconies with lake views, imported vitrified flooring, modular kitchen with chimney, and access to an 80-acre development with international standard sporting facilities.',
    amenities: [
      'Swimming Pool', 'Gym', 'Security', 'Power Backup', 'Clubhouse', 
      'Children\'s Play Area', 'Lift', 'Parking', 'Badminton Court', 'EV Charging'
    ],
    nearby: [
      { name: 'Kadugodi Tree Park Metro', distance: '1.2 km', type: 'Metro' },
      { name: 'The Deens Academy', distance: '1.8 km', type: 'School' },
      { name: 'Manipal Hospital Whitefield', distance: '2.5 km', type: 'Hospital' },
      { name: 'ITPL Tech Park', distance: '3.1 km', type: 'IT Park' },
      { name: 'Nexus Shantiniketan Mall', distance: '3.4 km', type: 'Shopping' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 4600 },
      { year: '2022', pricePerSqFt: 5100 },
      { year: '2023', pricePerSqFt: 5450 },
      { year: '2024', pricePerSqFt: 5862 }
    ],
    agent: {
      name: 'Ramesh Sundaram',
      type: 'Verified Owner',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98450 12890',
      responseTime: 'Responds within 30 minutes',
      experience: 'Owner since 2018'
    }
  },
  {
    id: 'lokha-102',
    title: 'Sobha Silicon Oasis 4 BHK Luxury Villa',
    locality: 'Sarjapur Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    purpose: 'sale',
    propertyType: 'Villa',
    price: 12000000, // ₹1.2 Crore
    maintenance: 6000,
    bhk: 4,
    bathrooms: 4,
    parking: 2,
    area: 2100,
    possessionStatus: 'Ready to Move',
    postedBy: 'Agent',
    postedTime: '5 hours ago',
    verified: true,
    featured: true,
    furnishing: 'Unfurnished',
    floor: 'G + 2 Independent Villa',
    facing: 'North Facing',
    mapCoords: { x: 55, y: 62, lat: 12.9112, lng: 77.6833 },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Ultra-luxurious 4 BHK villa with private landscaped terrace garden, double-height living room, Italian marble finishes, solar heating system, and covered portico parking. Situated in a gated enclave of 120 villas with 24/7 security patrol.',
    amenities: [
      'Swimming Pool', 'Clubhouse', 'Gym', 'Security', 'Private Garden', 
      'Tennis Court', 'Power Backup', 'Water Treatment Plant', 'Jogging Track'
    ],
    nearby: [
      { name: 'Carmelaram Railway Station', distance: '2.0 km', type: 'Transport' },
      { name: 'Oakridge International School', distance: '1.5 km', type: 'School' },
      { name: 'Motherhood Hospital', distance: '3.2 km', type: 'Hospital' },
      { name: 'Wipro Corporate HQ', distance: '2.8 km', type: 'IT Park' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 4800 },
      { year: '2022', pricePerSqFt: 5200 },
      { year: '2023', pricePerSqFt: 5550 },
      { year: '2024', pricePerSqFt: 5714 }
    ],
    agent: {
      name: 'Aditi Deshmukh',
      type: 'Premier Partner Agent',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      phone: '+91 99023 44512',
      responseTime: 'Responds within 10 minutes',
      experience: '7 years with LOKHA'
    }
  },
  {
    id: 'lokha-103',
    title: 'Urban Bloom 2 BHK Modern Apartment',
    locality: 'HSR Layout',
    city: 'Bengaluru',
    state: 'Karnataka',
    purpose: 'rent',
    propertyType: 'Apartment',
    price: 42000, // ₹42,000/month
    deposit: 150000,
    maintenance: 3200,
    bhk: 2,
    bathrooms: 2,
    parking: 1,
    area: 1100,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: 'Just now',
    verified: true,
    featured: false,
    furnishing: 'Fully-Furnished',
    floor: '3rd of 5 Floors',
    facing: 'North-East Facing',
    mapCoords: { x: 42, y: 52, lat: 12.9121, lng: 77.6446 },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Chic, designer-furnished 2 BHK apartment in HSR Sector 2. Walking distance from prominent cafes and tech startups. Includes 55-inch smart TV, ergonomic work desks, Bosch washing machine, and 200 Mbps broadband setup.',
    amenities: [
      'Lift', 'Power Backup', 'Security', 'Covered Parking', 'High Speed Wifi',
      'Intercom', 'Gym'
    ],
    nearby: [
      { name: 'HSR BDA Complex', distance: '600 m', type: 'Shopping' },
      { name: 'Silk Board Junction Metro', distance: '1.4 km', type: 'Metro' },
      { name: 'Narayana Multispeciality Hospital', distance: '1.8 km', type: 'Hospital' },
      { name: 'Third Wave Coffee', distance: '250 m', type: 'Dining' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 34 },
      { year: '2022', pricePerSqFt: 36 },
      { year: '2023', pricePerSqFt: 38 },
      { year: '2024', pricePerSqFt: 38.1 }
    ],
    agent: {
      name: 'Kunal Verma',
      type: 'Verified Owner',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      phone: '+91 97412 88201',
      responseTime: 'Responds within 1 hour',
      experience: 'Owner'
    }
  },
  {
    id: 'lokha-104',
    title: 'Sea Crest 3 BHK Sea-Facing Residence',
    locality: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    purpose: 'sale',
    propertyType: 'Apartment',
    price: 28500000, // ₹2.85 Crore
    maintenance: 9500,
    bhk: 3,
    bathrooms: 3,
    parking: 2,
    area: 1650,
    possessionStatus: 'Ready to Move',
    postedBy: 'Agent',
    postedTime: '1 day ago',
    verified: true,
    featured: true,
    furnishing: 'Semi-Furnished',
    floor: '14th of 22 Floors',
    facing: 'West Facing (Arabian Sea view)',
    mapCoords: { x: 25, y: 35, lat: 19.0596, lng: 72.8295 },
    images: [
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Iconic Arabian Sea views from your living room and master suite. Located on Carter Road promenade with private elevator access, concierge desk, infinity rooftop lounge, and acoustic double-glazed windows.',
    amenities: [
      'Infinity Pool', 'Concierge Service', 'Gym', 'Sea View Deck', 'Power Backup',
      'Valet Parking', 'High Speed Elevators', 'Clubhouse'
    ],
    nearby: [
      { name: 'Carter Road Promenade', distance: '100 m', type: 'Park' },
      { name: 'Bandra Railway Station', distance: '2.1 km', type: 'Transport' },
      { name: 'Lilavati Hospital', distance: '2.4 km', type: 'Hospital' },
      { name: 'Bandra-Worli Sea Link', distance: '3.8 km', type: 'Highway' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 14500 },
      { year: '2022', pricePerSqFt: 15800 },
      { year: '2023', pricePerSqFt: 16500 },
      { year: '2024', pricePerSqFt: 17272 }
    ],
    agent: {
      name: 'Farhan Merchant',
      type: 'LOKHA Elite Specialist',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98201 55678',
      responseTime: 'Responds within 15 minutes',
      experience: '12 years in South Mumbai'
    }
  },
  {
    id: 'lokha-105',
    title: 'Hiranandani Heritage 3 BHK Penthouse',
    locality: 'Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    purpose: 'rent',
    propertyType: 'Apartment',
    price: 65000, // ₹65,000/month
    deposit: 250000,
    maintenance: 5000,
    bhk: 3,
    bathrooms: 3,
    parking: 2,
    area: 1550,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: '3 days ago',
    verified: true,
    featured: false,
    furnishing: 'Fully-Furnished',
    floor: '19th of 20 Floors',
    facing: 'Powai Lake Facing',
    mapCoords: { x: 30, y: 28, lat: 19.1176, lng: 72.9060 },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Lavish neoclassical architecture with scenic Powai lake panoramas. Fully air-conditioned with German kitchen fittings, jacuzzi in master bathroom, and walking access to Galleria Shopping Mall and IIT Bombay.',
    amenities: [
      'Swimming Pool', 'Gym', 'Squash Court', 'Lake View Balcony', 'Security',
      'Covered Parking', 'Intercom', 'Power Backup'
    ],
    nearby: [
      { name: 'IIT Bombay Main Gate', distance: '1.0 km', type: 'Education' },
      { name: 'Galleria Shopping Arcade', distance: '400 m', type: 'Shopping' },
      { name: 'Dr L H Hiranandani Hospital', distance: '800 m', type: 'Hospital' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 38 },
      { year: '2022', pricePerSqFt: 40 },
      { year: '2023', pricePerSqFt: 41 },
      { year: '2024', pricePerSqFt: 42 }
    ],
    agent: {
      name: 'Dr. Anita Roy',
      type: 'Verified Owner',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98190 23411',
      responseTime: 'Responds within 2 hours',
      experience: 'Owner'
    }
  },
  {
    id: 'lokha-106',
    title: 'DLF Magnolias 4 BHK Ultra-Luxury Condo',
    locality: 'Golf Course Road',
    city: 'Gurugram',
    state: 'Delhi NCR',
    purpose: 'sale',
    propertyType: 'Apartment',
    price: 45000000, // ₹4.5 Crore
    maintenance: 18000,
    bhk: 4,
    bathrooms: 5,
    parking: 3,
    area: 3800,
    possessionStatus: 'Ready to Move',
    postedBy: 'Agent',
    postedTime: '4 days ago',
    verified: true,
    featured: true,
    furnishing: 'Semi-Furnished',
    floor: '12th of 26 Floors',
    facing: 'Golf Course Facing',
    mapCoords: { x: 68, y: 22, lat: 28.4595, lng: 77.0266 },
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Bespoke living overlooking the prestigious DLF Golf & Country Club. Featuring 11-foot ceilings, VRV centralized air conditioning, double glazed acoustic glass, Olympic pool, and Michelin-inspired clubhouse restaurants.',
    amenities: [
      'Championship Golf Access', 'Olympic Pool', 'Spa & Wellness', 'Private Theatre',
      'Tennis Courts', 'Multi-tier Security', 'Helipad Access', 'Valet Parking'
    ],
    nearby: [
      { name: 'Sector 42-43 Rapid Metro', distance: '500 m', type: 'Metro' },
      { name: 'One Horizon Center', distance: '1.2 km', type: 'IT Park' },
      { name: 'Fortis Memorial Hospital', distance: '3.5 km', type: 'Hospital' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 10200 },
      { year: '2022', pricePerSqFt: 11000 },
      { year: '2023', pricePerSqFt: 11500 },
      { year: '2024', pricePerSqFt: 11842 }
    ],
    agent: {
      name: 'Vikramjit Singh',
      type: 'LOKHA Elite Specialist',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      phone: '+91 99100 88299',
      responseTime: 'Responds within 10 minutes',
      experience: '14 years in NCR Luxury'
    }
  },
  {
    id: 'lokha-107',
    title: 'Cyber One Grade-A Commercial IT Office Space',
    locality: 'Cyber City',
    city: 'Gurugram',
    state: 'Delhi NCR',
    purpose: 'commercial',
    propertyType: 'Office',
    price: 180000, // ₹1.8 Lakh/month
    deposit: 900000,
    maintenance: 14000,
    bhk: 0,
    bathrooms: 4,
    parking: 6,
    area: 3200,
    possessionStatus: 'Ready to Move',
    postedBy: 'Agent',
    postedTime: '1 week ago',
    verified: true,
    featured: false,
    furnishing: 'Fully-Furnished',
    floor: '6th of 16 Floors',
    facing: 'North Facing',
    mapCoords: { x: 72, y: 20, lat: 28.4905, lng: 77.0911 },
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Plug-and-play Grade-A corporate workspace with 48 workstations, 2 executive cabins, 12-seater boardroom, pantry, server room with precision AC, and 100% DG backup. LEED Gold certified building.',
    amenities: [
      'High Speed Lifts', 'Centrally Air Conditioned', 'Power Backup', 'Cafeteria',
      'Visitor Parking', 'BMS Automation', 'Fire Sprinklers'
    ],
    nearby: [
      { name: 'Cyber City Rapid Metro', distance: '200 m', type: 'Metro' },
      { name: 'CyberHub Food Plaza', distance: '300 m', type: 'Dining' },
      { name: 'IGI Airport Delhi', distance: '12 km', type: 'Airport' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 50 },
      { year: '2022', pricePerSqFt: 52 },
      { year: '2023', pricePerSqFt: 55 },
      { year: '2024', pricePerSqFt: 56.2 }
    ],
    agent: {
      name: 'Nitin Kapoor',
      type: 'Commercial Specialist',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98111 77654',
      responseTime: 'Responds within 1 hour',
      experience: '9 years Commercial'
    }
  },
  {
    id: 'lokha-108',
    title: 'Aparna Sarovar Zenith 3 BHK Premium Apartment',
    locality: 'Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    purpose: 'sale',
    propertyType: 'Apartment',
    price: 9200000, // ₹92 Lakh
    maintenance: 3800,
    bhk: 3,
    bathrooms: 3,
    parking: 2,
    area: 1520,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: '6 hours ago',
    verified: true,
    featured: false,
    furnishing: 'Semi-Furnished',
    floor: '11th of 24 Floors',
    facing: 'North Facing',
    mapCoords: { x: 50, y: 75, lat: 17.4401, lng: 78.3489 },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Well-appointed vastu-compliant home close to the Financial District. Features 2 large sit-out balconies overlooking Nallagandla lake, premium false ceiling with LED mood lights, and piped gas connection.',
    amenities: [
      'Swimming Pool', 'Gym', 'Clubhouse', 'Children\'s Play Area', 'Power Backup',
      'EV Charging Point', 'Supermarket on premises'
    ],
    nearby: [
      { name: 'Financial District', distance: '3.5 km', type: 'IT Park' },
      { name: 'Continental Hospitals', distance: '4.0 km', type: 'Hospital' },
      { name: 'Chirec International School', distance: '2.8 km', type: 'School' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 4900 },
      { year: '2022', pricePerSqFt: 5350 },
      { year: '2023', pricePerSqFt: 5750 },
      { year: '2024', pricePerSqFt: 6052 }
    ],
    agent: {
      name: 'Venkatesh Rao',
      type: 'Verified Owner',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98490 33412',
      responseTime: 'Responds within 30 minutes',
      experience: 'Owner'
    }
  },
  {
    id: 'lokha-109',
    title: 'My Home Bhooja 4 BHK Sky Villa',
    locality: 'HITEC City',
    city: 'Hyderabad',
    state: 'Telangana',
    purpose: 'sale',
    propertyType: 'Villa',
    price: 31000000, // ₹3.1 Crore
    maintenance: 11000,
    bhk: 4,
    bathrooms: 4,
    parking: 3,
    area: 3450,
    possessionStatus: 'Ready to Move',
    postedBy: 'Agent',
    postedTime: '1 day ago',
    verified: true,
    featured: true,
    furnishing: 'Fully-Furnished',
    floor: '28th of 35 Floors',
    facing: 'East Facing',
    mapCoords: { x: 54, y: 70, lat: 17.4474, lng: 78.3762 },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Palatial sky villa in the pinnacle of Hyderabad tech corridor. Unobstructed views of Durgam Cheruvu cable bridge and lake. Includes Italian imported designer furniture, Bang & Olufsen sound integration, and maid quarters.',
    amenities: [
      'Temperature Controlled Pool', 'Sky Lounge', 'Gym', 'Billiards Room',
      'Concierge', 'Tennis Court', 'Squash Court', 'Power Backup'
    ],
    nearby: [
      { name: 'Raidurg Metro Station', distance: '800 m', type: 'Metro' },
      { name: 'Inorbit Mall Cyberabad', distance: '1.2 km', type: 'Shopping' },
      { name: 'AIG Hospitals', distance: '2.5 km', type: 'Hospital' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 7500 },
      { year: '2022', pricePerSqFt: 8100 },
      { year: '2023', pricePerSqFt: 8600 },
      { year: '2024', pricePerSqFt: 8985 }
    ],
    agent: {
      name: 'Pradeep Reddy',
      type: 'LOKHA Elite Specialist',
      photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      phone: '+91 97000 66543',
      responseTime: 'Responds within 20 minutes',
      experience: '8 years in HITEC City'
    }
  },
  {
    id: 'lokha-110',
    title: 'Eon Waterfront 3 BHK Luxury Flat',
    locality: 'Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    purpose: 'sale',
    propertyType: 'Apartment',
    price: 13500000, // ₹1.35 Crore
    maintenance: 5500,
    bhk: 3,
    bathrooms: 3,
    parking: 2,
    area: 1720,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: '2 days ago',
    verified: true,
    featured: true,
    furnishing: 'Semi-Furnished',
    floor: '8th of 14 Floors',
    facing: 'North Facing (Mula-Mutha river view)',
    mapCoords: { x: 34, y: 56, lat: 18.5362, lng: 73.8939 },
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Sophisticated riverside apartment in Koregaon Park Annexe. Surrounded by lush greenery, upscale fine dining, and boutique galleries. Master suite includes walk-in wardrobe and rain shower.',
    amenities: [
      'Riverfront Walkway', 'Swimming Pool', 'Gym', 'Party Hall',
      '24x7 Security', 'Covered Parking', 'Solar Water Heating'
    ],
    nearby: [
      { name: 'Osho International Meditation', distance: '1.2 km', type: 'Landmark' },
      { name: 'Pune Railway Station', distance: '4.5 km', type: 'Transport' },
      { name: 'Ruby Hall Clinic', distance: '3.8 km', type: 'Hospital' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 6700 },
      { year: '2022', pricePerSqFt: 7150 },
      { year: '2023', pricePerSqFt: 7500 },
      { year: '2024', pricePerSqFt: 7848 }
    ],
    agent: {
      name: 'Sameer Joshi',
      type: 'Verified Owner',
      photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98220 11984',
      responseTime: 'Responds within 45 minutes',
      experience: 'Owner'
    }
  },
  {
    id: 'lokha-111',
    title: 'Blue Waters 2 BHK Garden Apartment',
    locality: 'Hinjewadi',
    city: 'Pune',
    state: 'Maharashtra',
    purpose: 'rent',
    propertyType: 'Apartment',
    price: 28000, // ₹28,000/month
    deposit: 80000,
    maintenance: 2500,
    bhk: 2,
    bathrooms: 2,
    parking: 1,
    area: 980,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: '4 hours ago',
    verified: true,
    featured: false,
    furnishing: 'Semi-Furnished',
    floor: '4th of 12 Floors',
    facing: 'East Facing',
    mapCoords: { x: 26, y: 52, lat: 18.5913, lng: 73.7389 },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Comfortable, airy 2 BHK apartment inside Hinjewadi Phase 1, right next to Infosys and TCS campuses. Quiet garden facing balcony, piped gas, and secure community living.',
    amenities: [
      'Clubhouse', 'Gym', 'Children\'s Play Area', 'Power Backup', 'Security', 'Lift'
    ],
    nearby: [
      { name: 'Infosys Phase 1 Circle', distance: '700 m', type: 'IT Park' },
      { name: 'Xion Mall Hinjewadi', distance: '1.5 km', type: 'Shopping' },
      { name: 'Upcoming Metro Line 3', distance: '500 m', type: 'Metro' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 25 },
      { year: '2022', pricePerSqFt: 27 },
      { year: '2023', pricePerSqFt: 28 },
      { year: '2024', pricePerSqFt: 28.5 }
    ],
    agent: {
      name: 'Pooja Kulkarni',
      type: 'Verified Owner',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+91 97640 55123',
      responseTime: 'Responds within 1 hour',
      experience: 'Owner'
    }
  },
  {
    id: 'lokha-112',
    title: 'Akshaya Abode 3 BHK Coastal Flat',
    locality: 'OMR',
    city: 'Chennai',
    state: 'Tamil Nadu',
    purpose: 'sale',
    propertyType: 'Apartment',
    price: 7800000, // ₹78 Lakh
    maintenance: 3600,
    bhk: 3,
    bathrooms: 3,
    parking: 1,
    area: 1380,
    possessionStatus: 'Ready to Move',
    postedBy: 'Agent',
    postedTime: '3 days ago',
    verified: true,
    featured: false,
    furnishing: 'Unfurnished',
    floor: '5th of 15 Floors',
    facing: 'South-East Facing',
    mapCoords: { x: 74, y: 78, lat: 12.9716, lng: 80.2437 },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Well ventilated 3 BHK apartment along Chennai IT Expressway (OMR). Features cross-ventilation, sea breeze, modular electrical fittings, and extensive open landscape with water bodies.',
    amenities: [
      'Swimming Pool', 'Gym', 'Badminton Court', 'Lawn Tennis', 'Security',
      'Power Backup', '24x7 Water Supply'
    ],
    nearby: [
      { name: 'TIDEL Park', distance: '3.8 km', type: 'IT Park' },
      { name: 'Apollo Speciality Hospital OMR', distance: '1.4 km', type: 'Hospital' },
      { name: 'ECR Beach Access', distance: '2.5 km', type: 'Beach' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 4900 },
      { year: '2022', pricePerSqFt: 5200 },
      { year: '2023', pricePerSqFt: 5400 },
      { year: '2024', pricePerSqFt: 5652 }
    ],
    agent: {
      name: 'Karthik Subramanian',
      type: 'Verified Agent',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phone: '+91 94440 88712',
      responseTime: 'Responds within 30 minutes',
      experience: '6 years in Chennai OMR'
    }
  },
  {
    id: 'lokha-113',
    title: 'Adyar Green Manor 4 BHK Independent Villa',
    locality: 'Adyar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    purpose: 'sale',
    propertyType: 'Villa',
    price: 34000000, // ₹3.4 Crore
    maintenance: 8000,
    bhk: 4,
    bathrooms: 4,
    parking: 3,
    area: 3100,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: '5 days ago',
    verified: true,
    featured: true,
    furnishing: 'Semi-Furnished',
    floor: 'Independent G+2',
    facing: 'North Facing',
    mapCoords: { x: 77, y: 72, lat: 13.0012, lng: 80.2565 },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Prestige living in historic, tranquil Adyar. Custom teakwood doors, expansive private terrace garden, dedicated home office, private lift shaft, and solar net metering.',
    amenities: [
      'Private Garden', 'Security', 'Covered Parking', 'Solar Power', 'Power Backup',
      'Rainwater Harvesting'
    ],
    nearby: [
      { name: 'Theosophical Society Gardens', distance: '1.0 km', type: 'Park' },
      { name: 'Fortis Malar Hospital', distance: '1.2 km', type: 'Hospital' },
      { name: 'IIT Madras', distance: '2.5 km', type: 'Education' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 9800 },
      { year: '2022', pricePerSqFt: 10400 },
      { year: '2023', pricePerSqFt: 10800 },
      { year: '2024', pricePerSqFt: 10967 }
    ],
    agent: {
      name: 'R. Meenakshi',
      type: 'Verified Owner',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98401 22904',
      responseTime: 'Responds within 2 hours',
      experience: 'Owner'
    }
  },
  {
    id: 'lokha-114',
    title: 'Godrej Palm Retreat 3 BHK Resort Residences',
    locality: 'Sector 150',
    city: 'Noida',
    state: 'Delhi NCR',
    purpose: 'sale',
    propertyType: 'Apartment',
    price: 11500000, // ₹1.15 Crore
    maintenance: 4200,
    bhk: 3,
    bathrooms: 3,
    parking: 2,
    area: 1650,
    possessionStatus: 'Under Construction',
    postedBy: 'Agent',
    postedTime: '1 day ago',
    verified: true,
    featured: true,
    furnishing: 'Unfurnished',
    floor: '12th of 22 Floors',
    facing: 'Green Belt Facing',
    mapCoords: { x: 75, y: 25, lat: 28.4682, lng: 77.5042 },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Noida\'s first resort-style residential enclave with low-density masterplan. 80% open lush green spaces, 40-acre Shaheed Bhagat Singh park opposite, and seamless connectivity via Noida-Greater Noida Expressway.',
    amenities: [
      'Resort Clubhouse', 'Floating Cabanas', 'Gym', 'Wave Pool',
      'Multi-tier Security', 'Power Backup', 'Sports Arena'
    ],
    nearby: [
      { name: 'Sector 148 Aqua Line Metro', distance: '1.5 km', type: 'Metro' },
      { name: 'Noida-Gr Noida Expressway', distance: '800 m', type: 'Highway' },
      { name: 'Upcoming Jewar International Airport', distance: '28 km', type: 'Airport' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 5800 },
      { year: '2022', pricePerSqFt: 6200 },
      { year: '2023', pricePerSqFt: 6600 },
      { year: '2024', pricePerSqFt: 6969 }
    ],
    agent: {
      name: 'Mohit Chawla',
      type: 'Godrej Channel Partner',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      phone: '+91 99990 44321',
      responseTime: 'Responds within 10 minutes',
      experience: '5 years with Godrej Properties'
    }
  },
  {
    id: 'lokha-115',
    title: 'Aerotropolis Greenfield Residential Villa Plot',
    locality: 'Devanahalli',
    city: 'Bengaluru',
    state: 'Karnataka',
    purpose: 'sale',
    propertyType: 'Plot',
    price: 9500000, // ₹95 Lakh
    maintenance: 1200,
    bhk: 0,
    bathrooms: 0,
    parking: 2,
    area: 2400,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: '3 days ago',
    verified: true,
    featured: false,
    furnishing: 'Unfurnished',
    floor: 'Clear BDA Approved Plot',
    facing: 'North-East Facing',
    mapCoords: { x: 45, y: 15, lat: 13.2458, lng: 77.7126 },
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Prime 2,400 sq ft gated villa plot in high-growth North Bengaluru Aerotropolis corridor. 40-foot wide asphalt roads, underground cabling, avenue plantation, and complete clear titles with bank loan approvals.',
    amenities: [
      'Gated Security', 'Underground Electricity', 'Sewage Treatment Plant',
      'Compound Wall', 'Street Lights', 'Parks & Play Area'
    ],
    nearby: [
      { name: 'Kempegowda International Airport (BLR)', distance: '8.5 km', type: 'Airport' },
      { name: 'KIADB Aerospace SEZ', distance: '4.2 km', type: 'SEZ' },
      { name: 'NH 44 Hyderabad Highway', distance: '1.2 km', type: 'Highway' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 2900 },
      { year: '2022', pricePerSqFt: 3300 },
      { year: '2023', pricePerSqFt: 3700 },
      { year: '2024', pricePerSqFt: 3958 }
    ],
    agent: {
      name: 'Girish Gowda',
      type: 'Verified Owner',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      phone: '+91 94480 77123',
      responseTime: 'Responds within 1 hour',
      experience: 'Owner'
    }
  },
  {
    id: 'lokha-116',
    title: 'Indiranagar 100ft Road 3 BHK Designer Flat',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    purpose: 'rent',
    propertyType: 'Apartment',
    price: 75000, // ₹75,000/month
    deposit: 300000,
    maintenance: 4500,
    bhk: 3,
    bathrooms: 3,
    parking: 2,
    area: 1850,
    possessionStatus: 'Ready to Move',
    postedBy: 'Agent',
    postedTime: 'Yesterday',
    verified: true,
    featured: true,
    furnishing: 'Fully-Furnished',
    floor: '2nd of 4 Floors (Low rise)',
    facing: 'North Facing',
    mapCoords: { x: 44, y: 46, lat: 12.9784, lng: 77.6408 },
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Exclusive low-density boutique building tucked right off 100 Feet Road. Custom interior design, teak wood flooring in master bedroom, wine chiller, private bar counter, and soundproof double-glazed balconies.',
    amenities: [
      'Power Backup', 'Security', 'Covered Parking', 'Lift', 'Intercom',
      'High Speed Internet Ready'
    ],
    nearby: [
      { name: 'Indiranagar Metro Station', distance: '650 m', type: 'Metro' },
      { name: '100ft Road Dining & Shopping', distance: '150 m', type: 'Dining' },
      { name: 'Manipal Hospital HAL Airport Rd', distance: '2.0 km', type: 'Hospital' }
    ],
    priceTrend: [
      { year: '2021', pricePerSqFt: 36 },
      { year: '2022', pricePerSqFt: 38 },
      { year: '2023', pricePerSqFt: 40 },
      { year: '2024', pricePerSqFt: 40.5 }
    ],
    agent: {
      name: 'Deepak Nambiar',
      type: 'Verified Agent',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98860 33499',
      responseTime: 'Responds within 15 minutes',
      experience: '11 years in Indiranagar'
    }
  },
  {
    id: 'lokha-201',
    title: 'Greenwood Estate 3 BHK Penthouse',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    purpose: 'lease',
    propertyType: 'Apartment',
    price: 72000,
    deposit: 350000,
    leaseTenure: '3 Years',
    maintenance: 4000,
    bhk: 3,
    bathrooms: 3,
    parking: 2,
    area: 2100,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: 'Today',
    verified: true,
    featured: true,
    furnishing: 'Fully-Furnished',
    floor: '4th of 4 Floors (Penthouse)',
    facing: 'East Facing',
    mapCoords: { x: 45, y: 45, lat: 12.9719, lng: 77.6412 },
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'High-end 3 BHK penthouse leased directly by owner with EB bill verified documentation. Includes private terrace garden, Italian modular kitchen, and double covered basement parking.',
    amenities: ['Power Backup', 'Security', 'Covered Parking', 'Lift', 'Private Terrace', 'Gym'],
    nearby: [
      { name: '100ft Road Metro', distance: '500 m', type: 'Metro' },
      { name: 'Indiranagar Club', distance: '800 m', type: 'Club' }
    ],
    priceTrend: [
      { year: '2022', pricePerSqFt: 35 },
      { year: '2023', pricePerSqFt: 38 },
      { year: '2024', pricePerSqFt: 40 }
    ],
    agent: {
      name: 'Karthik Ramanathan',
      type: 'Verified Owner (EB Bill Verified)',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98450 78120',
      responseTime: 'Responds within 20 mins',
      experience: 'Owner on LOKHA'
    }
  },
  {
    id: 'lokha-202',
    title: 'Purva Windermere 4 BHK Luxury Duplex',
    locality: 'Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    purpose: 'lease',
    propertyType: 'Villa',
    price: 95000,
    deposit: 500000,
    leaseTenure: '2 Years',
    maintenance: 6000,
    bhk: 4,
    bathrooms: 4,
    parking: 2,
    area: 2600,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: '3 hours ago',
    verified: true,
    featured: true,
    furnishing: 'Semi-Furnished',
    floor: 'Duplex (G + 1)',
    facing: 'North Facing',
    mapCoords: { x: 39, y: 43, lat: 12.9665, lng: 77.7410 },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Expansive duplex home available for long-term lease. Verified under Family Member ownership with Ration card and EB documents. 24/7 security, club amenities, and international schools nearby.',
    amenities: ['Swimming Pool', 'Clubhouse', 'Gym', 'Security', 'Private Lawn', 'EV Charging'],
    nearby: [
      { name: 'Hopefarm Metro Station', distance: '1.1 km', type: 'Metro' },
      { name: 'ITPL', distance: '2.5 km', type: 'IT Park' }
    ],
    priceTrend: [
      { year: '2022', pricePerSqFt: 34 },
      { year: '2023', pricePerSqFt: 37 },
      { year: '2024', pricePerSqFt: 39 }
    ],
    agent: {
      name: 'Sunita & Arvind Nair',
      type: 'Family Verified Owner',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      phone: '+91 99012 33451',
      responseTime: 'Responds within 30 mins',
      experience: 'Owner on LOKHA'
    }
  },
  {
    id: 'lokha-203',
    title: 'Prestige Tech Center Commercial Floor',
    locality: 'Sarjapur Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    purpose: 'lease',
    propertyType: 'Office',
    price: 180000,
    deposit: 1200000,
    leaseTenure: '5 Years',
    maintenance: 12000,
    bhk: 0,
    bathrooms: 4,
    parking: 6,
    area: 3400,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: 'Yesterday',
    verified: true,
    featured: false,
    furnishing: 'Fully-Furnished',
    floor: '5th of 9 Floors',
    facing: 'East Facing',
    mapCoords: { x: 53, y: 60, lat: 12.9140, lng: 77.6850 },
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Grade-A plug-and-play corporate workspace on Sarjapur Outer Ring Road corridor. 55 workstations, 3 executive conference suites, server room, and high-capacity backup generators.',
    amenities: ['Central AC', 'Power Backup', 'Security', 'Dedicated Parking', 'Cafeteria', 'Fibre Internet'],
    nearby: [
      { name: 'Bellandur Metro', distance: '1.8 km', type: 'Metro' },
      { name: 'Ecospace Tech Park', distance: '900 m', type: 'IT Park' }
    ],
    priceTrend: [
      { year: '2022', pricePerSqFt: 50 },
      { year: '2023', pricePerSqFt: 53 },
      { year: '2024', pricePerSqFt: 55 }
    ],
    agent: {
      name: 'Vikramaditya Rao',
      type: 'Direct Commercial Owner',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      phone: '+91 97401 22899',
      responseTime: 'Responds within 1 hour',
      experience: 'Commercial Owner'
    }
  },
  {
    id: 'lokha-204',
    title: 'Olympia Opaline 3 BHK Sea View Residence',
    locality: 'OMR',
    city: 'Chennai',
    state: 'Tamil Nadu',
    purpose: 'lease',
    propertyType: 'Apartment',
    price: 48000,
    deposit: 250000,
    leaseTenure: '2 Years',
    maintenance: 3500,
    bhk: 3,
    bathrooms: 3,
    parking: 1,
    area: 1750,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: '2 days ago',
    verified: true,
    featured: true,
    furnishing: 'Semi-Furnished',
    floor: '12th of 19 Floors',
    facing: 'East Facing',
    mapCoords: { x: 70, y: 70, lat: 12.8258, lng: 80.2245 },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Coastal sea breeze 3 BHK on OMR IT Expressway corridor. TNEB verified electricity credentials and owner authentication.',
    amenities: ['Swimming Pool', 'Security', 'Covered Parking', 'Sea View Balcony', 'Clubhouse'],
    nearby: [
      { name: 'SIPCOT IT Park', distance: '1.5 km', type: 'IT Park' },
      { name: 'ECR Beach', distance: '3.0 km', type: 'Beach' }
    ],
    priceTrend: [
      { year: '2022', pricePerSqFt: 26 },
      { year: '2023', pricePerSqFt: 28 },
      { year: '2024', pricePerSqFt: 29 }
    ],
    agent: {
      name: 'S. Balasubramanian',
      type: 'Govt Proof Verified Owner',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phone: '+91 94440 65112',
      responseTime: 'Responds within 20 mins',
      experience: 'Owner on LOKHA'
    }
  },
  {
    id: 'lokha-205',
    title: 'Hiranandani Gardens 2 BHK Modern Home',
    locality: 'Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    purpose: 'lease',
    propertyType: 'Apartment',
    price: 85000,
    deposit: 400000,
    leaseTenure: '3 Years',
    maintenance: 5000,
    bhk: 2,
    bathrooms: 2,
    parking: 1,
    area: 1250,
    possessionStatus: 'Ready to Move',
    postedBy: 'Owner',
    postedTime: 'Just now',
    verified: true,
    featured: false,
    furnishing: 'Fully-Furnished',
    floor: '14th of 24 Floors',
    facing: 'North-East Facing',
    mapCoords: { x: 25, y: 35, lat: 19.1197, lng: 72.9056 },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    overview: 'Neoclassical architecture in prime Powai near lake. High floor with panoramic views, Adani Electricity verified ownership credentials.',
    amenities: ['Gym', 'Clubhouse', 'Swimming Pool', 'Security', 'Covered Parking', 'Intercom'],
    nearby: [
      { name: 'Powai Lake', distance: '500 m', type: 'Lake' },
      { name: 'Hiranandani Hospital', distance: '800 m', type: 'Hospital' }
    ],
    priceTrend: [
      { year: '2022', pricePerSqFt: 62 },
      { year: '2023', pricePerSqFt: 66 },
      { year: '2024', pricePerSqFt: 68 }
    ],
    agent: {
      name: 'Meera Chawla',
      type: 'Verified Owner',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+91 98200 44109',
      responseTime: 'Responds within 15 mins',
      experience: 'Owner on LOKHA'
    }
  }
];
