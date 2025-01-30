'use client';

import { User, Wallet, Bookmark, HelpCircle, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useProfileStore } from 'src/store/useProfileStore';
import { auth } from '@/lib/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface ProfileDropdownProps {
    userData: any;
}

export default function ProfileDropdown({ userData }: ProfileDropdownProps) {
    const router = useRouter();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { profileImage, firstName, lastName, userName, friendsCount, postsCount } = useProfileStore();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
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
                        <p className="text-lg font-semibold text-gray-800" title='name'>
                            {firstName || userData?.firstName} {lastName || userData?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                            @{userName || userData?.userName}
                        </p>
                        <div className="mt-2 flex gap-4">
                            <span className="text-sm"><b>{friendsCount}</b> Friends</span>
                            <span className="text-sm"><b>{postsCount}</b> Posts</span>
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
}
