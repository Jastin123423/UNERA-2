
import React from 'react';
import { User, Event } from '../types';

// --- SUGGESTED PROFILES PAGE ---
interface SuggestedProfilesPageProps {
    currentUser: User;
    users: User[];
    onFollow: (id: number) => void;
    onProfileClick: (id: number) => void;
}

export const SuggestedProfilesPage: React.FC<SuggestedProfilesPageProps> = ({ currentUser, users, onFollow, onProfileClick }) => {
    // Logic to find suggestions
    const suggestions = users.filter(u => {
        if (u.id === currentUser.id) return false; // Don't suggest self
        if (currentUser.following.includes(u.id)) return false; // Already following
        if (u.id === 0) return false; // Don't suggest admin
        return true;
    }).map(u => {
        let score = 0;
        let reasons: string[] = [];

        // 1. Location Match (City, Town, Village, Country)
        if (currentUser.location && u.location) {
            const myLoc = currentUser.location.toLowerCase();
            const theirLoc = u.location.toLowerCase();
            
            // Extract City/Town (assume format "City, Country" or just "City")
            const myCity = myLoc.split(',')[0].trim();
            const theirCity = theirLoc.split(',')[0].trim();
            const myCountry = myLoc.split(',').pop()?.trim();
            const theirCountry = theirLoc.split(',').pop()?.trim();

            if (myCity && theirCity && (myCity === theirCity || myLoc.includes(theirCity) || theirLoc.includes(myCity))) {
                score += 15; // High score for same city/town
                reasons.push(`From ${u.location.split(',')[0]}`);
            } else if (myCountry && theirCountry && myCountry === theirCountry) {
                score += 5;
                reasons.push(`From ${myCountry.charAt(0).toUpperCase() + myCountry.slice(1)}`);
            }
        }

        // 2. Education / Schooled Together
        if (u.education && currentUser.education) {
            const cleanEdu = (s: string) => s.toLowerCase().replace(/studied|at|university|college|high|school|of|the/g, '').trim();
            const myEdu = cleanEdu(currentUser.education);
            const theirEdu = cleanEdu(u.education);
            
            // If they share a specific institution name (e.g., "Stanford", "Arusha Tech")
            if (myEdu && theirEdu && (myEdu.includes(theirEdu) || theirEdu.includes(myEdu))) {
                 score += 20; // Very high score for school connection
                 reasons.push("Schooled together");
            }
        }

        // 3. Popularity (Popular Profiles)
        if (u.followers.length > 5) {
            score += 3;
            // Only list as reason if we don't have a better one
            if (reasons.length === 0) reasons.push("Popular profile");
        }

        // 4. Interests (Simulated Search History/Likes via Bio)
        if (u.bio && currentUser.bio) {
             const myBio = currentUser.bio.toLowerCase();
             const theirBio = u.bio.toLowerCase();
             // Expanded keyword list to simulate "what user likes"
             const keywords = [
                 'tech', 'travel', 'food', 'music', 'art', 'design', 'nature', 'hiking', 
                 'photography', 'fitness', 'gaming', 'business', 'fashion', 'sports', 'movies'
             ];
             const matches = keywords.filter(k => myBio.includes(k) && theirBio.includes(k));
             if (matches.length > 0) {
                 score += 8;
                 reasons.push(`Likes ${matches[0]}`);
             }
        }

        return { user: u, score, reason: reasons[0] || "Suggested for you" };
    })
    .filter(x => x.score > 0) // Only show if we found a match
    .sort((a, b) => b.score - a.score);

    return (
        <div className="w-full max-w-[700px] mx-auto p-4 font-sans pb-20">
            <h2 className="text-2xl font-bold text-[#E4E6EB] mb-2">Suggested People</h2>
            <p className="text-[#B0B3B8] text-sm mb-6">People you may know based on your location, school, and interests.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestions.map(({ user, reason }) => (
                    <div key={user.id} className="bg-[#242526] rounded-xl border border-[#3E4042] overflow-hidden flex flex-col shadow-sm">
                        <div className="h-24 bg-gradient-to-r from-blue-900 to-slate-900 relative">
                             {user.coverImage && <img src={user.coverImage} className="w-full h-full object-cover opacity-60" alt="" />}
                             <div className="absolute -bottom-8 left-4">
                                 <img src={user.profileImage} className="w-16 h-16 rounded-full border-4 border-[#242526] object-cover bg-[#242526]" alt="" />
                             </div>
                        </div>
                        <div className="pt-10 px-4 pb-4 flex-1 flex flex-col">
                            <div onClick={() => onProfileClick(user.id)} className="cursor-pointer">
                                <h3 className="text-[#E4E6EB] font-bold text-lg hover:underline flex items-center gap-1">
                                    {user.name}
                                    {user.isVerified && <i className="fas fa-check-circle text-[#1877F2] text-sm"></i>}
                                </h3>
                            </div>
                            <p className="text-[#B0B3B8] text-sm mb-4 line-clamp-2">{reason}</p>
                            
                            <div className="mt-auto">
                                <button 
                                    onClick={() => onFollow(user.id)}
                                    className="w-full bg-[#263951] text-[#2D88FF] py-2 rounded-lg font-semibold hover:bg-[#2A3F5A] transition-colors"
                                >
                                    Follow
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {suggestions.length === 0 && (
                    <div className="col-span-full text-center py-10">
                        <div className="w-20 h-20 bg-[#242526] rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-user-friends text-3xl text-[#B0B3B8]"></i>
                        </div>
                        <h3 className="text-[#E4E6EB] font-bold text-lg">No suggestions yet</h3>
                        <p className="text-[#B0B3B8] text-sm">Try updating your profile details to help us find better matches.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- BIRTHDAYS PAGE ---
interface BirthdaysPageProps {
    currentUser: User;
    users: User[];
    onMessage: (id: number) => void;
}

export const BirthdaysPage: React.FC<BirthdaysPageProps> = ({ currentUser, users, onMessage }) => {
    
    // Check birthdays based on current date
    const getBirthdayPeople = (offsetDays: number) => {
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + offsetDays);
        
        const targetMonth = targetDate.getMonth() + 1; // 1-12
        const targetDay = targetDate.getDate();        // 1-31

        return users.filter(u => {
            if (!u.birthDate) return false;
            if (u.id === currentUser.id) return false; // Skip self
            
            // Logic: "Followers who will celebrate"
            // We verify if 'u' is a follower of 'currentUser' OR currentUser follows 'u' (Friends)
            // Using u.following.includes(currentUser.id) checks if U follows ME.
            const isFollower = u.following.includes(currentUser.id);
            const isFollowing = currentUser.following.includes(u.id);
            
            if (!isFollower && !isFollowing) return false;

            const bday = new Date(u.birthDate);
            // Match month and day. Note: Date parsing from string "YYYY-MM-DD" acts as UTC usually, 
            // but for simplicity we rely on standard parsing. To be safe, we parse parts.
            const [y, m, d] = u.birthDate.split('-').map(Number);
            
            return m === targetMonth && d === targetDay;
        });
    };

    const todayBirthdays = getBirthdayPeople(0);
    const tomorrowBirthdays = getBirthdayPeople(1);

    const handleWish = (user: User) => {
        onMessage(user.id);
        // In a real app, this might pre-fill the message input with "Happy Birthday!"
    };

    return (
        <div className="w-full max-w-[700px] mx-auto p-4 font-sans text-[#E4E6EB] pb-20">
            <div className="bg-gradient-to-r from-[#F3425F] to-[#E41E3F] p-6 rounded-xl mb-6 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <i className="fas fa-birthday-cake text-white text-3xl"></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Birthdays</h2>
                        <p className="text-white/90">See whose birthday is coming up!</p>
                    </div>
                </div>
            </div>

            {/* Today */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <h3 className="text-lg font-bold text-[#E4E6EB] uppercase tracking-wide">Today</h3>
                </div>
                {todayBirthdays.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {todayBirthdays.map(u => (
                            <div key={u.id} className="bg-[#242526] p-4 rounded-xl flex items-center justify-between border border-[#3E4042] shadow-sm">
                                <div className="flex items-center gap-4">
                                    <img src={u.profileImage} className="w-14 h-14 rounded-full object-cover border-2 border-[#242526]" alt="" />
                                    <div>
                                        <h4 className="font-bold text-lg text-[#E4E6EB]">{u.name}</h4>
                                        <div className="flex items-center gap-1 text-sm text-[#B0B3B8]">
                                            <i className="fas fa-gift text-[#F3425F]"></i>
                                            <span>is celebrating today!</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleWish(u)} className="bg-[#263951] text-[#2D88FF] hover:bg-[#2A3F5A] px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                                    Wish Happy Birthday
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#242526] p-6 rounded-xl text-center border border-[#3E4042]">
                        <p className="text-[#B0B3B8]">No followers have birthdays today.</p>
                    </div>
                )}
            </div>

            {/* Tomorrow */}
            <div>
                 <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <h3 className="text-lg font-bold text-[#E4E6EB] uppercase tracking-wide">Tomorrow</h3>
                </div>
                {tomorrowBirthdays.length > 0 ? (
                    <div className="flex flex-col gap-3">
                         {tomorrowBirthdays.map(u => (
                            <div key={u.id} className="bg-[#242526] p-4 rounded-xl flex items-center justify-between border border-[#3E4042] shadow-sm">
                                <div className="flex items-center gap-4">
                                    <img src={u.profileImage} className="w-14 h-14 rounded-full object-cover border-2 border-[#242526]" alt="" />
                                    <div>
                                        <h4 className="font-bold text-lg text-[#E4E6EB]">{u.name}</h4>
                                        <p className="text-sm text-[#B0B3B8]">will celebrate tomorrow.</p>
                                    </div>
                                </div>
                                <button onClick={() => handleWish(u)} className="bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#E4E6EB] px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                                    Send Message
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#242526] p-6 rounded-xl text-center border border-[#3E4042]">
                         <p className="text-[#B0B3B8]">No birthdays tomorrow.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- EVENTS PAGE ---
interface EventsPageProps {
    events: Event[];
    currentUser: User;
    onJoinEvent: (eventId: number) => void;
    onCreateEventClick: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, currentUser, onJoinEvent, onCreateEventClick }) => {
    // Filter out past events
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="w-full max-w-[900px] mx-auto p-4 font-sans text-[#E4E6EB] pb-20">
            <div className="flex justify-between items-center mb-6 bg-[#242526] p-4 rounded-xl border border-[#3E4042]">
                <div>
                    <h2 className="text-2xl font-bold">Events</h2>
                    <p className="text-[#B0B3B8] text-sm">Discover and create events.</p>
                </div>
                <button 
                    onClick={onCreateEventClick}
                    className="bg-[#1877F2] hover:bg-[#166FE5] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md"
                >
                    <i className="fas fa-plus"></i> <span className="hidden sm:inline">Create Event</span>
                </button>
            </div>

            <h3 className="text-lg font-bold text-[#E4E6EB] mb-4 flex items-center gap-2">
                <i className="fas fa-calendar-alt text-[#F3425F]"></i> Upcoming Events
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => {
                    const isAttending = event.attendees.includes(currentUser.id);
                    const date = new Date(event.date);
                    return (
                        <div key={event.id} className="bg-[#242526] rounded-xl overflow-hidden border border-[#3E4042] flex flex-col group hover:shadow-xl transition-all duration-300">
                            <div className="h-40 overflow-hidden relative">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center min-w-[50px] shadow-lg">
                                    <span className="block text-[#E41E3F] font-bold text-xs uppercase tracking-wider">{date.toLocaleString('default', { month: 'short' })}</span>
                                    <span className="block text-black font-extrabold text-xl leading-none">{date.getDate()}</span>
                                </div>
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full p-2 hover:bg-black/80 cursor-pointer">
                                    <i className="fas fa-share text-white text-sm"></i>
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h4 className="text-lg font-bold mb-1 line-clamp-1 text-[#E4E6EB]">{event.title}</h4>
                                <div className="flex items-center gap-2 text-[#F3425F] text-sm font-semibold mb-2">
                                    <i className="far fa-clock"></i>
                                    <span>{date.toDateString()} • {event.time}</span>
                                </div>
                                <div className="flex items-start gap-2 text-[#B0B3B8] text-sm mb-4">
                                    <i className="fas fa-map-marker-alt mt-1"></i>
                                    <span className="line-clamp-2">{event.location}</span>
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-[#3E4042] flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {/* Fake attendee avatars */}
                                        <div className="w-6 h-6 rounded-full bg-gray-600 border border-[#242526]"></div>
                                        <div className="w-6 h-6 rounded-full bg-gray-500 border border-[#242526]"></div>
                                        <div className="w-6 h-6 rounded-full bg-gray-400 border border-[#242526] flex items-center justify-center text-[8px] text-black font-bold">+{event.attendees.length}</div>
                                    </div>
                                    <button 
                                        onClick={() => onJoinEvent(event.id)}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-bold border transition-all transform active:scale-95 ${
                                            isAttending 
                                            ? 'bg-[#3A3B3C] border-[#3E4042] text-[#E4E6EB]' 
                                            : 'bg-[#263951] border-transparent text-[#2D88FF] hover:bg-[#2A3F5A]'
                                        }`}
                                    >
                                        {isAttending ? 'Going' : 'Interested'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {upcomingEvents.length === 0 && (
                     <div className="col-span-full flex flex-col items-center justify-center py-16 bg-[#242526] rounded-xl border border-[#3E4042] border-dashed">
                        <div className="w-16 h-16 bg-[#3A3B3C] rounded-full flex items-center justify-center mb-4">
                            <i className="fas fa-calendar-plus text-2xl text-[#B0B3B8]"></i>
                        </div>
                        <h3 className="text-[#E4E6EB] font-bold text-lg">No events found</h3>
                        <p className="text-[#B0B3B8] text-sm mb-4">Be the first to create an event!</p>
                        <button onClick={onCreateEventClick} className="text-[#1877F2] font-semibold hover:underline">Create Event</button>
                     </div>
                )}
            </div>
        </div>
    );
};
