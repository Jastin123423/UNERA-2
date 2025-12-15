
const API_BASE = "https://unera-2.pages.dev";

interface APIResponse<T> {
    success?: boolean;
    data?: T;
    [key: string]: any;
}

async function request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    const config: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        if (!response.ok) {
            const errJson = await response.json().catch(() => null);
            if (errJson && errJson.error) throw new Error(errJson.error);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error: any) {
        console.warn(`API Request failed: ${endpoint}.`, error);
        return { error: error.message } as any;
    }
}

export const api = {
    // 1. Users
    signup: (data: { username: string; email: string; password: string }) => 
        request('/users/signup', 'POST', data),
    
    login: (data: { email: string; password: string }) => 
        request<any>('/users/login', 'POST', data),
    
    findUser: (email: string) => 
        request<any>('/users/find', 'POST', { email }),

    resetPassword: (email: string, newPassword: string) => 
        request<any>('/users/reset-password', 'POST', { email, newPassword }),
        
    getUsers: () => 
        request<any[]>('/users'),

    followUser: (data: { follower_id: number, following_id: number }) =>
        request('/users/follow', 'POST', data),

    // 2. Posts
    createPost: (data: { user_id: number; content: string; media_url?: string }) => 
        request('/posts', 'POST', data),
    
    getPosts: () => 
        request<any[]>('/posts'),

    sharePost: (data: { user_id: number; original_post_id: number; caption: string; group_id?: string }) =>
        request('/posts/share', 'POST', data),

    // 3. Comments
    createComment: (data: { post_id: number; user_id: number; content: string }) => 
        request('/comments', 'POST', data),
    
    getComments: () => 
        request<any[]>('/comments'),

    // 4. Likes & Notifications
    createLike: (data: { user_id: number; target_id: number; target_type: 'post' | 'comment'; like_type: string }) => 
        request('/likes', 'POST', data),

    getNotifications: (userId: number) =>
        request<any[]>(`/notifications?user_id=${userId}`),

    getUnreadNotificationsCount: (userId: number) =>
        request<{unread: number}>(`/notifications/unread?user_id=${userId}`),

    markNotificationRead: (data: { notification_id?: number, user_id?: number, all?: boolean }) =>
        request('/notifications/read', 'POST', data),

    // 5. Messages
    sendMessage: (data: { sender_id: number; receiver_id: number; content: string; media_url?: string }) => 
        request('/messages', 'POST', data),
    
    getMessages: (user1: number, user2: number) => 
        request<any[]>(`/messages?user1=${user1}&user2=${user2}`),

    // 6. Groups
    createGroup: (data: { owner_id: number; name: string; description: string; privacy: 'public' | 'private' }) => 
        request('/groups', 'POST', data),
    
    getGroups: () => 
        request<any[]>('/groups'),

    // 7. Videos (Reels)
    uploadVideo: (data: { user_id: number; title: string; description: string; video_url: string; thumbnail_url?: string }) => 
        request('/videos', 'POST', data),
        
    getVideos: () => 
        request<any[]>('/videos'),

    // 8. Music
    uploadMusic: (data: { user_id: number; title: string; artist: string; audio_url: string; cover_url?: string }) => 
        request('/music', 'POST', data),
        
    getMusic: () => 
        request<any[]>('/music'),

    // 9. Brands & Pages
    createBrand: (data: { owner_id: number; name: string; description: string; logo_url?: string; category: string }) => 
        request('/brands_pages', 'POST', data),
        
    getBrands: () => 
        request<any[]>('/brands_pages'),

    // 10. Events
    createEvent: (data: { creator_id: number; title: string; description: string; event_date: string; location: string; cover_url?: string }) => 
        request('/events', 'POST', data),
        
    getEvents: () => 
        request<any[]>('/events'),

    // 11. Podcasts
    uploadPodcast: (data: { creator_id: number; title: string; description: string; audio_url: string; cover_url?: string }) => 
        request('/podcasts', 'POST', data),
        
    getPodcasts: () => 
        request<any[]>('/podcasts'),
};
