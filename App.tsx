
import React, { useState, useEffect } from 'react';
import { Login, Register } from './components/Auth';
import { Header, Sidebar, RightSidebar, MenuOverlay } from './components/Layout';
import { CreatePost, Post, CommentsSheet, ShareSheet, CreatePostModal, SuggestedProductsWidget } from './components/Feed';
import { StoryReel, StoryViewer } from './components/Story';
import { UserProfile } from './components/UserProfile';
import { MarketplacePage, ProductDetailModal } from './components/Marketplace';
import { ReelsFeed, CreateReel } from './components/Reels';
import { ChatWindow } from './components/Chat';
import { ImageViewer, Spinner } from './components/Common';
import { EventsPage, BirthdaysPage, SuggestedProfilesPage } from './components/MenuPages';
import { CreateEventModal } from './components/Events';
import { GroupsPage } from './components/Groups';
import { MusicSystem, GlobalAudioPlayer } from './components/MusicSystem'; // NEW
import { LanguageProvider } from './contexts/LanguageContext';
import { User, Post as PostType, Story, Reel, Notification, Message, Event, Product, Comment, ReactionType, LinkPreview, Group, GroupPost, AudioTrack } from './types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_STORIES, INITIAL_REELS, INITIAL_EVENTS, INITIAL_GROUPS } from './constants';

