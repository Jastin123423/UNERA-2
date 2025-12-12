
import React, { useState, useEffect, useRef } from 'react';
import { User, Message } from '../types';

interface ChatWindowProps {
    currentUser: User;
    recipient: User;
    messages: Message[];
    onClose: () => void;
    onSendMessage: (text: string) => void;
    isFullScreen?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, recipient, messages, onClose, onSendMessage, isFullScreen = false }) => {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
    useEffect(() => { scrollToBottom(); }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText('');
        }
    };

    const containerClasses = isFullScreen 
        ? "fixed inset-0 z-[200] bg-[#242526] flex flex-col font-sans"
        : "fixed bottom-0 right-4 w-[328px] h-[455px] bg-[#242526] rounded-t-lg shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex flex-col z-50 border border-[#3E4042] font-sans";

    return (
        <div className={containerClasses}>
            {/* Header */}
            <div className={`flex items-center justify-between px-3 py-2 border-b border-[#3E4042] shadow-sm ${isFullScreen ? 'h-14' : 'rounded-t-lg cursor-pointer hover:bg-[#3A3B3C]'}`}>
                <div className="flex items-center gap-3">
                    {isFullScreen && <i className="fas fa-arrow-left text-[#E4E6EB] text-xl cursor-pointer mr-2" onClick={onClose}></i>}
                    <div className="relative">
                        <img src={recipient.profileImage} alt={recipient.name} className={`${isFullScreen ? 'w-10 h-10' : 'w-8 h-8'} rounded-full object-cover`} />
                        {recipient.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#31A24C] rounded-full border-2 border-[#242526]"></div>}
                    </div>
                    <div>
                        <h4 className="font-semibold text-[15px] text-[#E4E6EB] leading-tight">{recipient.name}</h4>
                        <span className="text-[12px] text-[#B0B3B8] block leading-tight">Active now</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[#1877F2]">
                    <i className="fas fa-phone-alt cursor-pointer text-xl"></i>
                    <i className="fas fa-video cursor-pointer text-xl"></i>
                    {!isFullScreen && <i className="fas fa-times p-1.5 hover:bg-[#3A3B3C] rounded-full" onClick={(e) => { e.stopPropagation(); onClose(); }}></i>}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 bg-[#18191A]">
                <div className="flex flex-col items-center py-6 text-center">
                    <img src={recipient.profileImage} className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-[#3E4042]" alt=""/>
                    <h3 className="text-[#E4E6EB] font-bold text-lg">{recipient.name}</h3>
                    <p className="text-[#B0B3B8] text-sm">You're friends on UNERA</p>
                </div>
                
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1 group`}>
                            {!isMe && <img src={recipient.profileImage} className="w-7 h-7 rounded-full object-cover mr-2 self-end" alt="" />}
                            <div className={`max-w-[70%] px-3 py-2 rounded-[18px] text-[15px] relative ${isMe ? 'bg-[#0084FF] text-white' : 'bg-[#3A3B3C] text-[#E4E6EB]'}`}>
                                {msg.text}
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Footer Input */}
            <div className="p-3 border-t border-[#3E4042] bg-[#242526]">
                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                    <div className="flex gap-2 mb-2">
                        <i className="fas fa-plus-circle text-[#1877F2] text-xl cursor-pointer hover:bg-[#3A3B3C] rounded-full p-1" onClick={() => fileInputRef.current?.click()}></i>
                        <i className="fas fa-images text-[#1877F2] text-xl cursor-pointer hover:bg-[#3A3B3C] rounded-full p-1"></i>
                        <i className="fas fa-sticky-note text-[#1877F2] text-xl cursor-pointer hover:bg-[#3A3B3C] rounded-full p-1"></i>
                        <i className="fas fa-gift text-[#1877F2] text-xl cursor-pointer hover:bg-[#3A3B3C] rounded-full p-1"></i>
                    </div>
                    <div className="flex-1 relative bg-[#3A3B3C] rounded-2xl flex items-center min-h-[36px]">
                        <input 
                            type="text" 
                            value={inputText} 
                            onChange={(e) => setInputText(e.target.value)} 
                            placeholder="Aa" 
                            className="w-full bg-transparent px-3 py-2 text-[15px] outline-none text-[#E4E6EB] placeholder-[#B0B3B8]" 
                        />
                        <i className="fas fa-smile text-[#1877F2] text-xl cursor-pointer mr-3"></i>
                    </div>
                    {inputText.trim() ? (
                        <button type="submit" className="text-[#1877F2] mb-1"><i className="fas fa-paper-plane text-xl"></i></button>
                    ) : (
                        <i className="fas fa-thumbs-up text-[#1877F2] text-xl mb-2 cursor-pointer"></i>
                    )}
                </form>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" />
            </div>
        </div>
    );
};
