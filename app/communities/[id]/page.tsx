'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@nextui-org/react';
import { db, auth } from '@/lib/firebaseConfig';
import { Search, MessageSquare, Bell, Settings, Compass, Plus, Users, Calendar, X, LogOut, HelpCircle, Bookmark, Wallet, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

export default function CommunityDetailPage() {
    const router = useRouter();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const dropdownRef = useRef(null);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Events', href: '/events' },
        { name: 'Jobs', href: '/jobs' },
        { name: 'Communities', href: '/communities' },
        { name: 'Marketplace', href: '/marketplace' }
    ];

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
        <div className="min-h-screen bg-gray-50">
            <div className="fixed top-0 w-full z-50">
                <header className="bg-white shadow-md">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
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
                                    className="w-full bg-gray-100 rounded-full px-12 py-2 outline-none"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <button className="text-gray-600 hover:text-greenTheme" title="message square">
                                <MessageSquare size={24} />
                            </button>
                            <button className="text-gray-600 hover:text-greenTheme" title="bell">
                                <Bell size={24} />
                            </button>
                            <button className="text-gray-600 hover:text-greenTheme" title="settings">
                                <Settings size={24} />
                            </button>
                            <button className="text-gray-600 hover:text-greenTheme" title="compass">
                                <Compass size={24} />
                            </button>
                            <ProfileDropdown />
                        </div>
                    </div>
                </header>

                <nav className="bg-white border-t border-gray-200">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center items-center space-x-8 overflow-x-auto md:overflow-visible">
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
            </div>

            <main className="container mx-auto px-4 pt-36">
                <div className="grid grid-cols-12 gap-6 h-[calc(100vh-144px)]">
                    {/* Left Section - Community Info */}
                    <section className="col-span-3 bg-white rounded-lg shadow overflow-y-auto">
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-4">Community Info</h2>
                            {/* Community details will go here */}
                        </div>
                    </section>

                    {/* Middle Section - Posts Feed */}
                    <section className="col-span-6 bg-white rounded-lg shadow overflow-y-auto">
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-4">Posts</h2>
                            {/* Posts feed will go here */}
                        </div>
                    </section>

                    {/* Right Section - Members */}
                    <section className="col-span-3 bg-white rounded-lg shadow overflow-y-auto">
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-4">Members</h2>
                            {/* Members list will go here */}
                        </div>
                    </section>
                </div>
            </main>

        </div>
    );
}
