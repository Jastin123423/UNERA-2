
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { User, Group, Event } from '../types';
import { Post } from './Feed';
import { LOCATIONS_DATA } from '../constants';
import { CreateEventModal } from './Events';

// --- CONSTANTS FOR GROUPS ---
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

// --- GROUP SETTINGS MODAL ---
interface GroupSettingsModalProps {
    group: Group;
    onClose: () => void;
    onUpdate: (settings: Partial<Group>) => void;
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({ group, onClose, onUpdate }) => {
    const [name, setName] = useState(group.name);
    const [desc, setDesc] = useState(group.description);
    const [postingAllowed, setPostingAllowed] = useState(group.memberPostingAllowed ?? true);

    const handleSave = () => {
        onUpdate({
            name,
            description: desc,
            memberPostingAllowed: postingAllowed
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="bg-[#242526] w-full max-w-[500px] rounded-xl border border-[#3E4042] shadow-2xl flex flex-col">
                <div className="p-4 border-b border-[#3E4042] flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[#E4E6EB]">Group Settings</h3>
                    <div onClick={onClose} className="w-8 h-8 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] flex items-center justify-center cursor-pointer">
                        <i className="fas fa-times text-[#B0B3B8]"></i>
                    </div>
                </div>
                <div className="p-4 space-y-4">
                    <div>
                        <label className="block text-[#B0B3B8] text-sm font-bold mb-1">Group Name</label>
                        <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[#B0B3B8] text-sm font-bold mb-1">Description</label>
                        <textarea className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none h-24 resize-none" value={desc} onChange={e => setDesc(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#3A3B3C] rounded-lg border border-[#3E4042]">
                        <div>
                            <div className="text-[#E4E6EB] font-bold">Member Posting</div>
                            <div className="text-[#B0B3B8] text-xs">Allow members to post in the group</div>
                        </div>
                        <div 
                            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${postingAllowed ? 'bg-[#1877F2]' : 'bg-gray-600'}`}
                            onClick={() => setPostingAllowed(!postingAllowed)}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${postingAllowed ? 'left-7' : 'left-1'}`}></div>
                        </div>
                    </div>
                    <button onClick={handleSave} className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-2.5 rounded-lg font-bold transition-colors">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

interface GroupsPageProps {
    currentUser: User | null;
    groups: Group[];
    users: User[];
    onCreateGroup: (group: Partial<Group>) => void;
    onJoinGroup: (groupId: string) => void;
    onLeaveGroup: (groupId: string) => void;
    onDeleteGroup: (groupId: string) => void;
    onUpdateGroupImage: (groupId: string, type: 'cover' | 'profile', file: File) => void;
    onPostToGroup: (groupId: string, content: string, file: File | null, type: 'image' | 'video' | 'doc' | 'text', background?: string) => void;
    onCreateGroupEvent: (groupId: string, event: Partial<Event>) => void;
    onInviteToGroup: (groupId: string, userIds: number[]) => void;
    onProfileClick: (id: number) => void;
    onLikePost: (groupId: string, postId: number) => void;
    onOpenComments: (groupId: string, postId: number) => void;
    onSharePost: (groupId: string, postId: number) => void;
    onDeleteGroupPost: (postId: number) => void;
    onRemoveMember: (groupId: string, memberId: number) => void;
    onUpdateGroupSettings: (groupId: string, settings: Partial<Group>) => void;
}

export const GroupsPage: React.FC<GroupsPageProps> = ({ 
    currentUser, groups, users, 
    onCreateGroup, onJoinGroup, onLeaveGroup, onDeleteGroup, onUpdateGroupImage,
    onPostToGroup, onCreateGroupEvent, onInviteToGroup, 
    onProfileClick, onLikePost, onOpenComments, onSharePost, onDeleteGroupPost, onRemoveMember, onUpdateGroupSettings
}) => {
    const [view, setView] = useState<'feed' | 'detail'>('feed');
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
    const [groupTab, setGroupTab] = useState<'Discussion' | 'Events' | 'Members' | 'About'>('Discussion');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modals state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showGroupPostModal, setShowGroupPostModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);

    // Refs
    const groupCoverInputRef = useRef<HTMLInputElement>(null);
    const groupProfileInputRef = useRef<HTMLInputElement>(null);
    
    // Post Creation Refs
    const postFileInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);

    // Form states
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [newGroupType, setNewGroupType] = useState<'public' | 'private'>('public');
    
    // Detailed Post State
    const [postContent, setPostContent] = useState('');
    const [postFile, setPostFile] = useState<File | null>(null);
    const [postView, setPostView] = useState<'main' | 'location' | 'feeling'>('main');
    const [activeBackground, setActiveBackground] = useState('');
    const [postLocation, setPostLocation] = useState('');
    const [postFeeling, setPostFeeling] = useState('');

    const activeGroup = useMemo(() => groups.find(g => g.id === activeGroupId) || null, [groups, activeGroupId]);

    // Reset post state when modal opens/closes
    useEffect(() => {
        if (!showGroupPostModal) {
            setPostContent('');
            setPostFile(null);
            setPostView('main');
            setActiveBackground('');
            setPostLocation('');
            setPostFeeling('');
        }
    }, [showGroupPostModal]);

    const handleGroupClick = (group: Group) => {
        setActiveGroupId(group.id);
        setView('detail');
        setGroupTab('Discussion');
        window.scrollTo(0, 0);
    };

    const handleCreateSubmit = () => {
        if (!newGroupName.trim()) return;
        onCreateGroup({
            name: newGroupName,
            description: newGroupDesc,
            type: newGroupType,
            image: `https://ui-avatars.com/api/?name=${newGroupName}&background=random`,
            coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
        });
        setShowCreateModal(false);
        setNewGroupName('');
        setNewGroupDesc('');
    };

    const handlePostSubmit = () => {
        if (!activeGroup) return;
        if (!postContent.trim() && !postFile && !activeBackground) return;
        
        let type: 'text' | 'image' | 'video' | 'doc' = 'text';
        if (postFile) {
            if (postFile.type.startsWith('image')) type = 'image';
            else if (postFile.type.startsWith('video')) type = 'video';
            else type = 'doc';
        } else if (activeBackground) {
            type = 'text';
        }

        // Incorporate feeling/location into content if text
        let finalContent = postContent;
        if (postFeeling) finalContent = `is feeling ${postFeeling}. ${finalContent}`;
        if (postLocation) finalContent = `in ${postLocation}. ${finalContent}`;

        onPostToGroup(activeGroup.id, finalContent, postFile, type, activeBackground);
        setShowGroupPostModal(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'profile') => {
        if (e.target.files && e.target.files[0] && activeGroup) {
            onUpdateGroupImage(activeGroup.id, type, e.target.files[0]);
        }
    };

    const handleDeleteActiveGroup = () => {
        if (activeGroup && window.confirm("Are you sure you want to delete this group? This cannot be undone.")) {
            onDeleteGroup(activeGroup.id);
            setActiveGroupId(null);
            setView('feed');
        }
    };

    // Feed View
    if (view === 'feed' || !activeGroup) {
        const myGroups = currentUser ? groups.filter(g => g.members.includes(currentUser.id) || g.adminId === currentUser.id) : [];
        let suggestedGroups = currentUser ? groups.filter(g => !g.members.includes(currentUser.id) && g.adminId !== currentUser.id) : groups;

        // Apply Search
        if (searchQuery.trim()) {
            suggestedGroups = suggestedGroups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        return (
            <div className="w-full max-w-[1000px] mx-auto p-4 font-sans pb-20">
                <div className="flex flex-col gap-4 mb-6 bg-[#242526] p-4 rounded-xl border border-[#3E4042]">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-[#E4E6EB]">Groups</h2>
                            <p className="text-[#B0B3B8] text-sm">Discover and join communities.</p>
                        </div>
                        {currentUser && (
                        <button onClick={() => setShowCreateModal(true)} className="bg-[#263951] text-[#2D88FF] hover:bg-[#2A3F5A] px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors">
                            <i className="fas fa-plus-circle"></i> <span>Create New Group</span>
                        </button>
                        )}
                    </div>
                    {/* Search Bar */}
                    <div className="relative">
                        <input 
                            type="text" 
                            className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 pl-10 text-[#E4E6EB] outline-none focus:border-[#1877F2]" 
                            placeholder="Search Groups..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B3B8]"></i>
                    </div>
                </div>

                {myGroups.length > 0 && !searchQuery && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-[#E4E6EB] mb-3">Your Groups</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myGroups.map(group => (
                                <div key={group.id} className="bg-[#242526] rounded-xl overflow-hidden border border-[#3E4042] cursor-pointer hover:shadow-lg transition-all" onClick={() => handleGroupClick(group)}>
                                    <div className="h-24 relative">
                                        <img src={group.coverImage} className="w-full h-full object-cover opacity-80" alt="" />
                                    </div>
                                    <div className="px-4 pb-4 -mt-8 relative">
                                        <div className="flex justify-between items-end">
                                            <img src={group.image} className="w-16 h-16 rounded-xl border-4 border-[#242526] object-cover bg-[#242526]" alt="" />
                                        </div>
                                        <h4 className="font-bold text-lg text-[#E4E6EB] mt-2 leading-tight">{group.name}</h4>
                                        <p className="text-[#B0B3B8] text-xs mt-1">{group.members.length} members • {group.posts.length} posts</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-xl font-bold text-[#E4E6EB] mb-3">{searchQuery ? 'Search Results' : (currentUser ? "Suggested for you" : "All Groups")}</h3>
                    {suggestedGroups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {suggestedGroups.map(group => (
                                <div key={group.id} className="bg-[#242526] rounded-xl overflow-hidden border border-[#3E4042] flex flex-col">
                                    <div className="h-32 relative cursor-pointer" onClick={() => handleGroupClick(group)}>
                                        <img src={group.coverImage} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-bold uppercase">{group.type}</div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h4 className="font-bold text-lg text-[#E4E6EB] mb-1 cursor-pointer hover:underline" onClick={() => handleGroupClick(group)}>{group.name}</h4>
                                        <p className="text-[#B0B3B8] text-sm mb-4 line-clamp-2">{group.description}</p>
                                        <div className="mt-auto">
                                            <div className="flex items-center gap-2 mb-3 text-xs text-[#B0B3B8]">
                                                <div className="flex -space-x-2">
                                                    {[1,2].map(i => <div key={i} className="w-5 h-5 rounded-full bg-gray-600 border border-[#242526]"></div>)}
                                                </div>
                                                <span>{group.members.length} members</span>
                                            </div>
                                            <button onClick={() => currentUser ? onJoinGroup(group.id) : alert("Please login to join groups.")} className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-2 rounded-lg font-semibold transition-colors">Join Group</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#B0B3B8]">No groups found.</p>
                    )}
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4">
                        <div className="bg-[#242526] w-full max-w-[500px] rounded-xl border border-[#3E4042] shadow-2xl overflow-hidden">
                            <div className="p-4 border-b border-[#3E4042] flex justify-between items-center">
                                <h3 className="text-xl font-bold text-[#E4E6EB]">Create Group</h3>
                                <div onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-full bg-[#3A3B3C] flex items-center justify-center cursor-pointer hover:bg-[#4E4F50]"><i className="fas fa-times text-[#B0B3B8]"></i></div>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-[#B0B3B8] text-sm font-bold mb-1">Name</label>
                                    <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2 text-[#E4E6EB] outline-none focus:border-[#1877F2]" placeholder="Name your group" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-[#B0B3B8] text-sm font-bold mb-1">Description</label>
                                    <textarea className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2 text-[#E4E6EB] outline-none focus:border-[#1877F2] resize-none h-24" placeholder="What is this group about?" value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-[#B0B3B8] text-sm font-bold mb-1">Privacy</label>
                                    <select className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={newGroupType} onChange={(e) => setNewGroupType(e.target.value as any)}>
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                                <button onClick={handleCreateSubmit} disabled={!newGroupName.trim()} className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50">Create</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Detail View
    const isMember = currentUser ? (activeGroup.members.includes(currentUser.id) || activeGroup.adminId === currentUser.id) : false;
    const isAdmin = currentUser && activeGroup.adminId === currentUser.id;
    const canPost = isAdmin || (activeGroup.memberPostingAllowed ?? true); // Default to true if undefined

    // Helper component for options in create post
    const PostOption = ({ icon, color, label, onClick }: { icon: string, color: string, label: string, onClick?: () => void }) => (
        <div className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors" onClick={onClick}>
            <div className="w-8 flex justify-center"><i className={`${icon} text-xl`} style={{ color }}></i></div>
            <span className="text-[#E4E6EB] text-[16px] font-medium">{label}</span>
        </div>
    );

    return (
        <div className="w-full bg-[#18191A] min-h-screen pb-10">
            {/* Header Section */}
            <div className="bg-[#242526] border-b border-[#3E4042] shadow-sm mb-4">
                <div className="max-w-[1100px] mx-auto"> 
                    {/* Cover Image */}
                    <div className="h-[200px] md:h-[350px] relative group bg-[#3A3B3C]">
                        <img src={activeGroup.coverImage} className="w-full h-full object-cover md:rounded-b-xl" alt="Cover" />
                        {isAdmin && (
                            <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/20 font-bold text-white text-sm flex items-center gap-2" onClick={() => groupCoverInputRef.current?.click()}>
                                <i className="fas fa-camera"></i> Edit Cover
                            </div>
                        )}
                        <input type="file" ref={groupCoverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} />
                    </div>

                    <div className="px-4 pb-0">
                        {/* Profile & Info */}
                        <div className="flex flex-col md:flex-row items-start md:items-end -mt-[40px] md:-mt-[30px] relative z-10 gap-4 mb-4">
                             <div className="relative">
                                <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-xl border-4 border-[#242526] overflow-hidden bg-[#242526]">
                                    <img src={activeGroup.image} className="w-full h-full object-cover" alt="" />
                                </div>
                                {isAdmin && <div className="absolute bottom-2 right-2 bg-[#3A3B3C] p-1.5 rounded-full cursor-pointer hover:bg-[#4E4F50]" onClick={() => groupProfileInputRef.current?.click()}><i className="fas fa-camera text-white"></i></div>}
                                <input type="file" ref={groupProfileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'profile')} />
                             </div>

                             <div className="flex-1 mt-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-[#E4E6EB] leading-tight mb-1">{activeGroup.name}</h1>
                                <div className="flex items-center gap-2 text-[#B0B3B8] text-sm font-semibold">
                                    <i className={`fas ${activeGroup.type === 'public' ? 'fa-globe-americas' : 'fa-lock'} text-xs`}></i>
                                    <span className="capitalize">{activeGroup.type} group</span>
                                    <span>•</span>
                                    <span>{activeGroup.members.length} members</span>
                                </div>
                             </div>

                             <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto">
                                {isMember ? (
                                    <>
                                        <button onClick={() => setShowInviteModal(true)} className="bg-[#1877F2] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#166FE5] flex-1 md:flex-none"><i className="fas fa-plus"></i> Invite</button>
                                        <button className="bg-[#3A3B3C] text-[#E4E6EB] px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#4E4F50] flex-1 md:flex-none"><i className="fas fa-check"></i> Joined</button>
                                        {isAdmin && <button onClick={() => setShowSettingsModal(true)} className="bg-[#3A3B3C] text-[#E4E6EB] px-3 py-2 rounded-lg font-bold hover:bg-[#4E4F50]"><i className="fas fa-cog"></i></button>}
                                    </>
                                ) : (
                                    <button onClick={() => currentUser ? onJoinGroup(activeGroup.id) : alert("Login first")} className="bg-[#1877F2] text-white px-6 py-2 rounded-lg font-bold text-base hover:bg-[#166FE5] w-full md:w-auto">Join Group</button>
                                )}
                             </div>
                        </div>

                        <div className="border-t border-[#3E4042] mt-4"></div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center gap-1 pt-1 overflow-x-auto">
                            {['Discussion', 'Events', 'Members', 'About'].map(tab => (
                                <div key={tab} onClick={() => setGroupTab(tab as any)} className={`px-4 py-3 cursor-pointer font-semibold text-base border-b-[3px] transition-colors whitespace-nowrap ${groupTab === tab ? 'text-[#1877F2] border-[#1877F2]' : 'text-[#B0B3B8] border-transparent hover:bg-[#3A3B3C] rounded-t-lg'}`}>{tab}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[700px] mx-auto px-0 md:px-4">
                {groupTab === 'Discussion' && (
                    <>
                        {isMember && (
                            canPost ? (
                                <div className="bg-[#242526] rounded-xl p-3 mb-4 border border-[#3E4042] shadow-sm flex gap-3 items-center cursor-pointer mx-2 md:mx-0" onClick={() => setShowGroupPostModal(true)}>
                                    <img src={currentUser?.profileImage} className="w-10 h-10 rounded-full bg-[#3A3B3C] object-cover" alt="" />
                                    <div className="flex-1 bg-[#3A3B3C] hover:bg-[#4E4F50] transition-colors rounded-full px-4 py-2">
                                        <span className="text-[#B0B3B8] text-[17px]">Contribute to Group Today</span>
                                    </div>
                                    <div className="text-[#B0B3B8] hover:bg-[#3A3B3C] p-2 rounded-full"><i className="fas fa-images text-[#45BD62] text-xl"></i></div>
                                </div>
                            ) : (
                                <div className="bg-[#242526] rounded-xl p-3 mb-4 border border-[#3E4042] shadow-sm mx-2 md:mx-0 text-center text-[#B0B3B8] text-sm">
                                    <i className="fas fa-lock mr-2"></i> Only admins can post in this group.
                                </div>
                            )
                        )}
                        <div className="space-y-4 px-0 md:px-0">
                            {activeGroup.posts && activeGroup.posts.length > 0 ? (
                                activeGroup.posts.map(post => (
                                    <Post 
                                        key={post.id} 
                                        post={{
                                            ...post, 
                                            type: post.video ? 'video' : (post.image ? 'image' : 'text'), 
                                            visibility: 'Public', 
                                            reactions: post.reactions || [], 
                                            timestamp: 'Recently',
                                            groupName: activeGroup.name,
                                            isGroupAdmin: activeGroup.adminId === post.authorId,
                                            background: post.background
                                        } as any}
                                        author={users.find(u => u.id === post.authorId) || { id: 0, name: 'Unknown', profileImage: '' } as User}
                                        currentUser={currentUser}
                                        users={users}
                                        onProfileClick={onProfileClick}
                                        onReact={(pid, type) => onLikePost(activeGroup.id, pid)}
                                        onShare={(pid) => onSharePost(activeGroup.id, pid)}
                                        onDelete={(pid) => onDeleteGroupPost(pid)}
                                        canDelete={isAdmin || currentUser?.id === post.authorId} // Allow admin to delete any post
                                        onViewImage={() => {}}
                                        onOpenComments={(pid) => onOpenComments(activeGroup.id, pid)}
                                        onVideoClick={() => {}}
                                    />
                                ))
                            ) : (
                                <div className="bg-[#242526] rounded-xl p-8 text-center border border-[#3E4042] mx-4 md:mx-0">
                                    <div className="w-16 h-16 bg-[#3A3B3C] rounded-full flex items-center justify-center mx-auto mb-3"><i className="fas fa-comments text-[#B0B3B8] text-2xl"></i></div>
                                    <h3 className="text-[#E4E6EB] font-bold text-lg">No posts yet</h3>
                                    <p className="text-[#B0B3B8] text-sm">Be the first to share something in this group.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
                
                {groupTab === 'About' && (
                    <div className="bg-[#242526] rounded-xl p-6 border border-[#3E4042] mx-4 md:mx-0">
                        <h3 className="text-xl font-bold text-[#E4E6EB] mb-3">About this group</h3>
                        <p className="text-[#E4E6EB] text-base mb-6 leading-relaxed">{activeGroup.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-[#E4E6EB] text-sm"><i className={`fas ${activeGroup.type === 'public' ? 'fa-globe-americas' : 'fa-lock'} w-6 text-center text-[#B0B3B8] text-lg`}></i><div><div className="font-bold">{activeGroup.type === 'public' ? 'Public' : 'Private'}</div><div className="text-xs text-[#B0B3B8]">Group visibility</div></div></div>
                            <div className="flex items-center gap-3 text-[#E4E6EB] text-sm"><i className="fas fa-history w-6 text-center text-[#B0B3B8] text-lg"></i><div><div className="font-bold">History</div><div className="text-xs text-[#B0B3B8]">Created {new Date(activeGroup.createdDate).toLocaleDateString()}</div></div></div>
                        </div>
                        {isAdmin && (
                            <div className="border-t border-[#3E4042] pt-4 mt-6">
                                <button onClick={handleDeleteActiveGroup} className="text-red-500 font-bold text-sm py-2 px-4 hover:bg-[#3A3B3C] rounded-lg transition-colors">Delete Group</button>
                            </div>
                        )}
                    </div>
                )}

                {groupTab === 'Events' && (
                    <div className="bg-[#242526] rounded-xl p-8 text-center border border-[#3E4042] mx-4 md:mx-0">
                        <i className="fas fa-calendar-alt text-[#B0B3B8] text-4xl mb-3"></i>
                        <h3 className="text-[#E4E6EB] font-bold text-lg">Events</h3>
                        <p className="text-[#B0B3B8] text-sm">No upcoming events.</p>
                        {/* Allowed members to create event */}
                        {isMember && (
                            <button onClick={() => setShowEventModal(true)} className="mt-4 bg-[#1877F2] text-white px-4 py-2 rounded-lg font-bold text-sm">Create Event</button>
                        )}
                    </div>
                )}

                {groupTab === 'Members' && (
                    <div className="bg-[#242526] rounded-xl border border-[#3E4042] mx-4 md:mx-0 overflow-hidden">
                        <div className="p-4 border-b border-[#3E4042]">
                            <h3 className="font-bold text-[#E4E6EB] text-lg">Members · {activeGroup.members.length}</h3>
                        </div>
                        <div className="p-2">
                            {activeGroup.members.map(memberId => {
                                const member = users.find(u => u.id === memberId);
                                if(!member) return null;
                                return (
                                    <div key={memberId} className="flex items-center justify-between p-3 hover:bg-[#3A3B3C] rounded-lg">
                                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onProfileClick(memberId)}>
                                            <img src={member.profileImage} className="w-10 h-10 rounded-full object-cover" alt="" />
                                            <div>
                                                <div className="font-bold text-[#E4E6EB] text-base">{member.name}</div>
                                                {memberId === activeGroup.adminId && <div className="text-[10px] text-[#1877F2] font-bold bg-[#1877F2]/10 px-2 py-0.5 rounded w-fit">Admin</div>}
                                            </div>
                                        </div>
                                        {/* Admin can remove any member except themselves */}
                                        {isAdmin && memberId !== currentUser?.id && (
                                            <button onClick={() => onRemoveMember(activeGroup.id, memberId)} className="text-[#B0B3B8] hover:text-white px-3 py-1 bg-[#3A3B3C] rounded font-semibold text-sm">Remove</button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Create Post Modal */}
            {showGroupPostModal && (
                <div className="fixed inset-0 z-[150] bg-[#18191A] flex flex-col animate-slide-up font-sans">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#3E4042] bg-[#242526]">
                        <div className="flex items-center gap-3">
                            <i className="fas fa-arrow-left text-[#E4E6EB] text-xl cursor-pointer" onClick={() => setShowGroupPostModal(false)}></i>
                            <h3 className="text-[#E4E6EB] text-[18px] font-medium">Create Post</h3>
                        </div>
                        {postView !== 'main' && <button className="text-[#1877F2] font-bold text-[17px]" onClick={() => setPostView('main')}>Done</button>}
                    </div>

                    {/* Main Create Post View */}
                    {postView === 'main' ? (
                        <div className="flex-1 flex flex-col overflow-y-auto">
                            {/* User Profile Info */}
                            <div className="p-4 flex items-center gap-3">
                                <img src={currentUser?.profileImage} className="w-12 h-12 rounded-full object-cover" alt="" />
                                <div>
                                    <div className="font-bold text-[#E4E6EB] text-[17px]">{currentUser?.name}</div>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <div className="bg-[#3A3B3C] px-2 py-0.5 rounded text-[13px] text-[#E4E6EB] flex items-center gap-1">
                                            <span>Public Group</span>
                                            <i className="fas fa-caret-down text-[11px]"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Text Input Area */}
                            <div className={`flex-1 relative transition-all ${activeBackground ? 'flex items-center justify-center p-8 text-center min-h-[250px]' : 'p-4 min-h-[150px]'}`} 
                                style={{ background: activeBackground.includes('url') ? activeBackground : activeBackground, backgroundSize: 'cover' }}
                            >
                                
                                <textarea 
                                    className={`w-full bg-transparent outline-none text-[#E4E6EB] placeholder-[#B0B3B8] resize-none ${activeBackground ? 'text-center font-bold text-3xl drop-shadow-md placeholder-white/70' : 'text-[24px]'}`}
                                    placeholder="Contribute to Group Today..."
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    rows={activeBackground ? 4 : 5}
                                />
                            </div>

                            {/* Feeling / Location Indicators */}
                            {(postFeeling || postLocation) && (
                                <div className="px-4 py-2 flex gap-2 flex-wrap">
                                    {postFeeling && <div className="bg-[#3A3B3C] text-[#E4E6EB] px-3 py-1 rounded-full text-sm flex items-center gap-2"><i className="far fa-smile text-[#F7B928]"></i> is feeling {postFeeling} <i className="fas fa-times ml-1 cursor-pointer" onClick={() => setPostFeeling('')}></i></div>}
                                    {postLocation && <div className="bg-[#3A3B3C] text-[#E4E6EB] px-3 py-1 rounded-full text-sm flex items-center gap-2"><i className="fas fa-map-marker-alt text-[#F02849]"></i> at {postLocation} <i className="fas fa-times ml-1 cursor-pointer" onClick={() => setPostLocation('')}></i></div>}
                                </div>
                            )}

                            {/* File Preview */}
                            {postFile && (
                                <div className="mx-4 mb-4 relative rounded-lg overflow-hidden border border-[#3E4042] max-h-[300px]">
                                    {postFile.type.startsWith('image') ? (
                                        <img src={URL.createObjectURL(postFile)} className="w-full h-full object-contain bg-black" />
                                    ) : postFile.type.startsWith('video') ? (
                                        <video src={URL.createObjectURL(postFile)} className="w-full h-full object-contain bg-black" controls />
                                    ) : (
                                        <div className="p-6 bg-[#3A3B3C] flex items-center gap-4">
                                            <i className="fas fa-file-alt text-4xl text-[#E4E6EB]"></i>
                                            <div>
                                                <div className="text-[#E4E6EB] font-bold truncate max-w-[200px]">{postFile.name}</div>
                                                <div className="text-[#B0B3B8] text-sm">Document</div>
                                            </div>
                                        </div>
                                    )}
                                    <div onClick={() => setPostFile(null)} className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full cursor-pointer z-10"><i className="fas fa-times text-white"></i></div>
                                </div>
                            )}

                            {/* Background Picker */}
                            {!postFile && (
                                <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide mb-2">
                                     <div 
                                        className={`w-9 h-9 rounded-lg cursor-pointer border-2 bg-[#3A3B3C] flex items-center justify-center flex-shrink-0 ${!activeBackground ? 'border-white' : 'border-[#3E4042]'}`}
                                        onClick={() => setActiveBackground('')}
                                     >
                                         <div className="w-6 h-6 bg-white rounded flex items-center justify-center"><i className="fas fa-font text-black text-xs"></i></div>
                                     </div>
                                     {BACKGROUNDS.filter(b => b.id !== 'none').map(bg => (
                                         <div 
                                            key={bg.id} 
                                            className={`w-9 h-9 rounded-lg cursor-pointer border-2 flex-shrink-0 ${activeBackground === bg.value ? 'border-white' : 'border-transparent'}`}
                                            style={{ background: bg.value, backgroundSize: 'cover' }}
                                            onClick={() => setActiveBackground(bg.value)}
                                         ></div>
                                     ))}
                                </div>
                            )}

                            {/* Options List */}
                            <div className="border-t border-[#3E4042]">
                                <PostOption icon="fas fa-images" color="#45BD62" label="Photos/videos" onClick={() => postFileInputRef.current?.click()} />
                                <PostOption icon="fas fa-file-alt" color="#1877F2" label="Add document" onClick={() => docInputRef.current?.click()} />
                                <PostOption icon="fas fa-map-marker-alt" color="#F02849" label="Add location" onClick={() => setPostView('location')} />
                                <PostOption icon="far fa-smile" color="#F7B928" label="Feeling/activity" onClick={() => setPostView('feeling')} />
                                <PostOption icon="fas fa-calendar-plus" color="#F02849" label="Create event" onClick={() => { setShowGroupPostModal(false); setShowEventModal(true); }} />
                            </div>

                            {/* Large Post Button */}
                            <div className="p-4 mt-auto">
                                <button 
                                    onClick={handlePostSubmit} 
                                    disabled={!postContent.trim() && !postFile && !activeBackground} 
                                    className="w-full bg-[#1877F2] text-white font-bold text-[18px] py-3 rounded-lg hover:bg-[#166FE5] disabled:bg-[#3A3B3C] disabled:text-[#B0B3B8] disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    POST
                                </button>
                            </div>
                        </div>
                    ) : postView === 'location' ? (
                        /* Location View */
                        <div className="flex-1 flex flex-col p-4">
                            <input type="text" placeholder="Search for location" className="w-full bg-[#3A3B3C] text-[#E4E6EB] p-3 rounded-lg outline-none mb-4" />
                            <div className="flex flex-col gap-2">
                                {LOCATIONS_DATA.map(loc => (
                                    <div key={loc.name} className="flex items-center gap-3 p-3 hover:bg-[#3A3B3C] rounded-lg cursor-pointer" onClick={() => { setPostLocation(loc.name); setPostView('main'); }}>
                                        <div className="w-10 h-10 bg-[#3A3B3C] rounded-full flex items-center justify-center"><i className="fas fa-map-marker-alt text-[#E4E6EB]"></i></div>
                                        <span className="text-[#E4E6EB] text-[16px]">{loc.name} {loc.flag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Feeling View */
                        <div className="flex-1 flex flex-col p-4">
                            <div className="grid grid-cols-2 gap-3">
                                {FEELINGS.map(f => (
                                    <div key={f} className="p-4 bg-[#242526] border border-[#3E4042] rounded-lg text-center cursor-pointer hover:bg-[#3A3B3C] text-[#E4E6EB] text-[16px]" onClick={() => { setPostFeeling(f); setPostView('main'); }}>
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hidden Inputs */}
                    <input type="file" ref={postFileInputRef} className="hidden" accept="image/*,video/*" onChange={(e) => { if(e.target.files && e.target.files[0]) { setPostFile(e.target.files[0]); setActiveBackground(''); } }} />
                    <input type="file" ref={docInputRef} className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={(e) => { if(e.target.files && e.target.files[0]) { setPostFile(e.target.files[0]); setActiveBackground(''); } }} />
                </div>
            )}

            {/* Group Settings Modal */}
            {showSettingsModal && activeGroup && (
                <GroupSettingsModal 
                    group={activeGroup} 
                    onClose={() => setShowSettingsModal(false)}
                    onUpdate={(settings) => onUpdateGroupSettings(activeGroup.id, settings)}
                />
            )}

            {/* Create Event Modal */}
            {showEventModal && currentUser && (
                <CreateEventModal 
                    currentUser={currentUser}
                    onClose={() => setShowEventModal(false)}
                    onCreate={(event) => {
                        if (activeGroup) {
                            onCreateGroupEvent(activeGroup.id, event);
                        }
                    }}
                />
            )}
        </div>
    );
};
