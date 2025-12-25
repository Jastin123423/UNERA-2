// MenuPages.tsx - Enhanced with Facebook-style Birthday page

import React, { useState, useEffect } from 'react';
import { User, Event, Group, Product, Post as PostType } from '../types';
import { MARKETPLACE_COUNTRIES } from '../constants';
import { Post } from './Feed';

// --- BIRTHDAY GIFT INTERFACE ---
interface BirthdayGift {
  id: number;
  name: string;
  emoji: string;
  color: string;
  message: string;
}

// Predefined birthday messages
const BIRTHDAY_MESSAGES = [
  "Happy Birthday! 🎉 Hope your day is filled with joy!",
  "Wishing you all the best on your special day! 🎂",
  "Another year older, another year wiser! Happy Birthday! 🥳",
  "Hope your birthday is as amazing as you are! ✨",
  "Sending lots of love and birthday wishes your way! 💖",
  "May all your birthday wishes come true! 🌟",
  "Cheers to another trip around the sun! 🥂",
  "Have a fantastic birthday celebration! 🎈",
];

// Birthday gifts
const BIRTHDAY_GIFTS: BirthdayGift[] = [
  { id: 1, name: "Birthday Cake", emoji: "🎂", color: "#FF6B6B", message: "Sent a virtual birthday cake!" },
  { id: 2, name: "Balloons", emoji: "🎈", color: "#4ECDC4", message: "Sent virtual balloons!" },
  { id: 3, name: "Party Popper", emoji: "🎉", color: "#FFD166", message: "Sent a party popper!" },
  { id: 4, name: "Gift", emoji: "🎁", color: "#06D6A0", message: "Sent a virtual gift!" },
  { id: 5, name: "Heart", emoji: "💝", color: "#EF476F", message: "Sent love!" },
  { id: 6, name: "Star", emoji: "🌟", color: "#FFD166", message: "Sent stardust!" },
  { id: 7, name: "Crown", emoji: "👑", color: "#FFD700", message: "Sent a birthday crown!" },
  { id: 8, name: "Trophy", emoji: "🏆", color: "#CD7F32", message: "Sent a winner's trophy!" },
];

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
    const [hiddenUserIds, setHiddenUserIds] = useState<number[]>([]);
    const [hiddenGroupIds, setHiddenGroupIds] = useState<string[]>([]);
    const [hiddenEventIds, setHiddenEventIds] = useState<number[]>([]);
    const [hiddenProductIds, setHiddenProductIds] = useState<number[]>([]);

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

    const availableGroups = groups.filter(g => (!currentUser || !g.members.includes(currentUser.id)) && !hiddenGroupIds.includes(g.id));
    const availableEvents = events.filter(e => !hiddenEventIds.includes(e.id));
    const availableProducts = products.filter(p => !hiddenProductIds.includes(p.id));

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

// --- ENHANCED BIRTHDAYS PAGE (Facebook Style) ---
interface BirthdaysPageProps { 
    currentUser: User; 
    users: User[]; 
    onMessage: (id: number) => void;
    onWriteOnTimeline?: (id: number) => void;
    onSendGift?: (id: number, gift: BirthdayGift) => void;
    onPostMessage?: (userId: number, message: string) => void;
    onViewAllBirthdays?: () => void;
}

