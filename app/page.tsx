'use client';

import { auth, db } from '@/lib/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UserData, ProfileImage, SearchUser, Post } from '@/types/userTypes';
import LeftSection from '@/components/home/LeftSection';
import UserModal from '@/components/home/LeftSection';
import RightSection from '@/components/home/RightSection';
import MiddleSection from '@/components/home/MiddleSection';
import { Compass, Grid, Search, User, UserPlus, X } from 'lucide-react';
import Image from 'next/image';


export default function Page() {
	const router = useRouter();
	const [profileImage, setProfileImage] = useState<ProfileImage | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [allUsers, setAllUsers] = useState<SearchUser[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<SearchUser[]>([]);
	const [posts, setPosts] = useState<Post[]>([]);
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
	const [showUserModal, setShowUserModal] = useState(false);
	const [isUserModalVisible, setIsUserModalVisible] = useState(false);
	

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
			console.log('TEST', userData);
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

	const handleUserClick = (user) => {
        setSelectedUser(user);
        setIsUserModalVisible(true);
    };



	const [activeTab, setActiveTab] = useState('feed');
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

	// Add this component inside your Page component
	const MobileNavigation = () => {
		return (
			<>
				{/* Bottom Navigation Bar */}
				<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden">
					<div className="flex justify-around items-center h-16">
						<button
							onClick={() => setActiveTab('feed')}
							className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'feed' ? 'text-greenTheme' : 'text-gray-500'
								}`}
						>
							<Grid size={24} />
							<span className="text-xs mt-1">Feed</span>
						</button>

						<button
							onClick={() => setActiveTab('profile')}
							className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'profile' ? 'text-greenTheme' : 'text-gray-500'
								}`}
						>
							<User size={24} />
							<span className="text-xs mt-1">Profile</span>
						</button>

						<button
							onClick={() => setActiveTab('discover')}
							className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'discover' ? 'text-greenTheme' : 'text-gray-500'
								}`}
						>
							<Compass size={24} />
							<span className="text-xs mt-1">Discover</span>
						</button>
					</div>
				</div>

				{/* Mobile Content Panels */}
				<div className={`
					fixed inset-0 
					bg-white 
					z-40 
					transition-transform duration-300 
					lg:hidden
					${activeTab !== 'feed' ? 'translate-x-0' : 'translate-x-full'}
				`}>
					{activeTab === 'profile' && (
						<div className="h-full overflow-y-auto pt-20 pb-16 px-4">
							{/* Profile Content (Section 1) */}
							<div className="flex flex-col items-center mb-4">
								<div className="w-24 h-24 rounded-full overflow-hidden mb-4">
									{profileImage?.imageURL ? (
										<Image
											src={profileImage.imageURL}
											alt={`${userData?.firstName}'s Profile Picture`}
											width={96}
											height={96}
											className="w-full h-full object-cover"
											priority
											unoptimized={true}
											loader={({ src }) => src}
										/>
									) : (
										<div className="w-full h-full bg-gray-200" />
									)}
								</div>
								<h3 className="text-xl font-semibold">{userData?.firstName} {userData?.lastName}</h3>
								<span className="text-gray-600">@{userData?.userName}</span>
							</div>

							{/* Stats */}
							<div className="grid grid-cols-3 gap-4 mb-6">
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<span className="block text-xl font-bold text-greenTheme">245</span>
									<span className="text-sm text-gray-600">Friends</span>
								</div>
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<span className="block text-xl font-bold text-greenTheme">128</span>
									<span className="text-sm text-gray-600">Posts</span>
								</div>
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<span className="block text-xl font-bold text-greenTheme">1.2k</span>
									<span className="text-sm text-gray-600">Following</span>
								</div>
							</div>

							{/* Users List */}
							<div className="space-y-2">
								<div className="relative mb-4">
									<input
										type="text"
										placeholder="Search users..."
										className="w-full px-10 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-greenTheme"
										value={searchTerm}
										onChange={handleSearch}
									/>
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
								</div>

								{filteredUsers.map((user) => (
									<div
										key={user.id}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
									>
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full overflow-hidden">
												{user.profileImage ? (
													<Image
														src={user.profileImage}
														alt={`${user.firstName}'s profile`}
														width={40}
														height={40}
														className="w-full h-full object-cover"
														loader={({ src }) => src}
														unoptimized={true}
													/>
												) : (
													<div className="w-full h-full bg-gray-200 flex items-center justify-center">
														<span className="text-sm text-gray-400">
															{user.firstName?.charAt(0)}
															{user.lastName?.charAt(0)}
														</span>
													</div>
												)}
											</div>
											<div>
												<p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
												<p className="text-sm text-gray-500">@{user.userName}</p>
											</div>
										</div>
										<button
											onClick={() => handleUserClick(user)}
											className="p-2 text-greenTheme hover:bg-green-50 rounded-full"
											title="plus"
										>
											<UserPlus size={20} />
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'discover' && (
						<div className="h-full overflow-y-auto pt-20 pb-16 px-4">
							{/* Communities Section */}
							<div className="mb-8">
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-xl font-bold">Communities</h2>
									<button className="text-greenTheme">See All</button>
								</div>
								<div className="grid grid-cols-2 gap-4">
									{[
										{ name: 'Tech Hub', members: '2.3k', image: 'https://picsum.photos/200/200?random=1' },
										{ name: 'Design Club', members: '1.5k', image: 'https://picsum.photos/200/200?random=2' },
										{ name: 'Startup Network', members: '3.1k', image: 'https://picsum.photos/200/200?random=3' },
										{ name: 'Dev Connect', members: '980', image: 'https://picsum.photos/200/200?random=4' }
									].map((community, index) => (
										<div key={index} className="relative rounded-lg overflow-hidden aspect-square">
											<Image
												src={community.image}
												alt={community.name}
												layout="fill"
												className="object-cover"
												unoptimized={true}
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
												<p className="text-white font-medium">{community.name}</p>
												<p className="text-gray-300 text-sm">{community.members} members</p>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Events Section */}
							<div className="mb-8">
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-xl font-bold">Upcoming Events</h2>
									<button className="text-greenTheme">View All</button>
								</div>
								<div className="space-y-4">
									{[
										{ title: 'Tech Conference 2024', date: 'Mar 15', image: 'https://picsum.photos/200/200?random=5' },
										{ title: 'Design Workshop', date: 'Mar 20', image: 'https://picsum.photos/200/200?random=6' },
										{ title: 'Startup Meetup', date: 'Mar 25', image: 'https://picsum.photos/200/200?random=7' }
									].map((event, index) => (
										<div key={index} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg">
											<Image
												src={event.image}
												alt={event.title}
												width={60}
												height={60}
												className="rounded-lg"
												unoptimized={true}
											/>
											<div>
												<p className="font-medium">{event.title}</p>
												<p className="text-gray-500 text-sm">{event.date}</p>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Jobs Section */}
							<div>
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-xl font-bold">Featured Jobs</h2>
									<button className="text-greenTheme">Browse All</button>
								</div>
								<div className="space-y-4">
									{[
										{ role: 'Senior Developer', company: 'TechCorp', location: 'Remote', image: 'https://picsum.photos/200/200?random=8' },
										{ role: 'UX Designer', company: 'DesignLabs', location: 'New York', image: 'https://picsum.photos/200/200?random=9' },
										{ role: 'Product Manager', company: 'StartupX', location: 'San Francisco', image: 'https://picsum.photos/200/200?random=10' }
									].map((job, index) => (
										<div key={index} className="border rounded-lg p-4">
											<div className="flex gap-4 items-center">
												<Image
													src={job.image}
													alt={job.company}
													width={48}
													height={48}
													className="rounded-lg"
													unoptimized={true}
												/>
												<div>
													<p className="font-medium">{job.role}</p>
													<p className="text-gray-600">{job.company}</p>
													<p className="text-gray-500 text-sm">{job.location}</p>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Close Button */}
					<button
						onClick={() => setActiveTab('feed')}
						className="absolute top-4 right-4 p-2 rounded-full bg-gray-100"
						title="close"
					>
						<X size={24} />
					</button>
				</div>
			</>
		);
	};
	return (
		<div className="min-h-screen w-full bg-gray-100">
			
  {/* Main content with three-column layout */}
  <main className="pt-36 w-full px-2 md:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,2fr)_1fr] 2xl:grid-cols-[1fr_minmax(0,3fr)_1fr] gap-4 lg:gap-4">
      <div>
        {/* Section 1: Profile Details - Fixed */}
        <LeftSection
          profileImage={profileImage}
          userData={userData}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          filteredUsers={filteredUsers}
          handleUserClick={handleUserClick}
          selectedUser={selectedUser}
		  setShowUserModal={setIsUserModalVisible}
        />
      </div>
      <div>
        {/* Section 2: Middle Section - New Component */}
        <MiddleSection posts={posts} user={userData} profileImage={profileImage} />
      </div>
      <div>
        {/* Section 3: Right Section */}
        <RightSection />
      </div>
    </div>

				<MobileNavigation />
			</main>
			</div>
			
	
	);
}