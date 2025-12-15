
import React, { useState, useEffect, useMemo } from 'react';
import { Login, Register } from './components/Auth';
import { Header, Sidebar, RightSidebar, MenuOverlay } from './components/Layout';
import { CreatePost, Post, CommentsSheet, ShareSheet, CreatePostModal, SuggestedProductsWidget } from './components/Feed';
import { StoryReel, StoryViewer } from './components/Story';
import { UserProfile } from './components/UserProfile';
import { MarketplacePage, ProductDetailModal } from './components/Marketplace';
import { ReelsFeed, CreateReel } from './components/Reels';
import { ChatWindow } from './components/Chat';
import { ImageViewer, Spinner } from './components/Common';
import { EventsPage, BirthdaysPage, SuggestedProfilesPage, SettingsPage, MemoriesPage } from './components/MenuPages';
import { CreateEventModal } from './components/Events';
import { GroupsPage } from './components/Groups';
import { BrandsPage } from './components/Brands';
import { MusicSystem, GlobalAudioPlayer } from './components/MusicSystem'; 
import { ToolsPage } from './components/Tools';
import { HelpSupportPage } from './components/HelpSupport';
import { PrivacyPolicyPage } from './components/PrivacyPolicy';
import { TermsOfServicePage } from './components/TermsOfService';
import { LanguageProvider } from './contexts/LanguageContext';
import { User, Post as PostType, Story, Reel, Notification, Message, Event, Product, Comment, CommentReply, ReactionType, LinkPreview, Group, GroupPost, AudioTrack, Song, Episode, Brand } from './types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_STORIES, INITIAL_REELS, INITIAL_EVENTS, INITIAL_GROUPS, MOCK_SONGS, MOCK_EPISODES, INITIAL_BRANDS, INITIAL_PRODUCTS } from './constants';
import { rankFeed } from './utils/ranking'; 
import { api } from './services/api';

// --- SESSION HELPERS ---
const setSession = (user: User) => {
    const expires = new Date(Date.now() + 30 * 864e5).toUTCString();
    document.cookie = 'unera_user=' + encodeURIComponent(JSON.stringify(user)) + '; expires=' + expires + '; path=/';
    try { localStorage.setItem('unera_user', JSON.stringify(user)); } catch (e) {}
};

const getSession = (): User | null => {
    try { const local = localStorage.getItem('unera_user'); if (local) return JSON.parse(local); } catch (e) {}
    const cookie = document.cookie.split('; ').reduce((r, v) => { const parts = v.split('='); return parts[0] === 'unera_user' ? decodeURIComponent(parts[1]) : r; }, '');
    if (cookie) { try { return JSON.parse(cookie); } catch (e) {} }
    return null;
};

const clearSession = () => {
    document.cookie = 'unera_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    try { localStorage.removeItem('unera_user'); } catch (e) {}
};

const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
};

