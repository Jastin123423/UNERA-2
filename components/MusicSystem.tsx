
import React, { useState, useEffect } from 'react';
import { Song, Album, Podcast, Episode, AudioTrack } from '../types';
import { MOCK_SONGS, MOCK_ALBUMS, MOCK_PODCASTS, MOCK_EPISODES } from '../constants';

// --- GLOBAL AUDIO PLAYER ---
interface GlobalAudioPlayerProps {
    currentTrack: AudioTrack | null;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onClose: () => void;
}

export const GlobalAudioPlayer: React.FC<GlobalAudioPlayerProps> = ({ currentTrack, isPlaying, onTogglePlay, onNext, onPrevious, onClose }) => {
    const [progress, setProgress] = useState(0);
    const [expanded, setExpanded] = useState(false);
    
    // Simulating progress
    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(p => (p >= 100 ? 0 : p + 0.5));
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    if (!currentTrack) return null;

    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-[#333] transition-all duration-300 z-[160] shadow-2xl ${expanded ? 'h-full flex flex-col' : 'h-20'}`}>
            
            {/* Expanded View Header */}
            {expanded && (
                <div className="flex items-center justify-between p-6 mt-8">
                    <i className="fas fa-chevron-down text-white text-2xl cursor-pointer" onClick={() => setExpanded(false)}></i>
                    <span className="text-white font-bold tracking-wider text-sm">NOW PLAYING</span>
                    <i className="fas fa-ellipsis-h text-white text-xl"></i>
                </div>
            )}

            {/* Content Container */}
            <div className={`flex ${expanded ? 'flex-col items-center flex-1 justify-center' : 'items-center justify-between px-4 h-full'}`}>
                
                {/* Artwork */}
                <div className={`${expanded ? 'w-72 h-72 mb-8 shadow-2xl' : 'w-12 h-12'} transition-all duration-300 relative group`}>
                    <img src={currentTrack.cover} alt="Cover" className={`w-full h-full object-cover rounded-lg ${isPlaying && expanded ? 'animate-pulse' : ''}`} />
                    {!expanded && <div className="absolute inset-0 bg-black/20" onClick={() => setExpanded(true)}></div>}
                </div>

                {/* Info */}
                <div className={`${expanded ? 'text-center mb-8' : 'flex-1 ml-3'} cursor-pointer`} onClick={() => !expanded && setExpanded(true)}>
                    <h4 className={`text-white font-bold ${expanded ? 'text-2xl mb-2' : 'text-sm line-clamp-1'}`}>{currentTrack.title}</h4>
                    <p className={`text-gray-400 ${expanded ? 'text-lg' : 'text-xs line-clamp-1'}`}>{currentTrack.artist}</p>
                </div>

                {/* Expanded Progress Bar */}
                {expanded && (
                    <div className="w-full px-8 mb-8">
                        <div className="w-full h-1 bg-gray-700 rounded-full mb-2">
                            <div className="h-full bg-[#0055FF] rounded-full relative" style={{ width: `${progress}%` }}>
                                <div className="absolute right-0 -top-1.5 w-4 h-4 bg-white rounded-full shadow-md"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>1:23</span>
                            <span>3:45</span>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className={`flex items-center ${expanded ? 'gap-10 mb-12' : 'gap-4'}`}>
                    <i className={`fas fa-step-backward text-white cursor-pointer hover:text-[#0055FF] ${expanded ? 'text-3xl' : 'text-lg'}`} onClick={onPrevious}></i>
                    <div 
                        className={`${expanded ? 'w-20 h-20 text-3xl' : 'w-10 h-10 text-lg'} bg-[#0055FF] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform`}
                        onClick={onTogglePlay}
                    >
                        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} ml-1`}></i>
                    </div>
                    <i className={`fas fa-step-forward text-white cursor-pointer hover:text-[#0055FF] ${expanded ? 'text-3xl' : 'text-lg'}`} onClick={onNext}></i>
                </div>

                {/* Close Button (Mini Player Only) */}
                {!expanded && (
                    <div className="ml-4 cursor-pointer text-gray-400 hover:text-white" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </div>
                )}
            </div>

            {/* Mini Player Progress */}
            {!expanded && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-800">
                    <div className="h-full bg-[#0055FF]" style={{ width: `${progress}%` }}></div>
                </div>
            )}
        </div>
    );
};

// --- MUSIC PAGE INTERFACE ---
interface MusicPageProps {
    onPlayTrack: (track: AudioTrack) => void;
    currentTrackId?: string;
    isPlaying: boolean;
}

export const MusicPage: React.FC<MusicPageProps> = ({ onPlayTrack, currentTrackId, isPlaying }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [downloads, setDownloads] = useState<string[]>([]);

    const toggleDownload = (id: string) => {
        if (downloads.includes(id)) {
            setDownloads(downloads.filter(d => d !== id));
        } else {
            // Simulate Download
            setDownloads([...downloads, id]);
            alert("Downloaded to offline library!");
        }
    };

    return (
        <div className="bg-[#0A0A0A] min-h-screen pb-24 font-sans text-white">
            {/* Hero Section */}
            <div className="relative h-[350px] w-full bg-gradient-to-b from-[#141414] to-[#0A0A0A]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493225255756-d9584f8606e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-[#0A0A0A] to-transparent">
                    <div className="flex items-end gap-6">
                        <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" className="w-32 h-32 rounded-full border-4 border-[#0A0A0A] shadow-xl" alt="Artist" />
                        <div className="mb-2">
                            <div className="flex items-center gap-2 text-[#0055FF] text-sm font-bold mb-1">
                                <i className="fas fa-check-circle"></i> VERIFIED ARTIST
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">Sarah Chen</h1>
                            <p className="text-gray-300 text-sm max-w-lg line-clamp-2">Electronic music producer and visual artist based in San Francisco. Creating soundscapes for the digital age.</p>
                            <div className="flex gap-3 mt-4">
                                <button className="bg-[#0055FF] hover:bg-[#0044CC] text-white px-8 py-2 rounded-full font-bold transition-colors">Follow</button>
                                <button className="bg-[#141414] border border-gray-600 hover:bg-gray-800 text-white px-6 py-2 rounded-full font-bold transition-colors">Message</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-6 px-6 py-4 border-b border-[#222] sticky top-14 bg-[#0A0A0A]/95 backdrop-blur-md z-40 overflow-x-auto">
                {['Overview', 'Releases', 'Albums', 'About'].map(tab => (
                    <span key={tab} onClick={() => setActiveTab(tab)} className={`cursor-pointer font-bold text-sm uppercase tracking-wider ${activeTab === tab ? 'text-[#0055FF] border-b-2 border-[#0055FF] pb-1' : 'text-gray-400 hover:text-white'}`}>{tab}</span>
                ))}
            </div>

            <div className="p-6">
                {/* Top Songs */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold mb-4">Top Songs</h2>
                    <div className="flex flex-col gap-2">
                        {MOCK_SONGS.map((song, idx) => (
                            <div key={song.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-[#141414] transition-colors cursor-pointer border border-transparent hover:border-[#222]" onClick={() => onPlayTrack({ id: song.id, url: song.audioUrl, title: song.title, artist: song.artist, cover: song.cover, type: 'music' })}>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500 font-mono w-4">{idx + 1}</span>
                                    <div className="relative w-12 h-12">
                                        <img src={song.cover} className="w-full h-full rounded object-cover" alt="" />
                                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${currentTrackId === song.id && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <i className={`fas ${currentTrackId === song.id && isPlaying ? 'fa-pause' : 'fa-play'} text-white`}></i>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${currentTrackId === song.id ? 'text-[#0055FF]' : 'text-white'}`}>{song.title}</h4>
                                        <span className="text-gray-400 text-xs">{song.plays.toLocaleString()} plays</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500 text-sm hidden sm:block">{song.duration}</span>
                                    <i 
                                        className={`fas ${downloads.includes(song.id) ? 'fa-check-circle text-[#0055FF]' : 'fa-arrow-circle-down text-gray-400 hover:text-white'} text-xl cursor-pointer`}
                                        onClick={(e) => { e.stopPropagation(); toggleDownload(song.id); }}
                                    ></i>
                                    <i className="fas fa-ellipsis-v text-gray-500 hover:text-white p-2"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Albums Grid */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Albums</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {MOCK_ALBUMS.map(album => (
                            <div key={album.id} className="group cursor-pointer">
                                <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
                                    <img src={album.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <div className="w-10 h-10 bg-[#0055FF] rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <i className="fas fa-play text-white ml-1"></i>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="font-bold text-white truncate">{album.title}</h3>
                                <p className="text-gray-400 text-sm">{album.year} • Album</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PODCAST PAGE INTERFACE ---
interface PodcastPageProps {
    onPlayTrack: (track: AudioTrack) => void;
    currentTrackId?: string;
    isPlaying: boolean;
}

export const PodcastPage: React.FC<PodcastPageProps> = ({ onPlayTrack, currentTrackId, isPlaying }) => {
    const categories = ['News', 'Business', 'Comedy', 'Education', 'Health', 'True Crime', 'Tech', 'Music'];
    const [downloadedEps, setDownloadedEps] = useState<string[]>([]);

    const handleDownload = (id: string) => {
        setDownloadedEps(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
        if (!downloadedEps.includes(id)) alert("Episode downloading...");
    };

    return (
        <div className="bg-[#0A0A0A] min-h-screen pb-24 font-sans text-white">
            {/* Header */}
            <div className="p-6 bg-[#141414] border-b border-[#222]">
                <h1 className="text-3xl font-bold mb-6">Podcasts</h1>
                
                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <span key={cat} className="bg-[#222] hover:bg-[#333] border border-[#333] px-4 py-2 rounded-full text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors">
                            {cat}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-6">
                {/* Featured Podcasts */}
                <h2 className="text-xl font-bold mb-4 text-gray-200">Trending Shows</h2>
                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                    {MOCK_PODCASTS.map(pod => (
                        <div key={pod.id} className="min-w-[160px] cursor-pointer group">
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                                <img src={pod.cover} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" alt="" />
                                <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold uppercase">{pod.category}</span>
                            </div>
                            <h3 className="font-bold text-sm truncate">{pod.title}</h3>
                            <p className="text-xs text-gray-400 truncate">{pod.host}</p>
                        </div>
                    ))}
                </div>

                {/* Latest Episodes (Boomplay Style List) */}
                <h2 className="text-xl font-bold mb-4 text-gray-200">Latest Episodes</h2>
                <div className="flex flex-col gap-4">
                    {MOCK_EPISODES.map(ep => {
                        const podcast = MOCK_PODCASTS.find(p => p.id === ep.podcastId);
                        return (
                            <div key={ep.id} className="flex gap-4 p-3 bg-[#141414] rounded-xl border border-[#222] hover:border-[#333] transition-colors">
                                <div className="relative min-w-[80px] w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => onPlayTrack({ id: ep.id, url: ep.audioUrl, title: ep.title, artist: podcast?.title || 'Unknown', cover: ep.thumbnail, type: 'podcast' })}>
                                    <img src={ep.thumbnail} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <i className={`fas ${currentTrackId === ep.id && isPlaying ? 'fa-pause' : 'fa-play'} text-white text-xl`}></i>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`font-bold text-sm truncate pr-2 ${currentTrackId === ep.id ? 'text-[#0055FF]' : 'text-white'}`}>{ep.title}</h4>
                                        <span className="text-[10px] text-gray-500 whitespace-nowrap">{ep.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-1 mb-2">{ep.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] bg-[#222] px-2 py-0.5 rounded text-gray-300">{ep.duration}</span>
                                            <span className="text-[10px] text-[#0055FF]">{podcast?.title}</span>
                                        </div>
                                        <div className="flex gap-3 text-gray-400">
                                            <i 
                                                className={`fas ${downloadedEps.includes(ep.id) ? 'fa-check-circle text-[#0055FF]' : 'fa-arrow-circle-down hover:text-white'} cursor-pointer`}
                                                onClick={() => handleDownload(ep.id)}
                                            ></i>
                                            <i className="fas fa-share-alt hover:text-white cursor-pointer"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const MusicSystem: React.FC<MusicPageProps> = (props) => {
    const [view, setView] = useState<'music' | 'podcast'>('music');
    return (
        <div className="w-full">
            <div className="bg-[#0A0A0A] px-4 pt-4 flex gap-4 sticky top-14 z-30">
                <button onClick={() => setView('music')} className={`px-4 py-2 rounded-full font-bold text-sm ${view === 'music' ? 'bg-[#0055FF] text-white' : 'bg-[#141414] text-gray-400'}`}>Music</button>
                <button onClick={() => setView('podcast')} className={`px-4 py-2 rounded-full font-bold text-sm ${view === 'podcast' ? 'bg-[#0055FF] text-white' : 'bg-[#141414] text-gray-400'}`}>Podcasts</button>
            </div>
            {view === 'music' ? <MusicPage {...props} /> : <PodcastPage {...props} />}
        </div>
    );
};
