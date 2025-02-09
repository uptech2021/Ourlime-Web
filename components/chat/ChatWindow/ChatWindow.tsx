'use client';

import { useEffect, useState } from 'react';
import { Users, Globe, Search, ArrowLeft, Send, Paperclip, Smile } from 'lucide-react';
import Image from 'next/image';
import { ChatService } from '@/lib/chat/ChatAndFriendService';
import { Timestamp } from 'firebase/firestore';
import { useProfileStore } from '@/src/store/useProfileStore';
import { useMessages } from '@/src/hooks/useMessages';

interface ChatWindowProps {
    isCompact: boolean;
}

interface Message {
    id: string;
    message: string;
    senderId: string;
    receiverId: string;
    status: 'sent' | 'delivered' | 'read';
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export const ChatWindow = ({ isCompact }: ChatWindowProps) => {
    const [activeTab, setActiveTab] = useState<'friends' | 'discover'>('friends');
    const [selectedFriend, setSelectedFriend] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const [friends, setFriends] = useState([]);
    const [messages, setMessages] = useState<Message[]>([]);

    const chatService = ChatService.getInstance();
    const userData = useProfileStore();
    const { getMessages, sendMessage } = useMessages();

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        if (selectedFriend?.id) {
            fetchMessages();
        }
    }, [selectedFriend]);

    const fetchFriends = async () => {
        try {
            const friendsData = await chatService.getFriends();
            setFriends(friendsData);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const fetchMessages = async () => {
        if (!selectedFriend?.id) return;
        try {
            const result = await getMessages(selectedFriend.id);
            console.log('Fetched messages:', result);
            if (result.status === 'success') {
                setMessages(result.messages || []);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedFriend?.id) return;
        try {
            const result = await sendMessage(selectedFriend.id, message.trim());
            console.log('Message result:', result);
            if (result.status === 'success') {
                await fetchMessages();
                setMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const renderFriendsList = () => (
        <div className="flex-1 overflow-y-auto">
            {friends.map((friend) => (
                <button
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend)}
                    title={`Chat with ${friend.firstName}`}
                    className="w-full flex items-center gap-2 md:gap-3 p-3 md:p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 text-left"
                >
                    <div className="relative">
                        <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-full overflow-hidden">
                            <Image
                                src={friend.profileImage || '/images/transparentLogo.png'}
                                alt={`${friend.firstName}'s avatar`}
                                fill
                                sizes="(max-width: 48px) 100vw"
                                className="object-cover"
                                priority
                                onError={(e) => {
                                    e.currentTarget.src = '/images/transparentLogo.png'
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h3 className="font-medium text-sm md:text-base truncate">{`${friend.firstName} ${friend.lastName}`}</h3>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 truncate">@{friend.userName}</p>
                    </div>
                </button>
            ))}
        </div>
    );

    const renderDiscoverRooms = () => (
        <div className="flex-1 overflow-y-auto">
            {/* future development */}
        </div>
    );

    const renderChatView = () => (
        <div className="h-full flex flex-col">
            <div className="p-1 md:p-2 border-b border-gray-200 flex items-center gap-2 md:gap-3">
                {isCompact && (
                    <button
                        onClick={() => setSelectedFriend(null)}
                        title="Go back to chat list"
                        className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                )}
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 md:w-10 md:h-10 relative rounded-full overflow-hidden">
                            <Image
                                src={selectedFriend.profileImage || '/images/transparentLogo.png'}
                                alt={`${selectedFriend.firstName}'s avatar`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm md:text-base">{`${selectedFriend.firstName} ${selectedFriend.lastName}`}</h3>
                        <p className="text-xs text-gray-500">@{selectedFriend.userName}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-1 md:p-2">
                {messages && messages.length > 0 ? (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.senderId === userData.id ? 'justify-end' : 'justify-start'} mb-3`}
                        >
                            <div
                                className={`max-w-[85%] md:max-w-[70%] rounded-lg px-3 md:px-4 py-2 md:py-3 shadow-sm ${msg.senderId === userData.id
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                <p className="text-sm md:text-base leading-relaxed">{msg.message}</p>
                                <span className={`text-[10px] md:text-xs mt-1 block ${msg.senderId === userData.id ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                    {msg.createdAt?.toDate ?
                                        new Date(msg.createdAt.toDate()).toLocaleTimeString()
                                        : new Date().toLocaleTimeString()
                                    }
                                </span>
                            </div>
                        </div>

                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No messages yet</p>
                    </div>
                )}
            </div>


            <div className="p-2 md:p-4 border-t border-gray-200">
                <div className="flex items-center gap-1.5 md:gap-2">
                    <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors" title='clip'>
                        <Paperclip className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-greenTheme"
                    />
                    <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors" title='smile'>
                        <Smile className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                    </button>
                    <button
                        onClick={handleSendMessage}
                        title='send'
                        className="p-1.5 md:p-2 bg-greenTheme text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderTabs = () => (
        <div className="grid grid-cols-2 w-full">
            <button
                onClick={() => setActiveTab('friends')}
                title="View friends list"
                aria-label="Switch to friends tab"
                className={`flex items-center justify-center gap-2 py-3 transition-all relative ${activeTab === 'friends' ? 'text-greenTheme font-medium' : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <Users className="w-4 h-4" />
                <span>Friends</span>
                {activeTab === 'friends' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-greenTheme" />
                )}
            </button>
            <button
                onClick={() => setActiveTab('discover')}
                title="View discover section"
                aria-label="Switch to discover tab"
                className={`flex items-center justify-center gap-2 py-3 transition-all relative ${activeTab === 'discover' ? 'text-greenTheme font-medium' : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <Globe className="w-4 h-4" />
                <span>Discover</span>
                {activeTab === 'discover' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-greenTheme" />
                )}
            </button>
        </div>
    );


    if (isCompact) {
        return (
            <div className="flex flex-col h-full">
                {!selectedFriend ? (
                    <>
                        <div className="border-b border-gray-200">
                            {renderTabs()}
                        </div>
                        <div className="p-2 md:p-4 border-b border-gray-200">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab === 'friends' ? 'friends' : 'rooms'}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 pl-8 md:pl-10 text-sm md:text-base bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                                />
                                <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        {activeTab === 'friends' ? renderFriendsList() : renderDiscoverRooms()}
                    </>
                ) : (
                    renderChatView()
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-full">
            <div className="lg:w-[30%] lg:border-r border-gray-200">
                <div className="block lg:hidden h-16 border-b border-gray-200 overflow-x-auto">
                    <div className="flex px-2 py-1 gap-2 min-w-max">
                        {friends.map((friend) => (
                            <button
                                key={friend.id}
                                onClick={() => setSelectedFriend(friend)}
                                className={`flex flex-col items-center ${selectedFriend?.id === friend.id ? 'opacity-100' : 'opacity-70'}`}
                            >
                                <div className="w-8 h-8 relative rounded-full overflow-hidden">
                                    <Image
                                        src={friend.profileImage || '/images/transparentLogo.png'}
                                        alt={friend.firstName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span className="text-[8px] mt-0.5 truncate max-w-[40px]">{friend.firstName}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:flex lg:flex-col h-full">
                    <div className="border-b border-gray-200">
                        {renderTabs()}
                    </div>
                    <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={`Search ${activeTab === 'friends' ? 'friends' : 'rooms'}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-2 py-1.5 pl-8 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                            />
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'friends' ? renderFriendsList() : renderDiscoverRooms()}
                    </div>
                </div>
            </div>

            <div className="flex-1 lg:w-[70%]">
                {selectedFriend ? (
                    renderChatView()
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <p className="text-xs lg:text-sm">Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

