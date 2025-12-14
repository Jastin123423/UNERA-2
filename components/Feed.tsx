
import React, { useState, useRef, useEffect } from 'react';
import { User, Post as PostType, ReactionType, Comment, Product, LinkPreview, AudioTrack, Group } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { INITIAL_USERS, LOCATIONS_DATA, REACTION_ICONS, REACTION_COLORS, GIF_CATEGORIES, MARKETPLACE_COUNTRIES } from '../constants';
import { StickerPicker, EmojiPicker } from './Pickers';

// --- RICH TEXT RENDERER FOR MENTIONS ---
const RichText = ({ text, users, onProfileClick }: { text: string, users?: User[], onProfileClick: (id: number) => void }) => {
    if (!text) return null;
    
    // Split by spaces to find potential mentions
    const parts = text.split(/(@\w+(?:\s\w+)?)/g);

    return (
        <span className="leading-relaxed text-[#E4E6EB] whitespace-pre-wrap break-words">
            {parts.map((part, index) => {
                if (part.startsWith('@')) {
                    const name = part.substring(1);
                    const user = users?.find(u => u.name.toLowerCase() === name.toLowerCase());
                    
                    if (user) {
                        return (
                            <span 
                                key={index} 
                                className="text-[#1877F2] font-semibold cursor-pointer hover:underline"
                                onClick={(e) => { e.stopPropagation(); onProfileClick(user.id); }}
                            >
                                {part}
                            </span>
                        );
                    }
                    return <span key={index} className="text-[#1877F2] font-semibold">{part}</span>;
                }
                
                if (part.startsWith('#')) {
                     return <span key={index} className="text-[#1877F2] cursor-pointer hover:underline">{part}</span>;
                }

                return <span key={index}>{part}</span>;
            })}
        </span>
    );
};

// ... (existing helper functions: getLinkPreview, BACKGROUNDS, FEELINGS) ...
const getLinkPreview = (text: string): LinkPreview | null => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    
    if (match && match[0]) {
        const url = match[0];
        const domain = new URL(url).hostname;
        
        // Mock data logic based on domain
        if (domain.includes('youtube')) {
            return {
                url,
                title: "YouTube Video - Amazing Content",
                description: "Watch this incredible video on YouTube. Subscribe for more updates!",
                image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                domain: "youtube.com"
            };
        } else if (domain.includes('github')) {
            return {
                url,
                title: "GitHub Repository",
                description: "Check out this open source project on GitHub. Contribute today!",
                image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                domain: "github.com"
            };
        } else {
            return {
                url,
                title: "Website Link",
                description: `Check out this link from ${domain}. Interesting content inside.`,
                image: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                domain: domain
            };
        }
    }
    return null;
};

const BACKGROUNDS = [
    { id: 'none', value: '' },
    { id: 'red', value: 'linear-gradient(45deg, #FF0057, #E64C4C)' },
    { id: 'blue', value: 'linear-gradient(45deg, #00C6FF, #0072FF)' },
    { id: 'green', value: 'linear-gradient(45deg, #a8ff78, #78ffd6)' },
    { id: 'purple', value: 'linear-gradient(45deg, #e65c00, #F9D423)' },
    { id: 'heart', value: 'url("https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60")' },
    { id: 'dark', value: 'linear-gradient(to right, #434343 0%, black 100%)' },
    { id: 'fire', value: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)' },
];

const FEELINGS = ['Happy', 'Blessed', 'Loved', 'Sad', 'Excited', 'Thankful', 'Crazy', 'Tired', 'Cool', 'Relaxed'];

// ... (existing components: ReactionButton) ...
interface ReactionButtonProps {
    currentUserReactions: ReactionType | undefined;
    reactionCount: number;
    onReact: (type: ReactionType) => void;
    isGuest?: boolean;
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({ currentUserReactions, reactionCount, onReact, isGuest }) => {
    const [showDock, setShowDock] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if(isGuest) return;
        if(closeTimerRef.current) clearTimeout(closeTimerRef.current);
        
        // Only start opening timer if not already shown
        if (!showDock) {
            timerRef.current = setTimeout(() => {
                setShowDock(true);
            }, 500); 
        }
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        closeTimerRef.current = setTimeout(() => setShowDock(false), 300);
    };

    const handleClick = () => {
        if (isGuest) {
            alert("Please login to react.");
            return;
        }
        setShowDock(false); // Close dock if open when clicking main button
        if (currentUserReactions) {
            onReact('like'); 
        } else {
            onReact('like');
        }
    };

    const handleReactionSelect = (e: React.MouseEvent, type: ReactionType) => {
        e.stopPropagation();
        onReact(type);
        setShowDock(false);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };

    const reactionConfig = [
        { type: 'like', icon: '👍', color: '#1877F2' },
        { type: 'love', icon: '❤️', color: '#F3425F' },
        { type: 'haha', icon: '😆', color: '#F7B928' },
        { type: 'wow', icon: '😮', color: '#F7B928' },
        { type: 'sad', icon: '😢', color: '#F7B928' },
        { type: 'angry', icon: '😡', color: '#E41E3F' },
    ] as const;

    const activeReaction = currentUserReactions ? reactionConfig.find(r => r.type === currentUserReactions) : null;

    return (
        <div 
            className="flex-1 relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Reaction Dock */}
            {showDock && (
                <div 
                    className="absolute -top-12 left-0 bg-[#242526] rounded-full shadow-xl p-1.5 flex gap-2 animate-fade-in border border-[#3E4042] z-50"
                    onMouseEnter={() => { if(closeTimerRef.current) clearTimeout(closeTimerRef.current); }} // Keep open while hovering dock
                >
                    {reactionConfig.map(reaction => (
                        <div 
                            key={reaction.type} 
                            className="text-2xl hover:scale-125 transition-transform cursor-pointer hover:-translate-y-2 duration-200"
                            onClick={(e) => handleReactionSelect(e, reaction.type)}
                        >
                            {reaction.icon}
                        </div>
                    ))}
                </div>
            )}

            <button 
                onClick={handleClick}
                className="w-full flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] transition-colors active:scale-95"
            >
                {activeReaction ? (
                    <>
                         <span className="text-[20px]">{activeReaction.icon}</span>
                         <span className="text-[15px] font-semibold" style={{ color: activeReaction.color }}>
                            {activeReaction.type.charAt(0).toUpperCase() + activeReaction.type.slice(1)}
                         </span>
                    </>
                ) : (
                    <>
                        <i className="far fa-thumbs-up text-[20px] text-[#B0B3B8]"></i>
                        <span className="text-[15px] font-semibold text-[#B0B3B8]">Like</span>
                    </>
                )}
            </button>
        </div>
    );
};

