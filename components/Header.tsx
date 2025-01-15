'use client'
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, Bookmark, Compass, HelpCircle, LogOut, MessageSquare, Search, Settings, User, Wallet } from 'lucide-react';
import { ProfileImage, UserData } from '@/types/userTypes';

type HeaderProps = {
    profileImage: { imageURL: string } | null;
    userData: UserData | null;
    handleLogout: () => void;
};

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Events', href: '/events' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Communities', href: '/communities' },
    { name: 'Marketplace', href: '/marketplace' }
];

const Header = ({ userData, handleLogout }: HeaderProps) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [profileImage, setProfileImage] = useState<ProfileImage | null>(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsProfileDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed top-0 w-full z-50">
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                    <Image
                        src="/images/transparentLogo.png"
                        alt="Ourlime Logo"
                        width={40}
                        height={40}
                    />
                    <span className="ml-2 text-xl font-bold text-greenTheme">Ourlime</span>
                </div>

                {/* Search Bar */}
                <div className="flex-1 mx-8">
                    <div className="relative w-full max-w-xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-gray-100 rounded-full px-12 py-2 focus:outline-none focus:ring-2 focus:ring-greenTheme"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 border-none" size={20} />
                    </div>
                </div>

                {/* Navigation Items */}
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

                    {/* Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="w-10 h-10 rounded-full overflow-hidden focus:outline-none ring-2 ring-greenTheme ring-offset-2 transition-all duration-200"
                        >
                            	{userData?.profileImage ? (
					<Image
						src={userData.profileImage}
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
                            <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl py-2 z-50 transform transition-all duration-200 ease-out">
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
        

    );
};

export default Header;