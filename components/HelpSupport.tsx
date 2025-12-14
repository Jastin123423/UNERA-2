
import React, { useState } from 'react';

interface Article {
    id: string;
    title: string;
    category: string;
    content: React.ReactNode;
}

const HELP_ARTICLES: Article[] = [
    {
        id: 'create-account',
        title: 'How to create an account',
        category: 'Account',
        content: (
            <div className="space-y-4">
                <p className="text-[16px] leading-relaxed text-[#B0B3B8]">Joining UNERA is quick and easy. Follow these steps to get started connecting with your community.</p>
                <div className="bg-[#242526] p-4 rounded-lg border border-[#3E4042] my-4">
                    <h4 className="font-bold text-white mb-2">Step-by-Step Guide</h4>
                    <ol className="list-decimal list-inside space-y-3 text-[#E4E6EB] text-[15px]">
                        <li>Open the <strong>UNERA</strong> website or app.</li>
                        <li>On the login screen, click the green <strong>"Create New Account"</strong> button.</li>
                        <li>A registration form will appear. Enter your <strong>First Name</strong>, <strong>Surname</strong>, and <strong>Email Address</strong>.</li>
                        <li>Create a secure <strong>Password</strong> (must be at least 6 digits/characters).</li>
                        <li>Select your <strong>Date of Birth</strong> and <strong>Gender</strong>.</li>
                        <li>Click <strong>Sign Up</strong> to complete the process.</li>
                    </ol>
                </div>
                <div className="flex justify-center my-6">
                    <div className="bg-[#18191A] p-2 rounded-xl border border-[#3E4042] max-w-[400px]">
                        <div className="aspect-[4/3] bg-[#242526] rounded-lg flex items-center justify-center relative overflow-hidden">
                            <i className="fas fa-user-plus text-6xl text-[#3A3B3C]"></i>
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center p-4">
                                <span className="text-white font-bold">Registration Form</span>
                                <span className="text-[#B0B3B8] text-xs mt-1">Fill in your details accurately</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#263951] p-4 rounded-lg text-[15px] text-[#E4E6EB] border border-[#2D88FF]/30 flex gap-3 items-start">
                    <i className="fas fa-info-circle text-[#2D88FF] mt-1"></i>
                    <div>
                        <strong>Tip:</strong> Use an email address you have access to. This will be needed if you ever need to reset your password.
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'login',
        title: 'How to Login',
        category: 'Account',
        content: (
            <div className="space-y-4">
                <p className="text-[16px] leading-relaxed text-[#B0B3B8]">Access your account to see what your friends are up to.</p>
                <div className="bg-[#242526] p-4 rounded-lg border border-[#3E4042] my-4">
                    <ol className="list-decimal list-inside space-y-3 text-[#E4E6EB] text-[15px]">
                        <li>Go to the UNERA home page.</li>
                        <li>Enter your registered <strong>Email Address</strong> in the first field.</li>
                        <li>Enter your <strong>Password</strong> in the second field.</li>
                        <li>Click the blue <strong>Log In</strong> button.</li>
                    </ol>
                </div>
                <p className="text-[#B0B3B8] text-sm">If you forgot your password, click the <span className="text-[#1877F2]">"Forgotten password?"</span> link below the login fields.</p>
            </div>
        )
    },
    {
        id: 'upload-profile',
        title: 'How to upload profile & cover photos',
        category: 'Profile',
        content: (
            <div className="space-y-4">
                <p className="text-[16px] leading-relaxed text-[#B0B3B8]">Personalize your profile to let friends know it's you. Your profile picture and cover photo are the first things people see.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-[#242526] p-4 rounded-xl border border-[#3E4042]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#3A3B3C] flex items-center justify-center"><i className="fas fa-user text-[#E4E6EB]"></i></div>
                            <h4 className="font-bold text-white text-lg">Profile Picture</h4>
                        </div>
                        <ol className="list-decimal list-inside space-y-2 text-[#E4E6EB] text-sm">
                            <li>Go to your profile by clicking your name in the menu.</li>
                            <li>Click the <strong>Camera Icon</strong> on your circular picture.</li>
                            <li>Select <strong>Upload Photo</strong>.</li>
                            <li>Choose an image from your device.</li>
                        </ol>
                    </div>

                    <div className="bg-[#242526] p-4 rounded-xl border border-[#3E4042]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#3A3B3C] flex items-center justify-center"><i className="fas fa-image text-[#E4E6EB]"></i></div>
                            <h4 className="font-bold text-white text-lg">Cover Photo</h4>
                        </div>
                        <ol className="list-decimal list-inside space-y-2 text-[#E4E6EB] text-sm">
                            <li>Go to your profile page.</li>
                            <li>Click <strong>"Edit Cover Photo"</strong> in the bottom right of the banner area.</li>
                            <li>Choose an image that represents you.</li>
                        </ol>
                    </div>
                </div>

                <div className="my-6 bg-[#18191A] p-6 rounded-xl border border-[#3E4042] flex flex-col items-center">
                    <div className="w-full max-w-[400px] h-32 bg-gray-700 rounded-t-lg relative mb-8">
                        <div className="absolute bottom-2 right-2 bg-white/20 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                            <i className="fas fa-camera"></i> Edit Cover
                        </div>
                        <div className="absolute -bottom-8 left-4 w-20 h-20 bg-gray-600 rounded-full border-4 border-[#18191A] flex items-center justify-center relative">
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                                <i className="fas fa-camera text-white"></i>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-[#B0B3B8] text-center">Look for the camera icons overlaid on your images to update them.</p>
                </div>
            </div>
        )
    },
    {
        id: 'groups',
        title: 'Using UNERA Groups',
        category: 'Groups',
        content: (
            <div className="space-y-6">
                <p className="text-[16px] text-[#B0B3B8]">Groups are spaces where you can communicate with people who share your interests.</p>
                
                <div>
                    <h4 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                        <i className="fas fa-users text-[#1877F2]"></i> Joining a Group
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-[#E4E6EB] ml-2">
                        <li>Click <strong>Groups</strong> in the main menu or sidebar.</li>
                        <li>Browse "Suggested for you" or search for a specific topic like "Photography" or "Technology".</li>
                        <li>Click <strong>Join Group</strong>. Some groups are private and may require admin approval.</li>
                    </ul>
                </div>

                <div className="border-t border-[#3E4042] my-4"></div>

                <div>
                    <h4 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                        <i className="fas fa-plus-circle text-[#45BD62]"></i> Creating a Group
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-[#E4E6EB] ml-2">
                        <li>Go to the Groups page and click the <strong>Create New Group</strong> button.</li>
                        <li>Enter a Name and Description for your community.</li>
                        <li>Choose privacy: 
                            <ul className="list-none ml-6 mt-1 text-sm text-[#B0B3B8] space-y-1">
                                <li>• <strong>Public:</strong> Anyone can see who's in the group and what they post.</li>
                                <li>• <strong>Private:</strong> Only members can see who's in the group and what they post.</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        id: 'music',
        title: 'UNERA Music & Podcasts',
        category: 'Music',
        content: (
            <div className="space-y-6">
                <p className="text-[16px] text-[#B0B3B8]">UNERA Music is a platform for artists and listeners alike. Enjoy high-quality streaming directly in your feed.</p>
                
                <div className="bg-gradient-to-r from-gray-800 to-black p-6 rounded-xl border border-[#3E4042] relative overflow-hidden">
                    <div className="relative z-10">
                        <h4 className="font-bold text-white text-xl mb-2">For Listeners</h4>
                        <p className="text-[#E4E6EB] mb-4">Click <strong>UNERA Music</strong> in the menu to explore trending songs, albums, and podcasts. You can play tracks in the background via the global player while you browse.</p>
                        <div className="flex gap-2">
                            <span className="bg-[#1877F2] text-white text-xs px-2 py-1 rounded">Streaming</span>
                            <span className="bg-[#3A3B3C] text-white text-xs px-2 py-1 rounded">Playlists</span>
                            <span className="bg-[#3A3B3C] text-white text-xs px-2 py-1 rounded">Background Play</span>
                        </div>
                    </div>
                    <i className="fas fa-headphones absolute -bottom-4 -right-4 text-9xl text-white/5"></i>
                </div>
                
                <div>
                    <h4 className="font-bold text-white text-lg mb-3">For Artists & Creators</h4>
                    <p className="text-[#B0B3B8] mb-3">If you are a musician or podcaster, you can upload your work directly:</p>
                    <div className="bg-[#242526] border border-[#3E4042] rounded-lg p-4">
                        <ol className="list-decimal list-inside space-y-3 text-[#E4E6EB]">
                            <li>Go to the Music section and click <strong>Dashboard</strong> in the top navigation.</li>
                            <li>Click the large <strong>Upload New Content</strong> button.</li>
                            <li>Select your content type: <strong>Single</strong>, <strong>Album</strong>, or <strong>Podcast</strong>.</li>
                            <li>Upload your high-quality audio files and artwork details.</li>
                            <li>Once published, your content appears on your profile and in the global music feed.</li>
                        </ol>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'marketplace',
        title: 'Buying & Selling on Marketplace',
        category: 'Marketplace',
        content: (
            <div className="space-y-6">
                <p className="text-[16px] text-[#B0B3B8]">Discover items nearby or sell things you no longer need using UNERA Marketplace.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#242526] p-5 rounded-xl border border-[#3E4042]">
                        <div className="w-10 h-10 bg-[#45BD62]/20 rounded-full flex items-center justify-center mb-3 text-[#45BD62]"><i className="fas fa-shopping-bag text-xl"></i></div>
                        <h4 className="font-bold text-white text-lg mb-2">How to Buy</h4>
                        <ul className="text-sm text-[#E4E6EB] space-y-2">
                            <li>Browse categories or search for specific items.</li>
                            <li>Click on an item to see detailed photos and descriptions.</li>
                            <li>Use the <strong>Message</strong> button to contact the seller directly or <strong>Call</strong> if a number is provided.</li>
                        </ul>
                    </div>

                    <div className="bg-[#242526] p-5 rounded-xl border border-[#3E4042]">
                        <div className="w-10 h-10 bg-[#1877F2]/20 rounded-full flex items-center justify-center mb-3 text-[#1877F2]"><i className="fas fa-tag text-xl"></i></div>
                        <h4 className="font-bold text-white text-lg mb-2">How to Sell</h4>
                        <ul className="text-sm text-[#E4E6EB] space-y-2">
                            <li>Click <strong>Sell</strong> in the Marketplace header.</li>
                            <li>Upload clear photos of your item (max 4).</li>
                            <li>Set a price, title, description, and location.</li>
                            <li>Post it! Your item is immediately visible to the community.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
];

const CATEGORIES = [
    { id: 'Account', icon: 'fas fa-user-circle', label: 'Account Settings', desc: 'Login, Password, Security' },
    { id: 'Profile', icon: 'fas fa-id-card', label: 'Profile & Content', desc: 'Photos, Bio, Posts' },
    { id: 'Groups', icon: 'fas fa-users', label: 'Groups', desc: 'Join, Create, Manage' },
    { id: 'Music', icon: 'fas fa-music', label: 'UNERA Music', desc: 'Streaming, Uploading' },
    { id: 'Marketplace', icon: 'fas fa-store', label: 'Marketplace', desc: 'Buying, Selling' },
    { id: 'Privacy', icon: 'fas fa-shield-alt', label: 'Privacy & Safety', desc: 'Blocking, Reporting' },
];

export const HelpSupportPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeArticle, setActiveArticle] = useState<Article | null>(null);

    const filteredArticles = search 
        ? HELP_ARTICLES.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()))
        : activeCategory 
            ? HELP_ARTICLES.filter(a => a.category === activeCategory)
            : HELP_ARTICLES; // Show all or popular if no category

    const handleCategoryClick = (catId: string) => {
        setActiveCategory(catId);
        setActiveArticle(null);
        setSearch('');
    };

    const handleArticleClick = (article: Article) => {
        setActiveArticle(article);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        if (activeArticle) {
            setActiveArticle(null);
        } else if (activeCategory) {
            setActiveCategory(null);
        } else {
            onNavigateHome();
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#18191A] font-sans text-[#E4E6EB] pb-20">
            {/* Hero Search Section */}
            <div className="bg-gradient-to-r from-[#1877F2] to-[#0062E3] py-12 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="relative z-10 max-w-[700px] mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Help Center</h1>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="How can we help you?" 
                            className="w-full h-14 pl-12 pr-4 rounded-full bg-white text-gray-900 text-lg outline-none shadow-lg placeholder-gray-500"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setActiveArticle(null); if(e.target.value) setActiveCategory(null); }}
                        />
                        <i className="fas fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1000px] mx-auto px-4 py-8">
                
                {/* Breadcrumbs / Back Navigation */}
                <div className="flex items-center gap-2 mb-6 text-sm text-[#B0B3B8]">
                    <span className="cursor-pointer hover:underline" onClick={() => { setActiveCategory(null); setActiveArticle(null); setSearch(''); }}>Help Center</span>
                    {(activeCategory || activeArticle || search) && (
                        <>
                            <i className="fas fa-chevron-right text-xs"></i>
                            {activeArticle ? (
                                <>
                                    <span className="cursor-pointer hover:underline" onClick={() => { setActiveArticle(null); }}>{activeArticle.category}</span>
                                    <i className="fas fa-chevron-right text-xs"></i>
                                    <span className="text-white font-semibold truncate max-w-[200px]">{activeArticle.title}</span>
                                </>
                            ) : (
                                <span className="text-white font-semibold">{search ? `Results for "${search}"` : activeCategory}</span>
                            )}
                        </>
                    )}
                </div>

                {/* VIEW: Article Details */}
                {activeArticle ? (
                    <div className="bg-[#242526] rounded-xl border border-[#3E4042] overflow-hidden shadow-sm animate-fade-in max-w-[800px] mx-auto">
                        <div className="p-6 border-b border-[#3E4042] flex items-center gap-4">
                            <button onClick={() => setActiveArticle(null)} className="w-9 h-9 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] flex items-center justify-center transition-colors">
                                <i className="fas fa-arrow-left text-[#E4E6EB]"></i>
                            </button>
                            <h2 className="text-2xl font-bold text-[#E4E6EB]">{activeArticle.title}</h2>
                        </div>
                        <div className="p-6 md:p-10">
                            {activeArticle.content}
                        </div>
                        <div className="p-6 bg-[#2A2B2D] border-t border-[#3E4042] text-center">
                            <p className="text-[#B0B3B8] mb-4">Was this article helpful?</p>
                            <div className="flex justify-center gap-4">
                                <button className="bg-[#3A3B3C] hover:bg-[#4E4F50] px-6 py-2 rounded-full font-semibold transition-colors flex items-center gap-2"><i className="fas fa-thumbs-up"></i> Yes</button>
                                <button className="bg-[#3A3B3C] hover:bg-[#4E4F50] px-6 py-2 rounded-full font-semibold transition-colors flex items-center gap-2"><i className="fas fa-thumbs-down"></i> No</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* VIEW: Categories or Search Results */
                    <div className="animate-fade-in">
                        {!search && !activeCategory && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                                {CATEGORIES.map(cat => (
                                    <div 
                                        key={cat.id} 
                                        className="bg-[#242526] p-6 rounded-xl border border-[#3E4042] cursor-pointer hover:bg-[#3A3B3C] hover:border-[#1877F2] transition-all group shadow-sm"
                                        onClick={() => handleCategoryClick(cat.id)}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-[#3A3B3C] group-hover:bg-[#1877F2] flex items-center justify-center mb-4 transition-colors">
                                            <i className={`${cat.icon} text-xl text-[#E4E6EB] group-hover:text-white`}></i>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#E4E6EB] mb-2">{cat.label}</h3>
                                        <p className="text-[#B0B3B8] text-sm">{cat.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-[#242526] rounded-xl border border-[#3E4042] overflow-hidden max-w-[800px] mx-auto">
                            <div className="p-4 border-b border-[#3E4042] bg-[#2A2B2D]">
                                <h3 className="font-bold text-lg text-[#E4E6EB]">
                                    {search ? 'Search Results' : activeCategory ? `${activeCategory} Articles` : 'Popular Articles'}
                                </h3>
                            </div>
                            <div className="divide-y divide-[#3E4042]">
                                {filteredArticles.length > 0 ? filteredArticles.map(article => (
                                    <div 
                                        key={article.id} 
                                        className="p-4 hover:bg-[#3A3B3C] cursor-pointer transition-colors flex items-center justify-between group"
                                        onClick={() => handleArticleClick(article)}
                                    >
                                        <div>
                                            <h4 className="text-[#1877F2] font-semibold text-[17px] group-hover:underline mb-1">{article.title}</h4>
                                            <p className="text-[#B0B3B8] text-sm line-clamp-1">{article.category} • Click to read more</p>
                                        </div>
                                        <i className="fas fa-chevron-right text-[#B0B3B8]"></i>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center text-[#B0B3B8]">
                                        <i className="fas fa-search text-3xl mb-3 opacity-50"></i>
                                        <p>No articles found matching your search.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
