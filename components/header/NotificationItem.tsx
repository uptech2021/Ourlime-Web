import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { NotificationData } from '@/helpers/notificationHelper';

interface NotificationItemProps {
    notification: NotificationData;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
    const getNotificationContent = () => {
        switch (notification.type) {
            case 'friendRequest':
                return (
                    <div className="flex items-center gap-3 p-4 hover:bg-gray-50">
                        <div className="relative w-10 h-10">
                            <Image
                                src={notification.userDetails?.profileImage || "/images/default-avatar.jpg"}
                                alt="Profile"
                                fill
                                className="rounded-full object-cover"
                                loader={({ src }) => src}
                                unoptimized={true}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm">
                                <span className="font-semibold">{notification.userDetails?.firstName} {notification.userDetails?.lastName}</span>
                                {' sent you a friend request'}
                            </p>
                            <span className="text-xs text-gray-500">
                                {formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return getNotificationContent();
}