export const BirthdaysPage: React.FC<BirthdaysPageProps> = ({ 
    currentUser, 
    users, 
    onMessage,
    onWriteOnTimeline,
    onSendGift,
    onPostMessage,
    onViewAllBirthdays 
}) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [customMessage, setCustomMessage] = useState("");
    const [selectedGift, setSelectedGift] = useState<BirthdayGift | null>(null);
    const [postedMessages, setPostedMessages] = useState<{[key: number]: string[]}>({});
    const [sentGifts, setSentGifts] = useState<{[key: number]: BirthdayGift[]}>({});

    // Simulate birthdays
    const today = new Date();
    const birthdaysToday = users.filter(u => u.id !== currentUser.id && u.id % 3 === 0);
    const upcomingBirthdays = users.filter(u => u.id !== currentUser.id && u.id % 5 === 0 && u.id % 3 !== 0).slice(0, 6);

    const handleSendGift = (userId: number) => {
        if (!selectedGift) return;
        
        if (onSendGift) {
            onSendGift(userId, selectedGift);
        }
        
        setSentGifts(prev => ({
            ...prev,
            [userId]: [...(prev[userId] || []), selectedGift]
        }));
        
        alert(`Sent ${selectedGift.emoji} ${selectedGift.name} to ${users.find(u => u.id === userId)?.name}`);
        setSelectedGift(null);
    };

    const handlePostMessage = (userId: number) => {
        const message = customMessage || BIRTHDAY_MESSAGES[Math.floor(Math.random() * BIRTHDAY_MESSAGES.length)];
        
        if (onPostMessage) {
            onPostMessage(userId, message);
        }
        
        setPostedMessages(prev => ({
            ...prev,
            [userId]: [...(prev[userId] || []), message]
        }));
        
        setCustomMessage("");
        alert(`Posted birthday message to ${users.find(u => u.id === userId)?.name}'s timeline!`);
    };

    const handleQuickWish = (userId: number) => {
        const randomMessage = BIRTHDAY_MESSAGES[Math.floor(Math.random() * BIRTHDAY_MESSAGES.length)];
        
        if (onPostMessage) {
            onPostMessage(userId, randomMessage);
        }
        
        setPostedMessages(prev => ({
            ...prev,
            [userId]: [...(prev[userId] || []), randomMessage]
        }));
        
        alert(`Sent birthday wish to ${users.find(u => u.id === userId)?.name}!`);
    };

    // Birthday greeting header
    const getBirthdayGreeting = () => {
        const hour = today.getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="w-full max-w-[800px] mx-auto p-4 font-sans pb-20 animate-fade-in">
            {/* Birthday Header */}
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-2xl p-6 mb-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <i className="fas fa-birthday-cake text-2xl text-white"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{getBirthdayGreeting()}, {currentUser.name.split(' ')[0]}!</h1>
                            <p className="text-white/90">Celebrate birthdays with friends</p>
                        </div>
                    </div>
                    <button 
                        onClick={onViewAllBirthdays}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-bold transition-all backdrop-blur-sm"
                    >
                        <i className="fas fa-calendar-alt mr-2"></i>
                        View Calendar
                    </button>
                </div>
            </div>

            {/* Today's Birthdays */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#E4E6EB] flex items-center gap-2">
                        <i className="fas fa-gift text-[#F02849]"></i>
                        Today's Birthdays
                        <span className="bg-[#F02849] text-white text-xs px-2 py-1 rounded-full">
                            {birthdaysToday.length}
                        </span>
                    </h2>
                    <button className="text-[#2D88FF] text-sm font-semibold hover:underline">
                        See All
                    </button>
                </div>

                {birthdaysToday.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {birthdaysToday.map(user => {
                            const userMessages = postedMessages[user.id] || [];
                            const userGifts = sentGifts[user.id] || [];
                            
                            return (
                                <div key={user.id} className="bg-[#242526] rounded-xl border border-[#3E4042] overflow-hidden shadow-lg">
                                    {/* Birthday Banner */}
                                    <div className="h-24 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800')] opacity-20"></div>
                                        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                            <i className="fas fa-crown mr-1"></i> Birthday
                                        </div>
                                        <div className="absolute -bottom-8 left-4">
                                            <div className="relative">
                                                <img 
                                                    src={user.profileImage} 
                                                    className="w-16 h-16 rounded-full border-4 border-[#242526] object-cover bg-[#242526] shadow-lg" 
                                                    alt="" 
                                                />
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-full flex items-center justify-center">
                                                    <i className="fas fa-birthday-cake text-white text-xs"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* User Info */}
                                    <div className="pt-10 px-4 pb-4">
                                        <div className="mb-4">
                                            <h3 className="text-[#E4E6EB] font-bold text-lg">{user.name}</h3>
                                            <p className="text-[#B0B3B8] text-sm">
                                                <i className="fas fa-cake-candles mr-1"></i>
                                                Turning {20 + user.id} today
                                            </p>
                                        </div>

                                        {/* Sent Gifts Preview */}
                                        {userGifts.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs text-[#B0B3B8] mb-1">Gifts received:</p>
                                                <div className="flex gap-1">
                                                    {userGifts.slice(0, 3).map(gift => (
                                                        <span 
                                                            key={gift.id} 
                                                            className="text-xl"
                                                            title={gift.name}
                                                        >
                                                            {gift.emoji}
                                                        </span>
                                                    ))}
                                                    {userGifts.length > 3 && (
                                                        <span className="text-xs text-[#B0B3B8]">
                                                            +{userGifts.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <button 
                                                onClick={() => handleQuickWish(user.id)}
                                                className="flex-1 bg-gradient-to-r from-[#1877F2] to-[#2D88FF] text-white py-2 px-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                            >
                                                <i className="fas fa-heart"></i>
                                                Wish
                                            </button>
                                            <button 
                                                onClick={() => onMessage(user.id)}
                                                className="flex-1 bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#E4E6EB] py-2 px-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                                            >
                                                <i className="fas fa-comment"></i>
                                                Message
                                            </button>
                                            <button 
                                                onClick={() => onWriteOnTimeline && onWriteOnTimeline(user.id)}
                                                className="flex-1 bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#E4E6EB] py-2 px-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                                            >
                                                <i className="fas fa-edit"></i>
                                                Post
                                            </button>
                                        </div>

                                        {/* Custom Message Input */}
                                        <div className="mb-3">
                                            <textarea
                                                value={customMessage}
                                                onChange={(e) => setCustomMessage(e.target.value)}
                                                placeholder="Write a birthday message..."
                                                className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-sm text-[#E4E6EB] outline-none resize-none"
                                                rows={2}
                                            />
                                            <button
                                                onClick={() => handlePostMessage(user.id)}
                                                disabled={!customMessage.trim()}
                                                className={`w-full mt-2 py-2 rounded-lg font-semibold text-sm transition-all ${
                                                    customMessage.trim() 
                                                    ? 'bg-gradient-to-r from-[#06D6A0] to-[#4ECDC4] text-white hover:opacity-90' 
                                                    : 'bg-[#3A3B3C] text-[#6D6F73] cursor-not-allowed'
                                                }`}
                                            >
                                                <i className="fas fa-paper-plane mr-2"></i>
                                                Post to Timeline
                                            </button>
                                        </div>

                                        {/* Gift Selector */}
                                        <div className="mb-3">
                                            <p className="text-sm text-[#B0B3B8] mb-2">Send a birthday gift:</p>
                                            <div className="grid grid-cols-4 gap-2">
                                                {BIRTHDAY_GIFTS.slice(0, 4).map(gift => (
                                                    <button
                                                        key={gift.id}
                                                        onClick={() => setSelectedGift(gift)}
                                                        className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                                                            selectedGift?.id === gift.id 
                                                            ? 'bg-[#3A3B3C] border-2 border-[#2D88FF]' 
                                                            : 'bg-[#3A3B3C] hover:bg-[#4E4F50]'
                                                        }`}
                                                    >
                                                        <span className="text-2xl mb-1">{gift.emoji}</span>
                                                        <span className="text-xs text-[#B0B3B8]">{gift.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            {selectedGift && (
                                                <button
                                                    onClick={() => handleSendGift(user.id)}
                                                    className="w-full mt-2 bg-gradient-to-r from-[#FF6B6B] to-[#FFD166] text-white py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                                                >
                                                    <i className="fas fa-gift mr-2"></i>
                                                    Send {selectedGift.emoji} {selectedGift.name}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-[#242526] p-8 rounded-xl border border-[#3E4042] text-center mb-8">
                        <i className="fas fa-calendar-check text-5xl text-[#B0B3B8] mb-4"></i>
                        <h3 className="text-xl font-bold text-[#E4E6EB] mb-2">No birthdays today</h3>
                        <p className="text-[#B0B3B8] mb-4">Check back tomorrow to celebrate with friends!</p>
                        <button 
                            onClick={onViewAllBirthdays}
                            className="bg-[#1877F2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#166FE5] transition-colors"
                        >
                            View Upcoming Birthdays
                        </button>
                    </div>
                )}
            </div>

            {/* Upcoming Birthdays */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-[#B0B3B8] mb-4 uppercase tracking-wide text-sm flex items-center gap-2">
                    <i className="fas fa-calendar-alt"></i>
                    Upcoming Birthdays This Week
                </h3>
                <div className="bg-[#242526] rounded-xl border border-[#3E4042] overflow-hidden">
                    {upcomingBirthdays.map((user, idx) => (
                        <div 
                            key={user.id} 
                            className={`flex items-center justify-between p-4 hover:bg-[#3A3B3C] transition-colors cursor-pointer ${
                                idx !== upcomingBirthdays.length - 1 ? 'border-b border-[#3E4042]' : ''
                            }`}
                            onClick={() => onMessage && onMessage(user.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img 
                                        src={user.profileImage} 
                                        className="w-12 h-12 rounded-full object-cover border-2 border-[#3E4042]" 
                                        alt="" 
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-full flex items-center justify-center">
                                        <i className="fas fa-cake-candles text-white text-xs"></i>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[#E4E6EB] font-bold text-sm">{user.name}</h4>
                                    <p className="text-[#B0B3B8] text-xs">Birthday in {2 + idx} days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleQuickWish(user.id);
                                    }}
                                    className="px-3 py-1.5 bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#E4E6EB] rounded-lg text-xs font-semibold transition-colors"
                                >
                                    <i className="fas fa-heart mr-1"></i>
                                    Wish
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onMessage && onMessage(user.id);
                                    }}
                                    className="px-3 py-1.5 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-lg text-xs font-semibold transition-colors"
                                >
                                    <i className="fas fa-comment mr-1"></i>
                                    Message
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Birthday Gift Shop */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-[#E4E6EB] mb-4 flex items-center gap-2">
                    <i className="fas fa-store text-[#FFD700]"></i>
                    Birthday Gift Shop
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {BIRTHDAY_GIFTS.map(gift => (
                        <div 
                            key={gift.id}
                            className="bg-[#242526] rounded-xl border border-[#3E4042] p-3 text-center hover:border-[#2D88FF] transition-colors cursor-pointer"
                            onClick={() => {
                                if (birthdaysToday.length > 0) {
                                    setSelectedGift(gift);
                                    const firstUser = birthdaysToday[0];
                                    handleSendGift(firstUser.id);
                                }
                            }}
                        >
                            <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-2"
                                style={{ backgroundColor: `${gift.color}20` }}
                            >
                                {gift.emoji}
                            </div>
                            <h4 className="text-[#E4E6EB] font-semibold text-sm">{gift.name}</h4>
                            <p className="text-[#B0B3B8] text-xs mt-1">{gift.message}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Birthday Tips */}
            <div className="bg-gradient-to-r from-[#242526] to-[#2A2B2D] rounded-xl border border-[#3E4042] p-4">
                <h4 className="text-[#E4E6EB] font-bold mb-2 flex items-center gap-2">
                    <i className="fas fa-lightbulb text-[#FFD700]"></i>
                    Make Birthdays Special
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-video text-white text-sm"></i>
                        </div>
                        <div>
                            <p className="text-[#E4E6EB] font-semibold text-sm">Video Call</p>
                            <p className="text-[#B0B3B8] text-xs">Surprise them with a birthday video call</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-[#06D6A0] rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-gift text-white text-sm"></i>
                        </div>
                        <div>
                            <p className="text-[#E4E6EB] font-semibold text-sm">Group Gift</p>
                            <p className="text-[#B0B3B8] text-xs">Organize a group gift with friends</p>
                        </div>
                    </div>
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
    const [activeSection, setActiveSection] = useState<'main' | 'details' | 'security' | 'birthday'>('main');
    
    // Personal Details Form
    const [name, setName] = useState(currentUser?.name || '');
    const [bio, setBio] = useState(currentUser?.bio || '');
    const [location, setLocation] = useState(currentUser?.location || '');
    const [work, setWork] = useState(currentUser?.work || '');
    const [birthday, setBirthday] = useState(currentUser?.birthday || '2000-01-01');

    // Security Form
    const [email, setEmail] = useState(currentUser?.email || '');
    const [password, setPassword] = useState(currentUser?.password || '');

    if (!currentUser) return <div className="p-8 text-center text-[#B0B3B8]">Please login to access settings.</div>;

    const handleSaveDetails = () => {
        onUpdateUser({ name, bio, location, work, birthday });
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
                    <div>
                        <label className="block text-sm text-[#B0B3B8] mb-1">Birthday</label>
                        <input type="date" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" value={birthday} onChange={e => setBirthday(e.target.value)} />
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

    if (activeSection === 'birthday') {
        return (
            <div className="w-full max-w-[600px] mx-auto p-4 text-[#E4E6EB] animate-fade-in">
                <button onClick={() => setActiveSection('main')} className="mb-4 text-[#B0B3B8] hover:text-white flex items-center gap-2"><i className="fas fa-arrow-left"></i> Back</button>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <i className="fas fa-birthday-cake text-[#F02849]"></i>
                    Birthday Settings
                </h2>
                <div className="space-y-4">
                    <div className="bg-[#242526] p-4 rounded-lg border border-[#3E4042]">
                        <h3 className="font-bold text-lg mb-2">Privacy Settings</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">Who can see your birthday?</p>
                                    <p className="text-[#B0B3B8] text-sm">Choose who can see your birth date</p>
                                </div>
                                <select className="bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2 outline-none">
                                    <option>Friends</option>
                                    <option>Public</option>
                                    <option>Only Me</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">Birthday Reminders</p>
                                    <p className="text-[#B0B3B8] text-sm">Get notified about friends' birthdays</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-[#3E4042] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1877F2]"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-[#242526] p-4 rounded-lg border border-[#3E4042]">
                        <h3 className="font-bold text-lg mb-2">Birthday Wishes</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-[#B0B3B8] mb-1">Auto-reply Message</label>
                                <textarea 
                                    className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 outline-none" 
                                    placeholder="Thanks for the birthday wish! 🎉"
                                    rows={3}
                                    defaultValue="Thanks for the birthday wish! 🎉"
                                />
                            </div>
                            <button className="w-full bg-[#1877F2] py-3 rounded-lg font-bold">Save Birthday Settings</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[700px] mx-auto p-4 font-sans text-[#E4E6EB] animate-fade-in pb-20">
            <h1 className="text-2xl font-bold mb-6">Settings & Privacy</h1>
            
            <div className="flex flex-col gap-6">
                {/* Personal Information Card */}
                <div className="bg-[#242526] rounded-xl overflow-hidden border border-[#3E4042] shadow-sm">
                    <div className="p-4 border-b border-[#3E4042] bg-[#2A2B2D]">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <i className="fas fa-user-circle text-[#1877F2]"></i> Personal Information
                        </h2>
                        <p className="text-[#B0B3B8] text-sm mt-1">Manage your personal details and preferences</p>
                    </div>
                    <div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors border-b border-[#3E4042]" onClick={() => setActiveSection('details')}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1877F2] to-[#2D88FF] flex items-center justify-center">
                                    <i className="fas fa-user text-white text-sm"></i>
                                </div>
                                <div>
                                    <span className="font-semibold text-[15px]">Profile Details</span>
                                    <p className="text-[#B0B3B8] text-xs">Update your name, bio, and other info</p>
                                </div>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors border-b border-[#3E4042]" onClick={() => setActiveSection('birthday')}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#F02849] flex items-center justify-center">
                                    <i className="fas fa-birthday-cake text-white text-sm"></i>
                                </div>
                                <div>
                                    <span className="font-semibold text-[15px]">Birthday Settings</span>
                                    <p className="text-[#B0B3B8] text-xs">Manage birthday privacy and notifications</p>
                                </div>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                    </div>
                </div>

                {/* Security Card */}
                <div className="bg-[#242526] rounded-xl overflow-hidden border border-[#3E4042] shadow-sm">
                    <div className="p-4 border-b border-[#3E4042] bg-[#2A2B2D]">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <i className="fas fa-shield-alt text-[#06D6A0]"></i> Security & Login
                        </h2>
                        <p className="text-[#B0B3B8] text-sm mt-1">Keep your account secure</p>
                    </div>
                    <div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors" onClick={() => setActiveSection('security')}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#06D6A0] to-[#4ECDC4] flex items-center justify-center">
                                    <i className="fas fa-lock text-white text-sm"></i>
                                </div>
                                <div>
                                    <span className="font-semibold text-[15px]">Password & Security</span>
                                    <p className="text-[#B0B3B8] text-xs">Change password and security settings</p>
                                </div>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                    </div>
                </div>

                {/* Preferences Card */}
                <div className="bg-[#242526] rounded-xl overflow-hidden border border-[#3E4042] shadow-sm">
                    <div className="p-4 border-b border-[#3E4042] bg-[#2A2B2D]">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <i className="fas fa-sliders-h text-[#FFD166]"></i> Preferences
                        </h2>
                        <p className="text-[#B0B3B8] text-sm mt-1">Customize your experience</p>
                    </div>
                    <div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors border-b border-[#3E4042]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FFB347] flex items-center justify-center">
                                    <i className="fas fa-bell text-white text-sm"></i>
                                </div>
                                <div>
                                    <span className="font-semibold text-[15px]">Notifications</span>
                                    <p className="text-[#B0B3B8] text-xs">Manage your notification preferences</p>
                                </div>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-[#3A3B3C] cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] flex items-center justify-center">
                                    <i className="fas fa-palette text-white text-sm"></i>
                                </div>
                                <div>
                                    <span className="font-semibold text-[15px]">Appearance</span>
                                    <p className="text-[#B0B3B8] text-xs">Dark mode and theme settings</p>
                                </div>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export the new BirthdayGift type
export type { BirthdayGift };
