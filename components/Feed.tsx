







import React, { useState, useRef, useEffect } from 'react';
import { User, Post as PostType, ReactionType, Comment, Product, LinkPreview } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { INITIAL_USERS, LOCATIONS_DATA, REACTION_ICONS, REACTION_COLORS, GIF_CATEGORIES, MARKETPLACE_COUNTRIES } from '../constants';

// --- Helper Data for Backgrounds ---
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

const FEELINGS = ['Happy', 'Blessed', 'Loved', 'Sad', 'Excited', 'Thankful', 'Crazy', 'Tired'];
const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '✨', '🎉', '🙌', '🥰', '🤣'];

// --- ADVANCED REACTION BUTTON ---
interface ReactionButtonProps {
    currentUserReactions: ReactionType | undefined;
    reactionCount: number;
    onReact: (type: ReactionType) => void;
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({ currentUserReactions, reactionCount, onReact }) => {
    const [showDock, setShowDock] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            setShowDock(true);
        }, 500); // 500ms delay for hover
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setTimeout(() => setShowDock(false), 300);
    };

    const handleTouchStart = () => {
        timerRef.current = setTimeout(() => {
            setShowDock(true);
        }, 500); // Long press
    };

    const handleTouchEnd = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    const handleClick = () => {
        if (currentUserReactions) {
            onReact('like'); // Toggle off (actually logic handled in parent, but typical toggle is remove or default like)
        } else {
            onReact('like');
        }
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
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Reaction Dock */}
            {showDock && (
                <div className="absolute -top-12 left-0 bg-[#242526] rounded-full shadow-xl p-1.5 flex gap-2 animate-fade-in border border-[#3E4042] z-50">
                    {reactionConfig.map(reaction => (
                        <div 
                            key={reaction.type} 
                            className="text-2xl hover:scale-125 transition-transform cursor-pointer hover:-translate-y-2 duration-200"
                            onClick={(e) => { e.stopPropagation(); onReact(reaction.type); setShowDock(false); }}
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
                         <span className="text-[15px] font-medium" style={{ color: activeReaction.color }}>
                            {activeReaction.type.charAt(0).toUpperCase() + activeReaction.type.slice(1)}
                         </span>
                    </>
                ) : (
                    <>
                        <i className="far fa-thumbs-up text-[20px] text-[#B0B3B8]"></i>
                        <span className="text-[15px] font-medium text-[#B0B3B8]">Like</span>
                    </>
                )}
            </button>
        </div>
    );
};

// --- SHARE SHEET (Facebook Style) ---
interface ShareSheetProps {
    onClose: () => void;
    onShareNow: () => void;
    onCopyLink: () => void;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({ onClose, onShareNow, onCopyLink }) => {
    return (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
             <div className="bg-[#242526] w-full rounded-t-xl z-20 animate-slide-up overflow-hidden">
                <div className="p-4 border-b border-[#3E4042]">
                    <h3 className="text-[#E4E6EB] text-center font-bold text-[16px]">Share</h3>
                </div>
                <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer" onClick={onShareNow}>
                        <div className="w-10 h-10 bg-[#2D88FF] rounded-full flex items-center justify-center"><i className="fas fa-rss text-white text-lg"></i></div>
                        <div className="flex flex-col">
                            <span className="text-[#E4E6EB] font-semibold">Share to Feed</span>
                            <span className="text-[#B0B3B8] text-xs">Post this to your profile</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer" onClick={onCopyLink}>
                        <div className="w-10 h-10 bg-[#3A3B3C] border border-[#3E4042] rounded-full flex items-center justify-center"><i className="fas fa-link text-[#E4E6EB] text-lg"></i></div>
                         <div className="flex flex-col">
                            <span className="text-[#E4E6EB] font-semibold">Copy Link</span>
                            <span className="text-[#B0B3B8] text-xs">Share on other apps</span>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-[#3E4042]">
                    <button onClick={onClose} className="w-full py-2 bg-[#3A3B3C] rounded-lg text-[#E4E6EB] font-semibold">Cancel</button>
                </div>
             </div>
        </div>
    )
}

// --- COMMENTS SHEET ---
interface CommentsSheetProps {
    post: PostType;
    currentUser: User;
    onClose: () => void;
    onComment: (postId: number, text: string, attachment?: { type: 'image' | 'gif' | 'file', url: string, fileName?: string }) => void;
    onLikeComment: (commentId: number) => void;
    getCommentAuthor: (id: number) => User | undefined;
    onProfileClick: (id: number) => void;
}

export const CommentsSheet: React.FC<CommentsSheetProps> = ({ post, currentUser, onClose, onComment, onLikeComment, getCommentAuthor, onProfileClick }) => {
    // ... (CommentsSheet logic remains unchanged, kept simple for brevity)
    const [commentText, setCommentText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(post.id, commentText);
            setCommentText('');
        }
    };
    return (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-[#242526] w-full max-h-[90vh] h-[80vh] rounded-t-2xl z-10 flex flex-col animate-slide-up shadow-2xl relative">
                <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-[#B0B3B8] rounded-full opacity-50"></div>
                </div>
                <div className="border-b border-[#3E4042] px-4 py-2 text-center"><span className="text-[#E4E6EB] font-bold text-[16px]">Comments</span></div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {post.comments.map(comment => {
                        const author = getCommentAuthor(comment.userId);
                        if (!author) return null;
                        return (
                            <div key={comment.id} className="flex gap-2">
                                <img src={author.profileImage} alt={author.name} className="w-9 h-9 rounded-full object-cover border border-[#3E4042] flex-shrink-0 cursor-pointer" onClick={() => onProfileClick(author.id)}/>
                                <div className="flex flex-col gap-1 max-w-[85%]">
                                    <div className="bg-[#3A3B3C] px-3 py-2 rounded-2xl inline-block">
                                        <h4 className="font-semibold text-[13px] text-[#E4E6EB] cursor-pointer hover:underline" onClick={() => onProfileClick(author.id)}>{author.name}</h4>
                                        <p className="text-[15px] text-[#E4E6EB] leading-snug mt-0.5 whitespace-pre-wrap">{comment.text}</p>
                                    </div>
                                    <div className="flex items-center gap-4 ml-3 text-[12px] text-[#B0B3B8] font-bold">
                                        <span>{comment.timestamp}</span>
                                        <span className={`cursor-pointer hover:underline ${comment.hasLiked ? 'text-[#1877F2]' : ''}`} onClick={() => onLikeComment(comment.id)}>Like</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="border-t border-[#3E4042] p-2 bg-[#242526] pb-6 sm:pb-3">
                    <form onSubmit={handleSubmit} className="flex items-end gap-2 mt-1">
                        <img src={currentUser.profileImage} className="w-9 h-9 rounded-full object-cover border border-[#3E4042]" alt="" />
                        <div className="flex-1 bg-[#3A3B3C] rounded-3xl flex items-center min-h-[36px] px-3 py-1.5">
                            <input ref={inputRef} type="text" className="flex-1 bg-transparent outline-none text-[#E4E6EB] placeholder-[#B0B3B8] text-[15px]" placeholder={`Write a comment...`} value={commentText} onChange={e => setCommentText(e.target.value)} autoFocus />
                        </div>
                        <button type="submit" disabled={!commentText.trim()} className={`p-2 rounded-full ${commentText.trim() ? 'text-[#1877F2] bg-[#263951]' : 'text-[#505151]'}`}><i className="fas fa-paper-plane text-lg transform rotate-12"></i></button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- PRODUCT CARD COMPONENT ---
interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    const country = MARKETPLACE_COUNTRIES.find(c => c.code === product.country);
    const symbol = country ? country.symbol : '$';
    const discountPercent = product.discountPrice ? Math.round(((product.mainPrice - product.discountPrice) / product.mainPrice) * 100) : 0;
    const priceToDisplay = product.discountPrice || product.mainPrice;

    return (
        <div className="bg-[#242526] rounded-xl overflow-hidden border border-[#3E4042] cursor-pointer hover:shadow-lg transition-shadow min-w-[150px]" onClick={(e) => { e.stopPropagation(); onClick(product); }}>
            <div className="relative aspect-square bg-white flex items-center justify-center">
                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                {discountPercent > 0 && <div className="absolute top-0 right-0 bg-[#E41E3F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">-{discountPercent}%</div>}
                <div className="absolute top-0 left-0 bg-[#FFD100] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm">Choice</div>
            </div>
            <div className="p-2">
                <div className="flex items-baseline gap-1 mb-0.5">
                     <span className="text-[#E4E6EB] font-bold text-[15px]">{symbol}{priceToDisplay.toFixed(2)}</span>
                     {product.discountPrice && <span className="text-[#B0B3B8] text-[11px] line-through">{symbol}{product.mainPrice.toFixed(2)}</span>}
                </div>
                <h3 className="text-[#E4E6EB] text-[13px] leading-tight line-clamp-1 opacity-90 mb-1">{product.title}</h3>
                <div className="flex items-center text-[#B0B3B8] text-[10px] gap-1">
                     <span>{country?.flag}</span>
                     <span className="truncate">{country?.name}</span>
                </div>
            </div>
        </div>
    );
};

// --- SUGGESTED PRODUCTS WIDGET ---
interface SuggestedProductsWidgetProps {
    products: Product[];
    currentUser: User;
    onViewProduct: (product: Product) => void;
}

export const SuggestedProductsWidget: React.FC<SuggestedProductsWidgetProps> = ({ products, currentUser, onViewProduct }) => {
    const userCode = MARKETPLACE_COUNTRIES.find(c => currentUser.nationality?.includes(c.name))?.code || 'US';
    const suggested = products.filter(p => p.country === userCode && p.sellerId !== currentUser.id);
    if (suggested.length === 0) return null;
    return (
        <div className="bg-[#242526] rounded-lg shadow-sm p-3 mb-4 mx-4 md:mx-0 border border-[#3E4042]">
             <div className="flex items-center justify-between mb-3 px-1">
                 <h3 className="text-[#E4E6EB] font-bold text-[16px]">Deals in {currentUser.nationality || 'your area'}</h3>
                 <span className="text-[#1877F2] text-sm cursor-pointer hover:underline">See more</span>
             </div>
             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                 {suggested.slice(0, 10).map(product => (<div key={product.id} className="w-[160px] flex-shrink-0"><ProductCard product={product} onClick={onViewProduct} /></div>))}
             </div>
        </div>
    );
};

// --- CREATE POST MODAL ---
interface CreatePostModalProps {
    currentUser: User;
    onClose: () => void;
    onCreatePost: (text: string, file: File | null, type: 'text' | 'image' | 'video', visibility: 'Public' | 'Friends' | 'Only Me', location?: string, feeling?: string, tagged?: number[], background?: string, linkPreview?: LinkPreview) => void;
    onCreateEventClick: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ currentUser, onClose, onCreatePost, onCreateEventClick }) => {
    const [view, setView] = useState<'create' | 'tag' | 'feeling' | 'location'>('create');
    const [text, setText] = useState('');
    const [background, setBackground] = useState(BACKGROUNDS[0]);
    const [visibility, setVisibility] = useState<'Public' | 'Friends' | 'Only Me'>('Public');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
    
    // Metadata State
    const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [taggedUsers, setTaggedUsers] = useState<number[]>([]);
    const [locationSearch, setLocationSearch] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useLanguage();

    // Link detection logic
    useEffect(() => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = text.match(urlRegex);
        if (match && !linkPreview && !mediaFile) {
            // Mock fetching preview
            const url = match[0];
            const domain = new URL(url).hostname;
            setLinkPreview({
                url: url,
                title: `Interesting article on ${domain}`,
                description: "Check out this amazing content that I found. It's really worth reading!",
                image: "https://images.unsplash.com/photo-1499750310159-52f8f6f32fe1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                domain: domain
            });
        } else if (!match) {
            setLinkPreview(null);
        }
    }, [text, mediaFile]);

    const handlePost = () => {
        if (!text.trim() && !mediaFile) return;
        const isBackgroundActive = background.id !== 'none' && !mediaFile && !linkPreview;
        onCreatePost(text, mediaFile, mediaFile ? (mediaFile.type.startsWith('image') ? 'image' : 'video') : 'text', visibility, selectedLocation || undefined, selectedFeeling || undefined, taggedUsers.length > 0 ? taggedUsers : undefined, isBackgroundActive ? background.value : undefined, linkPreview || undefined);
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
            setBackground(BACKGROUNDS[0]); 
            setLinkPreview(null); // Clear link preview if image added
        }
    };

    const toggleTagUser = (id: number) => {
        setTaggedUsers(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
    };

    const isBackgroundActive = background.id !== 'none' && !mediaFile && !linkPreview;

    const filteredLocations = LOCATIONS_DATA.filter(l => l.name.toLowerCase().includes(locationSearch.toLowerCase()));

    if (view === 'location') {
        return (
             <div className="fixed inset-0 z-[100] bg-[#18191A] flex flex-col animate-fade-in">
                <div className="flex items-center px-4 py-3 border-b border-[#3E4042] gap-4">
                    <i className="fas fa-arrow-left text-[#E4E6EB] text-xl cursor-pointer" onClick={() => setView('create')}></i>
                    <input type="text" placeholder="Search for a place" className="bg-transparent text-[#E4E6EB] outline-none flex-1 text-lg" autoFocus value={locationSearch} onChange={e => setLocationSearch(e.target.value)} />
                </div>
                 <div className="p-4 flex flex-col gap-2 overflow-y-auto">
                    {filteredLocations.slice(0, 20).map(l => (
                         <div key={l.name} className="flex items-center gap-3 p-3 hover:bg-[#242526] rounded-lg cursor-pointer" onClick={() => { setSelectedLocation(l.name); setView('create'); }}>
                             <div className="w-10 h-10 bg-[#3A3B3C] rounded-full flex items-center justify-center text-xl">{l.flag}</div>
                             <span className="text-[#E4E6EB] font-medium">{l.name}</span>
                         </div>
                    ))}
                </div>
            </div>
        );
    }

    if (view === 'tag') {
        return (
            <div className="fixed inset-0 z-[100] bg-[#18191A] flex flex-col animate-fade-in">
                <div className="flex items-center px-4 py-3 border-b border-[#3E4042] gap-4">
                    <i className="fas fa-arrow-left text-[#E4E6EB] text-xl cursor-pointer" onClick={() => setView('create')}></i>
                    <span className="text-[#E4E6EB] text-[18px] font-semibold">Tag Friends</span>
                    <span className="ml-auto text-[#1877F2] font-semibold cursor-pointer" onClick={() => setView('create')}>Done</span>
                </div>
                <div className="p-4 flex flex-col gap-2">
                    {INITIAL_USERS.filter(u => u.id !== currentUser.id).map(u => (
                        <div key={u.id} className="flex items-center justify-between p-2 hover:bg-[#242526] rounded-lg cursor-pointer" onClick={() => toggleTagUser(u.id)}>
                            <div className="flex items-center gap-3">
                                <img src={u.profileImage} className="w-10 h-10 rounded-full object-cover" alt="" />
                                <span className="text-[#E4E6EB] font-medium">{u.name}</span>
                            </div>
                            {taggedUsers.includes(u.id) ? <i className="fas fa-check-circle text-[#1877F2] text-xl"></i> : <div className="w-5 h-5 border-2 border-[#B0B3B8] rounded-full"></div>}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (view === 'feeling') {
        return (
             <div className="fixed inset-0 z-[100] bg-[#18191A] flex flex-col animate-fade-in">
                <div className="flex items-center px-4 py-3 border-b border-[#3E4042] gap-4">
                    <i className="fas fa-arrow-left text-[#E4E6EB] text-xl cursor-pointer" onClick={() => setView('create')}></i>
                    <span className="text-[#E4E6EB] text-[18px] font-semibold">How are you feeling?</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                    {FEELINGS.map(f => (
                         <div key={f} className="p-3 bg-[#242526] rounded-lg text-[#E4E6EB] text-center font-medium cursor-pointer hover:bg-[#3A3B3C]" onClick={() => { setSelectedFeeling(f); setView('create'); }}>
                             <span className="mr-2">🙂</span> {f}
                         </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-[#18191A] flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#3E4042]">
                <div className="flex items-center gap-4">
                    <div onClick={onClose} className="cursor-pointer"><i className="fas fa-arrow-left text-[#E4E6EB] text-xl"></i></div>
                    <span className="text-[#E4E6EB] text-[18px] font-normal">Create Post</span>
                </div>
                <button onClick={handlePost} disabled={!text.trim() && !mediaFile} className={`text-[16px] font-semibold ${!text.trim() && !mediaFile ? 'text-[#505151]' : 'text-[#1877F2]'}`}>POST</button>
            </div>

            {/* User Info & Metadata */}
            <div className="px-4 py-3 flex items-center gap-3">
                <img src={currentUser.profileImage} className="w-12 h-12 rounded-full object-cover border border-[#3E4042]" alt="" />
                <div>
                    <h4 className="font-bold text-[#E4E6EB] text-[16px]">
                        {currentUser.name}
                        {selectedFeeling && <span className="font-normal text-[#E4E6EB]"> is feeling {selectedFeeling}</span>}
                        {selectedLocation && <span className="font-normal text-[#E4E6EB]"> at {selectedLocation}</span>}
                        {taggedUsers.length > 0 && <span className="font-normal text-[#E4E6EB]"> with {taggedUsers.length} others</span>}
                    </h4>
                    <div className="flex items-center gap-1 bg-[#263951] text-[#E4E6EB] text-xs px-2 py-1 rounded-md w-fit mt-0.5 cursor-pointer border border-transparent" onClick={() => setVisibility(v => v === 'Public' ? 'Friends' : v === 'Friends' ? 'Only Me' : 'Public')}>
                        <i className={`fas ${visibility === 'Public' ? 'fa-globe-americas' : visibility === 'Friends' ? 'fa-user-friends' : 'fa-lock'} text-[10px]`}></i>
                        <span>{visibility}</span>
                        <i className="fas fa-caret-down"></i>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className={`flex-1 overflow-y-auto ${isBackgroundActive ? 'flex flex-col' : ''}`}>
                <div className={`w-full transition-all duration-300 relative ${isBackgroundActive ? 'flex-1 flex items-center justify-center min-h-[300px]' : 'min-h-[150px]'}`} style={{ background: isBackgroundActive ? background.value : 'transparent', backgroundSize: 'cover' }}>
                    <textarea className={`w-full bg-transparent border-none outline-none text-[#E4E6EB] resize-none px-4 py-2 placeholder-[#B0B3B8] ${isBackgroundActive ? 'text-center font-bold text-2xl h-auto' : 'text-xl h-full text-left'}`} placeholder={`What's on your mind, ${currentUser.firstName}?`} value={text} onChange={(e) => setText(e.target.value)} style={{ textShadow: isBackgroundActive ? '0 1px 2px rgba(0,0,0,0.5)' : 'none' }} dir="auto"/>
                </div>
                {mediaPreview && (
                    <div className="relative mx-4 mb-4 rounded-xl overflow-hidden border border-[#3E4042]">
                        <button onClick={() => { setMediaFile(null); setMediaPreview(null); }} className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white z-10"><i className="fas fa-times"></i></button>
                        {mediaFile?.type.startsWith('image') ? <img src={mediaPreview} className="w-full h-auto max-h-[400px] object-cover" alt="" /> : <video src={mediaPreview} className="w-full h-auto max-h-[400px]" controls />}
                    </div>
                )}
                {linkPreview && (
                    <div className="mx-4 mb-4 rounded-xl overflow-hidden bg-[#242526] border border-[#3E4042]">
                        <div className="relative">
                            <img src={linkPreview.image} alt={linkPreview.title} className="w-full h-[200px] object-cover" />
                            <button onClick={() => setLinkPreview(null)} className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="p-3 bg-[#3A3B3C]">
                            <p className="text-[12px] text-[#B0B3B8] uppercase">{linkPreview.domain}</p>
                            <h4 className="font-bold text-[#E4E6EB] text-[15px] leading-tight my-1">{linkPreview.title}</h4>
                            <p className="text-[13px] text-[#B0B3B8] line-clamp-2">{linkPreview.description}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Background Selector */}
            {!mediaFile && !linkPreview && (
                <div className="px-2 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide mb-2">
                    <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center cursor-pointer flex-shrink-0 ${background.id === 'none' ? 'border-[#1877F2]' : 'border-[#3E4042]'}`} onClick={() => setBackground(BACKGROUNDS[0])}><div className="w-6 h-6 bg-[#3A3B3C] rounded-md"></div></div>
                    {BACKGROUNDS.slice(1).map(bg => (<div key={bg.id} className={`w-8 h-8 rounded-lg cursor-pointer flex-shrink-0 border-2 ${background.id === bg.id ? 'border-white' : 'border-transparent'}`} style={{ background: bg.value, backgroundSize: 'cover' }} onClick={() => setBackground(bg)}></div>))}
                    <div className="w-8 h-8 rounded-lg bg-[#3A3B3C] flex items-center justify-center cursor-pointer flex-shrink-0"><i className="fas fa-th-large text-[#B0B3B8] text-xs"></i></div>
                </div>
            )}

            {/* Options */}
            <div className="border-t border-[#3E4042] bg-[#18191A]">
                 <div className="max-h-[40vh] overflow-y-auto pb-4">
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#242526] cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <i className="fas fa-images text-[#45BD62] text-xl w-6 text-center"></i><span className="text-[#E4E6EB] font-medium">Photo/video</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#242526] cursor-pointer" onClick={() => setView('tag')}>
                        <i className="fas fa-user-tag text-[#1877F2] text-xl w-6 text-center"></i><span className="text-[#E4E6EB] font-medium">Tag people</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#242526] cursor-pointer" onClick={() => setView('feeling')}>
                        <i className="far fa-smile text-[#F7B928] text-xl w-6 text-center"></i><span className="text-[#E4E6EB] font-medium">Feeling/activity</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#242526] cursor-pointer" onClick={() => setView('location')}>
                        <i className="fas fa-map-marker-alt text-[#F5533D] text-xl w-6 text-center"></i><span className="text-[#E4E6EB] font-medium">Check in</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#242526] cursor-pointer" onClick={() => alert("Go Live feature is starting...")}>
                        <i className="fas fa-video text-[#F02849] text-xl w-6 text-center"></i><span className="text-[#E4E6EB] font-medium">Live video</span>
                    </div>
                     <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#242526] cursor-pointer" onClick={onCreateEventClick}>
                        <i className="fas fa-calendar-alt text-[#1877F2] text-xl w-6 text-center"></i><span className="text-[#E4E6EB] font-medium">Create event</span>
                    </div>
                 </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
        </div>
    );
};

// --- CREATE POST TRIGGER ---
interface CreatePostProps {
    currentUser: User;
    onProfileClick: (id: number) => void;
    onClick?: () => void;
    onCreateEventClick?: () => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onProfileClick, onClick, onCreateEventClick }) => {
    return (
        <div className="bg-[#242526] rounded-lg shadow-sm p-3 mb-4 flex flex-col gap-3 mx-4 md:mx-0 border border-[#3E4042] font-sans">
             <div className="flex items-center gap-2">
                <img src={currentUser.profileImage} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover cursor-pointer border border-[#3E4042]" onClick={() => onProfileClick(currentUser.id)} />
                <div className="flex-1 bg-[#3A3B3C] hover:bg-[#4E4F50] rounded-full px-4 py-2.5 cursor-pointer transition-colors" onClick={onClick}>
                    <span className="text-[#B0B3B8] text-[17px] font-normal">What's on your mind, {currentUser.firstName}?</span>
                </div>
            </div>
            <div className="border-t border-[#3E4042] pt-2 flex justify-between px-2 sm:px-4">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-[#3A3B3C] p-2 rounded-lg transition-colors" onClick={onClick}>
                     <i className="fas fa-video text-[#F02849] text-xl"></i>
                     <span className="text-[#B0B3B8] font-semibold text-[14px] hidden sm:block">Live video</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-[#3A3B3C] p-2 rounded-lg transition-colors" onClick={onClick}>
                     <i className="fas fa-images text-[#45BD62] text-xl"></i>
                     <span className="text-[#B0B3B8] font-semibold text-[14px] hidden sm:block">Photo/video</span>
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-[#3A3B3C] p-2 rounded-lg transition-colors" onClick={onCreateEventClick ? onCreateEventClick : onClick}>
                     <i className="fas fa-calendar-alt text-[#1877F2] text-xl"></i>
                     <span className="text-[#B0B3B8] font-semibold text-[14px] hidden sm:block">Event</span>
                </div>
            </div>
        </div>
    );
};

// --- FEED POST COMPONENT ---
interface PostProps {
    post: PostType;
    author: User;
    currentUser: User;
    onProfileClick: (id: number) => void;
    onReact: (postId: number, type: ReactionType) => void;
    onShare: (postId: number) => void;
    onDelete: (postId: number) => void;
    onEdit: (postId: number, content: string) => void;
    onHashtagClick: (tag: string) => void;
    onViewImage: (url: string) => void;
    onVideoClick?: (post: PostType) => void;
    onOpenComments: (postId: number) => void;
    onViewProduct?: (product: Product) => void;
    sharedPost?: PostType;
}

export const Post: React.FC<PostProps> = ({ post, author, currentUser, onProfileClick, onReact, onShare, onDelete, onEdit, onHashtagClick, onViewImage, onVideoClick, onOpenComments, onViewProduct, sharedPost }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const isAuthor = currentUser.id === author.id;
    const isAdminOrMod = currentUser.role === 'admin' || currentUser.role === 'moderator';
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content || '');
    const isReel = post.type === 'video';

    // Get current user's reaction
    const myReaction = post.reactions.find(r => r.userId === currentUser.id)?.type;
    const topReaction = post.reactions.length > 0 ? REACTION_ICONS[post.reactions[0].type as ReactionType] : null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowMenu(false); };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEditSubmit = () => { if (editContent.trim()) { onEdit(post.id, editContent); setIsEditing(false); setShowMenu(false); } };
    const handleDeleteClick = () => { if (window.confirm("Delete post?")) onDelete(post.id); };
    
    // Tap to Love / Tap again to View logic
    const handleMediaClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (myReaction === 'love' || post.type === 'video') {
            // Already loved OR it's a video, view full screen
            if (post.image) onViewImage(post.image);
            else if (post.video && onVideoClick) onVideoClick(post);
        } else {
            // First tap, trigger love
            onReact(post.id, 'love');
        }
    };
    
    const renderContentWithHashtags = (content: string) => {
        if (!content) return null;
        const parts = content.split(/(#\w+)/g);
        return parts.map((part, index) => part.startsWith('#') ? <span key={index} className="text-[#1877F2] cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); onHashtagClick(part); }}>{part}</span> : <span key={index}>{part}</span>);
    };
    const getVisibilityIcon = () => { switch(post.visibility) { case 'Public': return 'fa-globe-americas'; case 'Friends': return 'fa-user-friends'; case 'Only Me': return 'fa-lock'; default: return 'fa-globe-americas'; } };

    return (
        <>
            <div className="bg-[#242526] w-full mb-0 border-b-[8px] border-[#18191A] relative font-sans">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <img src={author.profileImage} alt={author.name} className="w-10 h-10 rounded-full object-cover cursor-pointer border border-[#3E4042]" onClick={() => onProfileClick(author.id)} />
                        <div className="flex flex-col">
                            <h3 className="text-[16px] font-semibold text-[#E4E6EB] leading-tight cursor-pointer hover:underline flex items-center gap-1" onClick={() => onProfileClick(author.id)}>
                                {author.name}
                                {author.isVerified && <i className="fas fa-check-circle text-[#1877F2] text-[14px]"></i>}
                                {post.feeling && <span className="font-normal text-[#B0B3B8] ml-1">is feeling {post.feeling}</span>}
                                {post.location && <span className="font-normal text-[#B0B3B8] ml-1">at {post.location}</span>}
                                {post.taggedUsers && post.taggedUsers.length > 0 && <span className="font-normal text-[#B0B3B8] ml-1">with {post.taggedUsers.length} others</span>}
                                {post.type === 'product' && <span className="font-normal text-[#B0B3B8] ml-1">listed a product for sale</span>}
                                {post.type === 'event' && <span className="font-normal text-[#B0B3B8] ml-1">created an event</span>}
                                {sharedPost && <span className="font-normal text-[#B0B3B8] ml-1">shared a post</span>}
                            </h3>
                            <div className="flex items-center text-[13px] text-[#B0B3B8] gap-1">
                                <span>{post.timestamp}</span><span>·</span><i className={`fas ${getVisibilityIcon()} text-xs`} title={post.visibility}></i>
                            </div>
                        </div>
                    </div>
                    <div className="relative" ref={menuRef}>
                        <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3A3B3C] cursor-pointer text-[#B0B3B8] transition-colors" onClick={() => setShowMenu(!showMenu)}><i className="fas fa-ellipsis-h"></i></div>
                        {showMenu && (
                            <div className="absolute right-0 top-10 bg-[#242526] shadow-[0_2px_12px_rgba(0,0,0,0.5)] rounded-lg w-[200px] z-20 py-2 border border-[#3E4042]">
                                {isAuthor ? (
                                    <>
                                        {post.type !== 'product' && <div className="px-4 py-2 hover:bg-[#3A3B3C] cursor-pointer flex items-center gap-3 text-[15px] text-[#E4E6EB]" onClick={() => { setIsEditing(true); setShowMenu(false); }}><i className="fas fa-pen text-[#B0B3B8] w-5"></i> Edit Post</div>}
                                        <div className="px-4 py-2 hover:bg-[#3A3B3C] cursor-pointer flex items-center gap-3 text-[15px] text-[#E4E6EB]" onClick={handleDeleteClick}><i className="fas fa-trash text-[#B0B3B8] w-5"></i> Move to trash</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="px-4 py-2 hover:bg-[#3A3B3C] cursor-pointer flex items-center gap-3 text-[15px] text-[#E4E6EB]"><i className="fas fa-bookmark text-[#B0B3B8] w-5"></i> Save Post</div>
                                        {isAdminOrMod && <div className="px-4 py-2 hover:bg-[#3A3B3C] cursor-pointer flex items-center gap-3 text-[15px] text-red-500" onClick={handleDeleteClick}><i className="fas fa-trash text-red-500 w-5"></i> Delete Post (Admin)</div>}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                {post.content && (
                    <div className={`px-4 pb-3 ${post.background ? 'flex items-center justify-center text-center min-h-[300px]' : ''}`} style={post.background ? { background: post.background, backgroundSize: 'cover' } : {}}>
                         <p className={`text-[16px] text-[#E4E6EB] leading-relaxed whitespace-pre-wrap font-normal ${post.background ? 'text-2xl font-bold text-white drop-shadow-md' : ''}`} dir="auto">{renderContentWithHashtags(post.content)}</p>
                    </div>
                )}
                
                {/* Event Attachment (Full Image Display) */}
                {post.type === 'event' && post.event && (
                    <div className="w-full cursor-pointer relative mb-2" onClick={() => {/* Open Event Details */}}>
                         <div className="relative aspect-video w-full">
                            <img src={post.event.image} alt="Event" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="text-[#F02849] font-bold text-sm uppercase mb-1">
                                    {new Date(post.event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} @ {post.event.time}
                                </div>
                                <h2 className="text-white font-bold text-2xl mb-1 drop-shadow-md">{post.event.title}</h2>
                                <p className="text-[#E4E6EB] text-sm drop-shadow-md"><i className="fas fa-map-marker-alt mr-1"></i> {post.event.location}</p>
                            </div>
                            <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-1 shadow-lg text-center">
                                <span className="block text-[#F02849] font-bold text-xs uppercase">{new Date(post.event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                <span className="block text-black font-extrabold text-xl leading-none">{new Date(post.event.date).getDate()}</span>
                            </div>
                         </div>
                         <div className="bg-[#3A3B3C] p-3 flex justify-between items-center mx-4 -mt-6 relative rounded-lg shadow-md border border-[#3E4042] z-10 mb-3">
                             <div>
                                 <span className="text-[#E4E6EB] font-bold">{post.event.attendees.length} people going</span>
                             </div>
                             <button className="bg-[#1877F2] text-white px-4 py-1.5 rounded-md font-bold text-sm">Interested</button>
                         </div>
                    </div>
                )}

                {/* Shared Post Embedding */}
                {sharedPost && (
                    <div className="mx-4 mb-3 border border-[#3E4042] rounded-lg overflow-hidden bg-[#18191A]">
                        {/* Recursive rendering of shared content content (simplified) */}
                        {sharedPost.image && <img src={sharedPost.image} className="w-full h-[200px] object-cover" alt="" />}
                        {sharedPost.video && <div className="w-full h-[200px] bg-black flex items-center justify-center"><i className="fas fa-video text-white text-3xl"></i></div>}
                        <div className="p-3">
                            <div className="font-bold text-[#E4E6EB] text-sm mb-1">{author.name} posted:</div>
                            {sharedPost.content && <p className="text-[#E4E6EB] text-sm line-clamp-3">{sharedPost.content}</p>}
                        </div>
                    </div>
                )}

                {/* Link Preview */}
                {post.linkPreview && (
                    <div className="mx-4 mb-3 rounded-lg overflow-hidden bg-[#242526] border border-[#3E4042] cursor-pointer hover:bg-[#2A2B2C]" onClick={() => window.open(post.linkPreview?.url, '_blank')}>
                        <img src={post.linkPreview.image} alt={post.linkPreview.title} className="w-full h-[200px] object-cover" />
                        <div className="p-3 bg-[#3A3B3C]">
                            <p className="text-[12px] text-[#B0B3B8] uppercase">{post.linkPreview.domain}</p>
                            <h4 className="font-bold text-[#E4E6EB] text-[15px] leading-tight my-1">{post.linkPreview.title}</h4>
                            <p className="text-[13px] text-[#B0B3B8] line-clamp-1">{post.linkPreview.description}</p>
                        </div>
                    </div>
                )}

                {/* Product Attachment */}
                {post.type === 'product' && post.product && (
                    <div className="mx-4 mb-3">
                         <ProductCard product={post.product} onClick={(p) => onViewProduct && onViewProduct(p)} />
                    </div>
                )}

                {/* Media with Double Tap Logic */}
                {post.type === 'image' && post.image && (
                    <div className="w-full bg-[#18191A] cursor-pointer relative" onClick={handleMediaClick}>
                         <img src={post.image} alt="Post" className="w-full h-auto object-cover block max-h-[700px]" loading="lazy" />
                    </div>
                )}
                
                {/* Reel / Video */}
                {isReel && post.video && (
                    <div className="w-full bg-black relative flex justify-center items-center cursor-pointer overflow-hidden aspect-[4/5]" onClick={handleMediaClick}>
                        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1.5 pointer-events-none"><i className="fas fa-clapperboard text-white text-xs"></i><span className="text-white text-[11px] font-bold tracking-wide">Reels</span></div>
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20"><div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/50"><i className="fas fa-play text-white text-2xl ml-1"></i></div></div>
                        <video className="w-full h-full object-cover block" crossOrigin="anonymous"><source src={post.video} type="video/mp4" /></video>
                        <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent pointer-events-none">
                            <div className="text-white font-bold text-sm ml-2 mb-1">Watch full reel</div>
                        </div>
                    </div>
                )}

                {/* Engagement Stats - Different for Reels */}
                {!isReel ? (
                    <>
                    {(post.reactions.length > 0 || post.comments.length > 0 || post.shares > 0) && (
                        <div className="px-4 py-2.5 flex items-center justify-between text-[14px] text-[#B0B3B8]">
                            <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
                                {post.reactions.length > 0 && <span className="text-lg">{topReaction}</span>}
                                <span>{post.reactions.length > 0 ? post.reactions.length : ''}</span>
                            </div>
                            <div className="flex gap-4">
                                {post.comments.length > 0 && <span className="cursor-pointer hover:underline" onClick={() => onOpenComments(post.id)}>{post.comments.length} comments</span>}
                                {post.shares > 0 && <span className="cursor-pointer hover:underline">{post.shares} shares</span>}
                            </div>
                        </div>
                    )}
                     <div className="px-2 border-t border-[#3E4042]">
                        <div className="flex items-center justify-between py-1">
                            <ReactionButton 
                                currentUserReactions={myReaction} 
                                reactionCount={post.reactions.length}
                                onReact={(type) => onReact(post.id, type)} 
                            />
                            <button onClick={() => onOpenComments(post.id)} className="flex-1 flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] transition-colors active:scale-95">
                                <i className="far fa-comment-alt text-[20px] text-[#B0B3B8]"></i><span className="text-[15px] font-medium text-[#B0B3B8]">Comment</span>
                            </button>
                            <button onClick={() => onShare(post.id)} className="flex-1 flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] transition-colors active:scale-95">
                                <i className="fas fa-share text-[20px] text-[#B0B3B8]"></i><span className="text-[15px] font-medium text-[#B0B3B8]">Share</span>
                            </button>
                        </div>
                    </div>
                    </>
                ) : (
                    // Reel Action Bar (View Only)
                    <div className="bg-[#263951] p-2 flex items-center justify-between cursor-pointer" onClick={(e) => { e.stopPropagation(); onVideoClick && onVideoClick(post); }}>
                        <div className="flex items-center gap-2 px-2">
                             <i className="fas fa-play text-[#1877F2]"></i>
                             <span className="text-[#E4E6EB] font-bold text-sm">Watch Reel</span>
                        </div>
                        <div className="text-[#B0B3B8] text-xs px-2">
                            {post.shares * 123 + post.reactions.length * 15} views
                        </div>
                    </div>
                )}
            </div>
            
            {/* Edit Modal (Reuse logic) */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={() => setIsEditing(false)}>
                    <div className="bg-[#242526] rounded-lg w-full max-w-[500px] shadow-xl overflow-hidden relative border border-[#3E4042]" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-[#3E4042] relative">
                            <h2 className="text-[20px] font-bold text-center w-full text-[#E4E6EB]">Edit Post</h2>
                            <div className="absolute right-4 w-9 h-9 bg-[#3A3B3C] hover:bg-[#4E4F50] rounded-full flex items-center justify-center cursor-pointer transition-colors" onClick={() => setIsEditing(false)}><i className="fas fa-times text-[#B0B3B8]"></i></div>
                        </div>
                        <div className="p-4 max-h-[70vh] overflow-y-auto"><textarea className="w-full bg-transparent resize-none border-none focus:ring-0 text-[16px] text-[#E4E6EB] placeholder-[#B0B3B8] min-h-[100px] outline-none" value={editContent} onChange={(e) => setEditContent(e.target.value)} autoFocus /></div>
                        <div className="p-4 pt-0"><button className="w-full py-2 rounded-md font-semibold text-[15px] transition-colors bg-[#1877F2] text-white hover:bg-[#166FE5]" onClick={handleEditSubmit}>Save</button></div>
                    </div>
                </div>
            )}
        </>
    );
};