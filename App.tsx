import React, { useState, useEffect } from 'react';
import { User, Post, Story, Reel, Product, Notification, Message, Event, Group, Brand, Song, Episode, AudioTrack, LinkPreview } from './types';
import { 
    INITIAL_USERS, INITIAL_POSTS, INITIAL_STORIES, INITIAL_REELS, 
    INITIAL_PRODUCTS, INITIAL_EVENTS, INITIAL_GROUPS, INITIAL_BRANDS,
    MOCK_SONGS, MOCK_EPISODES
} from './constants';
import { Header, Sidebar, RightSidebar } from './components/Layout';
import { 
    CreatePost, Post as PostComponent, CreatePostModal, 
    ShareSheet, CommentsSheet, SuggestedProductsWidget, SuggestedGroupsWidget, SuggestedPeopleWidget 
} from './components/Feed';
import { StoryReel, StoryViewer, CreateStoryModal } from './components/Story';
import { ReelsFeed, CreateReel } from './components/Reels';
import { Login, Register } from './components/Auth';
import { ChatWindow } from './components/Chat';
import { UserProfile } from './components/UserProfile';
import { MarketplacePage, ProductDetailModal } from './components/Marketplace';
import { GroupsPage } from './components/Groups';
import { BrandsPage } from './components/Brands';
import { 
    SuggestedProfilesPage, BirthdaysPage, MemoriesPage, SettingsPage 
} from './components/MenuPages';
import { MusicSystem, GlobalAudioPlayer } from './components/MusicSystem';
import { ToolsPage } from './components/Tools';
import { PrivacyPolicyPage } from './components/PrivacyPolicy';
import { TermsOfServicePage } from './components/TermsOfService';
import { HelpSupportPage } from './components/HelpSupport';
import { Spinner, ImageViewer } from './components/Common';
import { CreateEventModal, EventsPage } from './components/Events';
import { rankFeed } from './utils/ranking';

