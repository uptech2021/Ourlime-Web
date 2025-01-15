'use client';

import { auth, db } from '@/lib/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Search, MessageSquare, Bell, Settings, Compass, Menu, X, User, Wallet, Bookmark, HelpCircle, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { fetchUser } from '@/helpers/Auth';
import { usePathname } from 'next/navigation';

const noHeaderPages = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function Header(): JSX.Element {
    const pathname = usePathname();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
  
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
          const userSnap = await fetchUser(user.uid);
          const userData = userSnap?.data();
          setUserData(userData);
  
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
              setProfileImage(matchingImage.data());
            }
          }
        }
      });
  
      return () => unsubscribe();
    }, []);
  
    if (noHeaderPages.includes(pathname)) {
      return null;
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const ProfileDropdown = () => (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden focus:outline-none ring-2 ring-greenTheme ring-offset-2 transition-all duration-200"
            >
                {profileImage?.imageURL ? (
                    <Image
                        src={profileImage.imageURL}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        loader={({ src }) => src}
                        unoptimized={true}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200" />
                )}
            </button>

            {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl py-2 z-[1000] transform transition-all duration-200 ease-out">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <p className="text-lg font-semibold text-gray-800">{userData?.firstName} {userData?.lastName}</p>
                        <p className="text-sm text-gray-500">@{userData?.userName}</p>
                        <div className="mt-2 flex gap-4">
                            <span className="text-sm"><b>245</b> Friends</span>
                            <span className="text-sm"><b>128</b> Posts</span>
                        </div>
                    </div>

                    <div className="py-2">
                        <a href="/profile" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
                            <User className="w-5 h-5 mr-3 text-greenTheme" />
                            <span>View Profile</span>
                        </a>
                        <a href="/settings" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
                            <Settings className="w-5 h-5 mr-3 text-greenTheme" />
                            <span>Settings</span>
                        </a>
                        <a href="/wallet" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
                            <Wallet className="w-5 h-5 mr-3 text-greenTheme" />
                            <span>Wallet</span>
                        </a>
                        <a href="/saved" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
                            <Bookmark className="w-5 h-5 mr-3 text-greenTheme" />
                            <span>Saved Items</span>
                        </a>
                    </div>

                    <div className="border-t border-gray-100 py-2">
                        <a href="/help" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
                            <HelpCircle className="w-5 h-5 mr-3 text-greenTheme" />
                            <span>Help & Support</span>
                        </a>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-6 py-3 hover:bg-red-50 transition-colors text-red-600"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="fixed top-0 w-full z-50">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-3">
                    {/* Desktop Layout */}
                    <div className="hidden lg:flex items-center justify-between">
                        <div className="flex items-center">
                            <Image
                                src="/images/transparentLogo.png"
                                alt="Ourlime Logo"
                                width={40}
                                height={40}
                            />
                            <span className="ml-2 text-xl font-bold text-greenTheme">Ourlime</span>
                        </div>

                        <div className="flex-1 mx-8">
                            <div className="relative w-full max-w-xl mx-auto">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-gray-100 rounded-full px-12 py-2 outline-none focus:ring-2 focus:ring-greenTheme/20"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <button className="text-gray-600 hover:text-greenTheme transition-colors" title="Messages">
                                <MessageSquare size={24} />
                            </button>
                            <button className="text-gray-600 hover:text-greenTheme transition-colors" title="Notifications">
                                <Bell size={24} />
                            </button>
                            <button className="text-gray-600 hover:text-greenTheme transition-colors" title="Settings">
                                <Settings size={24} />
                            </button>
                            <button className="text-gray-600 hover:text-greenTheme transition-colors" title="Explore">
                                <Compass size={24} />
                            </button>
                            <ProfileDropdown />
                        </div>
                    </div>

                    {/* Tablet Layout */}
                    <div className="hidden md:flex lg:hidden items-center justify-between">
                        <div className="flex items-center">
                            <Image
                                src="/images/transparentLogo.png"
                                alt="Ourlime Logo"
                                width={36}
                                height={36}
                            />
                            <span className="ml-2 text-lg font-bold text-greenTheme">Ourlime</span>
                        </div>

                        <div className="flex-1 mx-4">
                            <div className="relative w-full max-w-md mx-auto">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-gray-100 rounded-full px-10 py-2 outline-none text-sm"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="text-gray-600 hover:text-greenTheme" title="Messages">
                                <MessageSquare size={22} />
                            </button>
                            <button className="text-gray-600 hover:text-greenTheme" title="Notifications">
                                <Bell size={22} />
                            </button>
                            <ProfileDropdown />
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="flex md:hidden items-center justify-between">
                        <div className="flex items-center">
                            <Image
                                src="/images/transparentLogo.png"
                                alt="Ourlime Logo"
                                width={32}
                                height={32}
                            />
                            <span className="ml-2 text-base font-bold text-greenTheme">Ourlime</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="text-gray-600 hover:text-greenTheme" title="Search">
                                <Search size={20} />
                            </button>
                            <button className="text-gray-600 hover:text-greenTheme" title="Notifications">
                                <Bell size={20} />
                            </button>
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="text-gray-600 hover:text-greenTheme"
                                title="Menu"
                            >
                                <Menu size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation - Desktop & Tablet */}
            <nav className="hidden md:block bg-white border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center space-x-8 overflow-x-auto scrollbar-hide">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700 hover:text-greenTheme hover:border-b-2 hover:border-greenTheme transition-colors duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                    <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl">
                        <div className="flex flex-col h-full">
                            <div className="p-4 flex justify-between items-center border-b">
                                <span className="font-semibold text-gray-900">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                    title="Close"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <div className="p-4">
                                    <ProfileDropdown />
                                </div>

                                <div className="py-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t p-4">
                                <div className="flex justify-around">
                                    <button className="text-gray-600 hover:text-greenTheme" title="Settings">
                                        <Settings size={24} />
                                    </button>
                                    <button className="text-gray-600 hover:text-greenTheme" title="Messages">
                                        <MessageSquare size={24} />
                                    </button>
                                    <button className="text-gray-600 hover:text-greenTheme" title="Explore">
                                        <Compass size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
