'use client';

import Image from 'next/image';
import { UserCheck, MessageSquare, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface Friend {
    id: string;
    friendshipStatus: string;
    createdAt: any;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        userName: string;
        profileImage: string | null;
    };
}

interface FriendDetailsProps {
    friends: Friend[];
}

export const FriendDetails = ({ friends }: FriendDetailsProps) => {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header with stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Friends</h2>
                <p className="text-gray-500">{friends.length} friends</p>
            </div>

            {/* Search and Filters Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search friends..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-greenTheme focus:border-transparent"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex-shrink-0">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <ArrowUpDown className="w-4 h-4" />
                            <span>Sort by</span>
                        </button>
                    </div>

                    {/* Filter Button */}
                    <div className="flex-shrink-0">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                {/* Filter Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-green-50 text-greenTheme rounded-full text-sm font-medium flex items-center gap-1">
                        Recently Added
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-greenTheme rounded-full text-sm font-medium flex items-center gap-1">
                        Mutual Friends
                    </span>
                </div>
            </div>

            {/* Friends Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend) => (
                    <div 
                        key={friend.id} 
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-start gap-4">
                            <div className="relative w-16 h-16 group">
                                <Image
                                    src={friend.user.profileImage || '/images/default-avatar.jpg'}
                                    alt={`${friend.user.firstName}'s profile`}
                                    fill
                                    className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                    loader={({ src }) => src}
                                    unoptimized={true}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 hover:text-greenTheme transition-colors cursor-pointer">
                                    {friend.user.firstName} {friend.user.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">@{friend.user.userName}</p>
                                <div className="mt-4 flex items-center gap-2">
                                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-greenTheme bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-300">
                                        <UserCheck size={16} />
                                        Friends
                                    </button>
                                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                                        <MessageSquare size={16} />
                                        Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
