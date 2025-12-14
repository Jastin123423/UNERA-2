
// ... existing imports
import { User, Post, Story, Reel, LocationData, Event, Group, Song, Album, Podcast, Episode } from './types';

// ... existing locations and categories

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

export const COUNTRIES = LOCATIONS_DATA.map(l => l.name); // Legacy support

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

// ... Sticker and Emoji data (unchanged) ...
const stickerBase = [
    "https://media.giphy.com/media/l41lFj8afUOMY8vQc/giphy.gif",
    "https://media.giphy.com/media/10UeedrT5MIfPG/giphy.gif",
    "https://media.giphy.com/media/Wj7lNjMNDxSmc/giphy.gif",
    "https://media.giphy.com/media/26uf9MHun4QN24TEQ/giphy.gif",
    "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXp1ZnAzcHg2bXp1ZnAzcHg2bXp1ZnAzcHg2bXp1ZnAzcHg2JmVwPXYxX2dpZnNfdHJlbmRpbmcmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif",
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
    // ... existing GIF generation code
    const bases = [
        "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXp1ZnAzcHg2bXp1ZnAzcHg2bXp1ZnAzcHg2bXp1ZnAzcHg2JmVwPXYxX2dpZnNfdHJlbmRpbmcmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif",
        // ... (rest of the array)
        "https://media.giphy.com/media/l2Jhtq2aG5cQZ40hy/giphy.gif"
    ];
    return Array.from({ length: count }).map((_, i) => bases[i % bases.length]);
};

