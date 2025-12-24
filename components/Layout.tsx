import React, { useState, useEffect, useRef } from 'react';
import { User, Notification, Group, Brand } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { NotificationDropdown } from './Notifications';

// --- MENU OVERLAY COMPONENT ---
interface MenuOverlayProps {
    currentUser: User | null;
    onClose: () => void;
    onNavigate: (view: string) => void;
    onLogout: () => void;
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({ currentUser, onClose, onNavigate, onLogout }) => {
    const { t } = useLanguage();

    const menuItems = [
        { id: 'marketplace', title: 'Marketplace', icon: 'fas fa-store', color: '#1877F2', desc: 'Buy and sell in your community.' },
        { id: 'groups', title: 'Groups', icon: 'fas fa-users', color: '#1877F2', desc: 'Connect with people who share your interests.' },
        { id: 'brands', title: 'Brands', icon: 'fas fa-flag', color: '#F3425F', desc: 'Discover and connect with your favorite businesses.' },
        // FIXED: Changed from 'create_event' to 'events'
        { id: 'events', title: 'Events', icon: 'fas fa-calendar-alt', color: '#F3425F', desc: 'Browse and create events.' },
        { id: 'profiles', title: 'Profiles', icon: 'fas fa-user-friends', color: '#1877F2', desc: 'See friends and profiles.' },
        { id: 'music', title: 'UNERA Music', icon: 'fas fa-music', color: '#0055FF', desc: 'Listen to music and podcasts.' }, 
        { id: 'tools', title: 'UNERA Tools', icon: 'fas fa-briefcase', color: '#2ABBA7', desc: 'PDF Tools, AI Chat, Image Tools.' }, 
        { id: 'reels', title: 'Reels', icon: 'fas fa-clapperboard', color: '#E41E3F', desc: 'Watch and create short videos.' },
        { id: 'birthdays', title: 'Birthdays', icon: 'fas fa-birthday-cake', color: '#F7B928', desc: 'See upcoming birthdays.' },
        { id: 'memories', title: 'Memories', icon: 'fas fa-history', color: '#1877F2', desc: 'Browse your old photos, videos and posts.' },
    ];

    const bottomItems = [
        { id: 'settings', title: 'Settings & Privacy', icon: 'fas fa-cog' },
        { id: 'help', title: 'Help & Support', icon: 'fas fa-question-circle' },
        { id: 'terms', title: 'Terms of Service', icon: 'fas fa-file-alt' },
        { id: 'privacy', title: 'Privacy & Policy', icon: 'fas fa-shield-alt' },
    ];

    return (
        <div className="fixed inset-0 z-[200] bg-[#18191A] animate-slide-down flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-[#3E4042] bg-[#242526] shadow-sm flex-shrink-0">
                <h2 className="text-[24px] font-bold text-[#E4E6EB]">Menu</h2>
                <div className="flex gap-2">
                    <div className="w-9 h-9 bg-[#3A3B3C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#4E4F50]">
                        <i className="fas fa-search text-[#E4E6EB]"></i>
                    </div>
                    <div onClick={onClose} className="w-9 h-9 bg-[#3A3B3C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#4E4F50]">
                        <i className="fas fa-times text-[#E4E6EB] text-xl"></i>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#18191A]">
                {/* Profile Card */}
                {currentUser && (
                    <div className="flex items-center gap-3 p-3 bg-[#242526] rounded-xl shadow-sm mb-4 cursor-pointer hover:bg-[#3A3B3C]" onClick={() => { onNavigate('profile'); onClose(); }}>
                        <img src={currentUser.profileImage} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex flex-col">
                            <span className="font-bold text-[#E4E6EB] text-[18px]">{currentUser.name}</span>
                            <span className="text-[#B0B3B8] text-[15px]">View your profile</span>
                        </div>
                    </div>
                )}

                <h3 className="text-[#E4E6EB] font-semibold text-[17px] mb-3 px-1">All shortcuts</h3>

                {/* Grid Menu */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {menuItems.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-[#242526] rounded-xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer hover:bg-[#3A3B3C] transition-colors"
                            onClick={() => {
                                onNavigate(item.id);
                                onClose();
                            }}
                        >
                            <div className="w-auto self-start">
                                <i className={`${item.icon} text-[28px] drop-shadow-sm`} style={{ color: item.color }}></i>
                            </div>
                            <div>
                                <h4 className="font-semibold text-[#E4E6EB] text-[17px] leading-tight mb-0.5">{item.title}</h4>
                                <p className="text-[#B0B3B8] text-[14px] leading-snug line-clamp-2 hidden sm:block">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-[#3E4042] my-4"></div>

                {/* Bottom Options */}
                <div className="flex flex-col gap-1">
                    {bottomItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#3A3B3C] cursor-pointer" onClick={() => {
                            if (['help', 'settings', 'terms', 'privacy'].includes(item.id)) {
                                onNavigate(item.id);
                                onClose();
                            }
                        }}>
                            <div className="flex items-center gap-3">
                                <i className={`${item.icon} text-[#B0B3B8] text-xl w-6 text-center`}></i>
                                <span className="text-[#E4E6EB] font-medium text-[17px]">{item.title}</span>
                            </div>
                            <i className="fas fa-chevron-right text-[#B0B3B8] text-sm"></i>
                        </div>
                    ))}
                    {currentUser && (
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#3A3B3C] cursor-pointer mt-2" onClick={onLogout}>
                            <div className="flex items-center gap-3">
                                <i className="fas fa-sign-out-alt text-[#E4E6EB] text-xl w-6 text-center"></i>
                                <span className="text-[#E4E6EB] font-medium text-[17px]">Log Out</span>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="mt-8 text-center text-[#B0B3B8] text-xs">
                    <p>UNERA Social © 2025</p>
                </div>
            </div>
        </div>
    );
};

// --- HEADER COMPONENT ---
interface HeaderProps {
    onHomeClick: () => void;
    onProfileClick: (id: number) => void;
    onReelsClick: () => void;
    onMarketplaceClick: () => void;
    onGroupsClick: () => void;
    // ADDED: onEventsClick prop
    onEventsClick: () => void;
    currentUser: User | null;
    notifications: Notification[];
    users: User[];
    groups?: Group[];
    brands?: Brand[];
    onLogout: () => void;
    onLoginClick: () => void;
    onMarkNotificationsRead: () => void;
    activeTab: string;
    onNavigate: (view: string) => void;
}

interface SearchResult {
    id: number | string;
    name: string;
    image: string;
    type: 'user' | 'group' | 'brand';
    subtext: string;
}

export const Header: React.FC<HeaderProps> = ({ 
    onHomeClick, 
    onProfileClick, 
    onReelsClick, 
    onMarketplaceClick, 
    onGroupsClick, 
    // ADDED: onEventsClick prop
    onEventsClick,
    currentUser, 
    notifications, 
    users, 
    groups = [], 
    brands = [], 
    onLogout, 
    onLoginClick, 
    onMarkNotificationsRead, 
    activeTab, 
    onNavigate 
}) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showFullMenu, setShowFullMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>(["UNERA Official", "Tech Enthusiasts", "Photography"]);
    
    const { t } = useLanguage();
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) setShowNotifications(false);
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) setShowProfileMenu(false);
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowSearchDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (!query.trim()) { 
            setSearchResults([]); 
            return; 
        }