export default function App() {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [posts, setPosts] = useState<PostType[]>(INITIAL_POSTS);
    const [stories, setStories] = useState<Story[]>(INITIAL_STORIES.map(s => ({...s, createdAt: Date.now()}))); 
    const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
    const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
    const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
    
    const [songs, setSongs] = useState<Song[]>(MOCK_SONGS);
    const [episodes, setEpisodes] = useState<Episode[]>(MOCK_EPISODES);
    
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showRegister, setShowRegister] = useState(false);
    const [loginError, setLoginError] = useState('');
    
    const [activeTab, setActiveTab] = useState('home'); 
    const [view, setView] = useState('home'); 
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [activeReelId, setActiveReelId] = useState<number | null>(null);
    
    const [currentAudioTrack, setCurrentAudioTrack] = useState<AudioTrack | null>(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [showCreateReelModal, setShowCreateReelModal] = useState(false);
    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    const [activeCommentsPostId, setActiveCommentsPostId] = useState<number | null>(null);
    const [activeSharePostId, setActiveSharePostId] = useState<number | null>(null);
    const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFullMenu, setShowFullMenu] = useState(false);
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    
    useEffect(() => {
        const storedUser = getSession();
        if (storedUser) {
            setCurrentUser(storedUser);
            // Fetch initial notifications for user
            api.getNotifications(storedUser.id).then((nots) => {
                if(Array.isArray(nots)) setNotifications(nots);
            });
        }
    }, []);

    // --- REAL-TIME WEBSOCKET CONNECTION ---
    useEffect(() => {
        let ws: WebSocket;
        const connectWs = () => {
            const wsUrl = "wss://unera-2.pages.dev/live_feed"; 
            ws = new WebSocket(wsUrl);

            ws.onopen = () => console.log("Connected to Live Feed");

            ws.onmessage = (evt) => {
                try {
                    const message = JSON.parse(evt.data);
                    console.log("Live update:", message);
                    
                    if (message.type === 'new_post') {
                        const rawPost = message.data;
                        const newPost: PostType = {
                            id: rawPost.id,
                            authorId: rawPost.user_id,
                            content: rawPost.content,
                            image: rawPost.media_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? rawPost.media_url : undefined,
                            video: rawPost.media_url?.match(/\.(mp4|webm|mov)$/i) ? rawPost.media_url : undefined,
                            timestamp: "Just now",
                            createdAt: Date.now(),
                            reactions: [],
                            comments: [],
                            shares: 0,
                            type: rawPost.media_url ? (rawPost.media_url.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image') : 'text',
                            visibility: 'Public'
                        };
                        setPosts(prev => [newPost, ...prev]);
                    } 
                    // Real-time Notification Filtering
                    else if (message.type === 'notification') {
                        if (currentUser && message.toUserId === currentUser.id) {
                            const notif = message.data;
                            setNotifications(prev => [notif, ...prev]);
                        }
                    }
                } catch (e) {
                    console.error("Error parsing live message", e);
                }
            };

            ws.onclose = () => {
                console.log("Disconnected, retrying in 5s...");
                setTimeout(connectWs, 5000);
            };
        };

        connectWs();
        return () => { if (ws) ws.close(); };
    }, [currentUser]); // Re-connect or re-bind if user changes logic (simplified)

    // --- API INTEGRATION ---
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [remoteUsers, remotePosts, remoteGroups, remoteBrands, remoteEvents, remoteVideos, remoteMusic, remotePodcasts] = await Promise.all([
                    api.getUsers(), api.getPosts(), api.getGroups(), api.getBrands(), api.getEvents(), api.getVideos(), api.getMusic(), api.getPodcasts()
                ]);

                if (remoteUsers) {
                    const mappedUsers: User[] = remoteUsers.map((u: any) => ({
                        id: u.id,
                        name: u.username || u.name || `User ${u.id}`,
                        email: u.email,
                        profileImage: u.profile_url || `https://ui-avatars.com/api/?name=${u.username}&background=random`,
                        coverImage: u.cover_url,
                        bio: u.bio,
                        followers: [], 
                        following: [],
                        isOnline: false
                    }));
                    setUsers(prev => {
                        const existingIds = new Set(prev.map(u => u.id));
                        return [...prev, ...mappedUsers.filter(u => !existingIds.has(u.id))];
                    });
                }

                if (remotePosts) {
                    const mappedPosts: PostType[] = remotePosts.map((p: any) => ({
                        id: p.id,
                        authorId: p.user_id,
                        content: p.content,
                        image: p.media_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? p.media_url : undefined,
                        video: p.media_url?.match(/\.(mp4|webm|mov)$/i) ? p.media_url : undefined,
                        timestamp: getTimeAgo(p.created_at ? new Date(p.created_at).getTime() : Date.now()),
                        createdAt: p.created_at ? new Date(p.created_at).getTime() : Date.now(),
                        reactions: [],
                        comments: [],
                        shares: 0,
                        type: p.media_url ? (p.media_url.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image') : 'text',
                        visibility: 'Public',
                        sharedPostId: p.shared_post_id
                    }));
                    setPosts(prev => {
                        const existingIds = new Set(prev.map(p => p.id));
                        return [...mappedPosts.filter(p => !existingIds.has(p.id)), ...prev];
                    });
                }
                
                // ... (Load other data - Groups, Brands etc. mapped similarly as before) ...
                // Simplified for brevity, keeping logic from previous state
                if (remoteGroups) {
                    const mappedGroups: Group[] = remoteGroups.map((g: any) => ({
                        id: g.id.toString(), name: g.name, description: g.description, type: g.privacy || 'public', image: g.image_url || '', coverImage: g.cover_url || '', adminId: g.owner_id, members: [g.owner_id], posts: [], createdDate: Date.now()
                    }));
                    setGroups(prev => [...mappedGroups, ...prev.filter(pg => !mappedGroups.find(mg => mg.id === pg.id))]);
                }
                if (remoteBrands) {
                    const mappedBrands: Brand[] = remoteBrands.map((b: any) => ({
                        id: b.id, name: b.name, description: b.description, category: b.category, profileImage: b.logo_url || '', coverImage: '', adminId: b.owner_id, followers: [], joinedDate: new Date().toISOString()
                    }));
                    setBrands(prev => [...mappedBrands, ...prev.filter(pb => !mappedBrands.find(mb => mb.id === pb.id))]);
                }

            } catch (err) {
                console.warn("Error fetching initial data", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const enrichedStories = useMemo(() => {
        return stories.map(story => {
            if (story.user) return story;
            return { ...story, user: users.find(u => u.id === story.userId) };
        });
    }, [stories, users]);

    const rankedPosts = useMemo(() => {
        const standardPosts = rankFeed(posts, currentUser, users);
        const relevantGroups = groups.filter(g => g.type === 'public' || (currentUser && g.members.includes(currentUser.id)));
        const groupPostsNormalized: PostType[] = relevantGroups.flatMap(group => 
            group.posts.map(gp => ({
                id: gp.id, authorId: gp.authorId, content: gp.content, image: gp.image, video: gp.video, timestamp: getTimeAgo(gp.timestamp), createdAt: gp.timestamp, reactions: [], comments: gp.comments, shares: gp.shares, type: gp.video ? 'video' : (gp.image ? 'image' : 'text'), visibility: 'Public', background: gp.background, groupId: group.id, groupName: group.name, isGroupAdmin: group.adminId === gp.authorId
            } as PostType))
        );
        const productPosts: PostType[] = products.slice(0, 3).map((p, index) => ({ id: -1000 - index, authorId: p.sellerId, content: p.description, timestamp: 'Suggested Product', createdAt: p.date || Date.now(), reactions: [], comments: [], shares: 0, type: 'product', product: p, visibility: 'Public' }));
        const eventPosts: PostType[] = events.slice(0, 3).map((e, index) => ({ id: -2000 - index, authorId: e.organizerId, content: e.description, timestamp: 'Upcoming Event', createdAt: Date.now(), reactions: [], comments: [], shares: 0, type: 'event', event: e, visibility: 'Public' }));
        const allPosts = [...standardPosts, ...groupPostsNormalized, ...productPosts, ...eventPosts];
        return allPosts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }, [posts, groups, currentUser, users, products, events]);

    // Simulate page routing
    useEffect(() => { 
        const path = window.location.pathname.toLowerCase();
        if (path.includes('help-support')) { setView('help'); setActiveTab(''); } 
        else if (path.includes('privacy-policy')) { setView('privacy'); setActiveTab(''); } 
        else if (path.includes('terms-of-service')) { setView('terms'); setActiveTab(''); }
    }, []);

    const handleLogin = async (email: string, pass: string) => {
        try {
            const response = await api.login({ email, password: pass });
            if (response && response.user) {
                const user: User = { id: response.user.id || 999, name: response.user.username || response.user.email.split('@')[0], email: response.user.email, profileImage: response.user.profile_url || `https://ui-avatars.com/api/?name=${response.user.email}&background=random`, coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926', followers: [], following: [], isOnline: true, role: 'user', joinedDate: new Date().toISOString() };
                setCurrentUser(user);
                setSession(user);
                setLoginError('');
                setView('home');
                setActiveTab('home');
                return;
            } else if (response && response.error) {
                setLoginError(response.error);
                return;
            }
        } catch (e) {
            console.log("API Login unavailable.");
        }
        const user = users.find(u => u.email === email && u.password === pass);
        if (user) { setCurrentUser(user); setSession(user); setLoginError(''); setView('home'); setActiveTab('home'); } 
        else { setLoginError('Invalid email or password'); }
    };

    const handleRegister = async (newUser: Partial<User>) => {
        try {
            await api.signup({ username: newUser.name || 'User', email: newUser.email!, password: newUser.password! });
            await handleLogin(newUser.email!, newUser.password!);
            setShowRegister(false);
        } catch (e) {
            const user: User = { id: users.length + 100, name: newUser.name!, email: newUser.email, password: newUser.password, profileImage: newUser.profileImage!, coverImage: newUser.coverImage, isOnline: true, followers: [], following: [], role: 'user' };
            setUsers([...users, user]);
            setCurrentUser(user);
            setSession(user);
            setShowRegister(false);
            setView('home');
        }
    };

    const handleLogout = () => { setCurrentUser(null); clearSession(); setView('home'); };

    const handleCreatePost = async (text: string, file: File | null, type: any, visibility: any, location?: string, feeling?: string, taggedUsers?: number[], background?: string, linkPreview?: LinkPreview) => {
        if (!currentUser) return;
        let image = undefined; let video = undefined;
        if (file) { const url = URL.createObjectURL(file); if (type === 'image') image = url; if (type === 'video') video = url; } else if (type === 'image' && !background && !linkPreview) { if (text.startsWith('http')) image = text; }
        
        try { await api.createPost({ user_id: currentUser.id, content: text, media_url: image || video }); } catch (e) {}
        
        const newPost: PostType = { id: Date.now(), authorId: currentUser.id, content: text, image, video, timestamp: "Just now", createdAt: Date.now(), reactions: [], comments: [], shares: 0, type, visibility, location, feeling, taggedUsers, background, linkPreview };
        setPosts([newPost, ...posts]);
    };

    const handleReaction = (postId: number, type: ReactionType) => {
        if (!currentUser) return;
        const updatePostReaction = (postList: PostType[]) => {
            return postList.map(p => {
                if (p.id === postId) {
                    const existing = p.reactions.find(r => r.userId === currentUser.id);
                    let newReactions = [...p.reactions];
                    if (existing) {
                        if (existing.type === type) newReactions = newReactions.filter(r => r.userId !== currentUser.id);
                        else newReactions = newReactions.map(r => r.userId === currentUser.id ? { ...r, type } : r);
                    } else {
                        newReactions.push({ userId: currentUser.id, type });
                    }
                    return { ...p, reactions: newReactions };
                }
                return p;
            });
        };
        setPosts(prev => updatePostReaction(prev));
        api.createLike({ user_id: currentUser.id, target_id: postId, target_type: 'post', like_type: type }).catch(err => console.warn("Like API unavailable"));
    };

    const handleComment = (postId: number, text: string, attachment?: any, parentId?: number) => {
        if (!currentUser) return;
        api.createComment({ post_id: postId, user_id: currentUser.id, content: text }).catch(err => console.warn("Comment API unavailable"));
        
        const updatePostComment = (postList: PostType[]) => {
            return postList.map(p => {
                if (p.id === postId) {
                    const newComment: Comment = { id: Date.now(), userId: currentUser.id, text, timestamp: "Just now", likes: 0, attachment, replies: [] };
                    return { ...p, comments: [...p.comments, newComment] };
                }
                return p;
            });
        };
        setPosts(prev => updatePostComment(prev));
    };

    const handleFollow = (userId: number) => {
        if (!currentUser) return;
        api.followUser({ follower_id: currentUser.id, following_id: userId }).then((res: any) => {
            if(res.success) {
               // Update local state if API successful
               const isFollowing = currentUser.following.includes(userId);
               const updatedCurrentUser = { ...currentUser, following: isFollowing ? currentUser.following.filter(id => id !== userId) : [...currentUser.following, userId] };
               setCurrentUser(updatedCurrentUser);
               setSession(updatedCurrentUser);
               setUsers(prev => prev.map(u => u.id === userId ? { ...u, followers: isFollowing ? u.followers.filter(id => id !== currentUser.id) : [...u.followers, currentUser.id] } : u));
            }
        });
    };

    // New API Methods
    const handleMarkNotificationsRead = () => {
        if (!currentUser) return;
        api.markNotificationRead({ user_id: currentUser.id, all: true });
        setNotifications(prev => prev.map(n => ({...n, read: true})));
    };

    const handleShareToFeed = (caption: string) => {
        if (!currentUser || !activeSharePostId) return;
        api.sharePost({ user_id: currentUser.id, original_post_id: activeSharePostId, caption });
        
        let postToShare = posts.find(p => p.id === activeSharePostId);
        if (postToShare) {
            const originalAuthor = users.find(u => u.id === postToShare?.authorId);
            const newPost: PostType = { id: Date.now(), authorId: currentUser.id, content: caption, timestamp: "Just now", createdAt: Date.now(), reactions: [], comments: [], shares: 0, type: 'text', visibility: 'Public', sharedPostId: postToShare.id };
            (newPost as any).embeddedSharedPost = { ...postToShare, originalAuthorName: originalAuthor?.name };
            setPosts([newPost, ...posts]);
            setActiveSharePostId(null);
            alert("Shared to your feed!");
        }
    };

    // ... Group/Brand/Other handlers same as before, simplified for this diff ...
    const handleCreateGroup = (groupData: Partial<Group>) => {
        if (!currentUser) return;
        api.createGroup({ owner_id: currentUser.id, name: groupData.name!, description: groupData.description || '', privacy: (groupData.type as any) || 'public' });
        const newGroup: Group = { id: `g${Date.now()}`, name: groupData.name!, description: groupData.description!, type: groupData.type || 'public', image: groupData.image!, coverImage: groupData.coverImage!, adminId: currentUser.id, members: [currentUser.id], posts: [], createdDate: Date.now() };
        setGroups(prev => [newGroup, ...prev]);
    };
    const handleJoinGroup = (groupId: string) => { if (!currentUser) return; setGroups(prev => prev.map(g => g.id === groupId ? { ...g, members: [...g.members, currentUser.id] } : g)); };
    const handlePostToGroup = (groupId: string, content: string, file: File | null, type: any, background?: string) => {
        if (!currentUser) return;
        const newPost: GroupPost = { id: Date.now(), authorId: currentUser.id, content, timestamp: Date.now(), likes: [], comments: [], shares: 0, background };
        setGroups(prev => prev.map(g => g.id === groupId ? { ...g, posts: [newPost, ...g.posts] } : g));
    };
    const handleCreateBrand = (brandData: Partial<Brand>) => { if (!currentUser) return; api.createBrand({ owner_id: currentUser.id, name: brandData.name!, description: brandData.description || '', category: brandData.category || 'Business', logo_url: brandData.profileImage }); setBrands(prev => [...prev, { ...brandData, id: Date.now(), adminId: currentUser.id, followers: [] } as Brand]); };
    const handleFollowBrand = (brandId: number) => { if (!currentUser) return; const isFollowing = brands.find(b => b.id === brandId)?.followers.includes(currentUser.id); setBrands(prev => prev.map(b => b.id === brandId ? { ...b, followers: isFollowing ? b.followers.filter(id => id !== currentUser.id) : [...b.followers, currentUser.id] } : b)); };
    const handlePostAsBrand = (brandId: number, contentData: any) => { const newPost: PostType = { id: Date.now(), authorId: brandId, content: contentData.text, timestamp: "Just now", createdAt: Date.now(), reactions: [], comments: [], shares: 0, type: contentData.type, visibility: contentData.visibility }; setPosts([newPost, ...posts]); };

    const handleUpdateBrand = (brandId: number, data: Partial<Brand>) => {
        setBrands(prev => prev.map(b => b.id === brandId ? { ...b, ...data } : b));
    };

    const handleBrandMessage = (brandId: number) => {
        const brand = brands.find(b => b.id === brandId);
        if (brand) {
            const brandAsUser: User = {
                id: brand.id, 
                name: brand.name, 
                profileImage: brand.profileImage, 
                isOnline: true, 
                followers: [], 
                following: [],
                role: 'user'
            };
            setActiveChatUser(brandAsUser);
        }
    };

    const handleCreateBrandEvent = (brandId: number, event: Partial<Event>) => {
        const newEvent: Event = { 
            id: Date.now(), 
            organizerId: brandId, 
            attendees: [currentUser!.id], 
            interestedIds: [],
            title: event.title || '',
            description: event.description || '',
            date: event.date || new Date().toISOString(),
            time: event.time || '',
            location: event.location || '',
            image: event.image || ''
        };
        setEvents([newEvent, ...events]);
    };

    const navigateTo = (destination: string) => {
        if (destination.startsWith('post-')) { setView('home'); } else { setView(destination); setActiveTab(destination); }
    };

    // --- HELPER FOR VIDEO CLICK (OPEN IN REELS) ---
    const handleVideoClick = (post: PostType) => {
        if (post.type !== 'video' || !post.video) return;

        // Check if this post already exists as a reel to avoid duplicates or missing context
        const existingReel = reels.find(r => r.id === post.id);

        if (!existingReel) {
            // Convert the Post to a Reel object temporarily for the feed
            const newReel: Reel = {
                id: post.id,
                userId: post.authorId,
                videoUrl: post.video,
                caption: post.content || '',
                songName: 'Original Audio', // Default if not specified in post
                reactions: post.reactions,
                comments: post.comments,
                shares: post.shares,
                isCompressed: false
            };
            // Add to reels state so it appears in the feed
            setReels(prev => [newReel, ...prev]);
        }

        // Navigate to Reels view and focus this video
        setActiveReelId(post.id);
        setView('reels');
        setActiveTab('reels');
    };

    if (isLoading) return <Spinner />;
    const isPublicPage = ['help', 'terms', 'privacy'].includes(view);
    if (showRegister) return <Register onRegister={handleRegister} onBackToLogin={() => setShowRegister(false)} />;
    if (!currentUser && !view && !isPublicPage) return <Login onLogin={handleLogin} onNavigateToRegister={() => setShowRegister(true)} onClose={() => setView('home')} error={loginError} />;

    return (
        <div className="bg-[#18191A] min-h-screen text-[#E4E6EB] font-sans">
            <Header onHomeClick={() => { setView('home'); setActiveTab('home'); }} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onReelsClick={() => { setView('reels'); setActiveTab('reels'); }} onMarketplaceClick={() => { setView('marketplace'); setActiveTab('marketplace'); }} onGroupsClick={() => { setView('groups'); setActiveTab('groups'); }} currentUser={currentUser} notifications={notifications} users={users} groups={groups} brands={brands} onLogout={handleLogout} onLoginClick={() => setView('')} onMarkNotificationsRead={handleMarkNotificationsRead} activeTab={activeTab} onNavigate={navigateTo} />
            <div className="flex justify-center">
                <Sidebar currentUser={currentUser || INITIAL_USERS[0]} onProfileClick={(id) => { if(currentUser) { setSelectedUserId(id); setView('profile'); } else alert("Login to view profiles"); }} onReelsClick={() => { setView('reels'); setActiveTab('reels'); }} onMarketplaceClick={() => { setView('marketplace'); setActiveTab('marketplace'); }} onGroupsClick={() => { setView('groups'); setActiveTab('groups'); }} />
                <div className="flex-1 w-full max-w-[700px] min-h-screen relative">
                    {view === 'home' && (
                        <div className="w-full pb-20 pt-4 px-0 md:px-4">
                            <StoryReel stories={enrichedStories} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onCreateStory={(file) => setStories([{ id: Date.now(), userId: currentUser!.id, image: URL.createObjectURL(file), createdAt: Date.now(), user: currentUser! }, ...stories])} onViewStory={(s) => setActiveStory(s)} />
                            {currentUser && <CreatePost currentUser={currentUser} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onClick={() => setShowCreatePostModal(true)} onCreateEventClick={() => setShowCreateEventModal(true)} />}
                            <SuggestedProductsWidget products={products} currentUser={currentUser || INITIAL_USERS[0]} onViewProduct={(p) => setActiveProduct(p)} onSeeAll={() => { setView('marketplace'); setActiveTab('marketplace'); }} />
                            {rankedPosts.map(post => {
                                const author = users.find(u => u.id === post.authorId) || brands.find(b => b.id === post.authorId);
                                if (!author) return null;
                                return (
                                    <Post key={post.id} post={post} author={author as any} currentUser={currentUser} users={users}
                                        onProfileClick={(id) => { if (brands.some(b => b.id === id)) { setView('brands'); } else { setSelectedUserId(id); setView('profile'); } }}
                                        onReact={handleReaction} onShare={(id) => setActiveSharePostId(id)} onDelete={(id) => setPosts(prev => prev.filter(p => p.id !== id))} onEdit={(id, content) => setPosts(prev => prev.map(p => p.id === id ? { ...p, content } : p))} onHashtagClick={() => {}} onViewImage={(url) => setFullScreenImage(url)} onOpenComments={(id) => setActiveCommentsPostId(id)} 
                                        onVideoClick={handleVideoClick} 
                                        onViewProduct={(p) => setActiveProduct(p)} onFollow={handleFollow} isFollowing={currentUser ? currentUser.following.includes(author.id) : false} onPlayAudio={(track) => { setCurrentAudioTrack(track); setIsAudioPlaying(true); }} sharedPost={(post as any).embeddedSharedPost}
                                    />
                                );
                            })}
                        </div>
                    )}
                    {view === 'profile' && selectedUserId && <UserProfile user={users.find(u => u.id === selectedUserId)!} currentUser={currentUser} users={users} groups={groups} brands={brands} posts={posts} reels={reels} songs={songs} episodes={episodes} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onFollow={handleFollow} onReact={handleReaction} onComment={handleComment} onShare={(id) => setActiveSharePostId(id)} onMessage={(id) => { setActiveChatUser(users.find(u => u.id === id) || null); }} onCreatePost={handleCreatePost} onUpdateProfileImage={(file) => { if (currentUser) { const url = URL.createObjectURL(file); setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, profileImage: url } : u)); setCurrentUser(prev => prev ? { ...prev, profileImage: url } : null); } }} onUpdateCoverImage={(file) => { if (currentUser) { const url = URL.createObjectURL(file); setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, coverImage: url } : u)); setCurrentUser(prev => prev ? { ...prev, coverImage: url } : null); } }} onUpdateUserDetails={(data) => { if (currentUser) { setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...data } : u)); setCurrentUser(prev => prev ? { ...prev, ...data } : null); } }} onDeletePost={(id) => setPosts(prev => prev.filter(p => p.id !== id))} onEditPost={(id, content) => setPosts(prev => prev.map(p => p.id === id ? { ...p, content } : p))} getCommentAuthor={(id) => users.find(u => u.id === id)} onViewImage={(url) => setFullScreenImage(url)} onCreateEventClick={() => setShowCreateEventModal(true)} onOpenComments={(id) => setActiveCommentsPostId(id)} 
                    onVideoClick={handleVideoClick} 
                    onPlayAudio={(track) => { setCurrentAudioTrack(track); setIsAudioPlaying(true); }} />}
                    {view === 'marketplace' && <MarketplacePage currentUser={currentUser} products={products} onNavigateHome={() => { setView('home'); setActiveTab('home'); }} onCreateProduct={(p) => setProducts([{ id: Date.now(), sellerId: currentUser!.id, sellerName: currentUser!.name, sellerAvatar: currentUser!.profileImage, date: Date.now(), views: 0, ratings: [], comments: [], images: [], title: '', category: '', description: '', country: '', address: '', mainPrice: 0, quantity: 1, phoneNumber: '', status: 'active', shareId: '', ...p } as Product, ...products])} onViewProduct={(p) => setActiveProduct(p)} />}
                    {view === 'reels' && <ReelsFeed reels={reels} users={users} currentUser={currentUser} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onCreateReelClick={() => setShowCreateReelModal(true)} onReact={(rid, type) => { setReels(prev => prev.map(r => r.id === rid ? { ...r, reactions: [...r.reactions, { userId: currentUser!.id, type }] } : r)); api.createLike({ user_id: currentUser!.id, target_id: rid, target_type: 'post', like_type: type }); }} onComment={(rid, text) => setReels(prev => prev.map(r => r.id === rid ? { ...r, comments: [...r.comments, { id: Date.now(), userId: currentUser!.id, text, timestamp: "Just now", likes: 0 }] } : r))} onShare={(rid) => setReels(prev => prev.map(r => r.id === rid ? { ...r, shares: r.shares + 1 } : r))} onFollow={handleFollow} getCommentAuthor={(id) => users.find(u => u.id === id)} initialReelId={activeReelId} />}
                    {view === 'groups' && <GroupsPage currentUser={currentUser} groups={groups} users={users} onCreateGroup={handleCreateGroup} onJoinGroup={handleJoinGroup} onLeaveGroup={(gid) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, members: g.members.filter(m => m !== currentUser!.id) } : g))} onDeleteGroup={(gid) => setGroups(prev => prev.filter(g => g.id !== gid))} onUpdateGroupImage={(gid, type, file) => { const url = URL.createObjectURL(file); setGroups(prev => prev.map(g => g.id === gid ? { ...g, [type === 'cover' ? 'coverImage' : 'image']: url } : g)); }} onPostToGroup={handlePostToGroup} onCreateGroupEvent={(gid, event) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, events: [...(g.events || []), { id: Date.now(), organizerId: currentUser!.id, attendees: [currentUser!.id], ...event } as Event] } : g))} onInviteToGroup={() => alert("Invitation sent!")} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onLikePost={(gid, pid) => { setGroups(prev => prev.map(g => g.id === gid ? { ...g, posts: g.posts.map(p => p.id === pid ? { ...p, reactions: [...(p.reactions || []), { userId: currentUser!.id, type: 'like' }] } : p) } : g)); api.createLike({ user_id: currentUser!.id, target_id: pid, target_type: 'post', like_type: 'like' }); }} onOpenComments={(gid, pid) => setActiveCommentsPostId(pid)} onSharePost={(gid, pid) => setActiveSharePostId(pid)} onDeleteGroupPost={(pid) => setGroups(prev => prev.map(g => ({ ...g, posts: g.posts.filter(p => p.id !== pid) })))} onRemoveMember={(gid, uid) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, members: g.members.filter(m => m !== uid) } : g))} onUpdateGroupSettings={(gid, settings) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, ...settings } : g))} />}
                    {view === 'brands' && <BrandsPage currentUser={currentUser} brands={brands} posts={posts} users={users} onCreateBrand={handleCreateBrand} onFollowBrand={handleFollowBrand} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onPostAsBrand={handlePostAsBrand} onReact={handleReaction} onComment={handleComment} onShare={(id) => setActiveSharePostId(id)} onOpenComments={(id) => setActiveCommentsPostId(id)} onUpdateBrand={handleUpdateBrand} onMessage={handleBrandMessage} onCreateEvent={handleCreateBrandEvent} />}
                    {view === 'music' && <MusicSystem currentUser={currentUser} songs={songs} episodes={episodes} onUpdateSongs={setSongs} onUpdateEpisodes={setEpisodes} onPlayTrack={(t) => { setCurrentAudioTrack(t); setIsAudioPlaying(true); }} currentTrackId={currentAudioTrack?.id} isPlaying={isAudioPlaying} onTogglePlay={() => setIsAudioPlaying(!isAudioPlaying)} onFeedPost={(p) => setPosts([ { ...p, id: Date.now(), authorId: currentUser!.id, timestamp: "Just now", createdAt: Date.now(), reactions: [], comments: [], shares: 0, visibility: 'Public' }, ...posts])} />}
                    {view === 'tools' && <ToolsPage />}
                    {view === 'help' && <HelpSupportPage onNavigateHome={() => { setView('home'); setActiveTab('home'); }} />}
                    {view === 'privacy' && <PrivacyPolicyPage onNavigateHome={() => { setView('home'); setActiveTab('home'); }} />}
                    {view === 'terms' && <TermsOfServicePage onNavigateHome={() => { setView('home'); setActiveTab('home'); }} />}
                    {view === 'profiles' && <SuggestedProfilesPage currentUser={currentUser!} users={users} groups={groups} onFollow={handleFollow} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} />}
                    {view === 'create_event' && <EventsPage events={events} currentUser={currentUser!} onJoinEvent={(eid) => setEvents(prev => prev.map(e => e.id === eid ? { ...e, attendees: [...e.attendees, currentUser!.id] } : e))} onCreateEventClick={() => setShowCreateEventModal(true)} />}
                    {view === 'birthdays' && currentUser && <BirthdaysPage currentUser={currentUser} users={users} onMessage={(id) => { setActiveChatUser(users.find(u => u.id === id) || null); }} />}
                    {view === 'memories' && currentUser && <MemoriesPage currentUser={currentUser} posts={posts} users={users} />}
                    {view === 'settings' && <SettingsPage currentUser={currentUser} onUpdateUser={(data) => { 
                        if (currentUser) {
                            const updatedUser = { ...currentUser, ...data };
                            setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u)); 
                            setCurrentUser(updatedUser); 
                            setSession(updatedUser);
                        }
                    }} />}
                </div>
                <RightSidebar contacts={users.filter(u => currentUser && currentUser.following.includes(u.id))} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} />
            </div>
            {activeStory && <StoryViewer story={activeStory} user={activeStory.user!} onClose={() => setActiveStory(null)} onLike={() => {}} />}
            {showCreatePostModal && currentUser && <CreatePostModal currentUser={currentUser} users={users} onClose={() => setShowCreatePostModal(false)} onCreatePost={handleCreatePost} onCreateEventClick={() => { setShowCreatePostModal(false); setShowCreateEventModal(true); }} />}
            {showCreateReelModal && currentUser && <CreateReel currentUser={currentUser} onClose={() => setShowCreateReelModal(false)} onSubmit={(file, caption, song, effect) => { const newReel: Reel = { id: Date.now(), userId: currentUser.id, videoUrl: URL.createObjectURL(file), caption, songName: song, effectName: effect, reactions: [], comments: [], shares: 0, isCompressed: false }; setReels([newReel, ...reels]); setActiveReelId(newReel.id); }} />}
            {showCreateEventModal && currentUser && <CreateEventModal currentUser={currentUser} onClose={() => setShowCreateEventModal(false)} onCreate={(e) => setEvents([{ id: Date.now(), organizerId: currentUser.id, attendees: [currentUser.id], interestedIds: [], ...e } as Event, ...events])} />}
            {activeCommentsPostId && <CommentsSheet post={[...posts, ...groups.flatMap(g => g.posts.map(p => ({...p, reactions: p.reactions || []}) as any))].find(p => p.id === activeCommentsPostId)!} currentUser={currentUser!} users={users} onClose={() => setActiveCommentsPostId(null)} onComment={handleComment} onLikeComment={() => {}} getCommentAuthor={(id) => users.find(u => u.id === id) || brands.find(b => b.id === id) as any} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); setActiveCommentsPostId(null); }} />}
            {activeSharePostId && <ShareSheet post={[...posts, ...groups.flatMap(g => g.posts.map(p => ({...p, reactions: p.reactions || []}) as any))].find(p => p.id === activeSharePostId)!} groups={currentUser ? groups.filter(g => g.members.includes(currentUser.id)) : []} onClose={() => setActiveSharePostId(null)} onShareNow={handleShareToFeed} onShareToGroup={(gid, caption) => {api.sharePost({user_id: currentUser!.id, original_post_id: activeSharePostId, caption, group_id: gid}); setActiveSharePostId(null);}} onCopyLink={() => { alert("Link copied to clipboard!"); setActiveSharePostId(null); }} disableExternalShare={false} />}
            {activeChatUser && currentUser && <ChatWindow currentUser={currentUser} recipient={activeChatUser} messages={messages.filter(m => (m.senderId === currentUser.id && m.receiverId === activeChatUser.id) || (m.senderId === activeChatUser.id && m.receiverId === currentUser.id))} onClose={() => setActiveChatUser(null)} onSendMessage={(text, sticker) => setMessages([...messages, { id: Date.now(), senderId: currentUser.id, receiverId: activeChatUser.id, text: sticker ? '' : text, stickerUrl: sticker, timestamp: Date.now() }])} />}
            {fullScreenImage && <ImageViewer imageUrl={fullScreenImage} onClose={() => setFullScreenImage(null)} />}
            {activeProduct && <ProductDetailModal product={activeProduct} currentUser={currentUser} onClose={() => setActiveProduct(null)} onMessage={(id) => { setActiveChatUser(users.find(u => u.id === id) || null); setActiveProduct(null); }} />}
            {currentAudioTrack && <GlobalAudioPlayer currentTrack={currentAudioTrack} isPlaying={isAudioPlaying} onTogglePlay={() => setIsAudioPlaying(!isAudioPlaying)} onNext={() => {}} onPrevious={() => {}} onClose={() => { setCurrentAudioTrack(null); setIsAudioPlaying(false); }} onDownload={() => alert("Downloaded")} onLike={() => {}} onArtistClick={(id) => { setSelectedUserId(id); setView('profile'); }} isLiked={false} uploaderProfile={users.find(u => u.id === currentAudioTrack.uploaderId)} />}
        </div>
    );
}
