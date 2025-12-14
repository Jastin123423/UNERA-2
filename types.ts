
export interface User {
    id: number;
    name: string;
    firstName?: string;
    lastName?: string;
    profileImage: string;
    coverImage?: string;
    bio?: string;
    work?: string;
    education?: string;
    location?: string;
    website?: string;
    isOnline: boolean;
    followers: number[];
    following: number[];
    email?: string;
    password?: string;
    birthDate?: string;
    gender?: string;
    nationality?: string;
    isVerified?: boolean;
    role?: 'admin' | 'moderator' | 'user';
    isMusician?: boolean; // New: Musician role
    isRestricted?: boolean;
    restrictedUntil?: number; // Timestamp
    phone?: string;
    joinedDate?: string; // For New User Boost
    interests?: string[]; // For Interest Clustering
}

export interface Comment {
    id: number;
    userId: number;
    text: string;
    timestamp: string;
    likes: number;
    hasLiked?: boolean; // Track if current user liked this comment
    attachment?: {
        type: 'image' | 'gif' | 'file';
        url: string;
        fileName?: string;
    };
    stickerUrl?: string; // New: Sticker support
    replies?: CommentReply[];
    rating?: number;
    userName?: string;
    userAvatar?: string;
    date?: number; // Legacy timestamp from marketplace
    comment?: string; // Legacy text field from marketplace
}

export interface CommentReply {
    id: number;
    userId: number;
    userName?: string; // Optional for compatibility
    reply: string;
    date: number; // Timestamp
    likes: number; // Added likes for replies
    hasLiked?: boolean;
}

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface Reaction {
    userId: number;
    type: ReactionType;
}

export interface LinkPreview {
    url: string;
    title: string;
    description: string;
    image: string;
    domain: string;
}

export interface Post {
    id: number;
    authorId: number;
    content?: string;
    image?: string;
    video?: string;
    timestamp: string; // Display string e.g. "2h"
    createdAt?: number; // Actual timestamp for Freshness Algorithm
    reactions: Reaction[]; 
    comments: Comment[];
    shares: number;
    views?: number; // For Watch-Time Algorithm
    category?: string; // For Interest Clustering
    tags?: string[];
    type: 'text' | 'image' | 'video' | 'event' | 'product' | 'audio';
    visibility: 'Public' | 'Friends' | 'Only Me';
    location?: string;
    feeling?: string;
    taggedUsers?: number[];
    eventId?: number; 
    event?: Event; 
    productId?: number; 
    product?: Product; 
    audioTrack?: AudioTrack; // NEW: For Music in Feed
    background?: string;
    sharedPostId?: number;
    linkPreview?: LinkPreview;
    // Group Context for Feed
    groupId?: string;
    groupName?: string;
    isGroupAdmin?: boolean;
}

export interface Story {
    id: number;
    userId: number;
    image: string;
    user?: User;
    createdAt: number; // Added for expiration
}

export interface Reel {
    id: number;
    userId: number;
    videoUrl: string;
    caption: string;
    songName: string;
    effectName?: string;
    reactions: Reaction[]; 
    comments: Comment[];
    shares: number;
    isCompressed?: boolean; 
}

export interface Notification {
    id: number;
    userId: number;
    senderId: number;
    type: 'like' | 'comment' | 'follow' | 'share' | 'birthday' | 'reaction' | 'event' | 'system' | 'mention';
    content: string;
    postId?: number;
    reelId?: number;
    timestamp: number;
    read: boolean;
}

export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    text: string;
    timestamp: number;
    productId?: number;
    productTitle?: string;
    stickerUrl?: string; // New: Sticker support
}

export interface SearchResult {
    user: User;
    score: number;
    reason?: string;
}

export interface Event {
    id: number;
    organizerId: number;
    title: string;
    description: string;
    date: string; // ISO Date string
    time: string;
    location: string;
    image: string;
    attendees: number[]; // User IDs
    interestedIds: number[]; // User IDs interested
}

export interface LocationData {
    name: string;
    flag: string;
}

export interface Product {
    id: number;
    title: string;
    category: string;
    description: string;
    country: string;
    address: string;
    mainPrice: number;
    discountPrice?: number | null;
    quantity: number;
    phoneNumber: string;
    images: string[];
    sellerId: number;
    sellerName: string;
    sellerAvatar: string;
    date: number;
    status: 'active' | 'sold' | 'inactive';
    shareId: string;
    views: number;
    ratings: number[];
    comments: Comment[];
}

export interface GroupPost {
    id: number;
    authorId: number;
    content: string;
    image?: string;
    video?: string;
    attachment?: {
        name: string;
        type: string;
        url: string;
        size: string;
    };
    background?: string; // Added background support
    timestamp: number;
    likes: number[]; // User IDs (Note: this logic differs slightly from Post reactions in original type, we will normalize)
    reactions?: Reaction[]; // Normalize to this
    comments: Comment[];
    shares: number;
}

export interface Group {
    id: string;
    name: string;
    description: string;
    type: 'public' | 'private';
    image: string;
    coverImage: string;
    adminId: number;
    members: number[]; // User IDs
    posts: GroupPost[];
    createdDate: number;
    events?: Event[];
    memberPostingAllowed?: boolean; // New setting
}

// --- AUDIO SYSTEM TYPES ---

export interface Stats {
    plays: number;
    downloads: number;
    shares: number;
    likes: number; // Added likes
    reelsUse: number;
}

export interface Song {
    id: string;
    title: string;
    artist: string;
    uploaderId?: number; // ID of the real user who uploaded it
    album: string;
    cover: string;
    duration: string; // Display format "3:45"
    audioUrl: string; // Mock URL or blob URL
    stats: Stats;
    isLocal?: boolean;
}

export interface Album {
    id: string;
    title: string;
    artist: string;
    uploaderId?: number;
    cover: string;
    year: string;
    songs: string[]; // Song IDs
}

export interface Podcast {
    id: string;
    title: string;
    host: string;
    cover: string;
    description: string;
    category: string;
    followers: number;
}

export interface Episode {
    id: string;
    podcastId: string;
    title: string;
    description: string;
    date: string;
    duration: string;
    audioUrl: string;
    thumbnail: string;
    stats: Stats;
    uploaderId?: number; // Added for feed/profile linking
    host?: string; // Added for display
}

export interface AudioTrack {
    id: string;
    url: string;
    title: string;
    artist: string; // or Host
    uploaderId?: number; // For profile linking
    cover: string;
    type: 'music' | 'podcast';
    isVerified?: boolean; // For visual tick
}