        const lowerQuery = query.toLowerCase();
        
        // Search Users
        const userResults: SearchResult[] = users
            .filter(u => (!currentUser || u.id !== currentUser.id) && u.name.toLowerCase().includes(lowerQuery))
            .map(u => ({ id: u.id, name: u.name, image: u.profileImage, type: 'user', subtext: u.work || 'User' }));

        // Search Groups
        const groupResults: SearchResult[] = groups
            .filter(g => g.name.toLowerCase().includes(lowerQuery))
            .map(g => ({ id: g.id, name: g.name, image: g.image, type: 'group', subtext: `${g.members.length} members` }));

        // Search Brands
        const brandResults: SearchResult[] = brands
            .filter(b => b.name.toLowerCase().includes(lowerQuery))
            .map(b => ({ id: b.id, name: b.name, image: b.profileImage, type: 'brand', subtext: b.category }));

        // Combine and limit
        setSearchResults([...userResults, ...brandResults, ...groupResults].slice(0, 8));
        setShowSearchDropdown(true);
    };

    const handleSearchResultClick = (result: SearchResult) => {
        if (result.type === 'user') {
            onProfileClick(result.id as number);
        } else if (result.type === 'brand') {
            onProfileClick(result.id as number); 
        } else if (result.type === 'group') {
            onNavigate('groups'); 
        }
        
        if (!recentSearches.includes(result.name)) {
            setRecentSearches(prev => [result.name, ...prev].slice(0, 5));
        }
        
        setSearchQuery('');
        setShowSearchDropdown(false);
    };

    const handleRecentClick = (term: string) => {
        setSearchQuery(term);
        const lowerQuery = term.toLowerCase();
        const userResults = users.filter(u => u.name.toLowerCase().includes(lowerQuery)).map(u => ({ id: u.id, name: u.name, image: u.profileImage, type: 'user', subtext: 'User' } as SearchResult));
        const groupResults = groups.filter(g => g.name.toLowerCase().includes(lowerQuery)).map(g => ({ id: g.id, name: g.name, image: g.image, type: 'group', subtext: 'Group' } as SearchResult));
        setSearchResults([...userResults, ...groupResults].slice(0, 8));
    };

    return (
        <>
            <div className="sticky top-0 z-50 bg-[#242526] shadow-sm h-14 flex items-center justify-between px-4 w-full border-b border-[#3E4042]">
                <div className="flex items-center gap-2">
                    <div className="flex items-center cursor-pointer gap-2 mr-2" onClick={onHomeClick}>
                        <i className="fas fa-globe-americas text-[#1877F2] text-[28px] sm:text-[32px] animate-[spin_10s_linear_infinite]"></i>
                        <h1 className="text-[24px] sm:text-[28px] font-bold bg-gradient-to-r from-[#1877F2] to-[#1D8AF2] text-transparent bg-clip-text tracking-tight">UNERA</h1>
                    </div>
                </div>
                
                <div className="flex-1 max-w-[600px] h-full hidden md:flex items-center justify-center gap-1">
                    <div onClick={onHomeClick} className={`flex-1 h-full flex items-center justify-center cursor-pointer border-b-[3px] ${activeTab === 'home' ? 'border-[#1877F2] text-[#1877F2]' : 'border-transparent text-[#B0B3B8] hover:bg-[#3A3B3C] rounded-lg'}`} title={t('home')}><i className={`fas fa-home text-[24px]`}></i></div>
                    <div onClick={onReelsClick} className={`flex-1 h-full flex items-center justify-center cursor-pointer border-b-[3px] ${activeTab === 'reels' ? 'border-[#1877F2] text-[#1877F2]' : 'border-transparent text-[#B0B3B8] hover:bg-[#3A3B3C] rounded-lg'}`} title={t('reels')}><i className="fas fa-clapperboard text-[24px]"></i></div>
                    <div className={`flex-1 h-full flex items-center justify-center cursor-pointer border-b-[3px] border-transparent text-[#B0B3B8] hover:bg-[#3A3B3C] rounded-lg`} title={t('watch')}><i className="fas fa-tv text-[24px]"></i></div>
                    <div onClick={onMarketplaceClick} className={`flex-1 h-full flex items-center justify-center cursor-pointer border-b-[3px] ${activeTab === 'marketplace' ? 'border-[#1877F2] text-[#1877F2]' : 'border-transparent text-[#B0B3B8] hover:bg-[#3A3B3C] rounded-lg'}`} title={t('marketplace')}><i className="fas fa-store text-[24px]"></i></div>
                    <div onClick={onGroupsClick} className={`flex-1 h-full flex items-center justify-center cursor-pointer border-b-[3px] ${activeTab === 'groups' ? 'border-[#1877F2] text-[#1877F2]' : 'border-transparent text-[#B0B3B8] hover:bg-[#3A3B3C] rounded-lg'}`} title={t('groups')}><i className="fas fa-users text-[24px]"></i></div>
                    {/* ADDED: Events tab in header */}
                    <div onClick={onEventsClick} className={`flex-1 h-full flex items-center justify-center cursor-pointer border-b-[3px] ${activeTab === 'events' ? 'border-[#F3425F] text-[#F3425F]' : 'border-transparent text-[#B0B3B8] hover:bg-[#3A3B3C] rounded-lg'}`} title={t('events')}><i className="fas fa-calendar-alt text-[24px]"></i></div>
                </div>

                <div className="flex items-center gap-2 xl:gap-3 justify-end">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] cursor-pointer" onClick={() => setShowFullMenu(true)}>
                        <i className="fas fa-bars text-[#E4E6EB] text-[18px]"></i>
                    </div>
                    
                    <div className="relative mr-1 md:mr-2" ref={searchRef}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><i className="fas fa-search text-[#B0B3B8]"></i></div>
                        <input 
                            type="text" 
                            className="bg-[#3A3B3C] text-[#E4E6EB] rounded-full py-2 pl-10 pr-4 w-[40px] md:w-[240px] focus:w-[240px] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#1877F2] cursor-pointer md:cursor-text placeholder-transparent md:placeholder-[#B0B3B8] focus:placeholder-[#B0B3B8]" 
                            placeholder="Search in UNERA" 
                            value={searchQuery} 
                            onChange={handleSearchChange} 
                            onFocus={() => setShowSearchDropdown(true)}
                        />
                        {showSearchDropdown && (
                            <div className="absolute top-12 right-0 w-[280px] bg-[#242526] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-[#3E4042] z-50 p-2 max-h-[400px] overflow-y-auto">
                                {!searchQuery && recentSearches.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-2 py-1 flex justify-between items-center text-[#B0B3B8] text-sm font-semibold">
                                            <span>Recent Searches</span>
                                            <span className="cursor-pointer hover:text-[#1877F2]">Edit</span>
                                        </div>
                                        {recentSearches.map((term, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors" onClick={() => handleRecentClick(term)}>
                                                <div className="w-9 h-9 rounded-full bg-[#3A3B3C] flex items-center justify-center"><i className="fas fa-history text-[#B0B3B8]"></i></div>
                                                <span className="font-semibold text-[15px] text-[#E4E6EB] truncate">{term}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {searchResults.length > 0 ? searchResults.map(result => (
                                    <div key={`${result.type}-${result.id}`} className="flex items-center gap-3 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors" onClick={() => handleSearchResultClick(result)}>
                                        <div className="relative">
                                            <img src={result.image} alt={result.name} className={`w-10 h-10 object-cover border border-[#3E4042] ${result.type === 'group' ? 'rounded-xl' : 'rounded-full'}`} />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-semibold text-[15px] text-[#E4E6EB] truncate">{result.name}</span>
                                            <span className="text-[12px] text-[#B0B3B8] truncate capitalize">{result.subtext || result.type}</span>
                                        </div>
                                    </div>
                                )) : searchQuery && <div className="p-4 text-center text-[#B0B3B8] text-sm">No results found</div>}
                            </div>
                        )}
                    </div>
                    
                    {!currentUser ? (
                        <button onClick={onLoginClick} className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-black py-2 px-6 rounded-lg transition-all shadow-md active:scale-95 whitespace-nowrap">
                            Log In
                        </button>
                    ) : (
                        <>
                            <div className="hidden xl:flex items-center justify-center w-10 h-10 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] cursor-pointer">
                                <i className="fas fa-th text-[#E4E6EB]"></i>
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] cursor-pointer relative" onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) onMarkNotificationsRead(); }} ref={notifRef}>
                                <i className="fas fa-bell text-[#E4E6EB] text-lg"></i>
                                {unreadCount > 0 && <div className="absolute -top-1 -right-1 bg-[#E41E3F] text-white text-[11px] font-bold px-1.5 rounded-full">{unreadCount > 9 ? '9+' : unreadCount}</div>}
                                {showNotifications && <NotificationDropdown notifications={notifications} users={users} onNotificationClick={(n) => { setShowNotifications(false); if (n.postId) onNavigate(`post-${n.postId}`); else if (n.senderId) onProfileClick(n.senderId); }} onMarkAllRead={onMarkNotificationsRead} />}
                            </div>
                            <div className="relative cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)} ref={profileRef}>
                                <img src={currentUser.profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-[#3E4042]" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3A3B3C] rounded-full flex items-center justify-center border border-[#242526]">
                                    <i className="fas fa-chevron-down text-[8px] text-[#E4E6EB]"></i>
                                </div>
                                {showProfileMenu && (
                                    <div className="absolute top-12 right-0 w-[300px] bg-[#242526] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-[#3E4042] z-50 p-2">
                                        <div className="flex items-center gap-3 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.05)] mb-2" onClick={() => onProfileClick(currentUser.id)}>
                                            <img src={currentUser.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                                            <span className="font-semibold text-[17px] text-[#E4E6EB]">{currentUser.name}</span>
                                        </div>
                                        <div className="border-b border-[#3E4042] my-1"></div>
                                        <div className="flex items-center gap-3 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer" onClick={onLogout}>
                                            <div className="w-9 h-9 bg-[#3A3B3C] rounded-full flex items-center justify-center"><i className="fas fa-sign-out-alt text-[#E4E6EB]"></i></div>
                                            <span className="font-medium text-[15px] text-[#E4E6EB]">{t('logout')}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {showFullMenu && <MenuOverlay currentUser={currentUser} onClose={() => setShowFullMenu(false)} onNavigate={onNavigate} onLogout={onLogout} />}
        </>
    );
};

interface SidebarProps {
    onProfileClick: (id: number) => void;
    onReelsClick: () => void;
    onMarketplaceClick: () => void;
    onGroupsClick: () => void;
    // ADDED: onEventsClick prop
    onEventsClick: () => void;
    currentUser: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    onProfileClick, 
    onReelsClick, 
    onMarketplaceClick, 
    onGroupsClick, 
    // ADDED: onEventsClick prop
    onEventsClick, 
    currentUser 
}) => {
    const { t } = useLanguage();
    const SidebarRow = ({ Icon, src, title, color, onClick }: { Icon?: string, src?: string, title: string, color?: string, onClick?: () => void }) => (
        <div className="flex items-center gap-3 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors -ml-2" onClick={onClick}>
            {src && <img src={src} alt={title} className="w-9 h-9 rounded-full object-cover border border-[#3E4042]" />}
            {Icon && <div className="w-9 h-9 flex items-center justify-center"><i className={`${Icon} text-[24px]`} style={{ color: color }}></i></div>}
            <h4 className="font-medium text-[#E4E6EB] text-[15px]">{title}</h4>
        </div>
    );
    return (
        <div className="p-2 mt-4 max-w-[360px] xl:min-w-[300px] hidden lg:block sticky top-20 h-screen overflow-y-auto">
            <SidebarRow src={currentUser.profileImage} title={currentUser.name} onClick={() => onProfileClick(currentUser.id)} />
            <SidebarRow Icon="fas fa-user-friends" title={t('friends')} color="#1877F2" />
            <SidebarRow Icon="fas fa-history" title={t('memories')} color="#1877F2" />
            <SidebarRow Icon="fas fa-bookmark" title={t('saved')} color="#A033FF" />
            <SidebarRow Icon="fas fa-users" title={t('groups')} color="#1877F2" onClick={onGroupsClick} />
            <SidebarRow Icon="fas fa-clapperboard" title={t('reels')} color="#F3425F" onClick={onReelsClick} />
            <SidebarRow Icon="fas fa-store" title={t('marketplace')} color="#1877F2" onClick={onMarketplaceClick} />
            <SidebarRow Icon="fas fa-rss" title={t('feeds')} color="#1877F2" />
            {/* FIXED: Added onClick handler for Events */}
            <SidebarRow Icon="fas fa-calendar-alt" title={t('events')} color="#F3425F" onClick={onEventsClick} />
            <div className="border-b border-[#3E4042] my-2"></div>
            <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-[#3A3B3C] rounded-lg -ml-2"><div className="w-8 h-8 bg-[#3A3B3C] rounded-full flex items-center justify-center"><i className="fas fa-chevron-down text-[#E4E6EB]"></i></div><span className="font-medium text-[15px] text-[#E4E6EB]">{t('see_more')}</span></div>
        </div>
    );
};

export const RightSidebar: React.FC<{ contacts: User[], onProfileClick: (id: number) => void }> = ({ contacts, onProfileClick }) => {
    return (
        <div className="hidden md:block p-2 mt-4 max-w-[360px] min-w-[280px] sticky top-20 h-screen overflow-y-auto">
            <div className="mb-4"><h3 className="text-[#B0B3B8] font-semibold text-[17px] mb-2">Sponsored</h3><div className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-[#3A3B3C] p-2 rounded-lg -ml-2"><img src="https://picsum.photos/120/120?random=10" className="w-[120px] h-[120px] rounded-lg object-cover" alt="Ad" /><div className="flex flex-col"><span className="font-semibold text-[#E4E6EB] text-[16px]">Luxury Resort</span><span className="text-[#B0B3B8] text-[13px]">resorts.com</span></div></div></div>
            <div className="border-b border-[#3E4042] my-2"></div>
            <div className="flex items-center justify-between mb-2 text-[#B0B3B8]"><h3 className="font-semibold text-[17px]">Contacts</h3><div className="flex gap-4 mr-2"><i className="fas fa-video cursor-pointer hover:text-[#E4E6EB]"></i><i className="fas fa-search cursor-pointer hover:text-[#E4E6EB]"></i><i className="fas fa-ellipsis-h cursor-pointer hover:text-[#E4E6EB]"></i></div></div>
            <div className="flex flex-col">{contacts.map((contact) => (<div key={contact.id} className="flex items-center gap-3 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors -mr-2 relative" onClick={() => onProfileClick(contact.id)}><div className="relative"><img src={contact.profileImage} alt={contact.name} className="w-9 h-9 rounded-full object-cover" />{contact.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#31A24C] rounded-full border-2 border-[#18191A]"></div>}</div><h4 className="font-medium text-[#E4E6EB] text-[15px]">{contact.name}</h4></div>))}</div>
        </div>
    );
};
