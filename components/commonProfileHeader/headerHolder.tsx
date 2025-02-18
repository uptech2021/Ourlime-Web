'use client';

import Image from 'next/image';
import { UserData } from '@/types/userTypes';
import { MapPin, Calendar, Users, Star, CircleUser, MessageCircle, Link, Globe, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ViewOtherProfileHeaderProps {
    userData: UserData | null;
}

export const ViewOtherProfileHeader = ({ userData }: ViewOtherProfileHeaderProps) => {
    const [isOnline, setIsOnline] = useState(true);
    const [animatedStats, setAnimatedStats] = useState({
        friends: 0,
        posts: 0,
        following: 0,
        followers: 0
    });

    useEffect(() => {
        if (userData) {
            const duration = 1000;
            const steps = 20;
            const stepTime = duration / steps;

            const friendsStep = (userData.friendsCount || 0) / steps;
            const postsStep = (userData.postsCount || 0) / steps;
            const followingStep = 245 / steps;
            const followersStep = 1200 / steps;

            let currentStep = 0;

            const interval = setInterval(() => {
                if (currentStep < steps) {
                    setAnimatedStats(prev => ({
                        friends: Math.round(friendsStep * (currentStep + 1)),
                        posts: Math.round(postsStep * (currentStep + 1)),
                        following: Math.round(followingStep * (currentStep + 1)),
                        followers: Math.round(followersStep * (currentStep + 1))
                    }));
                    currentStep++;
                } else {
                    clearInterval(interval);
                }
            }, stepTime);

            return () => clearInterval(interval);
        }
    }, [userData]);

    if (!userData) return <div>Loading...</div>;

    return (
        <div className="bg-white">
            {/* Cover Image with Pattern Overlay */}
            <div className="relative h-64 md:h-96 w-full">
                <div className="absolute inset-0 bg-[url('/patterns/dot-pattern.png')] opacity-30 mix-blend-overlay z-10" />
                {userData?.profileImages?.coverProfile ? (
                    <Image
                        src={userData.profileImages.coverProfile}
                        alt="Cover"
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        priority
                        loader={({ src }) => src}
                        unoptimized={true}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-emerald-50 to-green-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-32">
                    <div className="flex flex-col md:flex-row items-center gap-8 pb-8">
                        {/* Profile Image & Primary Info */}
                        <div className="flex flex-col items-center md:items-start">
                            <div className="relative mb-4 group">
                                <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-white shadow-xl transition-transform duration-300 group-hover:scale-105">
                                    <Image
                                        src={userData?.profileImages?.profile || "/images/default-avatar.jpg"}
                                        alt="Profile"
                                        width={144}
                                        height={144}
                                        className="w-full h-full object-cover"
                                        loader={({ src }) => src}
                                        unoptimized={true}
                                    />
                                </div>
                                {userData?.isAdmin && (
                                    <div className="absolute -right-2 top-0 transform transition-transform duration-300 hover:scale-110">
                                        <div className="bg-greenTheme p-2 rounded-full shadow-lg animate-pulse">
                                            <Star className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                )}
                                {isOnline && (
                                    <div className="absolute bottom-2 right-2">
                                        <div className="w-4 h-4 bg-green-500 rounded-full ring-2 ring-white" />
                                    </div>
                                )}
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 text-center md:text-left">
                                {userData?.firstName} {userData?.lastName}
                            </h1>
                            <p className="text-gray-600 mb-4">@{userData.userName}</p>

                            <div className="flex gap-3">
                                <button className="bg-greenTheme text-white px-6 py-2.5 rounded-full hover:bg-greenTheme/90 transition-all transform hover:-translate-y-0.5 hover:shadow-lg">
                                    Follow
                                </button>
                                <button className="bg-white text-gray-700 px-6 py-2.5 rounded-full border border-gray-200 hover:border-gray-300 transition-all transform hover:-translate-y-0.5 hover:shadow-lg">
                                    Message
                                </button>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button className="text-gray-500 hover:text-greenTheme transition-colors" title="Visit website">
                                    <Globe className="w-5 h-5" />
                                </button>
                                <button className="text-gray-500 hover:text-greenTheme transition-colors" title="Social links">
                                    <Link className="w-5 h-5" />
                                </button>
                                <button className="text-gray-500 hover:text-greenTheme transition-colors" title="Send email">
                                    <Mail className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Stats & Details */}
                        <div className="flex-1 w-full md:w-auto">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white p-4 rounded-xl shadow-sm text-center transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                                    <div className="font-bold text-xl text-gray-900">{animatedStats.friends}</div>
                                    <div className="text-gray-600">Friends</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm text-center transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                                    <div className="font-bold text-xl text-gray-900">{animatedStats.posts}</div>
                                    <div className="text-gray-600">Posts</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm text-center transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                                    <div className="font-bold text-xl text-gray-900">{animatedStats.following}</div>
                                    <div className="text-gray-600">Following</div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm text-center transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                                    <div className="font-bold text-xl text-gray-900">{animatedStats.followers}</div>
                                    <div className="text-gray-600">Followers</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                                    <MapPin className="w-4 h-4 text-greenTheme" />
                                    <span className="text-gray-700">{userData?.country}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                                    <Calendar className="w-4 h-4 text-greenTheme" />
                                    <span className="text-gray-700">
                                        Joined {new Date(userData?.createdAt?.seconds * 1000).getFullYear()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section with Custom Scrollbar */}
                    {userData?.bio && (
                        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 transition-all duration-300 hover:shadow-md">
                            <div className="max-h-32 overflow-y-auto custom-scrollbar">
                                <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};