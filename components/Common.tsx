
import React, { useEffect } from 'react';

export const Spinner = () => (
    <div className="flex flex-col items-center justify-between min-h-screen w-full bg-[#18191A] py-12 relative z-[9999]">
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center mb-10 animate-fade-in">
                <i className="fas fa-globe-americas text-[#1877F2] text-[70px] mb-4 animate-[spin_8s_linear_infinite] drop-shadow-[0_0_10px_rgba(24,119,242,0.4)]"></i>
                <h1 className="text-[40px] font-bold bg-gradient-to-r from-[#1877F2] to-[#1D8AF2] text-transparent bg-clip-text tracking-tight">UNERA</h1>
            </div>
            <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3A3B3C] border-t-[#1877F2]"></div>
            </div>
        </div>
        
        <div className="flex flex-col items-center animate-slide-up">
            <p className="text-[#B0B3B8] text-xs mb-1 font-medium">from</p>
            <p className="text-[#E4E6EB] font-bold text-sm tracking-widest flex items-center gap-2 uppercase">
                <i className="fas fa-globe-americas text-[#1877F2] text-xs"></i> 
                UNERA (T) Company Limited
            </p>
        </div>
    </div>
);

interface ImageViewerProps {
    imageUrl: string;
    onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="absolute top-4 right-4 w-10 h-10 bg-[#3A3B3C] hover:bg-[#4E4F50] rounded-full flex items-center justify-center cursor-pointer transition-colors z-50" onClick={onClose}>
                <i className="fas fa-times text-[#E4E6EB] text-xl"></i>
            </div>
            <img src={imageUrl} alt="Full screen" className="max-w-full max-h-screen object-contain shadow-2xl cursor-default" onClick={(e) => e.stopPropagation()} />
        </div>
    );
};
