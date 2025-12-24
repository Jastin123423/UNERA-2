import React, { useState, useRef } from 'react';
import { User, Product } from '../types';
import { MARKETPLACE_CATEGORIES, MARKETPLACE_COUNTRIES } from '../constants';

// --- CREATE PRODUCT MODAL ---
interface CreateProductModalProps {
    currentUser: User;
    onClose: () => void;
    onCreate: (product: Product) => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ currentUser, onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState(currentUser.phone || '');
    const [quantity, setQuantity] = useState('1');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) setImagePreview(ev.target.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        // Validate required fields
        if (!title.trim() || !price.trim() || !category || !imagePreview || !country || !address.trim()) {
            alert("Please fill in all required fields: title, price, category, image, country, and address.");
            return;
        }

        // Validate price is a positive number
        const priceValue = parseFloat(price);
        if (isNaN(priceValue) || priceValue <= 0) {
            alert("Please enter a valid price (positive number).");
            return;
        }

        setIsSubmitting(true);

        const newProduct: Product = {
            id: Date.now(),
            title: title.trim(),
            category,
            description: description.trim(),
            country,
            address: address.trim(),
            mainPrice: priceValue,
            quantity: parseInt(quantity) || 1,
            phoneNumber: phone.trim(),
            images: [imagePreview],
            sellerId: currentUser.id,
            sellerName: currentUser.name,
            sellerAvatar: currentUser.profileImage,
            date: Date.now(),
            status: 'active',
            shareId: `prod_${Date.now()}`,
            views: 0,
            ratings: [],
            comments: []
        };

        onCreate(newProduct);
        onClose();
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 animate-fade-in font-sans backdrop-blur-sm">
            <div className="bg-[#242526] w-full max-w-[600px] rounded-2xl border border-[#3E4042] shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
                <div className="p-4 border-b border-[#3E4042] flex justify-between items-center bg-[#242526] rounded-t-2xl">
                    <h2 className="text-xl font-black text-[#E4E6EB] tracking-tight">Sell Item</h2>
                    <div onClick={onClose} className="w-9 h-9 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] flex items-center justify-center cursor-pointer transition-colors">
                        <i className="fas fa-times text-[#B0B3B8]"></i>
                    </div>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-5">
                    <div 
                        className="w-full h-52 bg-[#3A3B3C] rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-[#4E4F50] hover:border-[#1877F2] hover:bg-[#404142] transition-all overflow-hidden relative shadow-inner group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imagePreview ? (
                            <div className="relative w-full h-full">
                                <img src={imagePreview} className="w-full h-full object-contain" alt="Preview" />
                                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-opacity">
                                    <i className="fas fa-camera text-white text-3xl"></i>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-14 h-14 bg-[#242526] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-images text-2xl text-[#1877F2]"></i>
                                </div>
                                <span className="text-[#E4E6EB] text-sm font-bold">Add Photo</span>
                                <span className="text-[#B0B3B8] text-[11px] mt-1">Photos sell items faster</span>
                            </>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">Title *</label>
                            <input 
                                type="text" 
                                className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] transition-all" 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                placeholder="What are you selling?" 
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">Price *</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] transition-all" 
                                    value={price} 
                                    onChange={e => setPrice(e.target.value)} 
                                    placeholder="0.00" 
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">Category *</label>
                                <select 
                                    className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] transition-all appearance-none" 
                                    value={category} 
                                    onChange={e => setCategory(e.target.value)}
                                    disabled={isSubmitting}
                                >
                                    <option value="" disabled>Select Category</option>
                                    {MARKETPLACE_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">Country *</label>
                            <select 
                                className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] transition-all appearance-none" 
                                value={country} 
                                onChange={e => setCountry(e.target.value)}
                                disabled={isSubmitting}
                            >
                                <option value="" disabled>Select Country</option>
                                {MARKETPLACE_COUNTRIES.filter(c => c.code !== 'all').map(c => (
                                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">City / Address *</label>
                            <input 
                                type="text" 
                                className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] transition-all" 
                                value={address} 
                                onChange={e => setAddress(e.target.value)} 
                                placeholder="e.g. Arusha" 
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">Description</label>
                        <textarea 
                            className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] h-24 resize-none transition-all" 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            placeholder="Describe your item..." 
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">Phone Number</label>
                            <input 
                                type="tel" 
                                className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] transition-all" 
                                value={phone} 
                                onChange={e => setPhone(e.target.value)} 
                                placeholder="+255..." 
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className="block text-[#B0B3B8] font-bold mb-1.5 text-xs uppercase tracking-widest">Quantity</label>
                            <input 
                                type="number" 
                                className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-xl p-3.5 text-[#E4E6EB] outline-none focus:border-[#1877F2] transition-all" 
                                value={quantity} 
                                onChange={e => setQuantity(e.target.value)} 
                                min="1" 
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || !title.trim() || !price.trim() || !category || !imagePreview || !country || !address.trim()}
                        className="w-full bg-[#1877F2] hover:bg-[#166FE5] disabled:bg-[#3A3B3C] disabled:cursor-not-allowed text-white py-4 rounded-xl font-black shadow-lg transition-all text-lg active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Creating Listing...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-plus"></i>
                                Post Listing
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

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
                            <button 
                                onClick={() => {
                                    if (!currentUser) {
                                        alert('Please login to message sellers');
                                        return;
                                    }
                                    onMessage(product.sellerId);
                                }} 
                                className="flex-1 bg-[#1877F2] hover:bg-[#166FE5] text-white font-black py-4 rounded-xl transition-all shadow-lg text-sm"
                            >
                                <i className="fab fa-facebook-messenger mr-2"></i> Message
                            </button>
                            <a 
                                href={`tel:${product.phoneNumber}`} 
                                className="flex-1 bg-[#45BD62] hover:bg-[#3CAE58] text-white font-black py-4 rounded-xl text-center text-sm no-underline shadow-lg transition-all flex items-center justify-center"
                            >
                                <i className="fas fa-phone-alt mr-2"></i> Call
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MARKETPLACE PAGE ---
interface MarketplacePageProps {
    currentUser: User | null;
    products: Product[];
    onNavigateHome: () => void;
    onCreateProduct: (product: Product) => void;
    onViewProduct: (product: Product) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({ 
    currentUser, 
    products, 
    onNavigateHome, 
    onCreateProduct, 
    onViewProduct 
}) => {
    const [selectedCountry, setSelectedCountry] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSellModal, setShowSellModal] = useState(false);
    
