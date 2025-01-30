'use client';

import { Search, Bell, Menu } from 'lucide-react';
import Image from 'next/image';
import { NotificationData, markAllAsRead } from '@/helpers/notificationHelper';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { auth } from '@/lib/firebaseConfig';

interface MobileHeaderProps {
    userData: any;
    notifications: NotificationData[];
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function MobileHeader({ 
    userData, 
    notifications, 
    setIsMobileMenuOpen 
}: MobileHeaderProps) {
    const handleMarkAllRead = async () => {
        const user = auth.currentUser;
        if (!user) return;
        await markAllAsRead(user.uid);
    };

    return (
        <div className="flex md:hidden items-center justify-between">
            <div className="flex items-center">
                <Image
                    src="/images/transparentLogo.png"
                    alt="Ourlime Logo"
                    width={32}
                    height={32}
                />
                <span className="ml-2 text-base font-bold text-greenTheme">Ourlime</span>
            </div>

            <div className="flex items-center space-x-3">
                <button className="text-gray-600 hover:text-greenTheme" title="Search">
                    <Search size={20} />
                </button>

                <div className="relative">
                    <Dropdown>
                        <DropdownTrigger>
                            <button className="text-gray-600 hover:text-greenTheme transition-colors relative" title="Notifications">
                                <Bell size={20} />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Notifications" className="w-80">
                            <DropdownItem className="p-0">
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">Notifications</h3>
                                        {notifications.length > 0 && (
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="text-xs text-greenTheme hover:underline"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div key={notification.id} className="p-4 hover:bg-gray-50 border-b border-gray-100">
                                                {notification.type === 'friendRequest' && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                                        <div>
                                                            <p className="text-sm">
                                                                <span className="font-semibold">New friend request</span>
                                                            </p>
                                                            <span className="text-xs text-gray-500">
                                                                {notification.createdAt.toDate().toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            No notifications
                                        </div>
                                    )}
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="text-gray-600 hover:text-greenTheme"
                    title="Menu"
                >
                    <Menu size={20} />
                </button>
            </div>
        </div>
    );
}
