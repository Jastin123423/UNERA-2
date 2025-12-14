
import React, { useState, useRef, useEffect } from 'react';
import { User, Reel, ReactionType, Song } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ReactionButton } from './Feed';
import { MOCK_SONGS } from '../constants';

// --- CREATE REEL COMPONENT (TIKTOK STYLE) ---
interface CreateReelProps {
    currentUser: User;
    onClose: () => void;
    onSubmit: (file: File, caption: string, song: string, effect: string, isCompressed: boolean) => void;
}

export const CreateReel: React.FC<CreateReelProps> = ({ currentUser, onClose, onSubmit }) => {
    const [step, setStep] = useState<'upload' | 'editor' | 'details'>('upload');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    
    // Editor State
    const [activeTool, setActiveTool] = useState<'music' | 'text' | 'effects' | 'trim' | null>(null);
    const [overlayText, setOverlayText] = useState<{id: number, text: string, x: number, y: number}[]>([]);
    const [tempText, setTempText] = useState('');
    const [selectedSong, setSelectedSong] = useState<string>('Original Audio');
    const [selectedEffect, setSelectedEffect] = useState<string>('');
    const [trimRange, setTrimRange] = useState([0, 100]); // Mock percentage

    // Details State
    const [caption, setCaption] = useState('');
    const [privacy, setPrivacy] = useState('Public');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setVideoFile(file);
            setVideoPreview(url);
            setStep('editor');
        }
    };

    const handleAddText = () => {
        if (tempText.trim()) {
            setOverlayText([...overlayText, { id: Date.now(), text: tempText, x: 50, y: 50 }]);
            setTempText('');
            setActiveTool(null);
        }
    };

    const handlePost = () => {
        if (videoFile) {
            onSubmit(videoFile, caption, selectedSong, selectedEffect, false);
            onClose();
        }
    };

    // Tools Configuration
    const tools = [
        { id: 'music', icon: 'music', label: 'Sound', action: () => setActiveTool('music') },
        { id: 'text', icon: 'font', label: 'Text', action: () => setActiveTool('text') },
        { id: 'effects', icon: 'magic', label: 'Effect', action: () => setActiveTool('effects') },
        { id: 'trim', icon: 'cut', label: 'Trim', action: () => setActiveTool('trim') },
        { id: 'voice', icon: 'microphone', label: 'Voice', action: () => alert("Voiceover coming soon") },
    ];

    const effectsList = ['Neon', 'Vintage', 'Glitch', 'Sparkle', 'B&W'];

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col font-sans animate-fade-in text-white">
            {/* Header */}
            {step !== 'editor' && (
                <div className="flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md absolute top-0 left-0 right-0 z-50 border-b border-white/5">
                    <button onClick={step === 'details' ? () => setStep('editor') : onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                        <i className={`fas ${step === 'details' ? 'fa-arrow-left' : 'fa-times'} text-xl`}></i>
                    </button>
                    <h2 className="font-bold text-lg">{step === 'upload' ? 'Upload Video' : 'New Reel'}</h2>
                    <div className="w-10"></div>
                </div>
            )}

            {step === 'upload' && (
                <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#111] to-[#050505] relative overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FE2C55]/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#25F4EE]/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div 
                        className="w-full max-w-md bg-[#1A1A1A] border-2 border-dashed border-gray-700 rounded-3xl p-10 flex flex-col items-center text-center cursor-pointer hover:border-[#FE2C55] hover:bg-[#1F1F1F] transition-all duration-300 z-10 group shadow-2xl mx-4"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-20 h-20 bg-[#2F2F2F] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <i className="fas fa-cloud-upload-alt text-4xl text-[#AAA] group-hover:text-[#FE2C55]"></i>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-[#EEE]">Select video</h3>
                        <p className="text-[#888] mb-8 text-sm">Or drag and drop</p>
                        <button className="bg-[#FE2C55] text-white px-10 py-3 rounded-full font-bold text-base shadow-[0_4px_15px_rgba(254,44,85,0.4)] w-full">
                            Select File
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
                    </div>
                </div>
            )}

            {step === 'editor' && videoPreview && (
                <div className="flex-1 relative bg-black flex flex-col h-full">
                    {/* Top Bar */}
                    <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                        <button onClick={() => setStep('upload')} className="w-8 h-8 flex items-center justify-center"><i className="fas fa-times text-white text-xl shadow-lg"></i></button>
                        <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2">
                            <i className="fas fa-music text-xs"></i>
                            <span className="text-xs font-bold max-w-[100px] truncate">{selectedSong}</span>
                        </div>
                    </div>

                    {/* Video Area */}
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                        <video 
                            ref={videoRef}
                            src={videoPreview} 
                            className={`w-full h-full object-contain ${selectedEffect === 'B&W' ? 'grayscale' : selectedEffect === 'Vintage' ? 'sepia contrast-125' : ''}`} 
                            autoPlay 
                            loop 
                            playsInline 
                        />
                        {/* Overlay Text Layer */}
                        <div className="absolute inset-0 pointer-events-none">
                            {overlayText.map(t => (
                                <div key={t.id} className="absolute text-white font-bold text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/20 px-2 py-1 rounded top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    {t.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar Tools */}
                    <div className="absolute right-2 top-20 flex flex-col gap-6 z-20 items-end pr-2">
                        {tools.map(tool => (
                            <div key={tool.id} className="flex flex-col items-center gap-1 cursor-pointer group" onClick={tool.action}>
                                <div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center group-active:scale-90 transition-transform border border-white/10">
                                    <i className={`fas fa-${tool.icon} text-white text-lg`}></i>
                                </div>
                                <span className="text-white text-[10px] font-medium drop-shadow-md">{tool.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Actions */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black/80 to-transparent z-20 flex justify-between items-end">
                        <div className="text-white text-xs opacity-70">
                            {overlayText.length > 0 ? `${overlayText.length} text added` : 'No text added'}
                        </div>
                        <button 
                            onClick={() => setStep('details')}
                            className="bg-[#FE2C55] text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-[#E02045] transition-colors"
                        >
                            Next <i className="fas fa-chevron-right text-xs"></i>
                        </button>
                    </div>

                    {/* --- TOOL OVERLAYS --- */}
                    
                    {/* Text Tool */}
                    {activeTool === 'text' && (
                        <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center p-4 animate-fade-in">
                            <input 
                                autoFocus
                                type="text" 
                                className="bg-transparent text-center text-white text-3xl font-bold outline-none border-b-2 border-[#FE2C55] w-full max-w-md pb-2 mb-8 placeholder-white/50"
                                placeholder="Type something..."
                                value={tempText}
                                onChange={e => setTempText(e.target.value)}
                            />
                            <div className="flex gap-4">
                                <button onClick={() => setActiveTool(null)} className="px-6 py-2 rounded-full bg-gray-700 font-bold">Cancel</button>
                                <button onClick={handleAddText} className="px-6 py-2 rounded-full bg-[#FE2C55] font-bold">Done</button>
                            </div>
                        </div>
                    )}

                    {/* Music Tool */}
                    {activeTool === 'music' && (
                        <div className="absolute inset-x-0 bottom-0 bg-[#18191A] rounded-t-2xl z-30 flex flex-col h-[60%] animate-slide-up border-t border-gray-800">
                            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                                <h3 className="font-bold">Select Music</h3>
                                <button onClick={() => setActiveTool(null)}><i className="fas fa-times"></i></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2">
                                <div className="p-2 hover:bg-white/5 rounded-lg cursor-pointer flex justify-between items-center" onClick={() => { setSelectedSong('Original Audio'); setActiveTool(null); }}>
                                    <span className="font-bold">Original Audio</span>
                                    {selectedSong === 'Original Audio' && <i className="fas fa-check text-[#FE2C55]"></i>}
                                </div>
                                {MOCK_SONGS.map(s => (
                                    <div key={s.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer" onClick={() => { setSelectedSong(s.title); setActiveTool(null); }}>
                                        <img src={s.cover} className="w-10 h-10 rounded" alt="" />
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">{s.title}</div>
                                            <div className="text-xs text-gray-400">{s.artist}</div>
                                        </div>
                                        {selectedSong === s.title && <i className="fas fa-check text-[#FE2C55]"></i>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Effects Tool */}
                    {activeTool === 'effects' && (
                        <div className="absolute inset-x-0 bottom-0 bg-black/90 backdrop-blur-md z-30 p-4 pb-8 animate-slide-up">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-sm">Effects</h3>
                                <button onClick={() => setActiveTool(null)} className="text-xs">Done</button>
                            </div>
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                                <div onClick={() => setSelectedEffect('')} className={`w-16 h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${!selectedEffect ? 'border-[#FE2C55]' : 'border-gray-600'}`}>
                                    <span className="text-xs">None</span>
                                </div>
                                {effectsList.map(eff => (
                                    <div key={eff} onClick={() => setSelectedEffect(eff)} className={`w-16 h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0 cursor-pointer bg-gray-800 ${selectedEffect === eff ? 'border-[#FE2C55]' : 'border-transparent'}`}>
                                        <span className="text-xs font-bold">{eff}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trim Tool (Mock) */}
                    {activeTool === 'trim' && (
                        <div className="absolute inset-x-0 bottom-0 bg-[#18191A] z-30 p-6 pb-10 animate-slide-up border-t border-gray-800">
                            <div className="flex justify-between mb-6">
                                <span className="font-bold">Trim Video</span>
                                <button onClick={() => setActiveTool(null)} className="text-[#FE2C55] font-bold">Done</button>
                            </div>
                            <div className="h-12 bg-gray-800 rounded-lg relative overflow-hidden flex items-center px-1">
                                <div className="absolute inset-y-0 bg-[#FE2C55]/30 border-x-4 border-[#FE2C55] cursor-grab" style={{ left: '0%', right: '0%' }}></div>
                                <div className="w-full h-8 bg-[url('https://upload.wikimedia.org/wikipedia/commons/1/18/Waveform_1.png')] bg-cover opacity-50"></div>
                            </div>
                            <p className="text-center text-xs text-gray-500 mt-4">Drag ends to trim</p>
                        </div>
                    )}
                </div>
            )}

            {/* Details Step */}
            {step === 'details' && (
                <div className="flex-1 flex flex-col bg-[#121212] overflow-y-auto">
                    <div className="p-4 flex gap-4">
                        <div className="w-24 h-32 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                            {videoPreview && <video src={videoPreview} className="w-full h-full object-cover" />}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <i className="fas fa-play text-white/80"></i>
                            </div>
                        </div>
                        <textarea 
                            className="flex-1 bg-transparent text-white outline-none resize-none text-sm placeholder-gray-500 mt-2"
                            placeholder="Write a caption... #hashtags"
                            value={caption}
                            onChange={e => setCaption(e.target.value)}
                            rows={4}
                            autoFocus
                        />
                    </div>

                    <div className="h-px bg-gray-800 mx-4"></div>

                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between py-2 cursor-pointer" onClick={() => setPrivacy(privacy === 'Public' ? 'Friends' : 'Public')}>
                            <div className="flex items-center gap-3">
                                <i className="fas fa-user-friends text-gray-400"></i>
                                <span>Who can watch this video</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                {privacy} <i className="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-comment-dots text-gray-400"></i>
                                <span>Allow comments</span>
                            </div>
                            <input type="checkbox" defaultChecked className="accent-[#FE2C55] w-5 h-5" />
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-download text-gray-400"></i>
                                <span>Save to device</span>
                            </div>
                            <input type="checkbox" className="accent-[#FE2C55] w-5 h-5" />
                        </div>
                    </div>

                    <div className="mt-auto p-4 flex gap-3 border-t border-gray-800 bg-[#121212]">
                        <button onClick={() => onClose()} className="flex-1 py-3.5 rounded-lg font-bold bg-gray-800 text-white">Drafts</button>
                        <button onClick={handlePost} className="flex-1 py-3.5 rounded-lg font-bold bg-[#FE2C55] text-white">Post</button>
                    </div>
                </div>
            )}
        </div>
    );
};

interface ReelsFeedProps {
    reels: Reel[];
    users: User[];
    currentUser: User | null; // Allow null
    onProfileClick: (id: number) => void;
    onCreateReelClick: () => void;
    onLoadMore?: () => void;
    onReact: (reelId: number, type: ReactionType) => void;
    onComment: (reelId: number, text: string) => void;
    onShare: (reelId: number, type: 'feed' | 'copy') => void;
    onFollow: (userId: number) => void;
    getCommentAuthor: (id: number) => User | undefined;
    initialReelId?: number | null;
}

export const ReelsFeed: React.FC<ReelsFeedProps> = ({ reels, users, currentUser, onProfileClick, onCreateReelClick, onLoadMore, onReact, onComment, onShare, onFollow, getCommentAuthor, initialReelId }) => {
    const [activeReelId, setActiveReelId] = useState<number | null>(initialReelId || null);
    const [isMuted, setIsMuted] = useState(false);
    const [showHeartAnimation, setShowHeartAnimation] = useState<Record<number, boolean>>({});
    const [activeCommentReelId, setActiveCommentReelId] = useState<number | null>(null);
    const [activeShareReelId, setActiveShareReelId] = useState<number | null>(null);
    const [commentText, setCommentText] = useState('');
    const [videoProgress, setVideoProgress] = useState<Record<number, number>>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
    const observer = useRef<IntersectionObserver | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        if (initialReelId && containerRef.current) {
            const index = reels.findIndex(r => r.id === initialReelId);
            if (index !== -1) {
                setTimeout(() => {
                    const el = containerRef.current?.children[index] as HTMLElement;
                    if (el) {
                        el.scrollIntoView({ behavior: 'auto' });
                        setActiveReelId(initialReelId);
                    }
                }, 100);
            }
        } else if (reels.length > 0 && !activeReelId) {
             setActiveReelId(reels[0].id);
        }
    }, [initialReelId, reels]);

    useEffect(() => {
        const options = { root: containerRef.current, rootMargin: '0px', threshold: 0.6 };
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const reelId = Number(entry.target.getAttribute('data-reel-id'));
                    setActiveReelId(reelId);
                    const index = Number(entry.target.getAttribute('data-index'));
                    if (onLoadMore && index >= reels.length - 2) onLoadMore();
                }
            });
        };
        observer.current = new IntersectionObserver(handleIntersection, options);
        document.querySelectorAll('.reel-container').forEach((el) => observer.current?.observe(el));
        return () => observer.current?.disconnect();
    }, [reels, onLoadMore]);

    useEffect(() => {
        Object.keys(videoRefs.current).forEach((key) => {
            const id = Number(key);
            const video = videoRefs.current[id];
            if (video) {
                const shouldPlay = id === activeReelId && activeCommentReelId === null && activeShareReelId === null;
                if (shouldPlay) {
                    if (video.paused) { video.play().catch((e) => {}); }
                } else {
                    if (!video.paused) { video.pause(); }
                }
            }
        });
    }, [activeReelId, activeCommentReelId, activeShareReelId]);

    const handleDoubleTap = (reelId: number) => {
        if(!currentUser) {
            alert("Please login to like reels.");
            return;
        }
        const reel = reels.find(r => r.id === reelId);
        if (reel) {
            onReact(reelId, 'like');
        }
        setShowHeartAnimation(prev => ({ ...prev, [reelId]: true }));
        setTimeout(() => setShowHeartAnimation(prev => ({ ...prev, [reelId]: false })), 800);
    };

    const toggleMute = (e: React.MouseEvent) => { e.stopPropagation(); setIsMuted(!isMuted); };
    const handleTimeUpdate = (id: number) => { const video = videoRefs.current[id]; if (video) setVideoProgress(prev => ({ ...prev, [id]: (video.currentTime / video.duration) * 100 })); };
    
    const handleCommentSubmit = (e: React.FormEvent, reelId: number) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(reelId, commentText);
            setCommentText('');
        }
    };

    return (
        <div className="w-full h-[calc(100vh-56px)] flex justify-center bg-[#18191A] overflow-hidden relative font-sans">
            {/* Hide Create Button if Guest */}
            {currentUser && (
                <button onClick={onCreateReelClick} className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#FF0050] to-[#00F2EA] text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"><i className="fas fa-plus"></i> {t('create_reel')}</button>
            )}
            <div ref={containerRef} className="w-full max-w-[450px] h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide scroll-smooth">
                {reels.map((reel, index) => {
                    const author = users.find(u => u.id === reel.userId);
                    const myReaction = currentUser ? reel.reactions.find(r => r.userId === currentUser.id)?.type : undefined;
                    const isFollowing = author && currentUser ? (author.followers.includes(currentUser.id) || currentUser.following.includes(author.id)) : false;
                    const isSelf = currentUser && author?.id === currentUser.id;

                    if (!author) return null;
                    return (
                        <div key={`${reel.id}-${index}`} data-reel-id={reel.id} data-index={index} className="reel-container w-full h-full snap-start relative bg-black flex items-center justify-center sm:my-4 sm:rounded-lg overflow-hidden shadow-2xl sm:border border-gray-800" onDoubleClick={() => handleDoubleTap(reel.id)}>
                            <video ref={el => { if (el) videoRefs.current[reel.id] = el; else delete videoRefs.current[reel.id]; }} src={reel.videoUrl} className="w-full h-full object-cover" loop muted={isMuted} playsInline onTimeUpdate={() => handleTimeUpdate(reel.id)} onClick={(e) => { const v = e.currentTarget; if (v.paused) v.play().catch(() => {}); else v.pause(); }} crossOrigin="anonymous"/>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600 z-30"><div className="h-full bg-red-500 transition-all duration-100 ease-linear" style={{ width: `${videoProgress[reel.id] || 0}%` }}></div></div>
                            {showHeartAnimation[reel.id] && <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"><i className="fas fa-heart text-white text-9xl drop-shadow-lg animate-pop-heart"></i></div>}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none"></div>
                            <div className="absolute top-4 right-4 z-40 bg-black/40 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/60 transition-colors" onClick={toggleMute}><i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-white text-lg w-5 text-center`}></i></div>
                            <div className="absolute bottom-20 right-4 flex flex-col items-center gap-6 z-20">
                                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                                    <div className="bg-black/40 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center">
                                        <ReactionButton currentUserReactions={myReaction} reactionCount={reel.reactions.length} onReact={(type) => currentUser ? onReact(reel.id, type) : alert("Please login to react")} isGuest={!currentUser} />
                                    </div>
                                    <span className="text-white text-sm font-medium">{reel.reactions.length}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 cursor-pointer group"><div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:bg-black/60 text-white" onClick={(e) => { e.stopPropagation(); currentUser ? setActiveCommentReelId(reel.id) : alert("Please login to comment"); }}><i className="fas fa-comment-dots text-2xl"></i></div><span className="text-white text-sm font-medium">{reel.comments.length}</span></div>
                                <div className="flex flex-col items-center gap-1 cursor-pointer group"><div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:bg-black/60 text-white" onClick={(e) => { e.stopPropagation(); currentUser ? setActiveShareReelId(reel.id) : alert("Please login to share"); }}><i className="fas fa-share text-2xl"></i></div><span className="text-white text-sm font-medium">{reel.shares}</span></div>
                                <div className="cursor-pointer mt-4 relative" onClick={(e) => { e.stopPropagation(); onProfileClick(author.id); }}>
                                    <img src={author.profileImage} className="w-12 h-12 rounded-lg border-2 border-white object-cover" alt={author.name} />
                                    {!isFollowing && !isSelf && currentUser && <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white" onClick={(e) => { e.stopPropagation(); onFollow(author.id); }}><i className="fas fa-plus text-white text-[10px]"></i></div>}
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-4 z-20 pb-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
                                <div className="flex items-center gap-3 mb-3 pointer-events-auto cursor-pointer" onClick={() => onProfileClick(author.id)}>
                                    <img src={author.profileImage} className="w-10 h-10 rounded-full border border-white object-cover" alt="" />
                                    <span className="text-white font-bold text-[17px] drop-shadow-md">{author.name}</span>
                                    {author.isVerified && <i className="fas fa-check-circle text-[#1877F2] text-[14px] drop-shadow-md"></i>}
                                    {!isSelf && currentUser && <button onClick={(e) => { e.stopPropagation(); onFollow(author.id); }} className={`border text-xs font-semibold px-3 py-1 rounded-md backdrop-blur-sm transition-colors ${isFollowing ? 'bg-white/20 border-white/20 text-white' : 'bg-transparent border-white/60 text-white hover:bg-white/20'}`}>{isFollowing ? 'Following' : 'Follow'}</button>}
                                </div>
                                <div className="mb-3 pointer-events-auto"><p className="text-white text-[15px] line-clamp-2 drop-shadow-sm">{reel.caption}</p>{reel.effectName && <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-gray-800/60 rounded-md text-xs text-white/90 backdrop-blur-sm"><i className="fas fa-magic text-yellow-400 text-xs"></i> {reel.effectName}</div>}</div>
                                <div className="flex items-center gap-2 text-white/90 text-sm bg-white/10 px-3 py-1 rounded-full w-fit backdrop-blur-sm pointer-events-auto"><i className="fas fa-music text-xs"></i><div className="overflow-hidden max-w-[200px]"><div className="whitespace-nowrap">{reel.songName}</div></div></div>
                            </div>
                            
                            {activeCommentReelId === reel.id && currentUser && (
                                <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setActiveCommentReelId(null)}>
                                    <div className="bg-[#242526] rounded-t-2xl h-[60%] w-full flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                                        <div className="p-3 border-b border-[#3E4042] flex justify-between items-center"><h3 className="font-bold text-center flex-1 text-[#E4E6EB]">Comments ({reel.comments.length})</h3><div onClick={() => setActiveCommentReelId(null)} className="p-2 cursor-pointer hover:bg-[#3A3B3C] rounded-full"><i className="fas fa-times text-[#B0B3B8]"></i></div></div>
                                        <div className="flex-1 overflow-y-auto p-4">
                                            {reel.comments.length === 0 ? (<div className="flex flex-col items-center justify-center h-full text-[#B0B3B8]"><i className="far fa-comments text-4xl mb-2"></i><p>No comments yet. Be the first!</p></div>) : (<div className="flex flex-col gap-4">{reel.comments.map(comment => { const commentAuthor = getCommentAuthor(comment.userId); if (!commentAuthor) return null; return (<div key={comment.id} className="flex gap-2"><img src={commentAuthor.profileImage} alt="" className="w-8 h-8 rounded-full object-cover" /><div className="flex flex-col"><div className="bg-[#3A3B3C] px-3 py-2 rounded-2xl"><span className="font-semibold text-[13px] text-[#E4E6EB]">{commentAuthor.name}</span><p className="text-[14px] text-[#E4E6EB]">{comment.text}</p></div><span className="text-[11px] text-[#B0B3B8] ml-2 mt-0.5">{comment.timestamp}</span></div></div>); })}</div>)}
                                        </div>
                                        <div className="p-3 border-t border-[#3E4042] flex gap-2 items-center">
                                            <img src={currentUser.profileImage} className="w-8 h-8 rounded-full object-cover" alt="" />
                                            <form onSubmit={(e) => handleCommentSubmit(e, reel.id)} className="flex-1 flex gap-2"><input type="text" className="flex-1 bg-[#3A3B3C] rounded-full px-4 py-2 outline-none text-sm text-[#E4E6EB]" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} /><button type="submit" className="text-[#1877F2] font-semibold text-sm px-2 disabled:opacity-50" disabled={!commentText.trim()}>Post</button></form>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeShareReelId === reel.id && currentUser && (
                                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in" onClick={() => setActiveShareReelId(null)}>
                                    <div className="bg-[#242526] rounded-xl w-[90%] max-w-[320px] overflow-hidden" onClick={e => e.stopPropagation()}>
                                        <div className="p-4 border-b border-[#3E4042] text-center font-bold text-[#E4E6EB]">Share to</div>
                                        <div className="p-2">
                                            <div className="p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer flex items-center gap-3" onClick={() => { onShare(reel.id, 'feed'); setActiveShareReelId(null); }}><div className="w-10 h-10 bg-[#2D88FF] rounded-full flex items-center justify-center"><i className="fas fa-rss text-white"></i></div><span className="text-[#E4E6EB] font-medium">Share to Feed</span></div>
                                            <div className="p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer flex items-center gap-3" onClick={() => { onShare(reel.id, 'copy'); setActiveShareReelId(null); }}><div className="w-10 h-10 bg-[#3A3B3C] border border-[#3E4042] rounded-full flex items-center justify-center"><i className="fas fa-link text-[#E4E6EB]"></i></div><span className="text-[#E4E6EB] font-medium">Copy Link</span></div>
                                        </div>
                                        <div className="p-3 border-t border-[#3E4042] text-center text-[#E4E6EB] cursor-pointer hover:bg-[#3A3B3C]" onClick={() => setActiveShareReelId(null)}>Cancel</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