const App: React.FC = () => {
    // --- STATE ---
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState('home');
    
    // Data State
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [stories, setStories] = useState<Story[]>(INITIAL_STORIES.map(s => {
        const u = INITIAL_USERS.find(u => u.id === s.userId);
        return { ...s, user: u, type: s.type || 'image' }; // Enrich with user data and default type
    }));
    const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
    const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
    const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    
    // Music State
    const [songs, setSongs] = useState<Song[]>(MOCK_SONGS);
    const [episodes, setEpisodes] = useState<Episode[]>(MOCK_EPISODES);
    const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Navigation State
    const [viewingProfileId, setViewingProfileId] = useState<number | null>(null);
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [chatRecipient, setChatRecipient] = useState<User | null>(null);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    
    // Reels State
    const [initialReelId, setInitialReelId] = useState<number | null>(null);
    
    // Modal State
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [showCreateReel, setShowCreateReel] = useState(false);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [showCreateStory, setShowCreateStory] = useState(false);
    
    // Post Interaction State
    const [activeCommentsPostId, setActiveCommentsPostId] = useState<number | null>(null);
    const [activeSharePostId, setActiveSharePostId] = useState<number | null>(null);

    // --- INITIALIZATION ---
    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setIsLoading(false);
            // Auto-login check
            const savedUser = localStorage.getItem('unera_user');
            if (savedUser) {
                try {
                    setCurrentUser(JSON.parse(savedUser));
                } catch (e) {
                    localStorage.removeItem('unera_user');
                }
            }
        }, 1500);
    }, []);

    // --- HANDLERS ---

    const requireLogin = (action: () => void) => {
        if (currentUser) {
            action();
        } else {
            setShowLogin(true);
        }
    };

    const handleLogin = (email: string, pass: string) => {
        const user = users.find(u => u.email === email && u.password === pass);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem('unera_user', JSON.stringify(user));
            setShowLogin(false);
            setView('home');
        } else {
            alert("Invalid credentials");
        }
    };

    const handleRegister = (newUser: Partial<User>) => {
        const user: User = {
            ...newUser as User,
            id: users.length + 1,
            followers: [],
            following: [],
            isOnline: true,
            joinedDate: new Date().toISOString()
        };
        setUsers([...users, user]);
        setCurrentUser(user);
        localStorage.setItem('unera_user', JSON.stringify(user));
        setShowRegister(false);
        setView('home');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('unera_user');
        setView('home');
    };

    // Navigation Handlers
    const handleProfileClick = (id: number) => {
        if (currentUser && id === currentUser.id) {
            setView('profile');
        } else {
            setViewingProfileId(id);
            setView('user-profile');
        }
    };

    const handleNavigate = (target: string) => {
        if (target.startsWith('post-')) {
            // Handle deep link to post if implemented
            return;
        }
        if (target === 'profile' && currentUser) {
            handleProfileClick(currentUser.id);
        } else {
            setView(target);
        }
    };

    // Post Handlers
    const handleCreatePost = (text: string, file: File | null, type: any, visibility: any, location?: string, feeling?: string, taggedUsers?: number[], background?: string, linkPreview?: LinkPreview) => {
        if (!currentUser) return;
        
        let mediaUrl = undefined;
        if (file) {
            mediaUrl = URL.createObjectURL(file);
        }

        const newPost: Post = {
            id: posts.length + 1 + products.length + events.length + 100, // Offset ID
            authorId: currentUser.id,
            content: text,
            image: type === 'image' ? mediaUrl : undefined,
            video: type === 'video' ? mediaUrl : undefined,
            background,
            location,
            feeling,
            visibility,
            type,
            timestamp: 'Just now',
            createdAt: Date.now(),
            reactions: [],
            comments: [],
            shares: 0,
            views: 0,
            linkPreview
        };

        setPosts([newPost, ...posts]);
    };

    const handleReact = (postId: number, type: any) => {
        requireLogin(() => {
            setPosts(posts.map(p => {
                if (p.id === postId) {
                    const existing = p.reactions.find(r => r.userId === currentUser!.id);
                    if (existing) {
                        if (existing.type === type) {
                            return { ...p, reactions: p.reactions.filter(r => r.userId !== currentUser!.id) };
                        } else {
                            return { ...p, reactions: p.reactions.map(r => r.userId === currentUser!.id ? { ...r, type } : r) };
                        }
                    } else {
                        // Create notification
                        if (p.authorId !== currentUser!.id) {
                            const notif: Notification = {
                                id: Date.now(),
                                userId: p.authorId,
                                senderId: currentUser!.id,
                                type: 'like',
                                content: `reacted ${type} to your post`,
                                postId: p.id,
                                timestamp: Date.now(),
                                read: false
                            };
                            setNotifications(prev => [notif, ...prev]);
                        }
                        return { ...p, reactions: [...p.reactions, { userId: currentUser!.id, type }] };
                    }
                }
                return p;
            }));
        });
    };

    const handleComment = (postId: number, text: string) => {
        if (!currentUser) return;
        setPosts(posts.map(p => {
            if (p.id === postId) {
                // Create notification
                if (p.authorId !== currentUser.id) {
                    const notif: Notification = {
                        id: Date.now(),
                        userId: p.authorId,
                        senderId: currentUser.id,
                        type: 'comment',
                        content: `commented on your post: "${text.substring(0, 20)}..."`,
                        postId: p.id,
                        timestamp: Date.now(),
                        read: false
                    };
                    setNotifications(prev => [notif, ...prev]);
                }
                return {
                    ...p,
                    comments: [...p.comments, {
                        id: Date.now(),
                        userId: currentUser.id,
                        text,
                        timestamp: 'Just now',
                        likes: 0
                    }]
                };
            }
            return p;
        }));
    };

    const handleShare = (postId: number) => {
        requireLogin(() => setActiveSharePostId(postId));
    };

    const handleShareConfirm = (caption: string) => {
        if (!currentUser || !activeSharePostId) return;
        const originalPost = posts.find(p => p.id === activeSharePostId);
        if (!originalPost) return;

        const sharedPost: Post = {
            id: posts.length + 1000 + Date.now(),
            authorId: currentUser.id,
            content: caption,
            type: 'text', 
            visibility: 'Public',
            timestamp: 'Just now',
            createdAt: Date.now(),
            reactions: [],
            comments: [],
            shares: 0,
            views: 0,
            embeddedSharedPost: {
                ...originalPost,
                originalAuthorId: originalPost.authorId,
                originalAuthorName: users.find(u => u.id === originalPost.authorId)?.name,
            }
        };

        setPosts([sharedPost, ...posts]);
        setActiveSharePostId(null);
    };

    // User Interaction
    const handleFollow = (id: number) => {
        requireLogin(() => {
            // Update current user following
            const updatedCurrentUser = { ...currentUser! };
            const isFollowing = updatedCurrentUser.following.includes(id);
            
            if (isFollowing) {
                updatedCurrentUser.following = updatedCurrentUser.following.filter(uid => uid !== id);
            } else {
                updatedCurrentUser.following.push(id);
                // Notification
                const notif: Notification = {
                    id: Date.now(),
                    userId: id,
                    senderId: currentUser!.id,
                    type: 'follow',
                    content: 'started following you',
                    timestamp: Date.now(),
                    read: false
                };
                setNotifications(prev => [notif, ...prev]);
            }
            
            setCurrentUser(updatedCurrentUser);
            setUsers(users.map(u => u.id === currentUser!.id ? updatedCurrentUser : u));
            
            // Update target user followers
            setUsers(prev => prev.map(u => {
                if (u.id === id) {
                    if (isFollowing) {
                        return { ...u, followers: u.followers.filter(fid => fid !== currentUser!.id) };
                    } else {
                        return { ...u, followers: [...u.followers, currentUser!.id] };
                    }
                }
                return u;
            }));
        });
    };

    // Reels
    const handleCreateReel = (file: File, caption: string, song: string, effect: string) => {
        if (!currentUser) return;
        const newReel: Reel = {
            id: reels.length + 1,
            userId: currentUser.id,
            videoUrl: URL.createObjectURL(file),
            caption,
            songName: song,
            effectName: effect,
            reactions: [],
            comments: [],
            shares: 0
        };
        setReels([newReel, ...reels]);
    };

    // Marketplace
    const handleCreateProduct = (productData: Partial<Product>) => {
        if (!currentUser) return;
        const newProduct: Product = {
            ...productData as Product,
            id: products.length + 1,
            sellerId: currentUser.id,
            sellerName: currentUser.name,
            sellerAvatar: currentUser.profileImage,
            date: Date.now(),
            images: productData.images || []
        };
        setProducts([newProduct, ...products]);
    };

    // Groups
    const handleCreateGroup = (groupData: Partial<Group>) => {
        if (!currentUser) return;
        const newGroup: Group = {
            ...groupData as Group,
            id: `g${groups.length + 1}`,
            adminId: currentUser.id,
            members: [currentUser.id],
            posts: [],
            createdDate: Date.now()
        };
        setGroups([...groups, newGroup]);
    };

    const handleJoinGroup = (groupId: string) => {
        requireLogin(() => {
            setGroups(groups.map(g => {
                if (g.id === groupId) {
                    if (g.members.includes(currentUser!.id)) return g;
                    return { ...g, members: [...g.members, currentUser!.id] };
                }
                return g;
            }));
        });
    };

    const handlePostToGroup = (groupId: string, content: string, file: File | null, type: any, background?: string) => {
        if (!currentUser) return;
        const group = groups.find(g => g.id === groupId);
        if (!group) return;

        const newPost: Post = {
            id: Date.now(),
            authorId: currentUser.id,
            content,
            type,
            image: file && type === 'image' ? URL.createObjectURL(file) : undefined,
            video: file && type === 'video' ? URL.createObjectURL(file) : undefined,
            background,
            groupId,
            groupName: group.name,
            timestamp: 'Just now',
            createdAt: Date.now(),
            reactions: [],
            comments: [],
            shares: 0,
            views: 0,
            visibility: 'Public'
        };
        
        setPosts([newPost, ...posts]);
        
        setGroups(groups.map(g => g.id === groupId ? { ...g, posts: [...g.posts, {
            id: newPost.id,
            authorId: newPost.authorId,
            content: newPost.content || '',
            timestamp: newPost.createdAt || Date.now(),
            likes: [],
            comments: [],
            shares: 0,
            image: newPost.image,
            video: newPost.video
        }] } : g));
    };

    // Brands
    const handleCreateBrand = (brandData: Partial<Brand>) => {
        if (!currentUser) return;
        const newBrand: Brand = {
            ...brandData as Brand,
            id: Date.now(),
            adminId: currentUser.id,
            followers: [],
            joinedDate: new Date().toISOString()
        };
        setBrands([...brands, newBrand]);
    };

    const handleFollowBrand = (brandId: number) => {
        requireLogin(() => {
            setBrands(brands.map(b => {
                if (b.id === brandId) {
                    if (b.followers.includes(currentUser!.id)) {
                        return { ...b, followers: b.followers.filter(id => id !== currentUser!.id) };
                    } else {
                        return { ...b, followers: [...b.followers, currentUser!.id] };
                    }
                }
                return b;
            }));
        });
    };

    const handlePostAsBrand = (brandId: number, content: any) => {
        const brand = brands.find(b => b.id === brandId);
        if (!brand) return;
        
        let mediaUrl = undefined;
        if (content.file) {
            mediaUrl = URL.createObjectURL(content.file);
        }

        const newPost: Post = {
            id: Date.now(),
            authorId: brandId,
            content: content.text,
            type: content.type,
            image: content.type === 'image' ? mediaUrl : undefined,
            video: content.type === 'video' ? mediaUrl : undefined,
            timestamp: 'Just now',
            createdAt: Date.now(),
            reactions: [],
            comments: [],
            shares: 0,
            views: 0,
            visibility: 'Public'
        };
        
        setPosts([newPost, ...posts]);
    };

    // Events
    const handleCreateEvent = (eventData: Partial<Event>) => {
        const newEvent: Event = {
            ...eventData as Event,
            id: events.length + 1,
            attendees: [currentUser?.id || 0],
            interestedIds: []
        };
        setEvents([...events, newEvent]);
    };

    const handleJoinEvent = (eventId: number) => {
        requireLogin(() => {
            setEvents(events.map(e => {
                if (e.id === eventId) {
                    if (e.interestedIds.includes(currentUser!.id)) {
                        return { ...e, interestedIds: e.interestedIds.filter(id => id !== currentUser!.id) };
                    } else {
                        return { ...e, interestedIds: [...e.interestedIds, currentUser!.id] };
                    }
                }
                return e;
            }));
        });
    };

    // Music
    const handlePlayTrack = (track: AudioTrack) => {
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    // Common
    const handleUpdateUser = (data: Partial<User>) => {
        if (!currentUser) return;
        const updated = { ...currentUser, ...data };
        setCurrentUser(updated);
        setUsers(users.map(u => u.id === currentUser.id ? updated : u));
    };

    // --- MIXED FEED GENERATION ---
    // Convert products and events to "Post" format for the feed
    const productPosts: Post[] = products.map(p => ({
        id: 10000 + p.id,
        authorId: p.sellerId,
        content: p.description,
        timestamp: 'Recommended',
        createdAt: p.date,
        reactions: [],
        comments: [],
        shares: 0,
        type: 'product',
        visibility: 'Public',
        product: p,
        views: p.views
    }));

    const eventPosts: Post[] = events.map(e => ({
        id: 20000 + e.id,
        authorId: e.organizerId,
        content: e.description,
        timestamp: 'Upcoming Event',
        createdAt: Date.now(),
        reactions: [],
        comments: [],
        shares: 0,
        type: 'event',
        visibility: 'Public',
        event: e
    }));

    const allContent = [...posts, ...productPosts, ...eventPosts];
    const filteredFeed = rankFeed(allContent, currentUser, users);

    // --- RENDER ---
    if (isLoading) return <Spinner />;

    // Helper to find active posts safely
    const activeCommentPost = activeCommentsPostId ? posts.find(p => p.id === activeCommentsPostId) : null;
    const activeSharePost = activeSharePostId ? posts.find(p => p.id === activeSharePostId) : null;

    return (
        <div className="bg-[#18191A] min-h-screen text-[#E4E6EB] font-sans">
            {!['privacy', 'terms', 'help'].includes(view) && (
                <Header 
                    onHomeClick={() => setView('home')}
                    onProfileClick={handleProfileClick}
                    onReelsClick={() => { setInitialReelId(null); setView('reels'); }}
                    onMarketplaceClick={() => setView('marketplace')}
                    onGroupsClick={() => setView('groups')}
                    currentUser={currentUser}
                    notifications={notifications}
                    users={users}
                    groups={groups}
                    brands={brands}
                    onLogout={handleLogout}
                    onLoginClick={() => setShowLogin(true)}
                    onMarkNotificationsRead={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                    activeTab={view}
                    onNavigate={handleNavigate}
                />
            )}

            <div className="flex justify-center">
                {/* Left Sidebar */}
                {currentUser && view === 'home' && (
                    <div className="hidden lg:block w-[300px] xl:w-[360px] fixed left-0 top-14 h-screen overflow-y-auto pb-20">
                        <Sidebar 
                            currentUser={currentUser}
                            onProfileClick={handleProfileClick}
                            onReelsClick={() => { setInitialReelId(null); setView('reels'); }}
                            onMarketplaceClick={() => setView('marketplace')}
                            onGroupsClick={() => setView('groups')}
                        />
                    </div>
                )}

                {/* Main Content Area */}
                <div className={`w-full ${view === 'home' && currentUser ? 'lg:pl-[300px] xl:pl-[360px] md:pr-[280px] xl:pr-[360px]' : ''} pt-4`}>
                    
                    {/* HOME FEED */}
                    {view === 'home' && (
                        <div className="max-w-[700px] mx-auto px-0 sm:px-4 pb-20">
                            {/* Stories */}
                            <StoryReel 
                                stories={stories} 
                                currentUser={currentUser}
                                onProfileClick={handleProfileClick}
                                onCreateStory={(file) => {
                                    if(currentUser) {
                                        setStories([{ id: Date.now(), userId: currentUser.id, image: URL.createObjectURL(file), createdAt: Date.now(), user: currentUser, type: 'image' }, ...stories]);
                                    }
                                    setShowCreateStory(true);
                                }}
                                onViewStory={setActiveStory}
                                onRequestLogin={() => setShowLogin(true)}
                            />

                            {/* Create Post Widget */}
                            <CreatePost 
                                currentUser={currentUser} 
                                onProfileClick={(id) => handleProfileClick(id)} 
                                onClick={() => requireLogin(() => setShowCreatePost(true))}
                                onCreateEventClick={() => requireLogin(() => setShowCreateEvent(true))}
                            />

                            {/* Suggested Products at Top */}
                            {products.length > 0 && (
                                <SuggestedProductsWidget 
                                    products={products}
                                    onViewProduct={setActiveProduct}
                                    onSeeAll={() => setView('marketplace')}
                                />
                            )}

                            {/* Posts Feed with Injections */}
                            {filteredFeed.map((post, index) => {
                                const author = users.find(u => u.id === post.authorId) || brands.find(b => b.id === post.authorId) as any as User;
                                if (!author) return null;
                                
                                // Inject Widgets occasionally
                                const showGroupWidget = index === 2 && groups.length > 0;
                                const showPeopleWidget = index === 5 && users.length > 0;

                                return (
                                    <React.Fragment key={post.id}>
                                        <PostComponent 
                                            post={post}
                                            author={author}
                                            currentUser={currentUser}
                                            users={users}
                                            onProfileClick={handleProfileClick}
                                            onReact={handleReact}
                                            onShare={handleShare}
                                            onOpenComments={(pid) => setActiveCommentsPostId(pid)}
                                            onViewImage={setFullScreenImage}
                                            onVideoClick={(clickedPost) => {
                                                if (clickedPost.type === 'video') {
                                                    setInitialReelId(clickedPost.id);
                                                    setView('reels');
                                                }
                                            }}
                                            onFollow={handleFollow}
                                            isFollowing={currentUser ? (author.role === 'user' ? currentUser.following.includes(author.id) : (author as any).followers.includes(currentUser.id)) : false}
                                            onPlayAudio={handlePlayTrack}
                                            onGroupClick={(gid) => { setView('groups'); }}
                                            onViewProduct={setActiveProduct}
                                            onMessage={(uid) => {
                                                const target = users.find(u => u.id === uid);
                                                if (target) setChatRecipient(target);
                                            }}
                                            onJoinEvent={(eventId) => handleJoinEvent(eventId)}
                                        />
                                        
                                        {/* Suggested Groups Injection */}
                                        {showGroupWidget && (
                                            <SuggestedGroupsWidget 
                                                groups={groups}
                                                onJoin={(gid) => handleJoinGroup(gid)}
                                                onSeeAll={() => setView('groups')}
                                            />
                                        )}

                                        {/* Suggested People Injection */}
                                        {showPeopleWidget && (
                                            <SuggestedPeopleWidget 
                                                users={users.filter(u => u.id !== currentUser?.id && (!currentUser || !currentUser.following.includes(u.id)))}
                                                onFollow={handleFollow}
                                                onSeeAll={() => setView('profiles')}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}

                    {/* REELS */}
                    {view === 'reels' && (
                        <ReelsFeed 
                            reels={reels}
                            users={users}
                            currentUser={currentUser}
                            onProfileClick={handleProfileClick}
                            onCreateReelClick={() => setShowCreateReel(true)}
                            onReact={(id, type) => {
                                setReels(reels.map(r => r.id === id ? { ...r, reactions: [...r.reactions, { userId: currentUser!.id, type }] } : r));
                            }}
                            onComment={(id, text) => {
                                setReels(reels.map(r => r.id === id ? { ...r, comments: [...r.comments, { id: Date.now(), userId: currentUser!.id, text, timestamp: 'Just now', likes: 0 }] } : r));
                            }}
                            onShare={(id) => { /* Share logic */ }}
                            onFollow={handleFollow}
                            getCommentAuthor={(id) => users.find(u => u.id === id)}
                            initialReelId={initialReelId}
                        />
                    )}

                    {/* MARKETPLACE */}
                    {view === 'marketplace' && (
                        <MarketplacePage 
                            currentUser={currentUser}
                            products={products}
                            onNavigateHome={() => setView('home')}
                            onCreateProduct={handleCreateProduct}
                            onViewProduct={setActiveProduct}
                        />
                    )}

                    {/* GROUPS */}
                    {view === 'groups' && (
                        <GroupsPage 
                            currentUser={currentUser}
                            groups={groups}
                            users={users}
                            onCreateGroup={handleCreateGroup}
                            onJoinGroup={handleJoinGroup}
                            onLeaveGroup={() => {}}
                            onDeleteGroup={(gid) => setGroups(groups.filter(g => g.id !== gid))}
                            onUpdateGroupImage={(gid, type, file) => {
                                const url = URL.createObjectURL(file);
                                setGroups(groups.map(g => g.id === gid ? { ...g, [type === 'cover' ? 'coverImage' : 'image']: url } : g));
                            }}
                            onPostToGroup={handlePostToGroup}
                            onCreateGroupEvent={(gid, evt) => {}}
                            onInviteToGroup={() => {}}
                            onProfileClick={handleProfileClick}
                            onLikePost={handleReact}
                            onOpenComments={(gid, pid) => setActiveCommentsPostId(pid)}
                            onSharePost={handleShare}
                            onDeleteGroupPost={(pid) => setPosts(posts.filter(p => p.id !== pid))}
                            onRemoveMember={(gid, uid) => {
                                setGroups(groups.map(g => g.id === gid ? { ...g, members: g.members.filter(m => m !== uid) } : g));
                            }}
                            onUpdateGroupSettings={(gid, settings) => {
                                setGroups(groups.map(g => g.id === gid ? { ...g, ...settings } : g));
                            }}
                        />
                    )}

                    {/* BRANDS */}
                    {view === 'brands' && (
                        <BrandsPage 
                            currentUser={currentUser}
                            brands={brands}
                            posts={posts}
                            users={users}
                            onCreateBrand={handleCreateBrand}
                            onFollowBrand={handleFollowBrand}
                            onProfileClick={handleProfileClick}
                            onPostAsBrand={handlePostAsBrand}
                            onReact={handleReact}
                            onShare={handleShare}
                            onOpenComments={setActiveCommentsPostId}
                            onUpdateBrand={(bid, data) => setBrands(brands.map(b => b.id === bid ? { ...b, ...data } : b))}
                            onMessage={(bid) => {}}
                            onCreateEvent={(bid, evt) => {}}
                        />
                    )}

                    {/* PROFILES */}
                    {(view === 'profile' || view === 'user-profile') && (
                        <UserProfile 
                            user={view === 'profile' ? currentUser! : users.find(u => u.id === viewingProfileId)!}
                            currentUser={currentUser}
                            users={users}
                            posts={posts}
                            reels={reels}
                            songs={songs}
                            episodes={episodes}
                            onProfileClick={handleProfileClick}
                            onFollow={handleFollow}
                            onReact={handleReact}
                            onComment={handleComment}
                            onShare={handleShare}
                            onMessage={(id) => {
                                const target = users.find(u => u.id === id);
                                if (target) setChatRecipient(target);
                            }}
                            onCreatePost={handleCreatePost}
                            onUpdateProfileImage={(file) => handleUpdateUser({ profileImage: URL.createObjectURL(file) })}
                            onUpdateCoverImage={(file) => handleUpdateUser({ coverImage: URL.createObjectURL(file) })}
                            onUpdateUserDetails={handleUpdateUser}
                            onDeletePost={(pid) => setPosts(posts.filter(p => p.id !== pid))}
                            onEditPost={(pid, content) => setPosts(posts.map(p => p.id === pid ? { ...p, content } : p))}
                            getCommentAuthor={(id) => users.find(u => u.id === id)}
                            onViewImage={setFullScreenImage}
                            onCreateEventClick={() => setShowCreateEvent(true)}
                            onOpenComments={setActiveCommentsPostId}
                            onVideoClick={(post) => {
                                setInitialReelId(post.id);
                                setView('reels');
                            }}
                            onPlayAudio={handlePlayTrack}
                        />
                    )}

                    {/* OTHER PAGES */}
                    {view === 'profiles' && (
                        <SuggestedProfilesPage 
                            currentUser={currentUser!}
                            users={users}
                            groups={groups}
                            products={products}
                            events={events}
                            onFollow={handleFollow}
                            onProfileClick={handleProfileClick}
                            onViewProduct={setActiveProduct}
                        />
                    )}
                    
                    {view === 'birthdays' && currentUser && (
                        <BirthdaysPage currentUser={currentUser} users={users} onMessage={() => {}} />
                    )}
                    
                    {view === 'memories' && currentUser && (
                        <MemoriesPage currentUser={currentUser} posts={posts} users={users} />
                    )}
                    
                    {view === 'settings' && (
                        <SettingsPage currentUser={currentUser} onUpdateUser={handleUpdateUser} />
                    )}
                    
                    {view === 'events' && (
                        <EventsPage 
                            events={events} 
                            currentUser={currentUser} 
                            onJoinEvent={handleJoinEvent} 
                            onCreateEventClick={() => requireLogin(() => setShowCreateEvent(true))} 
                        />
                    )}
                    
                    {view === 'music' && (
                        <MusicSystem 
                            currentUser={currentUser}
                            songs={songs}
                            episodes={episodes}
                            onUpdateSongs={setSongs}
                            onUpdateEpisodes={setEpisodes}
                            onPlayTrack={handlePlayTrack}
                            isPlaying={isPlaying}
                            onTogglePlay={() => setIsPlaying(!isPlaying)}
                            onFeedPost={(p) => setPosts([p, ...posts])}
                        />
                    )}
                    
                    {view === 'tools' && <ToolsPage />}
                    
                    {view === 'privacy' && <PrivacyPolicyPage onNavigateHome={() => setView('home')} />}
                    {view === 'terms' && <TermsOfServicePage onNavigateHome={() => setView('home')} />}
                    {view === 'help' && <HelpSupportPage onNavigateHome={() => setView('home')} />}

                </div>

                {/* Right Sidebar */}
                {currentUser && view === 'home' && (
                    <div className="hidden md:block w-[280px] xl:w-[360px] fixed right-0 top-14 h-screen overflow-y-auto pb-20">
                        <RightSidebar 
                            contacts={users.filter(u => u.id !== currentUser.id && currentUser.following.includes(u.id))}
                            onProfileClick={(id) => {
                                const target = users.find(u => u.id === id);
                                if (target) setChatRecipient(target);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* --- OVERLAYS & MODALS --- */}
            
            {showLogin && (
                <Login 
                    onLogin={handleLogin}
                    onNavigateToRegister={() => { setShowLogin(false); setShowRegister(true); }}
                    onClose={() => setShowLogin(false)}
                    error=""
                />
            )}

            {showRegister && (
                <Register 
                    onRegister={handleRegister}
                    onBackToLogin={() => { setShowRegister(false); setShowLogin(true); }}
                />
            )}

            {showCreatePost && currentUser && (
                <CreatePostModal 
                    currentUser={currentUser}
                    users={users}
                    onClose={() => setShowCreatePost(false)}
                    onCreatePost={handleCreatePost}
                    onCreateEventClick={() => { setShowCreatePost(false); setShowCreateEvent(true); }}
                />
            )}

            {showCreateReel && currentUser && (
                <CreateReel 
                    currentUser={currentUser}
                    onClose={() => setShowCreateReel(false)}
                    onSubmit={handleCreateReel}
                />
            )}

            {showCreateEvent && currentUser && (
                <CreateEventModal 
                    currentUser={currentUser}
                    onClose={() => setShowCreateEvent(false)}
                    onCreate={(e) => setEvents([...events, { ...e as Event, id: events.length + 1, interestedIds: [], attendees: [currentUser.id] }])}
                />
            )}

            {showCreateStory && currentUser && (
                <CreateStoryModal 
                    currentUser={currentUser}
                    onClose={() => setShowCreateStory(false)}
                    onCreate={(story) => {
                        setStories([{ ...story as Story, id: Date.now(), user: currentUser, createdAt: Date.now(), type: story.type || 'image' }, ...stories]);
                        setShowCreateStory(false);
                    }}
                />
            )}

            {activeStory && currentUser && (
                <StoryViewer 
                    story={activeStory}
                    user={users.find(u => u.id === activeStory.userId) || currentUser}
                    currentUser={currentUser}
                    onClose={() => setActiveStory(null)}
                    onNext={() => {
                        const idx = stories.findIndex(s => s.id === activeStory.id);
                        if (idx < stories.length - 1) setActiveStory(stories[idx + 1]);
                        else setActiveStory(null);
                    }}
                    onPrev={() => {
                        const idx = stories.findIndex(s => s.id === activeStory.id);
                        if (idx > 0) setActiveStory(stories[idx - 1]);
                    }}
                    onLike={() => { /* Like Logic */ }}
                    onReply={() => { /* Reply Logic */ }}
                    onFollow={handleFollow}
                    isFollowing={currentUser.following.includes(activeStory.userId)}
                />
            )}

            {activeCommentsPostId && activeCommentPost && (
                <CommentsSheet 
                    post={activeCommentPost}
                    currentUser={currentUser}
                    users={users}
                    onClose={() => setActiveCommentsPostId(null)}
                    onComment={(pid, text) => handleComment(pid, text)}
                    onLikeComment={() => {}}
                    getCommentAuthor={(uid) => users.find(u => u.id === uid)}
                    onProfileClick={handleProfileClick}
                />
            )}

            {activeSharePostId && activeSharePost && (
                <ShareSheet 
                    post={activeSharePost}
                    groups={groups}
                    onClose={() => setActiveSharePostId(null)}
                    onShareNow={(caption) => handleShareConfirm(caption)}
                    onShareToGroup={(gid, caption) => {
                        handlePostToGroup(gid, caption, null, 'text');
                        setActiveSharePostId(null);
                    }}
                    onCopyLink={() => { navigator.clipboard.writeText(window.location.href); setActiveSharePostId(null); }}
                />
            )}

            {activeProduct && (
                <ProductDetailModal 
                    product={activeProduct}
                    currentUser={currentUser}
                    onClose={() => setActiveProduct(null)}
                    onMessage={(sid) => {
                        const seller = users.find(u => u.id === sid);
                        if(seller) {
                            setActiveProduct(null);
                            setChatRecipient(seller);
                        }
                    }}
                />
            )}

            {chatRecipient && currentUser && (
                <ChatWindow 
                    currentUser={currentUser}
                    recipient={chatRecipient}
                    messages={messages.filter(m => 
                        (m.senderId === currentUser.id && m.receiverId === chatRecipient.id) || 
                        (m.senderId === chatRecipient.id && m.receiverId === currentUser.id)
                    )}
                    onClose={() => setChatRecipient(null)}
                    onSendMessage={(text, sticker) => {
                        const msg: Message = {
                            id: Date.now(),
                            senderId: currentUser.id,
                            receiverId: chatRecipient.id,
                            text: text,
                            stickerUrl: sticker,
                            timestamp: Date.now()
                        };
                        setMessages([...messages, msg]);
                    }}
                />
            )}

            {fullScreenImage && (
                <ImageViewer 
                    image={fullScreenImage}
                    onClose={() => setFullScreenImage(null)}
                />
            )}

            {/* Global Music Player */}
            {currentTrack && (
                <GlobalAudioPlayer 
                    currentTrack={currentTrack}
                    isPlaying={isPlaying}
                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                    onClose={() => { setCurrentTrack(null); setIsPlaying(false); }}
                    onNext={() => { /* Queue logic */ }}
                    onPrevious={() => { /* Queue logic */ }}
                    onDownload={() => {}}
                    onLike={() => {}}
                    isLiked={false}
                    uploaderProfile={users.find(u => u.id === currentTrack.uploaderId)}
                />
            )}
        </div>
    );
};

export default App;