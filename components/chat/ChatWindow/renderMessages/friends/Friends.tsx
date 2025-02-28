'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessagingService } from '@/lib/messaging/MessagingService';
import { useProfileStore } from '@/src/store/useProfileStore';
import { Timestamp } from 'firebase/firestore';
import { format, isToday, isYesterday } from 'date-fns';
import { Send, Paperclip, Smile, MessageSquare, Check, CheckCheck, ArrowLeft } from 'lucide-react';

interface FriendMessagesProps {
    selectedFriend: any;
    isCompact: boolean;
    onBack?: () => void;
}

type Message = {
    id?: string;
    message: string;
    senderId: string;
    receiverId: string;
    status: 'sent' | 'delivered' | 'read';
    timestamp: Timestamp;
}

export const FriendMessages = ({ selectedFriend, isCompact, onBack }: FriendMessagesProps) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const messagingService = MessagingService.getInstance();
    const userData = useProfileStore();

    const formatMessageTime = (timestamp: Timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 60) {
            if (diffInMinutes < 1) return 'just now';
            if (diffInMinutes === 1) return '1 minute ago';
            return `${diffInMinutes} minutes ago`;
        }

        if (isToday(date)) return format(date, 'h:mm a');
        if (isYesterday(date)) return `Yesterday at ${format(date, 'h:mm a')}`;
        return format(date, 'MMM d, h:mm a');
    };

    useEffect(() => {
        if (!selectedFriend?.id) return;

        const unsubscribe = messagingService.subscribeToMessages(
            selectedFriend.id,
            userData.id,
            (newMessages) => {
                setMessages(newMessages.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds));
            }
        );

        return () => unsubscribe();
    }, [selectedFriend?.id]);

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedFriend?.id) return;

        const messageText = message.trim();
        const messageData: Message = {
            id: Date.now().toString(), // Add a temporary id
            message: messageText,
            senderId: userData.id,
            receiverId: selectedFriend.id,
            timestamp: Timestamp.now(),
            status: 'sent'
        };

        setMessages(prev => [...prev, messageData]);
        setMessage('');

        try {
            await messagingService.sendMessage(
                selectedFriend.id,
                messageText,
                userData.id
            );
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => prev.filter(msg => msg.id !== messageData.id));
            setMessage(messageText);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Message Header */}
            <div className="p-1 md:p-2 border-b border-gray-200 flex items-center gap-2 md:gap-3">
                {isCompact && (
                    <button
                        onClick={onBack}
                        className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Back to chat list"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                )}
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 relative rounded-full overflow-hidden">
                        <Image
                            src={selectedFriend.profileImage || '/images/transparentLogo.png'}
                            alt={`${selectedFriend.firstName}'s avatar`}
                            fill
                            className="object-cover"
                            loader={({ src }) => src}
                            unoptimized={true}
                        />
                    </div>
                    <div>
                        <h3 className="font-medium text-sm md:text-base">
                            {`${selectedFriend.firstName} ${selectedFriend.lastName}`}
                        </h3>
                        <p className="text-xs text-gray-500">@{selectedFriend.userName}</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
                {messages.length > 0 ? (
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
                                                    loader={({ src }) => src}
                                                    unoptimized={true}
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
                                                    {msg.status === 'sent' && <Check className="w-3 h-3 text-gray-400" />}
                                                    {msg.status === 'delivered' && <CheckCheck className="w-3 h-3 text-gray-400" />}
                                                    {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-500" />}
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

            {/* Message Input */}
            <div className="p-2 md:p-4 border-t border-gray-200">
                <div className="flex items-center gap-1.5 md:gap-2">
                    <button
                        className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Attach file"
                    >
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
                    <button
                        className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Add emoji"
                    >
                        <Smile className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                    </button>
                    <button
                        onClick={handleSendMessage}
                        className="p-1.5 md:p-2 bg-greenTheme text-white rounded-full hover:bg-green-600 transition-colors"
                        title="Send message"
                    >
                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
