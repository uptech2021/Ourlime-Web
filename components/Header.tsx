'use client';

import { auth, db } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { UserService } from '@/helpers/Auth';

import { usePathname } from 'next/navigation';
import { useProfileStore } from 'src/store/useProfileStore';
import { NotificationData } from '@/helpers/notificationHelper';
import { getNotifications } from '@/helpers/notificationHelper';
import DesktopHeader from '@/components/header/DesktopHeader';
import TabletHeader from './header/TabletHeader';
import MobileHeader from './header/MobileHeader';
import Navigation from './header/Navigation';
import MobileMenu from './header/MobileMenu';
import { collection, getDocs, query, where } from 'firebase/firestore';

const noHeaderPages = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function Header(): JSX.Element {
    const pathname = usePathname();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Events', href: '/events' },
        { name: 'Jobs', href: '/jobs' },
        { name: 'Communities', href: '/communities' },
        { name: 'Marketplace', href: '/marketplace' }
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userSnap = await UserService.fetchUser(user.uid);
                const userData = userSnap?.data();
                setUserData(userData);
    

                useProfileStore.getState().setFirstName(userData?.firstName);
                useProfileStore.getState().setLastName(userData?.lastName);
                useProfileStore.getState().setUserName(userData?.userName);
                
                // Fetch profile images and set profile image
                const profileImagesQuery = query(
                    collection(db, 'profileImages'),
                    where('userId', '==', user.uid)
                );
                const profileImagesSnapshot = await getDocs(profileImagesQuery);
    
                const profileSetAsQuery = query(
                    collection(db, 'profileImageSetAs'),
                    where('userId', '==', user.uid),
                    where('setAs', '==', 'profile')
                );
                const setAsSnapshot = await getDocs(profileSetAsQuery);
    
                if (!setAsSnapshot.empty) {
                    const setAsDoc = setAsSnapshot.docs[0].data();
                    const matchingImage = profileImagesSnapshot.docs
                        .find(img => img.id === setAsDoc.profileImageId);
                    if (matchingImage) {
                        const imageData = matchingImage.data();
                        useProfileStore.getState().setProfileImage({
                            id: matchingImage.id,
                            imageURL: imageData.imageURL,
                            userId: imageData.userId,
                            typeOfImage: 'profile',
                            createdAt: new Date(),
                            updatedAt: new Date()
                        });
                    }
                }
    
                // Fetch notifications
                const notifs = await getNotifications(user.uid);
                setNotifications(notifs);
    
                // Fetch friends count from both directions
                const [friendsQuery1, friendsQuery2] = [
                    query(
                        collection(db, 'friendship'),
                        where('userId1', '==', user.uid),
                        where('friendshipStatus', '==', 'accepted')
                    ),
                    query(
                        collection(db, 'friendship'),
                        where('userId2', '==', user.uid),
                        where('friendshipStatus', '==', 'accepted')
                    )
                ];
    
                const [friendsSnapshot1, friendsSnapshot2] = await Promise.all([
                    getDocs(friendsQuery1),
                    getDocs(friendsQuery2)
                ]);
    
                const totalFriendsCount = friendsSnapshot1.size + friendsSnapshot2.size;
                useProfileStore.getState().setFriendsCount(totalFriendsCount);
    
                // Fetch posts count
                const postsQuery = query(
                    collection(db, 'feedPosts'),
                    where('userId', '==', user.uid)
                );
                const postsSnapshot = await getDocs(postsQuery);
                useProfileStore.getState().setPostsCount(postsSnapshot.size);
            }
        });
    
        return () => unsubscribe();
    }, []);
    
    if (noHeaderPages.includes(pathname)) {
        return null;
    }

    return (
        <div className="fixed top-0 w-full z-50">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-3">
                    <DesktopHeader
                        userData={userData}
                        notifications={notifications}
                    />
                    <TabletHeader
                        userData={userData}
                        notifications={notifications}
                    />
                    <MobileHeader
                        userData={userData}
                        notifications={notifications}
                        isMobileMenuOpen={isMobileMenuOpen}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                    />
                </div>
            </header>

            <Navigation navLinks={navLinks} />

            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[99999] bg-black bg-opacity-50">
                    <MobileMenu
                        navLinks={navLinks}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                    />
                </div>
            )}

        </div>
    );
}
