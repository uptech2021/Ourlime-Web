'use client';
import { auth } from '@/config/firebase';
import { Avatar, Badge, Skeleton } from '@nextui-org/react';
import { onAuthStateChanged } from 'firebase/auth';
import { Bell, MessageSquareMore, Search, Settings, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { fetchProfile } from '@/helpers/Auth';
import { ProfileData } from '@/types/global';

export default function Header() {
	    const pathname = usePathname();
			const [user, setUser] = useState<User | null>(null);
			const [profile, setProfile] = useState<ProfileData | null>(null);
			const [loading, setLoading] = useState(true);

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
				<header className="flex flex-row items-center bg-[#1e2321] px-3 md:px-0">
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
						<div className="hidden flex-row items-center gap-2 sm:flex">
							<UserPlus className="cursor-pointer text-white" />
							<MessageSquareMore className="cursor-pointer text-white" />
							<Bell className="cursor-pointer text-white" />

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
								/>
							</Badge>
						</div>

					</div>
				</header>
			)}
		</>
	);
}
