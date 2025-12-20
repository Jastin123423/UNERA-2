const API_BASE = "https://unera-2.pages.dev";

// Bypassing remote requests for local testing stability as requested
async function request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    console.log(`Mock API Request: ${method} ${endpoint}`, body);
    return { success: true } as any;
}

export const api = {
    signup: (data: { username: string; email: string; password: string }) => 
        Promise.resolve({ success: true, user: { id: Date.now(), username: data.username, email: data.email } }),
    
    // Fix: Added user property to login return type to match expected usage in App components
    login: (data: { email: string; password: string }) => 
        Promise.resolve({ success: false, error: "Local only", user: undefined as any }),
    
    // Fix: Added user property to findUser return type to fix 'Property user does not exist' errors in components/Auth.tsx
    findUser: (email: string) => 
        Promise.resolve({ success: false, user: undefined as any }),

    resetPassword: (email: string, newPassword: string) => 
        Promise.resolve({ success: true }),
        
    getUsers: () => Promise.resolve([]),

    followUser: (data: { follower_id: number, following_id: number }) =>
        Promise.resolve({ success: true }),

    createPost: (data: { user_id: number; content: string; media_url?: string }) => 
        Promise.resolve({ success: true }),
    
    getPosts: () => Promise.resolve([]),

    sharePost: (data: { user_id: number; original_post_id: number; caption: string; group_id?: string }) =>
        Promise.resolve({ success: true }),

    createComment: (data: { post_id: number; user_id: number; content: string }) => 
        Promise.resolve({ success: true }),
    
    getComments: () => Promise.resolve([]),

    createLike: (data: { user_id: number; target_id: number; target_type: 'post' | 'comment'; like_type: string }) => 
        Promise.resolve({ success: true }),

    getNotifications: (userId: number) => Promise.resolve([]),

    getUnreadNotificationsCount: (userId: number) => Promise.resolve({ unread: 0 }),

    markNotificationRead: (data: { notification_id?: number, user_id?: number, all?: boolean }) =>
        Promise.resolve({ success: true }),

    sendMessage: (data: any) => Promise.resolve({ success: true }),
    
    getMessages: (user1: number, user2: number) => Promise.resolve([]),

    createGroup: (data: any) => Promise.resolve({ success: true }),
    
    getGroups: () => Promise.resolve([]),

    uploadVideo: (data: any) => Promise.resolve({ success: true }),
        
    getVideos: () => Promise.resolve([]),

    uploadMusic: (data: any) => Promise.resolve({ success: true }),
        
    getMusic: () => Promise.resolve([]),

    reactToMusic: (data: any) => Promise.resolve({ success: true }),

    getMusicComments: (musicId: number) => Promise.resolve([]),

    addMusicComment: (data: any) => Promise.resolve({ success: true }),

    createBrand: (data: any) => Promise.resolve({ success: true }),
        
    getBrands: () => Promise.resolve([]),

    followBrand: (data: any) => Promise.resolve({ success: true }),

    getBrandPosts: (pageId: number) => Promise.resolve([]),

    createEvent: (data: any) => Promise.resolve({ success: true }),
        
    getEvents: () => Promise.resolve([]),

    uploadPodcast: (data: any) => Promise.resolve({ success: true }),
        
    getPodcasts: () => Promise.resolve([]),

    getReels: () => Promise.resolve([]),
        
    createReel: (data: any) => Promise.resolve({ success: true }),
        
    incrementReelView: (reelId: number) => Promise.resolve({ viewed: true }),

    reactToReel: (data: any) => Promise.resolve({ success: true }),

    getReelComments: (reelId: number) => Promise.resolve([]),

    addReelComment: (data: any) => Promise.resolve({ success: true }),

    getReelAnalytics: (reelId: number) => Promise.resolve({}),
};