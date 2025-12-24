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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];
    const defaultTime = '18:00';

    console.log('🎬 Modal initialized with:', { 
        title, date, time, location, desc, 
        currentUser: currentUser?.name, 
        hasImage: !!image 
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('📸 File input changed');
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log('📁 File selected:', file.name, file.size);
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setImage(ev.target.result as string);
                    console.log('✅ Image loaded successfully');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🚀 Form submit triggered');
        
        // Debug form values
        console.log('📋 Form values:', { title, date, time, location, desc });
        
        if (!title || !date || !time || !location) {
            console.error('❌ Validation failed:', { 
                hasTitle: !!title, 
                hasDate: !!date, 
                hasTime: !!time, 
                hasLocation: !!location 
            });
            alert("Please fill all required fields");
            return;
        }
        
        try {
            setIsSubmitting(true);
            console.log('⏳ Starting submission...');
            
            // Combine date and time into a single datetime string
            const eventDate = new Date(`${date}T${time}:00`);
            console.log('📅 Parsed event date:', eventDate);
            
            // Validate date is in the future
            if (eventDate <= new Date()) {
                console.error('❌ Date validation failed - event is in the past');
                alert("Event date must be in the future");
                setIsSubmitting(false);
                return;
            }
            
            const newEvent = {
                id: Date.now(),
                title,
                description: desc,
                date: eventDate.toISOString(),
                time,
                location,
                image: image || 'https://images.unsplash.com/photo-1540575467063-178a50935278?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
                organizerId: currentUser.id,
                attendees: [currentUser.id],
                interestedIds: []
            };
            
            console.log('🎯 Calling onCreate with event:', newEvent);
            console.log('👤 Current user:', currentUser);
            
            // Call the onCreate function with the complete event
            onCreate(newEvent);
            
            console.log('✅ onCreate completed');
            
            // Show success message
            alert(`Event "${title}" created successfully! It will appear in your feed and events page.`);
            
            // Close modal
            onClose();
        } catch (error) {
            console.error('❌ Error creating event:', error);
            alert('Failed to create event. Please try again.');
        } finally {
            setIsSubmitting(false);
            console.log('🏁 Submission finished');
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
                        onClick={() => {
                            console.log('📸 Clicked image upload');
                            fileInputRef.current?.click();
                        }}
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
                            onChange={e => {
                                console.log('📝 Title changed:', e.target.value);
                                setTitle(e.target.value);
                            }} 
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
                                value={date || defaultDate} 
                                onChange={e => {
                                    console.log('📅 Date changed:', e.target.value);
                                    setDate(e.target.value);
                                }} 
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
                                value={time || defaultTime} 
                                onChange={e => {
                                    console.log('⏰ Time changed:', e.target.value);
                                    setTime(e.target.value);
                                }} 
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
                            onChange={e => {
                                console.log('📍 Location changed:', e.target.value);
                                setLocation(e.target.value);
                            }} 
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
                            onChange={e => {
                                console.log('📝 Description changed:', e.target.value);
                                setDesc(e.target.value);
                            }} 
                            placeholder="Tell people more about your event. What can they expect?" 
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={!title || !date || !time || !location || isSubmitting}
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
                    
                    {/* Debug Info - Remove in production */}
                    <div className="bg-[#1A1A1A]/50 p-3 rounded-xl border border-[#3A3A3A]">
                        <div className="text-xs text-[#8A8A8A] font-mono">
                            <div>Form Status: {(!title || !date || !time || !location) ? '❌ Incomplete' : '✅ Complete'}</div>
                            <div>Fields: Title={title ? '✅' : '❌'} Date={date ? '✅' : '❌'} Time={time ? '✅' : '❌'} Location={location ? '✅' : '❌'}</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
