
import { User, Post, Story, Reel, LocationData, Event, Group, Song, Album, Podcast, Episode, Brand, Product } from './types';

export const LOCATIONS_DATA: LocationData[] = [
    { name: "Arusha, Tanzania", flag: "🇹🇿" }, { name: "Dar es Salaam, Tanzania", flag: "🇹🇿" }, { name: "Dodoma, Tanzania", flag: "🇹🇿" }, { name: "Zanzibar, Tanzania", flag: "🇹🇿" }, { name: "Nairobi, Kenya", flag: "🇰🇪" }, { name: "London, UK", flag: "🇬🇧" }, { name: "New York, USA", flag: "🇺🇸" }
];

export const BRAND_CATEGORIES = [ "Advertising/Marketing", "Agriculture", "Arts & Entertainment", "Automotive", "Beauty & Personal Care", "Education", "Finance", "Food & Beverage", "Health", "Real Estate", "Retail", "Technology", "Sports" ];

export const MARKETPLACE_CATEGORIES = [ { id: 'all', name: 'All Products' }, { id: 'electronics', name: 'Electronics' }, { id: 'furniture', name: 'Furniture' }, { id: 'clothing', name: 'Clothing' }, { id: 'books', name: 'Books' } ];

export const MARKETPLACE_COUNTRIES = [ { code: "all", name: "All Countries", currency: "", symbol: "", flag: "🌍" }, { code: "TZ", name: "Tanzania", currency: "TZS", symbol: "TSh", flag: "🇹🇿" }, { code: "KE", name: "Kenya", currency: "KES", symbol: "KSh", flag: "🇰🇪" }, { code: "US", name: "USA", currency: "USD", symbol: "$", flag: "🇺🇸" } ];

export const REACTION_ICONS: Record<string, string> = { like: "👍", love: "❤️", haha: "😆", wow: "😮", sad: "😢", angry: "😡" };
export const REACTION_COLORS: Record<string, string> = { like: "#1877F2", love: "#F3425F", haha: "#F7B928", wow: "#F7B928", sad: "#F7B928", angry: "#E41E3F" };

const stickerBase = [ "https://media.giphy.com/media/l41lFj8afUOMY8vQc/giphy.gif", "https://media.giphy.com/media/10UeedrT5MIfPG/giphy.gif" ];
export const STICKER_PACKS = { "All": stickerBase, "Happy": stickerBase };
export const EMOJI_LIST = [ "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣" ];

