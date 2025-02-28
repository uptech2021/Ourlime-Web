'use client';

import { MessageCircle, X, Minimize2, Maximize2, Video, Phone } from 'lucide-react';
import { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { usePathname } from 'next/navigation';
import { useProfileStore } from '@/src/store/useProfileStore';
import { ChatService } from '@/lib/chat/ChatAndFriendService';
import { TempMessagingService } from '@/lib/messaging/TempMessagingService';
import { ChatWindow } from '../ChatWindow/ChatWindow';


type WindowSize = 'closed' | 'compact' | 'full';
const noChatButton = ['/login', '/register', '/forgot-password', '/reset-password'];

export const ChatButton = () => {
    const pathname = usePathname();
    const [windowSize, setWindowSize] = useState<WindowSize>('closed');
    const [regularUnread, setRegularUnread] = useState(0);
    const [businessUnread, setBusinessUnread] = useState(0);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const notificationSound = useRef(new Audio('/sounds/notification.mp3'));
    const previousCountRef = useRef({ regular: 0, business: 0 });
    
    const chatService = ChatService.getInstance();
    const tempMessagingService = TempMessagingService.getInstance();
    const userData = useProfileStore();

    const fetchUnreadCounts = async () => {
        try {
            // Parallel data fetching
            const [friends, businessChats] = await Promise.all([
                chatService.getFriends(),
                tempMessagingService.getTempChats(userData.id)
            ]);

            const newRegularTotal = friends.reduce((sum, friend) =>
                sum + (friend.unreadCount || 0), 0);

            const newBusinessTotal = businessChats.reduce((sum, chat) => {
                const unreadCount = chat.messages?.filter(msg => 
                    msg.receiverId === userData.id && msg.status === 'sent'
                ).length || 0;
                return sum + unreadCount;
            }, 0);

            if (newRegularTotal > previousCountRef.current.regular || 
                newBusinessTotal > previousCountRef.current.business) {
                setHasNewMessage(true);
                notificationSound.current.play().catch(() => {});
            }

            previousCountRef.current = { regular: newRegularTotal, business: newBusinessTotal };
            setRegularUnread(newRegularTotal);
            setBusinessUnread(newBusinessTotal);
        } catch (error) {
            console.error('Error fetching unread counts:', error);
        }
    };

    useEffect(() => {
        fetchUnreadCounts();
        const interval = setInterval(fetchUnreadCounts, 5000);
        return () => clearInterval(interval);
    }, [userData.id]);

    useEffect(() => {
        if (windowSize !== 'closed') {
            setHasNewMessage(false);
        }
    }, [windowSize]);

    if (noChatButton.includes(pathname)) {
        return null;
    }

    const handleClose = () => {
        const element = document.querySelector('.chat-window');
        element?.classList.remove('animate-expand');
        element?.classList.add('animate-collapse');
        setTimeout(() => setWindowSize('closed'), 500);
    };

    return (
        <div className="fixed bottom-20 right-8 z-[9999999]">
            {windowSize === 'closed' && (
                <button
                    onClick={() => setWindowSize('compact')}
                    className={`relative flex items-center
                    justify-center w-8 h-8 md:w-10 md:h-10
                    bg-greenTheme text-white rounded-full shadow-lg
                    hover:bg-green-600 transition-all duration-300 group
                    ${hasNewMessage ? 'animate-bounce-subtle' : ''}`}
                >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform duration-300" />
                    {regularUnread > 0 && (
                        <div className="absolute -top-1 -right-1 min-w-[16px] h-4 md:min-w-[20px] md:h-5 bg-red-500 rounded-full border-[1px] md:border-2 border-white animate-pulse flex items-center justify-center">
                            <span className="text-[10px] md:text-xs text-white font-medium">
                                {regularUnread > 99 ? '99+' : regularUnread}
                            </span>
                        </div>
                    )}
                    {businessUnread > 0 && (
                        <div className="absolute -bottom-1 -left-1 min-w-[16px] h-4 md:min-w-[20px] md:h-5 bg-blue-500 rounded-full border-[1px] md:border-2 border-white animate-pulse flex items-center justify-center">
                            <span className="text-[10px] md:text-xs text-white font-medium">
                                {businessUnread > 99 ? '99+' : businessUnread}
                            </span>
                        </div>
                    )}
                </button>
            )}
            {windowSize !== 'closed' && (
                <div className={`chat-window fixed bg-white rounded-lg shadow-2xl
                    ${windowSize === 'compact'
                        ? 'bottom-8 right-8 w-[90vw] md:w-[400px] h-[75vh] md:h-[500px]'
                        : 'bottom-8 right-8 w-[90vw] md:w-[800px] h-[80vh]'
                    }
                    animate-expand origin-bottom-right
                    max-w-[calc(100%-4rem)] max-h-[calc(100vh-4rem)]
                    transition-all duration-300 ease-in-out
                    mx-auto md:mx-0`}>
                    <div className="h-12 border-b border-gray-200 flex justify-between items-center px-2 md:px-4">
                        <div className="text-sm font-medium text-gray-700">Messages</div>
                        <div className="flex gap-2">
                            <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors" title="Voice Call">
                                <Phone className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors" title="Video Call">
                                <Video className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                                onClick={() => setWindowSize(windowSize === 'compact' ? 'full' : 'compact')}
                                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title={windowSize === 'compact' ? 'Expand' : 'Minimize'}
                            >
                                {windowSize === 'compact' ? (
                                    <Maximize2 className="w-4 h-4 text-gray-600" />
                                ) : (
                                    <Minimize2 className="w-4 h-4 text-gray-600" />
                                )}
                            </button>
                            <button
                                title='Close'
                                onClick={handleClose}
                                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    <div className="h-[calc(100%-3rem)] overflow-hidden">
                        <Suspense fallback={<div className="p-4">Loading...</div>}>
                            <ChatWindow isCompact={windowSize === 'compact'} />
                        </Suspense>
                    </div>
                </div>
            )}
        </div>
    );
};
