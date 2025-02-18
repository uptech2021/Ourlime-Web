'use client';

import { Search, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { NotificationData } from '@/helpers/notificationHelper';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';

interface TabletHeaderProps {
    notifications: NotificationData[];
}

export default function TabletHeader({ notifications }: TabletHeaderProps) {
    return (
        <div className="hidden md:flex lg:hidden items-center justify-between">
            <div className="flex items-center">
                <Image
                    src="/images/transparentLogo.png"
                    alt="Ourlime Logo"
                    width={36}
                    height={36}
                />
                <span className="ml-2 text-lg font-bold text-greenTheme">Ourlime</span>
            </div>

            <div className="flex-1 mx-4">
                <div className="relative w-full max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-gray-100 rounded-full px-10 py-2 outline-none text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-greenTheme" title="Messages">
                    <MessageSquare size={22} />
                </button>
                <NotificationDropdown notifications={notifications} />
                <ProfileDropdown />
            </div>
        </div>
    );
}
