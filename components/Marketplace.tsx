
import React, { useState, useEffect, useRef } from 'react';
import { User, Product } from '../types';
import { MARKETPLACE_CATEGORIES, MARKETPLACE_COUNTRIES } from '../constants';

// --- PRODUCT DETAIL MODAL ---
interface ProductDetailModalProps {
    product: Product;
    currentUser: User | null;
    onClose: () => void;
    onMessage: (sellerId: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, currentUser, onClose, onMessage }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showPhone, setShowPhone] = useState(false);
    
    const country = MARKETPLACE_COUNTRIES.find(c => c.code === product.country);
    const symbol = country ? country.symbol : '$';
    const hasDiscount = !!product.discountPrice;

    return (
        <div className="fixed inset-0 z-[150] bg-black/90 flex items-center justify-center p-0 md:p-4 animate-fade-in font-sans">
            <div className="bg-[#242526] w-full max-w-[1000px] md:rounded-xl overflow-hidden flex flex-col md:flex-row h-full md:h-[85vh] relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors">
                    <i className="fas fa-times text-xl"></i>
                </button>

                {/* Left: Image Gallery */}
                <div className="w-full md:w-[55%] bg-black flex flex-col relative">
                    <div className="flex-1 relative flex items-center justify-center bg-[#18191A]">
                        <img src={product.images[activeImageIndex]} alt={product.title} className="max-w-full max-h-full object-contain" />
                        
                        {/* Navigation Arrows */}
                        {product.images.length > 1 && (
                            <>
                                <button 
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full text-white flex items-center justify-center hover:bg-black/70"
                                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1); }}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button 
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full text-white flex items-center justify-center hover:bg-black/70"
                                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1); }}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </>
                        )}
                    </div>
                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="h-20 bg-[#242526] flex items-center gap-2 px-4 overflow-x-auto border-t border-[#3E4042]">
                            {product.images.map((img, idx) => (
                                <img 
                                    key={idx} 
                                    src={img} 
                                    className={`h-16 w-16 object-cover rounded cursor-pointer border-2 ${activeImageIndex === idx ? 'border-[#1877F2] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    onClick={() => setActiveImageIndex(idx)}
                                    alt="thumb"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-[45%] flex flex-col h-full bg-[#242526] border-l border-[#3E4042]">
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Header with Seller Info and Call Button */}
                        <div className="flex items-center justify-between mb-4 border-b border-[#3E4042] pb-4">
                             <div className="flex items-center gap-2">
                                 <img src={product.sellerAvatar} alt="Seller" className="w-10 h-10 rounded-full object-cover border border-[#3E4042]" />
                                 <div>
                                     <h4 className="text-[#E4E6EB] font-bold text-sm leading-tight">{product.sellerName}</h4>
                                     <p className="text-[#B0B3B8] text-xs">Listed {new Date(product.date).toLocaleDateString()}</p>
                                 </div>
                             </div>
                             <a href={`tel:${product.phoneNumber}`} className="flex items-center gap-2 bg-[#263951] hover:bg-[#2A3F5A] px-4 py-2 rounded-full transition-colors border border-[#2D88FF]/30 group no-underline">
                                <div className="w-6 h-6 rounded-full bg-[#45BD62] flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <i className="fas fa-phone text-white text-xs"></i>
                                </div>
                                <span className="text-[#2D88FF] font-bold text-sm">Call Now</span>
                            </a>
                        </div>

                        <h1 className="text-2xl font-bold text-[#E4E6EB] mb-2 leading-snug">{product.title}</h1>
                        
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-[#F02849] font-bold text-3xl">{symbol}{hasDiscount ? product.discountPrice?.toFixed(2) : product.mainPrice.toFixed(2)}</span>
                            {hasDiscount && <span className="text-[#B0B3B8] text-lg line-through mb-1">{symbol}{product.mainPrice.toFixed(2)}</span>}
                            {hasDiscount && <span className="bg-[#F02849]/20 text-[#F02849] text-xs font-bold px-2 py-1 rounded mb-1.5">-{Math.round(((product.mainPrice - product.discountPrice!) / product.mainPrice) * 100)}%</span>}
                        </div>

                        <div className="bg-[#3A3B3C] rounded-lg p-3 mb-4 flex items-center gap-3">
                             <div className="w-10 h-10 bg-[#242526] rounded-full flex items-center justify-center text-xl">{country?.flag}</div>
                             <div>
                                 <p className="text-[#E4E6EB] font-semibold text-sm">Location</p>
                                 <p className="text-[#B0B3B8] text-sm">{product.address}, {country?.name}</p>
                             </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-[#E4E6EB] font-bold text-lg mb-2">Description</h3>
                            <p className="text-[#B0B3B8] text-[15px] leading-relaxed whitespace-pre-wrap">{product.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-[#18191A] p-3 rounded-lg border border-[#3E4042]">
                                <span className="block text-[#B0B3B8] text-xs">Category</span>
                                <span className="block text-[#E4E6EB] font-semibold">{MARKETPLACE_CATEGORIES.find(c => c.id === product.category)?.name}</span>
                            </div>
                            <div className="bg-[#18191A] p-3 rounded-lg border border-[#3E4042]">
                                <span className="block text-[#B0B3B8] text-xs">Stock</span>
                                <span className="block text-[#E4E6EB] font-semibold">{product.quantity} available</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-[#3E4042] bg-[#242526] flex flex-col gap-3">
                        {showPhone ? (
                            <div className="flex flex-col gap-2 animate-fade-in">
                                <div className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <i className="fas fa-phone-alt text-[#45BD62] text-xl"></i>
                                        <div>
                                            <p className="text-[#B0B3B8] text-xs">Seller Number</p>
                                            <p className="text-[#E4E6EB] font-bold text-lg">{product.phoneNumber}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { 
                                            try {
                                                navigator.clipboard.writeText(product.phoneNumber); 
                                                alert("Number copied!"); 
                                            } catch (e) {
                                                alert("Could not copy automatically. Please copy manually.");
                                            }
                                        }} 
                                        className="text-[#1877F2] font-semibold text-sm hover:underline"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <a href={`tel:${product.phoneNumber}`} className="w-full bg-[#45BD62] hover:bg-[#3AA855] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 no-underline">
                                    <i className="fas fa-phone"></i> Call Now
                                </a>
                            </div>
                        ) : (
                            <button onClick={() => setShowPhone(true)} className="w-full bg-[#45BD62] hover:bg-[#3AA855] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <i className="fas fa-phone-alt"></i> Call Seller
                            </button>
                        )}
                        
                        <div className="flex gap-3">
                            <button onClick={() => onMessage(product.sellerId)} className="flex-1 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <i className="fab fa-facebook-messenger"></i> Message
                            </button>
                            <button className="flex-1 bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#E4E6EB] font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <i className="fas fa-share"></i> Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface MarketplacePageProps {
    currentUser: User | null;
    products: Product[];
    onNavigateHome: () => void;
    onCreateProduct: (productData: Partial<Product>) => void;
    onViewProduct: (product: Product) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ currentUser, products, onNavigateHome, onCreateProduct, onViewProduct }) => {
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSellModal, setShowSellModal] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [desc, setDesc] = useState('');
    const [country, setCountry] = useState('US');
    const [address, setAddress] = useState('');
    const [mainPrice, setMainPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [phone, setPhone] = useState('');
    const [images, setImages] = useState<{id: number, data: string}[]>([]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentUser) {
            const userCode = MARKETPLACE_COUNTRIES.find(c => currentUser.nationality?.includes(c.name))?.code || 'US';
            setCountry(userCode);
            setPhone(currentUser.phone || '');
        }
    }, [currentUser]);

    const handleSellClick = () => {
        if (!currentUser) {
            alert("Please log in to sell products.");
            return;
        }
        setShowSellModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            if (images.length + e.target.files.length > 4) {
                alert("Maximum 4 images allowed");
                return;
            }
            Array.from(e.target.files).forEach((file: any) => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (ev.target?.result) {
                        setImages(prev => [...prev, { id: Date.now() + Math.random(), data: ev.target!.result as string }]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (id: number) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !category || !desc || !country || !address || !mainPrice || !quantity || !phone || images.length === 0) {
            alert("Please fill all required fields and upload at least one image.");
            return;
        }

        const newProduct: Partial<Product> = {
            title,
            category,
            description: desc,
            country,
            address,
            mainPrice: parseFloat(mainPrice),
            discountPrice: discountPrice ? parseFloat(discountPrice) : null,
            quantity: parseInt(quantity),
            phoneNumber: phone,
            images: images.map(i => i.data),
            status: 'active',
            views: 0,
            ratings: [], 
            comments: []
        };

        onCreateProduct(newProduct);
        setShowSellModal(false);
        setTitle(''); setCategory(''); setDesc(''); setMainPrice(''); setDiscountPrice(''); setImages([]);
    };

    const getCurrencySymbol = (code: string) => {
        const c = MARKETPLACE_COUNTRIES.find(x => x.code === code);
        return c ? c.symbol : '$';
    };

    const filteredProducts = products.filter(p => {
        if (selectedCountry !== 'all' && p.country !== selectedCountry) return false;
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const activeCountry = MARKETPLACE_COUNTRIES.find(c => c.code === selectedCountry) || MARKETPLACE_COUNTRIES[0];

    // Helper to generate stars
    const renderStars = (ratingList: number[]) => {
        const avg = ratingList.length > 0 ? ratingList.reduce((a,b) => a+b,0) / ratingList.length : 4.5; // Default mock rating
        return avg.toFixed(1);
    };

    return (
        <div className="min-h-screen bg-[#18191A] font-sans pb-20">
            {/* Header */}
            <div className="bg-[#242526] sticky top-0 z-50 px-4 py-2 flex items-center justify-between shadow-sm border-b border-[#3E4042]">
                <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
                    <i className="fas fa-arrow-left text-[#E4E6EB] text-xl"></i>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-[#1877F2] to-[#1D8AF2] text-transparent bg-clip-text">Marketplace</h1>
                </div>
                <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1 cursor-pointer" onClick={() => setSelectedCountry(selectedCountry === 'all' ? 'US' : 'all')}>
                        <span className="text-lg">{activeCountry.flag}</span>
                        <i className="fas fa-chevron-down text-[#B0B3B8] text-xs"></i>
                    </div>
                    <button onClick={handleSellClick} className="flex items-center gap-1 px-3 py-1.5 bg-[#45BD62] hover:bg-[#3AA855] text-white rounded-full font-bold text-sm transition-colors shadow-sm">
                        <i className="fas fa-plus text-xs"></i> Sell
                    </button>
                </div>
            </div>

            {/* Search & Categories */}
            <div className="sticky top-[53px] z-40 bg-[#18191A] pt-2 pb-2">
                <div className="px-4 mb-3">
                    <div className="bg-[#242526] rounded-full flex items-center px-4 py-2.5 border border-[#3E4042] shadow-sm">
                        <i className="fas fa-search text-[#B0B3B8] text-lg mr-3"></i>
                        <input 
                            type="text" 
                            placeholder="Search for clothes, gadgets..." 
                            className="bg-transparent text-[#E4E6EB] outline-none flex-1 text-[15px] placeholder-[#B0B3B8]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Horizontal Scroll Categories */}
                <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
                    {MARKETPLACE_CATEGORIES.map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-1.5 rounded-full font-medium whitespace-nowrap text-sm transition-colors border ${
                                selectedCategory === cat.id 
                                ? 'bg-[#E4E6EB] text-black border-[#E4E6EB]' 
                                : 'bg-[#242526] text-[#B0B3B8] border-[#3E4042]'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-3">
                {/* Hero / Deals Banner (AliExpress Style) */}
                <div className="bg-gradient-to-r from-[#FF4747] to-[#FF8E53] rounded-xl p-4 mb-4 text-white shadow-lg relative overflow-hidden flex items-center justify-between min-h-[100px]">
                    <div className="z-10">
                        <span className="bg-[#FFD100] text-black text-[10px] font-bold px-1.5 py-0.5 rounded mb-1 inline-block">PLUS DEALS</span>
                        <h2 className="text-xl font-bold leading-tight">Super<br/>Value Deals</h2>
                    </div>
                    <div className="flex items-end gap-2 z-10">
                         <div className="bg-white p-1 rounded-lg shadow-sm w-16 h-16 flex items-center justify-center">
                             <i className="fas fa-headset text-2xl text-[#FF4747]"></i>
                         </div>
                         <div className="bg-white p-1 rounded-lg shadow-sm w-16 h-16 flex items-center justify-center">
                             <i className="fas fa-tshirt text-2xl text-[#FF8E53]"></i>
                         </div>
                    </div>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>

                {/* Product Grid - 2 Column Mobile */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {filteredProducts.map(product => {
                            const pCountry = MARKETPLACE_COUNTRIES.find(c => c.code === product.country);
                            const symbol = pCountry ? pCountry.symbol : '$';
                            const hasDiscount = !!product.discountPrice;
                            const priceToDisplay = hasDiscount ? product.discountPrice : product.mainPrice;
                            const originalPrice = product.mainPrice;
                            // Mock Data for aesthetics
                            const soldCount = Math.floor(Math.random() * 500) + 10; 
                            const rating = renderStars(product.ratings || []);

                            return (
                                <div key={product.id} className="bg-[#242526] rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative pb-2" onClick={() => onViewProduct(product)}>
                                    
                                    {/* Image Container */}
                                    <div className="relative aspect-square bg-white">
                                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                        
                                        {/* Choice Badge (AliExpress Style) */}
                                        <div className="absolute top-0 left-0 bg-[#FFD100] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg z-10 shadow-sm flex items-center gap-1">
                                            <span>Choice</span>
                                        </div>

                                        {hasDiscount && (
                                             <div className="absolute bottom-0 left-0 bg-[#F02849] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tr-lg">
                                                -{Math.round(((originalPrice - priceToDisplay!) / originalPrice) * 100)}%
                                             </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="px-2 pt-2">
                                        {/* Title */}
                                        <h3 className="text-[#E4E6EB] text-[16px] leading-tight line-clamp-2 h-[42px] mb-1 font-normal opacity-90">{product.title}</h3>
                                        
                                        {/* Rating & Sold */}
                                        <div className="flex items-center gap-1 mb-1.5">
                                            <i className="fas fa-star text-[#FFD100] text-[10px]"></i>
                                            <span className="text-[13px] text-[#E4E6EB] font-bold">{rating}</span>
                                            <span className="text-[12px] text-[#B0B3B8]">• {soldCount} sold</span>
                                        </div>

                                        {/* Price Section */}
                                        <div className="flex items-baseline gap-1.5 mb-1">
                                            <span className="text-[#F02849] font-bold text-[20px] leading-none">{symbol}{priceToDisplay!.toFixed(2)}</span>
                                            {hasDiscount && <span className="text-[#B0B3B8] text-[13px] line-through">{symbol}{originalPrice.toFixed(2)}</span>}
                                        </div>

                                        {/* Marketing Label */}
                                        <div className="flex flex-wrap gap-1">
                                            <span className="bg-[#F02849] text-white text-[9px] px-1 py-0.5 rounded font-bold uppercase tracking-wide">Welcome deal</span>
                                            <span className="bg-[#3A3B3C] text-[#B0B3B8] text-[9px] px-1 py-0.5 rounded border border-[#3E4042]">Free shipping</span>
                                        </div>
                                    </div>

                                    {/* Quick Cart Button */}
                                    <div className="absolute bottom-2 right-2 w-7 h-7 bg-[#3A3B3C] rounded-full flex items-center justify-center border border-[#3E4042] shadow-sm hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors">
                                        <i className="fas fa-cart-plus text-xs"></i>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 bg-[#242526] rounded-full flex items-center justify-center mb-4 border border-[#3E4042]">
                             <i className="fas fa-search text-3xl text-[#3E4042]"></i>
                        </div>
                        <h3 className="text-[#E4E6EB] font-bold text-lg mb-1">No products found</h3>
                        <p className="text-[#B0B3B8] text-sm mb-4">Try searching for something else.</p>
                        <button onClick={handleSellClick} className="px-6 py-2 bg-[#45BD62] hover:bg-[#3AA855] text-white rounded-full font-bold text-sm shadow-lg transition-transform active:scale-95">
                            Start Selling
                        </button>
                    </div>
                )}
            </div>

            {/* Sell Modal */}
            {showSellModal && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-[#242526] w-full max-w-[600px] rounded-xl border border-[#3E4042] flex flex-col max-h-[90vh] shadow-2xl">
                        <div className="p-4 border-b border-[#3E4042] flex justify-between items-center">
                            <h2 className="text-xl font-bold text-[#E4E6EB]">Sell a Product</h2>
                            <button onClick={() => setShowSellModal(false)} className="w-8 h-8 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] flex items-center justify-center">
                                <i className="fas fa-times text-[#B0B3B8]"></i>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4">
                            <div>
                                <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Title <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-[#E4E6EB] outline-none focus:border-[#1877F2]" placeholder="What are you selling?" value={title} onChange={e => setTitle(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Category <span className="text-red-500">*</span></label>
                                <select className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={category} onChange={e => setCategory(e.target.value)}>
                                    <option value="">Select Category</option>
                                    {MARKETPLACE_CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Description <span className="text-red-500">*</span></label>
                                <textarea className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-[#E4E6EB] outline-none focus:border-[#1877F2] h-24 resize-none" placeholder="Describe your product..." value={desc} onChange={e => setDesc(e.target.value)}></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Country <span className="text-red-500">*</span></label>
                                    <select className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={country} onChange={e => setCountry(e.target.value)}>
                                        {MARKETPLACE_COUNTRIES.filter(c => c.code !== 'all').map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">City/Address <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-[#E4E6EB] outline-none focus:border-[#1877F2]" placeholder="Location" value={address} onChange={e => setAddress(e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Price ({getCurrencySymbol(country)}) <span className="text-red-500">*</span></label>
                                    <input type="number" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-[#E4E6EB] outline-none focus:border-[#1877F2]" placeholder="0.00" value={mainPrice} onChange={e => setMainPrice(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Discount Price (Opt)</label>
                                    <input type="number" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-[#E4E6EB] outline-none focus:border-[#1877F2]" placeholder="0.00" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Quantity <span className="text-red-500">*</span></label>
                                    <input type="number" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-[#E4E6EB] outline-none focus:border-[#1877F2]" value={quantity} onChange={e => setQuantity(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-[#E4E6EB] font-semibold mb-1 text-sm">Phone <span className="text-red-500">*</span></label>
                                    <input type="tel" className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-lg p-3 text-[#E4E6EB] outline-none focus:border-[#1877F2]" placeholder="+123..." value={phone} onChange={e => setPhone(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[#E4E6EB] font-semibold mb-2 text-sm">Images (Max 4) <span className="text-red-500">*</span></label>
                                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#3E4042] bg-[#18191A] hover:bg-[#242526] rounded-xl p-6 text-center cursor-pointer transition-colors group">
                                    <i className="fas fa-cloud-upload-alt text-4xl text-[#1877F2] mb-2 group-hover:scale-110 transition-transform"></i>
                                    <p className="text-[#B0B3B8] text-sm">Click to upload images</p>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                                {images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mt-4">
                                        {images.map(img => (
                                            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-[#3E4042]">
                                                <img src={img.data} alt="" className="w-full h-full object-cover" />
                                                <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500"><i className="fas fa-times"></i></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button onClick={handleSubmit} className="w-full bg-[#45BD62] hover:bg-[#3AA855] text-white py-3 rounded-lg font-bold shadow-lg transition-colors">
                                List Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};