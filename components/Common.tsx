
import React from 'react';

export const Spinner = () => (
    <div className="fixed inset-0 flex flex-col items-center bg-[#18191A] z-[9999]">
        {/* Main Content Centered vertically */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="flex flex-col items-center animate-fade-in -mt-20">
                <div className="flex items-center justify-center gap-4 mb-8">
                    <i className="fas fa-globe-americas text-[#1877F2] text-[68px] animate-[spin_10s_linear_infinite] drop-shadow-[0_0_25px_rgba(24,119,242,0.4)]"></i>
                    <h1 className="text-[54px] font-bold text-[#1877F2] tracking-tighter font-sans">UNERA</h1>
                </div>
                <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-[#3A3B3C] border-t-[#1877F2]"></div>
            </div>
        </div>
        
        {/* Footer fixed at bottom with padding for mobile visibility */}
        <div className="pb-12 flex flex-col items-center animate-slide-up w-full">
            <p className="text-[#B0B3B8] text-[13px] mb-2 font-normal tracking-widest opacity-80">from</p>
            <div className="flex items-center gap-2.5">
                <i className="fas fa-globe-americas text-[#1877F2] text-[22px]"></i> 
                <p className="text-[#E4E6EB] font-bold text-[17px] tracking-wide font-sans">UNERA (T) Company Ltd</p>
            </div>
        </div>
    </div>
);

interface ImageViewerProps {
    image: string;
    onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ image, onClose }) => {
    return (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#3A3B3C]/50 hover:bg-[#4E4F50] rounded-full flex items-center justify-center cursor-pointer transition-colors" onClick={onClose}>
                <i className="fas fa-times text-[#E4E6EB] text-xl"></i>
            </div>
            <img src={image} alt="Full screen" className="max-w-full max-h-screen object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
    );
};
