'use client';
import Image from 'next/image';
import logo from '@/public/images/logo-long.png';
import ourlimeProfilePicture from '@/public/images/transparentLogo.png';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import MobileNavbar from './MobileNavbar';
import Link from 'next/link';
export default function Header({
	isDesktopOrLaptop,
}: {
	isDesktopOrLaptop: boolean;
}) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen((prev) => !prev);
	};
	return (
		<>
			<header className="flex flex-row items-center justify-between p-5">
				<div className="flex flex-row items-center gap-3">
					{!isDesktopOrLaptop && (
						<button type="button" title="menu" className="bg-none text-white" onClick={toggleMobileMenu}>
							<Menu color="white" />
						</button>
					)}
					<Link href="/">
						<div className="flex w-[50%] cursor-pointer items-center justify-center rounded-lg bg-gray-900 p-3">
							<Image
								src={logo}
								alt="logo"
								priority
								className="h-full w-full object-contain"
							/>
						</div>
					</Link>
				</div>

				<div className="flex w-[30%] cursor-pointer items-center justify-center rounded-full sm:w-[10%] lg:w-[5%]">
					<Image
						src={ourlimeProfilePicture}
						alt="profile"
						priority
						className="h-full w-full rounded-full object-contain"
					/>
				</div>
			</header>
			{!isDesktopOrLaptop && (
				<MobileNavbar isOpen={isMobileMenuOpen} toggle={toggleMobileMenu} />
			)}
		</>
	);
}
