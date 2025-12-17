
import React, { useState, useEffect, useRef } from 'react';
import { Story, User, Song } from '../types';
import { MOCK_SONGS } from '../constants';

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
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Auto-advance logic
    useEffect(() => {
        const timer = setInterval(() => {
            if (!isPaused) {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        if (onNext) onNext();
                        return 100;
                    }
                    // Slower progress for video if playing, else default
                    return prev + (story.type === 'video' ? 0.5 : 1);
                });
            }
        }, 50); 
        return () => clearInterval(timer);
    }, [story, onNext, isPaused]);

    // Handle Music Playback (Audio only)
    useEffect(() => {
        if (story.music && story.music.url) {
            audioRef.current = new Audio(story.music.url);
            audioRef.current.volume = 0.5;
            if(story.music.startTime) {
                audioRef.current.currentTime = (story.music.startTime / 100) * (audioRef.current.duration || 180); // Estimate duration if not loaded, fallback to start
                // Better approach: listen for metadata load
                audioRef.current.addEventListener('loadedmetadata', () => {
                    if(audioRef.current && story.music && story.music.startTime) {
                         audioRef.current.currentTime = (story.music.startTime / 100) * audioRef.current.duration;
                    }
                });
            }
            audioRef.current.play().catch(e => console.warn("Audio play error", e));
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [story]);

    // Handle Video Playback
    useEffect(() => {
        if (story.type === 'video' && videoRef.current) {
            if (isPaused) videoRef.current.pause();
            else videoRef.current.play().catch(() => {});
        }
    }, [isPaused, story]);

    // Pause audio when paused
    useEffect(() => {
        if (audioRef.current) {
            if (isPaused) audioRef.current.pause();
            else audioRef.current.play().catch(() => {});
        }
    }, [isPaused]);

    const handleSendReply = () => {
        if (replyText.trim() && onReply) {
            onReply(replyText);
            setReplyText('');
            setIsPaused(false);
            if(inputRef.current) inputRef.current.blur();
            alert("Reply sent to inbox");
        }
    };

    const isSelf = currentUser?.id === user.id;

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            {/* Blurry Background */}
            <div className="absolute inset-0 opacity-30 bg-cover bg-center blur-3xl" style={{ backgroundImage: story.image && story.type !== 'video' ? `url(${story.image})` : undefined, background: !story.image ? story.background : undefined }}></div>
            
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-30 cursor-pointer w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors" onClick={onClose}>
                <i className="fas fa-times text-[#E4E6EB] text-2xl"></i>
            </div>

            <div className="relative w-full max-w-[400px] h-full sm:h-[90vh] bg-black sm:rounded-lg overflow-hidden flex flex-col shadow-2xl">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 p-2 z-20 flex gap-1">
                    <div className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all duration-75 ease-linear" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Header (User Info & Follow) */}
                <div className="absolute top-4 left-0 right-0 p-4 z-20 flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full border-2 border-[#1877F2] object-cover" />
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-[#E4E6EB] font-semibold text-sm drop-shadow-md">{user.name}</span>
                                {!isFollowing && !isSelf && onFollow && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onFollow(user.id); }} 
                                        className="text-white text-xs font-bold border border-white/60 px-2 py-0.5 rounded-md hover:bg-white/20 backdrop-blur-md transition-colors"
                                    >
                                        Follow
                                    </button>
                                )}
                            </div>
                            <span className="text-[#E4E6EB]/80 text-xs drop-shadow-md">1h</span>
                        </div>
                    </div>
                    {story.music && (
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 animate-pulse">
                            <i className="fas fa-music text-white text-xs"></i>
                            <span className="text-white text-xs truncate max-w-[100px]">{story.music.title}</span>
                        </div>
                    )}
                </div>

                {/* Navigation Hotspots */}
                <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={onPrev}></div>
                <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={onNext}></div>
                
                {/* Main Content Area */}
                <div className="flex-1 flex items-center justify-center bg-black relative" onDoubleClick={onLike}>
                    {story.type === 'text' ? (
                        <div 
                            className="w-full h-full flex items-center justify-center p-8 text-center"
                            style={{ background: story.background || 'linear-gradient(45deg, #1877F2, #0055FF)' }}
                        >
                            <span className="text-white font-bold text-3xl drop-shadow-md whitespace-pre-wrap">{story.text}</span>
                        </div>
                    ) : story.type === 'video' ? (
                        <video ref={videoRef} src={story.image} className="w-full h-auto max-h-full object-contain" autoPlay playsInline loop muted={!!story.music} />
                    ) : (
                        <img src={story.image} alt="Story" className="w-full h-auto max-h-full object-contain" />
                    )}
                </div>
                
                {/* Footer Reply Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex items-center gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12">
                    <div className="flex-1 flex items-center gap-2 bg-transparent border border-white/60 rounded-full px-4 py-2 focus-within:border-white focus-within:bg-black/40 transition-colors">
                        <input 
                            ref={inputRef}
                            type="text" 
                            placeholder="Send message..." 
                            className="bg-transparent text-[#E4E6EB] placeholder-white/70 outline-none w-full text-sm"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onFocus={() => setIsPaused(true)} // Pause story
                            onBlur={() => {
                                if(!replyText) setIsPaused(false); // Resume if empty
                            }}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(); }}
                        />
                        {replyText && (
                            <i className="fas fa-paper-plane text-white cursor-pointer hover:text-[#1877F2]" onClick={handleSendReply}></i>
                        )}
                    </div>
                    <div onClick={onLike} className="w-10 h-10 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                        <i className="fas fa-heart text-red-500 text-3xl drop-shadow-md"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface CreateStoryModalProps {
    currentUser: User;
    onClose: () => void;
    onCreate: (story: Partial<Story>) => void;
}

const BACKGROUNDS = [
    'linear-gradient(45deg, #1877F2, #0055FF)', // Blue
    'linear-gradient(45deg, #FF0057, #E64C4C)', // Red
    'linear-gradient(45deg, #45BD62, #26A69A)', // Green
    'linear-gradient(45deg, #A033FF, #6200EA)', // Purple
    'linear-gradient(45deg, #F7B928, #FF8F00)', // Orange
    'linear-gradient(to right, #434343 0%, black 100%)', // Black
    'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)' // Sunset
];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ currentUser, onClose, onCreate }) => {
    const [mode, setMode] = useState<'text' | 'media'>('media');
    const [text, setText] = useState('');
    const [background, setBackground] = useState(BACKGROUNDS[0]);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [selectedMusic, setSelectedMusic] = useState<Song | null>(null);
    const [showMusicPicker, setShowMusicPicker] = useState(false);
    const [musicStartTime, setMusicStartTime] = useState(0); // 0-100 percentage
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    const handleCreate = () => {
        if (mode === 'text' && !text) return;
        if (mode === 'media' && !mediaFile) return;

        const isVideo = mediaFile?.type.startsWith('video');

        const newStory: Partial<Story> = {
            userId: currentUser.id,
            type: mode === 'text' ? 'text' : (isVideo ? 'video' : 'image'),
            text: mode === 'text' ? text : undefined,
            background: mode === 'text' ? background : undefined,
            image: mode === 'media' && mediaFile ? URL.createObjectURL(mediaFile) : undefined,
            music: selectedMusic ? {
                url: selectedMusic.audioUrl,
                title: selectedMusic.title,
                artist: selectedMusic.artist,
                cover: selectedMusic.cover,
                startTime: musicStartTime
            } : undefined,
            createdAt: Date.now()
        };
        onCreate(newStory);
    };

    const handleLocalAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedMusic({
                id: 'local',
                title: file.name,
                artist: 'Local File',
                audioUrl: URL.createObjectURL(file),
                cover: '',
                duration: '',
                stats: { plays:0, downloads:0, shares:0, likes:0, reelsUse:0 },
                album: ''
            });
            setShowMusicPicker(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col font-sans animate-fade-in text-white">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-black/50 backdrop-blur-md absolute top-0 w-full z-20">
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40"><i className="fas fa-times text-xl"></i></button>
                <h3 className="font-bold">Create Story</h3>
                <button onClick={() => setShowMusicPicker(true)} className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${selectedMusic ? 'bg-white text-black' : 'bg-black/40 text-white border border-white/20'}`}>
                    <i className="fas fa-music"></i> {selectedMusic ? selectedMusic.title : 'Music'}
                </button>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden" style={{ background: mode === 'text' ? background : '#111' }}>
                {mode === 'text' ? (
                    <textarea 
                        autoFocus
                        placeholder="Start typing..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="bg-transparent text-white text-3xl font-bold text-center w-full max-w-md outline-none resize-none placeholder-white/50 h-full flex items-center justify-center py-20"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#111]" onClick={() => !mediaFile && fileInputRef.current?.click()}>
                        {mediaFile ? (
                            mediaFile.type.startsWith('video') ? (
                                <video src={URL.createObjectURL(mediaFile)} className="w-full h-full object-contain" autoPlay loop muted playsInline />
                            ) : (
                                <img src={URL.createObjectURL(mediaFile)} className="w-full h-full object-contain" />
                            )
                        ) : (
                            <div className="text-center cursor-pointer">
                                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 hover:bg-white/20 transition-colors">
                                    <i className="fas fa-image text-3xl"></i>
                                </div>
                                <p className="font-bold">Tap to upload</p>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={(e) => { if(e.target.files) setMediaFile(e.target.files[0]); }} />
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent z-20 flex flex-col gap-4">
                
                {/* Music Trimmer UI */}
                {selectedMusic && (
                    <div className="bg-black/60 p-3 rounded-xl backdrop-blur-md">
                        <div className="flex justify-between text-xs text-white mb-1">
                            <span>Trim Audio Start</span>
                            <span>{Math.round(musicStartTime)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={musicStartTime} 
                            onChange={(e) => setMusicStartTime(Number(e.target.value))}
                            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                    </div>
                )}

                {mode === 'text' && (
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center">
                        {BACKGROUNDS.map(bg => (
                            <div 
                                key={bg} 
                                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${background === bg ? 'border-white' : 'border-transparent'}`} 
                                style={{ background: bg }}
                                onClick={() => setBackground(bg)}
                            ></div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-end">
                    <div className="flex gap-4 bg-black/60 p-1.5 rounded-full backdrop-blur-md">
                        <button onClick={() => setMode('text')} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'text' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>Aa Text</button>
                        <button onClick={() => setMode('media')} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${mode === 'media' ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>Media</button>
                    </div>
                    
                    <button onClick={handleCreate} className="w-14 h-14 bg-[#1877F2] rounded-full flex items-center justify-center shadow-lg hover:bg-[#166FE5] transition-colors">
                        <i className="fas fa-chevron-right text-2xl"></i>
                    </button>
                </div>
            </div>

            {/* Music Picker Bottom Sheet */}
            {showMusicPicker && (
                <div className="absolute inset-0 bg-black/80 z-30 flex flex-col justify-end animate-fade-in" onClick={() => setShowMusicPicker(false)}>
                    <div className="bg-[#242526] rounded-t-2xl h-[60%] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-[#3E4042] flex justify-between items-center">
                            <h3 className="font-bold">Select Music</h3>
                            <button onClick={() => setShowMusicPicker(false)}><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-4 border-b border-[#3E4042]">
                            <button onClick={() => audioInputRef.current?.click()} className="w-full py-3 border-2 border-dashed border-[#3E4042] rounded-lg text-sm font-bold text-[#B0B3B8] hover:border-[#E4E6EB] hover:text-[#E4E6EB] transition-colors">
                                <i className="fas fa-upload mr-2"></i> Upload from Device
                            </button>
                            <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" onChange={handleLocalAudio} />
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {MOCK_SONGS.map(song => (
                                <div key={song.id} className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer" onClick={() => { setSelectedMusic(song); setShowMusicPicker(false); }}>
                                    <img src={song.cover} className="w-10 h-10 rounded object-cover" alt="" />
                                    <div className="flex-1">
                                        <div className="font-bold text-sm">{song.title}</div>
                                        <div className="text-xs text-[#B0B3B8]">{song.artist}</div>
                                    </div>
                                    {selectedMusic?.id === song.id && <i className="fas fa-check text-[#1877F2]"></i>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface StoryReelProps {
    stories: Story[];
    onProfileClick: (id: number) => void;
    onCreateStory?: () => void;
    onViewStory: (story: Story) => void;
    currentUser: User | null;
    onRequestLogin: () => void;
}

export const StoryReel: React.FC<StoryReelProps> = ({ stories, onProfileClick, onCreateStory, onViewStory, currentUser, onRequestLogin }) => {
    return (
        <div className="w-full flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            
            {/* Create Story Card */}
            <div className="min-w-[110px] sm:min-w-[140px] h-[200px] sm:h-[250px] bg-[#242526] rounded-xl shadow-sm overflow-hidden cursor-pointer relative group flex-shrink-0 border border-[#3E4042]" onClick={() => currentUser ? (onCreateStory && onCreateStory()) : onRequestLogin()}>
                <img src={currentUser ? currentUser.profileImage : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} alt="Create" className="h-[75%] w-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100" />
                <div className="absolute bottom-0 w-full h-[25%] bg-[#242526] flex flex-col items-center justify-end pb-2 relative">
                    <div className="absolute -top-4 w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center border-4 border-[#242526] text-white">
                        <i className="fas fa-plus text-sm"></i>
                    </div>
                    <span className="text-xs font-semibold text-[#E4E6EB] mt-4">Create story</span>
                </div>
            </div>

            {/* Story Items */}
            {stories.map((story) => (
                <div key={story.id} className="min-w-[110px] sm:min-w-[140px] h-[200px] sm:h-[250px] relative rounded-xl overflow-hidden cursor-pointer flex-shrink-0 group shadow-sm border border-[#3E4042]" onClick={() => onViewStory(story)}>
                    {story.type === 'text' ? (
                        <div className="absolute w-full h-full flex items-center justify-center p-2 text-center" style={{ background: story.background }}>
                            <span className="text-white font-bold text-xs line-clamp-3">{story.text}</span>
                        </div>
                    ) : story.type === 'video' ? (
                        <video src={story.image} className="absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" muted />
                    ) : (
                        <img src={story.image} alt="Story" className="absolute w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-full border-4 border-[#1877F2] overflow-hidden z-10 hover:opacity-90 transition-opacity" onClick={(e) => { e.stopPropagation(); onProfileClick(story.userId); }}>
                        <img src={story.user?.profileImage} alt={story.user?.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="absolute bottom-3 left-3 text-white font-semibold text-sm drop-shadow-md truncate w-[90%]">{story.user?.name}</p>
                    {story.music && <div className="absolute top-3 right-3 text-white text-xs drop-shadow-md"><i className="fas fa-music"></i></div>}
                    {story.type === 'video' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 text-2xl"><i className="fas fa-play"></i></div>}
                </div>
            ))}
        </div>
    );
};
