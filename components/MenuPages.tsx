
import React, { useState, useEffect } from 'react';
import { User, Event, Group, Product, Post as PostType } from '../types';
import { MARKETPLACE_COUNTRIES } from '../constants';
import { Post } from './Feed';

// --- SUGGESTED PROFILES PAGE (Now DISCOVERY PAGE) ---
interface SuggestedProfilesPageProps {
    currentUser: User | null;
    users: User[];
    groups?: Group[];
    products?: Product[];
    events?: Event[];
    onFollow: (id: number) => void;
    onProfileClick: (id: number) => void;
    onJoinGroup?: (groupId: string) => void;
    onJoinEvent?: (eventId: number) => void;
    onViewProduct?: (product: Product) => void;
}

export const SuggestedProfilesPage: React.FC<SuggestedProfilesPageProps> = ({ 
    currentUser, users, groups = [], products = [], events = [], 
    onFollow, onProfileClick, onJoinGroup, onJoinEvent, onViewProduct 
}) => {
    // State to track dismissed/interacted items to simulate "removing" them
    const [hiddenUserIds, setHiddenUserIds] = useState<number[]>([]);
    const [hiddenGroupIds, setHiddenGroupIds] = useState<string[]>([]);
    const [hiddenEventIds, setHiddenEventIds] = useState<number[]>([]);
    const [hiddenProductIds, setHiddenProductIds] = useState<number[]>([]);

    // Logic to find suggestions
    // Filter out already following, self, admin, and hidden
    const availableUsers = users.filter(u => {
        if (currentUser && u.id === currentUser.id) return false; 
        if (currentUser && currentUser.following.includes(u.id)) return false; 
        if (u.id === 0) return false; 
        if (hiddenUserIds.includes(u.id)) return false;
        return true;
    }).map(u => {
        let score = 0;
        let reason = "Suggested for you";
        if(currentUser && u.location === currentUser.location) score += 5;
        return { user: u, score, reason };
    }).sort((a, b) => b.score - a.score);

    // Filter Groups
    const availableGroups = groups.filter(g => (!currentUser || !g.members.includes(currentUser.id)) && !hiddenGroupIds.includes(g.id));
    
    // Filter Events
    const availableEvents = events.filter(e => !hiddenEventIds.includes(e.id)); // Assuming simple hide logic, real app would check interest

    // Filter Products
    const availableProducts = products.filter(p => !hiddenProductIds.includes(p.id));

    // Display limited number, rotate if hidden
    const displayedUsers = availableUsers.slice(0, 5);
    const displayedGroups = availableGroups.slice(0, 5);
    const displayedEvents = availableEvents.slice(0, 3);
    const displayedProducts = availableProducts.slice(0, 5);

    const handleFollow = (id: number) => {
        if (!currentUser) {
            alert("Please login to follow.");
            return;
        }
        onFollow(id);
        setHiddenUserIds(prev => [...prev, id]);
    };

    const handleJoinGroup = (id: string) => {
        if (!currentUser) {
            alert("Please login to join groups.");
            return;
        }
        if(onJoinGroup) onJoinGroup(id);
        setHiddenGroupIds(prev => [...prev, id]);
    };

    const handleInterestedEvent = (id: number) => {
        if (!currentUser) {
            alert("Please login.");
            return;
        }
        if(onJoinEvent) onJoinEvent(id);
        setHiddenEventIds(prev => [...prev, id]);
    };

    const handleViewProduct = (p: Product) => {
        if(onViewProduct) onViewProduct(p);
        setHiddenProductIds(prev => [...prev, p.id]);
    };

    return (
        <div className="w-full max-w-[700px] mx-auto p-4 font-sans pb-20">
            <h2 className="text-2xl font-bold text-[#E4E6EB] mb-4">Discover People & Communities</h2>
            
            {/* Groups Suggestions */}
            {displayedGroups.length > 0 && (
                <div className="mb-8 animate-fade-in">
                    <h3 className="text-xl font-bold text-[#E4E6EB] mb-3">Groups you might like</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {displayedGroups.map(group => (
                            <div key={group.id} className="min-w-[250px] bg-[#242526] rounded-xl border border-[#3E4042] overflow-hidden flex flex-col">
                                <div className="h-24 relative">
                                    <img src={group.coverImage} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-bold uppercase">{group.type}</div>
                                </div>
                                <div className="p-3 flex flex-col flex-1">
                                    <h4 className="font-bold text-[#E4E6EB] mb-1 truncate">{group.name}</h4>
                                    <p className="text-[#B0B3B8] text-xs mb-3 line-clamp-2">{group.description}</p>
                                    <div className="mt-auto">
                                        <button onClick={() => handleJoinGroup(group.id)} className="w-full bg-[#263951] text-[#2D88FF] py-1.5 rounded-lg font-bold text-sm hover:bg-[#2A3F5A] transition-colors">Join Group</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* People Suggestions */}
            <h3 className="text-xl font-bold text-[#E4E6EB] mb-3">People you may know</h3>
            {displayedUsers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-fade-in">
                    {displayedUsers.map(({ user, reason }) => (
                        <div key={user.id} className="bg-[#242526] rounded-xl border border-[#3E4042] overflow-hidden flex flex-col shadow-sm">
                            <div className="h-24 bg-gradient-to-r from-blue-900 to-slate-900 relative">
                                 {user.coverImage && <img src={user.coverImage} className="w-full h-full object-cover opacity-60" alt="" />}
                                 <div className="absolute -bottom-8 left-4">
                                     <img src={user.profileImage} className="w-16 h-16 rounded-full border-4 border-[#242526] object-cover bg-[#242526]" alt="" />
                                 </div>
                            </div>
                            <div className="pt-10 px-4 pb-4 flex-1 flex flex-col">
                                <div onClick={() => onProfileClick(user.id)} className="cursor-pointer">
                                    <h3 className="text-[#E4E6EB] font-bold text-lg hover:underline flex items-center gap-1">{user.name}</h3>
                                </div>
                                <p className="text-[#B0B3B8] text-sm mb-4 line-clamp-2">{reason}</p>
                                <div className="mt-auto">
                                    <button onClick={() => handleFollow(user.id)} className="w-full bg-[#1877F2] text-white py-2 rounded-lg font-semibold hover:bg-[#166FE5] transition-colors">Follow</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p className="text-[#B0B3B8] mb-8">No more suggestions right now.</p>}

            {/* Events Suggestions */}
            {displayedEvents.length > 0 && (
                <div className="mb-8 animate-fade-in">
                    <h3 className="text-xl font-bold text-[#E4E6EB] mb-3">Upcoming Events</h3>
                    <div className="flex flex-col gap-3">
                        {displayedEvents.map(event => (
                            <div key={event.id} className="bg-[#242526] p-3 rounded-xl border border-[#3E4042] flex gap-3 items-center">
                                <div className="w-16 h-16 bg-[#3A3B3C] rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                                    <span className="text-red-500 font-bold text-xs uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-[#E4E6EB] font-bold text-xl">{new Date(event.date).getDate()}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-[#E4E6EB] font-bold">{event.title}</h4>
                                    <p className="text-[#B0B3B8] text-sm">{event.time} • {event.location}</p>
                                    <div className="text-xs text-[#1877F2] mt-1">{event.interestedIds?.length || 0} interested</div>
                                </div>
                                <button onClick={() => handleInterestedEvent(event.id)} className="px-4 py-1.5 border border-[#B0B3B8] text-[#E4E6EB] rounded-lg font-bold text-sm hover:bg-[#3A3B3C]">Interested</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

             {/* Products Suggestions */}
             {displayedProducts.length > 0 && (
                <div className="mb-8 animate-fade-in">
                    <h3 className="text-xl font-bold text-[#E4E6EB] mb-3">Popular Products</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {displayedProducts.map(p => (
                            <div key={p.id} className="bg-[#242526] rounded-xl border border-[#3E4042] overflow-hidden cursor-pointer" onClick={() => handleViewProduct(p)}>
                                <div className="aspect-square bg-white relative">
                                    <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute bottom-0 left-0 bg-black/60 px-2 py-1 text-white font-bold text-sm">
                                        {MARKETPLACE_COUNTRIES.find(c => c.code === p.country)?.symbol || '$'}{p.mainPrice}
                                    </div>
                                </div>
                                <div className="p-2">
                                    <h4 className="text-[#E4E6EB] text-sm truncate font-medium">{p.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

interface BirthdaysPageProps { 
    currentUser: User; 
    users: User[]; 
    onMessage: (id: number) => void; 
}

export const BirthdaysPage: React.FC<BirthdaysPageProps> = ({ currentUser, users, onMessage }) => {
    // Simulate birthday logic (mocking some users having birthdays today)
    const today = new Date();
    const birthdaysToday = users.filter(u => u.id !== currentUser.id && u.id % 5 === 0); // Mock logic
    const upcomingBirthdays = users.filter(u => u.id !== currentUser.id && u.id % 5 !== 0).slice(0, 5);

    return (
        <div className="w-full max-w-[700px] mx-auto p-4 font-sans pb-20 animate-fade-in">
            <h1 className="text-2xl font-bold text-[#E4E6EB] mb-6 flex items-center gap-2">
                <i className="fas fa-birthday-cake text-[#F02849]"></i> Birthdays
            </h1>

            {birthdaysToday.length > 0 ? (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-[#E4E6EB] mb-3">Today's Birthdays</h3>
                    <div className="flex flex-col gap-4">
                        {birthdaysToday.map(user => (
                            <div key={user.id} className="bg-[#242526] p-4 rounded-xl border border-[#3E4042] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={user.profileImage} className="w-12 h-12 rounded-full object-cover" alt="" />
                                    <div>
                                        <h4 className="text-[#E4E6EB] font-bold">{user.name}</h4>
                                        <p className="text-[#B0B3B8] text-sm">Turning {20 + user.id} years old</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onMessage(user.id)}
                                    className="bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#E4E6EB] px-4 py-2 rounded-lg font-bold transition-colors"
                                >
                                    Wish Happy Birthday
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-[#242526] p-6 rounded-xl border border-[#3E4042] text-center mb-8">
                    <i className="fas fa-calendar-times text-4xl text-[#B0B3B8] mb-3"></i>
                    <p className="text-[#E4E6EB] font-medium">No birthdays today.</p>
                </div>
            )}

            <div>
                <h3 className="text-lg font-bold text-[#B0B3B8] mb-3 uppercase tracking-wide text-sm">Upcoming Birthdays</h3>
                <div className="bg-[#242526] rounded-xl border border-[#3E4042] overflow-hidden">
                    {upcomingBirthdays.map((user, idx) => (
                        <div key={user.id} className={`flex items-center justify-between p-4 ${idx !== upcomingBirthdays.length - 1 ? 'border-b border-[#3E4042]' : ''}`}>
                            <div className="flex items-center gap-3">
                                <img src={user.profileImage} className="w-10 h-10 rounded-full object-cover" alt="" />
                                <div>
                                    <h4 className="text-[#E4E6EB] font-bold text-sm">{user.name}</h4>
                                    <p className="text-[#B0B3B8] text-xs">Born in September</p>
                                </div>
                            </div>
                            <div className="text-[#B0B3B8] text-xs font-bold bg-[#3A3B3C] px-2 py-1 rounded">
                                {2 + idx} days left
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MEMORIES PAGE ---
interface MemoriesPageProps {
    currentUser: User;
    posts: PostType[];
    users: User[];
}

export const MemoriesPage: React.FC<MemoriesPageProps> = ({ currentUser, posts, users }) => {
    // Filter posts that are not "Just now" to simulate old memories
    const memories = posts.filter(p => p.timestamp !== 'Just now' && p.timestamp !== '10m');

    return (
        <div className="w-full max-w-[700px] mx-auto pb-20 font-sans">
            <div className="bg-[#242526] p-4 mb-4 border-b border-[#3E4042] sticky top-14 z-10">
                <h1 className="text-2xl font-bold text-[#E4E6EB]">Memories</h1>
                <p className="text-[#B0B3B8] text-sm">We hope you enjoy looking back and sharing your memories.</p>
            </div>
            
            <div className="flex flex-col gap-4">
                {memories.length > 0 ? memories.map(post => {
                    const author = users.find(u => u.id === post.authorId);
                    if (!author) return null;
                    return (
                        <div key={post.id} className="w-full">
                            <div className="px-4 py-2 text-[#B0B3B8] font-bold text-sm uppercase">On This Day</div>
                            <Post 
                                post={post}
                                author={author}
                                currentUser={currentUser}
                                users={users}
                                onProfileClick={() => {}}
                                onReact={() => {}}
                                onShare={() => {}}
                                onVideoClick={() => {}}
                                onViewImage={() => {}}
                                onOpenComments={() => {}}
                            />
                        </div>
                    );
                }) : (
                    <div className="p-8 text-center text-[#B0B3B8]">
                        <i className="fas fa-history text-4xl mb-3"></i>
                        <p>No memories to show today.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SETTINGS PAGE ---
interface SettingsPageProps {
    currentUser: User | null;
    onUpdateUser: (data: Partial<User>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onUpdateUser }) => {
    const [activeSection, setActiveSection] = useState<'main' | 'details' | 'security'>('main');
    
    // Personal Details Form
    const [name, setName] = useState(currentUser?.name || '');
    const [bio, setBio] = useState(currentUser?.bio || '');
    const [location, setLocation] = useState(currentUser?.location || '');
    const [work, setWork] = useState(currentUser?.work || '');

    // Security Form
    const [email, setEmail] = useState(currentUser?.email || '');
    const [password, setPassword] = useState(currentUser?.password || '');

    if (!currentUser) return <div className="p-8 text-center text-[#B0B3B8]">Please login to access settings.</div>;

    const handleSaveDetails = () => {
        onUpdateUser({ name, bio, location, work });
        alert("Details updated successfully!");
        setActiveSection('main');
    };

    const handleSaveSecurity = () => {
        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }
        onUpdateUser({ email, password });
        alert("Security settings updated!");
        setActiveSection('main');
    };

    if (activeSection === 'details') {
        return (
            <div className="w-full max-w-[600px] mx-auto p-4 text-[#E4E6EB] animate-fade-in">
                <button onClick={() => setActiveSection('main')} className="mb-4 text-[#B0B3B8] hover:text-white flex items-center gap-2"><i className="fas fa-arrow-left"></i> Back</button>
                <h2 className="text-2xl font-bold mb-6">Personal Details</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">Full Name</label>
                        <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">Bio</label>
                        <textarea className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={bio} onChange={e => setBio(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">Location</label>
                        <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={location} onChange={e => setLocation(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">Work</label>
                        <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={work} onChange={e => setWork(e.target.value)} />
                    </div>
                    <button onClick={handleSaveDetails} className="w-full bg-[#1877F2] py-3 rounded-lg font-bold mt-4">Save Changes</button>
                </div>
            </div>
        );
    }

    if (activeSection === 'security') {
        return (
            <div className="w-full max-w-[600px] mx-auto p-4 text-[#E4E6EB] animate-fade-in">
                <button onClick={() => setActiveSection('main')} className="mb-4 text-[#B0B3B8] hover:text-white flex items-center gap-2"><i className="fas fa-arrow-left"></i> Back</button>
                <h2 className="text-2xl font-bold mb-6">Password and Security</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">Email Address (Username)</label>
                        <input type="email" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">New Password</label>
                        <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button onClick={handleSaveSecurity} className="w-full bg-[#1877F2] py-3 rounded-lg font-bold mt-4">Update Security</button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[700px] mx-auto p-4 font-sans text-[#E4E6EB] animate-fade-in pb-20">
            <h1 className="text-2xl font-bold mb-6">Settings & Privacy</h1>
            
            <div className="flex flex-col gap-6">
                <div className="bg-[#242526] rounded-xl overflow-hidden border border-[#3E4042] shadow-sm">
                    <div className="p-4 border-b border-[#3E4042] bg-[#2A2B2D]">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <i className="fas fa-user-shield text-[#1877F2]"></i> Accounts Center
                        </h2>
                        <p className="text-[#B0B3B8] text-sm mt-1">Manage your connected experiences and account settings.</p>
                    </div>
                    <div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors border-b border-[#3E4042]" onClick={() => setActiveSection('details')}>
                            <div className="flex items-center gap-3">
                                <i className="fas fa-user-circle text-[#B0B3B8] w-6 text-center text-lg"></i>
                                <span className="font-semibold text-[15px]">Personal details</span>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors" onClick={() => setActiveSection('security')}>
                            <div className="flex items-center gap-3">
                                <i className="fas fa-shield-alt text-[#B0B3B8] w-6 text-center text-lg"></i>
                                <span className="font-semibold text-[15px]">Password and security</span>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-[#242526] rounded-xl overflow-hidden border border-[#3E4042] shadow-sm">
                    <div className="p-4 border-b border-[#3E4042] bg-[#2A2B2D]">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <i className="fas fa-tools text-[#1877F2]"></i> Tools & Resources
                        </h2>
                    </div>
                    <div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors border-b border-[#3E4042]">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-globe text-[#B0B3B8] w-6 text-center text-lg"></i>
                                <span className="font-semibold text-[15px]">Default Audience Settings</span>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-bell text-[#B0B3B8] w-6 text-center text-lg"></i>
                                <span className="font-semibold text-[15px]">Notifications</span>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
