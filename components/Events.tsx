import React, { useState, useRef } from 'react';
import { User, Event } from '../types';
import { LOCATIONS_DATA } from '../constants';

interface CreateEventModalProps {
    currentUser: User;
    onClose: () => void;
    onCreate: (event: Partial<Event>) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ currentUser, onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];
    const defaultTime = '18:00';

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !date || !time || !location) {
            alert("Please fill all required fields");
            return;
        }
        
        const eventDate = new Date(`${date}T${time}`);
        
        onCreate({
            title,
            description: desc,
            date: eventDate.toISOString(),
            time,
            location,
            image: image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
            organizerId: currentUser.id,
            attendees: [currentUser.id],
            interestedIds: []
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="bg-[#242526] w-full max-w-[500px] rounded-xl border border-[#3E4042] shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-[#3E4042] flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#E4E6EB]">Host an Event</h2>
                    <div onClick={onClose} className="w-8 h-8 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] flex items-center justify-center cursor-pointer">
                        <i className="fas fa-times text-[#B0B3B8]"></i>
                    </div>
                </div>
                
                <div className="p-4 overflow-y-auto space-y-4">
                    <div 
                        className="w-full h-40 bg-[#3A3B3C] rounded-lg flex flex-col items-center justify-center cursor-pointer border border-dashed border-[#B0B3B8] hover:bg-[#4E4F50] transition-colors overflow-hidden relative"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {image ? (
                            <img src={image} className="w-full h-full object-cover" alt="Event Cover" />
                        ) : (
                            <>
                                <i className="fas fa-camera text-2xl text-[#E4E6EB] mb-2"></i>
                                <span className="text-[#E4E6EB] text-sm font-semibold">Upload Cover Photo</span>
                            </>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div>
                        <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Event Name <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="What's the occasion?" 
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Date <span className="text-red-500">*</span></label>
                            <input 
                                type="date" 
                                className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" 
                                value={date || defaultDate} 
                                onChange={e => setDate(e.target.value)} 
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Time <span className="text-red-500">*</span></label>
                            <input 
                                type="time" 
                                className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" 
                                value={time || defaultTime} 
                                onChange={e => setTime(e.target.value)} 
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Location <span className="text-red-500">*</span></label>
                         <input 
                            type="text" 
                            className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" 
                            value={location} 
                            onChange={e => setLocation(e.target.value)} 
                            placeholder="Where is it happening?" 
                            list="locations" 
                            required
                         />
                         <datalist id="locations">
                             {LOCATIONS_DATA.map(l => <option key={l.name} value={l.name} />)}
                         </datalist>
                    </div>

                    <div>
                        <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Details</label>
                        <textarea 
                            className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] h-20 resize-none" 
                            value={desc} 
                            onChange={e => setDesc(e.target.value)} 
                            placeholder="Share more about the event..." 
                        />
                    </div>

                    <button 
                        onClick={handleSubmit} 
                        disabled={!title || !date || !time || !location}
                        className="w-full bg-[#1877F2] hover:bg-[#166FE5] disabled:bg-[#3A3B3C] disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold shadow-md transition-colors text-lg"
                    >
                        Create & Share Event
                    </button>
                </div>
            </div>
        </div>
    );
};

interface EventsPageProps { 
    events: Event[]; 
    currentUser: User | null; 
    onJoinEvent: (eventId: number) => void; 
    onCreateEventClick: () => void; 
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, onCreateEventClick, currentUser, onJoinEvent }) => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'interested'>('upcoming');
    
    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Filter events based on active tab
    const now = new Date();
    const filteredEvents = sortedEvents.filter(event => {
        const eventDate = new Date(event.date);
        
        switch (activeTab) {
            case 'upcoming':
                return eventDate >= now;
            case 'past':
                return eventDate < now;
            case 'interested':
                return currentUser && event.interestedIds?.includes(currentUser.id);
            default:
                return true;
        }
    });

    const formatDate = (dateString: string) => {
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
    };

    return (
        <div className="w-full max-w-[900px] mx-auto p-4 font-sans pb-20 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#E4E6EB] tracking-tight">Events</h1>
                    <p className="text-[#B0B3B8] text-sm">Find and join interesting events near you.</p>
                </div>
                {currentUser && (
                    <button 
                        onClick={onCreateEventClick} 
                        className="bg-[#1877F2] hover:bg-[#166FE5] text-white px-6 py-2.5 rounded-lg font-black flex items-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                        <i className="fas fa-calendar-plus"></i> Host Event
                    </button>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-[#3E4042]">
                {(['upcoming', 'past', 'interested'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
                            activeTab === tab
                                ? 'text-[#1877F2] border-[#1877F2]'
                                : 'text-[#B0B3B8] border-transparent hover:text-[#E4E6EB]'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {tab === 'interested' && currentUser && (
                            <span className="ml-2 bg-[#3A3B3C] text-xs px-2 py-0.5 rounded-full">
                                {events.filter(e => e.interestedIds?.includes(currentUser.id)).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map(event => {
                    const isInterested = currentUser && event.interestedIds?.includes(currentUser.id);
                    const eventDate = new Date(event.date);
                    const isPast = eventDate < new Date();
                    
                    return (
                        <div 
                            key={event.id} 
                            className="bg-[#242526] rounded-2xl overflow-hidden border border-[#3E4042] group transition-all hover:border-[#4E4F50] hover:shadow-xl shadow-sm"
                        >
                            <div className="h-44 overflow-hidden relative">
                                <img 
                                    src={event.image} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    alt={event.title} 
                                />
                                {isPast && (
                                    <div className="absolute top-3 left-3 bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold">
                                        PAST
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white rounded-xl p-2 text-center shadow-2xl min-w-[55px] border border-gray-100">
                                    <span className="block text-[#F02849] font-black text-[10px] uppercase leading-tight">
                                        {eventDate.toLocaleString('default', { month: 'short' })}
                                    </span>
                                    <span className="block text-black font-black text-2xl leading-none">
                                        {eventDate.getDate()}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-[#E4E6EB] font-bold text-xl mb-2 truncate leading-tight">{event.title}</h3>
                                
                                <div className="space-y-2 mb-4">
                                    <p className="text-[#F02849] text-sm font-black flex items-center gap-2">
                                        <i className="far fa-clock"></i>
                                        {formatDate(event.date)} • {event.time}
                                    </p>
                                    <p className="text-[#B0B3B8] text-sm flex items-center gap-2">
                                        <i className="fas fa-map-marker-alt text-[#F02849]"></i>
                                        {event.location}
                                    </p>
                                    {event.description && (
                                        <p className="text-[#B0B3B8] text-sm line-clamp-2">
                                            {event.description}
                                        </p>
                                    )}
                                </div>
                                
                                <div className="flex justify-between items-center pt-3 border-t border-[#3E4042]">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-gray-600 border-2 border-[#242526]"></div>
                                            ))}
                                        </div>
                                        <span className="text-[#B0B3B8] text-xs font-bold">
                                            {event.attendees?.length || 0} going • {event.interestedIds?.length || 0} interested
                                        </span>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!currentUser) {
                                                alert('Please login to show interest in events');
                                                return;
                                            }
                                            onJoinEvent(event.id);
                                        }} 
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                                            isInterested 
                                                ? 'bg-[#3A3B3C] text-[#E4E6EB] hover:bg-[#4E4F50]' 
                                                : 'bg-[#1877F2] text-white hover:bg-[#166FE5]'
                                        }`}
                                    >
                                        <i className={`fas ${isInterested ? 'fa-check' : 'fa-star'}`}></i>
                                        {isInterested ? 'Interested ✓' : 'Interested'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {filteredEvents.length === 0 && (
                <div className="text-center py-20 bg-[#242526] rounded-3xl border border-[#3E4042]">
                    <div className="w-20 h-20 bg-[#18191A] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#3E4042]">
                        <i className="fas fa-calendar-alt text-4xl text-[#B0B3B8]"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                        {activeTab === 'upcoming' ? 'No upcoming events' : 
                         activeTab === 'past' ? 'No past events' : 
                         'No events you\'re interested in'}
                    </h3>
                    <p className="text-[#B0B3B8] text-sm mb-4">
                        {activeTab === 'upcoming' && currentUser 
                            ? 'Be the first to host an event in your community!' 
                            : 'Check back later for more events'}
                    </p>
                    {activeTab === 'upcoming' && currentUser && (
                        <button 
                            onClick={onCreateEventClick}
                            className="bg-[#1877F2] hover:bg-[#166FE5] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 mx-auto"
                        >
                            <i className="fas fa-plus"></i> Create Your First Event
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
