'use client';

import { useState } from 'react';
import { ArrowLeft, Send, Paperclip, Smile } from 'lucide-react';
import Image from 'next/image';

interface ChatContentProps {
    activeChat: any;
    onBack: () => void;
    isCompact: boolean;
}

export const ChatContent = ({ activeChat, onBack, isCompact }: ChatContentProps) => {
    const [message, setMessage] = useState('');

    if (!activeChat) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Select a conversation to start chatting</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                {isCompact && (
                    <button
                        title='back' 
                        onClick={onBack}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Image
                            src={activeChat.avatar}
                            alt={activeChat.name}
                            fill
                            className="object-cover rounded-full"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div>
                        <h3 className="font-medium">{activeChat.name}</h3>
                        <p className="text-xs text-green-500">Online</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Messages will go here */}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title='attach'>
                        <Paperclip className="w-5 h-5 text-gray-500" />
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-greenTheme"
                    />
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title='smile'>
                        <Smile className="w-5 h-5 text-gray-500" />
                    </button>
                    <button className="p-2 bg-greenTheme text-white rounded-full hover:bg-green-600 transition-colors" title='send'>
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