function App() {
    // ... existing states
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [posts, setPosts] = useState<PostType[]>(INITIAL_POSTS);
    const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
    const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
    const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
    const [products, setProducts] = useState<Product[]>([]);
    const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
    
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

    // ... UI states (same as before)
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
        const storedUser = localStorage.getItem('universeCurrentUser');
        const storedUsers = localStorage.getItem('universeUsers');
        if (storedUsers) setUsers(JSON.parse(storedUsers));
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const freshUser = (storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS).find((u: User) => u.id === user.id);
            if (freshUser) setCurrentUser(freshUser);
        }
        setTimeout(() => setIsLoading(false), 800);
    }, []);

    useEffect(() => {
        if (currentUser) localStorage.setItem('universeCurrentUser', JSON.stringify(currentUser));
        else localStorage.removeItem('universeCurrentUser');
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('universeUsers', JSON.stringify(users));
    }, [users]);

    // ... Auth Handlers ...
    const handleLogin = (email: string, pass: string) => {
        const user = users.find(u => u.email === email && u.password === pass);
        if (user) {
            setCurrentUser(user);
            setView('home');
            setActiveTab('home');
            setLoginError('');
        } else {
            setLoginError('Invalid email or password');
        }
    };

    const handleRegister = (newUser: Partial<User>) => {
        const id = Math.max(...users.map(u => u.id)) + 1;
        const user: User = { ...newUser, id, role: 'user' } as User;
        setUsers([...users, user]);
        setCurrentUser(user);
        setShowRegister(false);
        setView('home');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('universeCurrentUser');
        setView('login');
        setShowFullMenu(false);
        setCurrentAudioTrack(null);
        setIsAudioPlaying(false);
    };

    const handleNavigate = (targetView: string) => {
        if (targetView === 'home') {
            setView('home');
            setActiveTab('home');
        } else if (targetView === 'marketplace') {
            setView('marketplace');
            setActiveTab('marketplace');
        } else if (targetView === 'reels') {
            setView('reels');
            setActiveTab('reels');
            setActiveReelId(null);
        } else if (targetView === 'groups') {
            setView('groups');
            setActiveTab('groups');
        } else if (targetView === 'music') {
            setView('music');
            setActiveTab('music');
        } else if (targetView === 'office') {
            alert("UNERA Office Tools - Coming Soon!\nFeatures will include: Documents, Spreadsheets, and Presentations.");
        } else if (targetView === 'profile') {
            if (currentUser) {
                setSelectedUserId(currentUser.id);
                setView('profile');
            }
        } else if (targetView === 'create_event') {
            setShowCreateEventModal(true);
        } else {
            setView(targetView);
            setActiveTab('home'); 
        }
        setShowFullMenu(false);
    };

    // ... Create Post/Group/React/Comment Logic (Same as before) ...
    // ... skipping repetition of identical logic for brevity ...
    const handleCreatePost = (text: string, file: File | null, type: any, visibility: any, location?: string, feeling?: string, taggedUsers?: number[], background?: string, linkPreview?: LinkPreview) => {
        if (!currentUser) return;
        const newPost: PostType = {
            id: Date.now(),
            authorId: currentUser.id,
            content: text,
            image: file && type === 'image' ? URL.createObjectURL(file) : undefined,
            video: file && type === 'video' ? URL.createObjectURL(file) : undefined,
            timestamp: 'Just now',
            reactions: [], comments: [], shares: 0, type, visibility, location, feeling, taggedUsers, background, linkPreview
        };
        setPosts([newPost, ...posts]);
    };
    
    // Placeholders for other handlers to maintain structure
    const handleReact = (postId: number, type: ReactionType) => {
        if (!currentUser) return;
        setPosts(posts.map(post => {
            if (post.id === postId) {
                const existing = post.reactions.find(r => r.userId === currentUser.id);
                let newReactions = [...post.reactions];
                if (existing) {
                    if (existing.type === type) newReactions = newReactions.filter(r => r.userId !== currentUser.id);
                    else newReactions = newReactions.map(r => r.userId === currentUser.id ? { ...r, type } : r);
                } else {
                    newReactions.push({ userId: currentUser.id, type });
                    if (post.authorId !== currentUser.id) addNotification(post.authorId, currentUser.id, 'reaction', `reacted ${type} to your post`, postId);
                }
                return { ...post, reactions: newReactions };
            }
            return post;
        }));
    };

    const handleComment = (postId: number, text: string, attachment?: any) => {
        if (!currentUser) return;
        const newComment: Comment = { id: Date.now(), userId: currentUser.id, text, timestamp: 'Just now', likes: 0, attachment };
        setPosts(posts.map(p => {
            if (p.id === postId) {
                if (p.authorId !== currentUser.id) addNotification(p.authorId, currentUser.id, 'comment', 'commented on your post', postId);
                return { ...p, comments: [...p.comments, newComment] };
            }
            return p;
        }));
    };

    const handleLikeComment = (postId: number, commentId: number) => { /* ... */ };
    const addNotification = (userId: number, senderId: number, type: any, content: string, postId?: number) => { /* ... */ };
    const handleFollow = (userId: number) => { /* ... */ };
    const handleUpdateProfileImage = (file: File) => { /* ... */ };
    const handleUpdateCoverImage = (file: File) => { /* ... */ };
    const handleUpdateUserDetails = (data: Partial<User>) => { /* ... */ };
    const handleOpenReel = (post: PostType) => { /* ... */ };
    
    const handleCreateGroup = (groupData: Partial<Group>) => {
        if (!currentUser) return;
        const newGroup: Group = {
            id: `g${Date.now()}`,
            name: groupData.name!,
            description: groupData.description || '',
            type: groupData.type || 'public',
            image: groupData.image || '',
            coverImage: groupData.coverImage || '',
            adminId: currentUser.id,
            members: [currentUser.id],
            posts: [],
            createdDate: Date.now()
        };
        setGroups([newGroup, ...groups]);
        
        const newPost: PostType = {
            id: Date.now(),
            authorId: currentUser.id,
            content: `I created a new group: ${newGroup.name}`,
            timestamp: 'Just now',
            reactions: [], comments: [], shares: 0, type: 'text', visibility: 'Public'
        };
        setPosts([newPost, ...posts]);
    };

    const handleJoinGroup = (groupId: string) => {
        if (!currentUser) return;
        setGroups(groups.map(g => {
            if (g.id === groupId && !g.members.includes(currentUser.id)) {
                return { ...g, members: [...g.members, currentUser.id] };
            }
            return g;
        }));
    };

    const handleLeaveGroup = (groupId: string) => {
        if (!currentUser) return;
        setGroups(groups.map(g => {
            if (g.id === groupId) {
                return { ...g, members: g.members.filter(id => id !== currentUser.id) };
            }
            return g;
        }));
    };

    const handlePostToGroup = (groupId: string, content: string) => {
        if (!currentUser) return;
        const newPost: GroupPost = {
            id: Date.now(),
            authorId: currentUser.id,
            content,
            timestamp: Date.now(),
            likes: [],
            comments: []
        };
        setGroups(groups.map(g => {
            if (g.id === groupId) {
                return { ...g, posts: [newPost, ...g.posts] };
            }
            return g;
        }));
    };

    // --- Audio Handlers ---
    const handlePlayTrack = (track: AudioTrack) => {
        setCurrentAudioTrack(track);
        setIsAudioPlaying(true);
    };

    return (
        <LanguageProvider>
            {isLoading ? (
                <Spinner />
            ) : view === 'login' ? (
                <Login onLogin={handleLogin} onNavigateToRegister={() => setView('register')} onClose={() => { setView('home'); setCurrentUser(null); }} error={loginError} />
            ) : view === 'register' ? (
                <Register onRegister={handleRegister} onBackToLogin={() => setView('login')} />
            ) : (
                <div className="bg-[#18191A] min-h-screen text-[#E4E6EB] font-sans pb-20">
                    <Header 
                        onHomeClick={() => handleNavigate('home')}
                        onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }}
                        onReelsClick={() => handleNavigate('reels')}
                        onMarketplaceClick={() => handleNavigate('marketplace')}
                        onGroupsClick={() => handleNavigate('groups')}
                        currentUser={currentUser}
                        notifications={notifications}
                        users={users}
                        onLogout={handleLogout}
                        onLoginClick={() => setView('login')}
                        onMarkNotificationsRead={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                        activeTab={activeTab}
                        onNavigate={handleNavigate}
                    />
                    
                    <div className="flex justify-center">
                        <div className="hidden lg:block w-[360px] flex-shrink-0">
                             {currentUser && <Sidebar 
                                onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} 
                                onReelsClick={() => handleNavigate('reels')}
                                onMarketplaceClick={() => handleNavigate('marketplace')}
                                onGroupsClick={() => handleNavigate('groups')}
                                currentUser={currentUser} 
                            />}
                        </div>

                        <div className="flex-1 max-w-[700px] w-full min-h-screen relative">
                            {/* ... Standard Views ... */}
                            {view === 'home' && (
                                <div className="py-4 px-0 md:px-4">
                                    <StoryReel stories={stories} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onCreateStory={(file) => { }} onViewStory={setActiveStory} />
                                    {currentUser && <CreatePost currentUser={currentUser} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onClick={() => setShowCreatePostModal(true)} onCreateEventClick={() => setShowCreateEventModal(true)} />}
                                    {currentUser && products.length > 0 && <SuggestedProductsWidget products={products} currentUser={currentUser} onViewProduct={setActiveProduct} />}
                                    {posts.map(post => {
                                        const author = users.find(u => u.id === post.authorId);
                                        if (!author) return null;
                                        return (
                                            <Post 
                                                key={post.id}
                                                post={post}
                                                author={author}
                                                currentUser={currentUser || INITIAL_USERS[0]}
                                                onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }}
                                                onReact={handleReact}
                                                onShare={(id) => setActiveSharePostId(id)}
                                                onDelete={(id) => setPosts(posts.filter(p => p.id !== id))}
                                                onEdit={(id, content) => setPosts(posts.map(p => p.id === id ? { ...p, content } : p))}
                                                onHashtagClick={(tag) => console.log(tag)}
                                                onViewImage={setFullScreenImage}
                                                onOpenComments={setActiveCommentsPostId}
                                                onViewProduct={setActiveProduct}
                                                onVideoClick={handleOpenReel}
                                                sharedPost={post.sharedPostId ? posts.find(p => p.id === post.sharedPostId) : undefined}
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            {view === 'groups' && (
                                <GroupsPage 
                                    currentUser={currentUser!}
                                    groups={groups}
                                    users={users}
                                    onCreateGroup={handleCreateGroup}
                                    onJoinGroup={handleJoinGroup}
                                    onLeaveGroup={handleLeaveGroup}
                                    onPostToGroup={handlePostToGroup}
                                    onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }}
                                />
                            )}

                            {/* --- MUSIC & PODCAST VIEWS --- */}
                            {view === 'music' && (
                                <MusicSystem 
                                    onPlayTrack={handlePlayTrack} 
                                    currentTrackId={currentAudioTrack?.id} 
                                    isPlaying={isAudioPlaying}
                                />
                            )}

                            {/* ... Other Views (Profile, Marketplace, Reels, Events, etc.) ... */}
                            {view === 'profile' && selectedUserId && (
                                <UserProfile 
                                    user={users.find(u => u.id === selectedUserId)!}
                                    currentUser={currentUser || INITIAL_USERS[0]}
                                    users={users}
                                    posts={posts}
                                    onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }}
                                    onFollow={handleFollow}
                                    onReact={handleReact}
                                    onComment={handleComment}
                                    onShare={(id) => setActiveSharePostId(id)}
                                    onMessage={(id) => setActiveChatUser(users.find(u => u.id === id) || null)}
                                    onCreatePost={handleCreatePost}
                                    onUpdateProfileImage={handleUpdateProfileImage}
                                    onUpdateCoverImage={handleUpdateCoverImage}
                                    onUpdateUserDetails={handleUpdateUserDetails}
                                    onDeletePost={(id) => setPosts(posts.filter(p => p.id !== id))}
                                    onEditPost={(id, content) => setPosts(posts.map(p => p.id === id ? { ...p, content } : p))}
                                    getCommentAuthor={(id) => users.find(u => u.id === id)}
                                    onViewImage={setFullScreenImage}
                                    onCreateEventClick={() => setShowCreateEventModal(true)}
                                    onOpenComments={setActiveCommentsPostId}
                                    onVideoClick={handleOpenReel}
                                />
                            )}
                            
                            {/* ... Marketplace, ReelsFeed, etc ... */}
                            {view === 'marketplace' && <MarketplacePage currentUser={currentUser} products={products} onNavigateHome={() => handleNavigate('home')} onCreateProduct={(pData) => { /* logic */ }} onViewProduct={setActiveProduct} />}
                            
                            {view === 'reels' && <ReelsFeed reels={reels} users={users} currentUser={currentUser || INITIAL_USERS[0]} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onCreateReelClick={() => setShowCreateReelModal(true)} onReact={(id, type) => {/*...*/}} onComment={(id, text) => {/*...*/}} onShare={(id, type) => {/*...*/}} onFollow={handleFollow} getCommentAuthor={(id) => users.find(u => u.id === id)} initialReelId={activeReelId} />}
                            
                            {view === 'events' && currentUser && <EventsPage events={events} currentUser={currentUser} onJoinEvent={(id) => {/*...*/}} onCreateEventClick={() => setShowCreateEventModal(true)} />}
                            {view === 'birthdays' && currentUser && <BirthdaysPage currentUser={currentUser} users={users} onMessage={(id) => setActiveChatUser(users.find(u => u.id === id) || null)} />}
                            {view === 'profiles' && currentUser && <SuggestedProfilesPage currentUser={currentUser} users={users} onFollow={handleFollow} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} />}
                        </div>

                        <div className="hidden md:block w-[360px] flex-shrink-0">
                             {currentUser && <RightSidebar contacts={users.filter(u => u.id !== currentUser.id && (u.followers.includes(currentUser.id) || u.following.includes(currentUser.id) || u.id === 0))} onProfileClick={(id) => setActiveChatUser(users.find(u => u.id === id) || null)} />}
                        </div>
                    </div>

                    {/* Global Audio Player */}
                    <GlobalAudioPlayer 
                        currentTrack={currentAudioTrack}
                        isPlaying={isAudioPlaying}
                        onTogglePlay={() => setIsAudioPlaying(!isAudioPlaying)}
                        onNext={() => { /* Mock Next */ }}
                        onPrevious={() => { /* Mock Prev */ }}
                        onClose={() => { setCurrentAudioTrack(null); setIsAudioPlaying(false); }}
                    />

                    {/* Modals & Overlays */}
                    {showCreatePostModal && currentUser && <CreatePostModal currentUser={currentUser} onClose={() => setShowCreatePostModal(false)} onCreatePost={handleCreatePost} onCreateEventClick={() => { setShowCreatePostModal(false); setShowCreateEventModal(true); }} />}
                    {showCreateEventModal && currentUser && <CreateEventModal currentUser={currentUser} onClose={() => setShowCreateEventModal(false)} onCreate={(e) => { const newEvent = { ...e, id: Date.now() } as Event; setEvents([...events, newEvent]); const newPost: PostType = { id: Date.now(), authorId: currentUser.id, content: `I created a new event: ${e.title}`, timestamp: 'Just now', reactions: [], comments: [], shares: 0, type: 'event', visibility: 'Public', eventId: newEvent.id, event: newEvent }; setPosts([newPost, ...posts]); }} />}
                    
                    {/* Update CreateReel to include new onSubmit signature */}
                    {showCreateReelModal && currentUser && <CreateReel currentUser={currentUser} onClose={() => setShowCreateReelModal(false)} onSubmit={(file, caption, song, effect, compressed) => { const newReel: Reel = { id: Date.now(), userId: currentUser.id, videoUrl: URL.createObjectURL(file), caption, songName: song, effectName: effect, reactions: [], comments: [], shares: 0, isCompressed: compressed }; setReels([newReel, ...reels]); }} />}

                    {activeCommentsPostId && <CommentsSheet post={posts.find(p => p.id === activeCommentsPostId)!} currentUser={currentUser || INITIAL_USERS[0]} onClose={() => setActiveCommentsPostId(null)} onComment={(id, text, attach) => handleComment(id, text, attach)} onLikeComment={(cid) => handleLikeComment(activeCommentsPostId, cid)} getCommentAuthor={(id) => users.find(u => u.id === id)} onProfileClick={(id) => { setActiveCommentsPostId(null); setSelectedUserId(id); setView('profile'); }} />}
                    {activeSharePostId && <ShareSheet onClose={() => setActiveSharePostId(null)} onShareNow={() => { /* logic */ }} onCopyLink={() => { setActiveSharePostId(null); alert("Link copied!"); }} />}
                    {activeStory && <StoryViewer story={activeStory} user={users.find(u => u.id === activeStory.userId)!} onClose={() => setActiveStory(null)} onNext={() => { setActiveStory(null); }} onPrev={() => { }} />}
                    {fullScreenImage && <ImageViewer imageUrl={fullScreenImage} onClose={() => setFullScreenImage(null)} />}
                    {activeProduct && <ProductDetailModal product={activeProduct} currentUser={currentUser} onClose={() => setActiveProduct(null)} onMessage={(sellerId) => { setActiveProduct(null); setActiveChatUser(users.find(u => u.id === sellerId) || null); }} />}
                    {activeChatUser && currentUser && <ChatWindow currentUser={currentUser} recipient={activeChatUser} messages={messages.filter(m => (m.senderId === currentUser.id && m.receiverId === activeChatUser.id) || (m.senderId === activeChatUser.id && m.receiverId === currentUser.id))} onClose={() => setActiveChatUser(null)} onSendMessage={(text) => setMessages([...messages, { id: Date.now(), senderId: currentUser.id, receiverId: activeChatUser.id, text, timestamp: Date.now() }])} />}
                    {showFullMenu && <MenuOverlay currentUser={currentUser} onClose={() => setShowFullMenu(false)} onNavigate={handleNavigate} onLogout={handleLogout} />}
                </div>
            )}
        </LanguageProvider>
    );
}

export default App;
