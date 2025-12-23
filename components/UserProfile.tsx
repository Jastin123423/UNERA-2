
import React, { useState, useRef, useEffect } from 'react';
import { User, Post as PostType, ReactionType, Reel, AudioTrack, Song, Episode, Group, Brand, LinkPreview, Product } from '../types';
import { CreatePost, Post, PostEditorModal } from './Feed';

// --- EDIT PROFILE MODAL ---
interface EditProfileModalProps {
    user: User;
    onClose: () => void;
    onSave: (updatedData: Partial<User>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
    const [bio, setBio] = useState(user.bio || '');
    const [work, setWork] = useState(user.work || '');
    const [education, setEducation] = useState(user.education || '');
    const [location, setLocation] = useState(user.location || '');
    const [website, setWebsite] = useState(user.website || '');
    
    const handleSave = () => {
        onSave({ bio, work, education, location, website });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="bg-[#242526] w-full max-w-[600px] rounded-xl border border-[#3E4042] shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-[#3E4042] flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#E4E6EB]">Edit Profile</h2>
                    <div onClick={onClose} className="w-8 h-8 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] flex items-center justify-center cursor-pointer">
                        <i className="fas fa-times text-[#B0B3B8]"></i>
                    </div>
                </div>
                <div className="p-4 overflow-y-auto space-y-4">
                    <div>
                        <label className="text-[#E4E6EB] font-bold text-sm">Bio</label>
                        <textarea className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-[#E4E6EB] outline-none focus:border-[#1877F2] text-center" rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Describe yourself..." />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-[#E4E6EB] font-bold text-lg">Details</h3>
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-[#B0B3B8]"><i className="fas fa-briefcase w-5 text-center"></i><span className="text-sm">Work</span></div>
                            <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={work} onChange={e => setWork(e.target.value)} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-[#B0B3B8]"><i className="fas fa-graduation-cap w-5 text-center"></i><span className="text-sm">Education</span></div>
                            <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={education} onChange={e => setEducation(e.target.value)} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-[#B0B3B8]"><i className="fas fa-map-marker-alt w-5 text-center"></i><span className="text-sm">Location</span></div>
                            <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={location} onChange={e => setLocation(e.target.value)} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-[#B0B3B8]"><i className="fas fa-link w-5 text-center"></i><span className="text-sm">Website</span></div>
                            <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={website} onChange={e => setWebsite(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-[#3E4042] bg-[#242526] rounded-b-xl">
                    <button onClick={handleSave} className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-2.5 rounded-lg font-bold shadow-md transition-colors">Save Details</button>
                </div>
            </div>
        </div>
    );
};

interface UserProfileProps {
    user: User;
    currentUser: User | null;
    users: User[];
    groups?: Group[];
    brands?: Brand[];
    posts: PostType[];
    reels?: Reel[]; 
    songs: Song[];
    episodes: Episode[];
    onProfileClick: (id: number) => void;
    onFollow: (id: number) => void;
    onReact: (postId: number, type: ReactionType) => void;
    onComment: (postId: number, text: string) => void;
    onShare: (postId: number) => void;
    onMessage: (id: number) => void;
    onCreatePost: (text: string, file: File | null, type: any, visibility: any, location?: string, feeling?: string, taggedUsers?: number[], background?: string, linkPreview?: LinkPreview) => void;
    onUpdateProfileImage: (file: File) => void;
    onUpdateCoverImage: (file: File) => void;
    onUpdateUserDetails: (data: Partial<User>) => void;
    onDeletePost: (postId: number) => void;
    onEditPost: (post: PostType) => void;
    getCommentAuthor: (id: number) => User | undefined;
    onViewImage: (url: string) => void;
    onCreateEventClick?: () => void;
    onCreateStoryClick?: () => void; 
    onOpenComments: (postId: number) => void;
    onVideoClick: (post: PostType) => void;
    onVerifyUser?: (id: number) => void;
    onRestrictUser?: (id: number, type: '24h' | '5d') => void;
    onDeleteUser?: (id: number) => void;
    onMakeModerator?: (id: number) => void;
    onPlayAudio?: (track: AudioTrack) => void; 
    onViewProduct?: (product: Product) => void;
    onJoinEvent?: (eventId: number) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
    user, currentUser, users, groups = [], brands = [], posts, reels = [], songs = [], episodes = [], 
    onProfileClick, onFollow, onReact, onComment, onShare, onMessage, onCreatePost, 
    onUpdateProfileImage, onUpdateCoverImage, onUpdateUserDetails, onDeletePost, onEditPost, 
    getCommentAuthor, onViewImage, onCreateEventClick, onCreateStoryClick, onOpenComments, 
    onVideoClick, onVerifyUser, onRestrictUser, onDeleteUser, onMakeModerator, onPlayAudio, 
    onViewProduct, onJoinEvent
}) => {
    const [activeTab, setActiveTab] = useState('Posts');
    const [showPostEditor, setShowPostEditor] = useState<'create' | null>(null);
    const [showEditProfile, setShowEditProfile] = useState(false);
    
    const userPosts = posts.filter(post => post.authorId === user.id);
    const userReels = reels.filter(reel => reel.userId === user.id);
    const userSongs = songs.filter(song => song.uploaderId === user.id);
    const userEpisodes = episodes.filter(ep => ep.uploaderId === user.id);
    
    const isCurrentUser = currentUser && user.id === currentUser.id;
    const isFollowing = currentUser ? user.followers.includes(currentUser.id) : false;
    const followerCount = user.followers.length;
    const followersList = users.filter(u => user.followers.includes(u.id));
    const profileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    
    const isAdmin = currentUser?.role === 'admin';

    const totalViews = userPosts.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalLikes = userPosts.reduce((acc, curr) => acc + curr.reactions.length, 0) + userReels.reduce((acc, curr) => acc + curr.reactions.length, 0);
    const totalEngagement = totalLikes + userPosts.reduce((acc, curr) => acc + curr.comments.length, 0);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'profile') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'cover') onUpdateCoverImage(e.target.files[0]);
            else onUpdateProfileImage(e.target.files[0]);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Music': return (
                <div className="bg-[#242526] p-6 rounded-xl border border-[#3E4042] mx-4 md:mx-0 shadow-sm animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Releases ({userSongs.length})</h2>
                        {isCurrentUser && <button className="text-[#1877F2] font-bold text-sm hover:underline">Add Music</button>}
                    </div>
                    {userSongs.length > 0 ? (
                        <div className="space-y-2">
                            {userSongs.map((song, idx) => (
                                <div key={song.id} className="flex items-center gap-4 p-3 hover:bg-[#3A3B3C] rounded-xl cursor-pointer transition-all group" onClick={() => onPlayAudio?.({ id: song.id, url: song.audioUrl, title: song.title, artist: song.artist, cover: song.cover, type: 'music', uploaderId: song.uploaderId, isVerified: user.isVerified })}>
                                    <div className="text-[#B0B3B8] font-bold w-4 text-center group-hover:hidden">{idx + 1}</div>
                                    <div className="hidden group-hover:block w-4 text-center text-[#1877F2]"><i className="fas fa-play"></i></div>
                                    <img src={song.cover} className="w-12 h-12 rounded-lg object-cover shadow-md" alt="" />
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="text-white font-bold truncate">{song.title}</h4>
                                        <p className="text-[#B0B3B8] text-xs font-medium">{song.stats.plays.toLocaleString()} streams</p>
                                    </div>
                                    <div className="text-[#B0B3B8] text-sm font-mono">{song.duration}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <i className="fas fa-music text-4xl text-[#B0B3B8] mb-4"></i>
                            <p className="text-[#B0B3B8]">No tracks released yet.</p>
                        </div>
                    )}
                </div>
            );
            case 'Podcast': return (
                <div className="bg-[#242526] p-6 rounded-xl border border-[#3E4042] mx-4 md:mx-0 shadow-sm animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Podcast Episodes ({userEpisodes.length})</h2>
                        {isCurrentUser && <button className="text-[#1877F2] font-bold text-sm hover:underline">New Episode</button>}
                    </div>
                    {userEpisodes.length > 0 ? (
                        <div className="space-y-4">
                            {userEpisodes.map(ep => (
                                <div key={ep.id} className="flex gap-4 p-4 bg-[#18191A] rounded-2xl border border-[#3E4042] hover:border-[#1877F2]/50 transition-colors cursor-pointer group" onClick={() => onPlayAudio?.({ id: ep.id, url: ep.audioUrl, title: ep.title, artist: ep.host || user.name, cover: ep.thumbnail, type: 'podcast', uploaderId: ep.uploaderId, isVerified: user.isVerified })}>
                                    <div className="w-24 h-24 flex-shrink-0 relative">
                                        <img src={ep.thumbnail} className="w-full h-full object-cover rounded-xl shadow-lg" alt="" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                            <i className="fas fa-play text-white text-xl"></i>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-bold text-lg mb-1 truncate">{ep.title}</h4>
                                        <p className="text-[#B0B3B8] text-sm line-clamp-2 mb-2">{ep.description}</p>
                                        <div className="flex items-center gap-3 text-[#B0B3B8] text-[12px] font-bold">
                                            <span>{ep.date}</span>
                                            <span>•</span>
                                            <span>{ep.duration}</span>
                                            <span>•</span>
                                            <span className="text-[#1877F2]">{ep.stats.plays.toLocaleString()} plays</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <i className="fas fa-microphone text-4xl text-[#B0B3B8] mb-4"></i>
                            <p className="text-[#B0B3B8]">No podcast episodes available.</p>
                        </div>
                    )}
                </div>
            );
            case 'About': return (
                <div className="bg-[#242526] p-6 text-[#E4E6EB] rounded-xl border border-[#3E4042] mx-4 md:mx-0 shadow-sm animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">About</h2>
                        {isCurrentUser && <button onClick={() => setShowEditProfile(true)} className="text-[#1877F2] font-semibold hover:underline">Edit</button>}
                    </div>
                    <p className="text-[#B0B3B8] text-lg italic mb-8">"{user.bio || 'No bio available'}"</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[15px]">
                        <div className="flex flex-col gap-5">
                            <h3 className="text-xl font-bold border-b border-[#3E4042] pb-2">Work & Education</h3>
                            <div className="flex items-center gap-4"><i className="fas fa-briefcase text-[#B0B3B8] text-xl w-6"></i><span>{user.work || 'No workplace to show'}</span></div>
                            <div className="flex items-center gap-4"><i className="fas fa-graduation-cap text-[#B0B3B8] text-xl w-6"></i><span>{user.education || 'No schools to show'}</span></div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <h3 className="text-xl font-bold border-b border-[#3E4042] pb-2">Contact & Info</h3>
                            <div className="flex items-center gap-4"><i className="fas fa-map-marker-alt text-[#B0B3B8] text-xl w-6"></i><span>{user.location || 'No location'}</span></div>
                            <div className="flex items-center gap-4"><i className="fas fa-venus-mars text-[#B0B3B8] text-xl w-6"></i><span>{user.gender || 'Not specified'}</span></div>
                        </div>
                    </div>
                </div>
            );
            case 'Followers': return (
                <div className="bg-[#242526] p-6 rounded-xl border border-[#3E4042] mx-4 md:mx-0 shadow-sm animate-fade-in">
                    <h2 className="text-xl font-bold text-[#E4E6EB] mb-6">Followers ({followerCount})</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {followersList.length > 0 ? followersList.map(follower => (
                            <div key={follower.id} className="flex items-center gap-4 p-4 border border-[#3E4042] rounded-2xl hover:bg-[#3A3B3C] cursor-pointer transition-colors" onClick={() => onProfileClick(follower.id)}>
                                <img src={follower.profileImage} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                                <div><h4 className="font-bold text-[#E4E6EB] text-lg leading-tight">{follower.name}</h4><span className="text-[#B0B3B8] text-sm">{follower.location}</span></div>
                            </div>
                        )) : <p className="text-[#B0B3B8]">No followers yet.</p>}
                    </div>
                </div>
            );
            case 'Photos': return (
                <div className="bg-[#242526] p-6 rounded-xl border border-[#3E4042] mx-4 md:mx-0 shadow-sm animate-fade-in">
                    <h2 className="text-xl font-bold text-[#E4E6EB] mb-6">Photos</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {userPosts.filter(p => p.type === 'image' && p.image).map(p => (
                            <div key={p.id} className="aspect-square cursor-pointer overflow-hidden rounded-xl group relative" onClick={() => p.image && onViewImage(p.image)}>
                                <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            );
            case 'Posts': default: return (
                <div className="max-w-[1095px] mx-auto w-full flex flex-col md:flex-row gap-4 px-0 md:px-4 mt-4 animate-fade-in">
                    <div className="w-full md:w-[380px] flex-shrink-0 flex flex-col gap-4 px-4 md:px-0">
                        {isAdmin && !isCurrentUser && (
                            <div className="bg-[#242526] rounded-xl p-4 shadow-md border border-red-900/40">
                                <h2 className="text-xl font-bold text-red-500 mb-4">Admin Controls</h2>
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => onVerifyUser && onVerifyUser(user.id)} className="w-full bg-[#263951] text-[#2D88FF] py-2.5 rounded-xl font-bold hover:bg-[#2A3F5A] transition-all">Verify User</button>
                                    <button onClick={() => onDeleteUser && onDeleteUser(user.id)} className="w-full bg-red-900/60 text-white py-2.5 rounded-xl font-bold hover:bg-red-800 transition-all">Delete User</button>
                                </div>
                            </div>
                        )}
                        <div className="bg-[#242526] rounded-xl p-6 shadow-sm border border-[#3E4042]">
                            <h2 className="text-xl font-bold text-[#E4E6EB] mb-4">Intro</h2>
                            <p className="text-[#E4E6EB] text-center text-[16px] mb-4">{user.bio}</p>
                            <div className="space-y-4 text-[15px]">
                                {user.work && <div className="flex items-center gap-3"><i className="fas fa-briefcase text-[#B0B3B8] w-6 text-center"></i><span>Works at <strong>{user.work}</strong></span></div>}
                                {user.location && <div className="flex items-center gap-3"><i className="fas fa-map-marker-alt text-[#B0B3B8] w-6 text-center"></i><span>Lives in <strong>{user.location}</strong></span></div>}
                                <div className="flex items-center gap-3"><i className="fas fa-rss text-[#B0B3B8] w-6 text-center"></i><span>Followed by <strong>{followerCount}</strong> people</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        {isCurrentUser && (
                            <div className="bg-[#242526] rounded-xl p-5 mb-4 border border-[#3E4042] shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-[#E4E6EB] font-bold text-xl">Dashboard</h2>
                                    <span className="text-[#B0B3B8] text-xs font-bold uppercase tracking-wider">Stats</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#18191A] p-4 rounded-2xl border border-[#3E4042] shadow-inner">
                                        <div className="text-[#B0B3B8] text-xs font-bold uppercase mb-2">Total Reach</div>
                                        <div className="text-2xl font-black text-white">{totalViews.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-[#18191A] p-4 rounded-2xl border border-[#3E4042] shadow-inner">
                                        <div className="text-[#B0B3B8] text-xs font-bold uppercase mb-2">Engagement</div>
                                        <div className="text-2xl font-black text-white">{totalEngagement.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isCurrentUser && <CreatePost currentUser={currentUser} onProfileClick={onProfileClick} onClick={() => setShowPostEditor('create')} onCreateEventClick={onCreateEventClick} />}
                        {userPosts.map(post => (
                            <Post key={post.id} post={post} author={user} currentUser={currentUser} users={users} onProfileClick={onProfileClick} onReact={onReact} onShare={onShare} onDelete={onDeletePost} onEdit={onEditPost} onViewImage={onViewImage} onOpenComments={onOpenComments} onVideoClick={onVideoClick} onPlayAudio={onPlayAudio} onViewProduct={onViewProduct} onJoinEvent={onJoinEvent} />
                        ))}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="w-full bg-[#18191A] min-h-screen">
            <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'profile')} />
            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} />
            <div className="bg-[#242526] shadow-md">
                <div className="max-w-[1100px] mx-auto w-full relative">
                    <div className="h-[220px] md:h-[380px] w-full bg-gray-800 relative group overflow-hidden md:rounded-b-2xl shadow-xl">
                        {user.coverImage ? <img src={user.coverImage} alt="" className="w-full h-full object-cover" onClick={() => user.coverImage && onViewImage(user.coverImage)} /> : <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900"></div>}
                        {isCurrentUser && (
                            <div className="absolute bottom-6 right-6 bg-white text-black px-5 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 font-bold text-sm flex items-center gap-3 shadow-2xl transition-all" onClick={() => coverInputRef.current?.click()}>
                                <i className="fas fa-camera text-lg"></i> <span className="hidden sm:block">Edit Cover Photo</span>
                            </div>
                        )}
                    </div>
                    <div className="px-6 pb-0">
                        <div className="flex flex-col md:flex-row items-center md:items-end -mt-[90px] md:-mt-[40px] relative z-10 mb-6 gap-6">
                            <div className="relative group">
                                <div className="w-[168px] h-[168px] rounded-full border-[6px] border-[#242526] bg-[#242526] overflow-hidden cursor-pointer shadow-2xl">
                                    <img src={user.profileImage} alt="" className="w-full h-full object-cover" onClick={() => onViewImage(user.profileImage)} />
                                    {isCurrentUser && (
                                        <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded-full" onClick={() => profileInputRef.current?.click()}>
                                            <i className="fas fa-camera text-white text-4xl"></i>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                                <h1 className="text-[34px] font-black text-white leading-tight flex items-center gap-3">
                                    {user.name} 
                                    {user.isVerified && <i className="fas fa-check-circle text-[#1877F2] text-[24px]"></i>}
                                </h1>
                                <span className="text-[#B0B3B8] font-bold text-lg mt-1">{followerCount} Followers</span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 md:mt-0 mb-4">
                                {isCurrentUser ? (
                                    <>
                                        <button onClick={onCreateStoryClick} className="bg-[#1877F2] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#166FE5] transition-all text-sm shadow-lg">
                                            <i className="fas fa-plus-circle text-lg"></i><span>Add to Story</span>
                                        </button>
                                        <button className="bg-[#3A3B3C] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4E4F50] transition-all text-sm shadow-md" onClick={() => setShowEditProfile(true)}>
                                            <i className="fas fa-pen"></i><span>Edit Profile</span>
                                        </button>
                                    </>
                                ) : (
                                    currentUser && (
                                        <div className="flex gap-2">
                                            <button onClick={() => onFollow(user.id)} className={`${isFollowing ? 'bg-[#3A3B3C] text-white' : 'bg-[#1877F2] text-white'} px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md`}>
                                                <i className={`fas ${isFollowing ? 'fa-user-check' : 'fa-user-plus'}`}></i><span>{isFollowing ? 'Following' : 'Follow'}</span>
                                            </button>
                                            <button onClick={() => onMessage(user.id)} className="bg-[#3A3B3C] text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#4E4F50] transition-all shadow-md">
                                                <i className="fab fa-facebook-messenger"></i><span>Message</span>
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="h-[1px] bg-[#3E4042] w-full mt-4 opacity-50"></div>
                        <div className="flex items-center gap-2 pt-2 overflow-x-auto scrollbar-hide">
                            {['Posts', 'About', 'Followers', 'Photos', 'Music', 'Podcast'].map((tab) => (
                                <div key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-4 cursor-pointer whitespace-nowrap text-[15px] font-bold border-b-[3px] transition-all ${activeTab === tab ? 'text-[#1877F2] border-[#1877F2]' : 'text-[#B0B3B8] border-transparent hover:bg-[#3A3B3C] rounded-t-xl'}`}>
                                    {tab}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {renderContent()}
            {showEditProfile && isCurrentUser && <EditProfileModal user={user} onClose={() => setShowEditProfile(false)} onSave={onUpdateUserDetails} />}
            {showPostEditor === 'create' && currentUser && <PostEditorModal currentUser={currentUser} users={users} onClose={() => setShowPostEditor(null)} onCreatePost={onCreatePost} onCreateEventClick={onCreateEventClick} />}
        </div>
    );
};
