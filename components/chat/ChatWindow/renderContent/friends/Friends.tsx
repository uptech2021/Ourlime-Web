'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChatService } from '@/lib/chat/ChatAndFriendService';
import { format, isToday, isYesterday } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { MessagingService } from '@/lib/messaging/MessagingService';
import { useProfileStore } from '@/src/store/useProfileStore';

interface FriendsProps {
    setSelectedFriend: (friend: any) => void;
}

export const Friends = ({ setSelectedFriend }: FriendsProps) => {
    const [friends, setFriends] = useState([]);
    const chatService = ChatService.getInstance();
    const userData = useProfileStore();

    useEffect(() => {
        fetchFriends();
        const interval = setInterval(fetchFriends, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchFriends = async () => {
        try {
            const friendsData = await chatService.getFriends();
            // Filter out business inquiries
            const onlyFriends = friendsData.filter(friend => !friend.isBusinessInquiry);
            setFriends(onlyFriends);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

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

    return (
        <div className="flex-1 overflow-y-auto">
            {friends.map((friend) => (
                <button
                    key={friend.id}
                    onClick={async () => {
                        const messagingService = MessagingService.getInstance();
                        await messagingService.markMessagesAsRead(friend.id, userData.id);
                        setSelectedFriend(friend);
                    }}
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
                                loader={({ src }) => src}
                                unoptimized={true}
                            />
                        </div>
                        {friend.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
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
                                    {formatMessageTime(friend.lastMessageTime)}
                                </span>
                            )}
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 truncate">
                            {friend.lastMessage || `@${friend.userName}`}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
};
