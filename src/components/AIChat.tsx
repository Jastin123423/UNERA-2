
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { User } from '../types';

interface AIMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}

export const AIChat: React.FC<{ currentUser: User | null; onClose: () => void }> = ({ currentUser, onClose }) => {
    const [messages, setMessages] = useState<AIMessage[]>([
        { id: '1', role: 'model', text: `Hello ${currentUser?.name || 'there'}! I'm UNERA AI. How can I help you today? I can help you write posts, find information, or just chat.`, timestamp: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<Chat | null>(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

    // Initialize AI Chat
    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatRef.current = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: "You are UNERA AI, a helpful and friendly assistant integrated into the UNERA Social platform. You help users with social media strategy, writing posts, answering questions, and general conversation. Keep your tone professional yet social. Use emojis naturally.",
            },
        });
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chatRef.current) return;

        const userMsg: AIMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);

        try {
            const responseStream = await chatRef.current.sendMessageStream({ message: currentInput });
            
            let fullText = '';
            const modelMsgId = (Date.now() + 1).toString();
            
            // Add a placeholder message for the model
            setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', timestamp: Date.now() }]);

            for await (const chunk of responseStream) {
                const chunkResponse = chunk as GenerateContentResponse;
                const text = chunkResponse.text;
                if (text) {
                    fullText += text;
                    setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, text: fullText } : m));
                }
            }
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I encountered an error. Please try again.", timestamp: Date.now() }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col font-sans animate-fade-in">
            {/* Header */}
            <div className="h-16 px-4 bg-[#242526] border-b border-[#3E4042] flex items-center justify-between shadow-xl flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div onClick={onClose} className="w-10 h-10 rounded-full hover:bg-[#3A3B3C] flex items-center justify-center cursor-pointer transition-colors">
                        <i className="fas fa-arrow-left text-[#E4E6EB] text-xl"></i>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A033FF] to-[#7B1FA2] flex items-center justify-center shadow-lg">
                            <i className="fas fa-robot text-white"></i>
                        </div>
                        <div>
                            <h2 className="text-[#E4E6EB] font-bold text-lg leading-tight">UNERA AI</h2>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-[#45BD62] rounded-full"></div>
                                <span className="text-[#B0B3B8] text-xs">Always Active</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <i className="fas fa-ellipsis-v text-[#B0B3B8] cursor-pointer hover:text-white"></i>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#18191A] relative">
                {/* Background Decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                    <i className="fas fa-robot text-[300px]"></i>
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                            msg.role === 'user' 
                            ? 'bg-[#1877F2] text-white rounded-tr-none' 
                            : 'bg-[#242526] text-[#E4E6EB] border border-[#3E4042] rounded-tl-none'
                        } shadow-md`}>
                            <p className="text-[16px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <div className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-white/70' : 'text-[#B0B3B8]'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="bg-[#242526] p-4 rounded-2xl border border-[#3E4042] rounded-tl-none shadow-md">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-[#B0B3B8] rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-[#B0B3B8] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-[#B0B3B8] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#242526] border-t border-[#3E4042] flex-shrink-0">
                <form onSubmit={handleSendMessage} className="max-w-[800px] mx-auto flex gap-3">
                    <div className="flex-1 bg-[#3A3B3C] rounded-2xl px-4 py-2 flex items-center border border-transparent focus-within:border-[#1877F2] transition-all">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="Ask me anything..."
                            className="w-full bg-transparent text-[#E4E6EB] outline-none resize-none max-h-32 text-[16px]"
                            rows={1}
                        />
                        <div className="flex gap-3 text-[#B0B3B8]">
                            <i className="fas fa-magic cursor-pointer hover:text-white transition-colors" title="Suggest Prompt"></i>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="w-12 h-12 bg-[#1877F2] hover:bg-[#166FE5] disabled:bg-[#3A3B3C] disabled:text-[#B0B3B8] text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
                    >
                        {isTyping ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                    </button>
                </form>
                <div className="max-w-[800px] mx-auto mt-2 text-center">
                    <p className="text-[11px] text-[#B0B3B8]">UNERA AI can make mistakes. Consider checking important information.</p>
                </div>
            </div>
        </div>
    );
};
