
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
    isRestricted?: boolean;
    restrictedUntil?: number; // Timestamp
    phone?: string;
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
    userName: string;
    reply: string;
    date: number;
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
    timestamp: string;
    reactions: Reaction[]; 
    comments: Comment[];
    shares: number;
    type: 'text' | 'image' | 'video' | 'event' | 'product';
    visibility: 'Public' | 'Friends' | 'Only Me';
    location?: string;
    feeling?: string;
    taggedUsers?: number[];
    eventId?: number; 
    event?: Event; 
    productId?: number; 
    product?: Product; 
    background?: string;
    sharedPostId?: number;
    linkPreview?: LinkPreview;
}

export interface Story {
    id: number;
    userId: number;
    image: string;
    user?: User;
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
    type: 'like' | 'comment' | 'follow' | 'share' | 'birthday' | 'reaction' | 'event' | 'system';
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
}

export interface SearchResult {
    user: User;
    score: number;
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
    timestamp: number;
    likes: number[]; // User IDs
    comments: Comment[];
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
}

// --- AUDIO SYSTEM TYPES ---

export interface Song {
    id: string;
    title: string;
    artist: string;
    album: string;
    cover: string;
    duration: string; // Display format "3:45"
    audioUrl: string; // Mock URL
    plays: number;
}

export interface Album {
    id: string;
    title: string;
    artist: string;
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
}

export interface AudioTrack {
    id: string;
    url: string;
    title: string;
    artist: string; // or Host
    cover: string;
    type: 'music' | 'podcast';
}
