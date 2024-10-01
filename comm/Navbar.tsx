"use client"

import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation';
import { handleSignOut } from '@/helpers/Auth';

interface NavbarProps {
    children: React.ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const router = useRouter();

    const handleToggleNav = () => setIsOpen(!isOpen);

    // Function to handle click events, conditionally triggering handleSignOut
    const handleClick = (link: string) => {
        if (link === 'Sign Out') handleSignOut(router);
    };


    return (
			<div>
				{children}

				<nav
					className={`fixed left-0 top-0 z-20 flex h-full w-[20rem] flex-col bg-[#027823] pl-8 pt-8 text-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
				>
					<h1 className="text-xl">OURLIME</h1>
					<ul className="mt-2">
						{[
							'Home',
							'Advertise',
							'Album',
							'Blog',
							'Jobs',
							'Market',
							'Profile',
							'Settings',
							'Wallet',
							'Sign Out',
						].map((link) => (
							<li key={link} className="py-2" onClick={() => handleClick(link)}>
								<Link
									href={
										link === 'Home'
											? '/'
											: `/${link.toLowerCase().replace(' ', '-')}${link === 'Settings' ? '/general' : ''}`
									}
								>
									{link}
								</Link>
							</li>
						))}
					</ul>

					<svg
						onClick={handleToggleNav}
						className="absolute bottom-0 right-0 cursor-pointer"
						width="50"
						height="50"
						viewBox="0 0 250 250"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M197.917 93.75V156.25"
							stroke="white"
							strokeWidth="19"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M156.25 93.7497H125V52.083L52.0833 125L125 197.916V156.25H156.25V93.7497Z"
							stroke="white"
							strokeWidth="19"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</nav>

				{/* Mobile Toggle Button */}
				<svg
					onClick={handleToggleNav}
					className="nav-arrow fixed bottom-0 left-0 z-20 mb-5 hidden cursor-pointer md:block"
					width="50"
					height="50"
					viewBox="0 0 250 250"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M52.083 93.75V156.25"
						stroke="#027823"
						strokeWidth="19"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M93.75 93.7502H125V52.0835L197.917 125L125 197.917V156.25H93.75V93.7502Z"
						stroke="#027823"
						strokeWidth="19"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
		);
}
