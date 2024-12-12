'use client';
import { auth } from '@/firebaseConfig';
import { Avatar, Badge, Skeleton } from '@nextui-org/react';
import { onAuthStateChanged } from 'firebase/auth';
import { Bell, MessageSquareMore, Search, Settings, UserPlus, Wallet, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { User } from 'firebase/auth';
import { fetchProfile, handleSignOut } from '@/helpers/Auth';
import { ProfileData } from '@/types/global';

export default function Header() {
	    const pathname = usePathname();
			const [user, setUser] = useState<User | null>(null);
			const [profile, setProfile] = useState<ProfileData | null>(null);
			const [loading, setLoading] = useState(true);
			const [showDropdown, setShowDropdown] = useState(false);
			const dropdownRef = useRef<HTMLDivElement>(null);
			const router = useRouter();

			useEffect(() => {
				const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
					setUser(currentUser);
					setLoading(false);

					if (currentUser) {
						const profileData = await fetchProfile(currentUser.uid);
						setProfile(profileData.data() as ProfileData);

					}
				});
				return () => unsubscribe();
			}, []);

			useEffect(() => {
				const handleClickOutside = (event: MouseEvent) => {
					if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
						setShowDropdown(false);
					}
				};

				document.addEventListener('mousedown', handleClickOutside);
				return () => document.removeEventListener('mousedown', handleClickOutside);
			}, []);

			if (loading || !profile) {
				return null;
			}

			if (
				pathname === '/login' ||
				pathname === '/register' ||
				pathname === '/forgot-password' ||
				!user ||
				(user && !user.emailVerified)
			) {
				return null;
			}
	return (
		<>
			{!pathname.startsWith('/admin') && (
				<header className="fixed top-0 left-0 right-0 z-50 flex flex-row items-center bg-[#1e2321] px-3 md:px-0">
					<Link href="/settings">
						<Settings className="cursor-pointer text-white lg:hidden" />
					</Link>


					<div className="mx-auto flex h-14 w-2/3 flex-row items-center gap-4">
						{/* Logo */}
						<div className="align-center w-15 h-15 flex cursor-pointer justify-center">
							<Link href="/">
								<Avatar
									size="md"
									radius="full"
									src="/images/logo.png"
									// showFallback
									disableAnimation={false}
								// fallback={
								//     <Skeleton className="w-12 h-12 rounded-full" />
								// }
								/>
							</Link>
						</div>

						{/* Search bar */}
						<div className="flex w-full flex-row rounded-md bg-[#0f1110] p-1">
							<Search className="cursor-pointer text-gray-500" />

							<input
								type="text"
								placeholder="Search for people, pages, groups and #hashtags"
								className="w-full bg-[#0f1110] px-1 text-sm text-white outline-none"
							/>
						</div>

						{/* Icons */}
						<div className="hidden flex-row items-center gap-2 sm:flex" >
							<UserPlus className="cursor-pointer text-white" />
							<MessageSquareMore className="cursor-pointer text-white" />
							<Bell className="cursor-pointer text-white" />

							<div className="relative" ref={dropdownRef}>
								<Badge
									content="5"
									color="danger"
									placement="top-right"
									shape="circle"
									
								>
									<Avatar
										className="h-8 w-8 cursor-pointer"
										isBordered
										radius="md"
										src={user.photoURL}
										disableAnimation={false}
										showFallback
										fallback={<Skeleton className="h-8 w-8 rounded-full" />}
										onClick={() => setShowDropdown(!showDropdown)}
									/>
								</Badge>

								{/* Dropdown Menu - increased z-index */}
								{showDropdown && (
									<div className="absolute -left-8 mt-2 w-28 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
										<div className="py-1">
											<Link href="/profile" 
												className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
												onClick={() => setShowDropdown(false)}
											>
												<Avatar
													className="mr-2 h-4 w-4"
													src={user.photoURL}
													size="sm"
												/>
												Profile
											</Link>
											<Link href="/settings" 
												className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
												onClick={() => setShowDropdown(false)}
											>
												<Settings className="mr-2 h-4 w-4" />
												Settings
											</Link>
											<Link href="/wallet" 
												className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
												onClick={() => setShowDropdown(false)}
											>
												<Wallet className="mr-2 h-4 w-4" />
												Wallet
											</Link>
											<button
												onClick={() => {
													setShowDropdown(false);
													handleSignOut(router);
												}}
												className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
											>
												<LogOut className="mr-2 h-4 w-4" />
												Sign Out
											</button>
										</div>
									</div>
								)}
							</div>
						</div>

					</div>
				</header>
			)}
		</>
	);
}
