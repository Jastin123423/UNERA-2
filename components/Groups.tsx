import React, { useState } from 'react';
import { User, Group, GroupPost } from '../types';

interface GroupsPageProps {
    currentUser: User;
    groups: Group[];
    users: User[];
    onCreateGroup: (group: Partial<Group>) => void;
    onJoinGroup: (groupId: string) => void;
    onLeaveGroup: (groupId: string) => void;
    onPostToGroup: (groupId: string, content: string, image?: string) => void;
    onProfileClick: (id: number) => void;
}

export const GroupsPage: React.FC<GroupsPageProps> = ({ currentUser, groups, users, onCreateGroup, onJoinGroup, onLeaveGroup, onPostToGroup, onProfileClick }) => {
    const [view, setView] = useState<'feed' | 'detail'>('feed');
    const [activeGroup, setActiveGroup] = useState<Group | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // Create Group Form
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [newGroupType, setNewGroupType] = useState<'public' | 'private'>('public');

    // Group Detail Logic
    const handleGroupClick = (group: Group) => {
        setActiveGroup(group);
        setView('detail');
        window.scrollTo(0, 0);
    };

    const handleCreateSubmit = () => {
        if (!newGroupName.trim()) return;
        onCreateGroup({
            name: newGroupName,
            description: newGroupDesc,
            type: newGroupType,
            image: `https://ui-avatars.com/api/?name=${newGroupName}&background=random`,
            coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80', // Default cover
        });
        setShowCreateModal(false);
        setNewGroupName('');
        setNewGroupDesc('');
    };

    // --- Render: Groups Feed / Discovery ---
    if (view === 'feed' || !activeGroup) {
        const myGroups = groups.filter(g => g.members.includes(currentUser.id) || g.adminId === currentUser.id);
        const suggestedGroups = groups.filter(g => !g.members.includes(currentUser.id) && g.adminId !== currentUser.id);

        return (
            <div className="w-full max-w-[1000px] mx-auto p-4 font-sans pb-20">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 bg-[#242526] p-4 rounded-xl border border-[#3E4042]">
                    <div>
                        <h2 className="text-2xl font-bold text-[#E4E6EB]">Groups</h2>
                        <p className="text-[#B0B3B8] text-sm">Discover and join communities.</p>
                    </div>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-[#263951] text-[#2D88FF] hover:bg-[#2A3F5A] px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                    >
                        <i className="fas fa-plus-circle"></i> <span>Create New Group</span>
                    </button>
                </div>

                {/* Your Groups */}
                {myGroups.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-[#E4E6EB] mb-3">Your Groups</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {myGroups.map(group => (
                                <div key={group.id} className="bg-[#242526] rounded-xl overflow-hidden border border-[#3E4042] cursor-pointer hover:shadow-lg transition-all group-card" onClick={() => handleGroupClick(group)}>
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

                {/* Suggested Groups */}
                <div>
                    <h3 className="text-lg font-bold text-[#E4E6EB] mb-3">Suggested for you</h3>
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
                                        <button 
                                            onClick={() => onJoinGroup(group.id)}
                                            className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-2 rounded-lg font-semibold transition-colors"
                                        >
                                            Join Group
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {suggestedGroups.length === 0 && myGroups.length === 0 && (
                            <div className="col-span-full text-center py-10">
                                <div className="w-20 h-20 bg-[#242526] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#3E4042]">
                                    <i className="fas fa-users text-3xl text-[#B0B3B8]"></i>
                                </div>
                                <h3 className="text-[#E4E6EB] font-bold text-lg">No groups found</h3>
                                <button onClick={() => setShowCreateModal(true)} className="text-[#1877F2] font-semibold hover:underline mt-2">Create the first group</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4">
                        <div className="bg-[#242526] w-full max-w-[500px] rounded-xl border border-[#3E4042] shadow-2xl overflow-hidden">
                            <div className="p-4 border-b border-[#3E4042] flex justify-between items-center">
                                <h3 className="text-xl font-bold text-[#E4E6EB]">Create Group</h3>
                                <div onClick={() => setShowCreateModal(false)} className="w-8 h-8 rounded-full bg-[#3A3B3C] flex items-center justify-center cursor-pointer hover:bg-[#4E4F50]">
                                    <i className="fas fa-times text-[#B0B3B8]"></i>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-[#B0B3B8] text-sm font-bold mb-1">Name</label>
                                    <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" placeholder="Name your group" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-[#B0B3B8] text-sm font-bold mb-1">Description</label>
                                    <textarea className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] resize-none h-24" placeholder="What is this group about?" value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-[#B0B3B8] text-sm font-bold mb-1">Privacy</label>
                                    <select className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-2.5 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={newGroupType} onChange={(e) => setNewGroupType(e.target.value as any)}>
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

    // --- Render: Single Group View (Facebook Style) ---
    const isMember = activeGroup.members.includes(currentUser.id) || activeGroup.adminId === currentUser.id;
    const adminUser = users.find(u => u.id === activeGroup.adminId);

    return (
        <div className="w-full bg-[#18191A] min-h-screen pb-10">
            {/* Group Header */}
            <div className="bg-[#242526] border-b border-[#3E4042] shadow-sm mb-4">
                <div className="max-w-[1100px] mx-auto w-full">
                    {/* Cover */}
                    <div className="w-full h-[200px] md:h-[350px] relative bg-gray-800 md:rounded-b-xl overflow-hidden group">
                        <img src={activeGroup.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        <div onClick={() => setView('feed')} className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white cursor-pointer backdrop-blur-sm">
                            <i className="fas fa-arrow-left"></i>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="px-4 pb-4">
                        <div className="flex flex-col md:flex-row items-start gap-4 -mt-4 md:-mt-8 relative z-10 mb-4">
                            {/* Group Avatar (Inset) */}
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-xl border-4 border-[#242526] overflow-hidden bg-[#242526] shadow-lg flex-shrink-0">
                                <img src={activeGroup.image} alt={activeGroup.name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex-1 mt-4 md:mt-10">
                                <h1 className="text-2xl md:text-3xl font-bold text-[#E4E6EB] leading-tight">{activeGroup.name}</h1>
                                <div className="flex items-center gap-2 text-[#B0B3B8] text-sm mt-1">
                                    <i className={`fas ${activeGroup.type === 'public' ? 'fa-globe-americas' : 'fa-lock'}`}></i>
                                    <span className="capitalize">{activeGroup.type} Group</span>
                                    <span>•</span>
                                    <span>{activeGroup.members.length} members</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 md:mt-10 w-full md:w-auto">
                                {isMember ? (
                                    <>
                                        <button className="flex-1 md:flex-none bg-[#3A3B3C] text-[#E4E6EB] px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                                            <i className="fas fa-check"></i> Joined
                                        </button>
                                        <button className="flex-1 md:flex-none bg-[#1877F2] text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2">
                                            <i className="fas fa-plus"></i> Invite
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => onJoinGroup(activeGroup.id)} className="flex-1 md:flex-none bg-[#1877F2] hover:bg-[#166FE5] text-white px-6 py-2 rounded-lg font-bold w-full md:w-auto transition-colors">
                                        Join Group
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="h-[1px] bg-[#3E4042] w-full mb-1"></div>
                        
                        {/* Group Tabs */}
                        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                            {['Discussion', 'Featured', 'People', 'Events', 'Media', 'Files'].map((tab) => (
                                <div key={tab} className={`px-4 py-3 cursor-pointer whitespace-nowrap text-[15px] font-semibold border-b-[3px] transition-colors ${tab === 'Discussion' ? 'text-[#1877F2] border-[#1877F2]' : 'text-[#B0B3B8] border-transparent hover:bg-[#3A3B3C] rounded-t-lg'}`}>
                                    {tab}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Layout */}
            <div className="max-w-[1100px] mx-auto px-0 md:px-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
                
                {/* Main Feed Column */}
                <div className="w-full min-w-0">
                    {isMember && (
                        <GroupCreatePost 
                            currentUser={currentUser} 
                            onPost={(text) => onPostToGroup(activeGroup.id, text)} 
                        />
                    )}

                    {activeGroup.posts && activeGroup.posts.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {[...activeGroup.posts].sort((a,b) => b.timestamp - a.timestamp).map(post => {
                                const author = users.find(u => u.id === post.authorId);
                                return author ? (
                                    <GroupPostCard 
                                        key={post.id} 
                                        post={post} 
                                        author={author} 
                                        currentUser={currentUser}
                                        onProfileClick={onProfileClick}
                                    />
                                ) : null;
                            })}
                        </div>
                    ) : (
                        <div className="bg-[#242526] rounded-xl p-8 text-center border border-[#3E4042] mx-4 md:mx-0">
                            <div className="w-16 h-16 bg-[#3A3B3C] rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-comment-alt text-[#B0B3B8] text-2xl"></i>
                            </div>
                            <h3 className="text-[#E4E6EB] font-bold text-lg">No posts yet</h3>
                            <p className="text-[#B0B3B8] text-sm">Be the first to share something in this group!</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="hidden lg:flex flex-col gap-4">
                    <div className="bg-[#242526] rounded-xl p-4 border border-[#3E4042] shadow-sm">
                        <h3 className="font-bold text-[#E4E6EB] mb-3">About</h3>
                        <p className="text-[#E4E6EB] text-[15px] mb-4">{activeGroup.description}</p>
                        
                        <div className="flex items-center gap-3 mb-3 text-[#E4E6EB] text-[15px]">
                            <i className="fas fa-globe-americas text-[#B0B3B8] w-5"></i>
                            <div>
                                <div className="font-semibold">Public</div>
                                <div className="text-xs text-[#B0B3B8]">Anyone can see who's in the group and what they post.</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-[#E4E6EB] text-[15px]">
                            <i className="fas fa-eye text-[#B0B3B8] w-5"></i>
                            <div>
                                <div className="font-semibold">Visible</div>
                                <div className="text-xs text-[#B0B3B8]">Anyone can find this group.</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#242526] rounded-xl p-4 border border-[#3E4042] shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-[#E4E6EB]">Admin</h3>
                            <span className="text-[#1877F2] text-sm cursor-pointer hover:underline">See all</span>
                        </div>
                        {adminUser && (
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onProfileClick(adminUser.id)}>
                                <img src={adminUser.profileImage} className="w-10 h-10 rounded-full object-cover border border-[#3E4042]" alt="" />
                                <div>
                                    <div className="font-semibold text-[#E4E6EB] text-sm">{adminUser.name}</div>
                                    <div className="text-xs text-[#B0B3B8] Admin">Admin</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components for Groups ---

const GroupCreatePost = ({ currentUser, onPost }: { currentUser: User, onPost: (t: string) => void }) => {
    const [text, setText] = useState('');
    return (
        <div className="bg-[#242526] rounded-xl p-3 mb-4 border border-[#3E4042] mx-4 md:mx-0 shadow-sm">
            <div className="flex gap-2 mb-3">
                <img src={currentUser.profileImage} className="w-10 h-10 rounded-full object-cover border border-[#3E4042]" alt="" />
                <div className="flex-1 bg-[#3A3B3C] rounded-full px-4 py-2 flex items-center">
                    <input 
                        type="text" 
                        className="bg-transparent w-full outline-none text-[#E4E6EB] placeholder-[#B0B3B8]"
                        placeholder="Write something..."
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={e => { if(e.key === 'Enter' && text.trim()) { onPost(text); setText(''); } }}
                    />
                </div>
            </div>
            <div className="border-t border-[#3E4042] pt-2 flex justify-between px-2">
                <div className="flex items-center gap-2 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors">
                    <i className="fas fa-images text-[#45BD62]"></i> <span className="text-[#B0B3B8] text-sm font-semibold">Photo</span>
                </div>
                <div className="flex items-center gap-2 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors">
                    <i className="fas fa-video text-[#F02849]"></i> <span className="text-[#B0B3B8] text-sm font-semibold">Video</span>
                </div>
                <div className="flex items-center gap-2 p-2 hover:bg-[#3A3B3C] rounded-lg cursor-pointer transition-colors">
                    <i className="fas fa-poll text-[#F7B928]"></i> <span className="text-[#B0B3B8] text-sm font-semibold">Poll</span>
                </div>
            </div>
        </div>
    );
};

const GroupPostCard: React.FC<{ post: GroupPost, author: User, currentUser: User, onProfileClick: (id: number) => void }> = ({ post, author, currentUser, onProfileClick }) => {
    return (
        <div className="bg-[#242526] rounded-xl border border-[#3E4042] shadow-sm mx-4 md:mx-0 overflow-hidden">
            <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src={author.profileImage} className="w-10 h-10 rounded-full object-cover cursor-pointer border border-[#3E4042]" onClick={() => onProfileClick(author.id)} alt="" />
                    <div>
                        <h4 className="font-bold text-[#E4E6EB] text-[15px] cursor-pointer hover:underline" onClick={() => onProfileClick(author.id)}>{author.name}</h4>
                        <span className="text-[#B0B3B8] text-xs">Just now</span>
                    </div>
                </div>
                <i className="fas fa-ellipsis-h text-[#B0B3B8] p-2 hover:bg-[#3A3B3C] rounded-full cursor-pointer"></i>
            </div>
            <div className="px-3 pb-2 text-[#E4E6EB] text-[15px]">
                {post.content}
            </div>
            {post.image && (
                <img src={post.image} className="w-full h-auto object-cover" alt="" />
            )}
            <div className="px-3 py-2 border-t border-[#3E4042] flex items-center justify-between mt-1">
                <button className="flex-1 flex items-center justify-center gap-2 py-1.5 hover:bg-[#3A3B3C] rounded-lg text-[#B0B3B8] font-semibold transition-colors">
                    <i className="far fa-thumbs-up"></i> Like
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-1.5 hover:bg-[#3A3B3C] rounded-lg text-[#B0B3B8] font-semibold transition-colors">
                    <i className="far fa-comment-alt"></i> Comment
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-1.5 hover:bg-[#3A3B3C] rounded-lg text-[#B0B3B8] font-semibold transition-colors">
                    <i className="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    );
};