export const GIF_CATEGORIES = {
    // ... existing GIF categories
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

// --- MUSIC DATA ---
export const MOCK_SONGS: Song[] = [
    // ... existing mock songs
    { id: 's1', title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', duration: '4:03', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', stats: { plays: 1500000, downloads: 5000, shares: 2000, likes: 12000, reelsUse: 120 } },
    { id: 's2', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', duration: '3:20', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', stats: { plays: 3200000, downloads: 12000, shares: 8000, likes: 25000, reelsUse: 500 } },
    { id: 's3', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', duration: '3:23', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', stats: { plays: 2800000, downloads: 9000, shares: 6000, likes: 20000, reelsUse: 300 } },
    { id: 's4', title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', cover: 'https://images.unsplash.com/photo-1459749411177-8c4750bb0e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', duration: '3:18', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', stats: { plays: 1900000, downloads: 4000, shares: 1500, likes: 10000, reelsUse: 100 } },
    { id: 's5', title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', duration: '3:35', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', stats: { plays: 2500000, downloads: 8000, shares: 4500, likes: 18000, reelsUse: 250 } },
];

export const MOCK_ALBUMS: Album[] = [
    // ... existing albums
    { id: 'a1', title: 'After Hours', artist: 'The Weeknd', year: '2020', cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', songs: ['s2', 's5'] },
    { id: 'a2', title: 'Future Nostalgia', artist: 'Dua Lipa', year: '2020', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', songs: ['s3'] },
    { id: 'a3', title: 'Justice', artist: 'Justin Bieber', year: '2021', cover: 'https://images.unsplash.com/photo-1459749411177-8c4750bb0e5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', songs: ['s4'] },
];

// --- PODCAST DATA ---
export const MOCK_PODCASTS: Podcast[] = [
    // ... existing podcasts
    { id: 'p1', title: 'The Daily Tech', host: 'Tech Insider', category: 'Technology', followers: 12000, description: 'Daily news from the tech world.', cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
    { id: 'p2', title: 'Mindset Mentor', host: 'Rob Dial', category: 'Education', followers: 45000, description: 'Design the life you want to live.', cover: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
    { id: 'p3', title: 'Business Wars', host: 'Wondery', category: 'Business', followers: 30000, description: 'The stories behind the biggest business rivalries.', cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' },
];

export const MOCK_EPISODES: Episode[] = [
    // ... existing episodes
    { id: 'e1', podcastId: 'p1', title: 'AI Revolution: What is Next?', description: 'We discuss the future of Artificial Intelligence and its impact.', date: '2 days ago', duration: '24:15', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', stats: { plays: 1000, downloads: 100, shares: 50, likes: 200, reelsUse: 0 } },
    { id: 'e2', podcastId: 'p2', title: 'Stop Procrastinating Now', description: 'Practical tips to get things done effectively.', date: '1 week ago', duration: '18:30', thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', stats: { plays: 5000, downloads: 800, shares: 300, likes: 800, reelsUse: 10 } },
    { id: 'e3', podcastId: 'p3', title: 'Netflix vs Blockbuster', description: 'The battle for home entertainment dominance.', date: '3 days ago', duration: '45:00', thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', stats: { plays: 3200, downloads: 400, shares: 150, likes: 500, reelsUse: 5 } },
];

export const INITIAL_USERS: User[] = [
    // ... existing users
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
    // ... existing posts
    {
        id: 1,
        authorId: 1,
        content: "Just spent the weekend hiking in the Rockies. The views were absolutely breathtaking! 🏔️✨ #Nature #Hiking #WeekendVibes",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        timestamp: "2h",
        createdAt: Date.now() - 7200000, // 2 hours ago
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
    // New posts to test ranking
    {
        id: 5,
        authorId: 2, // New User (David Kim)
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
    }
];

export const INITIAL_STORIES: Story[] = [
    // ... existing stories
    { id: 1, userId: 1, image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', createdAt: Date.now() },
    { id: 2, userId: 2, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', createdAt: Date.now() },
    { id: 3, userId: 3, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', createdAt: Date.now() },
    { id: 4, userId: 4, image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', createdAt: Date.now() },
];

export const INITIAL_REELS: Reel[] = [
    // ... existing reels
    { 
        id: 101, 
        userId: 2, 
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-mother-with-her-little-daughter-decorating-a-christmas-tree-39745-large.mp4", 
        caption: "Christmas vibes! 🎄✨", 
        songName: "Jingle Bell Rock", 
        reactions: [{ userId: 1, type: 'love' }, { userId: 3, type: 'like' }],
        comments: [], 
        shares: 2,
        isCompressed: false
    },
    { 
        id: 102, 
        userId: 5, 
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4", 
        caption: "City lights at night 🌃", 
        songName: "Blinding Lights - The Weeknd", 
        effectName: "Neon Glow", 
        reactions: [{ userId: 1, type: 'wow' }],
        comments: [], 
        shares: 8,
        isCompressed: true
    },
    { 
        id: 103, 
        userId: 4, 
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4", 
        caption: "Nature is amazing 🌻", 
        songName: "Here Comes The Sun", 
        reactions: [{ userId: 2, type: 'like' }],
        comments: [], 
        shares: 0,
        isCompressed: false
    },
];

export const INITIAL_EVENTS: Event[] = [
    // ... existing events
    {
        id: 1,
        organizerId: 1,
        title: "Tech Meetup Arusha",
        description: "Networking for developers and tech enthusiasts in Arusha.",
        date: new Date(Date.now() + 86400000 * 2).toISOString(),
        time: "10:00 AM",
        location: "Arusha, Tanzania",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        attendees: [1, 2, 3],
        interestedIds: [4, 5]
    },
    {
        id: 2,
        organizerId: 5,
        title: "Food Festival",
        description: "Taste the best local dishes!",
        date: new Date(Date.now() + 86400000 * 5).toISOString(),
        time: "12:00 PM",
        location: "Zanzibar, Tanzania",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        attendees: [1, 5],
        interestedIds: [2, 3]
    }
];

export const INITIAL_GROUPS: Group[] = [
    {
        id: 'g1',
        name: 'Tech Enthusiasts',
        description: 'A community for tech lovers to discuss latest trends, gadgets, and coding.',
        type: 'public',
        image: 'https://ui-avatars.com/api/?name=Tech+Enthusiasts&background=1877F2&color=fff',
        coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        adminId: 1,
        members: [1, 2, 5],
        posts: [],
        createdDate: Date.now() - 10000000,
        memberPostingAllowed: true
    },
    {
        id: 'g2',
        name: 'Photography Lovers',
        description: 'Share your best shots and get feedback from fellow photographers.',
        type: 'public',
        image: 'https://ui-avatars.com/api/?name=Photo+Lovers&background=F3425F&color=fff',
        coverImage: 'https://images.unsplash.com/photo-1452587925703-74955992012b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        adminId: 2,
        members: [2, 3, 4],
        posts: [],
        createdDate: Date.now() - 5000000,
        memberPostingAllowed: true
    }
];

export const TRANSLATIONS: Record<string, any> = {
    // ... translations
    en: {
        tagline: "Connect with friends and the world around you on UNERA.",
        login_btn: "Log In",
        home: "Home",
        friends: "Friends",
        create_post_title: "Create Post",
        watch: "Watch"
    },
    sw: {
        tagline: "Ungana na marafiki...",
        home: "Nyumbani",
        create_post_title: "Unda Posti",
        watch: "Tazama"
    }
};
