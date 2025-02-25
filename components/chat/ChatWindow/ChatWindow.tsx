'use client';

import { useEffect, useState } from 'react';
import { Users, Globe, Search, ArrowLeft, Send, Paperclip, Smile, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { ChatService } from '@/lib/chat/ChatAndFriendService';
import { Timestamp } from 'firebase/firestore';
import { useProfileStore } from '@/src/store/useProfileStore';
import { useMessages } from '@/src/hooks/useMessages';
import { format, isToday, isYesterday } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
interface ChatWindowProps {
    isCompact: boolean;
}

type Message = {
    id?: string;
    message: string;
    senderId: string;
    receiverId: string;
    status: 'sent' | 'delivered' | 'read';
    timestamp: Timestamp;
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


    const formatMessageTime = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        // Show relative time for messages less than 1 hour old
        if (diffInMinutes < 60) {
            if (diffInMinutes < 1) return 'just now';
            if (diffInMinutes === 1) return '1 minute ago';
            return `${diffInMinutes} minutes ago`;
        }

        // For same day messages older than 1 hour
        if (isToday(date)) {
            return format(date, 'h:mm a');
        }

        if (isYesterday(date)) {
            return `Yesterday at ${format(date, 'h:mm a')}`;
        }

        return format(date, 'MMM d, h:mm a');
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        if (!selectedFriend?.id) return;
        fetchMessages();

        const unsubscribe = chatService.subscribeToMessages(
            selectedFriend.id,
            userData.id,
            (newMessages) => {
                const sortedMessages = newMessages.sort((a, b) =>
                    a.timestamp.seconds - b.timestamp.seconds
                );
                setMessages(sortedMessages);
            }
        );

        return () => unsubscribe();
    }, [selectedFriend?.id]);

    useEffect(() => {
        if (selectedFriend?.id) {
            // Subscribe to real-time message updates
            const unsubscribe = chatService.subscribeToMessages(
                selectedFriend.id,
                userData.id,
                async () => {
                    // Refresh friends list to update unread counts
                    const updatedFriends = await chatService.getFriends();
                    setFriends(updatedFriends);
                }
            );
    
            return () => unsubscribe();
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
            if (result.status === 'success' && result.messages) {
                const sortedMessages = result.messages.sort((a, b) =>
                    a.timestamp.seconds - b.timestamp.seconds
                );
                setMessages(sortedMessages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        }
    };
    
    const handleSendMessage = async () => {
        if (!message.trim() || !selectedFriend?.id) return;
    
        const messageText = message.trim();
        const newMessage: Message = {
            id: `temp-${Date.now()}`,
            message: messageText,
            senderId: userData.id,
            receiverId: selectedFriend.id,
            timestamp: new Timestamp(Math.floor(Date.now() / 1000), 0),
            status: 'sent'
        };
    
        setMessages(prev => [...prev, newMessage]);
        setMessage('');
    
        try {
            await sendMessage(selectedFriend.id, messageText);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
            setMessage(messageText);
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
                    className="w-full flex items-center gap-2 md:gap-3 p-3 md:p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 text-left relative"
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
                        {friend.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-medium">
                                    {friend.unreadCount > 99 ? '99+' : friend.unreadCount}
                                </span>
                            </div>
                        )}
                    </div>
    
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start w-full">
                            <h3 className="font-medium text-sm md:text-base truncate">
                                {`${friend.firstName} ${friend.lastName}`}
                            </h3>
                            {friend.lastMessageTime && (
                                <span className="text-xs text-gray-500 ml-2">
                                    {new Date(friend.lastMessageTime.seconds * 1000).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs md:text-sm text-gray-600 truncate">
                                {friend.lastMessage || `@${friend.userName}`}
                            </p>
                            {friend.unreadCount > 0 && (
                                <span className="text-xs font-medium text-red-500">
                                    New
                                </span>
                            )}
                        </div>
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
            <div className="flex-1 overflow-y-auto px-4 py-2">
                {messages && messages.length > 0 ? (
                    <div className="flex flex-col">
                        {messages.map((msg, index) => {
                            const isFirstInGroup = index === 0 || messages[index - 1].senderId !== msg.senderId;
                            const isLastInGroup = index === messages.length - 1 || messages[index + 1].senderId !== msg.senderId;

                            return (
                                <div
                                    key={msg.id || `${msg.timestamp.seconds}-${msg.timestamp.nanoseconds}`}
                                    className={`flex flex-col mb-2 ${msg.senderId === userData.id ? 'items-end' : 'items-start'}`}
                                >
                                    <div className="flex items-end gap-1.5 max-w-[80%]">
                                        {msg.senderId !== userData.id && isFirstInGroup && (
                                            <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={selectedFriend.profileImage || '/images/transparentLogo.png'}
                                                    alt={selectedFriend.firstName}
                                                    width={24}
                                                    height={24}
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}

                                        <div className={`
                                px-3 py-2 
                                ${msg.senderId === userData.id
                                                ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg'
                                                : 'bg-gray-100 text-gray-800 rounded-r-lg rounded-tl-lg'
                                            }
                                ${!isLastInGroup ? 'mb-0.5' : ''}
                            `}>
                                            <p className="text-sm">{msg.message}</p>
                                        </div>
                                    </div>

                                    {isLastInGroup && (
                                        <div className={`
                                flex items-center gap-1 mt-1
                                ${msg.senderId === userData.id ? 'mr-1' : 'ml-7'}
                            `}>
                                            <span className="text-[10px] text-gray-500">
                                                {formatMessageTime(msg.timestamp)}
                                            </span>

                                            {msg.senderId === userData.id && (
                                                <div className="flex items-center">
                                                    {msg.status === 'sent' && (
                                                        <Check className="w-3 h-3 text-gray-400" />
                                                    )}
                                                    {msg.status === 'delivered' && (
                                                        <CheckCheck className="w-3 h-3 text-gray-400" />
                                                    )}
                                                    {msg.status === 'read' && (
                                                        <CheckCheck className="w-3 h-3 text-blue-500" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="font-medium">No messages yet</p>
                        <p className="text-sm">Send a message to {selectedFriend.firstName}</p>
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

