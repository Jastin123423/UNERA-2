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
    
    const country = MARKETPLACE_COUNTRIES.find(c => c.code === product.country);
    const symbol = country ? country.symbol : '$';
    const hasDiscount = !!product.discountPrice;

    return (
        <div className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-0 md:p-4 animate-fade-in font-sans">
            <div className="bg-[#242526] w-full max-w-[1100px] md:rounded-2xl overflow-hidden flex flex-col md:flex-row h-full md:h-[90vh] relative shadow-2xl border border-[#3E4042]">
                <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-all shadow-xl">
                    <i className="fas fa-times text-xl"></i>
                </button>

                {/* Content Area - Scrollable on mobile */}
                <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden">
                    
                    {/* Left: Image Gallery */}
                    <div className="w-full md:w-[60%] bg-black flex flex-col relative flex-shrink-0">
                        <div className="aspect-square md:flex-1 relative flex items-center justify-center bg-[#18191A] overflow-hidden">
                            <img src={product.images[activeImageIndex]} alt={product.title} className="max-w-full max-h-full object-contain" />
                            
                            {product.images.length > 1 && (
                                <>
                                    <button 
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 rounded-full text-white flex items-center justify-center"
                                        onClick={() => setActiveImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                                    >
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <button 
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 rounded-full text-white flex items-center justify-center"
                                        onClick={() => setActiveImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="h-20 bg-[#242526] flex items-center gap-2 px-4 overflow-x-auto border-t border-[#3E4042] scrollbar-hide flex-shrink-0">
                                {product.images.map((img, idx) => (
                                    <img 
                                        key={idx} 
                                        src={img} 
                                        className={`h-14 min-w-[56px] object-cover rounded-lg cursor-pointer border-2 transition-all ${activeImageIndex === idx ? 'border-[#1877F2]' : 'border-transparent'}`}
                                        onClick={() => setActiveImageIndex(idx)}
                                        alt="thumb"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="w-full md:w-[40%] flex flex-col bg-[#242526] md:border-l border-[#3E4042]">
                        <div className="p-5 md:p-8 space-y-6 md:overflow-y-auto md:flex-1 scrollbar-hide">
                            <div>
                                <div className="text-[#1877F2] font-black text-xs uppercase tracking-widest mb-1">
                                    {MARKETPLACE_CATEGORIES.find(c => c.id === product.category)?.name}
                                </div>
                                <h1 className="text-xl md:text-2xl font-black text-[#E4E6EB] leading-tight">{product.title}</h1>
                            </div>
                            
                            <div className="flex items-baseline gap-2">
                                <span className="text-[#F02849] font-black text-3xl">{symbol}{hasDiscount ? product.discountPrice?.toFixed(2) : product.mainPrice.toFixed(2)}</span>
                                {hasDiscount && <span className="text-[#B0B3B8] text-sm line-through">{symbol}{product.mainPrice.toFixed(2)}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-[#18191A] p-4 rounded-xl border border-[#3E4042]">
                                <div>
                                    <p className="text-[#B0B3B8] text-[10px] font-bold uppercase mb-1">Location</p>
                                    <p className="text-white text-sm font-bold truncate"><i className="fas fa-map-marker-alt text-[#F02849] mr-1"></i> {product.address}</p>
                                </div>
                                <div>
                                    <p className="text-[#B0B3B8] text-[10px] font-bold uppercase mb-1">Stock</p>
                                    <p className="text-white text-sm font-bold">{product.quantity} items</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[#E4E6EB] font-black text-base border-b border-[#3E4042] pb-2 mb-3 uppercase tracking-wider">Description</h3>
                                <p className="text-[#D1D3D7] text-[16px] leading-relaxed whitespace-pre-wrap font-medium">{product.description}</p>
                            </div>
                            
                            <div className="bg-[#18191A] p-4 rounded-xl border border-[#3E4042] flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                     <img src={product.sellerAvatar} alt="Seller" className="w-12 h-12 rounded-full object-cover" />
                                     <div>
                                         <h4 className="text-[#E4E6EB] font-black text-sm">{product.sellerName}</h4>
                                         <p className="text-[#B0B3B8] text-xs">Seller Profile</p>
                                     </div>
                                 </div>
                                 <i className="fas fa-chevron-right text-[#B0B3B8] text-xs"></i>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-5 border-t border-[#3E4042] bg-[#242526] flex gap-3 flex-shrink-0 sticky bottom-0">
                            <button onClick={() => onMessage(product.sellerId)} className="flex-1 bg-[#1877F2] text-white font-black py-4 rounded-xl transition-all shadow-lg text-sm">
                                <i className="fab fa-facebook-messenger mr-2"></i> Message
                            </button>
                            <a href={`tel:${product.phoneNumber}`} className="flex-1 bg-[#45BD62] text-white font-black py-4 rounded-xl text-center text-sm no-underline shadow-lg">
                                <i className="fas fa-phone-alt mr-2"></i> Call
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ... (Rest of MarketplacePage component preserved as-is)
export const MarketplacePage: React.FC<any> = ({ currentUser, products, onNavigateHome, onCreateProduct, onViewProduct }) => {
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSellModal, setShowSellModal] = useState(false);
    
    const filteredProducts = products.filter((p: Product) => {
        if (selectedCountry !== 'all' && p.country !== selectedCountry) return false;
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-[#18191A] font-sans pb-20">
            <div className="bg-[#242526] sticky top-0 z-50 px-4 py-2 flex items-center justify-between shadow-sm border-b border-[#3E4042]">
                <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
                    <i className="fas fa-arrow-left text-[#E4E6EB] text-xl"></i>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-[#1877F2] to-[#1D8AF2] text-transparent bg-clip-text">Marketplace</h1>
                </div>
                <button onClick={() => setShowSellModal(true)} className="px-4 py-2 bg-[#45BD62] text-white rounded-full font-bold text-sm">Sell</button>
            </div>

            <div className="p-4">
                <div className="bg-[#242526] rounded-full flex items-center px-4 py-2.5 border border-[#3E4042] mb-6">
                    <i className="fas fa-search text-[#B0B3B8] mr-3"></i>
                    <input type="text" placeholder="Search Marketplace" className="bg-transparent text-[#E4E6EB] outline-none flex-1 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredProducts.map((product: Product) => (
                        <div key={product.id} className="bg-[#242526] rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-[#3E4042]" onClick={() => onViewProduct(product)}>
                            <div className="aspect-square bg-white">
                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-3">
                                <h3 className="text-[#E4E6EB] text-sm font-bold truncate mb-1">{product.title}</h3>
                                <div className="text-[#F02849] font-bold">{MARKETPLACE_COUNTRIES.find(c => c.code === product.country)?.symbol || '$'}{product.mainPrice.toLocaleString()}</div>
                                <div className="text-[#B0B3B8] text-[10px] mt-1 truncate">{product.address}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
