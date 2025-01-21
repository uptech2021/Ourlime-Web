'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebaseConfig';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Settings, Users, Globe, Bookmark, ChevronLeft, ChevronRight, Camera, Video, UsersRound, Calendar, User, ImageIcon, CircleDot, Share2, Twitter, Instagram, Linkedin } from 'lucide-react';
import { ProfileImage, UserData } from '@/types/userTypes';
import { onAuthStateChanged } from 'firebase/auth';
import { useProfileStore } from 'src/store/useProfileStore';

type ProfileSidebarProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    setIsSidebarOpen: (isOpen: boolean) => void;
    isSidebarOpen: boolean;
    setUserData: (data: UserData) => void;
    setProfileImage: (data: ProfileImage) => void;
}


export const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
    { id: 'posts', label: 'Posts', icon: ImageIcon, href: '/profile/posts' },
    { id: 'friends', label: 'Friends', icon: Users, href: '/profile/friends' },
    { id: 'photos', label: 'Photos', icon: Camera, href: '/profile/photos' },
    { id: 'videos', label: 'Videos', icon: Video, href: '/profile/videos' },
    { id: 'groups', label: 'Groups', icon: UsersRound, href: '/profile/groups' },
    { id: 'events', label: 'Events', icon: Calendar, href: '/profile/events' },
    { id: 'saved', label: 'Saved', icon: Bookmark, href: '/profile/saved' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/profile/settings' }
];

export default function ProfileSidebar({
    activeTab,
    setActiveTab,
    setIsSidebarOpen,
    isSidebarOpen,
    setUserData,
    setProfileImage
}: ProfileSidebarProps) {
    const [userData, setLocalUserData] = useState<UserData | null>(null);
    const { profileImage } = useProfileStore();
    const [friendsCount, setFriendsCount] = useState(0);
    const [postsCount, setPostsCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setLocalUserData(data as UserData);
                    setUserData(data as UserData);

                    const profileSetAsQuery = query(
                        collection(db, 'profileImageSetAs'),
                        where('userId', '==', user.uid),
                        where('setAs', '==', 'profile')
                    );
                    const setAsSnapshot = await getDocs(profileSetAsQuery);

                    if (!setAsSnapshot.empty) {
                        const setAsDoc = setAsSnapshot.docs[0].data();
                        const profileImageDoc = await getDoc(doc(db, 'profileImages', setAsDoc.profileImageId));


                        // In your useEffect, update this line:
                        if (profileImageDoc.exists()) {
                            const imageData = profileImageDoc.data();
                            useProfileStore.getState().setProfileImage({
                                id: profileImageDoc.id,
                                imageURL: imageData.imageURL,
                                userId: imageData.userId,
                                typeOfImage: 'profile',
                                createdAt: new Date(),
                                updatedAt: new Date()
                            });
                        }

                    }
                }
            }
        });

        return () => unsubscribe();
    }, [setUserData, setProfileImage]);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData(data as UserData);

                    // Friends Count
                    const friendshipRef = collection(db, 'friendship');
                    const friendshipQuery = query(
                        friendshipRef,
                        where('userId1', '==', user.uid),
                        where('friendshipStatus', '==', 'accepted')
                    );

                    // Posts Count
                    const postsRef = collection(db, 'feedPosts');
                    const postsQuery = query(postsRef, where('userId', '==', user.uid));

                    // Following Count
                    const followingRef = collection(db, 'followers');
                    const followingQuery = query(followingRef, where('followerId', '==', user.uid));

                    const unsubscribeFriends = onSnapshot(friendshipQuery, (snapshot) => {
                        setFriendsCount(snapshot.docs.length);
                    });

                    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
                        setPostsCount(snapshot.docs.length);
                    });

                    const unsubscribeFollowing = onSnapshot(followingQuery, (snapshot) => {
                        setFollowingCount(snapshot.docs.length);
                    });

                    return () => {
                        unsubscribeFriends();
                        unsubscribePosts();
                        unsubscribeFollowing();
                    };
                }
            }
        });

        return () => unsubscribe();
    }, [setUserData]);

    return (
        <>
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed left-0 top-[120px] bg-white p-2 rounded-r-lg shadow-md z-50"
            >
                {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>

            <div className={`
                fixed lg:relative
                top-10 lg:top-0
                left-0
                w-64
                h-[calc(100vh-20px)] lg:h-full
                bg-white rounded-lg shadow-sm
                flex flex-col
                transition-transform duration-300 ease-in-out
                z-40
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>

                <div className="p-4 border-b flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full overflow-hidden">
                                {profileImage?.imageURL ? (
                                    <Image
                                        src={profileImage.imageURL}
                                        alt="Profile"
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                        loader={({ src }) => src}
                                        unoptimized={true}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200" />
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white bg-green-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {userData?.firstName} {userData?.lastName}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">@{userData?.userName}</p>
                            <div className="flex gap-2">
                                <Link href="#" className="text-gray-400 hover:text-greenTheme transition-colors">
                                    <Twitter size={16} />
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-greenTheme transition-colors">
                                    <Instagram size={16} />
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-greenTheme transition-colors">
                                    <Linkedin size={16} />
                                </Link>
                                <Link href="#" className="text-gray-400 hover:text-greenTheme transition-colors">
                                    <Globe size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="p-4 overflow-y-auto flex-1 h-[calc(100vh-160px)]">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                            ${activeTab === item.id
                                    ? 'bg-greenTheme text-white'
                                    : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <item.icon size={20} className="flex-shrink-0" />
                            {item.label}
                        </Link>
                    ))}
                </nav>


                <div className="p-3 border-t">
                    <div className="flex gap-2 mb-3">
                        <button className="flex-1 bg-greenTheme text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                            Edit Profile
                        </button>
                        <button className="p-2 text-gray-600 hover:text-greenTheme hover:bg-green-50 rounded-lg transition-colors" title="share">
                            <Share2 size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                        <div className="text-center p-2 bg-gray-50 rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
                            <span className="block text-lg font-bold text-greenTheme">{friendsCount}</span>
                            <span className="text-xs text-gray-600">Friends</span>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
                            <span className="block text-lg font-bold text-greenTheme">{postsCount}</span>
                            <span className="text-xs text-gray-600">Posts</span>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
                            <span className="block text-lg font-bold text-greenTheme">{followingCount}</span>
                            <span className="text-xs text-gray-600">Following</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );



}
