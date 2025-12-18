
import React, { useState, useEffect, useRef } from 'react';
import { Story, User, Song } from '../types';
/* Added INITIAL_USERS to imports to fix the reference in StoryReel component */
import { MOCK_SONGS, INITIAL_USERS } from '../constants';

interface StoryViewerProps {
    story: Story;
    user: User;
    currentUser: User | null;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    onReply?: (text: string) => void;
    onLike?: () => void;
    onFollow?: (id: number) => void;
    isFollowing?: boolean;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ story, user, currentUser, onClose, onNext, onPrev, onReply, onLike, onFollow, isFollowing }) => {
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [replyText, setReplyText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Auto-advance logic (Standard 5s for images/text)
    useEffect(() => {
        let duration = 5000; 

        const timer = setInterval(() => {
            if (!isPaused) {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        if (onNext) onNext();
                        return 100;
                    }
                    const increment = 100 / (duration / 50); 
                    return Math.min(100, prev + increment);
                });
            }
        }, 50); 

        return () => clearInterval(timer);
    }, [story.id, onNext, isPaused]);

    // Handle Music Playback
    useEffect(() => {
        if (story.music && story.music.url) {
            audioRef.current = new Audio(story.music.url);
            audioRef.current.volume = 0.5;
            if(story.music.startTime) {
                audioRef.current.addEventListener('loadedmetadata', () => {
                    if(audioRef.current && story.music?.startTime) {
                         audioRef.current.currentTime = (story.music.startTime / 100) * audioRef.current.duration;
                    }
                });
            }
            audioRef.current.play().catch(() => {});
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [story.id]);

    const handleSendReply = () => {
        if (replyText.trim() && onReply) {
            onReply(replyText);
            setReplyText('');
            setIsPaused(false);
            alert("Reply sent!");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-fade-in">
            <div className="absolute inset-0 opacity-30 bg-cover bg-center blur-3xl" style={{ backgroundImage: story.image ? `url(${story.image})` : undefined, background: !story.image ? story.background : undefined }}></div>
            
            <div className="absolute top-4 right-4 z-30 cursor-pointer w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors" onClick={onClose}>
                <i className="fas fa-times text-[#E4E6EB] text-2xl"></i>
            </div>

            <div className="relative w-full max-w-[420px] h-full sm:h-[90vh] bg-black sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                <div className="absolute top-0 left-0 right-0 p-3 z-20 flex gap-1.5">
                    <div className="h-1 bg-white/20 flex-1 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all duration-75 ease-linear" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="absolute top-4 left-0 right-0 p-4 z-20 flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full border-2 border-[#1877F2] object-cover shadow-lg" />
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-sm drop-shadow-md">{user.name}</span>
                                {!isFollowing && currentUser?.id !== user.id && onFollow && (
                                    <button onClick={(e) => { e.stopPropagation(); onFollow(user.id); }} className="text-white text-[10px] font-bold border border-white/40 px-2 py-0.5 rounded-md hover:bg-white/20 backdrop-blur-md transition-colors">Follow</button>
                                )}
                            </div>
                            <span className="text-white/70 text-[11px] drop-shadow-md font-medium">Just now</span>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={onPrev}></div>
                <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={onNext}></div>
                
                <div className="flex-1 flex items-center justify-center bg-[#111] relative" onDoubleClick={onLike}>
                    {story.type === 'text' ? (
                        <div className="w-full h-full flex items-center justify-center p-10 text-center" style={{ background: story.background }}>
                            <span className="text-white font-bold text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] whitespace-pre-wrap">{story.text}</span>
                        </div>
                    ) : (
                        <img src={story.image} alt="Story" className="w-full h-full object-cover" />
                    )}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent pt-12">
                    <div className="flex-1 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2.5 focus-within:bg-white/20 transition-all">
                        <input 
                            ref={inputRef}
                            type="text" 
                            placeholder="Send message..." 
                            className="bg-transparent text-white placeholder-white/60 outline-none w-full text-[15px]"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onFocus={() => setIsPaused(true)}
                            onBlur={() => { if(!replyText) setIsPaused(false); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(); }}
                        />
                        {replyText && <i className="fas fa-paper-plane text-[#1877F2] cursor-pointer" onClick={handleSendReply}></i>}
                    </div>
                    <div onClick={onLike} className="w-10 h-10 flex items-center justify-center cursor-pointer active:scale-125 transition-transform">
                        <i className="fas fa-heart text-[#F3425F] text-3xl drop-shadow-lg"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CreateStoryModal: React.FC<{ currentUser: User, onClose: () => void, onCreate: (story: Partial<Story>) => void }> = ({ currentUser, onClose, onCreate }) => {
    const [mode, setMode] = useState<'text' | 'image'>('image');
    const [text, setText] = useState('');
    const [background, setBackground] = useState('linear-gradient(45deg, #1877F2, #0055FF)');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedMusic, setSelectedMusic] = useState<Song | null>(null);
    const [showMusicPicker, setShowMusicPicker] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreate = () => {
        if (mode === 'text' && !text.trim()) return;
        if (mode === 'image' && !imageFile) {
            fileInputRef.current?.click();
            return;
        }

        setIsPosting(true);

        // Professional simulation of upload delay
        setTimeout(() => {
            const newStory: Partial<Story> = {
                userId: currentUser.id,
                type: mode,
                text: mode === 'text' ? text : undefined,
                background: mode === 'text' ? background : undefined,
                image: mode === 'image' && imageFile ? URL.createObjectURL(imageFile) : undefined,
                music: selectedMusic ? { url: selectedMusic.audioUrl, title: selectedMusic.title, artist: selectedMusic.artist, startTime: 0 } : undefined,
            };
            onCreate(newStory);
            setIsPosting(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col font-sans animate-fade-in text-white">
            <div className="flex justify-between items-center p-4 bg-black/60 backdrop-blur-lg absolute top-0 w-full z-20 border-b border-white/5">
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"><i className="fas fa-times text-xl"></i></button>
                <h3 className="font-bold text-lg">Create Story</h3>
                <button onClick={() => setShowMusicPicker(true)} className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${selectedMusic ? 'bg-white text-black' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}>
                    <i className="fas fa-music"></i> {selectedMusic ? selectedMusic.title : 'Add Music'}
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center relative overflow-hidden" style={{ background: mode === 'text' ? background : '#000' }}>
                {mode === 'text' ? (
                    <textarea 
                        autoFocus
                        placeholder="Start typing..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="bg-transparent text-white text-4xl font-bold text-center w-full max-w-lg outline-none resize-none placeholder-white/40 px-10 h-[60vh] flex items-center"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#000]" onClick={() => !imageFile && fileInputRef.current?.click()}>
                        {imageFile ? (
                            <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-contain" alt="" />
                        ) : (
                            <div className="text-center cursor-pointer animate-pulse">
                                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/20">
                                    <i className="fas fa-image text-4xl text-white/70"></i>
                                </div>
                                <p className="font-bold text-white/70">Tap to upload photo</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => { if(e.target.files) setImageFile(e.target.files[0]); }} />
                    </div>
                )}

                {isPosting && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[30] flex flex-col items-center justify-center animate-fade-in">
                        <div className="w-16 h-16 border-4 border-[#1877F2] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-bold text-xl">Sharing to Story...</p>
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent z-20 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                    <div className="flex gap-2 bg-white/10 p-1 rounded-full backdrop-blur-md border border-white/10">
                        <button onClick={() => setMode('text')} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${mode === 'text' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>Text</button>
                        <button onClick={() => setMode('image')} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${mode === 'image' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>Photo</button>
                    </div>
                    
                    <button onClick={handleCreate} disabled={isPosting} className="w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(24,119,242,0.4)] hover:bg-[#166FE5] transition-all transform active:scale-90">
                        <i className="fas fa-check text-2xl"></i>
                    </button>
                </div>
            </div>

            {showMusicPicker && (
                <div className="absolute inset-0 bg-black/80 z-50 flex flex-col justify-end animate-fade-in" onClick={() => setShowMusicPicker(false)}>
                    <div className="bg-[#242526] rounded-t-3xl h-[70%] overflow-hidden flex flex-col border-t border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#18191A]">
                            <h3 className="font-bold text-lg">Choose Music</h3>
                            <i className="fas fa-times text-[#B0B3B8] cursor-pointer" onClick={() => setShowMusicPicker(false)}></i>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 bg-[#18191A] space-y-1">
                            {MOCK_SONGS.map(song => (
                                <div key={song.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-2xl cursor-pointer transition-colors" onClick={() => { setSelectedMusic(song); setShowMusicPicker(false); }}>
                                    <img src={song.cover} className="w-14 h-14 rounded-xl object-cover shadow-md" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-[15px] text-[#E4E6EB] truncate">{song.title}</div>
                                        <div className="text-xs text-[#B0B3B8] truncate">{song.artist}</div>
                                    </div>
                                    {selectedMusic?.id === song.id && <i className="fas fa-check-circle text-[#1877F2] text-xl"></i>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const StoryReel: React.FC<{ stories: Story[], onProfileClick: (id: number) => void, onCreateStory?: () => void, onViewStory: (story: Story) => void, currentUser: User | null, onRequestLogin: () => void }> = ({ stories, onProfileClick, onCreateStory, onViewStory, currentUser, onRequestLogin }) => {
    return (
        <div className="w-full flex gap-2.5 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <div className="min-w-[110px] sm:min-w-[140px] h-[210px] sm:h-[250px] bg-[#242526] rounded-2xl shadow-md overflow-hidden cursor-pointer relative group flex-shrink-0 border border-[#3E4042] transition-transform hover:scale-[1.02]" onClick={() => currentUser ? (onCreateStory && onCreateStory()) : onRequestLogin()}>
                <img src={currentUser?.profileImage || INITIAL_USERS[0].profileImage} alt="Create" className="h-[75%] w-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80" />
                <div className="absolute bottom-0 w-full h-[25%] bg-[#242526] flex flex-col items-center justify-end pb-3">
                    <div className="absolute -top-5 w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center border-4 border-[#242526] text-white shadow-lg">
                        <i className="fas fa-plus text-lg"></i>
                    </div>
                    <span className="text-xs font-bold text-[#E4E6EB] mt-4">Create Story</span>
                </div>
            </div>

            {stories.map((story) => (
                <div key={story.id} className="min-w-[110px] sm:min-w-[140px] h-[210px] sm:h-[250px] relative rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 group shadow-lg border border-white/10 hover:border-[#1877F2]/50 transition-all" onClick={() => onViewStory(story)}>
                    {story.type === 'text' ? (
                        <div className="absolute w-full h-full flex items-center justify-center p-3 text-center" style={{ background: story.background }}>
                            <span className="text-white font-bold text-[10px] line-clamp-4 leading-tight">{story.text}</span>
                        </div>
                    ) : (
                        <img src={story.image} alt="Story" className="absolute w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-full border-4 border-[#1877F2] overflow-hidden z-10 shadow-md" onClick={(e) => { e.stopPropagation(); onProfileClick(story.userId); }}>
                        <img src={story.user?.profileImage} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="absolute bottom-3 left-3 text-white font-bold text-xs drop-shadow-md truncate w-[85%]">{story.user?.name}</p>
                </div>
            ))}
        </div>
    );
};
