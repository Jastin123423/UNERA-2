
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
    
    // Optional: Add token logic here if backend requires it
    // const token = localStorage.getItem('unera_token');
    // if (token) headers['Authorization'] = `Bearer ${token}`;

    const config: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        // We generally return the json even if status is not 200 to handle error messages from backend
        return await response.json();
    } catch (error) {
        console.error(`API Request failed: ${endpoint}`, error);
        throw error;
    }
}

export const api = {
    // 1. Users
    signup: (data: { username: string; email: string; password: string }) => 
        request('/users/signup', 'POST', data),
    
    login: (data: { email: string; password: string }) => 
        request<any>('/users/login', 'POST', data),

    // 2. Posts
    createPost: (data: { user_id: number; content: string; media_url?: string }) => 
        request('/posts', 'POST', data),
    
    getPosts: () => 
        request<any[]>('/posts'),

    // 3. Comments
    createComment: (data: { post_id: number; user_id: number; content: string }) => 
        request('/comments', 'POST', data),
    
    getComments: () => 
        request<any[]>('/comments'),

    // 4. Likes
    createLike: (data: { user_id: number; target_id: number; target_type: 'post' | 'comment' }) => 
        request('/likes', 'POST', data),

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

    // 7. Videos
    uploadVideo: (data: { user_id: number; title: string; description: string; video_url: string; thumbnail_url?: string }) => 
        request('/videos', 'POST', data),

    // 8. Music
    uploadMusic: (data: { user_id: number; title: string; artist: string; audio_url: string; cover_url?: string }) => 
        request('/music', 'POST', data),

    // 9. Brands & Pages
    createBrand: (data: { owner_id: number; name: string; description: string; logo_url?: string; category: string }) => 
        request('/brands_pages', 'POST', data),

    // 10. Events
    createEvent: (data: { creator_id: number; title: string; description: string; event_date: string; location: string; cover_url?: string }) => 
        request('/events', 'POST', data),

    // 11. Podcasts
    uploadPodcast: (data: { creator_id: number; title: string; description: string; audio_url: string; cover_url?: string }) => 
        request('/podcasts', 'POST', data),
};
