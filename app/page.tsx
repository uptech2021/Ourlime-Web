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
import { loginRedirect } from '@/helpers/Auth';
import { ResizeListener } from '@/helpers/Resize';
import { SocialPosts, Stories } from '@/types/global';
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
		loginRedirect(router, true)
			.then(() => {
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error during login redirect:', error);
				setLoading(false);
			});
		
			const fetchPosts = async () => {
				try{
					const getPosts = await getDocs(collection(db, 'posts'));
					const postsData = getPosts.docs.map((doc) => doc.data() as SocialPosts);
					setSocialPosts(postsData);
					console.log(postsData)
				}catch(error){
					console.error('Error fetching posts:', error);
				}
			}

		fetchPosts();
	const cleanup = ResizeListener(setIsPc);
		return () => cleanup();
	}, [router]);

	if (loading) {
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
					<div className="relative mb-2 flex flex-row gap-5 overflow-y-hidden pl-5 pt-5">
						<LeftSection />
						<MiddleSection
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
									View Communities
								</p>
							</div>
						</div>

						<StoriesSlider stories={stories} setAddStory={setAddStory} />
					</div>
				)}

				<div className="relative flex flex-col">
					{/* Filter Posts */}
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
									className={`${
										selectedFilter === 'all'
											? 'bg-gray-100 active:bg-greenTheme'
											: ''
									} flex flex-row gap-2 rounded-sm p-2`}
								>
									<BookImage /> All Posts
								</li>
								<li
									onClick={() => setSelectedFilter('following')}
									className={`${
										selectedFilter === 'following'
											? 'bg-gray-100 active:bg-greenTheme'
											: ''
									} flex flex-row gap-2 rounded-sm p-2`}
								>
									<UsersRound />
									People I Follow
								</li>
							</ul>
						</div>
					)}
				</div>

				{/* Display the form to post content */}
				<div
					onClick={() => setTogglePostForm((prev) => !prev)}
					className="cursor-pointer"
				>
					<CreatePost />
				</div>

				{viewCommunities && <CommunitiesSlider />}

				<Posts socialPosts={socialPosts} selectedPost={selected} />
			</main>

			{/* Upload Form Form */}
			{addStory && (
				<AddStory setStories={setStories} setAddStory={setAddStory} />
			)}
			{togglePostForm && (
				<PostForm
					setSocialPosts={setSocialPosts}
					setTogglePostForm={setTogglePostForm}
				/>
			)}
		</Navbar>
	);
}
