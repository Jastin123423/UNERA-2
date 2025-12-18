
import React, { useState, useEffect, useMemo } from 'react';
import { Login, Register } from './components/Auth';
import { Header, Sidebar, RightSidebar, MenuOverlay } from './components/Layout';
import { CreatePost, Post, CommentsSheet, ShareSheet, CreatePostModal, SuggestedProductsWidget } from './components/Feed';
import { StoryReel, StoryViewer, CreateStoryModal } from './components/Story';
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
    const [stories, setStories] = useState<Story[]>(INITIAL_STORIES.map(s => ({...s, createdAt: Date.now(), type: s.type || 'image'}))); 
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
    const [showCreateStory, setShowCreateStory] = useState(false);
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    const [activeCommentsPostId, setActiveCommentsPostId] = useState<number | null>(null);
    const [activeSharePostId, setActiveSharePostId] = useState<number | null>(null);
    const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeProduct, setActiveProduct] = useState<Product | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    
    useEffect(() => {
        const storedUser = getSession();
        if (storedUser) {
            setCurrentUser(storedUser);
            api.getNotifications(storedUser.id).then((nots) => { if(Array.isArray(nots)) setNotifications(nots); });
        }
    }, []);

    useEffect(() => {
        let ws: WebSocket;
        const connectWs = () => {
            const wsUrl = "wss://unera-2.pages.dev/live_feed"; 
            ws = new WebSocket(wsUrl);
            ws.onmessage = (evt) => {
                try {
                    const message = JSON.parse(evt.data);
                    if (message.type === 'new_post') {
                        const rawPost = message.data;
                        const newPost: PostType = { id: rawPost.id, authorId: rawPost.user_id, content: rawPost.content, image: rawPost.media_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? rawPost.media_url : undefined, video: rawPost.media_url?.match(/\.(mp4|webm|mov)$/i) ? rawPost.media_url : undefined, timestamp: "Just now", createdAt: Date.now(), reactions: [], comments: [], shares: 0, type: rawPost.media_url ? (rawPost.media_url.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image') : 'text', visibility: 'Public' };
                        setPosts(prev => [newPost, ...prev]);
                    } else if (message.type === 'notification' && currentUser && message.toUserId === currentUser.id) {
                        setNotifications(prev => [message.data, ...prev]);
                    }
                } catch (e) {}
            };
            ws.onclose = () => setTimeout(connectWs, 5000);
        };
        connectWs();
        return () => ws?.close();
    }, [currentUser]); 

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [remoteUsers, remotePosts, remoteGroups, remoteBrands, remoteEvents, remoteMusic, remotePodcasts] = await Promise.all([
                    api.getUsers(), api.getPosts(), api.getGroups(), api.getBrands(), api.getEvents(), api.getMusic(), api.getPodcasts()
                ]);
                if (remoteUsers) setUsers(prev => { const existingIds = new Set(prev.map(u => u.id)); return [...prev, ...remoteUsers.map((u: any) => ({ id: u.id, name: u.username || `User ${u.id}`, profileImage: u.profile_url || `https://ui-avatars.com/api/?name=${u.username}&background=random`, email: u.email, followers: [], following: [], isOnline: false })).filter((u: any) => !existingIds.has(u.id))]; });
                if (remotePosts) setPosts(prev => { const existingIds = new Set(prev.map(p => p.id)); return [...remotePosts.map((p: any) => ({ id: p.id, authorId: p.user_id, content: p.content, image: p.media_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? p.media_url : undefined, video: p.media_url?.match(/\.(mp4|webm|mov)$/i) ? p.media_url : undefined, timestamp: getTimeAgo(p.created_at ? new Date(p.created_at).getTime() : Date.now()), createdAt: p.created_at ? new Date(p.created_at).getTime() : Date.now(), reactions: [], comments: [], shares: 0, type: p.media_url ? (p.media_url.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image') : 'text', visibility: 'Public', sharedPostId: p.shared_post_id })).filter((p: any) => !existingIds.has(p.id)), ...prev]; });
            } catch (err) {} finally { setIsLoading(false); }
        };
        fetchAllData();
    }, []);

    const enrichedStories = useMemo(() => stories.map(story => story.user ? story : { ...story, user: users.find(u => u.id === story.userId) }), [stories, users]);

    const rankedPosts = useMemo(() => {
        const standardPosts = rankFeed(posts, currentUser, users);
        const groupPosts = groups.filter(g => g.type === 'public' || (currentUser && g.members.includes(currentUser.id))).flatMap(group => group.posts.map(gp => ({ id: gp.id, authorId: gp.authorId, content: gp.content, image: gp.image, video: gp.video, timestamp: getTimeAgo(gp.timestamp), createdAt: gp.timestamp, reactions: [], comments: gp.comments, shares: gp.shares, type: gp.video ? 'video' : (gp.image ? 'image' : 'text'), visibility: 'Public', background: gp.background, groupId: group.id, groupName: group.name, isGroupAdmin: group.adminId === gp.authorId } as PostType)));
        return [...standardPosts, ...groupPosts].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }, [posts, groups, currentUser, users]);

    const handleLogin = async (email: string, pass: string) => {
        try {
            const res = await api.login({ email, password: pass });
            if (res?.user) { const user: User = { id: res.user.id || 999, name: res.user.username || email.split('@')[0], email: res.user.email, profileImage: res.user.profile_url || `https://ui-avatars.com/api/?name=${email}&background=random`, followers: [], following: [], isOnline: true, role: 'user' }; setCurrentUser(user); setSession(user); setView('home'); setActiveTab('home'); return; }
        } catch (e) {}
        const user = users.find(u => u.email === email && u.password === pass);
        if (user) { setCurrentUser(user); setSession(user); setView('home'); } else setLoginError('Invalid email or password');
    };

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
        if (!currentUser) return;
        setGroups(groups.map(g => {
            if (g.id === groupId) {
                if (g.members.includes(currentUser.id)) return g;
                return { ...g, members: [...g.members, currentUser.id] };
            }
            return g;
        }));
    };

    const handlePostToGroup = (groupId: string, content: string, file: File | null, type: any, background?: string) => {
        if (!currentUser) return;
        const group = groups.find(g => g.id === groupId);
        if (!group) return;

        const newPost: PostType = {
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
        if (!currentUser) return;
        setBrands(brands.map(b => {
            if (b.id === brandId) {
                if (b.followers.includes(currentUser.id)) {
                    return { ...b, followers: b.followers.filter(id => id !== currentUser.id) };
                } else {
                    return { ...b, followers: [...b.followers, currentUser.id] };
                }
            }
            return b;
        }));
    };

    const handlePostAsBrand = (brandId: number, content: any) => {
        const brand = brands.find(b => b.id === brandId);
        if (!brand) return;
        
        let mediaUrl = undefined;
        if (content.file) {
            mediaUrl = URL.createObjectURL(content.file);
        }

        const newPost: PostType = {
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

    const handleUpdateBrand = (brandId: number, data: Partial<Brand>) => {
        setBrands(brands.map(b => b.id === brandId ? { ...b, ...data } : b));
    };

    const handleBrandMessage = (brandId: number) => {
        console.log(`Messaging brand ${brandId}`);
    };

    const handleCreateBrandEvent = (brandId: number, event: Partial<Event>) => {
        const newEvent: Event = {
            ...event as Event,
            id: events.length + 1,
            organizerId: brandId,
            attendees: [currentUser?.id || 0],
            interestedIds: []
        };
        setEvents([...events, newEvent]);
    };

    const handleCreatePost = (text: string, file: File | null, type: any, visibility: any, location?: string, feeling?: string, taggedUsers?: number[], background?: string, linkPreview?: LinkPreview, wantsMessages?: boolean) => {
        if (!currentUser) return;
        
        let mediaUrl = undefined;
        if (file) {
            mediaUrl = URL.createObjectURL(file);
        }

        const newPost: PostType = {
            id: Date.now(),
            authorId: currentUser.id,
            content: text,
            image: type === 'image' ? mediaUrl : undefined,
            video: type === 'video' ? mediaUrl : undefined,
            background,
            location,
            feeling,
            taggedUsers,
            visibility,
            type,
            timestamp: 'Just now',
            createdAt: Date.now(),
            reactions: [],
            comments: [],
            shares: 0,
            views: 0,
            linkPreview,
            wantsMessages
        };

        setPosts([newPost, ...posts]);
    };

    const handleComment = (postId: number, text: string) => {
        if (!currentUser) return;
        setPosts(posts.map(p => {
            if (p.id === postId) {
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

    const handleShareToFeed = (caption: string) => {
        if (!currentUser || !activeSharePostId) return;
        const originalPost = posts.find(p => p.id === activeSharePostId);
        if (!originalPost) return;

        const sharedPost: PostType = {
            id: Date.now(),
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

    const handleCreateStory = (storyData: Partial<Story>) => {
        if (!currentUser) return;
        const newStory: Story = {
            id: Date.now(),
            userId: currentUser.id,
            type: storyData.type || 'image',
            image: storyData.image,
            text: storyData.text,
            background: storyData.background,
            music: storyData.music,
            createdAt: Date.now(),
            user: currentUser
        };
        setStories([newStory, ...stories]);
        setShowCreateStory(false);
    };

    const handleVideoClick = (post: PostType) => {
        if (post.type !== 'video' || !post.video) return;
        if (!reels.find(r => r.id === post.id)) { setReels(prev => [{ id: post.id, userId: post.authorId, videoUrl: post.video!, caption: post.content || '', songName: 'Original Audio', reactions: post.reactions, comments: post.comments, shares: post.shares, isCompressed: false }, ...prev]); }
        setActiveReelId(post.id); setView('reels'); setActiveTab('reels');
    };

    if (isLoading) return <Spinner />;
    if (showRegister) return <Register onRegister={async (u) => { await api.signup({ username: u.name!, email: u.email!, password: u.password! }); handleLogin(u.email!, u.password!); setShowRegister(false); }} onBackToLogin={() => setShowRegister(false)} />;
    if (!currentUser && !['help', 'terms', 'privacy'].includes(view)) return <Login onLogin={handleLogin} onNavigateToRegister={() => setShowRegister(true)} onClose={() => setView('home')} error={loginError} />;

    return (
        <div className="bg-[#18191A] min-h-screen text-[#E4E6EB] font-sans">
            <Header onHomeClick={() => { setView('home'); setActiveTab('home'); }} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onReelsClick={() => setView('reels')} onMarketplaceClick={() => setView('marketplace')} onGroupsClick={() => setView('groups')} currentUser={currentUser} notifications={notifications} users={users} groups={groups} brands={brands} onLogout={() => { setCurrentUser(null); clearSession(); }} onLoginClick={() => setView('')} onMarkNotificationsRead={() => { api.markNotificationRead({ user_id: currentUser!.id, all: true }); setNotifications(prev => prev.map(n => ({...n, read: true}))); }} activeTab={activeTab} onNavigate={(v) => { setView(v); setActiveTab(v); }} />
            <div className="flex justify-center">
                <Sidebar currentUser={currentUser || INITIAL_USERS[0]} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onReelsClick={() => setView('reels')} onMarketplaceClick={() => setView('marketplace')} onGroupsClick={() => setView('groups')} />
                <div className="flex-1 w-full max-w-[700px] min-h-screen relative">
                    {view === 'home' && (
                        <div className="w-full pb-20 pt-4 px-0 md:px-4">
                            <StoryReel stories={enrichedStories} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onCreateStory={() => setShowCreateStory(true)} onViewStory={setActiveStory} currentUser={currentUser} onRequestLogin={() => setView('')} />
                            {currentUser && <CreatePost currentUser={currentUser} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onClick={() => setShowCreatePostModal(true)} onCreateEventClick={() => setShowCreateEventModal(true)} />}
                            {rankedPosts.map(post => {
                                const author = users.find(u => u.id === post.authorId) || brands.find(b => b.id === post.authorId);
                                if (!author) return null;
                                return <Post key={post.id} post={post} author={author as any} currentUser={currentUser} users={users} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onReact={(pid, t) => { setPosts(prev => prev.map(p => p.id === pid ? { ...p, reactions: [...p.reactions, { userId: currentUser!.id, type: t }] } : p)); api.createLike({ user_id: currentUser!.id, target_id: pid, target_type: 'post', like_type: t }); }} onShare={(id) => setActiveSharePostId(id)} onDelete={(id) => setPosts(prev => prev.filter(p => p.id !== id))} onEdit={(id, c) => setPosts(prev => prev.map(p => p.id === id ? { ...p, content: c } : p))} onViewImage={setFullScreenImage} onOpenComments={setActiveCommentsPostId} onVideoClick={handleVideoClick} onViewProduct={setActiveProduct} onFollow={async (id) => { api.followUser({ follower_id: currentUser!.id, following_id: id }); setUsers(prev => prev.map(u => u.id === id ? { ...u, followers: [...u.followers, currentUser!.id] } : u)); }} isFollowing={currentUser?.following.includes(author.id)} onPlayAudio={(track) => { setCurrentAudioTrack(track); setIsAudioPlaying(true); }} sharedPost={(post as any).embeddedSharedPost} onMessage={(uid) => { setActiveChatUser(users.find(u => u.id === uid) || null); }} />;
                            })}
                        </div>
                    )}
                    {view === 'profile' && selectedUserId && (
                        <UserProfile user={users.find(u => u.id === selectedUserId)!} currentUser={currentUser} users={users} groups={groups} brands={brands} posts={posts} reels={reels} songs={songs} episodes={episodes} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onFollow={() => {}} onReact={() => {}} onComment={() => {}} onShare={setActiveSharePostId} onMessage={(id) => { setActiveChatUser(users.find(u => u.id === id) || null); }} onCreatePost={() => {}} onUpdateProfileImage={() => {}} onUpdateCoverImage={() => {}} onUpdateUserDetails={() => {}} onDeletePost={() => {}} onEditPost={() => {}} getCommentAuthor={(id) => users.find(u => u.id === id)} onViewImage={setFullScreenImage} onCreateEventClick={() => setShowCreateEventModal(true)} onCreateStoryClick={() => setShowCreateStory(true)} onOpenComments={setActiveCommentsPostId} onVideoClick={handleVideoClick} onPlayAudio={(track) => { setCurrentAudioTrack(track); setIsAudioPlaying(true); }} />
                    )}
                    {view === 'marketplace' && <MarketplacePage currentUser={currentUser} products={products} onNavigateHome={() => setView('home')} onCreateProduct={(p) => setProducts([p as Product, ...products])} onViewProduct={setActiveProduct} />}
                    {view === 'reels' && <ReelsFeed reels={reels} users={users} currentUser={currentUser} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onCreateReelClick={() => setShowCreateReelModal(true)} onReact={() => {}} onComment={() => {}} onShare={() => {}} onFollow={() => {}} getCommentAuthor={(id) => users.find(u => u.id === id)} initialReelId={activeReelId} />}
                    {view === 'groups' && <GroupsPage currentUser={currentUser} groups={groups} users={users} onCreateGroup={handleCreateGroup} onJoinGroup={handleJoinGroup} onLeaveGroup={() => {}} onDeleteGroup={() => {}} onUpdateGroupImage={() => {}} onPostToGroup={handlePostToGroup} onCreateGroupEvent={() => {}} onInviteToGroup={() => {}} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onLikePost={() => {}} onOpenComments={setActiveCommentsPostId} onSharePost={setActiveSharePostId} onDeleteGroupPost={() => {}} onRemoveMember={() => {}} onUpdateGroupSettings={() => {}} />}
                    {view === 'brands' && <BrandsPage currentUser={currentUser} brands={brands} posts={posts} users={users} onCreateBrand={handleCreateBrand} onFollowBrand={handleFollowBrand} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onPostAsBrand={handlePostAsBrand} onReact={() => {}} onShare={setActiveSharePostId} onOpenComments={setActiveCommentsPostId} onUpdateBrand={handleUpdateBrand} onMessage={handleBrandMessage} onCreateEvent={handleCreateBrandEvent} />}
                    {view === 'music' && <MusicSystem currentUser={currentUser} songs={songs} episodes={episodes} onUpdateSongs={setSongs} onUpdateEpisodes={setEpisodes} onPlayTrack={(t) => { setCurrentAudioTrack(t); setIsAudioPlaying(true); }} isPlaying={isAudioPlaying} onTogglePlay={() => setIsAudioPlaying(!isAudioPlaying)} onFeedPost={(p) => setPosts([p, ...posts])} />}
                    {view === 'tools' && <ToolsPage />}
                    {view === 'help' && <HelpSupportPage onNavigateHome={() => setView('home')} />}
                    {view === 'privacy' && <PrivacyPolicyPage onNavigateHome={() => setView('home')} />}
                    {view === 'terms' && <TermsOfServicePage onNavigateHome={() => setView('home')} />}
                </div>
                <RightSidebar contacts={users.filter(u => currentUser && currentUser.following.includes(u.id))} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} />
            </div>
            {activeStory && <StoryViewer story={activeStory} user={enrichedStories.find(s => s.id === activeStory.id)?.user!} currentUser={currentUser} onClose={() => setActiveStory(null)} />}
            {showCreatePostModal && currentUser && <CreatePostModal currentUser={currentUser} users={users} onClose={() => setShowCreatePostModal(false)} onCreatePost={handleCreatePost} onCreateEventClick={() => { setShowCreatePostModal(false); setShowCreateEventModal(true); }} />}
            {showCreateReelModal && currentUser && <CreateReel currentUser={currentUser} onClose={() => setShowCreateReelModal(false)} onSubmit={() => {}} />}
            {showCreateEventModal && currentUser && <CreateEventModal currentUser={currentUser} onClose={() => setShowCreateEventModal(false)} onCreate={() => {}} />}
            {showCreateStory && currentUser && <CreateStoryModal currentUser={currentUser} onClose={() => setShowCreateStory(false)} onCreate={handleCreateStory} />}
            {activeCommentsPostId && <CommentsSheet post={[...posts].find(p => p.id === activeCommentsPostId)!} currentUser={currentUser!} users={users} onClose={() => setActiveCommentsPostId(null)} onComment={handleComment} onLikeComment={() => {}} getCommentAuthor={(id) => users.find(u => u.id === id)} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); setActiveCommentsPostId(null); }} />}
            {activeSharePostId && <ShareSheet post={[...posts].find(p => p.id === activeSharePostId)!} groups={groups.filter(g => currentUser && g.members.includes(currentUser.id))} onClose={() => setActiveSharePostId(null)} onShareNow={handleShareToFeed} onShareToGroup={() => {}} onCopyLink={() => alert("Copied!")} />}
            {activeChatUser && currentUser && <ChatWindow currentUser={currentUser} recipient={activeChatUser} messages={messages.filter(m => (m.senderId === currentUser.id && m.receiverId === activeChatUser.id) || (m.senderId === activeChatUser.id && m.receiverId === currentUser.id))} onClose={() => setActiveChatUser(null)} onSendMessage={(text, sticker) => setMessages([...messages, { id: Date.now(), senderId: currentUser.id, receiverId: activeChatUser.id, text: sticker ? '' : text, stickerUrl: sticker, timestamp: Date.now() }])} />}
            {fullScreenImage && <ImageViewer image={fullScreenImage} onClose={() => setFullScreenImage(null)} />}
            {activeProduct && <ProductDetailModal product={activeProduct} currentUser={currentUser} onClose={() => setActiveProduct(null)} onMessage={(id) => { setActiveChatUser(users.find(u => u.id === id) || null); setActiveProduct(null); }} />}
            {currentAudioTrack && <GlobalAudioPlayer currentTrack={currentAudioTrack} isPlaying={isAudioPlaying} onTogglePlay={() => setIsAudioPlaying(!isAudioPlaying)} onNext={() => {}} onPrevious={() => {}} onClose={() => { setCurrentAudioTrack(null); setIsAudioPlaying(false); }} onDownload={() => {}} onLike={() => {}} isLiked={false} uploaderProfile={users.find(u => u.id === currentAudioTrack.uploaderId)} />}
        </div>
    );
}
