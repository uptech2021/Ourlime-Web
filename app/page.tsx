'use client';

import { auth, db, storage } from '@/firebaseConfig';
import { fetchProfile, fetchUser, loginRedirect } from '@/helpers/Auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef, MouseEvent, TouchEvent } from 'react';
import { handleSignOut } from '@/helpers/Auth';
import { useRouter } from 'next/navigation';
import { AtSign, Bell, ChevronLeft, ChevronRight, Compass, Globe, Hash, Heart, HelpCircle, LogOut, MessageCircle, MessageSquare, Plus, Search, Settings, Share, Smile, Upload, User, UserPlus, Wallet, X } from 'lucide-react';
import {
	Menu, Grid, Image as ImageIcon, Video,
	Music, FileText, Link2, Calendar, BarChart,
	BookOpen, Users, Newspaper, TrendingUp, Star,
	Bookmark
} from 'lucide-react';


import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';



interface UserData {
	id: string;
	firstName: string;
	lastName: string;
	userName: string;
	email: string;
	gender: string;
	birthday: string;
	country: string;
	isAdmin: boolean;
	last_loggedIn: Date;
	userTier: number;
	createdAt: Date;
}

interface ProfileImage {
	id: string;
	imageURL: string;
	userId: string;
	typeOfImage: string;
	createdAt: Date;
	updatedAt: Date;
}

interface SearchUser {
	id: string;
	userName: string;
	firstName: string;
	lastName: string;
	profileImage?: string;
}

interface Post {
	id: string;
	caption: string;
	description: string;
	visibility: string;
	createdAt: Date;
	userId: string;
	user: {
		firstName: string;
		lastName: string;
		userName: string;
		profileImage?: string;
	};
}

interface PostData {
	userId: string;
	caption: string;
	description: string;
	createdAt: Date;
	visibility: string;
}


interface User {
	id: string;
	firstName: string;
	lastName: string;
	userName: string;
	profileImage?: string;
}


