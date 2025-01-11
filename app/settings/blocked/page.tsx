'use client';
import SettingsSidebar from "@/components/settings/nav/page";
import { auth, db } from '@/lib/firebaseConfig';
import { ResizeListener } from '@/helpers/Resize';
import { useRouter } from 'next/navigation';
import { fetchProfile, fetchUser, loginRedirect } from '@/helpers/Auth';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';
import { ProfileData, UserData } from '@/types/global';
import AnimatedLogo from "@/components/AnimatedLoader";

export default function Blocked() {
	const router = useRouter();
	const [, setIsPc] = useState<boolean>(false);
	const [blockedUsers, setBlockedUsers] = useState<Array<{ userName: string, avatarUrl: string }>>([]);
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [user, setUser] = useState<UserData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const storage = getStorage();

	useEffect(() => {
		const initializeBlocked = async () => {
			try {
				const currentUser = await loginRedirect(router, true);
				if (currentUser) {
					const profileSnap = await fetchProfile(currentUser.uid);
					const userSnap = await fetchUser(currentUser.uid);
					setProfile(profileSnap.data() as ProfileData);
					setUser(userSnap.data() as UserData);

					const fetchBlockedUsers = async () => {
						const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
						const blockedArray = userDoc.data()?.blocked || [];
				
						const usersRef = collection(db, 'users');
						const q = query(usersRef, where('userName', 'in', blockedArray));
						const querySnapshot = await getDocs(q);
				
						const blockedUsersData = await Promise.all(querySnapshot.docs.map(async (doc) => {
							const userData = doc.data();
							const avatarRef = ref(storage, `images/${userData.id}_avatar.jpg`);
							let avatarUrl = '';
							try {
								avatarUrl = await getDownloadURL(avatarRef);
							} catch (error) {
								console.log(`No avatar found for user ${userData.userName}`);
							}
							return { userName: userData.userName, avatarUrl };
						}));
				
						setBlockedUsers(blockedUsersData);
					};

					fetchBlockedUsers();
				}
			} catch (error) {
				console.error('Error initializing blocked users:', error);
			} finally {
				setIsLoading(false);
			}
		};

		initializeBlocked();
		const cleanup = ResizeListener(setIsPc);
		return () => cleanup();
	}, [router, storage]);

	if (isLoading) {
		return <AnimatedLogo />;
	}

	if (!profile || !user) {
		return <AnimatedLogo />; 
	}

	return (
		<>
			<div className='flex flex-row bg-gray-200 min-h-screen'>
				<SettingsSidebar />
				<main className="flex flex-col text-center mx-auto">
					<div className="text-gray-600 bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] md:w-[40rem] mt-8">
						<h1 className="mx-auto text-left text-4xl font-bold text-gray-800 mb-10">
							Blocked Users
						</h1>
						{blockedUsers.length > 0 ? (
							<div className="flex flex-row flex-wrap gap-4 mt-4">
								{blockedUsers.map((user) => (
									<div key={user.userName} className="flex flex-col items-center">
										<button className="h-16 w-16 rounded-full overflow-hidden bg-yellow-200">
											{user.avatarUrl ? (
												<Image src={user.avatarUrl} alt={user.userName} width={64} height={64} />
											) : (
												<span>{user.userName[0]}</span>
											)}
										</button>
										<p className="text-sm mt-2 text-gray-800">{user.userName}</p>
									</div>
								))}
							</div>
						) : (
							<div className="mt-[6rem]">
								<button className="h-16 w-16 rounded-full bg-yellow-200 text-white"></button>
								<p className="text-ml mt-4 text-gray-800">No members to show.</p>
							</div>
						)}
					</div>
				</main>
			</div>
		</>
	);
}
