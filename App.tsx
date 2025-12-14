
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

// --- COOKIE HELPERS ---
const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
};

const getCookie = (name: string) => {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
};

const deleteCookie = (name: string) => {
    setCookie(name, '', -1);
};

// Helper for Timestamp
const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
};

export default function App() {
    // Data State - Initialize with empty arrays to be populated by API
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [posts, setPosts] = useState<PostType[]>(INITIAL_POSTS);
    const [stories, setStories] = useState<Story[]>(INITIAL_STORIES.map(s => ({...s, createdAt: Date.now()}))); 
    const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
    const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
    const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
    
    // Audio State
    const [songs, setSongs] = useState<Song[]>(MOCK_SONGS);
    const [episodes, setEpisodes] = useState<Episode[]>(MOCK_EPISODES);
    
    // Auth State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [showRegister, setShowRegister] = useState(false);
    const [loginError, setLoginError] = useState('');
    
    // View State
    const [activeTab, setActiveTab] = useState('home'); 
    const [view, setView] = useState('home'); 
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [activeReelId, setActiveReelId] = useState<number | null>(null);
    
    // Audio Player State
    const [currentAudioTrack, setCurrentAudioTrack] = useState<AudioTrack | null>(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    // UI states
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
    
    // --- SESSION RESTORATION ---
    useEffect(() => {
        const storedUser = getCookie('unera_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setCurrentUser(user);
            } catch (e) {
                console.error("Failed to restore session", e);
            }
        }
    }, []);

    // --- REAL-TIME WEBSOCKET CONNECTION ---
    useEffect(() => {
        let ws: WebSocket;
        const connectWs = () => {
            // Using the user-provided URL, typically would be dynamic based on env
            const wsUrl = "wss://unera-2.pages.dev/live_feed"; 
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("Connected to Live Feed");
            };

            ws.onmessage = (evt) => {
                try {
                    const message = JSON.parse(evt.data);
                    console.log("Live update:", message);
                    
                    if (message.type === 'new_post') {
                        // Transform basic post data to full UI Post object if needed
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
                } catch (e) {
                    console.error("Error parsing live message", e);
                }
            };

            ws.onclose = () => {
                console.log("Disconnected from Live Feed, retrying in 5s...");
                setTimeout(connectWs, 5000);
            };
            
            ws.onerror = (e) => {
                console.log("WS Error", e);
            };
        };

        connectWs();

        return () => {
            if (ws) ws.close();
        };
    }, []);

    // --- API INTEGRATION ---
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Parallel fetch for better performance
                const [
                    remoteUsers, 
                    remotePosts, 
                    remoteGroups, 
                    remoteBrands, 
                    remoteEvents, 
                    remoteVideos, 
                    remoteMusic, 
                    remotePodcasts
                ] = await Promise.all([
                    api.getUsers(),
                    api.getPosts(),
                    api.getGroups(),
                    api.getBrands(),
                    api.getEvents(),
                    api.getVideos(),
                    api.getMusic(),
                    api.getPodcasts()
                ]);

                if (remoteUsers) {
                    // Map API users to frontend User type
                    const mappedUsers: User[] = remoteUsers.map((u: any) => ({
                        id: u.id,
                        name: u.username || u.name || `User ${u.id}`,
                        email: u.email,
                        profileImage: u.profile_url || `https://ui-avatars.com/api/?name=${u.username}&background=random`,
                        coverImage: u.cover_url,
                        bio: u.bio,
                        followers: [], // Needs backend support
                        following: [],
                        isOnline: false
                    }));
                    setUsers(prev => {
                        const existingIds = new Set(prev.map(u => u.id));
                        const newUsers = mappedUsers.filter(u => !existingIds.has(u.id));
                        return [...prev, ...newUsers];
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
                        visibility: 'Public'
                    }));
                    setPosts(prev => {
                        const existingIds = new Set(prev.map(p => p.id));
                        const uniqueNewPosts = mappedPosts.filter(p => !existingIds.has(p.id));
                        return [...uniqueNewPosts, ...prev];
                    });
                }

                if (remoteGroups) {
                    const mappedGroups: Group[] = remoteGroups.map((g: any) => ({
                        id: g.id.toString(),
                        name: g.name,
                        description: g.description,
                        type: g.privacy || 'public',
                        image: g.image_url || `https://ui-avatars.com/api/?name=${g.name}&background=random`,
                        coverImage: g.cover_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
                        adminId: g.owner_id,
                        members: [g.owner_id], // Basic member list
                        posts: [],
                        createdDate: Date.now()
                    }));
                    setGroups(prev => [...mappedGroups, ...prev.filter(pg => !mappedGroups.find(mg => mg.id === pg.id))]);
                }

                if (remoteBrands) {
                    const mappedBrands: Brand[] = remoteBrands.map((b: any) => ({
                        id: b.id,
                        name: b.name,
                        description: b.description,
                        category: b.category,
                        profileImage: b.logo_url || `https://ui-avatars.com/api/?name=${b.name}`,
                        coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926',
                        adminId: b.owner_id,
                        followers: [],
                        joinedDate: new Date().toISOString()
                    }));
                    setBrands(prev => [...mappedBrands, ...prev.filter(pb => !mappedBrands.find(mb => mb.id === pb.id))]);
                }

                if (remoteEvents) {
                    const mappedEvents: Event[] = remoteEvents.map((e: any) => ({
                        id: e.id,
                        organizerId: e.creator_id,
                        title: e.title,
                        description: e.description,
                        date: e.event_date,
                        time: new Date(e.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                        location: e.location,
                        image: e.cover_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
                        attendees: [],
                        interestedIds: []
                    }));
                    setEvents(prev => [...mappedEvents, ...prev.filter(pe => !mappedEvents.find(me => me.id === pe.id))]);
                }

                if (remoteVideos) {
                    const mappedReels: Reel[] = remoteVideos.map((v: any) => ({
                        id: v.id,
                        userId: v.user_id,
                        videoUrl: v.video_url,
                        caption: v.description || v.title,
                        songName: 'Original Audio',
                        reactions: [],
                        comments: [],
                        shares: 0
                    }));
                    setReels(prev => [...mappedReels, ...prev.filter(pr => !mappedReels.find(mr => mr.id === pr.id))]);
                }

                if (remoteMusic) {
                    const mappedSongs: Song[] = remoteMusic.map((m: any) => ({
                        id: m.id.toString(),
                        title: m.title,
                        artist: m.artist,
                        album: 'Single',
                        cover: m.cover_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
                        duration: '3:00',
                        audioUrl: m.audio_url,
                        stats: { plays: 0, downloads: 0, shares: 0, likes: 0, reelsUse: 0 },
                        uploaderId: m.user_id
                    }));
                    setSongs(prev => [...mappedSongs, ...prev.filter(ps => !mappedSongs.find(ms => ms.id === ps.id))]);
                }

                if (remotePodcasts) {
                    const mappedEpisodes: Episode[] = remotePodcasts.map((p: any) => ({
                        id: p.id.toString(),
                        podcastId: `pod_${p.id}`,
                        title: p.title,
                        description: p.description,
                        date: 'Recently',
                        duration: '45:00',
                        audioUrl: p.audio_url,
                        thumbnail: p.cover_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
                        stats: { plays: 0, downloads: 0, shares: 0, likes: 0, reelsUse: 0 },
                        uploaderId: p.creator_id,
                        host: `Creator ${p.creator_id}`
                    }));
                    setEpisodes(prev => [...mappedEpisodes, ...prev.filter(pe => !mappedEpisodes.find(me => me.id === pe.id))]);
                }

            } catch (err) {
                console.warn("Error fetching initial data", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, []);

    // --- ENRICH STORIES WITH USER DATA ---
    const enrichedStories = useMemo(() => {
        return stories.map(story => {
            if (story.user) return story;
            return {
                ...story,
                user: users.find(u => u.id === story.userId)
            };
        });
    }, [stories, users]);

    // --- RANKED FEED LOGIC INCLUDING GROUPS ---
    const rankedPosts = useMemo(() => {
        const standardPosts = rankFeed(posts, currentUser, users);
        const relevantGroups = groups.filter(g => g.type === 'public' || (currentUser && g.members.includes(currentUser.id)));
        
        const groupPostsNormalized: PostType[] = relevantGroups.flatMap(group => 
            group.posts.map(gp => {
                const normalizedReactions: any[] = gp.reactions || (gp.likes ? gp.likes.map(uid => ({ userId: uid, type: 'like' })) : []);
                
                return {
                    id: gp.id,
                    authorId: gp.authorId,
                    content: gp.content,
                    image: gp.image,
                    video: gp.video,
                    timestamp: getTimeAgo(gp.timestamp),
                    createdAt: gp.timestamp,
                    reactions: normalizedReactions,
                    comments: gp.comments,
                    shares: gp.shares,
                    type: gp.video ? 'video' : (gp.image ? 'image' : 'text'),
                    visibility: 'Public',
                    background: gp.background,
                    groupId: group.id,
                    groupName: group.name,
                    isGroupAdmin: group.adminId === gp.authorId
                } as PostType;
            })
        );

        // Inject Products as Posts
        const productPosts: PostType[] = products.slice(0, 3).map((p, index) => ({
            id: -1000 - index, // Negative ID to avoid collision
            authorId: p.sellerId,
            content: p.description, // Or empty
            timestamp: 'Suggested Product',
            createdAt: p.date || Date.now(),
            reactions: [],
            comments: [],
            shares: 0,
            type: 'product',
            product: p,
            visibility: 'Public'
        }));

        // Inject Events as Posts
        const eventPosts: PostType[] = events.slice(0, 3).map((e, index) => ({
            id: -2000 - index,
            authorId: e.organizerId,
            content: e.description,
            timestamp: 'Upcoming Event',
            createdAt: Date.now(), // Show at top
            reactions: [],
            comments: [],
            shares: 0,
            type: 'event',
            event: e,
            visibility: 'Public'
        }));

        const allPosts = [...standardPosts, ...groupPostsNormalized, ...productPosts, ...eventPosts];
        return allPosts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    }, [posts, groups, currentUser, users, products, events]);

    // Simulate page routing for static pages
    useEffect(() => { 
        const path = window.location.pathname.toLowerCase();
        if (path.includes('help-support')) {
            setView('help');
            setActiveTab('');
        } else if (path.includes('privacy-policy')) {
            setView('privacy');
            setActiveTab('');
        } else if (path.includes('terms-of-service')) {
            setView('terms');
            setActiveTab('');
        }
    }, []);

    // Handlers
    const handleLogin = async (email: string, pass: string) => {
        try {
            const response = await api.login({ email, password: pass });
            
            if (response && response.user) {
                const user: User = {
                    id: response.user.id || 999, // Fallback ID if API varies
                    name: response.user.username || response.user.email.split('@')[0],
                    email: response.user.email,
                    profileImage: response.user.profile_url || `https://ui-avatars.com/api/?name=${response.user.email}&background=random`,
                    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926',
                    followers: [],
                    following: [],
                    isOnline: true,
                    role: 'user',
                    joinedDate: new Date().toISOString()
                };
                
                setCurrentUser(user);
                // Store session in cookie
                setCookie('unera_user', JSON.stringify(user), 7); // 7 days
                
                setLoginError('');
                setView('home');
                setActiveTab('home');
                return;
            } else if (response && response.error) {
                setLoginError(response.error);
                return;
            }
        } catch (e) {
            console.log("API Login unavailable, checking local records.");
        }

        // Mock Fallback
        const user = users.find(u => u.email === email && u.password === pass);
        if (user) {
            setCurrentUser(user);
            setCookie('unera_user', JSON.stringify(user), 7);
            setLoginError('');
            setView('home');
            setActiveTab('home');
        } else {
            setLoginError('Invalid email or password');
        }
    };

    const handleRegister = async (newUser: Partial<User>) => {
        try {
            await api.signup({ 
                username: newUser.name || 'User',
                email: newUser.email!, 
                password: newUser.password! 
            });
            alert("Account created successfully! Please login.");
            setShowRegister(false);
        } catch (e) {
            console.log("API Signup unavailable, using local mock.");
            const user: User = {
                id: users.length + 100,
                name: newUser.name!,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                password: newUser.password,
                profileImage: newUser.profileImage!,
                coverImage: newUser.coverImage,
                isOnline: true,
                followers: [],
                following: [],
                nationality: newUser.nationality,
                location: newUser.location,
                birthDate: newUser.birthDate,
                gender: newUser.gender,
                bio: newUser.bio,
                joinedDate: new Date().toISOString(),
                interests: []
            };
            setUsers([...users, user]);
            setShowRegister(false);
            setLoginError('Account created locally! Please sign in.');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        deleteCookie('unera_user');
        setView('home');
    };

    const handleCreatePost = async (text: string, file: File | null, type: any, visibility: any, location?: string, feeling?: string, taggedUsers?: number[], background?: string, linkPreview?: LinkPreview) => {
        if (!currentUser) return;
        
        let image = undefined;
        let video = undefined;
        
        if (file) {
            const url = URL.createObjectURL(file);
            if (type === 'image') image = url;
            if (type === 'video') video = url;
        } else if (type === 'image' && !background && !linkPreview) { 
             if (text.startsWith('http')) image = text; 
        }

        // API Call
        try {
            await api.createPost({
                user_id: currentUser.id,
                content: text,
                media_url: image || video
            });
        } catch (e) {
            console.warn("Failed to post to API, saving locally.");
        }

        const newPost: PostType = {
            id: Date.now(),
            authorId: currentUser.id,
            content: text,
            image,
            video,
            timestamp: "Just now",
            createdAt: Date.now(),
            reactions: [],
            comments: [],
            shares: 0,
            type,
            visibility,
            location,
            feeling,
            taggedUsers,
            background,
            linkPreview
        };
        setPosts([newPost, ...posts]);
    };

    const handleReaction = (postId: number, type: ReactionType) => {
        if (!currentUser) return;
        
        // Optimistic UI Update
        const updatePostReaction = (postList: PostType[]) => {
            return postList.map(p => {
                if (p.id === postId) {
                    const existing = p.reactions.find(r => r.userId === currentUser.id);
                    let newReactions = [...p.reactions];
                    if (existing) {
                        if (existing.type === type) {
                            newReactions = newReactions.filter(r => r.userId !== currentUser.id); 
                        } else {
                            newReactions = newReactions.map(r => r.userId === currentUser.id ? { ...r, type } : r); 
                        }
                    } else {
                        newReactions.push({ userId: currentUser.id, type });
                        if (p.authorId !== currentUser.id) {
                            setNotifications(prev => [{
                                id: Date.now(),
                                userId: p.authorId,
                                senderId: currentUser.id,
                                type: 'like',
                                content: `reacted ${type} to your post.`,
                                postId: p.id,
                                timestamp: Date.now(),
                                read: false
                            }, ...prev]);
                        }
                    }
                    return { ...p, reactions: newReactions };
                }
                return p;
            });
        };
        setPosts(prev => updatePostReaction(prev));

        // API Call
        api.createLike({
            user_id: currentUser.id,
            target_id: postId,
            target_type: 'post'
        }).catch(err => console.warn("Like API unavailable"));
    };

    const handleComment = (postId: number, text: string, attachment?: any, parentId?: number) => {
        if (!currentUser) return;
        
        // API Call
        api.createComment({
            post_id: postId,
            user_id: currentUser.id,
            content: text
        }).catch(err => console.warn("Comment API unavailable"));

        const isMainPost = posts.some(p => p.id === postId);
        if (isMainPost) {
            const updatePostComment = (postList: PostType[]) => {
                return postList.map(p => {
                    if (p.id === postId) {
                        if (parentId) {
                            const updatedComments = p.comments.map(c => {
                                if (c.id === parentId) {
                                    const newReply: CommentReply = { id: Date.now(), userId: currentUser.id, reply: text, date: Date.now(), likes: 0 };
                                    return { ...c, replies: [...(c.replies || []), newReply] };
                                }
                                return c;
                            });
                            return { ...p, comments: updatedComments };
                        } else {
                            const newComment: Comment = { id: Date.now(), userId: currentUser.id, text, timestamp: "Just now", likes: 0, attachment, replies: [] };
                            if (p.authorId !== currentUser.id) {
                                setNotifications(prev => [{
                                    id: Date.now(), userId: p.authorId, senderId: currentUser.id, type: 'comment', content: `commented on your post: "${text.substring(0, 20)}..."`, postId: p.id, timestamp: Date.now(), read: false
                                }, ...prev]);
                            }
                            return { ...p, comments: [...p.comments, newComment] };
                        }
                    }
                    return p;
                });
            };
            setPosts(prev => updatePostComment(prev));
        } else {
            setGroups(prev => prev.map(g => {
                const postExists = g.posts.some(p => p.id === postId);
                if (postExists) {
                    return {
                        ...g,
                        posts: g.posts.map(p => {
                            if (p.id === postId) {
                                const newComment: Comment = { id: Date.now(), userId: currentUser.id, text, timestamp: "Just now", likes: 0, attachment, replies: [] };
                                return { ...p, comments: [...p.comments, newComment] };
                            }
                            return p;
                        })
                    }
                }
                return g;
            }));
        }
    };

    const handleFollow = (userId: number) => {
        if (!currentUser) return;
        const isFollowing = currentUser.following.includes(userId);
        const updatedCurrentUser = {
            ...currentUser,
            following: isFollowing ? currentUser.following.filter(id => id !== userId) : [...currentUser.following, userId]
        };
        setCurrentUser(updatedCurrentUser);
        setCookie('unera_user', JSON.stringify(updatedCurrentUser), 7);
        setUsers(prevUsers => prevUsers.map(u => {
            if (u.id === currentUser.id) return updatedCurrentUser;
            if (u.id === userId) {
                const updatedTargetUser = {
                    ...u,
                    followers: isFollowing ? u.followers.filter(id => id !== currentUser.id) : [...u.followers, currentUser.id]
                };
                if (!isFollowing) {
                    setNotifications(prev => [{
                        id: Date.now(), userId: u.id, senderId: currentUser.id, type: 'follow', content: `started following you.`, timestamp: Date.now(), read: false
                    }, ...prev]);
                }
                return updatedTargetUser;
            }
            return u;
        }));
    };

    // Group handlers
    const handleCreateGroup = (groupData: Partial<Group>) => {
        if (!currentUser) return;
        
        // API Call
        api.createGroup({
            owner_id: currentUser.id,
            name: groupData.name!,
            description: groupData.description || '',
            privacy: (groupData.type === 'public' || groupData.type === 'private') ? groupData.type : 'public'
        }).catch(err => console.warn("Create Group API unavailable"));

        const newGroup: Group = {
            id: `g${Date.now()}`,
            name: groupData.name!, description: groupData.description!, type: groupData.type || 'public',
            image: groupData.image!, coverImage: groupData.coverImage!, adminId: currentUser.id, members: [currentUser.id], posts: [], createdDate: Date.now(), events: [], memberPostingAllowed: true
        };
        setGroups(prev => [newGroup, ...prev]);
    };
    const handleJoinGroup = (groupId: string) => {
        if (!currentUser) return;
        setGroups(prev => prev.map(g => {
            if (g.id === groupId) {
                if (g.members.includes(currentUser.id)) return g;
                return { ...g, members: [...g.members, currentUser.id] };
            }
            return g;
        }));
    };
    const handlePostToGroup = (groupId: string, content: string, file: File | null, type: 'image' | 'video' | 'doc' | 'text', background?: string) => {
        if (!currentUser) return;
        const newPost: GroupPost = {
            id: Date.now(), authorId: currentUser.id, content, timestamp: Date.now(), likes: [], comments: [], shares: 0, background
        };
        if (file) {
            const url = URL.createObjectURL(file);
            if (type === 'image') newPost.image = url; else if (type === 'video') newPost.video = url; else newPost.attachment = { name: file.name, type: 'file', url, size: '1MB' };
        }
        setGroups(prev => prev.map(g => { if (g.id === groupId) { return { ...g, posts: [newPost, ...g.posts] }; } return g; }));
    };

    // Brands Handlers
    const handleCreateBrand = (brandData: Partial<Brand>) => {
        if (!currentUser) return;
        
        // API Call
        api.createBrand({
            owner_id: currentUser.id,
            name: brandData.name!,
            description: brandData.description || '',
            category: brandData.category || 'Business',
            logo_url: brandData.profileImage
        }).catch(err => console.warn("Create Brand API unavailable"));

        const newBrand: Brand = {
            id: 10000 + brands.length + 1,
            name: brandData.name!,
            description: brandData.description || '',
            category: brandData.category || 'Other',
            profileImage: brandData.profileImage!,
            coverImage: brandData.coverImage!,
            adminId: currentUser.id,
            followers: [],
            isVerified: false,
            website: brandData.website,
            location: brandData.location,
            contactEmail: brandData.contactEmail,
            contactPhone: brandData.contactPhone,
            joinedDate: new Date().toISOString()
        };
        setBrands(prev => [...prev, newBrand]);
    };
    const handleUpdateBrand = (brandId: number, data: Partial<Brand>) => { setBrands(prev => prev.map(b => b.id === brandId ? { ...b, ...data } : b)); };
    const handleFollowBrand = (brandId: number) => {
        if (!currentUser) return;
        const isFollowing = brands.find(b => b.id === brandId)?.followers.includes(currentUser.id);
        setBrands(prev => prev.map(b => { if (b.id === brandId) { return { ...b, followers: isFollowing ? b.followers.filter(id => id !== currentUser.id) : [...b.followers, currentUser.id] }; } return b; }));
        const updatedUser = { ...currentUser, following: isFollowing ? currentUser.following.filter(id => id !== brandId) : [...currentUser.following, brandId] };
        setCurrentUser(updatedUser);
        setCookie('unera_user', JSON.stringify(updatedUser), 7);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    };
    const handlePostAsBrand = (brandId: number, contentData: any) => {
        const { text, file, type, visibility } = contentData;
        let image = undefined, video = undefined;
        if (file) { const url = URL.createObjectURL(file); if (type === 'image') image = url; if (type === 'video') video = url; }
        const newPost: PostType = { id: Date.now(), authorId: brandId, content: text, image, video, timestamp: "Just now", createdAt: Date.now(), reactions: [], comments: [], shares: 0, type, visibility };
        setPosts([newPost, ...posts]);
    };
    const handleBrandMessage = (brandId: number) => {
        const brand = brands.find(b => b.id === brandId);
        if (brand) { setActiveChatUser({ id: brand.id, name: brand.name, profileImage: brand.profileImage, isOnline: true, followers: [], following: [] } as User); }
    };
    const handleCreateBrandEvent = (brandId: number, eventData: Partial<Event>) => {
        const newEvent: Event = { id: Date.now(), organizerId: brandId, attendees: [currentUser!.id], interestedIds: [], ...eventData } as Event;
        setEvents(prev => [newEvent, ...prev]);
        const newPost: PostType = { id: Date.now(), authorId: brandId, type: 'event', event: newEvent, timestamp: "Just now", createdAt: Date.now(), reactions: [], comments: [], shares: 0, visibility: 'Public' };
        setPosts([newPost, ...posts]);
    };

    // Share Handlers
    const handleShareToFeed = (caption: string) => {
        if (!currentUser || !activeSharePostId) return;
        let postToShare = posts.find(p => p.id === activeSharePostId);
        if (!postToShare) { for (const group of groups) { const groupPost = group.posts.find(p => p.id === activeSharePostId); if (groupPost) { postToShare = { id: groupPost.id, authorId: groupPost.authorId, content: groupPost.content, image: groupPost.image, video: groupPost.video, background: groupPost.background, timestamp: "Just now", createdAt: groupPost.timestamp, reactions: [], comments: [], shares: groupPost.shares, type: groupPost.video ? 'video' : (groupPost.image ? 'image' : 'text'), visibility: 'Public', isGroupAdmin: false, groupName: group.name, groupId: group.id } as PostType; break; } } }
        if (postToShare) {
            const originalAuthor = users.find(u => u.id === postToShare.authorId) || brands.find(b => b.id === postToShare.authorId);
            const newPost: PostType = { id: Date.now(), authorId: currentUser.id, content: caption, image: undefined, video: undefined, background: undefined, timestamp: "Just now", createdAt: Date.now(), reactions: [], comments: [], shares: 0, type: 'text', visibility: 'Public', sharedPostId: postToShare.id };
            (newPost as any).embeddedSharedPost = { ...postToShare, originalAuthorName: originalAuthor?.name || 'Unknown User', originalAuthorImage: originalAuthor?.profileImage, originalAuthorId: originalAuthor?.id, originalGroupName: postToShare.groupName, originalGroupId: postToShare.groupId };
            setPosts([newPost, ...posts]);
            setPosts(prev => prev.map(p => p.id === activeSharePostId ? { ...p, shares: p.shares + 1 } : p));
            setGroups(prev => prev.map(g => ({ ...g, posts: g.posts.map(p => p.id === activeSharePostId ? { ...p, shares: p.shares + 1 } : p) })));
            setActiveSharePostId(null); alert("Shared to your feed!");
        }
    };
    const handleShareToGroup = (groupId: string, caption: string) => {
        if (!currentUser || !activeSharePostId) return;
        let postToShare = posts.find(p => p.id === activeSharePostId);
        if (!postToShare) { for (const group of groups) { const groupPost = group.posts.find(p => p.id === activeSharePostId); if (groupPost) { postToShare = groupPost as any; break; } } }
        if (postToShare) {
            const newGroupPost: GroupPost = { id: Date.now(), authorId: currentUser.id, content: `${caption}\n\n[Shared Post]: ${postToShare.content}`, image: postToShare.image, video: postToShare.video, background: postToShare.background, timestamp: Date.now(), likes: [], comments: [], shares: 0 };
            setGroups(prev => prev.map(g => { if (g.id === groupId) { return { ...g, posts: [newGroupPost, ...g.posts] }; } return g; }));
            setActiveSharePostId(null); alert("Shared to group!");
        }
    };

    const navigateTo = (destination: string) => {
        if (destination.startsWith('post-')) { setView('home'); } else { setView(destination); setActiveTab(destination); }
    };

    if (isLoading) return <div className="fixed inset-0 z-50 bg-[#18191A] flex flex-col items-center justify-center font-sans"><div className="flex flex-col items-center animate-fade-in scale-110 transform transition-transform"><div className="flex items-center gap-3 mb-8"><i className="fas fa-globe-americas text-[#1877F2] text-[48px] animate-pulse"></i><h1 className="text-[48px] font-bold bg-gradient-to-r from-[#1877F2] to-[#1D8AF2] text-transparent bg-clip-text">UNERA</h1></div><div className="relative w-12 h-12"><div className="absolute inset-0 rounded-full border-4 border-[#242526]"></div><div className="absolute inset-0 rounded-full border-4 border-t-[#1877F2] animate-spin border-r-transparent border-b-transparent border-l-transparent"></div></div><div className="mt-8 text-[#B0B3B8] text-sm font-medium tracking-widest uppercase opacity-70">Connecting...</div></div><div className="absolute bottom-10 flex flex-col items-center gap-1 opacity-60"><span className="text-[#555] text-[10px]">from</span><span className="text-[#E4E6EB] text-sm font-bold tracking-wider">UNERA (T) Company Ltd</span></div></div>;
    const isPublicPage = ['help', 'terms', 'privacy'].includes(view);
    if (showRegister) return <Register onRegister={handleRegister} onBackToLogin={() => setShowRegister(false)} />;
    if (!currentUser && !view && !isPublicPage) return <Login onLogin={handleLogin} onNavigateToRegister={() => setShowRegister(true)} onClose={() => setView('home')} error={loginError} />;

    return (
        <div className="bg-[#18191A] min-h-screen text-[#E4E6EB] font-sans">
            <Header onHomeClick={() => { setView('home'); setActiveTab('home'); }} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onReelsClick={() => { setView('reels'); setActiveTab('reels'); }} onMarketplaceClick={() => { setView('marketplace'); setActiveTab('marketplace'); }} onGroupsClick={() => { setView('groups'); setActiveTab('groups'); }} currentUser={currentUser} notifications={notifications} users={users} groups={groups} brands={brands} onLogout={handleLogout} onLoginClick={() => setView('')} onMarkNotificationsRead={() => setNotifications(prev => prev.map(n => ({...n, read: true})))} activeTab={activeTab} onNavigate={navigateTo} />
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
                                        onReact={handleReaction} onShare={(id) => setActiveSharePostId(id)} onDelete={(id) => setPosts(prev => prev.filter(p => p.id !== id))} onEdit={(id, content) => setPosts(prev => prev.map(p => p.id === id ? { ...p, content } : p))} onHashtagClick={() => {}} onViewImage={(url) => setFullScreenImage(url)} onOpenComments={(id) => setActiveCommentsPostId(id)} onVideoClick={(post) => { if(post.type === 'video') setFullScreenImage(post.video!); }} onViewProduct={(p) => setActiveProduct(p)} onFollow={handleFollow} isFollowing={currentUser ? currentUser.following.includes(author.id) : false} onPlayAudio={(track) => { setCurrentAudioTrack(track); setIsAudioPlaying(true); }} sharedPost={(post as any).embeddedSharedPost}
                                    />
                                );
                            })}
                        </div>
                    )}
                    {view === 'profile' && selectedUserId && <UserProfile user={users.find(u => u.id === selectedUserId)!} currentUser={currentUser} users={users} groups={groups} brands={brands} posts={posts} reels={reels} songs={songs} episodes={episodes} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onFollow={handleFollow} onReact={handleReaction} onComment={handleComment} onShare={(id) => setActiveSharePostId(id)} onMessage={(id) => { setActiveChatUser(users.find(u => u.id === id) || null); }} onCreatePost={handleCreatePost} onUpdateProfileImage={(file) => { if (currentUser) { const url = URL.createObjectURL(file); setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, profileImage: url } : u)); setCurrentUser(prev => prev ? { ...prev, profileImage: url } : null); } }} onUpdateCoverImage={(file) => { if (currentUser) { const url = URL.createObjectURL(file); setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, coverImage: url } : u)); setCurrentUser(prev => prev ? { ...prev, coverImage: url } : null); } }} onUpdateUserDetails={(data) => { if (currentUser) { setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...data } : u)); setCurrentUser(prev => prev ? { ...prev, ...data } : null); } }} onDeletePost={(id) => setPosts(prev => prev.filter(p => p.id !== id))} onEditPost={(id, content) => setPosts(prev => prev.map(p => p.id === id ? { ...p, content } : p))} getCommentAuthor={(id) => users.find(u => u.id === id)} onViewImage={(url) => setFullScreenImage(url)} onCreateEventClick={() => setShowCreateEventModal(true)} onOpenComments={(id) => setActiveCommentsPostId(id)} onVideoClick={(post) => { if(post.type === 'video') setFullScreenImage(post.video!); }} onPlayAudio={(track) => { setCurrentAudioTrack(track); setIsAudioPlaying(true); }} />}
                    {view === 'marketplace' && <MarketplacePage currentUser={currentUser} products={products} onNavigateHome={() => { setView('home'); setActiveTab('home'); }} onCreateProduct={(p) => setProducts([{ id: Date.now(), sellerId: currentUser!.id, sellerName: currentUser!.name, sellerAvatar: currentUser!.profileImage, date: Date.now(), views: 0, ratings: [], comments: [], images: [], title: '', category: '', description: '', country: '', address: '', mainPrice: 0, quantity: 1, phoneNumber: '', status: 'active', shareId: '', ...p } as Product, ...products])} onViewProduct={(p) => setActiveProduct(p)} />}
                    {view === 'reels' && <ReelsFeed reels={reels} users={users} currentUser={currentUser} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onCreateReelClick={() => setShowCreateReelModal(true)} onReact={(rid, type) => setReels(prev => prev.map(r => r.id === rid ? { ...r, reactions: [...r.reactions, { userId: currentUser!.id, type }] } : r))} onComment={(rid, text) => setReels(prev => prev.map(r => r.id === rid ? { ...r, comments: [...r.comments, { id: Date.now(), userId: currentUser!.id, text, timestamp: "Just now", likes: 0 }] } : r))} onShare={(rid) => setReels(prev => prev.map(r => r.id === rid ? { ...r, shares: r.shares + 1 } : r))} onFollow={handleFollow} getCommentAuthor={(id) => users.find(u => u.id === id)} initialReelId={activeReelId} />}
                    {view === 'groups' && <GroupsPage currentUser={currentUser} groups={groups} users={users} onCreateGroup={handleCreateGroup} onJoinGroup={handleJoinGroup} onLeaveGroup={(gid) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, members: g.members.filter(m => m !== currentUser!.id) } : g))} onDeleteGroup={(gid) => setGroups(prev => prev.filter(g => g.id !== gid))} onUpdateGroupImage={(gid, type, file) => { const url = URL.createObjectURL(file); setGroups(prev => prev.map(g => g.id === gid ? { ...g, [type === 'cover' ? 'coverImage' : 'image']: url } : g)); }} onPostToGroup={handlePostToGroup} onCreateGroupEvent={(gid, event) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, events: [...(g.events || []), { id: Date.now(), organizerId: currentUser!.id, attendees: [currentUser!.id], ...event } as Event] } : g))} onInviteToGroup={() => alert("Invitation sent!")} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onLikePost={(gid, pid) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, posts: g.posts.map(p => p.id === pid ? { ...p, reactions: [...(p.reactions || []), { userId: currentUser!.id, type: 'like' }] } : p) } : g))} onOpenComments={(gid, pid) => setActiveCommentsPostId(pid)} onSharePost={(gid, pid) => setActiveSharePostId(pid)} onDeleteGroupPost={(pid) => setGroups(prev => prev.map(g => ({ ...g, posts: g.posts.filter(p => p.id !== pid) })))} onRemoveMember={(gid, uid) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, members: g.members.filter(m => m !== uid) } : g))} onUpdateGroupSettings={(gid, settings) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, ...settings } : g))} />}
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
                    {view === 'settings' && <SettingsPage currentUser={currentUser} onUpdateUser={(data) => { setUsers(prev => prev.map(u => u.id === currentUser!.id ? { ...u, ...data } : u)); setCurrentUser(prev => prev ? { ...prev, ...data } : null); }} />}
                </div>
                <RightSidebar contacts={users.filter(u => currentUser && currentUser.following.includes(u.id))} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} />
            </div>
            {activeStory && <StoryViewer story={activeStory} user={activeStory.user!} onClose={() => setActiveStory(null)} onLike={() => {}} />}
            {showCreatePostModal && currentUser && <CreatePostModal currentUser={currentUser} users={users} onClose={() => setShowCreatePostModal(false)} onCreatePost={handleCreatePost} onCreateEventClick={() => { setShowCreatePostModal(false); setShowCreateEventModal(true); }} />}
            {showCreateReelModal && currentUser && <CreateReel currentUser={currentUser} onClose={() => setShowCreateReelModal(false)} onSubmit={(file, caption, song, effect) => { const newReel: Reel = { id: Date.now(), userId: currentUser.id, videoUrl: URL.createObjectURL(file), caption, songName: song, effectName: effect, reactions: [], comments: [], shares: 0, isCompressed: false }; setReels([newReel, ...reels]); setActiveReelId(newReel.id); }} />}
            {showCreateEventModal && currentUser && <CreateEventModal currentUser={currentUser} onClose={() => setShowCreateEventModal(false)} onCreate={(e) => setEvents([{ id: Date.now(), organizerId: currentUser.id, attendees: [currentUser.id], interestedIds: [], ...e } as Event, ...events])} />}
            {activeCommentsPostId && <CommentsSheet post={[...posts, ...groups.flatMap(g => g.posts.map(p => ({...p, reactions: p.reactions || []}) as any))].find(p => p.id === activeCommentsPostId)!} currentUser={currentUser!} users={users} onClose={() => setActiveCommentsPostId(null)} onComment={handleComment} onLikeComment={() => {}} getCommentAuthor={(id) => users.find(u => u.id === id) || brands.find(b => b.id === id) as any} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); setActiveCommentsPostId(null); }} />}
            {activeSharePostId && <ShareSheet post={[...posts, ...groups.flatMap(g => g.posts.map(p => ({...p, reactions: p.reactions || []}) as any))].find(p => p.id === activeSharePostId)!} groups={currentUser ? groups.filter(g => g.members.includes(currentUser.id)) : []} onClose={() => setActiveSharePostId(null)} onShareNow={handleShareToFeed} onShareToGroup={handleShareToGroup} onCopyLink={() => { alert("Link copied to clipboard!"); setActiveSharePostId(null); }} />}
            {activeChatUser && currentUser && <ChatWindow currentUser={currentUser} recipient={activeChatUser} messages={messages.filter(m => (m.senderId === currentUser.id && m.receiverId === activeChatUser.id) || (m.senderId === activeChatUser.id && m.receiverId === currentUser.id))} onClose={() => setActiveChatUser(null)} onSendMessage={(text, sticker) => setMessages([...messages, { id: Date.now(), senderId: currentUser.id, receiverId: activeChatUser.id, text: sticker ? '' : text, stickerUrl: sticker, timestamp: Date.now() }])} />}
            {fullScreenImage && <ImageViewer imageUrl={fullScreenImage} onClose={() => setFullScreenImage(null)} />}
            {activeProduct && <ProductDetailModal product={activeProduct} currentUser={currentUser} onClose={() => setActiveProduct(null)} onMessage={(id) => { setActiveChatUser(users.find(u => u.id === id) || null); setActiveProduct(null); }} />}
            {currentAudioTrack && <GlobalAudioPlayer currentTrack={currentAudioTrack} isPlaying={isAudioPlaying} onTogglePlay={() => setIsAudioPlaying(!isAudioPlaying)} onNext={() => {}} onPrevious={() => {}} onClose={() => { setCurrentAudioTrack(null); setIsAudioPlaying(false); }} onDownload={() => alert("Downloaded")} onLike={() => {}} onArtistClick={(id) => { setSelectedUserId(id); setView('profile'); }} isLiked={false} uploaderProfile={users.find(u => u.id === currentAudioTrack.uploaderId)} />}
        </div>
    );
}
