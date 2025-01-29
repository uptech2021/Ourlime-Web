'use client';

import { useState, useEffect } from 'react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { ProfileImage, UserData } from '@/types/userTypes';
import { useProfileStore } from 'src/store/useProfileStore';
import ProfileHeader from '@/components/commonProfileHeader/ProfileHeader';
import { Search, MoreHorizontal, UserPlus, UserMinus, UserX, Flag, Filter, Ban, MessageSquare, Check, X, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { getFriends, getFollowers, getFollowing, unfriend, unfollow, getFriendRequests } from '@/helpers/friendsAndFollowingHelper';
import { auth } from '@/lib/firebaseConfig';
import { FriendWithDetails, FollowerWithDetails } from '@/types/friendTypes';
import { onAuthStateChanged } from 'firebase/auth';

export default function FriendsPage() {
    const [activeTab, setActiveTab] = useState('all friends');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const { profileImage, userImages } = useProfileStore();
    const [searchQuery, setSearchQuery] = useState('');

    const [friends, setFriends] = useState<FriendWithDetails[]>([]);
    const [followers, setFollowers] = useState<FollowerWithDetails[]>([]);
    const [following, setFollowing] = useState<FollowerWithDetails[]>([]);
    const [requests, setRequests] = useState<FriendWithDetails[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const friendsData = await getFriends(user.uid);
                const followersData = await getFollowers(user.uid);
                const followingData = await getFollowing(user.uid);
                const requestsData = await getFriendRequests(user.uid);

                setFriends(friendsData);
                setFollowers(followersData);
                setFollowing(followingData);
                setRequests(requestsData);
            }
        });

        return () => unsubscribe();
    }, []);

    const getFilteredData = () => {
        let data = [];
        switch (activeTab) {
            case 'all friends':
                data = friends;
                break;
            case 'followers':
                data = followers;
                break;
            case 'following':
                data = following;
                break;
            case 'requests':
                data = following;
                break;
            default:
                data = friends;
        }

        if (!searchQuery) return data;

        return data.filter(item => {
            const details = activeTab === 'all friends'
                ? item.friendDetails
                : item.userDetails;

            return details?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                details?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                details?.userName?.toLowerCase().includes(searchQuery.toLowerCase());
        });
    };

    const handleUnfriend = async (friendshipId: string) => {
        const success = await unfriend(friendshipId);
        if (success) {
            setFriends(prev => prev.filter(friend => friend.id !== friendshipId));
        }
    };

    const handleUnfollow = async (followerId: string, followeeId: string) => {
        const success = await unfollow(followerId, followeeId);
        if (success) {
            setFollowing(prev => prev.filter(follow =>
                follow.followerId !== followerId || follow.followeeId !== followeeId
            ));
        }
    };


    return (
        <div className="min-h-screen w-full bg-gray-50">
            <main className="h-[calc(100vh-10px)] pt-24 md:pt-24 lg:pt-32 w-full px-2 md:px-8">
                <div className="max-w-7xl mx-auto h-full">
                    <div className="flex flex-col lg:flex-row gap-4 h-full relative">
                        <div className="lg:sticky lg:top-32">
                            <ProfileSidebar
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                setIsSidebarOpen={setIsSidebarOpen}
                                isSidebarOpen={isSidebarOpen}
                                setUserData={setUserData}
                                setProfileImage={useProfileStore.getState().setProfileImage}
                            />
                        </div>
                        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto">
                            <ProfileHeader
                                onCustomizationSelect={(selectedImage: ProfileImage) => {
                                    setActiveTab('customize');
                                }}
                                userImages={userImages}
                            />

                            <div className="flex-1 overflow-y-auto min-h-0 mb-10">
                                <div className="p-4 md:p-6">
                                    <div className="flex items-center mb-8">
                                        <div className="flex-1 overflow-x-auto no-scrollbar">
                                            <div className="flex gap-2 min-w-max">
                                                {['all friends', 'following', 'followers', 'requests'].map((tab) => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setActiveTab(tab)}
                                                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === tab
                                                            ? 'bg-greenTheme text-white shadow-lg shadow-green-200'
                                                            : 'bg-white text-gray-600 hover:bg-green-50'
                                                            }`}
                                                    >
                                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 ml-4">
                                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full hover:bg-green-50 transition-colors">
                                                <UserPlus size={18} />
                                                <span className="hidden md:inline">Add Friend</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative mb-8">
                                        <div className="max-w-2xl mx-auto flex gap-3">
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Search className="text-gray-400" size={20} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Search friends..."
                                                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-full border-none focus:ring-2 focus:ring-green-100"
                                                />
                                            </div>
                                            <button className="flex items-center gap-2 px-6 py-3.5 bg-white rounded-full hover:bg-green-50 transition-colors">
                                                <Filter size={18} />
                                                <span className="hidden md:inline">Filter</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8 w-full overflow-x-hidden">
                                        {/* All Friends Section */}
                                        {activeTab === 'all friends' && friends.map((friend) => (
                                            <div key={friend.id} className="w-full bg-white p-4 sm:p-5 md:p-6 rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-100 gap-4 sm:gap-0">
                                                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                                    <div className="relative w-14 sm:w-16 h-14 sm:h-16 flex-shrink-0">
                                                        <Image
                                                            src={friend.friendDetails?.profileImage || "/images/default-avatar.jpg"}
                                                            alt={`${friend.friendDetails?.firstName}'s profile`}
                                                            fill
                                                            className="object-cover rounded-full"
                                                            unoptimized={true}
                                                            loader={({ src }) => src}
                                                        />
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                                    </div>
                                                    <div className="flex-1 min-w-0 max-w-full">
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {friend.friendDetails?.firstName} {friend.friendDetails?.lastName}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 truncate">@{friend.friendDetails?.userName}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-xs text-gray-400">{friend.mutualFriendsCount} mutuals</p>
                                                            <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
                                                                {friend.typeOfFriendship || 'Friend'}
                                                            </span>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                    <button className="flex items-center gap-1 px-4 py-2 text-sm bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap">
                                                        <MessageSquare size={16} />
                                                        Message
                                                    </button>
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <button className="p-2 border border-gray-200 rounded-lg hover:border-greenTheme transition-colors" aria-label="More options">
                                                                <MoreHorizontal size={18} className="text-gray-600" />
                                                            </button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Friend actions">
                                                            <DropdownItem className="text-gray-700 hover:text-red-600">
                                                                <div className="flex items-center gap-2">
                                                                    <UserMinus size={16} />
                                                                    <span>Unfriend</span>
                                                                </div>
                                                            </DropdownItem>
                                                            <DropdownItem className="text-gray-700 hover:text-red-600">
                                                                <div className="flex items-center gap-2">
                                                                    <Ban size={16} />
                                                                    <span>Block</span>
                                                                </div>
                                                            </DropdownItem>
                                                            <DropdownItem className="text-gray-700 hover:text-orange-600">
                                                                <div className="flex items-center gap-2">
                                                                    <Flag size={16} />
                                                                    <span>Report</span>
                                                                </div>
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Following Section */}
                                        {activeTab === 'following' && following.map((follow) => (
                                            <div key={follow.id} className="w-full bg-white p-4 sm:p-5 md:p-6 rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-100 gap-4 sm:gap-0">
                                                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                                    <div className="relative w-14 sm:w-16 h-14 sm:h-16 flex-shrink-0">
                                                        <Image
                                                            src={follow.userDetails?.profileImage || "/images/default-avatar.jpg"}
                                                            alt={`${follow.userDetails?.firstName}'s profile`}
                                                            fill
                                                            className="object-cover rounded-full"
                                                            unoptimized={true}
                                                            loader={({ src }) => src}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0 max-w-full">
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {follow.userDetails?.firstName} {follow.userDetails?.lastName}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 truncate">@{follow.userDetails?.userName}</p>
                                                        <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">Following</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                    <button className="flex items-center gap-1 px-4 py-2 text-sm bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap">
                                                        <UserPlus size={16} />
                                                        Add Friend
                                                    </button>
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <button className="p-2 border border-gray-200 rounded-lg hover:border-greenTheme transition-colors" aria-label="More options">
                                                                <MoreHorizontal size={18} className="text-gray-600" />
                                                            </button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Following actions">
                                                            <DropdownItem className="text-gray-700 hover:text-red-600">
                                                                <div className="flex items-center gap-2">
                                                                    <UserMinus size={16} />
                                                                    <span>Unfollow</span>
                                                                </div>
                                                            </DropdownItem>
                                                            <DropdownItem className="text-gray-700 hover:text-red-600">
                                                                <div className="flex items-center gap-2">
                                                                    <Ban size={16} />
                                                                    <span>Block</span>
                                                                </div>
                                                            </DropdownItem>
                                                            <DropdownItem className="text-gray-700 hover:text-orange-600">
                                                                <div className="flex items-center gap-2">
                                                                    <Flag size={16} />
                                                                    <span>Report</span>
                                                                </div>
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Followers Section */}
                                        {activeTab === 'followers' && followers.map((follower) => (
                                            <div key={follower.id} className="w-full bg-white p-4 sm:p-5 md:p-6 rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-100 gap-4 sm:gap-0">
                                                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                                    <div className="relative w-14 sm:w-16 h-14 sm:h-16 flex-shrink-0">
                                                        <Image
                                                            src={follower.userDetails?.profileImage || "/images/default-avatar.jpg"}
                                                            alt={`${follower.userDetails?.firstName}'s profile`}
                                                            fill
                                                            className="object-cover rounded-full"
                                                            unoptimized={true}
                                                            loader={({ src }) => src}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0 max-w-full">
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {follower.userDetails?.firstName} {follower.userDetails?.lastName}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 truncate">@{follower.userDetails?.userName}</p>
                                                        <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">Follower</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                    <button className="flex items-center gap-1 px-4 py-2 text-sm bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap">
                                                        <UserPlus size={16} />
                                                        Follow Back
                                                    </button>
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <button className="p-2 border border-gray-200 rounded-lg hover:border-greenTheme transition-colors" aria-label="More options">
                                                                <MoreHorizontal size={18} className="text-gray-600" />
                                                            </button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Follower actions">
                                                            <DropdownItem className="text-gray-700">
                                                                <div className="flex items-center gap-2">
                                                                    <UserPlus size={16} />
                                                                    <span>Add Friend</span>
                                                                </div>
                                                            </DropdownItem>
                                                            <DropdownItem className="text-gray-700 hover:text-red-600">
                                                                <div className="flex items-center gap-2">
                                                                    <Ban size={16} />
                                                                    <span>Block</span>
                                                                </div>
                                                            </DropdownItem>
                                                            <DropdownItem className="text-gray-700 hover:text-orange-600">
                                                                <div className="flex items-center gap-2">
                                                                    <Flag size={16} />
                                                                    <span>Report</span>
                                                                </div>
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Requests Section */}
                                        {activeTab === 'requests' && requests.map((request) => (
                                            <div key={request.id} className="w-full bg-white p-4 sm:p-5 md:p-6 rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-100 gap-4 sm:gap-0">
                                                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                                    <div className="relative w-14 sm:w-16 h-14 sm:h-16 flex-shrink-0">
                                                        <Image
                                                            src={request.friendDetails?.profileImage || "/images/default-avatar.jpg"}
                                                            alt={`${request.friendDetails?.firstName}'s profile`}
                                                            fill
                                                            className="object-cover rounded-full"
                                                            unoptimized={true}
                                                            loader={({ src }) => src}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0 max-w-full">
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {request.friendDetails?.firstName} {request.friendDetails?.lastName}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 truncate">@{request.friendDetails?.userName}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-xs text-gray-400">{request.mutualFriendsCount} mutual friends</p>
                                                            <span className="text-xs px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-full">Pending</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                                    <button className="flex items-center gap-1 px-4 py-2 text-sm bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap">
                                                        <Check size={16} />
                                                        Accept
                                                    </button>
                                                    <button className="flex items-center gap-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap">
                                                        <X size={16} />
                                                        Decline
                                                    </button>
                                                    <Dropdown>
                                                        <DropdownTrigger>
                                                            <button className="p-2 border border-gray-200 rounded-lg hover:border-greenTheme transition-colors" aria-label="More options">
                                                                <MoreHorizontal size={18} className="text-gray-600" />
                                                            </button>
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Request actions">
                                                            <DropdownItem className="text-gray-700 hover:text-red-600">
                                                                <div className="flex items-center gap-2">
                                                                    <Ban size={16} />
                                                                    <span>Block</span>
                                                                </div>
                                                            </DropdownItem>
                                                            <DropdownItem className="text-gray-700 hover:text-orange-600">
                                                                <div className="flex items-center gap-2">
                                                                    <AlertTriangle size={16} />
                                                                    <span>Report Spam</span>
                                                                </div>
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

}
