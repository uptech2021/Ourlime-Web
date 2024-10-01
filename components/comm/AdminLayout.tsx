'use client';
import Header from '@/components/admin/Header';
import PcNavbar from '@/components/admin/PcNavbar';
import { ReactNode, useEffect, useState } from 'react';
import TopNav from './TopNav';

export default function AdminLayout({ children }: { children: ReactNode }) {
	const [isDesktopOrLaptop, setIsDesktopOrLaptop] = useState<boolean | null>(
		null
	);

	useEffect(() => {
		const handleResize = () => {
			setIsDesktopOrLaptop( window.innerWidth >= 1024);
		};

		handleResize(); // Check initial screen width

		const debounceTimeout = setTimeout(() => {
			window.addEventListener('resize', handleResize);
		}, 500); // Delay adding the event listener by 500ms

		return () => {
			clearTimeout(debounceTimeout);
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	if (isDesktopOrLaptop === null) {
		return null; // Don't render anything until the screen width is determined
	}
	return (
		<div className="h-[100vh] overflow-x-hidden bg-[#222222]">
			<Header isDesktopOrLaptop={isDesktopOrLaptop} />

			<main className="relative flex h-[90vh] w-full flex-row">
				{isDesktopOrLaptop && <PcNavbar />}

				<div className="mx-auto w-[95%] overflow-y-scroll rounded-xl bg-[#f4f5fd] pt-5 lg:pl-8">
					<TopNav />
					{children}
				</div>
			</main>
		</div>
	);
}
