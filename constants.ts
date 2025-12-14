

import { User, Post, Story, Reel, LocationData, Event, Group, Song, Album, Podcast, Episode, Brand, Product } from './types';

export const LOCATIONS_DATA: LocationData[] = [
    { name: "Arusha, Tanzania", flag: "🇹🇿" },
    { name: "Dar es Salaam, Tanzania", flag: "🇹🇿" },
    { name: "Dodoma, Tanzania", flag: "🇹🇿" },
    { name: "Zanzibar, Tanzania", flag: "🇹🇿" },
    { name: "Mwanza, Tanzania", flag: "🇹🇿" },
    { name: "Mbeya, Tanzania", flag: "🇹🇿" },
    { name: "Nairobi, Kenya", flag: "🇰🇪" },
    { name: "Mombasa, Kenya", flag: "🇰🇪" },
    { name: "Kampala, Uganda", flag: "🇺🇬" },
    { name: "Kigali, Rwanda", flag: "🇷🇼" },
    { name: "Lagos, Nigeria", flag: "🇳🇬" },
    { name: "Abuja, Nigeria", flag: "🇳🇬" },
    { name: "Accra, Ghana", flag: "🇬🇭" },
    { name: "Johannesburg, South Africa", flag: "🇿🇦" },
    { name: "Cape Town, South Africa", flag: "🇿🇦" },
    { name: "Cairo, Egypt", flag: "🇪🇬" },
    { name: "Addis Ababa, Ethiopia", flag: "🇪🇹" },
    { name: "London, United Kingdom", flag: "🇬🇧" },
    { name: "New York, USA", flag: "🇺🇸" },
    { name: "Los Angeles, USA", flag: "🇺🇸" },
    { name: "Paris, France", flag: "🇫🇷" },
    { name: "Berlin, Germany", flag: "🇩🇪" },
    { name: "Tokyo, Japan", flag: "🇯🇵" },
    { name: "Dubai, UAE", flag: "🇦🇪" },
    { name: "Beijing, China", flag: "🇨🇳" },
    { name: "Sydney, Australia", flag: "🇦🇺" },
    { name: "Toronto, Canada", flag: "🇨🇦" },
    { name: "Mumbai, India", flag: "🇮🇳" },
    { name: "New Delhi, India", flag: "🇮🇳" },
    { name: "Rio de Janeiro, Brazil", flag: "🇧🇷" },
    { name: "Moscow, Russia", flag: "🇷🇺" },
    { name: "Kinshasa, DRC", flag: "🇨🇩" },
    { name: "Luanda, Angola", flag: "🇦🇴" },
    { name: "Maputo, Mozambique", flag: "🇲🇿" },
    { name: "Lusaka, Zambia", flag: "🇿🇲" },
    { name: "Harare, Zimbabwe", flag: "🇿🇼" },
];

export const BRAND_CATEGORIES = [
    "Advertising/Marketing", "Agriculture", "Arts & Entertainment", "Automotive", 
    "Beauty, Cosmetic & Personal Care", "Commercial & Industrial", "Education", 
    "Finance", "Food & Beverage", "Hotel & Lodging", "Legal", "Local Service", 
    "Media/News Company", "Medical & Health", "Non-Profit Organization", 
    "Public Figure", "Real Estate", "Retail & Shopping", "Science, Technology & Engineering", 
    "Sports & Recreation", "Travel & Transportation", "Apparel & Clothing", 
    "Electronics", "Home & Garden", "Pet Services", "Consulting Agency",
    "Design & Fashion", "E-commerce Website", "Entrepreneur", "Gaming Video Creator",
    "Government Organization", "Musician/Band", "Photographer", "Restaurant", "School/University"
];

export const COUNTRIES = LOCATIONS_DATA.map(l => l.name);

export const MARKETPLACE_CATEGORIES = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'books', name: 'Books' },
    { id: 'services', name: 'Services' },
    { id: 'real_estate', name: 'Real Estate' },
    { id: 'vehicles', name: 'Vehicles' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'sports', name: 'Sports & Fitness' },
    { id: 'home_garden', name: 'Home & Garden' },
    { id: 'business', name: 'Business & Industrial' }
];

