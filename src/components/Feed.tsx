import React, { useState, useRef, useEffect } from 'react';
import { User, Post as PostType, ReactionType, Comment, Product, LinkPreview, AudioTrack, Group, Brand } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { INITIAL_USERS, LOCATIONS_DATA, REACTION_ICONS, REACTION_COLORS, MARKETPLACE_COUNTRIES } from '../constants';
import { StickerPicker, EmojiPicker } from './Pickers';

// --- RICH TEXT RENDERER FOR MENTIONS & HASHTAGS ---
const RichText = ({ text, users, onProfileClick, onHashtagClick }: { text: string, users?: User[], onProfileClick: (id: number) => void, onHashtagClick?: (tag: string) => void }) => {
    if (!text) return null;

    const regex = /(@[\w\s]+|#\w+)/g;
    const parts = text.split(regex);

    return (
        <span className="leading-relaxed text-[#E4E6EB] whitespace-pre-wrap break-words">
            {parts.map((part, index) => {
                if (part.startsWith('@')) {
                    const name = part.substring(1).trim();
                    const user = users?.find(u => u.name.toLowerCase() === name.toLowerCase());
                    if (user) {
                        return (
                            <span 
                                key={index} 
                                className="text-[#1877F2] font-black cursor-pointer hover:underline" 
                                onClick={(e) => { e.stopPropagation(); onProfileClick(user.id); }}
                            >
                                {part}
                            </span>
                        );
                    }
                }
                if (part.startsWith('#')) {
                    return (
                        <span 
                            key={index} 
                            className="text-[#1877F2] font-bold cursor-pointer hover:underline"
                            onClick={(e) => { e.stopPropagation(); if(onHashtagClick) onHashtagClick(part); }}
                        >
                            {part}
                        </span>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
};

const getLinkPreview = (text: string): LinkPreview | null => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    if (match && match[0]) {
        const url = match[0];
        const domain = new URL(url).hostname;
        if (domain.includes('youtube')) return { url, title: "YouTube Video - Amazing Content", description: "Watch this incredible video on YouTube. Subscribe for more updates!", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", domain: "youtube.com" };
        else if (domain.includes('github')) return { url, title: "GitHub Repository", description: "Check out this open source project on GitHub. Contribute today!", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", domain: "github.com" };
        else return { url, title: "Website Link", description: `Check out this link from ${domain}. Interesting content inside.`, image: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", domain: domain };
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

const MentionSuggestions = ({ users, query, onSelect }: { users: User[], query: string, onSelect: (user: User) => void }) => {
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    if (filteredUsers.length === 0) return null;

    return (
        <div className="absolute bottom-full left-0 w-full bg-[#242526] border border-[#3E4042] rounded-t-xl shadow-2xl z-50 overflow-hidden mb-1 animate-slide-up">
            <div className="p-2 border-b border-[#3E4042] bg-[#18191A]">
                <span className="text-xs font-bold text-[#B0B3B8] uppercase">Suggestions</span>
            </div>
            {filteredUsers.map(user => (
                <div 
                    key={user.id} 
                    className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] cursor-pointer transition-colors"
                    onClick={() => onSelect(user)}
                >
                    <img src={user.profileImage} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <div className="flex flex-col">
                        <span className="text-[#E4E6EB] font-bold text-[15px]">{user.name}</span>
                        {user.isVerified && <span className="text-[#1877F2] text-[10px] font-bold">Verified User</span>}
                    </div>
                </div>
            ))}
        </div>
    );
};

interface RecommendationWidgetProps {
    title: string;
    onSeeAll?: () => void;
    children: React.ReactNode;
}

const FeedWidgetContainer: React.FC<RecommendationWidgetProps> = ({ title, onSeeAll, children }) => (
    <div className="bg-[#242526] rounded-xl p-4 mb-4 border border-[#3E4042] shadow-sm animate-fade-in">
        <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-[#E4E6EB] text-[17px]">{title}</h3>
            {onSeeAll && <span className="text-[#1877F2] text-sm cursor-pointer hover:underline" onClick={onSeeAll}>See all</span>}
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {children}
        </div>
    </div>
);

export const SuggestedProductsWidget: React.FC<{ products: Product[]; onViewProduct: (p: Product) => void; onSeeAll?: () => void }> = ({ products, onViewProduct, onSeeAll }) => {
    return (
        <FeedWidgetContainer title="Suggested for you" onSeeAll={onSeeAll}>
            {products.slice(0, 6).map(product => (
                <div key={product.id} className="min-w-[140px] bg-[#18191A] rounded-lg overflow-hidden border border-[#3E4042] cursor-pointer hover:opacity-90 transition-opacity" onClick={() => onViewProduct(product)}>
                    <div className="aspect-square relative">
                        <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                        <div className="absolute bottom-0 left-0 bg-black/60 px-2 py-1 text-white font-bold text-xs backdrop-blur-sm">
                            {MARKETPLACE_COUNTRIES.find(c => c.code === product.country)?.symbol || '$'}{product.mainPrice}
                        </div>
                    </div>
                    <div className="p-2">
                        <h4 className="text-[#E4E6EB] text-xs font-semibold truncate">{product.title}</h4>
                        <div className="text-[#B0B3B8] text-[10px] mt-1 truncate">{product.address}</div>
                    </div>
                </div>
            ))}
        </FeedWidgetContainer>
    );
};

export const SuggestedGroupsWidget: React.FC<{ groups: Group[]; onJoin: (id: string) => void; onSeeAll?: () => void; currentUser?: User | null }> = ({ groups, onJoin, onSeeAll }) => {
    return (
        <FeedWidgetContainer title="Groups you might like" onSeeAll={onSeeAll}>
            {groups.slice(0, 6).map(group => (
                <div key={group.id} className="min-w-[200px] bg-[#18191A] rounded-xl border border-[#3E4042] overflow-hidden flex flex-col relative">
                    <div className="h-20 relative">
                        <img src={group.coverImage} className="w-full h-full object-cover opacity-80" alt="" />
                    </div>
                    <div className="p-3 pt-8 flex-1 flex flex-col items-center text-center relative mt-[-30px]">
                        <img src={group.image} className="w-14 h-14 rounded-xl border-4 border-[#18191A] object-cover mb-2" alt="" />
                        <h4 className="text-[#E4E6EB] font-bold text-sm truncate w-full px-2">{group.name}</h4>
                        <p className="text-[#B0B3B8] text-xs mb-3">{group.members.length} members</p>
                        <button onClick={() => onJoin(group.id)} className="w-full mt-auto bg-[#263951] text-[#2D88FF] py-1.5 rounded-lg font-bold text-xs hover:bg-[#2A3F5A] transition-colors">Join</button>
                    </div>
                </div>
            ))}
        </FeedWidgetContainer>
    );
};

export const SuggestedPeopleWidget: React.FC<{ users: User[]; onFollow: (id: number) => void; onSeeAll?: () => void; currentUser?: User | null; onProfileClick?: (id: number) => void }> = ({ users, onFollow, onSeeAll, onProfileClick }) => {
    return (
        <FeedWidgetContainer title="People you may know" onSeeAll={onSeeAll}>
            {users.slice(0, 10).filter(u => u.id !== 0).map(user => (
                <div key={user.id} className="min-w-[120px] bg-[#18191A] rounded-xl border border-[#3E4042] overflow-hidden flex flex-col">
                    <div className="aspect-square relative cursor-pointer" onClick={() => onProfileClick?.(user.id)}>
                        <img src={user.profileImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="p-2 flex flex-col flex-1">
                        <h4 className="text-[#E4E6EB] font-bold text-sm truncate mb-1 cursor-pointer hover:underline" onClick={() => onProfileClick?.(user.id)}>{user.name}</h4>
                        <button onClick={() => onFollow(user.id)} className="mt-auto w-full bg-[#1877F2] text-white py-1.5 rounded-lg font-bold text-xs hover:bg-[#166FE5] transition-colors flex items-center justify-center gap-1">
                            <i className="fas fa-user-plus text-[10px]"></i> Follow
                        </button>
                    </div>
                </div>
            ))}
        </FeedWidgetContainer>
    );
};

export const SuggestedBrandsWidget: React.FC<{ brands: Brand[]; currentUser: User | null; onFollowBrand: (id: number) => void; onProfileClick: (id: number) => void }> = ({ brands, currentUser, onFollowBrand, onProfileClick }) => {
    const suggestions = brands.filter(b => !currentUser || !b.followers.includes(currentUser.id)).slice(0, 8);
    if (suggestions.length === 0) return null;
    return (
        <FeedWidgetContainer title="Suggested Pages">
            {suggestions.map(brand => (
                <div key={brand.id} className="min-w-[180px] bg-[#18191A] rounded-xl border border-[#3E4042] overflow-hidden flex flex-col shadow-md transition-all hover:scale-[1.02]">
                    <div className="h-20 relative cursor-pointer overflow-hidden" onClick={() => onProfileClick(brand.id)}>
                        <img src={brand.coverImage} className="w-full h-full object-cover opacity-90" alt="" />
                    </div>
                    <div className="px-3 pb-3 pt-6 relative flex-1 flex flex-col items-center text-center">
                        <div className="absolute -top-6 w-12 h-12 rounded-full border-4 border-[#18191A] overflow-hidden bg-[#242526] shadow-lg">
                            <img src={brand.profileImage} className="w-full h-full object-cover" alt="" />
                        </div>
                        <h4 className="text-[#E4E6EB] font-bold text-[14px] truncate w-full mb-0.5">{brand.name}</h4>
                        <p className="text-[#B0B3B8] text-[11px] mb-3">{brand.category}</p>
                        <button onClick={() => onFollowBrand(brand.id)} className="mt-auto w-full bg-[#3A3B3C] text-[#E4E6EB] py-1.5 rounded-lg font-black text-xs hover:bg-[#4E4F50] transition-colors flex items-center justify-center gap-1">
                            <i className="fas fa-flag text-[10px]"></i> Follow
                        </button>
                    </div>
                </div>
            ))}
        </FeedWidgetContainer>
    );
};

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
        if (!showDock) timerRef.current = setTimeout(() => setShowDock(true), 500); 
    };

    const handleMouseLeave = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        closeTimerRef.current = setTimeout(() => setShowDock(false), 300);
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
        <div className="flex-1 relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {showDock && (
                <div className="absolute -top-12 left-0 bg-[#242526] rounded-full shadow-xl p-1.5 flex gap-2 animate-fade-in border border-[#3E4042] z-50">
                    {reactionConfig.map(reaction => (
                        <div key={reaction.type} className="text-2xl hover:scale-125 transition-transform cursor-pointer hover:-translate-y-2 duration-200" onClick={() => { onReact(reaction.type); setShowDock(false); }}>{reaction.icon}</div>
                    ))}
                </div>
            )}
            <button onClick={() => onReact('like')} className="w-full flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] transition-colors active:scale-95">
                {activeReaction ? (<><span className="text-[20px]">{activeReaction.icon}</span><span className="text-[15px] font-bold" style={{ color: activeReaction.color }}>{activeReaction.type.charAt(0).toUpperCase() + activeReaction.type.slice(1)}</span></>) : (<><i className="far fa-thumbs-up text-[20px] text-[#B0B3B8]"></i><span className="text-[15px] font-bold text-[#B0B3B8]">Like</span></>)}
            </button>
        </div>
    );
};

export const ShareSheet: React.FC<any> = ({ post, groups = [], onClose, onShareNow, onShareToGroup, onCopyLink }) => {
    const [view, setView] = useState<'main' | 'groups'>('main');
    const [caption, setCaption] = useState('');

    if (view === 'groups') {
        return (
            <div className="fixed inset-0 z-[110] flex flex-col justify-end">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
                <div className="bg-[#242526] w-full rounded-t-xl z-20 animate-slide-up overflow-hidden max-h-[80vh] flex flex-col">
                    <div className="p-4 border-b border-[#3E4042] flex items-center"><button onClick={() => setView('main')} className="w-8 h-8 rounded-full hover:bg-[#3A3B3C] flex items-center justify-center mr-2"><i className="fas fa-arrow-left text-[#E4E6EB]"></i></button><h3 className="text-[#E4E6EB] font-bold text-[18px]">Share to a Group</h3></div>
                    <div className="p-2 overflow-y-auto">{groups.length > 0 ? groups.map((group: any) => (<div key={group.id} className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer" onClick={() => { onShareToGroup(group.id, caption); onClose(); }}><img src={group.image} className="w-12 h-12 rounded-lg object-cover" alt="" /><div><h4 className="font-bold text-[#E4E6EB]">{group.name}</h4><span className="text-[#B0B3B8] text-xs">{group.members.length} members</span></div></div>)) : (<div className="p-4 text-center text-[#B0B3B8]">You haven't joined any groups yet.</div>)}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
             <div className="bg-[#242526] w-full rounded-t-xl z-20 animate-slide-up overflow-hidden max-h-[80vh] flex flex-col">
                <div className="p-4 border-b border-[#3E4042] text-center relative">
                    <div className="w-12 h-1.5 bg-[#3E4042] rounded-full mx-auto mb-4"></div>
                    <h3 className="text-[#E4E6EB] font-bold text-[18px]">Share</h3>
                </div>
                <div className="p-4">
                    <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-[#E4E6EB] mb-4 outline-none" placeholder="Say something about this..." value={caption} onChange={(e) => setCaption(e.target.value)} />
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => onShareNow(caption)}>
                            <div className="w-12 h-12 bg-[#2D88FF] rounded-full flex items-center justify-center"><i className="fas fa-rss text-white text-xl"></i></div>
                            <span className="text-[#E4E6EB] text-xs text-center">Share Now</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => onCopyLink()}>
                            <div className="w-12 h-12 bg-[#3A3B3C] rounded-full flex items-center justify-center"><i className="fas fa-link text-white text-xl"></i></div>
                            <span className="text-[#E4E6EB] text-xs text-center">Copy Link</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setView('groups')}>
                            <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center"><i className="fas fa-users text-white text-xl"></i></div>
                            <span className="text-[#E4E6EB] text-xs text-center">Share to Group</span>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};

export const CommentsSheet: React.FC<any> = ({ post, currentUser, users, onClose, onComment, onLikeComment, getCommentAuthor, onProfileClick }) => {
    const [text, setText] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onComment(post.id, text);
            setText('');
            setShowEmojis(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-[#242526] w-full h-[75vh] rounded-t-xl z-20 flex flex-col animate-slide-up border-t border-[#3E4042]">
                <div className="p-3 border-b border-[#3E4042] flex justify-between items-center bg-[#242526] rounded-t-xl">
                    <div className="w-8"></div> 
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-1 bg-[#3E4042] rounded-full mb-2"></div>
                        <h3 className="text-[#E4E6EB] font-bold text-[16px]">Comments</h3>
                    </div>
                    <div onClick={onClose} className="w-8 h-8 rounded-full bg-[#3A3B3C] flex items-center justify-center cursor-pointer"><i className="fas fa-times text-[#B0B3B8]"></i></div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 bg-[#18191A]">
                    {post.comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-[#B0B3B8]">
                            <i className="far fa-comments text-4xl mb-2"></i>
                            <p>No comments yet.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {post.comments.map((comment: any) => {
                                const author = getCommentAuthor(comment.userId);
                                if (!author) return null;
                                return (
                                    <div key={comment.id} className="flex gap-2">
                                        <img src={author.profileImage} alt="" className="w-8 h-8 rounded-full object-cover cursor-pointer" onClick={() => onProfileClick(author.id)} />
                                        <div className="flex flex-col">
                                            <div className="bg-[#3A3B3C] px-3 py-2 rounded-2xl">
                                                <span className="font-black text-[13px] text-[#E4E6EB] cursor-pointer hover:underline" onClick={() => onProfileClick(author.id)}>{author.name}</span>
                                                <p className="text-[15px] text-[#E4E6EB] leading-snug">
                                                    <RichText text={comment.text} users={users} onProfileClick={onProfileClick} />
                                                </p>
                                            </div>
                                            <div className="flex gap-4 ml-3 mt-1">
                                                <span className="text-[12px] font-bold text-[#B0B3B8]">{comment.timestamp}</span>
                                                <span className="text-[12px] font-bold text-[#B0B3B8] cursor-pointer hover:underline" onClick={() => onLikeComment(comment.id)}>Like</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {currentUser && (
                    <div className="p-3 bg-[#242526] border-t border-[#3E4042]">
                        {showEmojis && <EmojiPicker onSelect={(emoji) => setText(prev => prev + emoji)} />}
                        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                            <img src={currentUser.profileImage} className="w-8 h-8 rounded-full object-cover" alt="" />
                            <div className="flex-1 bg-[#3A3B3C] rounded-full flex items-center px-4 py-2">
                                <input 
                                    type="text" 
                                    className="bg-transparent flex-1 outline-none text-[#E4E6EB] placeholder-[#B0B3B8] text-[15px]"
                                    placeholder="Write a comment..." 
                                    value={text} 
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <i className={`far fa-smile text-xl cursor-pointer ${showEmojis ? 'text-[#00a884]' : 'text-[#B0B3B8]'}`} onClick={() => setShowEmojis(!showEmojis)}></i>
                            </div>
                            <button type="submit" disabled={!text.trim()} className="text-[#1877F2] font-semibold disabled:opacity-50"><i className="fas fa-paper-plane text-xl"></i></button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export const CreatePost: React.FC<any> = ({ currentUser, onProfileClick, onClick, onCreateEventClick }) => {
    const userImage = currentUser?.profileImage || "https://ui-avatars.com/api/?name=Guest&background=random";
    const firstName = currentUser?.name.split(' ')[0] || "Guest";

    return (
        <div className="bg-[#242526] rounded-xl p-3 md:p-4 mb-4 shadow-sm border border-[#3E4042]">
            <div className="flex gap-2 mb-3">
                <img src={userImage} alt="User" className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-90 border border-[#3E4042]" onClick={() => currentUser && onProfileClick(currentUser.id)} />
                <div className="flex-1 bg-[#3A3B3C] rounded-full px-3 md:px-4 py-2 hover:bg-[#4E4F50] cursor-pointer flex items-center transition-colors" onClick={onClick}>
                    <span className="text-[#B0B3B8] text-[15px] md:text-[17px] truncate">What's on your mind, {firstName}?</span>
                </div>
            </div>
            <div className="border-t border-[#3E4042] pt-2 flex justify-between">
                <div className="flex items-center justify-center flex-1 gap-2 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors" onClick={onClick}>
                    <i className="fas fa-video text-[#F02849] text-[20px] md:text-[24px]"></i>
                    <span className="text-[#B0B3B8] font-semibold text-[13px] md:text-[15px] hidden sm:block">Live video</span>
                </div>
                <div className="flex items-center justify-center flex-1 gap-2 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors" onClick={onClick}>
                    <i className="fas fa-images text-[#45BD62] text-[20px] md:text-[24px]"></i>
                    <span className="text-[#B0B3B8] font-semibold text-[13px] md:text-[15px] hidden sm:block">Photo/video</span>
                </div>
                <div className="flex items-center justify-center flex-1 gap-2 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors" onClick={onCreateEventClick || onClick}>
                    <i className="far fa-calendar-alt text-[#F7B928] text-[20px] md:text-[24px]"></i>
                    <span className="text-[#B0B3B8] font-semibold text-[13px] md:text-[15px] hidden sm:block">Event</span>
                </div>
            </div>
        </div>
    );
};

export const CreatePostModal: React.FC<any> = ({ currentUser, users, onClose, onCreatePost, onCreateEventClick }) => {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [visibility, setVisibility] = useState('Public');
    const [background, setBackground] = useState('');
    const [location, setLocation] = useState('');
    const [feeling, setFeeling] = useState('');
    const [taggedPeople, setTaggedPeople] = useState<string>('');
    const [wantsMessages, setWantsMessages] = useState(false);
    
    const [mentionQuery, setMentionQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
        if (!text.trim() && !file && !background) return;
        
        let type = 'text';
        if (file) {
            type = file.type.startsWith('video') ? 'video' : 'image';
        } else if (background) {
            type = 'text'; 
        }

        const linkPreview = getLinkPreview(text);
        onCreatePost(text, file, type, visibility, location, feeling, [], background, linkPreview || undefined, wantsMessages);
        onClose();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setBackground(''); 
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setText(value);

        const textBeforeCursor = value.substring(0, e.target.selectionStart);
        const lastAtPos = textBeforeCursor.lastIndexOf('@');

        if (lastAtPos !== -1) {
            const query = textBeforeCursor.substring(lastAtPos + 1);
            if (!query.includes(' ') && query.length < 15) {
                setMentionQuery(query);
                setShowSuggestions(true);
                return;
            }
        }
        setShowSuggestions(false);
    };

    const handleSelectMention = (user: User) => {
        const cursorPosition = textareaRef.current?.selectionStart || 0;
        const textBeforeCursor = text.substring(0, cursorPosition);
        const lastAtPos = textBeforeCursor.lastIndexOf('@');
        const textAfterCursor = text.substring(cursorPosition);
        
        const newText = text.substring(0, lastAtPos) + `@${user.name} ` + textAfterCursor;
        setText(newText);
        setShowSuggestions(false);
        textareaRef.current?.focus();
    };

    const OptionRow = ({ icon, color, label, onClick, subtext, active }: { icon: string, color: string, label: string, onClick?: () => void, subtext?: string, active?: boolean }) => (
        <div className={`flex items-center justify-between p-4 hover:bg-[#3A3B3C] active:bg-[#4E4F50] transition-colors cursor-pointer border-b border-[#3E4042]/30 ${active ? 'bg-[#1877F2]/10' : ''}`} onClick={onClick}>
            <div className="flex items-center gap-3">
                <div className="w-8 flex justify-center"><i className={`${icon} text-[22px]`} style={{ color }}></i></div>
                <div className="flex flex-col">
                    <span className={`text-[#E4E6EB] text-[16px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
                    {subtext && <span className="text-[#B0B3B8] text-[12px]">{subtext}</span>}
                </div>
            </div>
            {active && <i className="fas fa-check text-[#1877F2]"></i>}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[150] bg-[#18191A] flex flex-col font-sans animate-slide-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#3E4042] bg-[#242526] sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <i className="fas fa-arrow-left text-[#E4E6EB] text-xl cursor-pointer p-2 -ml-2 rounded-full hover:bg-[#3A3B3C]" onClick={onClose}></i>
                    <div className="flex items-center gap-3">
                        <img src={currentUser.profileImage} className="w-10 h-10 rounded-full object-cover border border-[#3E4042]" alt="" />
                        <div>
                            <div className="font-black text-[#E4E6EB] text-[16px] leading-tight">{currentUser.name}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                                <div className="bg-[#3A3B3C] px-2 py-0.5 rounded-md text-[12px] text-[#E4E6EB] font-semibold flex items-center gap-1 border border-[#3E4042] cursor-pointer" onClick={() => setVisibility(visibility === 'Public' ? 'Friends' : 'Public')}>
                                    <i className={`fas ${visibility === 'Public' ? 'fa-globe-americas' : 'fa-user-friends'} text-[10px]`}></i>
                                    <span>{visibility}</span>
                                    <i className="fas fa-caret-down text-[10px]"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h3 className="text-[#E4E6EB] text-[18px] font-bold">Create post</h3>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col relative pb-32">
                {showSuggestions && (
                    <div className="px-4">
                         <MentionSuggestions users={users} query={mentionQuery} onSelect={handleSelectMention} />
                    </div>
                )}

                <div 
                    className={`flex-1 min-h-[200px] relative transition-all ${background ? 'flex items-center justify-center text-center p-8' : 'p-4'}`}
                    style={{ background: background.includes('url') ? background : background, backgroundSize: 'cover' }}
                >
                    <textarea 
                        ref={textareaRef}
                        autoFocus
                        className={`w-full bg-transparent outline-none text-[#E4E6EB] placeholder-[#B0B3B8] resize-none ${background ? 'text-center font-bold text-3xl drop-shadow-md placeholder-white/70' : 'text-[24px]'}`} 
                        placeholder="What’s new You need To Post?"
                        value={text}
                        onChange={handleTextChange}
                        style={{ height: 'auto', minHeight: '150px' }}
                    />
                </div>

                {(location || taggedPeople) && (
                   <div className="px-4 py-2 border-t border-[#3E4042]/20 flex flex-wrap gap-2">
                       {location && <div className="bg-[#3A3B3C] px-3 py-1 rounded-full text-xs font-bold text-[#E4E6EB] flex items-center gap-2"><i className="fas fa-map-marker-alt text-[#F02849]"></i> {location} <i className="fas fa-times cursor-pointer opacity-50" onClick={() => setLocation('')}></i></div>}
                       {taggedPeople && <div className="bg-[#3A3B3C] px-3 py-1 rounded-full text-xs font-bold text-[#E4E6EB] flex items-center gap-2"><i className="fas fa-user-tag text-[#1877F2]"></i> with {taggedPeople} <i className="fas fa-times cursor-pointer opacity-50" onClick={() => setTaggedPeople('')}></i></div>}
                   </div>
                )}

                {file && (
                    <div className="mx-4 mb-4 relative rounded-lg overflow-hidden border border-[#3E4042] max-h-[300px] bg-black shadow-lg">
                        {file.type.startsWith('video') ? <video src={URL.createObjectURL(file)} className="w-full h-full object-contain" controls /> : <img src={URL.createObjectURL(file)} className="w-full h-full object-contain" />}
                        <div onClick={() => setFile(null)} className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full cursor-pointer z-10"><i className="fas fa-times text-white"></i></div>
                    </div>
                )}

                {!file && (
                    <div className="px-4 py-4 flex items-center gap-3 overflow-x-auto scrollbar-hide border-t border-[#3E4042]/30 bg-[#242526]/50">
                         <div 
                            className={`w-10 h-10 rounded-lg cursor-pointer border-2 bg-[#3A3B3C] flex items-center justify-center flex-shrink-0 transition-all ${!background ? 'border-[#1877F2] scale-110' : 'border-[#3E4042]'}`}
                            onClick={() => setBackground('')}
                         >
                             <div className="w-6 h-6 bg-white rounded flex items-center justify-center"><i className="fas fa-font text-black text-[10px]"></i></div>
                         </div>
                         {BACKGROUNDS.filter(b => b.id !== 'none').map(bg => (
                             <div 
                                key={bg.id} 
                                className={`w-10 h-10 rounded-lg cursor-pointer border-2 flex-shrink-0 transition-all ${background === bg.value ? 'border-[#1877F2] scale-110' : 'border-transparent'}`}
                                style={{ background: bg.value, backgroundSize: 'cover' }}
                                onClick={() => setBackground(bg.value)}
                             ></div>
                         ))}
                    </div>
                )}

                <div className="bg-[#242526] border-t border-[#3E4042]">
                    <OptionRow icon="fas fa-images" color="#45BD62" label="Photos/videos" onClick={() => fileInputRef.current?.click()} />
                    <OptionRow icon="fas fa-user-tag" color="#1877F2" label="Tag people" onClick={() => { const p = prompt("Who are you with?"); if(p) setTaggedPeople(p); }} />
                    <OptionRow icon="fas fa-map-marker-alt" color="#F02849" label="Add location" onClick={() => { const loc = prompt("Where are you?"); if(loc) setLocation(loc); }} />
                    <OptionRow icon="far fa-smile" color="#F7B928" label="Feeling/activity" onClick={() => { const feel = prompt("How are you feeling?"); if(feel) setFeeling(feel); }} />
                    <OptionRow icon="fab fa-facebook-messenger" color="#1877F2" label="Get messages" onClick={() => setWantsMessages(!wantsMessages)} active={wantsMessages} subtext="Adds a 'Send Message' button to your post" />
                    <OptionRow icon="fas fa-calendar-alt" color="#F3425F" label="Create event" onClick={() => { onClose(); onCreateEventClick(); }} />
                </div>
            </div>

            <div className="p-4 bg-[#242526] border-t border-[#3E4042] fixed bottom-0 w-full z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                <button onClick={handleSubmit} disabled={!text.trim() && !file && !background} className="w-full bg-[#1877F2] text-white font-black text-[18px] py-3.5 rounded-lg hover:bg-[#166FE5] transition-all disabled:bg-[#3A3B3C]">POST</button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
        </div>
    );
};

// Fix: Add missing PostProps interface definition
interface PostProps {
    post: PostType;
    author: User;
    currentUser: User | null;
    users: User[];
    brands?: Brand[];
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
    onFollow?: (id: number) => void;
    isFollowing?: boolean;
    onPlayAudio?: (track: AudioTrack) => void;
    onGroupClick?: (groupId: string) => void;
    canDelete?: boolean; 
    onMessage?: (userId: number) => void;
    onJoinEvent?: (eventId: number) => void;
    sharedPost?: PostType;
}

export const Post: React.FC<PostProps> = ({ 
    post, author, currentUser, users, onProfileClick, onReact, onShare, onDelete, onEdit, 
    onHashtagClick, onViewImage, onOpenComments, onViewProduct, onVideoClick, onFollow, 
    isFollowing, onPlayAudio, onGroupClick, canDelete, onMessage, onJoinEvent, sharedPost
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content || '');
    const [showMenu, setShowMenu] = useState(false);
    
    const myReaction = currentUser ? post.reactions.find(r => r.userId === currentUser.id)?.type : undefined;
    const reactionCount = post.reactions.length;
    const commentCount = post.comments.length;
    const shareCount = post.shares;

    const isProduct = post.type === 'product' && post.product;
    const isEvent = post.type === 'event' && post.event;

    return (
        <div className="bg-[#242526] rounded-xl border border-[#3E4042] mb-4 shadow-sm animate-fade-in font-sans overflow-hidden">
            <div className="p-3 flex items-start justify-between">
                <div className="flex gap-2">
                    <div className="relative cursor-pointer" onClick={() => onProfileClick(author.id)}>
                        <img src={author.profileImage} alt={author.name} className="w-10 h-10 rounded-full object-cover border border-[#3E4042]" />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-1">
                            <span className="font-bold text-[#E4E6EB] text-[17px] hover:underline cursor-pointer leading-tight" onClick={() => onProfileClick(author.id)}>{author.name}</span>
                            {author.isVerified && <i className="fas fa-check-circle text-[#1877F2] text-xs"></i>}
                        </div>
                        <div className="flex items-center gap-1 text-[#B0B3B8] text-[12px]">
                            <span>{post.timestamp}</span>
                            <span>•</span>
                            <i className={`fas ${post.visibility === 'Public' ? 'fa-globe-americas' : 'fa-user-friends'} text-[10px]`}></i>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <i className="fas fa-ellipsis-h text-[#B0B3B8] p-2 rounded-full hover:bg-[#3A3B3C] cursor-pointer" onClick={() => setShowMenu(!showMenu)}></i>
                    {showMenu && (
                        <div className="absolute right-0 top-10 bg-[#242526] border border-[#3E4042] rounded-lg shadow-xl w-48 z-10 py-1">
                            {(canDelete || (currentUser && currentUser.id === author.id)) && onDelete && <div className="px-4 py-2 hover:bg-[#3A3B3C] cursor-pointer text-[#E4E6EB] flex items-center gap-2" onClick={() => { onDelete(post.id); setShowMenu(false); }}><i className="fas fa-trash"></i> Delete Post</div>}
                        </div>
                    )}
                </div>
            </div>

            <div className="px-3 pb-2 text-[#E4E6EB] text-[20px] leading-relaxed">
                {isEditing ? (
                    <div className="mb-2">
                        <textarea className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded p-2 text-[#E4E6EB]" value={editContent} onChange={e => setEditContent(e.target.value)} />
                        <div className="flex gap-2 mt-2 justify-end">
                            <button className="text-[#B0B3B8] text-sm" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button className="bg-[#1877F2] text-white px-3 py-1 rounded text-sm font-black" onClick={() => { onEdit?.(post.id, editContent); setIsEditing(false); }}>Save</button>
                        </div>
                    </div>
                ) : (
                    <div className={post.background ? 'text-center font-black text-[24px] py-10 px-4 min-h-[200px] flex items-center justify-center rounded-lg' : ''} style={post.background ? { background: post.background, backgroundSize: 'cover' } : {}}>
                        <RichText text={post.content || ''} users={users} onProfileClick={onProfileClick} onHashtagClick={onHashtagClick} />
                    </div>
                )}
            </div>

            {isProduct && (
                <div className="mx-3 mb-3 bg-[#18191A] rounded-xl border border-[#3E4042] overflow-hidden cursor-pointer" onClick={() => onViewProduct?.(post.product!)}>
                    <div className="aspect-video relative overflow-hidden bg-black flex items-center justify-center">
                        <img src={post.product!.images[0]} className="w-full h-full object-contain" alt="" />
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-white font-black text-xl">
                            {MARKETPLACE_COUNTRIES.find(c => c.code === post.product!.country)?.symbol || '$'}{post.product!.mainPrice.toLocaleString()}
                        </div>
                    </div>
                    <div className="p-4 bg-[#242526]">
                        <h3 className="text-[#E4E6EB] font-bold text-xl mb-1">{post.product!.title}</h3>
                        <div className="flex items-center gap-2 text-[#B0B3B8] text-sm mb-4">
                             <i className="fas fa-map-marker-alt"></i>
                             <span>{post.product!.address}</span>
                        </div>
                        <button className="w-full bg-[#45BD62] text-white font-black py-2.5 rounded-lg">View Product</button>
                    </div>
                </div>
            )}

            {isEvent && (
                <div className="mx-3 mb-3 bg-[#18191A] rounded-xl border border-[#3E4042] overflow-hidden group shadow-lg">
                    <div className="w-full aspect-video relative bg-black flex items-center justify-center cursor-pointer" onClick={() => onJoinEvent?.(post.event!.id)}>
                        <img src={post.event!.image} className="w-full h-full object-cover" alt="" />
                        <div className="absolute top-4 left-4 bg-white rounded-xl p-2 text-center shadow-2xl min-w-[60px] border border-gray-200">
                            <span className="block text-[#F02849] font-black text-xs uppercase">{new Date(post.event!.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="block text-black font-black text-2xl">{new Date(post.event!.date).getDate()}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-[#242526]">
                        <h3 className="text-[#E4E6EB] font-bold text-xl mb-1">{post.event!.title}</h3>
                        <p className="text-[#F02849] font-black text-sm mb-2">{new Date(post.event!.date).toDateString()} • {post.event!.time}</p>
                        <div className="flex items-center justify-between mt-4">
                             <span className="text-[#B0B3B8] text-sm">{post.event!.interestedIds.length} Interested</span>
                             <button onClick={() => onJoinEvent?.(post.event!.id)} className="bg-[#1877F2] text-white px-6 py-1.5 rounded-lg font-bold">Interested</button>
                        </div>
                    </div>
                </div>
            )}

            {!isProduct && !isEvent && post.image && (
                <div className="cursor-pointer bg-black w-full" onClick={() => onViewImage(post.image!)}>
                    <img src={post.image} alt="" className="w-full max-h-[600px] object-contain mx-auto" />
                </div>
            )}

            <div className="px-3 py-2 flex items-center justify-between text-[#B0B3B8] text-[13px]">
                <div className="flex items-center gap-1">{reactionCount > 0 && <i className="fas fa-thumbs-up text-[#1877F2]"></i>}<span className="font-bold">{reactionCount > 0 ? reactionCount : ''}</span></div>
                <div className="flex gap-3"><span className="font-bold">{commentCount} comments</span><span className="font-bold">{shareCount} shares</span></div>
            </div>

            <div className="border-t border-[#3E4042] mx-3"></div>

            <div className="px-1 py-1 flex items-center justify-between">
                <ReactionButton currentUserReactions={myReaction} reactionCount={reactionCount} onReact={(type) => onReact(post.id, type)} isGuest={!currentUser} />
                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] transition-colors text-[#B0B3B8] font-black text-[15px]" onClick={() => onOpenComments(post.id)}><i className="far fa-comment-alt text-[18px]"></i> Comment</button>
                <button className="flex-1 flex items-center justify-center gap-2 h-10 rounded hover:bg-[#3A3B3C] transition-colors text-[#B0B3B8] font-black text-[15px]" onClick={() => onShare(post.id)}><i className="fas fa-share text-[18px]"></i> Share</button>
            </div>
        </div>
    );
};
