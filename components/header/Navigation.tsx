'use client';

import Link from 'next/link';

interface NavigationProps {
    navLinks: {
        name: string;
        href: string;
    }[];
}

export default function Navigation({ navLinks }: NavigationProps) {
    return (
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
    );
}
