import React, { useState, useEffect, useRef } from 'react';
import { Story, User } from '../types';

interface StoryViewerProps {
    story: Story;
    user: User;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ story, user, onClose, onNext, onPrev }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    if (onNext) onNext();
                    return 100;
                }
                return prev + 1;
            });
        }, 50);
        return () => clearInterval(timer);
    }, [story, onNext]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            <div className="absolute inset-0 opacity-30 bg-cover bg-center blur-3xl" style={{ backgroundImage: `url(${story.image})` }}></div>
            <div className="absolute top-4 right-4 z-20 cursor-pointer" onClick={onClose}><i className="fas fa-times text-[#E4E6EB] text-2xl"></i></div>
            <div className="relative w-full max-w-[400px] h-full sm:h-[90vh] bg-black sm:rounded-lg overflow-hidden flex flex-col shadow-2xl">
                <div className="absolute top-0 left-0 right-0 p-2 z-20 flex gap-1">
                    <div className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all duration-75 ease-linear" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                <div className="absolute top-4 left-0 right-0 p-4 z-20 flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full border-2 border-[#1877F2] object-cover" />
                        <div className="flex flex-col"><span className="text-[#E4E6EB] font-semibold text-sm">{user.name}</span><span className="text-[#E4E6EB]/70 text-xs">1h</span></div>
                    </div>
                    <div className="flex gap-4"><i className="fas fa-ellipsis-h text-[#E4E6EB] text-lg"></i></div>
                </div>
                <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={onPrev}></div>
                <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={onNext}></div>
                <div className="flex-1 flex items-center justify-center bg-black"><img src={story.image} alt="Story" className="w-full h-auto max-h-full object-contain" /></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex items-center gap-2 bg-gradient-to-t from-black/60 to-transparent pt-10">
                    <input type="text" placeholder="Reply..." className="flex-1 bg-transparent border border-white/60 rounded-full py-2 px-4 text-[#E4E6EB] placeholder-white/70 outline-none focus:border-white" />
                    <i className="fas fa-thumbs-up text-blue-500 text-2xl cursor-pointer"></i><i className="fas fa-heart text-red-500 text-2xl cursor-pointer"></i>
                </div>
            </div>
        </div>
    );
};

interface StoryReelProps {
    stories: Story[];
    onProfileClick: (id: number) => void;
    onCreateStory?: (file: File) => void;
    onViewStory: (story: Story) => void;
}

export const StoryReel: React.FC<StoryReelProps> = ({ stories, onProfileClick, onCreateStory, onViewStory }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="w-full flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0] && onCreateStory) onCreateStory(e.target.files[0]); }} />
            <div className="min-w-[110px] sm:min-w-[140px] h-[200px] sm:h-[250px] bg-[#242526] rounded-xl shadow-sm overflow-hidden cursor-pointer relative group flex-shrink-0 border border-[#3E4042]" onClick={() => fileInputRef.current?.click()}>
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Create" className="h-[75%] w-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100" />
                <div className="absolute bottom-0 w-full h-[25%] bg-[#242526] flex flex-col items-center justify-end pb-2 relative"><div className="absolute -top-4 w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center border-4 border-[#242526] text-white"><i className="fas fa-plus text-sm"></i></div><span className="text-xs font-semibold text-[#E4E6EB] mt-4">Create story</span></div>
            </div>
            {stories.map((story) => (
                <div key={story.id} className="min-w-[110px] sm:min-w-[140px] h-[200px] sm:h-[250px] relative rounded-xl overflow-hidden cursor-pointer flex-shrink-0 group shadow-sm border border-[#3E4042]" onClick={() => onViewStory(story)}>
                    <img src={story.image} alt="Story" className="absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-full border-4 border-[#1877F2] overflow-hidden z-10 hover:opacity-90" onClick={(e) => { e.stopPropagation(); onProfileClick(story.userId); }}><img src={story.user?.profileImage} alt={story.user?.name} className="w-full h-full object-cover" /></div>
                    <p className="absolute bottom-3 left-3 text-white font-semibold text-sm drop-shadow-md">{story.user?.name}</p>
                </div>
            ))}
        </div>
    );
};