export const MOCK_SONGS: Song[] = [ { id: 's1', title: 'Midnight City', artist: 'M83', album: 'Dreaming', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&q=80', duration: '4:03', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', stats: { plays: 1500000, downloads: 5000, shares: 2000, likes: 12000, reelsUse: 120 } } ];
export const MOCK_ALBUMS: Album[] = [ { id: 'a1', title: 'After Hours', artist: 'The Weeknd', year: '2020', cover: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=600&q=80', songs: ['s1'] } ];
export const MOCK_PODCASTS: Podcast[] = [ { id: 'p1', title: 'The Daily Tech', host: 'Tech Insider', category: 'Technology', followers: 12000, description: 'Daily tech news.', cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80' } ];
export const MOCK_EPISODES: Episode[] = [ { id: 'e1', podcastId: 'p1', title: 'AI Revolution', description: 'Impact of AI.', date: '2 days ago', duration: '24:15', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', stats: { plays: 1000, downloads: 100, shares: 50, likes: 200, reelsUse: 0 } } ];

export const INITIAL_BRANDS: Brand[] = [
    { id: 10001, name: "TechWorld", description: "Tech news and reviews.", category: "Technology", profileImage: "https://ui-avatars.com/api/?name=TechWorld&background=0D8ABC&color=fff", coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1500&q=80", adminId: 1, followers: [2, 3], isVerified: true, website: "techworld.com", location: "London, UK", contactEmail: "contact@techworld.com", joinedDate: "2023-05-20" },
    { id: 10002, name: "Healthy Living", description: "Lifestyle tips.", category: "Health", profileImage: "https://ui-avatars.com/api/?name=Healthy+Living&background=45BD62&color=fff", coverImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1500&q=80", adminId: 2, followers: [1], isVerified: false, website: "healthyliving.net", location: "Dar es Salaam, TZ", joinedDate: "2024-01-10" },
    { id: 10003, name: "Unera Official", description: "Connect with the world.", category: "Community", profileImage: "https://ui-avatars.com/api/?name=Unera&background=1877F2&color=fff", coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1500&q=80", adminId: 0, followers: [1, 2, 3, 4], isVerified: true, website: "unera.social", location: "Global", joinedDate: "2023-01-01" }
];

export const INITIAL_PRODUCTS: Product[] = [
    { id: 1, title: "Vintage Camera Lens 50mm", category: "electronics", description: "Excellent condition.", country: "TZ", address: "Arusha City", mainPrice: 150000, discountPrice: 120000, quantity: 1, phoneNumber: "+255755123456", images: ["https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&q=80"], sellerId: 2, sellerName: "David Kim", sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80", date: Date.now() - 10000000, status: 'active', shareId: 'p1', views: 120, ratings: [5], comments: [] },
    { id: 2, title: "Modern Sofa Set", category: "furniture", description: "Comfortable 3-seater.", country: "KE", address: "Nairobi", mainPrice: 45000, discountPrice: null, quantity: 1, phoneNumber: "+254711223344", images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"], sellerId: 3, sellerName: "Maria Rodriguez", sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80", date: Date.now() - 5000000, status: 'active', shareId: 'p2', views: 85, ratings: [5], comments: [] }
];

export const INITIAL_USERS: User[] = [
    { id: 0, name: 'UNERA', firstName: 'UNERA', lastName: 'Admin', profileImage: 'https://ui-avatars.com/api/?name=UNERA&background=1877F2&color=fff', coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1500&q=80', bio: 'Official Admin Account.', location: 'Global', isOnline: true, followers: [1, 2, 3, 4, 5], following: [], email: 'chapchaputz@gmail.com', password: '52775277', isVerified: true, role: 'admin', joinedDate: '2023-01-01' },
    { id: 1, name: 'Sarah Chen', firstName: 'Sarah', lastName: 'Chen', profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&q=80', coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1500&q=80', bio: 'Software Engineer @ TechCorp.', location: 'San Francisco, USA', isOnline: true, followers: [2, 3, 0], following: [0], email: 'habariforum@gmail.com', password: '527700', isVerified: true, role: 'user', joinedDate: '2024-05-15' },
    { id: 2, name: 'David Kim', profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80', coverImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1500&q=80', bio: 'Photographer.', location: 'New York, USA', isOnline: true, followers: [1, 0], following: [0], isVerified: true, role: 'user', joinedDate: '2025-01-10' },
    { id: 3, name: 'Maria Rodriguez', profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', bio: 'Designer.', location: 'Madrid, Spain', isOnline: false, followers: [1, 0], following: [0], role: 'user', joinedDate: '2023-11-20' }
];

export const INITIAL_POSTS: Post[] = [
    { id: 101, authorId: 2, content: "Listed a new camera lens!", type: 'product', product: INITIAL_PRODUCTS[0], productId: 1, timestamp: "5m", createdAt: Date.now() - 300000, reactions: [], comments: [], shares: 0, visibility: 'Public' },
    { id: 1, authorId: 1, content: "Hiking Rockies! #Nature #Hiking", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80", timestamp: "2h", createdAt: Date.now() - 7200000, reactions: [{ userId: 2, type: 'love' }], comments: [], shares: 12, type: 'image', visibility: 'Public', views: 1250 }
];

export const INITIAL_STORIES: Story[] = [ { id: 1, userId: 1, type: 'image', image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80", createdAt: Date.now() } ];

export const INITIAL_REELS: Reel[] = [
    { id: 1, userId: 2, videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4", caption: "Neon vibes 🌃 #Night", songName: "Midnight City - M83", reactions: [{ userId: 1, type: 'like' }], comments: [], shares: 5, views: 12400 }
];

export const INITIAL_EVENTS: Event[] = [ { id: 1, organizerId: 10001, title: "Tech Conf 2025", description: "Biggest event.", date: new Date(Date.now() + 432e6).toISOString(), time: "09:00", location: "AICC, Arusha", image: "https://images.unsplash.com/photo-1540575467063-178a50935278?w=1500&q=80", attendees: [1, 2, 3], interestedIds: [4, 5] } ];

export const INITIAL_GROUPS: Group[] = [
    {
        id: "g1",
        name: "Tech Enthusiasts",
        description: "A group for anyone who loves technology, coding, and gadgets.",
        type: "public",
        image: "https://ui-avatars.com/api/?name=Tech+Enthusiasts&background=0D8ABC&color=fff",
        coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1500&q=80",
        adminId: 1,
        members: [1, 2],
        posts: [
            {
                id: 501,
                authorId: 2,
                content: "Has anyone seen the new AI benchmarks? Insane progress! 🚀",
                timestamp: Date.now() - 3600000,
                // Fix: added missing 'likes' property required by GroupPost interface
                likes: [],
                reactions: [{ userId: 1, type: 'like' }],
                comments: [],
                shares: 5
            },
            {
                id: 502,
                authorId: 1,
                content: "Looking for a co-founder for a fintech project in TZ. DM me!",
                timestamp: Date.now() - 10800000,
                // Fix: added missing 'likes' property required by GroupPost interface
                likes: [],
                reactions: [],
                comments: [],
                shares: 1
            }
        ],
        createdDate: Date.now() - 2592e6,
        memberPostingAllowed: true
    },
    {
        id: "g2",
        name: "Photography Lovers",
        description: "Share your best shots and learn from professionals.",
        type: "public",
        image: "https://ui-avatars.com/api/?name=Photography+Lovers&background=FE2C55&color=fff",
        coverImage: "https://images.unsplash.com/photo-1452784444945-3f422708fe5e?w=1500&q=80",
        adminId: 2,
        members: [1, 3],
        posts: [
            {
                id: 601,
                authorId: 3,
                content: "Captured this beautiful sunset yesterday in Madrid. 🌅",
                image: "https://images.unsplash.com/photo-1470252649358-96940c9353d9?w=800&q=80",
                timestamp: Date.now() - 7200000,
                // Fix: added missing 'likes' property required by GroupPost interface
                likes: [],
                reactions: [{ userId: 2, type: 'love' }],
                comments: [],
                shares: 10
            }
        ],
        createdDate: Date.now() - 5184e6,
        memberPostingAllowed: true
    }
];