// ... NEW ShareSheet ...
interface ShareSheetProps {
    post: PostType;
    groups?: Group[];
    onClose: () => void;
    onShareNow: (caption: string) => void;
    onShareToGroup: (groupId: string, caption: string) => void;
    onCopyLink: () => void;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({ post, groups = [], onClose, onShareNow, onShareToGroup, onCopyLink }) => {
    const [caption, setCaption] = useState('');
    const [view, setView] = useState<'main' | 'groups'>('main');

    // External Share Handler
    const handleExternalShare = (platform: string) => {
        // Construct the post URL (mocked) and content
        const postUrl = `https://unera.com/post/${post.id}`;
        const text = encodeURIComponent(`${caption ? caption + '\n\n' : ''}Check out this post on UNERA:\n${post.content?.substring(0, 100)}...`);
        const url = encodeURIComponent(postUrl);

        let shareLink = '';
        switch(platform) {
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${text}%20${url}`;
                break;
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
                break;
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                break;
            case 'linkedin':
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'email':
                shareLink = `mailto:?subject=Check out this post&body=${text}%20${url}`;
                break;
        }
        
        if (shareLink) window.open(shareLink, '_blank');
        onClose();
    };

    if (view === 'groups') {
        return (
            <div className="fixed inset-0 z-[110] flex flex-col justify-end">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
                <div className="bg-[#242526] w-full rounded-t-xl z-20 animate-slide-up overflow-hidden max-h-[80vh] flex flex-col">
                    <div className="p-4 border-b border-[#3E4042] flex items-center">
                        <button onClick={() => setView('main')} className="w-8 h-8 rounded-full hover:bg-[#3A3B3C] flex items-center justify-center mr-2">
                            <i className="fas fa-arrow-left text-[#E4E6EB]"></i>
                        </button>
                        <h3 className="text-[#E4E6EB] font-bold text-[18px]">Share to a Group</h3>
                    </div>
                    <div className="p-2 overflow-y-auto">
                        {groups.length > 0 ? groups.map(group => (
                            <div key={group.id} className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer" onClick={() => { onShareToGroup(group.id, caption); onClose(); }}>
                                <img src={group.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                <div>
                                    <h4 className="font-bold text-[#E4E6EB]">{group.name}</h4>
                                    <span className="text-[#B0B3B8] text-xs">{group.members.length} members</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-4 text-center text-[#B0B3B8]">You haven't joined any groups yet.</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
             <div className="bg-[#242526] w-full rounded-t-xl z-20 animate-slide-up overflow-hidden">
                <div className="p-4 border-b border-[#3E4042]">
                    <h3 className="text-[#E4E6EB] text-center font-bold text-[18px]">Share</h3>
                </div>
                
                <div className="p-4">
                    {/* Caption Input */}
                    <textarea 
                        className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-[#E4E6EB] outline-none mb-4 resize-none placeholder-[#B0B3B8] text-[16px]"
                        placeholder="Say something about this..."
                        rows={2}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />

                    {/* External Apps Grid */}
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-2 border-b border-[#3E4042]">
                        <div className="flex flex-col items-center gap-1 cursor-pointer min-w-[60px]" onClick={() => handleExternalShare('whatsapp')}>
                            <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white text-2xl shadow-lg hover:scale-105 transition-transform"><i className="fab fa-whatsapp"></i></div>
                            <span className="text-[#B0B3B8] text-xs">WhatsApp</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer min-w-[60px]" onClick={() => handleExternalShare('facebook')}>
                            <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-2xl shadow-lg hover:scale-105 transition-transform"><i className="fab fa-facebook-f"></i></div>
                            <span className="text-[#B0B3B8] text-xs">Facebook</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer min-w-[60px]" onClick={() => handleExternalShare('twitter')}>
                            <div className="w-12 h-12 rounded-full bg-black border border-[#3E4042] flex items-center justify-center text-white text-xl shadow-lg hover:scale-105 transition-transform"><i className="fab fa-x-twitter"></i></div>
                            <span className="text-[#B0B3B8] text-xs">X</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer min-w-[60px]" onClick={() => handleExternalShare('linkedin')}>
                            <div className="w-12 h-12 rounded-full bg-[#0077B5] flex items-center justify-center text-white text-2xl shadow-lg hover:scale-105 transition-transform"><i className="fab fa-linkedin-in"></i></div>
                            <span className="text-[#B0B3B8] text-xs">LinkedIn</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer min-w-[60px]" onClick={() => handleExternalShare('email')}>
                            <div className="w-12 h-12 rounded-full bg-[#EA4335] flex items-center justify-center text-white text-xl shadow-lg hover:scale-105 transition-transform"><i className="fas fa-envelope"></i></div>
                            <span className="text-[#B0B3B8] text-xs">Email</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer min-w-[60px]" onClick={onCopyLink}>
                            <div className="w-12 h-12 rounded-full bg-[#3A3B3C] border border-[#3E4042] flex items-center justify-center text-[#E4E6EB] text-xl shadow-lg hover:scale-105 transition-transform"><i className="fas fa-link"></i></div>
                            <span className="text-[#B0B3B8] text-xs">Copy Link</span>
                        </div>
                    </div>

                    {/* Internal Options List */}
                    <div className="flex flex-col gap-1 mt-2">
                        <div className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer" onClick={() => onShareNow(caption)}>
                            <div className="w-10 h-10 bg-[#3A3B3C] rounded-full flex items-center justify-center"><i className="fas fa-rss text-[#E4E6EB] text-lg"></i></div>
                            <div className="flex flex-col">
                                <span className="text-[#E4E6EB] font-semibold text-[16px]">Share to Feed</span>
                                <span className="text-[#B0B3B8] text-[13px]">Post to your profile</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer" onClick={() => setView('groups')}>
                            <div className="w-10 h-10 bg-[#3A3B3C] rounded-full flex items-center justify-center"><i className="fas fa-users text-[#E4E6EB] text-lg"></i></div>
                            <div className="flex flex-col">
                                <span className="text-[#E4E6EB] font-semibold text-[16px]">Share to a Group</span>
                                <span className="text-[#B0B3B8] text-[13px]">Share with a specific community</span>
                            </div>
                        </div>
                        {/* More options placeholder */}
                        <div className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer" onClick={() => alert("Messenger integration coming soon.")}>
                            <div className="w-10 h-10 bg-[#3A3B3C] rounded-full flex items-center justify-center"><i className="fab fa-facebook-messenger text-[#E4E6EB] text-lg"></i></div>
                            <div className="flex flex-col">
                                <span className="text-[#E4E6EB] font-semibold text-[16px]">Send in Message</span>
                                <span className="text-[#B0B3B8] text-[13px]">Send to a friend</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-3 border-t border-[#3E4042]">
                    <button className="w-full py-3 bg-[#3A3B3C] text-[#E4E6EB] font-semibold rounded-lg text-[17px] hover:bg-[#4E4F50]" onClick={onClose}>Cancel</button>
                </div>
             </div>
        </div>
    );
};

// ... SuggestedProductsWidget (unchanged) ...
interface SuggestedProductsWidgetProps {
    products: Product[];
    currentUser: User;
    onViewProduct: (product: Product) => void;
    onSeeAll: () => void;
}

export const SuggestedProductsWidget: React.FC<SuggestedProductsWidgetProps> = ({ products, currentUser, onViewProduct, onSeeAll }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current && !isHovered) {
                if (scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= scrollRef.current.scrollWidth) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                }
            }
        }, 3000); // Scroll every 3 seconds

        return () => clearInterval(interval);
    }, [isHovered]);

    if (products.length === 0) return null;

    return (
        <div className="bg-[#242526] rounded-xl border border-[#3E4042] mb-4 p-4 shadow-sm" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-[#E4E6EB] font-bold text-[18px]">Suggested for you</h3>
                <span className="text-[#1877F2] text-[16px] cursor-pointer hover:underline" onClick={onSeeAll}>See more</span>
            </div>
            <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
                {products.slice(0, 8).map(p => (
                    <div key={p.id} className="min-w-[150px] bg-[#18191A] rounded-lg overflow-hidden border border-[#3E4042] cursor-pointer flex-shrink-0" onClick={() => onViewProduct(p)}>
                        <div className="h-36 bg-white"><img src={p.images[0]} className="w-full h-full object-cover" alt="" /></div>
                        <div className="p-2.5">
                            <div className="font-bold text-[#E4E6EB] text-[16px] truncate">{p.title}</div>
                            <div className="text-[#F02849] font-bold text-[16px]">{MARKETPLACE_COUNTRIES.find(c => c.code === p.country)?.symbol || '$'}{p.mainPrice}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ... CreatePost (unchanged) ...
interface CreatePostProps {
    currentUser: User;
    onProfileClick: (id: number) => void;
    onClick: () => void;
    onCreateEventClick?: () => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onProfileClick, onClick, onCreateEventClick }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-[#242526] rounded-xl p-3 md:p-4 mb-4 shadow-sm border border-[#3E4042]">
            <div className="flex gap-2 mb-3">
                <img src={currentUser.profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover cursor-pointer border border-[#3E4042]" onClick={() => onProfileClick(currentUser.id)} />
                <div className="flex-1 bg-[#3A3B3C] rounded-full px-3 md:px-4 py-2 hover:bg-[#4E4F50] cursor-pointer flex items-center transition-colors" onClick={onClick}>
                    <span className="text-[#B0B3B8] text-[17px] truncate">What's on your mind?</span>
                </div>
            </div>
            <div className="border-t border-[#3E4042] pt-2 flex justify-between">
                <div className="flex items-center justify-center flex-1 gap-2 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors" onClick={onClick}>
                    <i className="fas fa-video text-[#F3425F] text-[24px]"></i>
                    <span className="text-[#B0B3B8] font-semibold text-[15px] hidden sm:block">Live Video</span>
                </div>
                <div className="flex items-center justify-center flex-1 gap-2 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors" onClick={onClick}>
                    <i className="fas fa-images text-[#45BD62] text-[24px]"></i>
                    <span className="text-[#B0B3B8] font-semibold text-[15px] hidden sm:block">Photo/Video</span>
                </div>
                <div className="flex items-center justify-center flex-1 gap-2 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors" onClick={onCreateEventClick}>
                    <i className="fas fa-flag text-[#F7B928] text-[24px]"></i>
                    <span className="text-[#B0B3B8] font-semibold text-[15px] hidden sm:block">Life Event</span>
                </div>
            </div>
        </div>
    );
};

// ... CreatePostModal (unchanged) ...
interface CreatePostModalProps {
    currentUser: User;
    users: User[]; // Needed for tagging
    onClose: () => void;
    onCreatePost: (text: string, file: File | null, type: any, visibility: any, location?: string, feeling?: string, taggedUsers?: number[], background?: string, linkPreview?: LinkPreview) => void;
    onCreateEventClick?: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ currentUser, users, onClose, onCreatePost, onCreateEventClick }) => {
    // ... (Keep existing implementation of CreatePostModal)
    // For brevity, assuming CreatePostModal implementation is unchanged from previous context
    // but ensuring it's included in the file
    const [view, setView] = useState<'main' | 'tag' | 'feeling' | 'location' | 'gif' | 'camera'>('main');
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [type, setType] = useState('text');
    const [visibility, setVisibility] = useState('Public');
    const [activeBackground, setActiveBackground] = useState('');
    const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
    
    // Extras
    const [taggedUsers, setTaggedUsers] = useState<number[]>([]);
    const [feeling, setFeeling] = useState('');
    const [location, setLocation] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    // Watch for links
    useEffect(() => {
        const preview = getLinkPreview(text);
        setLinkPreview(preview);
    }, [text]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
            setType(f.type.startsWith('image') ? 'image' : 'video');
            setActiveBackground('');
            setView('main');
        }
    };

    const handleSubmit = () => {
        if (!text && !file && !activeBackground) return;
        // Pass linkPreview correctly if available
        const finalPreview = linkPreview ? linkPreview : undefined;
        onCreatePost(text, file, file ? type : (activeBackground ? 'text' : type), visibility, location, feeling, taggedUsers, activeBackground, finalPreview);
        onClose();
    };

    const handleGoLive = () => {
        alert("Coming soon");
    };

    const toggleTagUser = (id: number) => {
        setTaggedUsers(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);
    };

    const OptionsItem = ({ icon, color, label, onClick }: { icon: string, color: string, label: string, onClick?: () => void }) => (
        <div className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] active:bg-[#3A3B3C] cursor-pointer transition-colors" onClick={onClick}>
            <i className={`${icon} text-[24px] w-8 text-center`} style={{ color }}></i>
            <span className="text-[#E4E6EB] text-[17px] font-medium">{label}</span>
        </div>
    );

    // ... (Full Render)
    // Retaining logic to switch views
    if (view === 'tag') {
        const availableUsers = users.filter(u => u.id !== currentUser.id);
        return (
            <div className="fixed inset-0 z-[150] bg-[#18191A] flex flex-col animate-slide-up font-sans">
                <div className="flex items-center p-4 border-b border-[#3E4042] gap-4">
                    <i className="fas fa-arrow-left text-[#E4E6EB] text-xl cursor-pointer" onClick={() => setView('main')}></i>
                    <h3 className="text-[#E4E6EB] text-lg font-bold">Tag People</h3>
                    <button onClick={() => setView('main')} className="ml-auto text-[#1877F2] font-bold">Done</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {availableUsers.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer" onClick={() => toggleTagUser(u.id)}>
                            <div className="flex items-center gap-3">
                                <img src={u.profileImage} className="w-10 h-10 rounded-full object-cover" alt="" />
                                <span className="text-[#E4E6EB] font-semibold">{u.name}</span>
                            </div>
                            {taggedUsers.includes(u.id) && <i className="fas fa-check-circle text-[#1877F2] text-xl"></i>}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ... (Feeling, Location, Gif views - Keeping them)
    if (view === 'feeling') { /* ... */ return (
            <div className="fixed inset-0 z-[150] bg-[#18191A] flex flex-col animate-slide-up font-sans">
                <div className="flex items-center p-4 border-b border-[#3E4042] gap-4">
                    <i className="fas fa-arrow-left text-[#E4E6EB] text-xl cursor-pointer" onClick={() => setView('main')}></i>
                    <h3 className="text-[#E4E6EB] text-lg font-bold">How are you feeling?</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-2">
                    {FEELINGS.map(f => (
                        <div key={f} className="p-3 bg-[#242526] rounded-lg text-center cursor-pointer hover:bg-[#3A3B3C] text-[#E4E6EB]" onClick={() => { setFeeling(f); setView('main'); }}>
                            {f}
                        </div>
                    ))}
                </div>
            </div>
    ); }
    if (view === 'location') { /* ... */ return (
            <div className="fixed inset-0 z-[150] bg-[#18191A] flex flex-col animate-slide-up font-sans">
                <div className="flex items-center p-4 border-b border-[#3E4042] gap-4">
                    <i className="fas fa-arrow-left text-[#E4E6EB] text-xl cursor-pointer" onClick={() => setView('main')}></i>
                    <h3 className="text-[#E4E6EB] text-lg font-bold">Add Location</h3>
                </div>
                <div className="p-4">
                    <input type="text" placeholder="Search location" className="w-full bg-[#3A3B3C] rounded-lg p-3 text-[#E4E6EB] outline-none mb-4" autoFocus onChange={(e) => setLocation(e.target.value)} />
                    <div className="flex flex-col gap-2">
                        {LOCATIONS_DATA.map(loc => (
                            <div key={loc.name} className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer" onClick={() => { setLocation(loc.name); setView('main'); }}>
                                <div className="w-8 h-8 bg-[#3A3B3C] rounded-full flex items-center justify-center"><i className="fas fa-map-marker-alt text-[#E4E6EB]"></i></div>
                                <span className="text-[#E4E6EB]">{loc.name} {loc.flag}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    ); }
    if (view === 'gif') { /* ... */ return (
            <div className="fixed inset-0 z-[150] bg-[#18191A] flex flex-col animate-slide-up font-sans">
                <div className="flex items-center p-4 border-b border-[#3E4042] gap-4">
                    <i className="fas fa-arrow-left text-[#E4E6EB] text-xl cursor-pointer" onClick={() => setView('main')}></i>
                    <h3 className="text-[#E4E6EB] text-lg font-bold">Choose a GIF</h3>
                </div>
                <div className="flex-1 overflow-hidden">
                    <StickerPicker onSelect={(url) => { setFile(null); setPreview(url); setType('image'); setView('main'); }} />
                </div>
            </div>
    ); }

    // Main View
    return (
        <div className="fixed inset-0 z-[150] bg-[#18191A] flex flex-col animate-slide-up font-sans">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#3E4042]">
                <div className="flex items-center gap-4">
                    <i className="fas fa-arrow-left text-[#E4E6EB] text-xl cursor-pointer" onClick={onClose}></i>
                    <h3 className="text-[#E4E6EB] text-[20px] font-medium">Create Post</h3>
                </div>
                <button 
                    onClick={handleSubmit} 
                    disabled={!text && !file && !activeBackground}
                    className="text-[#E4E6EB] font-bold text-[17px] disabled:text-[#B0B3B8] disabled:cursor-not-allowed"
                >
                    POST
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4">
                        <img src={currentUser.profileImage} alt="" className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <div className="flex items-center gap-1">
                                <h4 className="font-bold text-[#E4E6EB] text-[17px]">{currentUser.name}</h4>
                                {feeling && <span className="text-[#E4E6EB] text-[15px]"> is feeling {feeling}</span>}
                                {location && <span className="text-[#E4E6EB] text-[15px]"> in {location}</span>}
                                {taggedUsers.length > 0 && <span className="text-[#E4E6EB] text-[15px]"> with {taggedUsers.length} others</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="bg-[#3A3B3C] rounded-md px-2 py-1 inline-flex items-center gap-1 text-[13px] font-semibold text-[#E4E6EB] border border-[#3E4042]">
                                    <i className={`fas ${visibility === 'Public' ? 'fa-globe-americas' : 'fa-lock'} text-[12px]`}></i>
                                    <span>{visibility}</span>
                                    <i className="fas fa-caret-down"></i>
                                </div>
                                <div className="bg-[#3A3B3C] rounded-md px-2 py-1 inline-flex items-center gap-1 text-[13px] font-semibold text-[#E4E6EB] border border-[#3E4042]">
                                    <i className="fas fa-plus text-[12px]"></i>
                                    <span>Album</span>
                                    <i className="fas fa-caret-down"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text Area */}
                    <div className={`relative min-h-[150px] mb-4 transition-all ${activeBackground ? 'flex items-center justify-center p-8 rounded-lg text-center min-h-[300px]' : ''}`} 
                        style={{ background: activeBackground.includes('url') ? activeBackground : activeBackground, backgroundSize: 'cover' }}
                    >
                        
                        <textarea 
                            className={`w-full bg-transparent outline-none text-[#E4E6EB] placeholder-[#B0B3B8] resize-none ${activeBackground ? 'text-center font-bold text-3xl drop-shadow-md placeholder-white/70' : 'text-[24px]'}`}
                            placeholder="What's on your mind?"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            rows={activeBackground ? 4 : 5}
                        />
                    </div>

                    {/* Link Preview Card */}
                    {linkPreview && !file && !activeBackground && (
                        <div className="mb-4 bg-[#242526] border border-[#3E4042] rounded-lg overflow-hidden cursor-pointer hover:bg-[#3A3B3C] transition-colors">
                            {linkPreview.image && <img src={linkPreview.image} alt="Preview" className="w-full h-48 object-cover" />}
                            <div className="p-3 bg-[#3A3B3C]">
                                <div className="text-[#B0B3B8] text-xs uppercase font-bold mb-1">{linkPreview.domain}</div>
                                <div className="text-[#E4E6EB] font-bold text-[17px] mb-1 line-clamp-1">{linkPreview.title}</div>
                                <div className="text-[#B0B3B8] text-[15px] line-clamp-2">{linkPreview.description}</div>
                            </div>
                        </div>
                    )}

                    {/* Background Picker (Scrollable) */}
                    {!preview && (
                        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                             <div 
                                className={`w-8 h-8 rounded-lg cursor-pointer border-2 bg-[#3A3B3C] flex items-center justify-center flex-shrink-0 ${!activeBackground ? 'border-white' : 'border-[#3E4042]'}`}
                                onClick={() => setActiveBackground('')}
                             >
                                 <div className="w-6 h-6 bg-white rounded flex items-center justify-center"><i className="fas fa-font text-black text-xs"></i></div>
                             </div>
                             {BACKGROUNDS.filter(b => b.id !== 'none').map(bg => (
                                 <div 
                                    key={bg.id} 
                                    className={`w-8 h-8 rounded-lg cursor-pointer border-2 flex-shrink-0 ${activeBackground === bg.value ? 'border-white' : 'border-transparent'}`}
                                    style={{ background: bg.value, backgroundSize: 'cover' }}
                                    onClick={() => setActiveBackground(bg.value)}
                                 ></div>
                             ))}
                        </div>
                    )}

                    {/* Media Preview */}
                    {preview && (
                        <div className="relative rounded-lg overflow-hidden border border-[#3E4042] mb-4">
                            <div onClick={() => { setFile(null); setPreview(null); setType('text'); }} className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 z-10">
                                <i className="fas fa-times text-white"></i>
                            </div>
                            {type === 'image' ? (
                                <img src={preview} alt="preview" className="w-full h-auto max-h-[400px] object-contain bg-black" />
                            ) : (
                                <video src={preview} controls className="w-full h-auto max-h-[400px] bg-black" />
                            )}
                        </div>
                    )}
                </div>

                {/* Options List */}
                <div className="border-t border-[#3E4042]">
                    <OptionsItem icon="fas fa-images" color="#45BD62" label="Photo/video" onClick={() => fileInputRef.current?.click()} />
                    <OptionsItem icon="fas fa-user-tag" color="#1877F2" label="Tag people" onClick={() => setView('tag')} />
                    <OptionsItem icon="far fa-smile" color="#F7B928" label="Feeling/activity" onClick={() => setView('feeling')} />
                    <OptionsItem icon="fas fa-map-marker-alt" color="#F02849" label="Check in" onClick={() => setView('location')} />
                    <OptionsItem icon="fas fa-video" color="#F02849" label="Go live" onClick={handleGoLive} />
                    <OptionsItem icon="fas fa-camera" color="#00A400" label="Camera" onClick={() => cameraInputRef.current?.click()} />
                    <OptionsItem icon="fas fa-gift" color="#1877F2" label="Gif" onClick={() => setView('gif')} />
                    <OptionsItem icon="fas fa-calendar-alt" color="#F02849" label="Create event" onClick={onCreateEventClick} />
                </div>
            </div>

            {/* Bottom Button (Mobile Style) */}
            <div className="p-4 border-t border-[#3E4042]">
                <button 
                    onClick={handleSubmit} 
                    disabled={!text && !file && !activeBackground}
                    className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-3 rounded-lg transition-colors disabled:bg-[#3A3B3C] disabled:text-[#B0B3B8] disabled:cursor-not-allowed text-lg shadow-sm"
                >
                    POST
                </button>
            </div>
            
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
            <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
        </div>
    );
};

// ... CommentsSheet (unchanged) ...
interface CommentsSheetProps {
    post: PostType;
    currentUser: User;
    users: User[];
    onClose: () => void;
    onComment: (postId: number, text: string, attachment?: any, parentId?: number) => void;
    onLikeComment: (commentId: number, isReply?: boolean, parentId?: number) => void;
    getCommentAuthor: (id: number) => User | undefined;
    onProfileClick: (id: number) => void;
}

export const CommentsSheet: React.FC<CommentsSheetProps> = ({ post, currentUser, users, onClose, onComment, onLikeComment, getCommentAuthor, onProfileClick }) => {
    const [text, setText] = useState('');
    const [showPicker, setShowPicker] = useState<'emoji' | 'sticker' | null>(null);
    const [replyingTo, setReplyingTo] = useState<{ id: number, name: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(text.trim()) {
            const commentText = replyingTo ? `@${replyingTo.name} ${text}` : text;
            onComment(post.id, commentText, undefined, replyingTo?.id);
            setText('');
            setShowPicker(null);
            setReplyingTo(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex flex-col justify-end md:items-center md:justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-[#242526] w-full md:w-[600px] md:h-[80vh] md:rounded-xl z-20 animate-slide-up flex flex-col h-[70vh] shadow-2xl overflow-hidden border border-[#3E4042]">
                {/* Header */}
                <div className="p-3 border-b border-[#3E4042] flex justify-between items-center bg-[#242526]">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#1877F2] p-1.5 rounded-full"><i className="fas fa-thumbs-up text-white text-xs"></i></div>
                        <span className="text-[#B0B3B8] text-[16px] hover:underline cursor-pointer">{post.reactions.length}</span>
                        <i className="fas fa-chevron-right text-[#B0B3B8] text-xs"></i>
                    </div>
                    <div onClick={onClose} className="w-8 h-8 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] flex items-center justify-center cursor-pointer">
                        <i className="fas fa-times text-[#B0B3B8]"></i>
                    </div>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {post.comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-[#B0B3B8] gap-2">
                             <div className="w-16 h-16 bg-[#3A3B3C] rounded-full flex items-center justify-center">
                                 <i className="far fa-comments text-3xl"></i>
                             </div>
                             <p className="font-semibold text-[#E4E6EB] text-[16px]">No comments yet</p>
                             <p className="text-[15px]">Be the first to share your thoughts.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {post.comments.map(comment => {
                                const author = getCommentAuthor(comment.userId);
                                if (!author) return null;
                                return (
                                    <div key={comment.id} className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <img src={author.profileImage} alt="" className="w-10 h-10 rounded-full object-cover cursor-pointer" onClick={() => onProfileClick(author.id)} />
                                            <div className="flex flex-col max-w-[85%]">
                                                <div className="bg-[#3A3B3C] px-4 py-3 rounded-2xl relative">
                                                    <span className="font-bold text-[15px] text-[#E4E6EB] cursor-pointer hover:underline block mb-1 hover:text-[#1877F2]" onClick={() => onProfileClick(author.id)}>{author.name}</span>
                                                    {comment.attachment && comment.attachment.type === 'image' && comment.attachment.url.includes('giphy') ? (
                                                        <img src={comment.attachment.url} className="mt-2 rounded-lg max-h-[150px] w-auto" alt="sticker" />
                                                    ) : (
                                                        <div className="text-[15px] text-[#E4E6EB] break-words">
                                                            <RichText text={comment.text} users={users} onProfileClick={onProfileClick} />
                                                        </div>
                                                    )}
                                                    
                                                    {comment.attachment && comment.attachment.type === 'image' && !comment.attachment.url.includes('giphy') && (
                                                        <img src={comment.attachment.url} className="mt-2 rounded-lg max-h-[200px] w-auto" alt="attachment" />
                                                    )}
                                                    {comment.likes > 0 && (
                                                        <div className="absolute -bottom-2 -right-1 bg-[#242526] rounded-full px-1.5 py-0.5 flex items-center shadow-sm border border-[#3E4042] gap-1">
                                                            <div className="bg-[#1877F2] rounded-full p-[2px]"><i className="fas fa-thumbs-up text-white text-[8px]"></i></div>
                                                            <span className="text-[13px] text-[#B0B3B8]">{comment.likes}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-4 ml-3 mt-1 text-[13px] font-bold text-[#B0B3B8]">
                                                    <span className="font-normal">{comment.timestamp}</span>
                                                    <span className={`cursor-pointer hover:underline ${comment.hasLiked ? 'text-[#1877F2]' : ''}`} onClick={() => onLikeComment(comment.id)}>Like</span>
                                                    <span className="cursor-pointer hover:underline" onClick={() => setReplyingTo({ id: comment.id, name: author.name })}>Reply</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="ml-12 flex flex-col gap-3 mt-1">
                                                {comment.replies.map(reply => {
                                                    const replyAuthor = getCommentAuthor(reply.userId);
                                                    if (!replyAuthor) return null;
                                                    return (
                                                        <div key={reply.id} className="flex gap-2">
                                                            <img src={replyAuthor.profileImage} alt="" className="w-8 h-8 rounded-full object-cover cursor-pointer" onClick={() => onProfileClick(replyAuthor.id)} />
                                                            <div className="flex flex-col">
                                                                <div className="bg-[#3A3B3C] px-3 py-2 rounded-2xl">
                                                                    <span className="font-bold text-[15px] text-[#E4E6EB] cursor-pointer hover:underline block mb-0.5 hover:text-[#1877F2]" onClick={() => onProfileClick(replyAuthor.id)}>{replyAuthor.name}</span>
                                                                    <div className="text-[15px] text-[#E4E6EB] break-words">
                                                                        <RichText text={reply.reply} users={users} onProfileClick={onProfileClick} />
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-4 ml-3 mt-1 text-[13px] font-bold text-[#B0B3B8]">
                                                                    <span className="font-normal">Just now</span>
                                                                    <span className={`cursor-pointer hover:underline ${reply.hasLiked ? 'text-[#1877F2]' : ''}`} onClick={() => onLikeComment(reply.id, true, comment.id)}>Like</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                {/* Pickers */}
                {showPicker === 'sticker' && <StickerPicker onSelect={(url) => { onComment(post.id, '', { type: 'image', url }); setShowPicker(null); }} />}
                {showPicker === 'emoji' && <EmojiPicker onSelect={(emoji) => setText(prev => prev + emoji)} />}

                {/* Input Area */}
                <div className="p-3 border-t border-[#3E4042] bg-[#242526]">
                    {replyingTo && (
                        <div className="flex items-center justify-between bg-[#3A3B3C] p-2 rounded-t-lg mb-1 text-sm text-[#B0B3B8]">
                            <span>Replying to <b>{replyingTo.name}</b></span>
                            <i className="fas fa-times cursor-pointer p-1" onClick={() => setReplyingTo(null)}></i>
                        </div>
                    )}
                    <div className="flex items-end gap-2">
                        <div className="flex items-center gap-2 mb-2">
                            <i className="fas fa-camera text-[#B0B3B8] text-xl cursor-pointer hover:bg-[#3A3B3C] p-1.5 rounded-full"></i>
                            <i 
                                className={`fas fa-sticky-note text-xl cursor-pointer hover:bg-[#3A3B3C] p-1.5 rounded-full ${showPicker === 'sticker' ? 'text-[#1877F2]' : 'text-[#B0B3B8]'}`}
                                onClick={() => setShowPicker(showPicker === 'sticker' ? null : 'sticker')}
                            ></i>
                            <i className="fas fa-gift text-[#B0B3B8] text-xl cursor-pointer hover:bg-[#3A3B3C] p-1.5 rounded-full"></i>
                        </div>
                        <form className="flex-1 bg-[#3A3B3C] rounded-2xl flex items-center" onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                className="bg-transparent w-full px-4 py-2.5 text-[#E4E6EB] outline-none placeholder-[#B0B3B8] text-[15px]"
                                placeholder={replyingTo ? `Reply to ${replyingTo.name}...` : "Write a comment..."}
                                value={text}
                                onChange={e => setText(e.target.value)}
                                onFocus={() => setShowPicker(null)}
                            />
                            <i 
                                className={`far fa-smile text-xl cursor-pointer mr-3 ${showPicker === 'emoji' ? 'text-[#1877F2]' : 'text-[#B0B3B8]'}`}
                                onClick={() => setShowPicker(showPicker === 'emoji' ? null : 'emoji')}
                            ></i>
                        </form>
                        <button type="submit" onClick={handleSubmit} disabled={!text.trim()} className="mb-2 text-[#1877F2] hover:bg-[#3A3B3C] p-2 rounded-full disabled:opacity-50">
                            <i className="fas fa-paper-plane text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- POST COMPONENT ---
interface PostProps {
    post: PostType;
    author: User;
    currentUser: User | null; // Allow null
    users?: User[]; // Needed for mentions parsing
    onProfileClick: (id: number) => void;
    onReact: (postId: number, type: ReactionType) => void;
    onShare: (postId: number) => void;
    onDelete?: (postId: number) => void;
    onEdit?: (postId: number, content: string) => void;
    onHashtagClick?: (tag: string) => void;
    onViewImage: (url: string) => void;
    onOpenComments: (postId: number) => void;
    onViewProduct?: (product: Product) => void;
    onVideoClick: (post: PostType) => void;
    sharedPost?: PostType;
    onFollow?: (userId: number) => void;
    isFollowing?: boolean;
    onPlayAudio?: (track: AudioTrack) => void; // New Prop
    canDelete?: boolean; // Override delete permission (e.g., group admin)
}

export const Post: React.FC<PostProps> = ({ post, author, currentUser, users, onProfileClick, onReact, onShare, onDelete, onEdit, onHashtagClick, onViewImage, onOpenComments, onViewProduct, onVideoClick, sharedPost, onFollow, isFollowing, onPlayAudio, canDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { t } = useLanguage();
    
    // Check if user reacted
    const myReaction = currentUser ? post.reactions.find(r => r.userId === currentUser.id)?.type : undefined;
    const isOwner = currentUser?.id === post.authorId;
    const isAdmin = currentUser?.role === 'admin';
    const isVideo = post.type === 'video';

    // Group logic
    const isGroupAdmin = post.isGroupAdmin;

    const handleDelete = () => {
        if (window.confirm("Are you sure?")) {
            if (onDelete) onDelete(post.id);
        }
    };

    const handleShare = () => {
        if (!currentUser) {
            alert("Please login to share.");
            return;
        }
        onShare(post.id);
    };

    const handlePlay = () => {
        if (post.audioTrack && onPlayAudio) {
            onPlayAudio(post.audioTrack);
        }
    };

    // Text Size & See More Logic
    const renderContent = (content: string) => {
        if (!content) return null;
        
        const words = content.split(/\s+/);
        const isLong = words.length > 40; // Truncate if more than 40 words
        const isTextOnly = post.type === 'text' && !post.image && !post.video && !post.background && !post.event && !post.product && !sharedPost && !post.audioTrack;
        
        // Large text logic: ONLY text, short (<150 chars) AND not truncated.
        const isShortText = content.length < 150 && isTextOnly && !isLong;
        const textSizeClass = isShortText ? 'text-[30px] leading-tight font-normal' : 'text-[18px] leading-relaxed';

        // Display Content
        let displayContent = content;
        if (isLong && !isExpanded) {
            displayContent = words.slice(0, 40).join(' ') + '...';
        }

        return (
            <div className={`px-3 md:px-4 pb-2 text-[#E4E6EB] ${textSizeClass}`}>
                <RichText text={displayContent} users={users} onProfileClick={onProfileClick} />
                {isLong && !isExpanded && (
                    <span className="text-[#1877F2] font-semibold cursor-pointer hover:underline ml-1" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>View more</span>
                )}
                {isLong && isExpanded && (
                    <span className="text-[#1877F2] font-semibold cursor-pointer hover:underline ml-1" onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}>View less</span>
                )}
            </div>
        );
    };

    return (
        <div className="bg-[#242526] rounded-xl shadow-sm mb-4 animate-fade-in border border-[#3E4042] overflow-hidden">
            {/* Header */}
            <div className="p-3 md:p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <img src={author.profileImage} alt={author.name} className="w-10 h-10 rounded-full object-cover cursor-pointer border border-[#3E4042]" onClick={() => onProfileClick(author.id)} />
                        {/* Avatar Follow Button (Reels Logic) - Hides when following */}
                        {!isOwner && currentUser && !isFollowing && onFollow && (
                            <div 
                                className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1877F2] rounded-full flex items-center justify-center border-2 border-[#242526] cursor-pointer hover:scale-110 active:scale-90 transition-transform z-10 shadow-sm"
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    onFollow(author.id); 
                                }}
                            >
                                <i className="fas fa-plus text-white text-[10px]"></i>
                            </div>
                        )}
                    </div>
                    <div>
                        {/* Modified Header for Group Posts */}
                        <div className="flex items-center gap-1 flex-wrap">
                            <h4 className="font-bold text-[#E4E6EB] text-[18px] cursor-pointer hover:underline" onClick={() => onProfileClick(author.id)}>{author.name}</h4>
                            {author.isVerified && <i className="fas fa-check-circle text-[#1877F2] text-[14px]"></i>}
                            
                            {/* Text Follow Button - Enhanced Professional Look */}
                            {!isOwner && currentUser && onFollow && (
                                <button 
                                    className={`ml-2 px-3 py-1 rounded-md font-bold text-[14px] transition-all active:scale-95 flex items-center gap-1 ${
                                        isFollowing 
                                        ? 'bg-[#3A3B3C] text-[#E4E6EB]' // Followed State
                                        : 'bg-[#1877F2] text-white hover:bg-[#166FE5]' // Follow State
                                    }`}
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        onFollow(author.id); 
                                    }}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            )}

                            {/* Group Name Indicator */}
                            {post.groupName && (
                                <>
                                    <i className="fas fa-caret-right text-[#B0B3B8] text-sm mx-1"></i>
                                    <span className="font-bold text-[#E4E6EB] text-[18px] hover:underline cursor-pointer">{post.groupName}</span>
                                </>
                            )}

                            {/* Admin Badge for Group Posts */}
                            {isGroupAdmin && (
                                <span className="ml-1 bg-[#3A3B3C] text-[#B0B3B8] border border-[#3E4042] text-[10px] px-1.5 rounded uppercase font-bold tracking-wide">
                                    Admin
                                </span>
                            )}

                            {post.feeling && <span className="text-[#B0B3B8] text-[15px]">is feeling {post.feeling}</span>}
                            {post.location && <span className="text-[#B0B3B8] text-[15px]">in <span className="font-semibold text-[#E4E6EB]">{post.location}</span></span>}
                            {post.type === 'event' && post.event && <span className="text-[#B0B3B8] text-[15px]">created an event.</span>}
                            {post.taggedUsers && post.taggedUsers.length > 0 && <span className="text-[#B0B3B8] text-[15px]">with {post.taggedUsers.length} others.</span>}
                        </div>
                        <div className="flex items-center gap-1 text-[#B0B3B8] text-[13px]">
                            <span>{post.timestamp}</span>
                            <span>•</span>
                            <i className={`fas ${post.visibility === 'Public' ? 'fa-globe-americas' : post.visibility === 'Friends' ? 'fa-user-friends' : 'fa-lock'} text-[12px]`}></i>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="w-9 h-9 hover:bg-[#3A3B3C] rounded-full flex items-center justify-center cursor-pointer transition-colors" onClick={() => setShowMenu(!showMenu)}>
                        <i className="fas fa-ellipsis-h text-[#B0B3B8]"></i>
                    </div>
                    {showMenu && (
                        <div className="absolute right-0 top-10 bg-[#242526] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-[#3E4042] w-[200px] z-10 py-2">
                             <div className="px-3 py-2 hover:bg-[#3A3B3C] cursor-pointer flex items-center gap-3 text-[#E4E6EB]">
                                 <i className="far fa-bookmark w-5"></i> Save Post
                             </div>
                             {(isOwner || isAdmin || isGroupAdmin || canDelete) && (
                                <>
                                    <div className="px-3 py-2 hover:bg-[#3A3B3C] cursor-pointer flex items-center gap-3 text-[#E4E6EB]">
                                        <i className="fas fa-pen w-5"></i> Edit Post
                                    </div>
                                    <div className="px-3 py-2 hover:bg-[#3A3B3C] cursor-pointer flex items-center gap-3 text-[#E4E6EB]" onClick={handleDelete}>
                                        <i className="fas fa-trash w-5"></i> Move to trash
                                    </div>
                                </>
                             )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            {renderContent(post.content || '')}

            {/* Audio Track Post */}
            {post.type === 'audio' && post.audioTrack && (
                <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-[#3E4042] bg-gradient-to-r from-gray-900 to-black relative">
                    {/* Background Blur */}
                    <div 
                        className="absolute inset-0 z-0 opacity-20 blur-xl scale-110 pointer-events-none" 
                        style={{ backgroundImage: `url(${post.audioTrack.cover})`, backgroundSize: 'cover' }}
                    ></div>
                    
                    <div className="relative z-10 p-4 flex items-center gap-4">
                        <div className="relative w-24 h-24 group flex-shrink-0">
                            <img src={post.audioTrack.cover} alt="Cover" className="w-full h-full object-cover rounded-lg shadow-lg" />
                            <div 
                                className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity"
                                onClick={handlePlay}
                            >
                                <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center shadow-lg">
                                    <i className="fas fa-play text-white ml-1"></i>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-[#1877F2]/20 text-[#1877F2] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#1877F2]/30 uppercase tracking-wide">{post.audioTrack.type}</span>
                            </div>
                            <h3 className="text-white font-bold text-lg truncate mb-1">{post.audioTrack.title}</h3>
                            <p className="text-[#B0B3B8] text-sm truncate flex items-center gap-1">
                                {post.audioTrack.artist}
                                {post.audioTrack.isVerified && <i className="fas fa-check-circle text-[#1877F2] text-xs"></i>}
                            </p>
                        </div>
                    </div>
                    {/* Visualizer Bar (Mock) */}
                    <div className="h-1 w-full bg-white/10 relative">
                        <div className="absolute top-0 left-0 h-full bg-[#1877F2] w-1/3"></div>
                    </div>
                </div>
            )}

            {/* Link Preview (Facebook style) */}
            {post.linkPreview && !post.image && !post.video && (
                <div className="mx-3 md:mx-4 mb-2 bg-[#242526] border border-[#3E4042] rounded-lg overflow-hidden cursor-pointer hover:bg-[#3A3B3C] transition-colors" onClick={() => window.open(post.linkPreview!.url, '_blank')}>
                    {post.linkPreview.image && <img src={post.linkPreview.image} alt="Preview" className="w-full h-48 md:h-64 object-cover" />}
                    <div className="p-3 bg-[#3A3B3C]">
                        <div className="text-[#B0B3B8] text-xs uppercase font-bold mb-1">{post.linkPreview.domain}</div>
                        <div className="text-[#E4E6EB] font-bold text-[17px] mb-1 line-clamp-1">{post.linkPreview.title}</div>
                        <div className="text-[#B0B3B8] text-[15px] line-clamp-2">{post.linkPreview.description}</div>
                    </div>
                </div>
            )}

            {/* Background Post Type */}
            {post.background && (
                 <div className="h-[300px] flex items-center justify-center p-8 text-center text-white font-bold text-2xl" style={{ background: post.background, backgroundSize: 'cover' }}>
                     {post.content}
                 </div>
            )}

            {/* Event Post */}
            {post.type === 'event' && post.event && (
                <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-[#3E4042]">
                    <img src={post.event.image} className="w-full h-40 object-cover" alt="" />
                    <div className="bg-[#3A3B3C] p-3 flex justify-between items-center">
                        <div>
                            <div className="text-red-500 text-xs font-bold uppercase">{new Date(post.event.date).toLocaleString('default', { month: 'short' })} {new Date(post.event.date).getDate()}</div>
                            <div className="text-[#E4E6EB] font-bold">{post.event.title}</div>
                            <div className="text-[#B0B3B8] text-sm">{post.event.location}</div>
                        </div>
                        <button className="border border-[#B0B3B8] text-[#E4E6EB] px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-[#4E4F50]">Interested</button>
                    </div>
                </div>
            )}

            {/* Product Post (Shared) - ENHANCED */}
            {post.type === 'product' && post.product && (
                 <div className="mx-4 mb-4 border border-[#3E4042] rounded-xl overflow-hidden cursor-pointer bg-[#3A3B3C]" onClick={() => onViewProduct && onViewProduct(post.product!)}>
                     <div className="p-3 flex items-center gap-2 border-b border-[#3E4042]">
                         <img src={post.product.sellerAvatar} className="w-8 h-8 rounded-full object-cover border border-[#3E4042]" alt="" />
                         <div>
                             <div className="flex items-center gap-1">
                                <span className="font-bold text-[#E4E6EB] text-sm">{post.product.sellerName}</span>
                                <i className="fas fa-check-circle text-[#1877F2] text-xs" title="Verified Seller"></i>
                             </div>
                             <span className="text-[#B0B3B8] text-xs">Listed {new Date(post.product.date).toLocaleDateString()}</span>
                         </div>
                     </div>
                     <img src={post.product.images[0]} className="w-full h-[250px] object-cover" alt="" />
                     <div className="p-3">
                         <div className="font-bold text-[#E4E6EB] text-lg mb-1">{post.product.title}</div>
                         <div className="text-[#B0B3B8] text-sm mb-2">{post.product.country} • {post.product.category}</div>
                         <div className="flex items-center justify-between">
                             <div className="text-[#E4E6EB] font-bold text-xl">${post.product.mainPrice}</div>
                             <button className="bg-[#1877F2] text-white px-3 py-1 rounded-lg text-sm font-bold">View</button>
                         </div>
                     </div>
                 </div>
            )}

            {/* Media */}
            {post.type === 'image' && post.image && !post.background && (
                <div className="mt-1 cursor-pointer bg-black flex items-center justify-center max-h-[600px] overflow-hidden" onClick={() => onViewImage(post.image!)}>
                    <img src={post.image} alt="Content" className="w-full h-auto object-contain max-h-[600px]" />
                </div>
            )}
            
            {post.type === 'video' && post.video && (
                <div className="mt-1 bg-black w-full cursor-pointer relative h-[500px] md:h-[600px]" onClick={() => onVideoClick(post)}>
                    {/* Video for Reels - No controls, clickable wrapper */}
                    <video src={post.video} className="w-full h-full object-cover pointer-events-none" />
                    
                    {/* Modern View Overlay */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10 z-10">
                         <i className="fas fa-eye text-white text-xs animate-pulse"></i>
                         <span className="text-white font-bold text-xs">{post.views || 0}</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <i className="fas fa-play text-white text-2xl pl-1"></i>
                        </div>
                    </div>
                </div>
            )}

            {/* Shared Post */}
            {sharedPost && (
                 <div className="mx-3 md:mx-4 mt-2 mb-4 border border-[#3E4042] rounded-xl overflow-hidden">
                     <div className="p-3 flex items-center gap-2 bg-[#3A3B3C]">
                         <img src={author.profileImage} className="w-8 h-8 rounded-full" alt="" />
                         <div>
                            <span className="font-bold text-[#E4E6EB] text-[15px] block">{author.name}</span>
                            <span className="text-[#B0B3B8] text-[13px]">Original Post</span>
                         </div>
                     </div>
                     <div className="p-3 text-[#E4E6EB] text-[15px]">{sharedPost.content}</div>
                     {sharedPost.image && <img src={sharedPost.image} className="w-full h-auto max-h-[400px] object-cover" alt="" />}
                     {sharedPost.video && (
                        <div className="relative">
                            <video src={sharedPost.video} className="w-full max-h-[400px] object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <i className="fas fa-play-circle text-white text-4xl"></i>
                            </div>
                        </div>
                     )}
                 </div>
            )}

            {/* Stats */}
            {!isVideo && (
                <div className="px-3 md:px-4 py-2.5 flex items-center justify-between text-[#B0B3B8] text-[15px]">
                    <div className="flex items-center gap-1.5 cursor-pointer">
                        {post.reactions.length > 0 && (
                            <div className="flex -space-x-1">
                                <div className="bg-[#1877F2] rounded-full p-[2px] z-10"><i className="fas fa-thumbs-up text-white text-[10px]"></i></div>
                                {post.reactions.some(r => r.type === 'love') && <div className="bg-[#F3425F] rounded-full p-[2px]"><i className="fas fa-heart text-white text-[10px]"></i></div>}
                            </div>
                        )}
                        <span className="hover:underline">{post.reactions.length > 0 ? post.reactions.length : ''}</span>
                    </div>
                    <div className="flex gap-4">
                        <span className="hover:underline cursor-pointer" onClick={() => onOpenComments(post.id)}>{post.comments.length} comments</span>
                        <span className="hover:underline cursor-pointer">{post.shares} shares</span>
                    </div>
                </div>
            )}

            {/* Actions - Hidden for Reels in Feed as requested */}
            {!isVideo && (
                <div className="px-2 py-1 border-t border-[#3E4042] mx-2 mb-1 flex items-center justify-between">
                    <ReactionButton 
                        currentUserReactions={myReaction} 
                        reactionCount={post.reactions.length} 
                        onReact={(type) => onReact(post.id, type)}
                        isGuest={!currentUser} 
                    />
                    <button 
                        className="flex-1 flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] transition-colors active:scale-95 group text-[#B0B3B8]"
                        onClick={() => currentUser ? onOpenComments(post.id) : alert("Please login to comment.")}
                    >
                        <i className="far fa-comment-alt text-[20px] group-hover:text-[#E4E6EB]"></i>
                        <span className="text-[15px] font-semibold group-hover:text-[#E4E6EB]">Comment</span>
                    </button>
                    <button 
                        className="flex-1 flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] transition-colors active:scale-95 group text-[#B0B3B8]"
                        onClick={handleShare}
                    >
                        <i className="fas fa-share text-[20px] group-hover:text-[#E4E6EB]"></i>
                        <span className="text-[15px] font-semibold group-hover:text-[#E4E6EB]">Share</span>
                    </button>
                </div>
            )}
        </div>
    );
};
