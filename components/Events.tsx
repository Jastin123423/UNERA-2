import React, { useState, useRef, useEffect } from 'react';
import { User, Event } from '../types';
import { LOCATIONS_DATA } from '../constants';

// --- CREATE EVENT MODAL ---
interface CreateEventModalProps {
    currentUser: User;
    onClose: () => void;
    onCreate: (event: Partial<Event>) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ currentUser, onClose, onCreate }) => {
    // Set default date to tomorrow and time to 18:00
    const getDefaultDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };
    
    const getDefaultTime = () => '18:00';
    
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState(getDefaultDate()); // Initialize with default
    const [time, setTime] = useState(getDefaultTime()); // Initialize with default
    const [location, setLocation] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) setImage(ev.target.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !date || !time || !location.trim()) {
            alert("Please fill all required fields");
            return;
        }
        
        try {
            setIsSubmitting(true);
            
            // Create date object properly
            const [year, month, day] = date.split('-').map(Number);
            const [hours, minutes] = time.split(':').map(Number);
            
            // Create event date in user's local timezone
            const eventDate = new Date(year, month - 1, day, hours, minutes);
            
            // Validate date is in the future
            const now = new Date();
            if (eventDate <= now) {
                alert("Event date must be in the future");
                setIsSubmitting(false);
                return;
            }
            
            const newEvent = {
                id: Date.now(),
                title: title.trim(),
                description: desc.trim(),
                date: eventDate.toISOString(), // Store as ISO string
                time: time,
                location: location.trim(),
                image: image || 'https://images.unsplash.com/photo-1540575467063-178a50935278?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
                organizerId: currentUser.id,
                attendees: [currentUser.id],
                interestedIds: []
            };
            
            console.log('Creating event:', newEvent);
            
            // Call the onCreate function with the complete event
            onCreate(newEvent);
            
            // Show success message
            alert(`Event "${title}" created successfully! It will appear in your feed and events page.`);
            onClose();
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/90 flex items-center justify-center p-4 animate-fade-in font-sans backdrop-blur-sm">
            <div className="bg-[#0F0F0F] w-full max-w-[500px] rounded-2xl border border-[#1A1A1A] shadow-2xl flex flex-col max-h-[90vh] animate-scale-in">
                <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-gradient-to-r from-[#1A1A1A] to-[#0F0F0F]">
                    <div>
                        <h2 className="text-2xl font-black text-[#FFFFFF] tracking-tight">Host an Event</h2>
                        <p className="text-[#8A8A8A] text-sm mt-1">Create amazing experiences for your community</p>
                    </div>
                    <div onClick={onClose} className="w-10 h-10 rounded-full bg-[#1A1A1A] hover:bg-[#2A2A2A] flex items-center justify-center cursor-pointer transition-all hover:scale-110 border border-[#2A2A2A]">
                        <i className="fas fa-times text-[#8A8A8A]"></i>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                    {/* Cover Image Upload */}
                    <div 
                        className="w-full h-48 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-[#2A2A2A] hover:border-[#3A3A3A] hover:bg-[#1A1A1A] transition-all group overflow-hidden relative"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {image ? (
                            <>
                                <img src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Event Cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                                        <i className="fas fa-camera text-white mr-2"></i>
                                        <span className="text-white text-sm font-semibold">Change Photo</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center mb-3 border border-[#3A3A3A]">
                                    <i className="fas fa-camera text-2xl text-[#8A8A8A]"></i>
                                </div>
                                <span className="text-[#FFFFFF] text-base font-semibold">Upload Cover Photo</span>
                                <p className="text-[#8A8A8A] text-sm mt-1">Recommended: 1200x600px</p>
                            </>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />
                    </div>

                    {/* Event Name */}
                    <div className="space-y-2">
                        <label className="block text-[#FFFFFF] font-bold text-sm flex items-center gap-2">
                            <i className="fas fa-heading text-[#FF6B35] w-5"></i>
                            Event Name <span className="text-[#FF6B35]">*</span>
                        </label>
                        <input 
                            type="text" 
                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-[#FFFFFF] outline-none focus:border-[#FF6B35] transition-colors placeholder-[#5A5A5A] font-medium" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="What's the name of your event?" 
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-[#FFFFFF] font-bold text-sm flex items-center gap-2">
                                <i className="far fa-calendar text-[#00D4AA] w-5"></i>
                                Date <span className="text-[#FF6B35]">*</span>
                            </label>
                            <input 
                                type="date" 
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-[#FFFFFF] outline-none focus:border-[#00D4AA] transition-colors" 
                                value={date} 
                                onChange={e => setDate(e.target.value)} 
                                min={new Date().toISOString().split('T')[0]}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[#FFFFFF] font-bold text-sm flex items-center gap-2">
                                <i className="far fa-clock text-[#00D4AA] w-5"></i>
                                Time <span className="text-[#FF6B35]">*</span>
                            </label>
                            <input 
                                type="time" 
                                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-[#FFFFFF] outline-none focus:border-[#00D4AA] transition-colors" 
                                value={time} 
                                onChange={e => setTime(e.target.value)} 
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="block text-[#FFFFFF] font-bold text-sm flex items-center gap-2">
                            <i className="fas fa-map-marker-alt text-[#FFD166] w-5"></i>
                            Location <span className="text-[#FF6B35]">*</span>
                        </label>
                         <input 
                            type="text" 
                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-[#FFFFFF] outline-none focus:border-[#FFD166] transition-colors placeholder-[#5A5A5A]" 
                            value={location} 
                            onChange={e => setLocation(e.target.value)} 
                            placeholder="Where will it take place?" 
                            list="locations" 
                            required
                            disabled={isSubmitting}
                         />
                         <datalist id="locations">
                             {LOCATIONS_DATA.map(l => <option key={l.name} value={l.name} />)}
                         </datalist>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="block text-[#FFFFFF] font-bold text-sm flex items-center gap-2">
                            <i className="fas fa-align-left text-[#06D6A0] w-5"></i>
                            Description
                        </label>
                        <textarea 
                            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-[#FFFFFF] outline-none focus:border-[#06D6A0] transition-colors h-32 resize-none placeholder-[#5A5A5A]" 
                            value={desc} 
                            onChange={e => setDesc(e.target.value)} 
                            placeholder="Tell people more about your event. What can they expect?" 
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={!title.trim() || !date || !time || !location.trim() || isSubmitting}
                        className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] hover:from-[#FF8E53] hover:to-[#FF6B35] disabled:from-[#2A2A2A] disabled:to-[#1A1A1A] disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-lg shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Creating Event...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-bolt"></i>
                                Create & Share Event
                                <i className="fas fa-arrow-right"></i>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- EVENTS PAGE ---
interface EventsPageProps { 
    events: Event[]; 
    currentUser: User | null; 
    onJoinEvent: (eventId: number) => void; 
    onCreateEventClick: () => void; 
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, onCreateEventClick, currentUser, onJoinEvent }) => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'my-events'>('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Filter events based on active tab and search
    const now = new Date();
    let filteredEvents = sortedEvents.filter(event => {
        const eventDate = new Date(event.date);
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.location.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;
        
        switch (activeTab) {
            case 'upcoming':
                return eventDate >= now;
            case 'past':
                return eventDate < now;
            case 'my-events':
                return currentUser && event.organizerId === currentUser.id;
            default:
                return true;
        }
    });

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            if (date.toDateString() === today.toDateString()) {
                return 'Today';
            } else if (date.toDateString() === tomorrow.toDateString()) {
                return 'Tomorrow';
            } else {
                return date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                });
            }
        } catch (e) {
            return 'Invalid date';
        }
    };

    return (
        <div className="w-full max-w-[1200px] mx-auto p-4 font-sans pb-20 animate-fade-in">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-3xl mb-8 border border-[#1A1A1A] bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A]">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
                    className="w-full h-64 object-cover opacity-40"
                    alt="Events Background"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
                    <h1 className="text-5xl font-black text-white mb-3 tracking-tight">Events</h1>
                    <p className="text-[#8A8A8A] text-lg max-w-2xl">Discover amazing experiences, connect with people, and create unforgettable memories</p>
                    <div className="flex items-center gap-4 mt-6">
                        {currentUser && (
                            <button 
                                onClick={onCreateEventClick}
                                className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] hover:from-[#FF8E53] hover:to-[#FF6B35] text-white px-8 py-3 rounded-xl font-black flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-2xl border border-[#FF8E53]/30"
                            >
                                <i className="fas fa-plus text-lg"></i>
                                Host Event
                            </button>
                        )}
                        <div className="text-white">
                            <div className="text-2xl font-black">{events.filter(e => new Date(e.date) >= now).length}</div>
                            <div className="text-[#8A8A8A] text-sm">Upcoming Events</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative">
                    <input 
                        type="text"
                        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 pl-12 text-[#FFFFFF] outline-none focus:border-[#FF6B35] transition-colors placeholder-[#5A5A5A] text-lg"
                        placeholder="Search events by name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A8A] text-lg"></i>
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-white"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 bg-[#1A1A1A] rounded-2xl p-2 border border-[#2A2A2A]">
                {(['upcoming', 'past', 'my-events'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                            activeTab === tab
                                ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] text-white shadow-lg'
                                : 'text-[#8A8A8A] hover:text-white hover:bg-[#2A2A2A]'
                        }`}
                    >
                        {tab === 'upcoming' && <i className="fas fa-calendar-day"></i>}
                        {tab === 'past' && <i className="fas fa-history"></i>}
                        {tab === 'my-events' && <i className="fas fa-user-check"></i>}
                        {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        <span className="bg-black/30 px-2 py-1 rounded text-xs">
                            {tab === 'my-events' 
                                ? events.filter(e => currentUser && e.organizerId === currentUser.id).length
                                : sortedEvents.filter(e => {
                                    const eventDate = new Date(e.date);
                                    if (tab === 'upcoming') return eventDate >= now;
                                    if (tab === 'past') return eventDate < now;
                                    return true;
                                }).length
                            }
                        </span>
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => {
                    const isInterested = currentUser && event.interestedIds?.includes(currentUser.id);
                    const eventDate = new Date(event.date);
                    const isPast = eventDate < now;
                    const isMyEvent = currentUser && event.organizerId === currentUser.id;
                    
                    return (
                        <div 
                            key={event.id} 
                            className="group bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] rounded-3xl overflow-hidden border border-[#2A2A2A] transition-all duration-500 hover:border-[#FF6B35]/30 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
                        >
                            {/* Event Image */}
                            <div className="h-48 overflow-hidden relative">
                                <img 
                                    src={event.image} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    alt={event.title} 
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                
                                {/* Date Badge */}
                                <div className="absolute top-4 left-4">
                                    <div className="bg-black/80 backdrop-blur-sm rounded-xl p-3 text-center min-w-[60px] border border-white/10">
                                        <div className="text-[#FF6B35] font-black text-xs uppercase leading-tight">
                                            {eventDate.toLocaleString('default', { month: 'short' })}
                                        </div>
                                        <div className="text-white font-black text-2xl leading-none">
                                            {eventDate.getDate()}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Status Badges */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {isPast && (
                                        <div className="bg-[#2A2A2A] text-[#8A8A8A] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#3A3A3A]">
                                            PAST
                                        </div>
                                    )}
                                    {isMyEvent && (
                                        <div className="bg-gradient-to-r from-[#06D6A0] to-[#0CB48A] text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                                            YOUR EVENT
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Event Content */}
                            <div className="p-6">
                                {/* Title and Time */}
                                <h3 className="text-white font-bold text-xl mb-2 line-clamp-1 group-hover:text-[#FF6B35] transition-colors">
                                    {event.title}
                                </h3>
                                
                                <div className="space-y-3 mb-4">
                                    {/* Time */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center border border-[#3A3A3A]">
                                            <i className="far fa-clock text-[#00D4AA] text-sm"></i>
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{formatDate(event.date)}</div>
                                            <div className="text-[#8A8A8A] text-sm">{event.time}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Location */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center border border-[#3A3A3A]">
                                            <i className="fas fa-map-marker-alt text-[#FFD166] text-sm"></i>
                                        </div>
                                        <div className="text-[#8A8A8A] text-sm line-clamp-1">{event.location}</div>
                                    </div>
                                    
                                    {/* Description */}
                                    {event.description && (
                                        <p className="text-[#8A8A8A] text-sm line-clamp-2">
                                            {event.description}
                                        </p>
                                    )}
                                </div>
                                
                                {/* Stats and Action Button */}
                                <div className="flex justify-between items-center pt-4 border-t border-[#2A2A2A]">
                                    {/* Stats */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] border-2 border-[#0F0F0F]"></div>
                                                ))}
                                            </div>
                                            <span className="text-[#8A8A8A] text-xs font-bold">
                                                {event.attendees?.length || 0}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="fas fa-heart text-[#EF476F]"></i>
                                            <span className="text-[#8A8A8A] text-xs font-bold">
                                                {event.interestedIds?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Action Button */}
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!currentUser) {
                                                alert('Please login to show interest in events');
                                                return;
                                            }
                                            onJoinEvent(event.id);
                                        }} 
                                        className={`px-5 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                                            isInterested 
                                                ? 'bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] text-[#8A8A8A] border border-[#3A3A3A] hover:border-[#4A4A4A]' 
                                                : 'bg-gradient-to-r from-[#118AB2] to-[#0A6A8A] text-white hover:from-[#0A6A8A] hover:to-[#118AB2]'
                                        }`}
                                    >
                                        {isInterested ? (
                                            <>
                                                <i className="fas fa-check"></i>
                                                Interested
                                            </>
                                        ) : (
                                            <>
                                                <i className="far fa-star"></i>
                                                Interested
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Empty State */}
            {filteredEvents.length === 0 && (
                <div className="text-center py-20 bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] rounded-3xl border border-[#2A2A2A]">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center mx-auto mb-6 border border-[#3A3A3A]">
                        <i className="fas fa-calendar-alt text-5xl text-[#8A8A8A]"></i>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3">
                        {activeTab === 'upcoming' ? 'No Upcoming Events' : 
                         activeTab === 'past' ? 'No Past Events' : 
                         'No Events Created By You'}
                    </h3>
                    <p className="text-[#8A8A8A] text-lg max-w-md mx-auto mb-8">
                        {searchQuery 
                            ? `No events found for "${searchQuery}"`
                            : activeTab === 'upcoming' && currentUser 
                                ? 'Be the first to host an amazing event in your community!' 
                                : 'Check back later for more exciting events'
                        }
                    </p>
                    {activeTab === 'upcoming' && currentUser && !searchQuery && (
                        <button 
                            onClick={onCreateEventClick}
                            className="bg-gradient-to-r from-[#FF6B35] to-[#FF8E53] hover:from-[#FF8E53] hover:to-[#FF6B35] text-white px-8 py-4 rounded-xl font-black text-lg flex items-center gap-3 mx-auto transition-all transform hover:scale-105 shadow-2xl"
                        >
                            <i className="fas fa-plus"></i>
                            Host Your First Event
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
