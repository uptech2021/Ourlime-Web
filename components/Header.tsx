'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useProfileStore } from 'src/store/useProfileStore';
import DesktopHeader from '@/components/header/DesktopHeader';
import TabletHeader from './header/TabletHeader';
import MobileHeader from './header/MobileHeader';
import Navigation from './header/Navigation';
import MobileMenu from './header/MobileMenu';

const noHeaderPages = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function Header(): JSX.Element {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { notifications } = useProfileStore();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Events', href: '/events' },
        { name: 'Jobs', href: '/jobs' },
        { name: 'Communities', href: '/communities' },
        { name: 'Marketplace', href: '/marketplace' }
    ];

    if (noHeaderPages.includes(pathname)) {
        return null;
    }

    return (
        <div className="fixed top-0 w-full z-50">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-3">
                    <DesktopHeader notifications={notifications} />

                    <TabletHeader notifications={notifications} />

                    <MobileHeader
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