export const MARKETPLACE_COUNTRIES = [
    { code: "all", name: "All Countries", currency: "", symbol: "", flag: "🌍" },
    { code: "TZ", name: "Tanzania", currency: "TZS", symbol: "TSh", flag: "🇹🇿" },
    { code: "KE", name: "Kenya", currency: "KES", symbol: "KSh", flag: "🇰🇪" },
    { code: "UG", name: "Uganda", currency: "UGX", symbol: "USh", flag: "🇺🇬" },
    { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦", flag: "🇳🇬" },
    { code: "ZA", name: "South Africa", currency: "ZAR", symbol: "R", flag: "🇿🇦" },
    { code: "ET", name: "Ethiopia", currency: "ETB", symbol: "Br", flag: "🇪🇹" },
    { code: "EG", name: "Egypt", currency: "EGP", symbol: "E£", flag: "🇪🇬" },
    { code: "GH", name: "Ghana", currency: "GHS", symbol: "GH₵", flag: "🇬🇭" },
    { code: "US", name: "United States", currency: "USD", symbol: "$", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£", flag: "🇬🇧" },
    { code: "CN", name: "China", currency: "CNY", symbol: "¥", flag: "🇨🇳" },
    { code: "IN", name: "India", currency: "INR", symbol: "₹", flag: "🇮🇳" },
    { code: "AE", name: "UAE", currency: "AED", symbol: "AED", flag: "🇦🇪" }
];

export const REACTION_ICONS: Record<string, string> = {
    like: "👍",
    love: "❤️",
    haha: "😆",
    wow: "😮",
    sad: "😢",
    angry: "😡"
};

export const REACTION_COLORS: Record<string, string> = {
    like: "#1877F2",
    love: "#F3425F",
    haha: "#F7B928",
    wow: "#F7B928",
    sad: "#F7B928",
    angry: "#E41E3F"
};

const stickerBase = [
    "https://media.giphy.com/media/l41lFj8afUOMY8vQc/giphy.gif",
    "https://media.giphy.com/media/10UeedrT5MIfPG/giphy.gif",
    "https://media.giphy.com/media/Wj7lNjMNDxSmc/giphy.gif",
    "https://media.giphy.com/media/26uf9MHun4QN24TEQ/giphy.gif",
    "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXp1ZnAzcHg2bXp1ZnAzcHg2bXp1ZnAzcHg2JmVwPXYxX2dpZnNfdHJlbmRpbmcmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif",
    "https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif",
    "https://media.giphy.com/media/3o7TKr3nzbh5WgCFxe/giphy.gif",
    "https://media.giphy.com/media/xT0xezQGU5xTFrJMA8/giphy.gif",
    "https://media.giphy.com/media/l0HlCqV35hdEg2GMU/giphy.gif",
    "https://media.giphy.com/media/l2JdZOq7j6H0hQ1i0/giphy.gif",
    "https://media.giphy.com/media/3o7TKDkDbIDJieo1sk/giphy.gif",
    "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
    "https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif",
    "https://media.giphy.com/media/l41Yh18f5TDiOKi0o/giphy.gif",
    "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif"
];

const generateStickers = (count: number) => {
    return Array.from({ length: count }).map((_, i) => stickerBase[i % stickerBase.length]);
};

export const STICKER_PACKS = {
    "All": generateStickers(30),
    "Happy": generateStickers(20),
    "Love": generateStickers(20),
    "Sad": generateStickers(15),
    "Celebration": generateStickers(15),
    "Angry": generateStickers(15),
    "Animals": generateStickers(25),
    "Funny": generateStickers(20)
};

export const EMOJI_LIST = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", 
    "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕",
    "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰",
    "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤",
    "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "ogre", "👺", "🤡", "💩", "👻", "💀",
    "👍", "👎", "👊", "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘", "👌", "🤌", "🤏", "👉", "👇", "☝️", "✋", "🤚", "🖐️",
    "🖖", "👋", "🤙", "💪", "🦾", "🖕", "✍️", "🙏", "🦶", "🦵", "🦿", "💄", "💋", "👄", "🦷", "👅", "👂", "🦻", "👃", "👣", "👁️",
    "👀", "🧠", "🫀", "🫁", "🦴", "👤", "👥", "🗣️", "🫂"
];

const generateGifs = (category: string, count: number) => {
    const bases = [
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXp1ZnAzcHg2bXp1ZnAzcHg2bXp1ZnAzcHg2JmVwPXYxX2dpZnNfdHJlbmRpbmcmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif",
        "https://media.giphy.com/media/l2Jhtq2aG5cQZ40hy/giphy.gif"
    ];
    return Array.from({ length: count }).map((_, i) => bases[i % bases.length]);
};

export const GIF_CATEGORIES = {
    "Trending": generateGifs("Trending", 40),
    "Happy": generateGifs("Happy", 30),
    "Sad": generateGifs("Sad", 30),
    "Celebration": generateGifs("Celebration", 25),
    "Love": generateGifs("Love", 25),
    "Angry": generateGifs("Angry", 20),
    "Confused": generateGifs("Confused", 20),
    "Excited": generateGifs("Excited", 20),
    "Applause": generateGifs("Applause", 15),
    "Animals": generateGifs("Animals", 25),
    "Dance": generateGifs("Dance", 20),
    "Food": generateGifs("Food", 20)
};

export const MOCK_GIFS = Object.values(GIF_CATEGORIES).flat();

export const MOCK_SONGS: Song[] = [
    { id: 's1', title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', duration: '4:03', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', stats: { plays: 1500000, downloads: 5000, shares: 2000, likes: 12000, reelsUse: 120 } },
    { id: 's2', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', duration: '3:20', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', stats: { plays: 3200000, downloads: 12000, shares: 8000, likes: 25000, reelsUse: 500 } },
    { id: 's3', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', duration: '3:23', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', stats: { plays: 2800000, downloads: 9000, shares: 6000, likes: 20000, reelsUse: 300 } },
    { id: 's4', title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', cover: 'https://images.unsplash.com/photo-1459749411177-8c4750bb0e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', duration: '3:18', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', stats: { plays: 1900000, downloads: 4000, shares: 1500, likes: 10000, reelsUse: 100 } },
    { id: 's5', title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', duration: '3:35', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', stats: { plays: 2500000, downloads: 8000, shares: 4500, likes: 18000, reelsUse: 250 } },
];

export const MOCK_ALBUMS: Album[] = [
    { id: 'a1', title: 'After Hours', artist: 'The Weeknd', year: '2020', cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', songs: ['s2', 's5'] },
    { id: 'a2', title: 'Future Nostalgia', artist: 'Dua Lipa', year: '2020', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', songs: ['s3'] },
    { id: 'a3', title: 'Justice', artist: 'Justin Bieber', year: '2021', cover: 'https://images.unsplash.com/photo-1459749411177-8c4750bb0e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', songs: ['s4'] },
];

export const MOCK_PODCASTS: Podcast[] = [
    { id: 'p1', title: 'The Daily Tech', host: 'Tech Insider', category: 'Technology', followers: 12000, description: 'Daily news from the tech world.', cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
    { id: 'p2', title: 'Mindset Mentor', host: 'Rob Dial', category: 'Education', followers: 45000, description: 'Design the life you want to live.', cover: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
    { id: 'p3', title: 'Business Wars', host: 'Wondery', category: 'Business', followers: 30000, description: 'The stories behind the biggest business rivalries.', cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
];

export const MOCK_EPISODES: Episode[] = [
    { id: 'e1', podcastId: 'p1', title: 'AI Revolution: What is Next?', description: 'We discuss the future of Artificial Intelligence and its impact.', date: '2 days ago', duration: '24:15', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', stats: { plays: 1000, downloads: 100, shares: 50, likes: 200, reelsUse: 0 } },
    { id: 'e2', podcastId: 'p2', title: 'Stop Procrastinating Now', description: 'Practical tips to get things done effectively.', date: '1 week ago', duration: '18:30', thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', stats: { plays: 5000, downloads: 800, shares: 300, likes: 800, reelsUse: 10 } },
    { id: 'e3', podcastId: 'p3', title: 'Netflix vs Blockbuster', description: 'The battle for home entertainment dominance.', date: '3 days ago', duration: '45:00', thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', stats: { plays: 3200, downloads: 400, shares: 150, likes: 500, reelsUse: 5 } },
];

export const INITIAL_BRANDS: Brand[] = [
    {
        id: 10001,
        name: "TechWorld",
        description: "Your daily source for technology news and reviews.",
        category: "Technology",
        profileImage: "https://ui-avatars.com/api/?name=TechWorld&background=0D8ABC&color=fff",
        coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
        adminId: 1,
        followers: [2, 3, 4],
        isVerified: true,
        website: "techworld.com",
        location: "Arusha, Tanzania",
        contactEmail: "contact@techworld.com",
        joinedDate: "2023-05-20"
    },
    {
        id: 10002,
        name: "Healthy Living",
        description: "Tips and tricks for a healthier lifestyle.",
        category: "Health & Wellness",
        profileImage: "https://ui-avatars.com/api/?name=Healthy+Living&background=45BD62&color=fff",
        coverImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
        adminId: 2,
        followers: [1, 3],
        isVerified: false,
        website: "healthyliving.net",
        location: "Dar es Salaam, Tanzania",
        joinedDate: "2024-01-10"
    }
];

export const INITIAL_PRODUCTS: Product[] = [
    {
        id: 1,
        title: "Vintage Camera Lens 50mm f/1.8",
        category: "electronics",
        description: "Excellent condition vintage lens. Perfect for portrait photography. Comes with original caps.",
        country: "TZ",
        address: "Arusha, City Center",
        mainPrice: 150000,
        discountPrice: 120000,
        quantity: 1,
        phoneNumber: "+255755123456",
        images: ["https://images.unsplash.com/photo-1617005082133-548c4dd27f35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"],
        sellerId: 2,
        sellerName: "David Kim",
        sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: Date.now() - 10000000,
        status: 'active',
        shareId: 'p1',
        views: 120,
        ratings: [5, 4, 5],
        comments: []
    },
    {
        id: 2,
        title: "Modern Sofa Set - Grey",
        category: "furniture",
        description: "3-seater sofa, very comfortable. Less than a year old. Moving out sale.",
        country: "KE",
        address: "Nairobi, Westlands",
        mainPrice: 45000,
        discountPrice: null,
        quantity: 1,
        phoneNumber: "+254711223344",
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"],
        sellerId: 3,
        sellerName: "Maria Rodriguez",
        sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: Date.now() - 5000000,
        status: 'active',
        shareId: 'p2',
        views: 85,
        ratings: [4, 5],
        comments: []
    },
    {
        id: 3,
        title: "MacBook Pro M1 2020",
        category: "electronics",
        description: "Space Grey, 8GB RAM, 256GB SSD. Battery health 95%. Box included.",
        country: "TZ",
        address: "Dar es Salaam, Masaki",
        mainPrice: 2200000,
        discountPrice: 2000000,
        quantity: 1,
        phoneNumber: "+255655998877",
        images: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"],
        sellerId: 1,
        sellerName: "Sarah Chen",
        sellerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        date: Date.now() - 200000,
        status: 'active',
        shareId: 'p3',
        views: 340,
        ratings: [5],
        comments: []
    }
];

export const INITIAL_USERS: User[] = [
    // ... users
    {
        id: 0,
        name: 'UNERA',
        firstName: 'UNERA',
        lastName: 'Admin',
        profileImage: 'https://ui-avatars.com/api/?name=UNERA&background=1877F2&color=fff',
        coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        bio: 'Official Admin Account of UNERA Social.',
        location: 'Global',
        isOnline: true,
        followers: [1, 2, 3, 4, 5, 6], 
        following: [],
        email: 'chapchaputz@gmail.com',
        password: '52775277',
        isVerified: true,
        role: 'admin',
        joinedDate: '2023-01-01',
        interests: ['community', 'news']
    },
    { 
        id: 1, 
        name: 'Sarah Chen', 
        firstName: 'Sarah',
        lastName: 'Chen',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        bio: 'Software Engineer @ TechCorp | Travel Enthusiast ✈️',
        work: 'Software Engineer at TechCorp',
        education: 'Studied Computer Science at Stanford University',
        location: 'San Francisco, California',
        isOnline: true,
        followers: [2, 3, 0],
        following: [0],
        email: 'habariforum@gmail.com',
        password: '527700',
        birthDate: '1994-09-24',
        gender: 'Female',
        nationality: 'Tanzania',
        isVerified: true,
        role: 'user',
        isMusician: true, // Marked as Musician for testing
        joinedDate: '2024-05-15',
        interests: ['tech', 'travel', 'coding']
    },
    { 
        id: 2, 
        name: 'David Kim', 
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
        coverImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        bio: 'Photographer | Visual Storyteller 📸',
        work: 'Freelance Photographer',
        location: 'New York, USA',
        isOnline: true,
        followers: [1, 5, 6, 0],
        following: [0],
        nationality: 'United States',
        isVerified: true,
        role: 'user',
        joinedDate: '2025-01-10', // New User
        interests: ['photography', 'art', 'design']
    },
    { 
        id: 3, 
        name: 'Maria Rodriguez', 
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
        coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        bio: 'Digital Artist & Designer',
        work: 'Designer at CreativeStudio',
        education: 'Studied Design at RISD',
        location: 'Madrid, Spain',
        isOnline: false,
        followers: [1, 4, 0],
        following: [0],
        nationality: 'Spain',
        role: 'user',
        joinedDate: '2023-11-20',
        interests: ['art', 'design', 'fashion']
    },
    { 
        id: 4, 
        name: 'James Wilson', 
        profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
        coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        bio: 'Nature Lover 🌲 | Hiking | Adventure',
        location: 'Denver, Colorado',
        isOnline: true,
        followers: [3, 5, 0],
        following: [0],
        nationality: 'United States',
        role: 'user',
        joinedDate: '2024-08-01',
        interests: ['nature', 'hiking', 'travel']
    },
    { 
        id: 5, 
        name: 'Emma Wilson', 
        profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
        coverImage: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        bio: 'Foodie 🍕 | Lifestyle Blogger',
        work: 'Content Creator',
        isOnline: true,
        followers: [2, 4, 0],
        following: [0],
        nationality: 'Canada',
        isVerified: true,
        role: 'user',
        joinedDate: '2025-02-01', // New User
        interests: ['food', 'lifestyle', 'cooking']
    },
    { 
        id: 6, 
        name: 'Michael Brown', 
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
        coverImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        bio: 'Tech Enthusiast 📱',
        location: 'Austin, Texas',
        isOnline: false,
        followers: [2, 0],
        following: [0],
        nationality: 'United States',
        role: 'user',
        joinedDate: '2024-01-15',
        interests: ['tech', 'gaming']
    },
];

export const INITIAL_POSTS: Post[] = [
    {
        id: 1,
        authorId: 1,
        content: "Just spent the weekend hiking in the Rockies. The views were absolutely breathtaking! 🏔️✨ #Nature #Hiking #WeekendVibes",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        timestamp: "2h",
        createdAt: Date.now() - 7200000, 
        reactions: [{ userId: 2, type: 'love' }, { userId: 4, type: 'like' }],
        comments: [
            { id: 1, userId: 2, text: "Wow, looks amazing!", timestamp: "1h", likes: 2 },
            { id: 2, userId: 3, text: "I need to go there!", timestamp: "30m", likes: 0 }
        ],
        shares: 12,
        type: 'image',
        visibility: 'Public',
        views: 1250,
        category: 'travel',
        tags: ['Nature', 'Hiking', 'WeekendVibes']
    },
    {
        id: 2,
        authorId: 4,
        content: "Excited to announce that I've just started a new position as Senior Frontend Engineer! 🚀💻 It's been a long journey but hard work pays off. #Career #TechLife",
        timestamp: "5h",
        createdAt: Date.now() - 18000000,
        reactions: [{ userId: 1, type: 'like' }, { userId: 3, type: 'wow' }],
        comments: [],
        shares: 4,
        type: 'text',
        visibility: 'Public',
        views: 890,
        category: 'tech',
        tags: ['Career', 'TechLife']
    },
    {
        id: 3,
        authorId: 5,
        content: "Sunday brunch with the best crew! 🥞☕ #Foodie #Sunday",
        image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        timestamp: "8h",
        createdAt: Date.now() - 28800000,
        reactions: [{ userId: 1, type: 'love' }],
        comments: [],
        shares: 1,
        type: 'image',
        visibility: 'Friends',
        views: 450,
        category: 'food',
        tags: ['Foodie', 'Sunday']
    },
    {
        id: 4,
        authorId: 2,
        content: "Check out this amazing sunset from yesterday! #Sunset #Nature",
        video: "https://assets.mixkit.co/videos/preview/mixkit-sun-setting-over-the-ocean-1250-large.mp4",
        timestamp: "1d",
        createdAt: Date.now() - 86400000,
        reactions: [{ userId: 1, type: 'like' }],
        comments: [],
        shares: 23,
        type: 'video',
        visibility: 'Public',
        views: 5200,
        category: 'nature',
        tags: ['Sunset', 'Nature']
    },
    {
        id: 5,
        authorId: 2, 
        content: "Just joined UNERA! Excited to share my photography journey here. 📸",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        timestamp: "10m",
        createdAt: Date.now() - 600000,
        reactions: [],
        comments: [],
        shares: 0,
        type: 'image',
        visibility: 'Public',
        views: 50,
        category: 'photography',
        tags: ['NewHere', 'Photography']
    },
    // Mock post from a Brand
    {
        id: 6,
        authorId: 10001, // TechWorld
        content: "The new iPhone 16 is rumored to feature a revolutionary new camera system. What are your thoughts? 📱🤔",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        timestamp: "1h",
        createdAt: Date.now() - 3600000,
        reactions: [{ userId: 1, type: 'like' }, { userId: 6, type: 'like' }],
        comments: [],
        shares: 5,
        type: 'image',
        visibility: 'Public',
        views: 3000,
        category: 'tech',
        tags: ['TechNews', 'iPhone']
    }
];

export const TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
        tagline: "Connect with friends and the world around you on UNERA.",
        login: "Log In",
        logout: "Log Out",
        home: "Home",
        reels: "Reels",
        watch: "Watch",
        marketplace: "Marketplace",
        groups: "Groups",
        email_placeholder: "Email address or phone number",
        password_placeholder: "Password",
        login_btn: "Log In",
        forgot_password: "Forgotten password?",
        create_new_account: "Create New Account",
        sign_up_header: "Sign Up",
        quick_easy: "It's quick and easy.",
        first_name: "First name",
        surname_optional: "Surname (optional)",
        email_mobile_placeholder: "Mobile number or email address",
        dob: "Date of birth",
        gender: "Gender",
        female: "Female",
        male: "Male",
        custom: "Custom",
        terms_text: "By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.",
        sign_up_btn: "Sign Up",
        have_account: "Already have an account?",
        friends: "Friends",
        memories: "Memories",
        saved: "Saved",
        feeds: "Feeds",
        events: "Events",
        see_more: "See more",
        create_reel: "Create reel"
    },
    sw: {
        tagline: "Ungana na marafiki na ulimwengu unaokuzunguka kwenye UNERA.",
        login: "Ingia",
        logout: "Ondoka",
        home: "Nyumbani",
        reels: "Reels",
        watch: "Tazama",
        marketplace: "Soko",
        groups: "Vikundi",
        email_placeholder: "Barua pepe au namba ya simu",
        password_placeholder: "Nenosiri",
        login_btn: "Ingia",
        forgot_password: "Umesahau nenosiri?",
        create_new_account: "Unda Akaunti Mpya",
        sign_up_header: "Jisajili",
        quick_easy: "Ni haraka na rahisi.",
        first_name: "Jina la kwanza",
        surname_optional: "Jina la ukoo (hiari)",
        email_mobile_placeholder: "Namba ya simu au barua pepe",
        dob: "Tarehe ya kuzaliwa",
        gender: "Jinsia",
        female: "Mwanamke",
        male: "Mwanaume",
        custom: "Maalum",
        terms_text: "Kwa kubofya Jisajili, unakubaliana na Masharti yetu, Sera ya Faragha na Sera ya Vidakuzi. Unaweza kupokea arifa za SMS kutoka kwetu na unaweza kujiondoa wakati wowote.",
        sign_up_btn: "Jisajili",
        have_account: "Tayari una akaunti?",
        friends: "Marafiki",
        memories: "Kumbukumbu",
        saved: "Viliohifadhiwa",
        feeds: "Habari",
        events: "Matukio",
        see_more: "Ona zaidi",
        create_reel: "Unda reel"
    },
    fr: {
        tagline: "Connectez-vous avec vos amis et le monde qui vous entoure sur UNERA.",
        login: "Se connecter",
        logout: "Se déconnecter",
        home: "Accueil",
        reels: "Reels",
        watch: "Watch",
        marketplace: "Marketplace",
        groups: "Groupes",
        email_placeholder: "Adresse e-mail ou numéro de mobile",
        password_placeholder: "Mot de passe",
        login_btn: "Se connecter",
        forgot_password: "Mot de passe oublié ?",
        create_new_account: "Créer nouveau compte",
        sign_up_header: "S'inscrire",
        quick_easy: "C'est rapide et facile.",
        first_name: "Prénom",
        surname_optional: "Nom de famille (facultatif)",
        email_mobile_placeholder: "Numéro mobile ou e-mail",
        dob: "Date de naissance",
        gender: "Genre",
        female: "Femme",
        male: "Homme",
        custom: "Personnalisé",
        terms_text: "En cliquant sur S'inscrire, vous acceptez nos Conditions, notre Politique de confidentialité et notre Politique d'utilisation des cookies.",
        sign_up_btn: "S'inscrire",
        have_account: "Déjà un compte ?",
        friends: "Amis",
        memories: "Souvenirs",
        saved: "Enregistrements",
        feeds: "Fils",
        events: "Événements",
        see_more: "Voir plus",
        create_reel: "Créer un reel"
    },
    es: {
        tagline: "Conéctate con amigos y el mundo que te rodea en UNERA.",
        login: "Iniciar sesión",
        logout: "Cerrar sesión",
        home: "Inicio",
        reels: "Reels",
        watch: "Watch",
        marketplace: "Marketplace",
        groups: "Grupos",
        email_placeholder: "Correo electrónico o número de teléfono",
        password_placeholder: "Contraseña",
        login_btn: "Iniciar sesión",
        forgot_password: "¿Olvidaste tu contraseña?",
        create_new_account: "Crear cuenta nueva",
        sign_up_header: "Registrarte",
        quick_easy: "Es rápido y fácil.",
        first_name: "Nombre",
        surname_optional: "Apellido (opcional)",
        email_mobile_placeholder: "Número de móvil o correo electrónico",
        dob: "Fecha de nacimiento",
        gender: "Sexo",
        female: "Mujer",
        male: "Hombre",
        custom: "Personalizado",
        terms_text: "Al hacer clic en Registrarte, aceptas nuestras Condiciones, la Política de privacidad y la Política de cookies.",
        sign_up_btn: "Registrarte",
        have_account: "¿Ya tienes una cuenta?",
        friends: "Amigos",
        memories: "Recuerdos",
        saved: "Guardado",
        feeds: "Feeds",
        events: "Eventos",
        see_more: "Ver más",
        create_reel: "Crear reel"
    }
};

export const INITIAL_STORIES: Story[] = [
    { id: 1, userId: 1, image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", createdAt: Date.now() },
    { id: 2, userId: 2, image: "https://images.unsplash.com/photo-1542596594-649edbc13630?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", createdAt: Date.now() },
    { id: 3, userId: 3, image: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", createdAt: Date.now() },
];

export const INITIAL_REELS: Reel[] = [
    {
        id: 1,
        userId: 2,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
        caption: "Neon vibes 🌃✨ #CityLife #Night",
        songName: "Midnight City - M83",
        reactions: [{ userId: 1, type: 'like' }],
        comments: [],
        shares: 5
    },
    {
        id: 2,
        userId: 1,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
        caption: "Spring is here! 🌸 #Nature #Flowers",
        songName: "Here Comes The Sun - Beatles",
        reactions: [{ userId: 3, type: 'love' }],
        comments: [],
        shares: 2
    },
    {
        id: 3,
        userId: 4,
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
        caption: "Ocean calm 🌊 #Relax #Water",
        songName: "Ocean Eyes - Billie Eilish",
        reactions: [],
        comments: [],
        shares: 0
    }
];

export const INITIAL_EVENTS: Event[] = [
    {
        id: 1,
        organizerId: 10001, // TechWorld
        title: "Tech Conference 2025",
        description: "Join us for the biggest tech event of the year.",
        date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
        time: "09:00",
        location: "Arusha International Conference Centre",
        image: "https://images.unsplash.com/photo-1540575467063-178a50935278?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
        attendees: [1, 2, 3],
        interestedIds: [4, 5]
    },
    {
        id: 2,
        organizerId: 2,
        title: "Photography Workshop",
        description: "Learn the basics of photography with David.",
        date: new Date(Date.now() + 86400000 * 10).toISOString(), // 10 days from now
        time: "14:00",
        location: "Central Park, NY",
        image: "https://images.unsplash.com/photo-1552168324-d612d77725e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
        attendees: [1, 5],
        interestedIds: [3]
    }
];

export const INITIAL_GROUPS: Group[] = [
    {
        id: "g1",
        name: "Tech Enthusiasts",
        description: "A group for anyone who loves technology, coding, and gadgets.",
        type: "public",
        image: "https://ui-avatars.com/api/?name=Tech+Enthusiasts&background=0D8ABC&color=fff",
        coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
        adminId: 1,
        members: [1, 2, 4, 6],
        posts: [
            {
                id: 101,
                authorId: 1,
                content: "What's everyone's favorite programming language right now?",
                timestamp: Date.now() - 3600000,
                likes: [2, 4],
                comments: [],
                shares: 0
            }
        ],
        createdDate: Date.now() - 86400000 * 30,
        memberPostingAllowed: true
    },
    {
        id: "g2",
        name: "Global Travelers",
        description: "Share your travel stories and tips from around the world.",
        type: "public",
        image: "https://ui-avatars.com/api/?name=Global+Travelers&background=F3425F&color=fff",
        coverImage: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
        adminId: 4,
        members: [1, 3, 4, 5],
        posts: [],
        createdDate: Date.now() - 86400000 * 60,
        memberPostingAllowed: true
    },
    {
        id: "g3",
        name: "Digital Art Community",
        description: "Showcase your art and get feedback.",
        type: "private",
        image: "https://ui-avatars.com/api/?name=Digital+Art&background=A033FF&color=fff",
        coverImage: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
        adminId: 3,
        members: [2, 3],
        posts: [],
        createdDate: Date.now() - 86400000 * 15,
        memberPostingAllowed: true
    }
];