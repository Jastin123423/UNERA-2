
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
        <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="bg-[#242526] w-full max-w-[500px] rounded-xl border border-[#3E4042] shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-[#3E4042] flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#E4E6EB]">Create Event</h2>
                    <div onClick={onClose} className="w-8 h-8 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] flex items-center justify-center cursor-pointer">
                        <i className="fas fa-times text-[#B0B3B8]"></i>
                    </div>
                </div>
                
                <div className="p-4 overflow-y-auto space-y-4">
                    {/* Image Upload */}
                    <div 
                        className="w-full h-40 bg-[#3A3B3C] rounded-lg flex flex-col items-center justify-center cursor-pointer border border-dashed border-[#B0B3B8] hover:bg-[#4E4F50] transition-colors overflow-hidden relative"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {image ? (
                            <img src={image} className="w-full h-full object-cover" alt="Event Cover" />
                        ) : (
                            <>
                                <i className="fas fa-camera text-2xl text-[#E4E6EB] mb-2"></i>
                                <span className="text-[#E4E6EB] text-sm font-semibold">Add Cover Photo</span>
                            </>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div>
                        <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Event Name</label>
                        <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event name" />
                    </div>

                    <div>
                        <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Date & Time</label>
                        <div className="flex gap-2">
                            <input type="date" className="flex-1 bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={date} onChange={e => setDate(e.target.value)} />
                            <input type="time" className="flex-1 bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={time} onChange={e => setTime(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Location</label>
                         <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" list="locations" />
                         <datalist id="locations">
                             {LOCATIONS_DATA.map(l => <option key={l.name} value={l.name} />)}
                         </datalist>
                    </div>

                    <div>
                        <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Description</label>
                        <textarea className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] h-20 resize-none" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What are the details?" />
                    </div>

                    <button onClick={handleSubmit} className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-2.5 rounded-lg font-bold shadow-md transition-colors">Create Event</button>
                </div>
            </div>
        </div>
    );
};
