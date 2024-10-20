'use client';
import Navbar from '@/comm/Navbar';
import AddStory from '@/components/home/AddStory';
import CommunitiesSlider from '@/components/home/CommunitiesSlider';
import CreatePost from '@/components/home/CreatePost';
import LeftSection from '@/components/home/LeftSection';
import MiddleSection from '@/components/home/MiddleSection';
import RightSection from '@/components/home/RightSection';
import StoriesSlider from '@/components/home/StoriesSlider';
import PostFilter from '@/components/home/posts/PostFilter';
import PostForm from '@/components/home/posts/PostForm';
import Posts from '@/components/home/posts/Posts';
import { db } from '@/firebaseConfig';
import { fetchProfile, fetchUser, loginRedirect } from '@/helpers/Auth';
import { ResizeListener } from '@/helpers/Resize';
import { ProfileData, SocialPosts, Stories, UserData } from '@/types/global';
import { collection, getDocs } from 'firebase/firestore';
import { BookImage, UsersRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
	const router = useRouter();
	const [isPc, setIsPc] = useState<boolean>(false);
	const [togglePostForm, setTogglePostForm] = useState<boolean>(false);
	const [viewCommunities, setViewCommunities] = useState<boolean>(false);
	const [addStory, setAddStory] = useState<boolean>(false);
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [selected, setSelected] = useState<string>('all');
	const [selectedFilter, setSelectedFilter] = useState<string>('all');
	const [postCreated, setPostCreated] = useState<boolean>(false); //Checks if a post was created
	const [profile, setProfile] = useState<ProfileData>(null);
	const [user, setUser] = useState<UserData>(null);
	const [stories, setStories] = useState<Stories[]>([
		{
			id: '1',
			username: 'Aaron',
			file: '/images/home/car.jpg',
			profilePicture: '/images/logo.png',
		},
		{
			id: '2',
			username: 'Jonathan',
			file: '/images/home/car.jpg',
			profilePicture: '/images/logo.png',
		},
		{
			id: '3',
			username: 'Hazzard',
			file: '/images/home/car.jpg',
			profilePicture: '/images/logo.png',
		},
		{
			id: '4',
			username: 'Rishi',
			file: '/images/home/car.jpg',
			profilePicture: '/images/logo.png',
		},
		{
			id: '5',
			username: 'Neola',
			file: '/images/home/car.jpg',
			profilePicture: '/images/logo.png',
		},
		{
			id: '6',
			username: 'Hernandez',
			file: '/images/home/car.jpg',
			profilePicture: '/images/logo.png',
		},
	]);
	const [socialPosts, setSocialPosts] = useState<SocialPosts[]>([]);

	const [loading, setLoading] = useState(true);

  useEffect(() => {
		const initializeHome = async () => {
			try {
				const currentUser = await loginRedirect(router, true);
				if (currentUser) {
					const profileSnap = await fetchProfile(currentUser.uid);
					const userSnap = await fetchUser(currentUser.uid)
					setProfile(profileSnap.data() as ProfileData);
					setUser(userSnap.data() as UserData);

					const fetchPosts = async () => {
						const getPosts = await getDocs(collection(db, 'posts'));
						const postsData = getPosts.docs.map(
							(doc) => doc.data() as SocialPosts
						);
						setSocialPosts(postsData);
						setLoading(false);
					};
					fetchPosts();
				}
			} catch (error) {
				console.error('Error initializing home:', error);
				setLoading(false);
			}
		};

		initializeHome();
		const cleanup = ResizeListener(setIsPc);
		return () => cleanup();
	}, [router]);


	  // Use this function to signal that a post was created
	  const onPostCreated = () => {
		setPostCreated((prev) => !prev); // Toggle postCreated state
	  };

	if (loading || !profile || !user) {
		return <div>Loading...</div>;
	}
	return (
		<Navbar>
			{/* Overlay for post form */}
			{togglePostForm && (
				<div className="fixed top-0 z-40 h-full w-full bg-black opacity-50"></div>
			)}

			<main
				className={`relative flex flex-col gap-5 px-5 ${isPc ? 'flex-row' : 'flex-col'}`}
			>
				{/* Layout for larger screens */}
				{isPc && (
					<div className="relative mb-2 flex flex-row gap-5 overflow-hidden pl-5 pt-5">
						<LeftSection user={user} profile={profile} />
						<MiddleSection
							profile={profile}
							user={user}
							socialPosts={socialPosts}
							setSocialPosts={setSocialPosts}
							togglePostForm={togglePostForm}
							setTogglePostForm={setTogglePostForm}
						/>
						<RightSection />
					</div>
				)}

				{/* Layout for smaller screens */}
				{!isPc && (
					<div className="mt-4 flex flex-col border">
						<div className="flex flex-row items-center justify-between pl-10 pr-10">
							<h2 className="text-2xl">Stories</h2>
							<div>
								<p
									onClick={() => setViewCommunities((prev) => !prev)}
									className="cursor-pointer text-gray-700"
								>
									{!viewCommunities ? 'View Communities' : 'Hide Communities'}
								</p>
							</div>
						</div>

						<StoriesSlider stories={stories} setAddStory={setAddStory} />
						{viewCommunities && <CommunitiesSlider />}

						{/* Filter Posts */}
						<div className="relative mt-8 flex flex-col">
							<PostFilter
								showDropdown={showDropdown}
								setShowDropdown={setShowDropdown}
								selected={selected}
								setSelected={setSelected}
							/>
							{showDropdown && (
								<div className="left-0 mt-1 w-2/3 rounded-md bg-white px-3 py-1 shadow-sm shadow-greenTheme sm:w-1/3">
									<ul className="flex flex-col rounded-md text-sm text-black">
										<li
											onClick={() => setSelectedFilter('all')}
											className={`${selectedFilter === 'all' && 'bg-gray-100 active:bg-greenTheme'} flex flex-row gap-2 rounded-sm p-2`}
										>
											<BookImage /> All Posts
										</li>
										<li
											onClick={() => setSelectedFilter('following')}
											className={`${selectedFilter === 'following' && 'bg-gray-100 active:bg-greenTheme'} flex flex-row gap-2 rounded-sm p-2`}
										>
											<UsersRound />
											People I Follow
										</li>
									</ul>
								</div>
							)}
						</div>

						<CreatePost profilePicture={user.photoURL} setTogglePostForm={setTogglePostForm} />
						<Posts socialPosts={socialPosts} selectedPost={selected} />
					</div>
				)}
			</main>

			{/* Upload Form Form */}
			{addStory && (
				<AddStory setStories={setStories} setAddStory={setAddStory} />
			)}
			{togglePostForm && (
				<PostForm
					profile={profile}
					user={user}
					setSocialPosts={setSocialPosts}
					setTogglePostForm={setTogglePostForm}
					onPostCreated={onPostCreated}
				/>
			)}
		</Navbar>
	);
}