export default function Page() {
	const router = useRouter();
	const [profileImage, setProfileImage] = useState<ProfileImage | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [allUsers, setAllUsers] = useState<SearchUser[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<SearchUser[]>([]);

	const navLinks = [
		{ name: 'Home', href: '/' },
		{ name: 'Blogs', href: '/blogs' },
		{ name: 'Events', href: '/events' },
		{ name: 'Jobs', href: '/jobs' },
		{ name: 'Communities', href: '/communities' },
		{ name: 'Marketplace', href: '/marketplace' }
	];

	const feedFilters = [
		{ name: '', icon: Menu },
		{ name: 'All', icon: Grid },
		{ name: 'Photos', icon: ImageIcon },
		{ name: 'Videos', icon: Video },
		{ name: 'Sound', icon: Music },
		{ name: 'Documents', icon: FileText },
		{ name: 'Links', icon: Link2 },
		{ name: 'Events', icon: Calendar },
		{ name: 'Polls', icon: BarChart },
		{ name: 'Stories', icon: BookOpen },
		{ name: 'Groups', icon: Users },
		{ name: 'Blogs', icon: FileText },
		{ name: 'News', icon: Newspaper },
		{ name: 'Trending', icon: TrendingUp },
		{ name: 'Favorites', icon: Star },
		{ name: 'Saved', icon: Bookmark }
	];


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


	// Slider states and refs
	const sliderRef = useRef<HTMLDivElement>(null);
	const [isDown, setIsDown] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);

	// Mouse event handlers
	const mouseDown = (e: React.MouseEvent) => {
		setIsDown(true);
		if (sliderRef.current) {
			sliderRef.current.style.cursor = 'grabbing';
			setStartX(e.pageX - sliderRef.current.offsetLeft);
			setScrollLeft(sliderRef.current.scrollLeft);
		}
	};

	const mouseLeave = () => {
		setIsDown(false);
		if (sliderRef.current) {
			sliderRef.current.style.cursor = 'grab';
		}
	};

	const mouseUp = () => {
		setIsDown(false);
		if (sliderRef.current) {
			sliderRef.current.style.cursor = 'grab';
		}
	};

	const mouseMove = (e: React.MouseEvent) => {
		if (!isDown) return;
		e.preventDefault();
		if (sliderRef.current) {
			const x = e.pageX - sliderRef.current.offsetLeft;
			const walk = (x - startX) * 2;
			sliderRef.current.scrollLeft = scrollLeft - walk;
		}
	};

	// Touch event handlers
	const touchStart = (e: React.TouchEvent) => {
		setIsDown(true);
		if (sliderRef.current) {
			setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
			setScrollLeft(sliderRef.current.scrollLeft);
		}
	};

	const touchMove = (e: React.TouchEvent) => {
		if (!isDown) return;
		e.preventDefault();
		if (sliderRef.current) {
			const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
			const walk = (x - startX) * 2;
			sliderRef.current.scrollLeft = scrollLeft - walk;
		}
	};

	const sliderStyles = {
		userSelect: 'none',
		WebkitUserSelect: 'none',
		MozUserSelect: 'none',
		msUserSelect: 'none'
	} as const;


	const [isPostModalOpen, setIsPostModalOpen] = useState(false);


	// Add these states for form handling
	const [caption, setCaption] = useState('');
	const [description, setDescription] = useState('');
	const [visibility, setVisibility] = useState('public');


	const handleCreatePost = async () => {
		if (!auth.currentUser) return;

		const captionInput = document.getElementById('caption-input') as HTMLInputElement;
		const descriptionInput = document.getElementById('description-input') as HTMLTextAreaElement;

		try {
			const postData = {
				caption: captionInput.value,
				description: descriptionInput.value,
				visibility: visibility,
				createdAt: new Date(),
				userId: auth.currentUser.uid
			};

			const postRef = collection(db, 'feedPosts');
			await addDoc(postRef, postData);

			// Reset form
			captionInput.value = '';
			descriptionInput.value = '';
			setVisibility('public');
			setIsPostModalOpen(false);

		} catch (error) {
			console.error('Error creating post:', error);
		}
	};


	const CreatePostModal = () => {


		const handlePost = async () => {
			const captionInput = document.getElementById('caption-input') as HTMLInputElement;
			const descriptionInput = document.getElementById('description-input') as HTMLTextAreaElement;

			// Create post document
			const postData = {
				caption: captionInput.value,
				description: descriptionInput.value,
				visibility: visibility,
				createdAt: new Date(),
				userId: auth.currentUser?.uid
			};

			try {
				// Create the post first
				const postRef = collection(db, 'feedPosts');
				const docRef = await addDoc(postRef, postData);

				// Handle file uploads
				if (selectedFiles.length > 0) {
					const uploadPromises = selectedFiles.map(async (file) => {
						const storageRef = ref(storage, `posts/${docRef.id}/${file.name}`);
						const uploadResult = await uploadBytes(storageRef, file);
						const downloadURL = await getDownloadURL(uploadResult.ref);

						return addDoc(collection(db, 'feedsPostSummary'), {
							type: file.type.split('/')[0],
							typeUrl: downloadURL,
							feedsPostId: docRef.id
						});
					});

					await Promise.all(uploadPromises);
				}

				// Reset form
				captionInput.value = '';
				descriptionInput.value = '';
				setSelectedFiles([]);
				setPreviews([]);
				setVisibility('public');
				setIsPostModalOpen(false);

			} catch (error) {
				console.error('Error creating post:', error);
			}
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
				onClick={() => setIsPostModalOpen(false)}
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
			>
				<div
					className="bg-white rounded-xl p-8 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto"
					onClick={(e) => e.stopPropagation()}
				>
					<button
						onClick={() => setIsPostModalOpen(false)}
						className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors"
						aria-label="Close modal"
					>
						<X size={24} />
					</button>

					<div className="flex items-center gap-4 mb-6">
						<div className="w-12 h-12 rounded-full overflow-hidden">
							{profileImage?.imageURL ? (
								<Image
									src={profileImage.imageURL}
									alt={`${userData?.firstName}'s profile picture`}
									width={48}
									height={48}
									className="w-full h-full object-cover"
									priority
									unoptimized={true}
									loader={({ src }) => src}
								/>
							) : (
								<div className="w-full h-full bg-gray-200" />
							)}
						</div>
						<div>
							<h3 id="modal-title" className="font-semibold">{userData?.firstName} {userData?.lastName}</h3>
							<div className="flex items-center gap-2">
								<Globe size={16} className="text-gray-500" />
								<select
									className="text-sm text-gray-600 border-none focus:outline-none"
									aria-label="Post visibility"
									value={visibility}
									onChange={(e) => setVisibility(e.target.value)}
								>
									<option value="public">Public</option>
									<option value="private">Private</option>
									<option value="friends">Friends Only</option>
								</select>

							</div>
						</div>
					</div>

					<input
						type="text"
						id="caption-input"
						placeholder="Add a caption..."
						className="w-full p-4 border rounded-lg mb-4 focus:outline-none focus:border-greenTheme"
						aria-label="Post caption"
					/>


					<textarea
						id="description-input"
						placeholder="Write a detailed description..."
						className="w-full p-4 border rounded-lg mb-4 h-32 resize-none focus:outline-none focus:border-greenTheme"
						aria-label="Post description"

					/>


					<div className="border-2 border-dashed rounded-lg p-8 mb-4">
						<input
							type="file"
							multiple
							accept="image/*,video/*"
							onChange={handleFileSelect}
							className="hidden"
							id="file-upload"
						/>
						<label htmlFor="file-upload" className="cursor-pointer">
							<div className="text-center">
								<Upload className="mx-auto text-gray-400 w-12 h-12" aria-hidden="true" />
								<p className="text-gray-600">Drag and drop media files here</p>
								<span className="text-sm text-gray-400">or</span>
								<button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
									Browse Files
								</button>
							</div>
						</label>

						{/* Preview Area */}
						{previews.length > 0 && (
							<div className="grid grid-cols-3 gap-4 mt-4">
								{previews.map((preview, index) => (
									<div key={index} className="relative">
										<Image
											src={preview}
											alt={`Preview ${index + 1}`}
											width={100}
											height={100}
											className="rounded-lg object-cover w-full h-24"
										/>
										<button
											onClick={() => removeFile(index)}
											className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
											title="delete"
										>

											<X size={16} />
										</button>
									</div>
								))}
							</div>
						)}
					</div>


					<div className="mb-4">
						<div className="flex items-center gap-2 mb-2">
							<Hash className="text-gray-500" aria-hidden="true" />
							<span className="font-medium">Hashtags</span>
						</div>
						<input
							type="text"
							placeholder="Add hashtags (separate with spaces)..."
							className="w-full p-3 border rounded-lg focus:outline-none focus:border-greenTheme"
							aria-label="Add hashtags"
						/>
						<ul className="flex flex-wrap gap-2 mt-2" role="list">
							<li className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">#example</li>
						</ul>
					</div>

					<div className="mb-6">
						<div className="flex items-center gap-2 mb-2">
							<AtSign className="text-gray-500" aria-hidden="true" />
							<span className="font-medium">References</span>
						</div>
						<input
							type="text"
							placeholder="@mention people..."
							className="w-full p-3 border rounded-lg focus:outline-none focus:border-greenTheme"
							aria-label="Mention people"
						/>
						<ul className="flex flex-wrap gap-2 mt-2" role="list">
							<li className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">@username</li>
						</ul>
					</div>

					<div className="flex items-center justify-between pt-4 border-t">
						<div className="flex items-center gap-4">
							<button
								className="flex items-center gap-2 text-gray-600 hover:text-greenTheme"
								aria-label="Add gallery image"
							>
								<ImageIcon size={20} aria-hidden="true" />
								<span>Gallery</span>
							</button>
							<button
								className="flex items-center gap-2 text-gray-600 hover:text-greenTheme"
								aria-label="Add emoji"
							>
								<Smile size={20} aria-hidden="true" />
								<span>Emoji</span>
							</button>
							<button
								className="flex items-center gap-2 text-gray-600 hover:text-greenTheme"
								aria-label="Add video"
							>
								<Video size={20} aria-hidden="true" />
								<span>Video</span>
							</button>
						</div>
						<button
							onClick={handlePost}
							className="px-8 py-2 bg-greenTheme text-white rounded-full hover:bg-green-600 transition-colors"
							aria-label="Create post"
						>
							Post
						</button>
					</div>
				</div>
			</div>
		);
	};

	// Add this state at the top with other states
	const [posts, setPosts] = useState<Post[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);


	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const captionInput = document.getElementById('caption-input') as HTMLInputElement;
		const descriptionInput = document.getElementById('description-input') as HTMLTextAreaElement;

		// Store current input values
		const currentCaption = captionInput.value;
		const currentDescription = descriptionInput.value;

		if (e.target.files) {
			const files = Array.from(e.target.files);
			setSelectedFiles(prev => [...prev, ...files]);

			// Create previews for new files
			files.forEach(file => {
				const reader = new FileReader();
				reader.onloadend = () => {
					setPreviews(prev => [...prev, reader.result as string]);
				};
				reader.readAsDataURL(file);
			});
		}

		// Restore input values after state updates
		setTimeout(() => {
			captionInput.value = currentCaption;
			descriptionInput.value = currentDescription;
		}, 0);
	};


	// Handle file removal
	const removeFile = (index: number) => {
		setSelectedFiles(prev => prev.filter((_, i) => i !== index));
		setPreviews(prev => prev.filter((_, i) => i !== index));
	};



	// Add this useEffect to fetch posts
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
						...postData,
						media,
						user: {
							...userData,
							profileImage: profileImage?.imageURL
						}
					};
				})
			);

			setPosts(postsWithUserData);
		};

		fetchPosts();
	}, []);



	const PostMedia = ({ media }) => {
		const [activeIndex, setActiveIndex] = useState(0);

		return (
			<div className="relative h-[400px] mb-4">
				{/* Main Active Media */}
				<div className="relative w-full h-full">
					{media[activeIndex].type === 'image' ? (
						<Image
							src={media[activeIndex].typeUrl}
							alt="Post content"
							fill
							className="object-cover rounded-lg"
							loader={({ src }) => src}
							unoptimized={true}
						/>
					) : (
						<video controls className="w-full h-full object-cover rounded-lg">
							<source src={media[activeIndex].typeUrl} />
						</video>
					)}
				</div>

				{/* Overlay Slider */}
				<div className="absolute bottom-4 left-0 right-0 flex gap-2 px-4 overflow-x-auto">
					{media.map((item, index) => (
						<div
							key={index}
							onClick={() => setActiveIndex(index)}
							className={`relative w-16 h-16 rounded-lg cursor-pointer transition-all 
								${activeIndex === index ? 'opacity-100 ring-2 ring-greenTheme' : 'opacity-50'}`}
						>
							{item.type === 'image' ? (
								<Image
									src={item.typeUrl}
									alt={`Preview ${index + 1}`}
									fill
									className="object-cover rounded-lg"
									loader={({ src }) => src}
									unoptimized={true}
								/>
							) : (
								<video className="w-full h-full object-cover rounded-lg">
									<source src={item.typeUrl} />
								</video>
							)}
						</div>
					))}
				</div>
			</div>
		);
	};


	const PostCard = ({ post }: { post: Post }) => {
		return (
			<div className="bg-white rounded-lg shadow-md p-4 mb-4">
				{/* User Info Header */}
				<div className="flex items-center gap-3 mb-4">
					<div className="w-10 h-10 rounded-full overflow-hidden">
						{post.user.profileImage ? (
							<Image
								src={post.user.profileImage}
								alt={`${post.user.firstName}'s profile`}
								width={40}
								height={40}
								className="w-full h-full object-cover"
								priority
								unoptimized={true}
								loader={({ src }) => src}
							/>
						) : (
							<div className="w-full h-full bg-gray-200" />
						)}
					</div>
					<div>
						<h3 className="font-semibold">{post.user.firstName} {post.user.lastName}</h3>
						<span className="text-sm text-gray-500">@{post.user.userName}</span>
					</div>
				</div>


				{/* Caption */}
				{post.caption && (
					<p className="text-lg mb-3">{post.caption}</p>
				)}

				{/* Description */}
				{post.description && (
					<p className="text-gray-600 mb-4">{post.description}</p>
				)}

				{/* Media Content */}
				{post.media && post.media.length > 0 && (
					<PostMedia media={post.media} />
				)}

				{/* Hashtags */}
				{post.hashtags && (
					<div className="flex flex-wrap gap-2 mb-3">
						{post.hashtags.map((tag, index) => (
							<span key={index} className="text-greenTheme hover:underline cursor-pointer">
								#{tag}
							</span>
						))}
					</div>
				)}

				{/* User References */}
				{post.userReferences && (
					<div className="flex flex-wrap gap-2 mb-3">
						{post.userReferences.map((user, index) => (
							<span key={index} className="text-blue-500 hover:underline cursor-pointer">
								@{user}
							</span>
						))}
					</div>
				)}

				{/* Interaction Buttons */}
				<div className="flex items-center gap-4 pt-3 border-t">
					<button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
						<Heart size={20} />
						<span>Like</span>
					</button>
					<button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
						<MessageCircle size={20} />
						<span>Comment</span>
					</button>
					<button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
						<Share size={20} />
						<span>Share</span>
					</button>
				</div>
			</div>
		);
	};

	const [selectedShort, setSelectedShort] = useState<File | null>(null);



	const ShortsSection = () => {
		const [shortFile, setShortFile] = useState<File | null>(null);
		const [previewUrl, setPreviewUrl] = useState<string | null>(null);
		const [isUploading, setIsUploading] = useState(false);

		const handleShortSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.files?.[0]) {
				const file = e.target.files[0];
				setShortFile(file);

				// Create preview URL immediately
				const url = URL.createObjectURL(file);
				setPreviewUrl(url);

				// For videos, generate thumbnail
				if (file.type.startsWith('video/')) {
					const video = document.createElement('video');
					video.src = url;
					video.onloadeddata = () => {
						video.currentTime = 0;
						const canvas = document.createElement('canvas');
						canvas.width = video.videoWidth;
						canvas.height = video.videoHeight;
						const ctx = canvas.getContext('2d');
						ctx?.drawImage(video, 0, 0);
						const thumbnailUrl = canvas.toDataURL();
						setPreviewUrl(thumbnailUrl);
					};
				}
			}
		};



		const handleUploadShort = async () => {
			if (!shortFile || !auth.currentUser) return;

			setIsUploading(true);
			const storageRef = ref(storage, `shorts/${auth.currentUser.uid}/${shortFile.name}`);

			try {
				const uploadResult = await uploadBytes(storageRef, shortFile);
				const downloadURL = await getDownloadURL(uploadResult.ref);

				await addDoc(collection(db, 'shorts'), {
					typeUrl: downloadURL,
					userId: auth.currentUser.uid,
					createdAt: new Date()
				});

				setShortFile(null);
				setPreviewUrl(null);
				setIsUploading(false);
			} catch (error) {
				console.error('Error uploading short:', error);
				setIsUploading(false);
			}
		};

		const [shorts, setShorts] = useState([]);

		useEffect(() => {
			const fetchShorts = async () => {
				try {
					const shortsRef = collection(db, 'shorts');
					const q = query(shortsRef, orderBy('createdAt', 'desc'));
					const snapshot = await getDocs(q);

					const shortsData = await Promise.all(
						snapshot.docs.map(async (docSnapshot) => {
							const shortData = docSnapshot.data();
							const userDocRef = doc(db, 'users', shortData.userId);
							const userDoc = await getDoc(userDocRef);
							const userData = userDoc.data();

							return {
								id: docSnapshot.id,
								...shortData,
								userName: userData?.userName,
								firstName: userData?.firstName,
								lastName: userData?.lastName
							};
						})
					);

					setShorts(shortsData);
				} catch (error) {
					console.log('Error fetching shorts:', error);
				}
			};

			fetchShorts();
		}, []);

		return (
			<div className="mb-8">
				<h2 className="text-lg font-bold mb-4">Moments</h2>
				<div className="relative">
					<div className="flex space-x-4 overflow-x-auto scrollbar-hide">
						<div className="flex-shrink-0 w-32 aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
							{!shortFile ? (
								<>
									<input
										type="file"
										accept="image/*,video/*"
										onChange={handleShortSelect}
										className="hidden"
										id="short-upload"
									/>
									<label
										htmlFor="short-upload"
										className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
									>
										<Plus className="w-8 h-8 text-gray-500" />
										<span className="text-sm text-gray-500 mt-2">Add Short</span>
									</label>
								</>
							) : (
								<div className="relative w-full h-full">
									{previewUrl && (
										<Image
											src={previewUrl}
											alt="Short preview"
											fill
											className="object-cover"
											loader={({ src }) => src}
											unoptimized={true}
										/>
									)}
									<button
										onClick={handleUploadShort}
										className="absolute inset-0 bg-black bg-opacity-50 text-white flex flex-col items-center justify-center"
										disabled={isUploading}
									>
										{isUploading ? (
											<span>Uploading...</span>
										) : (
											<>
												<Upload className="w-8 h-8" />
												<span className="text-sm mt-2">Upload Short</span>
											</>
										)}
									</button>
								</div>
							)}
						</div>

						{/* Shorts preview tiles */}
						{shorts.map((short) => (
							<div
								key={short.id}
								className="flex-shrink-0 w-32 h-64 relative mb-14"
							>
								<div className="h-full rounded-lg overflow-hidden">
									{short.typeUrl.includes('.mp4') ? (
										<video
											src={short.typeUrl}
											className="w-full h-full object-cover rounded-lg"
											controls
											muted
											loop
										/>
									) : (
										<Image
											src={short.typeUrl}
											alt="Short preview"
											fill
											className="object-cover rounded-lg"
											loader={({ src }) => src}
											unoptimized={true}
										/>
									)}
								</div>

								<div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg">
									<Image
										src="/images/transparentLogo.png"
										alt="Ourlime Logo"
										width={48}
										height={48}
										className="w-full h-full object-contain"
									/>
								</div>

								<div className="absolute -bottom-14 left-0 right-0 text-center">
									<span className="text-sm font-medium text-gray-800">@{short.userName}</span>
								</div>

							</div>
						))}
					</div>
				</div>
			</div>
		);
	};



	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);


	// Add this at the top level of your component
	const dropdownRef = useRef(null);

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

	const ProfileDropdown = () => (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
				className="w-10 h-10 rounded-full overflow-hidden focus:outline-none ring-2 ring-greenTheme ring-offset-2 transition-all duration-200"
			>
				{profileImage?.imageURL ? (
					<Image
						src={profileImage.imageURL}
						alt="Profile"
						width={40}
						height={40}
						className="w-full h-full object-cover"
						loader={({ src }) => src}
						unoptimized={true}
					/>
				) : (
					<div className="w-full h-full bg-gray-200" />
				)}
			</button>

			{isProfileDropdownOpen && (
				<div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl py-2 z-50 transform transition-all duration-200 ease-out">
					<div className="px-6 py-4 border-b border-gray-100">
						<p className="text-lg font-semibold text-gray-800">{userData?.firstName} {userData?.lastName}</p>
						<p className="text-sm text-gray-500">@{userData?.userName}</p>
						<div className="mt-2 flex gap-4">
							<span className="text-sm"><b>245</b> Friends</span>
							<span className="text-sm"><b>128</b> Posts</span>
						</div>
					</div>

					<div className="py-2">
						<a href="/profile" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
							<User className="w-5 h-5 mr-3 text-greenTheme" />
							<span>View Profile</span>
						</a>
						<a href="/settings" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
							<Settings className="w-5 h-5 mr-3 text-greenTheme" />
							<span>Settings</span>
						</a>
						<a href="/wallet" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
							<Wallet className="w-5 h-5 mr-3 text-greenTheme" />
							<span>Wallet</span>
						</a>
						<a href="/saved" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
							<Bookmark className="w-5 h-5 mr-3 text-greenTheme" />
							<span>Saved Items</span>
						</a>
					</div>

					<div className="border-t border-gray-100 py-2">
						<a href="/help" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
							<HelpCircle className="w-5 h-5 mr-3 text-greenTheme" />
							<span>Help & Support</span>
						</a>
						<button
							onClick={handleLogout}
							className="flex items-center w-full px-6 py-3 hover:bg-red-50 transition-colors text-red-600"
						>
							<LogOut className="w-5 h-5 mr-3" />
							<span>Logout</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);


	const [selectedUser, setSelectedUser] = useState(null);
	const [showUserModal, setShowUserModal] = useState(false);

	const handleUserClick = (user) => {
		setSelectedUser(user);
		setShowUserModal(true);
	};

	// Add this at the top of your component
	useEffect(() => {
		if (showUserModal) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [showUserModal]);

	const UserModal = () => (
		<>
			<div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]" />
			<div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
				<div className="bg-white rounded-2xl w-full max-w-md transform transition-all duration-300 scale-100">
					<div className="relative p-6">
						<button
							onClick={() => setShowUserModal(false)}
							className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
							title="close"
						>
							<X size={20} className="text-gray-500" />
						</button>

						<div className="flex flex-col items-center">
							<div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-greenTheme/20">
								{selectedUser.profileImage ? (
									<Image
										src={selectedUser.profileImage}
										alt={selectedUser.firstName}
										width={96}
										height={96}
										className="w-full h-full object-cover"
										loader={({ src }) => src}
										unoptimized={true}
									/>
								) : (
									<div className="w-full h-full bg-gray-200 flex items-center justify-center">
										<span className="text-2xl text-gray-400">
											{selectedUser.firstName?.charAt(0)}
											{selectedUser.lastName?.charAt(0)}
										</span>
									</div>
								)}
							</div>

							<h3 className="text-2xl font-bold text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</h3>
							<p className="text-gray-500 mb-4">@{selectedUser.userName}</p>

							<div className="grid grid-cols-3 gap-8 w-full mb-6 px-4">
								<div className="text-center">
									<p className="text-xl font-bold text-gray-900">245</p>
									<p className="text-sm text-gray-500">Posts</p>
								</div>
								<div className="text-center">
									<p className="text-xl font-bold text-gray-900">14.3K</p>
									<p className="text-sm text-gray-500">Followers</p>
								</div>
								<div className="text-center">
									<p className="text-xl font-bold text-gray-900">892</p>
									<p className="text-sm text-gray-500">Following</p>
								</div>
							</div>

							<div className="flex gap-3 w-full">
								<button className="flex-1 py-2.5 bg-greenTheme text-white rounded-xl font-medium hover:bg-green-600 transition-colors">
									Follow
								</button>
								<button className="flex-1 py-2.5 border-2 border-greenTheme text-greenTheme rounded-xl font-medium hover:bg-green-50 transition-colors">
									Add Friend
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

		</>
	);


	return (
		<div className="min-h-screen bg-gray-100">
			<div className="fixed top-0 w-full z-50">
				{/* Header */}

				<header className="bg-white shadow-md">
					<div className="container mx-auto px-4 py-3 flex items-center justify-between">
						{/* Logo */}
						<div className="flex items-center">
							<Image
								src="/images/transparentLogo.png"
								alt="Ourlime Logo"
								width={40}
								height={40}
							/>
							<span className="ml-2 text-xl font-bold text-greenTheme">Ourlime</span>
						</div>

						{/* Search Bar */}
						<div className="flex-1 mx-8">
							<div className="relative w-full max-w-xl mx-auto">
								<input
									type="text"
									placeholder="Search..."
									className="w-full bg-gray-100 rounded-full px-12 py-2 focus:outline-none focus:ring-2 focus:ring-greenTheme"
								/>
								<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 border-none" size={20} />
							</div>
						</div>

						{/* Navigation Items */}
						<div className="flex items-center space-x-6">
							<button className="text-gray-600 hover:text-greenTheme" title="message squre">
								<MessageSquare size={24} />
							</button>
							<button className="text-gray-600 hover:text-greenTheme" title="bell">
								<Bell size={24} />
							</button>
							<button className="text-gray-600 hover:text-greenTheme" title="settings">
								<Settings size={24} />
							</button>
							<button className="text-gray-600 hover:text-greenTheme" title="compass">
								<Compass size={24} />
							</button>

							<ProfileDropdown />
						</div>
					</div>
				</header>


				{/* Navigation Bar */}
				<nav className="bg-white border-t border-gray-200">
					<div className="container mx-auto px-4">
						<div className="flex justify-center items-center space-x-8 overflow-x-auto md:overflow-visible">
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
			</div>

			{/* Main content with three-column layout */}
			<main className="pt-36 container mx-auto px-4 md:px-8">
				<div className="flex justify-between gap-8">
					{/* Section 1: Profile Details - Fixed */}
					<section className="w-[280px] bg-white rounded-lg shadow-md p-3 fixed left-8 top-36 h-[calc(100vh-9rem)] flex flex-col">
						{/* Profile section - made more compact */}
						<div className="flex flex-col items-center mb-4">
							<div className="w-16 h-16 rounded-full overflow-hidden mb-2">
								{profileImage?.imageURL ? (
									<Image
										src={profileImage.imageURL}
										alt={`${userData?.firstName}'s Profile Picture`}
										width={64}
										height={64}
										className="w-full h-full object-cover"
										priority
										unoptimized={true}
										loader={({ src }) => src}
									/>
								) : (
									<div className="w-full h-full bg-gray-200" />
								)}
							</div>
							<h3 className="font-semibold text-base">{userData?.firstName} {userData?.lastName}</h3>
							<span className="text-xs text-gray-600">@{userData?.userName}</span>
						</div>

						{/* Stats Grid - more compact */}
						<div className="grid grid-cols-3 gap-2 text-center mb-3 text-sm">
							<div className="flex flex-col">
								<span className="font-bold text-greenTheme">245</span>
								<span className="text-xs text-gray-600">Friends</span>
							</div>
							<div className="flex flex-col">
								<span className="font-bold text-greenTheme">128</span>
								<span className="text-xs text-gray-600">Posts</span>
							</div>
							<div className="flex flex-col">
								<span className="font-bold text-greenTheme">1.2k</span>
								<span className="text-xs text-gray-600">Following</span>
							</div>
						</div>

						{/* Search and Users Section */}
						<div className="flex-1 overflow-hidden flex flex-col">
							<div className="relative mb-2">
								<input
									type="text"
									placeholder="Search users..."
									className="w-full px-8 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none"
									value={searchTerm}
									onChange={handleSearch}
								/>
								<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
							</div>

							<div className="flex-1 overflow-y-auto">
								{filteredUsers.map((user) => (
									<div
										key={user.id}
										className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg"
									>
										<div className="flex items-center gap-2">
											<div className="w-8 h-8 rounded-full overflow-hidden">
												{user.profileImage ? (
													<Image
														src={user.profileImage}
														alt={`${user.firstName}'s profile`}
														width={32}
														height={32}
														className="w-full h-full object-cover"
														loader={({ src }) => src}
														unoptimized={true}
													/>
												) : (
													<div className="w-full h-full bg-gray-200 flex items-center justify-center">
														<span className="text-xs text-gray-400">
															{user.firstName?.charAt(0)}
															{user.lastName?.charAt(0)}
														</span>
													</div>
												)}
											</div>
											<div className="flex flex-col">
												<span className="font-medium text-sm">{`${user.firstName} ${user.lastName}`}</span>
												<span className="text-xs text-gray-500">@{user.userName}</span>
											</div>
										</div>
										<button
											onClick={() => handleUserClick(user)}
											className="p-1 text-greenTheme hover:bg-green-50 rounded-full"
											title="users"
										>
											<Plus size={16} />
										</button>
									</div>
								))}
							</div>
						</div>

						{showUserModal && selectedUser && <UserModal />}

					</section>


					{/* Section 2: Feeds and Posts - Scrollable */}
					<section className="w-[calc(100%-600px)] bg-white rounded-lg shadow-md p-4 mx-auto min-h-screen">
						<div
							ref={sliderRef}
							style={sliderStyles}
							className="flex items-center space-x-4 overflow-x-auto pb-4 select-none cursor-grab scroll-smooth scrollbar-none"
							onMouseDown={mouseDown}
							onMouseLeave={mouseLeave}
							onMouseUp={mouseUp}
							onMouseMove={mouseMove}
							onTouchStart={touchStart}
							onTouchEnd={mouseUp}
							onTouchMove={touchMove}
						>
							{feedFilters.map((filter) => (
								<button
									key={filter.name || 'menu'}
									className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-greenTheme hover:text-white transition-colors whitespace-nowrap flex-shrink-0 select-none"
								>
									<filter.icon size={18} className="flex-shrink-0" />
									{filter.name && <span>{filter.name}</span>}
								</button>
							))}
						</div>

						<div
							onClick={() => setIsPostModalOpen(true)}
							className="border rounded-lg p-4 mb-6 bg-white mt-4 cursor-pointer shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
						>
							{/* Existing content structure stays exactly the same */}
							<div className="flex justify-start mb-4">
								<div className="w-16 h-16 rounded-full overflow-hidden">
									{profileImage?.imageURL ? (
										<Image
											src={profileImage.imageURL}
											alt="Profile"
											width={64}
											height={64}
											className="w-full h-full object-cover"
											priority
											unoptimized={true}
											loader={({ src }) => src}
										/>
									) : (
										<div className="w-full h-full bg-gray-200" />
									)}
								</div>
							</div>

							<div className="text-left pb-2 mb-4">
								<div className="border-b border-gray-300 py-2">
									<span className="text-gray-500">Tell us what's on your mind</span>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
									<ImageIcon size={20} />
									<span>Gallery</span>
								</button>
								<button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
									<Smile size={20} />
									{/* <span>Emoji</span> */}
								</button>
							</div>
						</div>

						{isPostModalOpen && <CreatePostModal />}


						<ShortsSection />

						<div className="space-y-4 mt-4">
							{posts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>
					</section>

					{/* Section 3: Shorts/Reels - Fixed */}
					<section className="w-[280px] bg-white rounded-lg shadow-md p-4 fixed right-8 top-36 h-[calc(100vh-9rem)] overflow-y-auto">
						{/* Communities Grid */}
						<div className="mb-8">
							<h2 className="text-lg font-bold mb-4">Communities</h2>
							<div className="grid grid-cols-2 gap-3">
								{[
									{ name: 'Tech Hub', members: '2.3k', image: 'https://picsum.photos/200/200?random=1' },
									{ name: 'Design Club', members: '1.5k', image: 'https://picsum.photos/200/200?random=2' },
									{ name: 'Startup Network', members: '3.1k', image: 'https://picsum.photos/200/200?random=3' },
									{ name: 'Dev Connect', members: '980', image: 'https://picsum.photos/200/200?random=4' }
								].map((community, index) => (
									<div key={index} className="relative group cursor-pointer">
										<Image
											src={community.image}
											alt={community.name}
											width={120}
											height={120}
											className="rounded-lg object-cover w-full h-24"
											unoptimized={true}
										/>
										<div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 rounded-b-lg">
											<p className="text-white text-sm font-medium truncate">{community.name}</p>
											<p className="text-gray-300 text-xs">{community.members} members</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Events Grid */}
						<div className="mb-8">
							<h2 className="text-lg font-bold mb-4">Upcoming Events</h2>
							<div className="space-y-4">
								{[
									{ title: 'Tech Conference 2024', date: 'Mar 15', image: 'https://picsum.photos/200/200?random=5' },
									{ title: 'Design Workshop', date: 'Mar 20', image: 'https://picsum.photos/200/200?random=6' },
									{ title: 'Startup Meetup', date: 'Mar 25', image: 'https://picsum.photos/200/200?random=7' }
								].map((event, index) => (
									<div key={index} className="flex gap-3 items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
										<Image
											src={event.image}
											alt={event.title}
											width={60}
											height={60}
											className="rounded-lg object-cover"
											unoptimized={true}
										/>
										<div>
											<p className="font-medium text-sm">{event.title}</p>
											<p className="text-gray-500 text-xs">{event.date}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Jobs Grid */}
						<div>
							<h2 className="text-lg font-bold mb-4">Featured Jobs</h2>
							<div className="space-y-4">
								{[
									{ role: 'Senior Developer', company: 'TechCorp', location: 'Remote', image: 'https://picsum.photos/200/200?random=8' },
									{ role: 'UX Designer', company: 'DesignLabs', location: 'New York', image: 'https://picsum.photos/200/200?random=9' },
									{ role: 'Product Manager', company: 'StartupX', location: 'San Francisco', image: 'https://picsum.photos/200/200?random=10' }
								].map((job, index) => (
									<div key={index} className="border rounded-lg p-3 cursor-pointer hover:border-greenTheme transition-colors">
										<div className="flex gap-3 items-center">
											<Image
												src={job.image}
												alt={job.company}
												width={40}
												height={40}
												className="rounded-lg"
												unoptimized={true}
											/>
											<div>
												<p className="font-medium text-sm">{job.role}</p>
												<p className="text-gray-500 text-xs">{job.company}</p>
												<p className="text-gray-400 text-xs">{job.location}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</section>

				</div>
			</main>

		</div>
	);
}
