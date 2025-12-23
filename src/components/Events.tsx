
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
        
        onCreate({
            title,
            description: desc,
            date: new Date(`${date}T${time}`).toISOString(),
            time,
            location,
            image: image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
            organizerId: currentUser.id,
            attendees: [currentUser.id]
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 animate-fade-in font-sans backdrop-blur-sm">
            <div className="bg-[#242526] w-full max-w-[500px] rounded-2xl border border-[#3E4042] shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
                <div className="p-4 border-b border-[#3E4042] flex justify-between items-center bg-[#242526] rounded-t-2xl">
                    <h2 className="text-xl font-black text-[#E4E6EB] tracking-tight">Host an Event</h2>
                    <div onClick={onClose} className="w-9 h-9 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] flex items-center justify-center cursor-pointer transition-colors">
                        <i className="fas fa-times text-[#B0B3B8]"></i>
                    </div>
                </div>
                
                <div className="p-4 overflow-y-auto space-y-5 scrollbar-hide">
                    <div 
                        className="w-full h-44 bg-[#3A3B3C] rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-[#4E4F50] hover:border-[#1877F2] hover:bg-[#404142] transition-all overflow-hidden relative shadow-inner"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {image ? (
                            <img src={image} className="w-full h-full object-cover" alt="Event Cover" />
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-[#242526] rounded-full flex items-center justify-center mb-2">
                                    <i className="fas fa-camera text-xl text-[#B0B3B8]"></i>
                                </div>
                                <span className="text-[#E4E6EB] text-sm font-bold">Upload Event Cover</span>
                                <span className="text-[#B0B3B8] text-[11px] mt-1">Recommended size: 1200 x 628</span>
                            </>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">Event Name</label>
                            <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] transition-all placeholder-[#B0B3B8]" value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your event a clear name" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">Date</label>
                                <input type="date" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] transition-all" value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">Start Time</label>
                                <input type="time" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] transition-all" value={time} onChange={e => setTime(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">Location</label>
                            <div className="relative">
                                <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-[#F02849]"></i>
                                <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 pl-11 text-[#E4E6EB] outline-none focus:border-[#1877F2] transition-all placeholder-[#B0B3B8]" value={location} onChange={e => setLocation(e.target.value)} placeholder="Physical location or Online link" list="locations" />
                                <datalist id="locations">
                                    {LOCATIONS_DATA.map(l => <option key={l.name} value={l.name} />)}
                                </datalist>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">Description</label>
                            <textarea className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] h-24 resize-none transition-all placeholder-[#B0B3B8]" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What should people expect at this event?" />
                        </div>
                    </div>

                    <button onClick={handleSubmit} className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-4 rounded-xl font-black shadow-lg transition-all text-lg active:scale-[0.98] mt-2">
                        Create & Publish Event
                    </button>
                </div>
            </div>
        </div>
    );
};

interface EventsPageProps { events: Event[]; currentUser: User | null; onJoinEvent: (eventId: number) => void; onCreateEventClick: () => void; }

export const EventsPage: React.FC<EventsPageProps> = ({ events, onCreateEventClick, currentUser, onJoinEvent }) => {
    return (
        <div className="w-full max-w-[900px] mx-auto p-4 font-sans pb-20 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 mt-4">
                <div>
                    <h1 className="text-4xl font-black text-[#E4E6EB] tracking-tighter mb-1">Discover Events</h1>
                    <p className="text-[#B0B3B8] text-[16px] font-medium">Find experiences and join your community.</p>
                </div>
                {currentUser && (
                    <button onClick={onCreateEventClick} className="bg-[#1877F2] hover:bg-[#166FE5] text-white px-8 py-3 rounded-xl font-black flex items-center gap-3 transition-all shadow-xl active:scale-95 group">
                        <i className="fas fa-calendar-plus group-hover:scale-110 transition-transform"></i> Host Event
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {events.map(event => {
                    const isInterested = currentUser && event.interestedIds.includes(currentUser.id);
                    const eventDate = new Date(event.date);
                    return (
                        <div key={event.id} className="bg-[#242526] rounded-[24px] overflow-hidden border border-[#3E4042] group transition-all hover:border-[#1877F2]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] cursor-pointer shadow-md">
                            <div className="h-52 overflow-hidden relative">
                                <img src={event.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-[20px] p-2.5 text-center shadow-2xl min-w-[65px] border border-white/20">
                                    <span className="block text-[#F02849] font-black text-xs uppercase leading-tight">{eventDate.toLocaleString('default', { month: 'short' })}</span>
                                    <span className="block text-black font-black text-[28px] leading-none">{eventDate.getDate()}</span>
                                </div>
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                    <span className="text-white text-xs font-black uppercase tracking-wider">{event.location.toLowerCase().includes('online') ? 'Online' : 'In-Person'}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-[#E4E6EB] font-black text-2xl mb-2 truncate leading-tight group-hover:text-[#1877F2] transition-colors">{event.title}</h3>
                                <div className="flex flex-col gap-2 mb-6">
                                    <p className="text-[#F02849] text-[15px] font-black flex items-center gap-2">
                                        <i className="far fa-clock"></i>
                                        {eventDate.toDateString()} • {event.time}
                                    </p>
                                    <p className="text-[#B0B3B8] text-[15px] font-bold truncate flex items-center gap-2">
                                        <i className="fas fa-map-marker-alt text-[#F02849] w-4 text-center"></i>
                                        {event.location}
                                    </p>
                                </div>
                                
                                <div className="flex justify-between items-center pt-4 border-t border-[#3E4042]">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2.5">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-[#3A3B3C] border-2 border-[#242526] shadow-sm flex items-center justify-center overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?u=${event.id + i}`} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[#B0B3B8] text-[13px] font-black">{event.attendees.length + event.interestedIds.length} interested</span>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onJoinEvent(event.id);
                                        }} 
                                        className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all flex items-center gap-2 active:scale-95 ${isInterested ? 'bg-[#3A3B3C] text-[#E4E6EB] shadow-inner' : 'bg-[#1877F2] text-white hover:bg-[#166FE5] shadow-lg shadow-blue-500/20'}`}
                                    >
                                        <i className={`fas ${isInterested ? 'fa-star text-yellow-400' : 'fa-star'}`}></i>
                                        {isInterested ? 'Interested' : 'Interested'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {events.length === 0 && (
                <div className="text-center py-24 bg-[#242526] rounded-[32px] border border-[#3E4042] shadow-xl mt-4">
                    <div className="w-24 h-24 bg-[#18191A] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#3E4042] shadow-inner">
                        <i className="fas fa-calendar-day text-5xl text-[#B0B3B8]"></i>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">No upcoming events</h3>
                    <p className="text-[#B0B3B8] text-[17px] font-medium mb-8">Be the heart of your community. Start hosting today!</p>
                    {currentUser && (
                        <button onClick={onCreateEventClick} className="bg-[#1877F2] hover:bg-[#166FE5] text-white px-10 py-3 rounded-xl font-black transition-all shadow-lg active:scale-95">
                            Create First Event
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
