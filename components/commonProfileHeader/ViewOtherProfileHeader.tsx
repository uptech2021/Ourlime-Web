'use client';

import Image from 'next/image';
import { UserData } from '@/types/userTypes';

interface ViewOtherProfileHeaderProps {
    userData: UserData | null;
}

export const ViewOtherProfileHeader = ({ userData }: ViewOtherProfileHeaderProps) => {
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

            <div className="px-4 md:px-6 lg:px-8">
                {/* Profile Picture and User Info */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 -mt-12 mb-6">
                    <div className="relative">
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
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 items-start md:items-center justify-between mt-2 md:mt-8 w-full">
                        <div>
                            <div className="flex flex-wrap items-center gap-4">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {userData?.firstName} {userData?.lastName}
                                </h1>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                    Online
                                </span>
                                
                                <div className="flex items-center gap-4">
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
                            <p className="text-gray-600 text-sm">@{userData?.userName}</p>
                        </div>

                        <div className="flex gap-2 mt-3 md:mt-0">
                            <button className="border border-gray-300 px-3 py-1 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                                Add Friend
                            </button>
                            <button className="border border-gray-300 px-3 py-1 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                                Follow
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mb-6 relative">
                    <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
                        {userData?.bio || "No bio available"}
                    </p>
                </div>
            </div>
        </div>
    );
};
