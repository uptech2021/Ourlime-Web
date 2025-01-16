'use client';

import { auth, db } from '@/lib/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UserData, ProfileImage, SearchUser, Post } from '@/types/userTypes';
import LeftSection from '@/components/home/LeftSection';
import RightSection from '@/components/home/RightSection'; // Import the RightSection component
import MiddleSection from '@/components/home/MiddleSection'; // Import the MiddleSection component


export default function Page() {
	const router = useRouter();
	const [profileImage, setProfileImage] = useState<ProfileImage | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [allUsers, setAllUsers] = useState<SearchUser[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<SearchUser[]>([]);
	const sliderRef = useRef<HTMLDivElement>(null);
	const [isDown, setIsDown] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);
	const [isPostModalOpen, setIsPostModalOpen] = useState(false);
	const [caption, setCaption] = useState('');
	const [description, setDescription] = useState('');
	const [visibility, setVisibility] = useState('public');
	const [posts, setPosts] = useState<Post[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);
	const [selectedShort, setSelectedShort] = useState<File | null>(null);
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
	const [showUserModal, setShowUserModal] = useState(false);




	const fetchAllUsers = async () => {
		const usersRef = collection(db, 'users');
		const snapshot = await getDocs(usersRef);

		const usersWithProfiles = await Promise.all(
			snapshot.docs.map(async (userDoc) => {
				const userData = userDoc.data();

				// Get user's profile image
				const profileImagesQuery = query(
					collection(db, 'profileImages'),
					where('userId', '==', userDoc.id)
				);
				const profileImagesSnapshot = await getDocs(profileImagesQuery);

				const profileSetAsQuery = query(
					collection(db, 'profileImageSetAs'),
					where('userId', '==', userDoc.id),
					where('setAs', '==', 'profile')
				);
				const setAsSnapshot = await getDocs(profileSetAsQuery);

				let profileImageUrl = null;
				if (!setAsSnapshot.empty) {
					const setAsDoc = setAsSnapshot.docs[0].data();
					const matchingImage = profileImagesSnapshot.docs
						.find(img => img.id === setAsDoc.profileImageId);
					if (matchingImage) {
						profileImageUrl = matchingImage.data().imageURL;
					}
				}

				return {
					id: userDoc.id,
					firstName: userData.firstName,
					lastName: userData.lastName,
					userName: userData.userName,
					profileImage: profileImageUrl
				};
			})
		);

		setAllUsers(usersWithProfiles);
		setFilteredUsers(usersWithProfiles);
	};


	const fetchUserData = async (userId: string) => {
		setIsLoading(true);
		try {
			console.log('Starting data fetch for user:', userId);

			const userDoc = await getDoc(doc(db, 'users', userId));
			if (!userDoc.exists()) {
				console.log('User document not found');
				setIsLoading(false);
				return null;
			}

			const userDataFromDb = userDoc.data();
			console.log('User data retrieved:', userDataFromDb);

			const profileImagesQuery = query(
				collection(db, 'profileImages'),
				where('userId', '==', userId)
			);
			const profileImagesSnapshot = await getDocs(profileImagesQuery);
			const userProfileImages = profileImagesSnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}));
			console.log('All user profile images:', userProfileImages);

			const profileSetAsQuery = query(
				collection(db, 'profileImageSetAs'),
				where('userId', '==', userId),
				where('setAs', '==', 'profile')
			);
			const setAsSnapshot = await getDocs(profileSetAsQuery);
			console.log('Profile SetAs documents:', setAsSnapshot.docs.map(doc => doc.data()));

			let profileImageData = null;

			if (!setAsSnapshot.empty) {
				const setAsDoc = setAsSnapshot.docs[0].data();
				console.log('Selected SetAs document:', setAsDoc);

				const matchingImage = userProfileImages.find(img => img.id === setAsDoc.profileImageId);

				if (matchingImage) {
					profileImageData = matchingImage;
					console.log('Matched profile image:', profileImageData);
					console.log('Direct imageURL check:', profileImageData.imageURL);
					setProfileImage(profileImageData);
				}
			}

			const userData = {
				id: userDoc.id,
				...userDataFromDb
			} as UserData;

			setUserData(userData);
			setIsLoading(false);

			return {
				userData,
				profileImage: profileImageData
			};

		} catch (error) {
			console.error('Error in fetchUserData:', error);
			setIsLoading(false);
			return {
				userData: null,
				profileImage: null
			};
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				fetchUserData(user.uid);
			} else {
				setIsLoading(false);
			}
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		fetchAllUsers();
	}, []);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const searchTerm = e.target.value.toLowerCase();
		setSearchTerm(searchTerm);

		const filtered = allUsers.filter(user =>
			user.userName.toLowerCase().includes(searchTerm) ||
			user.firstName.toLowerCase().includes(searchTerm) ||
			user.lastName.toLowerCase().includes(searchTerm)
		);
		setFilteredUsers(filtered);
	};


	useEffect(() => {
		const fetchPosts = async () => {
			const postsRef = collection(db, 'feedPosts');
			const q = query(postsRef, orderBy('createdAt', 'desc'));
			const snapshot = await getDocs(q);

			const postsWithUserData = await Promise.all(
				snapshot.docs.map(async (postDoc) => {
					const postData = postDoc.data();

					// Fetch user data
					const userDocRef = doc(db, 'users', postData.userId);
					const userDocSnap = await getDoc(userDocRef);
					const userData = userDocSnap.data();

					// Get user's profile image
					const profileImagesQuery = query(
						collection(db, 'profileImages'),
						where('userId', '==', postData.userId)
					);
					const profileImagesSnapshot = await getDocs(profileImagesQuery);
					const profileSetAsQuery = query(
						collection(db, 'profileImageSetAs'),
						where('userId', '==', postData.userId),
						where('setAs', '==', 'profile')
					);
					const setAsSnapshot = await getDocs(profileSetAsQuery);

					let profileImage = null;
					if (!setAsSnapshot.empty) {
						const setAsDoc = setAsSnapshot.docs[0].data();
						const matchingImage = profileImagesSnapshot.docs
							.find(img => img.id === setAsDoc.profileImageId);
						if (matchingImage) {
							profileImage = matchingImage.data();
						}
					}

					// Fetch media for this post
					const mediaQuery = query(
						collection(db, 'feedsPostSummary'),
						where('feedsPostId', '==', postDoc.id)
					);
					const mediaSnapshot = await getDocs(mediaQuery);
					const media = mediaSnapshot.docs.map(doc => ({
						id: doc.id,
						...doc.data()
					}));

					return {
						id: postDoc.id,
						caption: postData.caption,
						description: postData.description,
						visibility: postData.visibility,
						createdAt: postData.createdAt.toDate(),
						userId: postData.userId,
						hashtags: postData.hashtags || [],
						media,
						user: {
							...userData,
							profileImage: profileImage?.imageURL,
						},
					} as unknown as Post;
				})
			);

			setPosts(postsWithUserData);
		};

		fetchPosts();
	}, []);


	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsProfileDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = async () => {
		try {
			await signOut(auth);
			router.push('/login');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	

	const handleUserClick = (user: UserData) => {
		setSelectedUser(user);
		setShowUserModal(true);
	};

	


	return (
		<div className="min-h-screen bg-gray-100">
				{/* Header */}

			


		

			{/* Main content with three-column layout */}
			<main className="pt-36 container mx-auto px-4 md:px-8">
				<div className="flex justify-between gap-8">
					{/* Section 1: Profile Details - Fixed */}
					<LeftSection
						profileImage={profileImage}
						userData={userData}
						searchTerm={searchTerm}
						handleSearch={handleSearch}
						filteredUsers={filteredUsers}
						handleUserClick={handleUserClick}
						selectedUser={selectedUser}
						
						
					/>


					{/* Section 2: Middle Section - New Component */}
					<MiddleSection posts={posts} user={userData} />
									
					
					<RightSection /> 
					
				</div>
			</main>

		</div>
	);
}