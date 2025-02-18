'use client';

import { Search, Users, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ChatSidebarProps {
    activeChat: any;
    setActiveChat: (chat: any) => void;
    isCompact: boolean;
}

export const ChatSidebar = ({ activeChat, setActiveChat, isCompact }: ChatSidebarProps) => {
    const [activeTab, setActiveTab] = useState<'chats' | 'friends'>('chats');
    const [searchQuery, setSearchQuery] = useState('');

    const conversations = [
        {
            id: 1,
            name: "Sarah Johnson",
            lastMessage: "Hey, how's it going?",
            time: "2m ago",
            unread: 2,
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
        },
        // Add more conversations
    ];

    const onlineFriends = [
        {
            id: 1,
            name: "David Chen",
            status: "online",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
        },
        // Add more friends
    ];

    return (
        <div className={`flex flex-col h-full bg-gray-50 ${isCompact ? 'w-full' : ''}`}>
            {/* Header with responsive padding */}
            <div className="p-3 md:p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <button
                        onClick={() => setActiveTab('chats')}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${activeTab === 'chats'
                                ? 'bg-greenTheme text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chats</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${activeTab === 'friends'
                                ? 'bg-greenTheme text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        <span>Friends</span>
                    </button>
                </div>

                {/* Search bar with adjusted sizing */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 md:px-4 py-2 pl-10 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-greenTheme text-sm md:text-base"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'chats' ? (
                    <div className="divide-y divide-gray-200">
                        {conversations.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className={`p-4 hover:bg-gray-100 cursor-pointer transition-colors ${activeChat?.id === chat.id ? 'bg-gray-100' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12">
                                        <Image
                                            src={chat.avatar}
                                            alt={chat.name}
                                            fill
                                            className="object-cover rounded-full"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium truncate">{chat.name}</h3>
                                            <span className="text-xs text-gray-500">{chat.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                                    </div>
                                    {chat.unread > 0 && (
                                        <span className="bg-greenTheme text-white text-xs px-2 py-1 rounded-full">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {onlineFriends.map((friend) => (
                            <div
                                key={friend.id}
                                className="p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12">
                                        <Image
                                            src={friend.avatar}
                                            alt={friend.name}
                                            fill
                                            className="object-cover rounded-full"
                                        />
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{friend.name}</h3>
                                        <p className="text-xs text-green-500">Online</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
