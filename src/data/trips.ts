// Import all images - using placeholder images from logout.world as requested
export interface Trip {
  id: string;
  slug: string;
  title: string;
  category: string;
  region: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  basePrice: number;
  originalPrice?: number;
  currency: string;
  duration: string;
  shortDesc: string;
  image?: string;
  features?: string[];
  highlights?: string[];
}

export const upcomingTrips: Trip[] = [
  {
    id: "1",
    slug: "indias-highest-bungy",
    title: "India's highest bungy(117m)",
    category: "Adventure",
    region: "Rishikesh, Uttarakhand",
    difficulty: "Moderate",
    basePrice: 4600,
    currency: "INR",
    duration: "1 Day",
    shortDesc: "Experience the ultimate adrenaline rush with India's highest bungy jump!",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Professional instructors", "Safety equipment included", "Certificate"]
  },
  {
    id: "4",
    slug: "resin-art-weekend",
    title: "Resin art on a weekend",
    category: "Workshop",
    region: "Mumbai",
    difficulty: "Easy",
    basePrice: 1499,
    currency: "INR",
    duration: "Weekend",
    shortDesc: "Learn the art of resin crafting in this creative weekend workshop.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["All materials provided", "Expert guidance", "Take home your creation"]
  },
  {
    id: "5",
    slug: "nethravathi-trek",
    title: "Nethravathi Trek",
    category: "Trekking",
    region: "Karnataka",
    difficulty: "Moderate",
    basePrice: 3400,
    currency: "INR",
    duration: "1 Day, 1 Night",
    shortDesc: "Scenic trek through lush landscapes and river streams.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Camping under stars", "Local guide", "Simple meals"]
  },
  {
    id: "6",
    slug: "ganesh-festival-walk",
    title: "Ganesh Festival Walk",
    category: "Cultural",
    region: "Mumbai",
    difficulty: "Easy",
    basePrice: 700,
    currency: "INR",
    duration: "4 hours",
    shortDesc: "Experience the vibrant Ganesh festival celebrations.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Cultural immersion", "Local guide", "Festival experience"]
  },
  {
    id: "7",
    slug: "mumbai-midnight-cycling",
    title: "Mumbai Midnight cycling - south Bombay circuit",
    category: "Cycling",
    region: "Mumbai",
    difficulty: "Easy",
    basePrice: 399,
    currency: "INR",
    duration: "6 hours",
    shortDesc: "Explore Mumbai's iconic South Bombay on a midnight cycling tour.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Bicycle provided", "Night tour", "Safety gear", "Local guide"]
  },
  {
    id: "8",
    slug: "ooty-coonoor",
    title: "Ooty & Coonoor",
    category: "Hill Station",
    region: "Tamil Nadu",
    difficulty: "Easy",
    basePrice: 7499,
    currency: "INR",
    duration: "3 Days, 2 Nights",
    shortDesc: "Explore the beautiful hill stations of Ooty and Coonoor.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Toy train ride", "Tea gardens", "Scenic viewpoints", "Pleasant weather"]
  },
  {
    id: "9",
    slug: "spiti-valley-backpacking",
    title: "Ultimate Spiti valley Backpacking Trip",
    category: "Backpacking",
    region: "Himachal Pradesh",
    difficulty: "Hard",
    basePrice: 18999,
    currency: "INR",
    duration: "6 Nights, 7 Days",
    shortDesc: "Epic journey through the cold desert of Spiti Valley.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["High altitude adventure", "Monastery visits", "Local cultural experience", "Professional guide"]
  },
  {
    id: "10",
    slug: "coorg-scotland-india",
    title: "Coorg -The scotland of India",
    category: "Weekend Getaways",
    region: "Karnataka",
    difficulty: "Easy",
    basePrice: 5499,
    currency: "INR",
    duration: "2 Days, 1 Night",
    shortDesc: "Explore the coffee plantations and misty hills of Coorg.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Coffee plantation tour", "Scenic viewpoints", "Local cuisine", "Comfortable stay"]
  },
  {
    id: "11",
    slug: "gokarna-dandell-murudeshwar",
    title: "Gokarna-Dandell-Murudeshwar 2N/3D weekend trip",
    category: "Weekend Getaways",
    region: "Karnataka",
    difficulty: "Easy",
    basePrice: 5999,
    currency: "INR",
    duration: "2 Nights, 3 Days",
    shortDesc: "Beach and adventure combo with temples and water sports.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Beach activities", "Temple visits", "Adventure sports", "Scenic drives"]
  },
  {
    id: "12",
    slug: "munnar-kolukkumalai",
    title: "Munnar- Kolukkumalai Backpacking Trip",
    category: "Backpacking",
    region: "Kerala",
    difficulty: "Moderate",
    basePrice: 5999,
    currency: "INR",
    duration: "2 Days, 2 Nights",
    shortDesc: "Backpacking adventure through tea gardens and highest tea estate.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Tea plantation trek", "Sunrise views", "Backpacking experience", "Local stays"]
  },
  {
    id: "13",
    slug: "karoll-valley-trek",
    title: "Karoll valley Treak",
    category: "Trekking",
    region: "Himachal Pradesh",
    difficulty: "Moderate",
    basePrice: 1699,
    currency: "INR",
    duration: "1 Day, 1 Night",
    shortDesc: "Beautiful valley trek with stunning mountain views.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Valley views", "Mountain trekking", "Camping", "Local guide"]
  },
  {
    id: "14",
    slug: "yoga-teacher-training-100hr",
    title: "100 hour yoga teacher training course international",
    category: "Wellness",
    region: "Rishikesh",
    difficulty: "Easy",
    basePrice: 449,
    currency: "INR",
    duration: "13 Days, 12 Nights",
    shortDesc: "Internationally certified yoga teacher training program.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["International certification", "Expert instructors", "Accommodation included", "Vegetarian meals"]
  },
  {
    id: "15",
    slug: "discovery-surfing-session",
    title: "Discovery surfing one day session",
    category: "Water Sports",
    region: "Goa",
    difficulty: "Easy",
    basePrice: 2500,
    currency: "INR",
    duration: "1 Day",
    shortDesc: "Learn to surf with professional instructors in safe waters.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Professional instruction", "Equipment provided", "Safety briefing", "Beach location"]
  },
  {
    id: "16",
    slug: "kayaking-1-5-hours",
    title: "Kayaking time is 1.5 hours",
    category: "Water Sports",
    region: "Goa",
    difficulty: "Easy",
    basePrice: 600,
    currency: "INR",
    duration: "1.5 hours",
    shortDesc: "Extended kayaking session for better skill development.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Extended session", "Skill development", "Equipment included", "Scenic route"]
  },
  {
    id: "17",
    slug: "eclipse-dunes-jaisalmer",
    title: "Eclipse in the dunes jaislamer",
    category: "Desert Safari",
    region: "Rajasthan",
    difficulty: "Easy",
    basePrice: 17999,
    currency: "INR",
    duration: "3 Days, 2 Nights",
    shortDesc: "Witness the celestial eclipse from the golden dunes of Jaisalmer.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Eclipse viewing", "Desert camping", "Camel safari", "Cultural programs"]
  },
  {
    id: "18",
    slug: "kerala-group-tour",
    title: "Kerala group tour",
    category: "Group Tours",
    region: "Kerala",
    difficulty: "Easy",
    basePrice: 12990,
    currency: "INR",
    duration: "7 Days, 6 Nights",
    shortDesc: "Discover God's Own Country with backwaters, beaches, and hill stations.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Houseboat experience", "Beach resorts", "Hill station visits", "Cultural performances"]
  },
  {
    id: "19",
    slug: "chopata-tunganath-chandrashila",
    title: "Chopata tunganath with chandrashila treak",
    category: "Himalayan Treks",
    region: "Uttarakhand",
    difficulty: "Moderate",
    basePrice: 499,
    currency: "INR",
    duration: "2 Nights, 3 Days",
    shortDesc: "Trek to the highest Shiva temple and Chandrashila peak.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Temple trek", "Summit views", "Camping", "Spiritual experience"]
  },
  {
    id: "20",
    slug: "bhima-shekhar-trek",
    title: "Bhima Shekhar trick today's one night",
    category: "Trekking",
    region: "Maharashtra",
    difficulty: "Easy",
    basePrice: 1999,
    currency: "INR",
    duration: "1 Day, 1 Night",
    shortDesc: "Quick overnight trek to Bhima Shekhar with scenic views.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Overnight camping", "Scenic views", "Easy trek", "Local guide"]
  }
];

