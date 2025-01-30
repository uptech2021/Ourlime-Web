'use client';

import { Settings, MessageSquare, Compass, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useProfileStore } from 'src/store/useProfileStore';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/helpers/Auth';


interface MobileMenuProps {
    navLinks: {
        name: string;
        href: string;
    }[];
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({ navLinks, setIsMobileMenuOpen }: MobileMenuProps) {
    const router = useRouter();

    const {
        profileImage,
        firstName,
        lastName,
        userName,
        friendsCount,
        postsCount
    } = useProfileStore();

    return (
        <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-[9999]">
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
                    {/* User Profile Section */}
                    <div className="p-6 border-b">
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-greenTheme ring-offset-2">
                                <Image
                                    src={profileImage?.imageURL || "/images/default-avatar.jpg"}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                    loader={({ src }) => src}
                                    unoptimized={true}
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {firstName} {lastName}
                                </h3>
                                <p className="text-sm text-gray-500">@{userName}</p>
                                <div className="flex gap-4 mt-2">
                                    <span className="text-sm"><b>{friendsCount}</b> Friends</span>
                                    <span className="text-sm"><b>{postsCount}</b> Posts</span>
                                </div>
                            </div>
                        </div>

                        {/* Profile Actions */}
                        <div className="mt-4 flex gap-2">
                            <Link
                                href="/profile"
                                className="flex-1 px-4 py-2 bg-greenTheme text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                View Profile
                            </Link>
                            <button
                                onClick={() => AuthService.signOut(router)}
                                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="py-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="border-t p-4 mt-auto">
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

    );
}
