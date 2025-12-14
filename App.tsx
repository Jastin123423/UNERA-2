
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
import { MusicSystem, GlobalAudioPlayer } from './components/MusicSystem'; 
import { ToolsPage } from './components/Tools';
import { HelpSupportPage } from './components/HelpSupport';
import { PrivacyPolicyPage } from './components/PrivacyPolicy';
import { TermsOfServicePage } from './components/TermsOfService';
import { LanguageProvider } from './contexts/LanguageContext';
import { User, Post as PostType, Story, Reel, Notification, Message, Event, Product, Comment, CommentReply, ReactionType, LinkPreview, Group, GroupPost, AudioTrack, Song, Episode } from './types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_STORIES, INITIAL_REELS, INITIAL_EVENTS, INITIAL_GROUPS, MOCK_SONGS, MOCK_EPISODES } from './constants';
import { rankFeed } from './utils/ranking'; 

// Helper for Timestamp
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
    const [products, setProducts] = useState<Product[]>([]);
    const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
    
    // Lifted Audio State
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
    
    // Audio State
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
    const [activeSinglePostId, setActiveSinglePostId] = useState<number | null>(null);

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
        // 1. Get standard posts (Ranked)
        const standardPosts = rankFeed(posts, currentUser, users);
        
        // 2. Extract and Normalize Group Posts (Public groups or Joined groups)
        const relevantGroups = groups.filter(g => g.type === 'public' || (currentUser && g.members.includes(currentUser.id)));
        
        const groupPostsNormalized: PostType[] = relevantGroups.flatMap(group => 
            group.posts.map(gp => {
                // Normalize legacy likes array to reactions
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

        // 3. Merge and Sort by Date (Newest first)
        const allPosts = [...standardPosts, ...groupPostsNormalized];
        return allPosts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    }, [posts, groups, currentUser, users]);

    // Simulate loading
    useEffect(() => { 
        setTimeout(() => {
            setIsLoading(false);
            // URL Check logic for Help & Support
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
        }, 2500); 
    }, []);

    // Handlers
    const handleLogin = (email: string, pass: string) => {
        const user = users.find(u => u.email === email && u.password === pass);
        if (user) {
            setCurrentUser(user);
            setLoginError('');
            // 1. Redirect to Homepage after login
            setView('home');
            setActiveTab('home');
        } else {
            setLoginError('Invalid email or password');
        }
    };

    const handleRegister = (newUser: Partial<User>) => {
        const user: User = {
            id: users.length + 1,
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
        setCurrentUser(user);
        setShowRegister(false);
        // 1. Redirect to Homepage after registration
        setView('home');
        setActiveTab('home');
    };

    const handleCreatePost = (text: string, file: File | null, type: any, visibility: any, location?: string, feeling?: string, taggedUsers?: number[], background?: string, linkPreview?: LinkPreview) => {
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
        
        // Helper to update reaction in a list of posts
        const updatePostReaction = (postList: PostType[]) => {
            return postList.map(p => {
                if (p.id === postId) {
                    const existing = p.reactions.find(r => r.userId === currentUser.id);
                    let newReactions = [...p.reactions];
                    if (existing) {
                        if (existing.type === type) {
                            newReactions = newReactions.filter(r => r.userId !== currentUser.id); // Toggle off
                        } else {
                            newReactions = newReactions.map(r => r.userId === currentUser.id ? { ...r, type } : r); // Change type
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
    };

    const handleComment = (postId: number, text: string, attachment?: any, parentId?: number) => {
        if (!currentUser) return;
        
        // Check main posts first
        const isMainPost = posts.some(p => p.id === postId);

        if (isMainPost) {
            const updatePostComment = (postList: PostType[]) => {
                return postList.map(p => {
                    if (p.id === postId) {
                        if (parentId) {
                            const updatedComments = p.comments.map(c => {
                                if (c.id === parentId) {
                                    const newReply: CommentReply = {
                                        id: Date.now(),
                                        userId: currentUser.id,
                                        reply: text,
                                        date: Date.now(),
                                        likes: 0
                                    };
                                    return { ...c, replies: [...(c.replies || []), newReply] };
                                }
                                return c;
                            });
                            return { ...p, comments: updatedComments };
                        } else {
                            const newComment: Comment = {
                                id: Date.now(),
                                userId: currentUser.id,
                                text,
                                timestamp: "Just now",
                                likes: 0,
                                attachment,
                                replies: []
                            };
                            
                            if (p.authorId !== currentUser.id) {
                                setNotifications(prev => [{
                                    id: Date.now(),
                                    userId: p.authorId,
                                    senderId: currentUser.id,
                                    type: 'comment',
                                    content: `commented on your post: "${text.substring(0, 20)}..."`,
                                    postId: p.id,
                                    timestamp: Date.now(),
                                    read: false
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
            // Check Group Posts
            setGroups(prev => prev.map(g => {
                const postExists = g.posts.some(p => p.id === postId);
                if (postExists) {
                    return {
                        ...g,
                        posts: g.posts.map(p => {
                            if (p.id === postId) {
                                const newComment: Comment = {
                                    id: Date.now(),
                                    userId: currentUser.id,
                                    text,
                                    timestamp: "Just now",
                                    likes: 0,
                                    attachment,
                                    replies: []
                                };
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

    // --- GLOBAL FOLLOW LOGIC ---
    const handleFollow = (userId: number) => {
        if (!currentUser) return;
        
        // 1. Check if already following
        const isFollowing = currentUser.following.includes(userId);
        
        // 2. Prepare Updated Current User Object (Optimistic UI update)
        // If following: Remove ID (decrease following count)
        // If not following: Add ID (increase following count)
        const updatedCurrentUser = {
            ...currentUser,
            following: isFollowing 
                ? currentUser.following.filter(id => id !== userId) 
                : [...currentUser.following, userId]
        };
        
        // 3. Update Local State immediately
        setCurrentUser(updatedCurrentUser);

        // 4. Update Global Users Array
        setUsers(prevUsers => prevUsers.map(u => {
            // A. Update the entry for the Current User in the global list
            if (u.id === currentUser.id) {
                return updatedCurrentUser;
            }
            
            // B. Update the Target User (the one being followed/unfollowed)
            if (u.id === userId) {
                const updatedTargetUser = {
                    ...u,
                    followers: isFollowing 
                        ? u.followers.filter(id => id !== currentUser.id) // Remove follower (decrease count)
                        : [...u.followers, currentUser.id] // Add follower (increase count)
                };
                
                // C. Send Notification if it's a new follow
                if (!isFollowing) {
                    setNotifications(prev => [{
                        id: Date.now(),
                        userId: u.id,
                        senderId: currentUser.id,
                        type: 'follow',
                        content: `started following you.`,
                        timestamp: Date.now(),
                        read: false
                    }, ...prev]);
                }
                
                return updatedTargetUser;
            }
            
            // C. Return other users unchanged
            return u;
        }));
    };

    const handleCreateGroup = (groupData: Partial<Group>) => {
        if (!currentUser) return;
        const newGroup: Group = {
            id: `g${Date.now()}`,
            name: groupData.name!,
            description: groupData.description!,
            type: groupData.type || 'public',
            image: groupData.image!,
            coverImage: groupData.coverImage!,
            adminId: currentUser.id,
            members: [currentUser.id],
            posts: [],
            createdDate: Date.now(),
            events: [],
            memberPostingAllowed: true
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
            id: Date.now(),
            authorId: currentUser.id,
            content,
            timestamp: Date.now(),
            likes: [],
            comments: [],
            shares: 0,
            background // Support colored backgrounds
        };

        if (file) {
            const url = URL.createObjectURL(file);
            if (type === 'image') newPost.image = url;
            else if (type === 'video') newPost.video = url;
            else newPost.attachment = { name: file.name, type: 'file', url, size: '1MB' }; // Mock size
        }

        setGroups(prev => prev.map(g => {
            if (g.id === groupId) {
                return { ...g, posts: [newPost, ...g.posts] };
            }
            return g;
        }));
    };

    // 2. Handle Group Post Sharing to User Profile (Feed)
    const handleShareToFeed = (caption: string) => {
        if (!currentUser || !activeSharePostId) return;
        
        // Find the original post (either in Feed or Groups)
        let postToShare = posts.find(p => p.id === activeSharePostId);
        if (!postToShare) {
            // Check groups
            for (const group of groups) {
                const groupPost = group.posts.find(p => p.id === activeSharePostId);
                if (groupPost) {
                    postToShare = {
                        id: groupPost.id,
                        authorId: groupPost.authorId,
                        content: groupPost.content,
                        image: groupPost.image,
                        video: groupPost.video,
                        background: groupPost.background,
                        timestamp: "Just now", // Placeholder
                        createdAt: groupPost.timestamp,
                        reactions: [], // Irrelevant for cloning data
                        comments: [],
                        shares: groupPost.shares,
                        type: groupPost.video ? 'video' : (groupPost.image ? 'image' : 'text'),
                        visibility: 'Public',
                        isGroupAdmin: false,
                        groupName: group.name
                    } as PostType;
                    break;
                }
            }
        }

        if (postToShare) {
            const newPost: PostType = {
                id: Date.now(),
                authorId: currentUser.id,
                content: caption, // User's caption
                image: undefined, // Shared post content is nested
                video: undefined,
                background: undefined,
                timestamp: "Just now",
                createdAt: Date.now(),
                reactions: [],
                comments: [],
                shares: 0,
                type: 'text', // The wrapper post is text, containing the shared post
                visibility: 'Public',
                sharedPostId: postToShare.id,
                // We create a "sharedPost" structure to display the original content
            };
            
            // Hack: Store the full original post data in the new post for display purposes in Feed
            // In a real DB, sharedPostId is a foreign key. Here we cheat slightly for the frontend mock.
            // The Post component expects 'sharedPost' prop which is PostType.
            // We need to modify our Post logic to look up sharedPostId OR we embed the content.
            // Let's modify the Post creation to embed the content structure directly or rely on lookup.
            // Given the existing Post component logic: `sharedPost` prop is passed.
            // We will add the structure to the main posts array, but the Post component needs to find it.
            // Easier way for mock: Embed the shared content copy directly into the new post object as a special property `sharedContent` or rely on ID lookup if the original post is in `posts`.
            
            // To support cross-group sharing where original post isn't in main `posts`, let's embed a copy.
            (newPost as any).embeddedSharedPost = postToShare; 

            setPosts([newPost, ...posts]);
            
            // Increment Share Count on Original Post
            setPosts(prev => prev.map(p => p.id === activeSharePostId ? { ...p, shares: p.shares + 1 } : p));
            setGroups(prev => prev.map(g => ({
                ...g,
                posts: g.posts.map(p => p.id === activeSharePostId ? { ...p, shares: p.shares + 1 } : p)
            })));
            
            setActiveSharePostId(null);
            alert("Shared to your feed!");
        }
    };

    // 3. Handle Sharing to a Group
    const handleShareToGroup = (groupId: string, caption: string) => {
        if (!currentUser || !activeSharePostId) return;

        // Find origin post
        let postToShare = posts.find(p => p.id === activeSharePostId);
        if (!postToShare) {
             for (const group of groups) {
                const groupPost = group.posts.find(p => p.id === activeSharePostId);
                if (groupPost) {
                    postToShare = groupPost as any; // Type casting for simplicity in mock
                    break;
                }
            }
        }

        if (postToShare) {
            // Create a new GroupPost
            const newGroupPost: GroupPost = {
                id: Date.now(),
                authorId: currentUser.id,
                content: `${caption}\n\n[Shared Post]: ${postToShare.content}`, // Simple text representation for shared post in group
                image: postToShare.image,
                video: postToShare.video,
                background: postToShare.background,
                timestamp: Date.now(),
                likes: [],
                comments: [],
                shares: 0
            };

            setGroups(prev => prev.map(g => {
                if (g.id === groupId) {
                    return { ...g, posts: [newGroupPost, ...g.posts] };
                }
                return g;
            }));

            setActiveSharePostId(null);
            alert("Shared to group!");
        }
    };

    // 2. Handle Group Post Sharing to User Profile (Legacy Handler, keeping for compatibility if used elsewhere)
    const handleGroupShare = (groupId: string, postId: number) => {
       setActiveSharePostId(postId);
       // This triggers the ShareSheet now, which handles the logic via handleShareToFeed
    };

    // Navigation Helper
    const navigateTo = (destination: string) => {
        if (destination.startsWith('post-')) {
            // Logic to view single post (not implemented fully in this snippet, defaulting to home)
            // setActiveSinglePostId(parseInt(destination.split('-')[1]));
            setView('home'); 
        } else {
            setView(destination);
            setActiveTab(destination);
        }
    };

    // --- RENDER ---
    if (isLoading) return (
        <div className="fixed inset-0 z-50 bg-[#18191A] flex flex-col items-center justify-center font-sans">
            <div className="flex flex-col items-center animate-fade-in scale-110 transform transition-transform">
                <div className="flex items-center gap-3 mb-8">
                    <i className="fas fa-globe-americas text-[#1877F2] text-[48px] animate-pulse drop-shadow-[0_0_15px_rgba(24,119,242,0.5)]"></i>
                    <h1 className="text-[48px] font-bold bg-gradient-to-r from-[#1877F2] to-[#1D8AF2] text-transparent bg-clip-text tracking-tight drop-shadow-sm">UNERA</h1>
                </div>
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-[#242526]"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#1877F2] animate-spin border-r-transparent border-b-transparent border-l-transparent"></div>
                </div>
                <div className="mt-8 text-[#B0B3B8] text-sm font-medium tracking-widest uppercase opacity-70">
                    Connecting...
                </div>
            </div>
            
            <div className="absolute bottom-10 flex flex-col items-center gap-1 opacity-60">
                <span className="text-[#555] text-[10px]">from</span>
                <span className="text-[#E4E6EB] text-sm font-bold tracking-wider">UNERA (T) Company Ltd</span>
            </div>
        </div>
    );

    // Public pages check (Help, Terms, Privacy)
    const isPublicPage = ['help', 'terms', 'privacy'].includes(view);

    // If not public page and not logged in, show Login
    if (!currentUser && !view && !isPublicPage) return <Login onLogin={handleLogin} onNavigateToRegister={() => setShowRegister(true)} onClose={() => setView('home')} error={loginError} />;
    if (showRegister) return <Register onRegister={handleRegister} onBackToLogin={() => setShowRegister(false)} />;

    return (
        <div className="bg-[#18191A] min-h-screen text-[#E4E6EB] font-sans">
            <Header 
                onHomeClick={() => { setView('home'); setActiveTab('home'); }}
                onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }}
                onReelsClick={() => { setView('reels'); setActiveTab('reels'); }}
                onMarketplaceClick={() => { setView('marketplace'); setActiveTab('marketplace'); }}
                onGroupsClick={() => { setView('groups'); setActiveTab('groups'); }}
                currentUser={currentUser}
                notifications={notifications}
                users={users}
                onLogout={() => { setCurrentUser(null); setView('home'); }}
                onLoginClick={() => setView('')} // Triggers Login Component check above essentially if implemented that way, or we can just render LoginOverlay
                onMarkNotificationsRead={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
                activeTab={activeTab}
                onNavigate={navigateTo}
            />

            <div className="flex justify-center">
                <Sidebar 
                    currentUser={currentUser || INITIAL_USERS[0]} // Fallback for guest layout
                    onProfileClick={(id) => { if(currentUser) { setSelectedUserId(id); setView('profile'); } else alert("Login to view profiles"); }}
                    onReelsClick={() => { setView('reels'); setActiveTab('reels'); }}
                    onMarketplaceClick={() => { setView('marketplace'); setActiveTab('marketplace'); }}
                    onGroupsClick={() => { setView('groups'); setActiveTab('groups'); }}
                />

                <div className="flex-1 w-full max-w-[700px] min-h-screen relative">
                    {view === 'home' && (
                        <div className="w-full pb-20 pt-4 px-0 md:px-4">
                            <StoryReel 
                                stories={enrichedStories} 
                                onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} 
                                onCreateStory={(file) => setStories([{ id: Date.now(), userId: currentUser!.id, image: URL.createObjectURL(file), createdAt: Date.now(), user: currentUser! }, ...stories])}
                                onViewStory={(s) => setActiveStory(s)}
                            />
                            {currentUser && (
                                <CreatePost 
                                    currentUser={currentUser} 
                                    onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }}
                                    onClick={() => setShowCreatePostModal(true)}
                                    onCreateEventClick={() => setShowCreateEventModal(true)}
                                />
                            )}
                            
                            {/* Suggested Products in Feed */}
                            <SuggestedProductsWidget 
                                products={products} 
                                currentUser={currentUser || INITIAL_USERS[0]}
                                onViewProduct={(p) => setActiveProduct(p)}
                                onSeeAll={() => { setView('marketplace'); setActiveTab('marketplace'); }}
                            />

                            {rankedPosts.map(post => {
                                const author = users.find(u => u.id === post.authorId);
                                if (!author) return null;
                                return (
                                    <Post 
                                        key={post.id} 
                                        post={post} 
                                        author={author} 
                                        currentUser={currentUser} 
                                        users={users}
                                        onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }}
                                        onReact={handleReaction}
                                        onShare={(id) => setActiveSharePostId(id)}
                                        onDelete={(id) => setPosts(prev => prev.filter(p => p.id !== id))}
                                        onEdit={(id, content) => setPosts(prev => prev.map(p => p.id === id ? { ...p, content } : p))}
                                        onHashtagClick={() => {}}
                                        onViewImage={(url) => setFullScreenImage(url)}
                                        onOpenComments={(id) => setActiveCommentsPostId(id)}
                                        onVideoClick={(post) => { if(post.type === 'video') setFullScreenImage(post.video!); }} // Simple video view for now
                                        onViewProduct={(p) => setActiveProduct(p)}
                                        onFollow={handleFollow}
                                        isFollowing={currentUser ? currentUser.following.includes(author.id) : false}
                                        onPlayAudio={(track) => { setCurrentAudioTrack(track); setIsAudioPlaying(true); }}
                                        sharedPost={(post as any).embeddedSharedPost}
                                    />
                                );
                            })}
                        </div>
                    )}

                    {view === 'profile' && selectedUserId && (
                        <UserProfile 
                            user={users.find(u => u.id === selectedUserId)!}
                            currentUser={currentUser}
                            users={users}
                            posts={posts}
                            reels={reels}
                            songs={songs}
                            episodes={episodes}
                            onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }}
                            onFollow={handleFollow}
                            onReact={handleReaction}
                            onComment={handleComment}
                            onShare={(id) => setActiveSharePostId(id)}
                            onMessage={(id) => { setActiveChatUser(users.find(u => u.id === id) || null); }}
                            onCreatePost={handleCreatePost}
                            onUpdateProfileImage={(file) => {
                                if (currentUser) {
                                    const url = URL.createObjectURL(file);
                                    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, profileImage: url } : u));
                                    setCurrentUser(prev => prev ? { ...prev, profileImage: url } : null);
                                }
                            }}
                            onUpdateCoverImage={(file) => {
                                if (currentUser) {
                                    const url = URL.createObjectURL(file);
                                    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, coverImage: url } : u));
                                    setCurrentUser(prev => prev ? { ...prev, coverImage: url } : null);
                                }
                            }}
                            onUpdateUserDetails={(data) => {
                                if (currentUser) {
                                    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...data } : u));
                                    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
                                }
                            }}
                            onDeletePost={(id) => setPosts(prev => prev.filter(p => p.id !== id))}
                            onEditPost={(id, content) => setPosts(prev => prev.map(p => p.id === id ? { ...p, content } : p))}
                            getCommentAuthor={(id) => users.find(u => u.id === id)}
                            onViewImage={(url) => setFullScreenImage(url)}
                            onCreateEventClick={() => setShowCreateEventModal(true)}
                            onOpenComments={(id) => setActiveCommentsPostId(id)}
                            onVideoClick={(post) => { if(post.type === 'video') setFullScreenImage(post.video!); }}
                            onPlayAudio={(track) => { setCurrentAudioTrack(track); setIsAudioPlaying(true); }}
                        />
                    )}

                    {view === 'marketplace' && (
                        <MarketplacePage 
                            currentUser={currentUser}
                            products={products}
                            onNavigateHome={() => { setView('home'); setActiveTab('home'); }}
                            onCreateProduct={(p) => setProducts([{ id: Date.now(), sellerId: currentUser!.id, sellerName: currentUser!.name, sellerAvatar: currentUser!.profileImage, date: Date.now(), views: 0, ratings: [], comments: [], images: [], title: '', category: '', description: '', country: '', address: '', mainPrice: 0, quantity: 1, phoneNumber: '', status: 'active', shareId: '', ...p } as Product, ...products])}
                            onViewProduct={(p) => setActiveProduct(p)}
                        />
                    )}

                    {view === 'reels' && (
                        <ReelsFeed 
                            reels={reels}
                            users={users}
                            currentUser={currentUser}
                            onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }}
                            onCreateReelClick={() => setShowCreateReelModal(true)}
                            onReact={(rid, type) => setReels(prev => prev.map(r => r.id === rid ? { ...r, reactions: [...r.reactions, { userId: currentUser!.id, type }] } : r))}
                            onComment={(rid, text) => setReels(prev => prev.map(r => r.id === rid ? { ...r, comments: [...r.comments, { id: Date.now(), userId: currentUser!.id, text, timestamp: "Just now", likes: 0 }] } : r))}
                            onShare={(rid) => setReels(prev => prev.map(r => r.id === rid ? { ...r, shares: r.shares + 1 } : r))}
                            onFollow={handleFollow}
                            getCommentAuthor={(id) => users.find(u => u.id === id)}
                            initialReelId={activeReelId}
                        />
                    )}

                    {view === 'groups' && (
                        <GroupsPage 
                            currentUser={currentUser}
                            groups={groups}
                            users={users}
                            onCreateGroup={handleCreateGroup}
                            onJoinGroup={handleJoinGroup}
                            onLeaveGroup={(gid) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, members: g.members.filter(m => m !== currentUser!.id) } : g))}
                            onDeleteGroup={(gid) => setGroups(prev => prev.filter(g => g.id !== gid))}
                            onUpdateGroupImage={(gid, type, file) => {
                                const url = URL.createObjectURL(file);
                                setGroups(prev => prev.map(g => g.id === gid ? { ...g, [type === 'cover' ? 'coverImage' : 'image']: url } : g));
                            }}
                            onPostToGroup={handlePostToGroup}
                            onCreateGroupEvent={(gid, event) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, events: [...(g.events || []), { id: Date.now(), organizerId: currentUser!.id, attendees: [currentUser!.id], ...event } as Event] } : g))}
                            onInviteToGroup={() => alert("Invitation sent!")}
                            onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }}
                            onLikePost={(gid, pid) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, posts: g.posts.map(p => p.id === pid ? { ...p, reactions: [...(p.reactions || []), { userId: currentUser!.id, type: 'like' }] } : p) } : g))}
                            onOpenComments={(gid, pid) => setActiveCommentsPostId(pid)}
                            onSharePost={(gid, pid) => setActiveSharePostId(pid)}
                            onDeleteGroupPost={(pid) => setGroups(prev => prev.map(g => ({ ...g, posts: g.posts.filter(p => p.id !== pid) })))}
                            onRemoveMember={(gid, uid) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, members: g.members.filter(m => m !== uid) } : g))}
                            onUpdateGroupSettings={(gid, settings) => setGroups(prev => prev.map(g => g.id === gid ? { ...g, ...settings } : g))}
                        />
                    )}

                    {view === 'music' && (
                        <MusicSystem 
                            currentUser={currentUser}
                            songs={songs}
                            episodes={episodes}
                            onUpdateSongs={setSongs}
                            onUpdateEpisodes={setEpisodes}
                            onPlayTrack={(t) => { setCurrentAudioTrack(t); setIsAudioPlaying(true); }}
                            currentTrackId={currentAudioTrack?.id}
                            isPlaying={isAudioPlaying}
                            onTogglePlay={() => setIsAudioPlaying(!isAudioPlaying)}
                            onFeedPost={(p) => setPosts([ { ...p, id: Date.now(), authorId: currentUser!.id, timestamp: "Just now", createdAt: Date.now(), reactions: [], comments: [], shares: 0, visibility: 'Public' }, ...posts])}
                        />
                    )}

                    {view === 'tools' && <ToolsPage />}
                    {view === 'help' && <HelpSupportPage onNavigateHome={() => { setView('home'); setActiveTab('home'); }} />}
                    {view === 'privacy' && <PrivacyPolicyPage onNavigateHome={() => { setView('home'); setActiveTab('home'); }} />}
                    {view === 'terms' && <TermsOfServicePage onNavigateHome={() => { setView('home'); setActiveTab('home'); }} />}
                    {view === 'profiles' && <SuggestedProfilesPage currentUser={currentUser!} users={users} groups={groups} onFollow={handleFollow} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} />}
                    {view === 'create_event' && <EventsPage events={events} currentUser={currentUser!} onJoinEvent={(eid) => setEvents(prev => prev.map(e => e.id === eid ? { ...e, attendees: [...e.attendees, currentUser!.id] } : e))} onCreateEventClick={() => setShowCreateEventModal(true)} />}
                    {view === 'memories' && currentUser && <MemoriesPage currentUser={currentUser} posts={posts} users={users} />}
                    {view === 'settings' && <SettingsPage currentUser={currentUser} onUpdateUser={(data) => {
                        setUsers(prev => prev.map(u => u.id === currentUser!.id ? { ...u, ...data } : u));
                        setCurrentUser(prev => prev ? { ...prev, ...data } : null);
                    }} />}

                </div>

                <RightSidebar 
                    contacts={users.filter(u => currentUser && currentUser.following.includes(u.id))}
                    onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }}
                />
            </div>

            {/* Modals & Overlays */}
            {activeStory && <StoryViewer story={activeStory} user={activeStory.user!} onClose={() => setActiveStory(null)} onLike={() => {}} />}
            
            {showCreatePostModal && currentUser && (
                <CreatePostModal 
                    currentUser={currentUser} 
                    users={users}
                    onClose={() => setShowCreatePostModal(false)}
                    onCreatePost={handleCreatePost}
                    onCreateEventClick={() => { setShowCreatePostModal(false); setShowCreateEventModal(true); }}
                />
            )}

            {showCreateReelModal && currentUser && (
                <CreateReel 
                    currentUser={currentUser}
                    onClose={() => setShowCreateReelModal(false)}
                    onSubmit={(file, caption, song, effect) => {
                        const newReel: Reel = {
                            id: Date.now(),
                            userId: currentUser.id,
                            videoUrl: URL.createObjectURL(file),
                            caption,
                            songName: song,
                            effectName: effect,
                            reactions: [],
                            comments: [],
                            shares: 0,
                            isCompressed: false
                        };
                        setReels([newReel, ...reels]);
                        setActiveReelId(newReel.id);
                    }}
                />
            )}

            {showCreateEventModal && currentUser && (
                <CreateEventModal 
                    currentUser={currentUser}
                    onClose={() => setShowCreateEventModal(false)}
                    onCreate={(e) => setEvents([{ id: Date.now(), organizerId: currentUser.id, attendees: [currentUser.id], interestedIds: [], ...e } as Event, ...events])}
                />
            )}

            {activeCommentsPostId && (
                <CommentsSheet 
                    post={[...posts, ...groups.flatMap(g => g.posts.map(p => ({...p, reactions: p.reactions || []}) as any))].find(p => p.id === activeCommentsPostId)!} 
                    currentUser={currentUser!} 
                    users={users}
                    onClose={() => setActiveCommentsPostId(null)}
                    onComment={handleComment}
                    onLikeComment={() => {}}
                    getCommentAuthor={(id) => users.find(u => u.id === id)}
                    onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); setActiveCommentsPostId(null); }}
                />
            )}

            {activeSharePostId && (
                <ShareSheet 
                    post={[...posts, ...groups.flatMap(g => g.posts.map(p => ({...p, reactions: p.reactions || []}) as any))].find(p => p.id === activeSharePostId)!} 
                    groups={currentUser ? groups.filter(g => g.members.includes(currentUser.id)) : []}
                    onClose={() => setActiveSharePostId(null)} 
                    onShareNow={handleShareToFeed}
                    onShareToGroup={handleShareToGroup}
                    onCopyLink={() => { alert("Link copied to clipboard!"); setActiveSharePostId(null); }} 
                />
            )}
            
            {activeChatUser && currentUser && <ChatWindow currentUser={currentUser} recipient={activeChatUser} messages={messages.filter(m => (m.senderId === currentUser.id && m.receiverId === activeChatUser.id) || (m.senderId === activeChatUser.id && m.receiverId === currentUser.id))} onClose={() => setActiveChatUser(null)} onSendMessage={(text, sticker) => setMessages([...messages, { id: Date.now(), senderId: currentUser.id, receiverId: activeChatUser.id, text: sticker ? '' : text, stickerUrl: sticker, timestamp: Date.now() }])} />}
            
            {fullScreenImage && <ImageViewer imageUrl={fullScreenImage} onClose={() => setFullScreenImage(null)} />}
            
            {activeProduct && <ProductDetailModal product={activeProduct} currentUser={currentUser} onClose={() => setActiveProduct(null)} onMessage={(id) => { setActiveChatUser(users.find(u => u.id === id) || null); setActiveProduct(null); }} />}

            {currentAudioTrack && (
                <GlobalAudioPlayer 
                    currentTrack={currentAudioTrack}
                    isPlaying={isAudioPlaying}
                    onTogglePlay={() => setIsAudioPlaying(!isAudioPlaying)}
                    onNext={() => {}}
                    onPrevious={() => {}}
                    onClose={() => { setCurrentAudioTrack(null); setIsAudioPlaying(false); }}
                    onDownload={() => alert("Downloaded")}
                    onLike={() => {}}
                    onArtistClick={(id) => { setSelectedUserId(id); setView('profile'); }}
                    isLiked={false}
                    uploaderProfile={users.find(u => u.id === currentAudioTrack.uploaderId)}
                />
            )}
        </div>
    );
}