export const weekendGetaways: Trip[] = [
  {
    id: "w1",
    slug: "kodaikanal-camping",
    title: "Kodaikanal camping backpacking trip",
    category: "Weekend Getaways",
    region: "Tamil Nadu",
    difficulty: "Easy",
    basePrice: 5599,
    currency: "INR",
    duration: "2 Days, 1 Night",
    shortDesc: "Serene camping experience in the Princess of Hill Stations.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Lake views", "Camping gear provided", "Bonfire nights", "Nature walks"]
  },
  {
    id: "w2",
    slug: "udaipur-kumbhalgarh",
    title: "Udaipur Kumbhalgarh",
    category: "Weekend Getaways",
    region: "Rajasthan",
    difficulty: "Easy",
    basePrice: 7500,
    currency: "INR",
    duration: "2 Days, 2 Nights",
    shortDesc: "Royal experience in the city of lakes and historic forts.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Palace visits", "Boat rides", "Fort exploration", "Royal cuisine"]
  },
  {
    id: "w3",
    slug: "udaipur-mt-abu",
    title: "Udaipur mt.Abu",
    category: "Weekend Getaways",
    region: "Rajasthan",
    difficulty: "Easy",
    basePrice: 7500,
    currency: "INR",
    duration: "2 Days, 2 Nights",
    shortDesc: "Visit the lakes of Udaipur and the hill station of Mount Abu.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Lake city tour", "Hill station visit", "Dilwara temples", "Sunset point"]
  },
  {
    id: "w5",
    slug: "royal-rajasthan",
    title: "Royal Rajasthan",
    category: "Weekend Getaways",
    region: "Rajasthan",
    difficulty: "Easy",
    basePrice: 39000,
    currency: "INR",
    duration: "10 Nights, 11 Days",
    shortDesc: "Grand tour of Rajasthan's royal palaces and heritage sites.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Palace hotels", "Heritage sites", "Cultural shows", "Royal cuisine"]
  },
  {
    id: "w6",
    slug: "yulla-kanda-trek",
    title: "Yulla kanda trek",
    category: "Weekend Getaways",
    region: "Karnataka",
    difficulty: "Moderate",
    basePrice: 8000,
    currency: "INR",
    duration: "3 Days, 2 Nights",
    shortDesc: "Challenging trek through the Western Ghats.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Western Ghats", "Challenging trek", "Scenic views", "Wildlife spotting"]
  }
];

