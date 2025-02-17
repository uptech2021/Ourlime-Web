'use client';

import Image from 'next/image';
import { UserData } from '@/types/userTypes';
import { MapPin, Calendar, Users, Globe, Check, Clock, Star, CircleUser } from 'lucide-react';

const getFormattedDate = (timestamp: any) => {
    if (timestamp?.seconds) {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }
    if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }
    return timestamp;
};

interface ViewOtherProfileHeaderProps {
    userData: UserData | null;
    mutualFriends?: number;
    postsCount?: number;
    friendsCount?: number;
}

export const ViewOtherProfileHeader = ({ userData, mutualFriends = 0, postsCount = 0, friendsCount = 0 }: ViewOtherProfileHeaderProps) => {
    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex-shrink-0">
            {/* Cover Image Section */}
            <div className="relative h-40 md:h-48 lg:h-60">
                <div className="absolute inset-0">
                    {userData?.profileImages?.coverProfile ? (
                        <Image
                            src={userData.profileImages.coverProfile}
                            alt="Cover"
                            fill
                            className="object-cover"
                            priority
                            loader={({ src }) => src}
                            unoptimized={true}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200" />
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="px-4 md:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-start gap-6 -mt-14">
                        {/* Profile Picture */}
                        <div className="relative z-20">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                                <Image
                                    src={userData?.profileImages?.profile || "/images/default-avatar.jpg"}
                                    alt="Profile"
                                    width={112}
                                    height={112}
                                    className="w-full h-full object-cover"
                                    loader={({ src }) => src}
                                    unoptimized={true}
                                />
                            </div>
                            {userData?.isAdmin && (
                                <div className="absolute -right-1 -top-1">
                                    <div className="bg-blue-500 p-1 rounded-full">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex flex-1 flex-col md:flex-row justify-between w-full pt-4 md:pt-14">
                            <div className="space-y-3 flex-1">
                                <div className="flex flex-col md:flex-row md:items-center w-full">
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                            {userData?.firstName} {userData?.lastName}
                                        </h1>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                            Online
                                        </span>
                                    </div>

                                    <div className="flex gap-2 mt-2 md:mt-0 md:ml-auto">
                                        <button className="border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all duration-300 flex items-center gap-1.5 hover:border-gray-400">
                                            <Users className="w-3.5 h-3.5" />
                                            Add Friend
                                        </button>
                                        <button className="border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all duration-300 flex items-center gap-1.5 hover:border-gray-400">
                                            <Star className="w-3.5 h-3.5" />
                                            Follow
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <p className="text-gray-600 text-sm">@{userData.userName}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {userData.friendsCount || 0} friends
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CircleUser className="w-4 h-4" />
                                            {userData.postsCount || 0} posts
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm text-gray-500">
                                            {userData?.country}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm text-gray-500">Joined {getFormattedDate(userData?.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {userData?.profileImages?.postProfile && (
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                                                <Image
                                                    src={userData.profileImages.postProfile}
                                                    alt="Post Profile"
                                                    width={32}
                                                    height={32}
                                                    className="object-cover"
                                                    loader={({ src }) => src}
                                                    unoptimized={true}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500 italic mt-1">Post</span>
                                        </div>
                                    )}

                                    {userData?.profileImages?.jobProfile && (
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                                                <Image
                                                    src={userData.profileImages.jobProfile}
                                                    alt="Job Profile"
                                                    width={32}
                                                    height={32}
                                                    className="object-cover"
                                                    loader={({ src }) => src}
                                                    unoptimized={true}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500 italic mt-1">Job</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="mt-6 mb-6">
                        <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
                            {userData?.bio || "No bio available"}
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full border-t border-gray-200"></div>
        </div>
    );
};
