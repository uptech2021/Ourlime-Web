'use client';

import { Search, MessageSquare, Bell, Settings, Compass } from 'lucide-react';
import Image from 'next/image';
import { NotificationData } from '@/helpers/notificationHelper';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import ProfileDropdown from './ProfileDropdown';
import { createTestNotification, markAllAsRead } from '@/helpers/notificationHelper';
import { auth } from '@/lib/firebaseConfig';

interface DesktopHeaderProps {
    userData: any;
    notifications: NotificationData[];
}

export default function DesktopHeader({ userData, notifications }: DesktopHeaderProps) {
    const handleMarkAllRead = async () => {
        const user = auth.currentUser;
        if (!user) return;
        await markAllAsRead(user.uid);
    };

    return (
        <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center">
                <Image
                    src="/images/transparentLogo.png"
                    alt="Ourlime Logo"
                    width={40}
                    height={40}
                />
                <span className="ml-2 text-xl font-bold text-greenTheme">Ourlime</span>
            </div>

            <button onClick={createTestNotification} className="p-2 bg-gray-100">
                Create Test Notification
            </button>

            <div className="flex-1 mx-8">
                <div className="relative w-full max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-gray-100 rounded-full px-12 py-2 outline-none focus:ring-2 focus:ring-greenTheme/20"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="text-gray-600 hover:text-greenTheme transition-colors" title="Messages">
                    <MessageSquare size={24} />
                </button>

                <div className="relative">
                    <Dropdown>
                        <DropdownTrigger>
                            <button className="text-gray-600 hover:text-greenTheme transition-colors relative" title="Notifications">
                                <Bell size={24} />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Notifications" className="w-80">
                            <DropdownItem className="p-0">
                                {/* Notification dropdown content */}
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

                <button className="text-gray-600 hover:text-greenTheme transition-colors" title="Settings">
                    <Settings size={24} />
                </button>
                <button className="text-gray-600 hover:text-greenTheme transition-colors" title="Explore">
                    <Compass size={24} />
                </button>
                <ProfileDropdown userData={userData} />
            </div>
        </div>
    );
}