export const himalayanTreks: Trip[] = [
  {
    id: "h1",
    slug: "annapurna-base-camp",
    title: "Annapurna Bass camp",
    category: "Himalayan Treks",
    region: "Nepal",
    difficulty: "Hard",
    basePrice: 23000,
    currency: "INR",
    duration: "12 Days",
    shortDesc: "Classic Himalayan trek to the base of mighty Annapurna.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["High altitude trekking", "Mountain views", "Sherpa guides", "Tea house stays"]
  },
  {
    id: "h2",
    slug: "gaumukha-tapovan-trek",
    title: "Gaumukha tapovan trek",
    category: "Himalayan Treks",
    region: "Uttarakhand",
    difficulty: "Hard",
    basePrice: 21999,
    currency: "INR",
    duration: "8 Days, 7 Nights",
    shortDesc: "Trek to the source of the Ganges at Gaumukh and Tapovan meadows.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Ganges source", "High altitude", "Spiritual journey", "Glacier views"]
  },
  {
    id: "h3",
    slug: "valley-of-flowers",
    title: "Valley of flowers trek",
    category: "Himalayan Treks",
    region: "Uttarakhand",
    difficulty: "Moderate",
    basePrice: 8500,
    currency: "INR",
    duration: "6 Days, 5 Nights",
    shortDesc: "UNESCO World Heritage site famous for its endemic alpine flowers.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Rare flora", "Hemkund Sahib", "Alpine meadows", "Photography paradise"]
  },
  {
    id: "h4",
    slug: "kuari-pass-pangarchulla",
    title: "Kuari pass & pangarchulla trek - conquer the path of legends",
    category: "Himalayan Treks",
    region: "Uttarakhand",
    difficulty: "Hard",
    basePrice: 15500,
    currency: "INR",
    duration: "7 Days, 6 Nights",
    shortDesc: "Challenging trek combining two spectacular Himalayan passes.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Dual pass trek", "Challenging route", "Mountain views", "Expert guides"]
  },
  {
    id: "h5",
    slug: "sar-pass-trek",
    title: "Sar pass trek discover the thrill",
    category: "Himalayan Treks",
    region: "Himachal Pradesh",
    difficulty: "Moderate",
    basePrice: 14999,
    currency: "INR",
    duration: "8 Days, 7 Nights",
    shortDesc: "Adventure trek through pine forests and snow slides.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Snow slides", "Forest camping", "River crossings", "Mountain views"]
  },
  {
    id: "h6",
    slug: "binsar-forest-trail",
    title: "The binsar forest trail",
    category: "Himalayan Treks",
    region: "Uttarakhand",
    difficulty: "Easy",
    basePrice: 46999,
    currency: "INR",
    duration: "7 Days, 6 Nights",
    shortDesc: "Luxury forest trail experience with wildlife and mountain views.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Luxury experience", "Wildlife spotting", "Forest trails", "Mountain views"]
  },
  {
    id: "h7",
    slug: "kedarkantha-trek",
    title: "KedarKantha",
    category: "Himalayan Treks",
    region: "Uttarakhand",
    difficulty: "Moderate",
    basePrice: 6499,
    currency: "INR",
    duration: "5 Days, 4 Nights",
    shortDesc: "Perfect winter trek with snow-covered peaks and beautiful campsites.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Snow trekking", "Summit views", "Camping", "Expert guides"]
  },
  {
    id: "h8",
    slug: "kasol-kullu-manali",
    title: "Trip to Kasol kullu Manali",
    category: "Himalayan Treks",
    region: "Himachal Pradesh",
    difficulty: "Easy",
    basePrice: 16499,
    currency: "INR",
    duration: "8 Days, 7 Nights",
    shortDesc: "Explore the beautiful valleys of Himachal Pradesh.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Valley exploration", "Local culture", "Scenic drives", "Adventure activities"]
  }
];

