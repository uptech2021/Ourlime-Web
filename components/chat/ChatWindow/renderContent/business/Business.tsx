'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { TempMessagingService } from '@/lib/messaging/TempMessagingService';
import { ChatService } from '@/lib/chat/ChatAndFriendService';
import { format, isToday, isYesterday } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { useProfileStore } from '@/src/store/useProfileStore';

interface TempChat {
    id: string;
    participants: string[];
    lastMessage: string;
    lastMessageTime: Timestamp;
    messages: {
        senderId: string;
        receiverId: string;
        message: string;
        timestamp: Timestamp;
        status: 'sent' | 'delivered' | 'read';
    }[];
    productContext: {
        productId: string;
        productTitle: string;
        productImage: string;
        colorVariant: string | null;
        sizeVariant: string | null;
        price: string | null;
    };
    userInfo?: {
        firstName: string;
        lastName: string;
        userName: string;
        profileImage: string;
    };
}

interface BusinessProps {
    setSelectedFriend: (friend: any) => void;
}

export const Business = ({ setSelectedFriend }: BusinessProps) => {
    const [businessChats, setBusinessChats] = useState<TempChat[]>([]);
    const tempMessagingService = TempMessagingService.getInstance();
    const chatService = ChatService.getInstance();
    const userData = useProfileStore();

    useEffect(() => {
        fetchBusinessChats();
        const interval = setInterval(fetchBusinessChats, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchBusinessChats = async () => {
        try {
            const chats = await tempMessagingService.getTempChats(userData.id);
            const friendsData = await chatService.getFriends();

            const chatsWithUserInfo = await Promise.all(chats.map(async chat => {
                const otherUserId = chat.participants.find(p => p !== userData.id);
                const friendInfo = friendsData.find(f => f.id === otherUserId);

                // Get unread messages count
                const unreadMessages = chat.messages.filter(msg =>
                    msg.receiverId === userData.id && msg.status === 'sent'
                ).length;

                return {
                    ...chat,
                    userInfo: friendInfo,
                    unreadMessages
                };
            }));

            setBusinessChats(chatsWithUserInfo);
        } catch (error) {
            console.error('Error fetching business chats:', error);
        }
    };

    const formatMessageTime = (timestamp: Timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        if (isToday(date)) return format(date, 'h:mm a');
        if (isYesterday(date)) return `Yesterday at ${format(date, 'h:mm a')}`;
        return format(date, 'MMM d, h:mm a');
    };

    return (
        <div className="flex-1 overflow-y-auto">
            {businessChats.map((chat) => {
                const unreadCount = chat.messages.filter(msg =>
                    msg.receiverId === userData.id && msg.status === 'sent'
                ).length;

                return (
                    <button
                        key={chat.id}
                        onClick={async () => {
                            await tempMessagingService.markMessagesAsRead(chat.id, userData.id);
                            setSelectedFriend({
                                id: chat.id,
                                isBusinessInquiry: true,
                                firstName: chat.userInfo?.firstName,
                                lastName: chat.userInfo?.lastName,
                                userName: chat.userInfo?.userName,
                                profileImage: chat.userInfo?.profileImage,
                                productContext: chat.productContext
                            });
                        }}
                        className="w-full flex items-center gap-2 md:gap-3 p-3 md:p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 text-left relative"
                    >

                        <div className="relative">
                            <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-full overflow-hidden">
                                <Image
                                    src={chat.userInfo?.profileImage || '/images/transparentLogo.png'}
                                    alt={`${chat.userInfo?.firstName}'s avatar`}
                                    fill
                                    sizes="(max-width: 48px) 100vw"
                                    className="object-cover"
                                    priority
                                    loader={({ src }) => src}
                                    unoptimized={true}
                                />
                            </div>
                            {unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                    <span className="text-xs text-white font-medium">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start w-full">
                                <div>
                                    <h3 className="font-medium text-sm md:text-base truncate">
                                        {`${chat.userInfo?.firstName} ${chat.userInfo?.lastName}`}
                                    </h3>
                                    <span className="text-xs text-gray-500">@{chat.userInfo?.userName}</span>
                                </div>
                                {chat.lastMessageTime && (
                                    <span className="text-xs text-gray-500 ml-2">
                                        {formatMessageTime(chat.lastMessageTime)}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-xs md:text-sm text-gray-600 truncate">
                                    Inquiry about: {chat.productContext.productTitle}
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
