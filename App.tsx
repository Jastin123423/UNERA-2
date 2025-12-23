
import React, { useState, useEffect } from 'react';
import { AuthContainer } from './components/Auth';
import { Header, Sidebar, RightSidebar } from './components/Layout';
import { Post, CreatePost, CreatePostModal } from './components/Feed';
import { StoryReel } from './components/Story';
import { UserProfile } from './components/UserProfile';
import { ImageViewer } from './components/Common';
import { MarketplacePage } from './components/Marketplace';
import { ReelsFeed } from './components/Reels';
import { EventsPage } from './components/EventsPage';
import { GroupsPage } from './components/Groups';
import { BrandsPage } from './components/Brands';
import { ProfilesPage } from './components/Profiles';
import { MusicSystem, GlobalAudioPlayer } from './components/MusicSystem';
import { ToolsPage } from './components/Tools';
import { User, Post as PostType, Story, Reel, Event, Group, Brand, Song, Episode, AudioTrack } from './types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_STORIES, INITIAL_REELS, INITIAL_EVENTS, INITIAL_GROUPS, INITIAL_BRANDS, MOCK_SONGS, MOCK_EPISODES } from './constants';

export default function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [posts, setPosts] = useState<PostType[]>(INITIAL_POSTS);
    const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
    const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
    const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
    const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
    const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
    const [songs, setSongs] = useState<Song[]>(MOCK_SONGS);
    const [episodes, setEpisodes] = useState<Episode[]>(MOCK_EPISODES);
    
    const [view, setView] = useState('home');
    const [isLoading, setIsLoading] = useState(true);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [activeAudioTrack, setActiveAudioTrack] = useState<AudioTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('unera_user');
        if (stored) {
            try { setCurrentUser(JSON.parse(stored)); } catch (e) { localStorage.removeItem('unera_user'); }
        }
        setTimeout(() => setIsLoading(false), 800);
    }, []);

    const handlePostCreated = (content: string, file: File | null) => {
        const localPost: PostType = {
            id: Date.now(),
            authorId: currentUser?.id || 0,
            content,
            image: file ? URL.createObjectURL(file) : undefined,
            timestamp: 'Just now',
            createdAt: Date.now(),
            reactions: [],
            comments: [],
            shares: 0,
            views: 0,
            type: file ? 'image' : 'text',
            visibility: 'Public'
        };
        setPosts([localPost, ...posts]);
        setShowCreatePostModal(false);
    };

    const handleLogin = (email: string, pass: string) => {
        const user = users.find(u => u.email === email && u.password === pass);
        if (user) {
            setCurrentUser(user);
            localStorage.setItem('unera_user', JSON.stringify(user));
            setView('home');
        } else { alert("Invalid credentials"); }
    };

    const handleNavigate = (target: string) => { setView(target); window.scrollTo(0, 0); };

    if (isLoading) return <div className="min-h-screen bg-[#18191A] flex flex-col items-center justify-center"><i className="fas fa-globe-americas text-6xl text-[#1877F2] animate-spin mb-4"></i><h2 className="text-white font-black tracking-tight text-xl uppercase">UNERA</h2></div>;

    if (!currentUser && view === 'login') return <AuthContainer onLogin={handleLogin} onRegister={() => {}} onClose={() => setView('home')} loginError="" />;

    return (
        <div className="min-h-screen bg-[#18191A] text-[#E4E6EB] font-sans">
            <Header onHomeClick={() => setView('home')} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onReelsClick={() => setView('reels')} onMarketplaceClick={() => setView('marketplace')} onGroupsClick={() => setView('groups')} currentUser={currentUser} notifications={[]} users={users} onLogout={() => { setCurrentUser(null); localStorage.removeItem('unera_user'); }} onLoginClick={() => setView('login')} onMarkNotificationsRead={() => {}} activeTab={view} onNavigate={handleNavigate} />
            <main className="flex justify-center pt-0 sm:pt-4">
                {view === 'home' && (
                    <div className="flex w-full max-w-[1440px] px-0 sm:px-4">
                        <Sidebar currentUser={currentUser} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onReelsClick={() => setView('reels')} onMarketplaceClick={() => setView('marketplace')} onGroupsClick={() => setView('groups')} onBrandsClick={() => setView('brands')} onEventsClick={() => setView('events')} />
                        <div className="flex-1 max-w-[680px]">
                            <div className="px-4 sm:px-0">
                                <StoryReel stories={stories} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onViewStory={() => {}} currentUser={currentUser} onRequestLogin={() => setView('login')} />
                                <CreatePost currentUser={currentUser} onClick={() => setShowCreatePostModal(true)} />
                            </div>
                            <div className="space-y-4 pb-20">
                                {posts.map(post => (
                                    <Post key={post.id} post={post} author={users.find(u => u.id === post.authorId) || users[0]} currentUser={currentUser} onViewImage={setFullScreenImage} onOpenComments={() => {}} onFollow={() => {}} onProfileClick={(id: number) => { setSelectedUserId(id); setView('profile'); }} onReact={() => {}} onShare={() => {}} />
                                ))}
                            </div>
                        </div>
                        <RightSidebar contacts={users.filter(u => u.id !== currentUser?.id)} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} />
                    </div>
                )}
                {view === 'profile' && selectedUserId !== null && (
                    <UserProfile user={users.find(u => u.id === selectedUserId) || users[0]} currentUser={currentUser} users={users} posts={posts} songs={songs} episodes={episodes} onProfileClick={setSelectedUserId} onFollow={() => {}} onReact={() => {}} onComment={() => {}} onShare={() => {}} onMessage={() => {}} onCreatePost={handlePostCreated} onUpdateProfileImage={() => {}} onUpdateCoverImage={() => {}} onUpdateUserDetails={() => {}} onDeletePost={() => {}} onEditPost={() => {}} getCommentAuthor={(id) => users.find(u => u.id === id)} onViewImage={setFullScreenImage} onOpenComments={() => {}} onVideoClick={() => {}} />
                )}
                {view === 'reels' && <ReelsFeed reels={reels} users={users} currentUser={currentUser} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onCreateReelClick={() => {}} onReact={() => {}} onComment={() => {}} onShare={() => {}} onFollow={() => {}} getCommentAuthor={(id) => users.find(u => u.id === id)} />}
                {view === 'marketplace' && <MarketplacePage currentUser={currentUser} products={[]} onNavigateHome={() => setView('home')} onCreateProduct={() => {}} onViewProduct={() => {}} />}
                {view === 'groups' && <GroupsPage currentUser={currentUser} groups={groups} users={users} onCreateGroup={() => {}} onJoinGroup={() => {}} onLeaveGroup={() => {}} onDeleteGroup={() => {}} onUpdateGroupImage={() => {}} onPostToGroup={() => {}} onCreateGroupEvent={() => {}} onInviteToGroup={() => {}} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onLikePost={() => {}} onOpenComments={() => {}} onSharePost={() => {}} onDeleteGroupPost={() => {}} onRemoveMember={() => {}} onRestrictMember={() => {}} onUpdateGroupSettings={() => {}} />}
                {view === 'music' && <MusicSystem currentUser={currentUser} songs={songs} episodes={episodes} onUpdateSongs={setSongs} onUpdateEpisodes={setEpisodes} onPlayTrack={setActiveAudioTrack} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(!isPlaying)} onFeedPost={() => {}} />}
                {view === 'tools' && <ToolsPage />}
                {view === 'events' && <EventsPage events={events} currentUser={currentUser} onJoinEvent={() => {}} onCreateEventClick={() => {}} />}
                {view === 'profiles' && <ProfilesPage currentUser={currentUser} users={users} groups={groups} brands={brands} onFollowUser={() => {}} onJoinGroup={() => {}} onFollowBrand={() => {}} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onGroupClick={(g) => { setView('groups'); }} onBrandClick={() => setView('brands')} />}
                {view === 'brands' && <BrandsPage currentUser={currentUser} brands={brands} posts={posts} users={users} onCreateBrand={() => {}} onFollowBrand={() => {}} onProfileClick={(id) => { setSelectedUserId(id); setView('profile'); }} onPostAsBrand={() => {}} onReact={() => {}} onShare={() => {}} onOpenComments={() => {}} />}
            </main>
            <GlobalAudioPlayer currentTrack={activeAudioTrack} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(!isPlaying)} onNext={() => {}} onPrevious={() => {}} onClose={() => setActiveAudioTrack(null)} onDownload={() => {}} onLike={() => {}} isLiked={false} />
            {showCreatePostModal && currentUser && <CreatePostModal currentUser={currentUser} onClose={() => setShowCreatePostModal(false)} onCreatePost={handlePostCreated} />}
            {fullScreenImage && <ImageViewer imageUrl={fullScreenImage} onClose={() => setFullScreenImage(null)} />}
        </div>
    );
}