    const filteredProducts = products.filter((product) => {
        if (selectedCountry !== 'all' && product.country !== selectedCountry) return false;
        if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
        if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const handleCreateProduct = (product: Product) => {
        onCreateProduct(product);
        setShowSellModal(false);
    };

    return (
        <>
            <div className="min-h-screen bg-[#18191A] font-sans pb-20">
                <div className="bg-[#242526] sticky top-0 z-50 px-4 py-2 flex items-center justify-between shadow-sm border-b border-[#3E4042]">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateHome}>
                        <i className="fas fa-arrow-left text-[#E4E6EB] text-xl"></i>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-[#1877F2] to-[#1D8AF2] text-transparent bg-clip-text">Marketplace</h1>
                    </div>
                    {currentUser ? (
                        <button 
                            onClick={() => setShowSellModal(true)} 
                            className="px-4 py-2 bg-[#45BD62] hover:bg-[#3CAE58] text-white rounded-full font-bold text-sm transition-all"
                        >
                            <i className="fas fa-plus mr-2"></i>Sell
                        </button>
                    ) : (
                        <button 
                            onClick={() => alert('Please login to sell items')}
                            className="px-4 py-2 bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#B0B3B8] rounded-full font-bold text-sm transition-all"
                        >
                            <i className="fas fa-lock mr-2"></i>Sell
                        </button>
                    )}
                </div>

                <div className="p-4">
                    {/* Search Bar */}
                    <div className="bg-[#242526] rounded-full flex items-center px-4 py-2.5 border border-[#3E4042] mb-6">
                        <i className="fas fa-search text-[#B0B3B8] mr-3"></i>
                        <input 
                            type="text" 
                            placeholder="Search Marketplace" 
                            className="bg-transparent text-[#E4E6EB] outline-none flex-1 text-sm placeholder-[#8A8D91]" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
                        <select 
                            className="bg-[#242526] text-[#E4E6EB] border border-[#3E4042] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1877F2] transition-all"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                        >
                            <option value="all">All Countries</option>
                            {MARKETPLACE_COUNTRIES.filter(c => c.code !== 'all').map(country => (
                                <option key={country.code} value={country.code}>
                                    {country.flag} {country.name}
                                </option>
                            ))}
                        </select>
                        <select 
                            className="bg-[#242526] text-[#E4E6EB] border border-[#3E4042] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1877F2] transition-all"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {MARKETPLACE_CATEGORIES.filter(c => c.id !== 'all').map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16 bg-[#242526] rounded-xl border border-[#3E4042]">
                            <i className="fas fa-search text-4xl text-[#8A8D91] mb-4"></i>
                            <h3 className="text-[#E4E6EB] text-lg font-bold mb-2">No products found</h3>
                            <p className="text-[#8A8D91] text-sm mb-6">
                                {searchQuery ? `No results for "${searchQuery}"` : 'Try changing your filters'}
                            </p>
                            {currentUser && (
                                <button 
                                    onClick={() => setShowSellModal(true)} 
                                    className="px-6 py-3 bg-[#45BD62] hover:bg-[#3CAE58] text-white rounded-full font-bold text-sm transition-all"
                                >
                                    <i className="fas fa-plus mr-2"></i>Sell First Item
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map((product) => (
                                <div 
                                    key={product.id} 
                                    className="bg-[#242526] rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-[#3E4042] hover:border-[#1877F2]/30"
                                    onClick={() => onViewProduct(product)}
                                >
                                    <div className="aspect-square bg-white overflow-hidden">
                                        <img 
                                            src={product.images[0]} 
                                            alt={product.title} 
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-[#E4E6EB] text-sm font-bold truncate mb-1">{product.title}</h3>
                                        <div className="text-[#F02849] font-bold text-lg">
                                            {MARKETPLACE_COUNTRIES.find(c => c.code === product.country)?.symbol || '$'}{product.mainPrice.toLocaleString()}
                                        </div>
                                        <div className="text-[#B0B3B8] text-[10px] mt-1 truncate flex items-center gap-1">
                                            <i className="fas fa-map-marker-alt"></i>
                                            {product.address}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Product Modal */}
            {showSellModal && currentUser && (
                <CreateProductModal 
                    currentUser={currentUser}
                    onClose={() => setShowSellModal(false)}
                    onCreate={handleCreateProduct}
                />
            )}
        </>
    );
};
