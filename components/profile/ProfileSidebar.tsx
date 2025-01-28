'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebaseConfig';
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { Settings, Users, Globe, Bookmark, ChevronLeft, ChevronRight, Camera, Video, UsersRound, Calendar, User, ImageIcon, CircleDot, Share2, Twitter, Instagram, Linkedin, Package, ChevronUp, ChevronDown, Briefcase } from 'lucide-react';
import { ProfileImage, UserData } from '@/types/userTypes';
import { onAuthStateChanged } from 'firebase/auth';
import { useProfileStore } from 'src/store/useProfileStore';
import { usePathname } from 'next/navigation';

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
    {
        id: 'products',
        label: 'Products',
        icon: Package,
        href: '#',
        subItems: [
            { id: 'add-product', label: 'Add Product', href: '/profile/products/add' },
            { id: 'update-product', label: 'Update Product', href: '/profile/products/update' }
        ]
    },
    {
        id: 'jobs',
        label: 'Jobs',
        icon: Briefcase,
        href: '#',
        subItems: [
            { id: 'add-job', label: 'Post New Job', href: '/profile/jobs/add' },
            { id: 'manage-jobs', label: 'Manage Jobs', href: '/profile/jobs/manage' }
        ]
    },
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
    const { profileImage, firstName, lastName, userName } = useProfileStore();
    const [friendsCount, setFriendsCount] = useState(0);
    const [postsCount, setPostsCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const pathname = usePathname();
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

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

    useEffect(() => {
        const currentSection = sidebarItems.find(item =>
            item.subItems?.some(subItem => pathname === subItem.href)
        );
        if (currentSection) {
            setExpandedItem(currentSection.id);
        }
    }, [pathname]);

    const handleItemClick = (item) => {
        if (item.subItems) {
            setExpandedItem(expandedItem === item.id ? null : item.id);
        } else {
            setActiveTab(item.id);
        }
    };



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
                            {firstName || userData?.firstName} {lastName || userData?.lastName}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">@{userName || userData?.userName}</p>
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
                        <div key={item.id} className="mb-1">
                            {item.subItems ? (
                                <div>
                                    <button
                                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                            ${pathname.includes(item.id)
                                                ? 'bg-green-50 text-greenTheme border-l-4 border-greenTheme'
                                                : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={20}
                                                className={`flex-shrink-0 ${pathname.includes(item.id) ? 'text-greenTheme' : 'text-gray-400'}`}
                                            />
                                            {item.label}
                                        </div>
                                        <ChevronDown
                                            size={16}
                                            className={`transform transition-transform duration-200 
                                            ${expandedItem === item.id ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    <div className={`ml-8 mt-2 space-y-1 overflow-hidden transition-all duration-200
                                        ${expandedItem === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        {item.subItems.map((subItem) => (
                                            <Link
                                                key={subItem.id}
                                                href={subItem.href}
                                                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                                    ${pathname === subItem.href
                                                        ? 'text-greenTheme bg-green-50/50'
                                                        : 'text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                <div className="flex items-center w-full">
                                                    <span className={`w-1 h-6 rounded-full mr-3 transition-all duration-200
                                                    ${pathname === subItem.href ? 'bg-greenTheme' : 'bg-transparent'}`} />
                                                    {subItem.label}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                        ${pathname === item.href
                                            ? 'bg-green-50 text-greenTheme border-l-4 border-greenTheme'
                                            : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <item.icon size={20}
                                        className={`flex-shrink-0 ${pathname === item.href ? 'text-greenTheme' : 'text-gray-400'}`}
                                    />
                                    {item.label}
                                </Link>
                            )}
                        </div>
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
