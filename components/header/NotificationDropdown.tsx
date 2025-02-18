import { Bell } from 'lucide-react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { NotificationData } from '@/helpers/notificationHelper';
import { markAllAsRead } from '@/helpers/notificationHelper';
import { auth } from '@/lib/firebaseConfig';
import NotificationItem from './NotificationItem';

interface NotificationDropdownProps {
    notifications: NotificationData[];
}

export default function NotificationDropdown({ notifications }: NotificationDropdownProps) {
    const handleMarkAllRead = async () => {
        const user = auth.currentUser;
        if (!user) return;
        await markAllAsRead(user.uid);
    };

    return (
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
                                    <NotificationItem key={notification.id} notification={notification} />
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
    );
}