export const wildlifeTrips: Trip[] = [
  {
    id: "wl1",
    slug: "jawai-leopard-safari",
    title: "Jawai on the trail of leopards",
    category: "Wildlife",
    region: "Rajasthan",
    difficulty: "Easy",
    basePrice: 30500,
    currency: "INR",
    duration: "4 Days, 3 Nights",
    shortDesc: "Unique leopard spotting experience in the Aravalli hills.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Leopard safaris", "Photography sessions", "Local culture", "Luxury camps"]
  }
];

// International trips
export const internationalTrips: Trip[] = [
  {
    id: "int1",
    slug: "bali-tropical-escape",
    title: "Bali",
    category: "International",
    region: "Bali, Indonesia",
    difficulty: "Easy",
    basePrice: 51000,
    currency: "INR",
    duration: "7 Days, 6 Nights",
    shortDesc: "Experience the magic of Bali's beaches, temples, and culture.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Beach resorts", "Temple tours", "Cultural experiences", "Spa treatments"]
  },
  {
    id: "int2",
    slug: "vietnam-circuit",
    title: "Vietnam circuit",
    category: "International",
    region: "Vietnam",
    difficulty: "Easy",
    basePrice: 55999,
    currency: "INR",
    duration: "7 Days, 6 Nights",
    shortDesc: "Explore the vibrant culture and stunning landscapes of Vietnam.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["City tours", "Halong Bay cruise", "Local cuisine", "Cultural sites"]
  },
  {
    id: "int3",
    slug: "thailand-full-moon-party",
    title: "Thailand full moon party",
    category: "International",
    region: "Thailand",
    difficulty: "Easy",
    basePrice: 43499,
    currency: "INR",
    duration: "7 Days, 6 Nights",
    shortDesc: "Experience Thailand's famous full moon party and beaches.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Full moon party", "Beach resorts", "Island hopping", "Nightlife"]
  },
  {
    id: "int4",
    slug: "dubai-mesmerizing",
    title: "Mesmerizing 6 days in Dubai",
    category: "International",
    region: "Dubai, UAE",
    difficulty: "Easy",
    basePrice: 38499,
    currency: "INR",
    duration: "6 Days, 5 Nights",
    shortDesc: "Luxury and adventure in the dazzling city of Dubai.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Luxury hotels", "Desert safari", "City tours", "Shopping experiences"]
  }
];

// Backpacking trips
export const backpackingTrips: Trip[] = [
  {
    id: "bp1",
    slug: "himachal-group-tour",
    title: "Himachal group tour",
    category: "Backpacking",
    region: "Himachal Pradesh",
    difficulty: "Moderate",
    basePrice: 13990,
    currency: "INR",
    duration: "10 Days, 9 Nights",
    shortDesc: "Complete Himachal experience with group activities and local culture.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Group activities", "Local stays", "Cultural immersion", "Adventure sports"]
  },
  {
    id: "bp2",
    slug: "hampi-backpacking",
    title: "Hampi back packing Trip",
    category: "Backpacking",
    region: "Karnataka",
    difficulty: "Easy",
    basePrice: 4799,
    currency: "INR",
    duration: "2 Days, 1 Night",
    shortDesc: "Explore the ruins of Hampi with fellow backpackers.",
    image: "https://logout.world/api/placeholder/400/300",
    features: ["Historical sites", "Budget accommodation", "Local transport", "Cultural tours"]
  }
];

export const getAllTrips = (): Trip[] => {
  return [...upcomingTrips, ...weekendGetaways, ...himalayanTreks, ...wildlifeTrips, ...internationalTrips, ...backpackingTrips];
};

export const getTripsByCategory = (category: string): Trip[] => {
  const allTrips = getAllTrips();
  return allTrips.filter(trip => 
    trip.category.toLowerCase().includes(category.toLowerCase())
  );
};

export const getTripBySlug = (slug: string): Trip | undefined => {
  const allTrips = getAllTrips();
  return allTrips.find(trip => trip.slug === slug);
};
