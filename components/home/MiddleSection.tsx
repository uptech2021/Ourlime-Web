import ourlimeImage from '@/public/images/logo.png';
import { ProfileData, SocialPosts, UserData } from '@/types/global';
import { Avatar, Button, Skeleton } from '@nextui-org/react';
import { BookImage, CircleEllipsis, Plus, Smile, UsersRound, PenSquare, BookOpen } from 'lucide-react';
import React, { SetStateAction, useState, useRef, useEffect } from 'react';
import PostFilter from './posts/PostFilter';
import PostForm from './posts/PostForm';
import Posts from './posts/Posts';
import CreatePost from './CreatePost';
import Link from 'next/link';

export default function MiddleSection({
	togglePostForm,
	setTogglePostForm,
	setSocialPosts,
	socialPosts,
	profile,
	user
}: {
	socialPosts: SocialPosts[];
	togglePostForm: boolean;
	setSocialPosts: React.Dispatch<SetStateAction<SocialPosts[]>>;
	setTogglePostForm: React.Dispatch<SetStateAction<boolean>>;
	profile: ProfileData;
	user: UserData;
}) {
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [selected, setSelected] = useState<string>('all');
	const [selectedFilter, setSelectedFilter] = useState<string>('all');
	const [postCreated, setPostCreated] = useState<boolean>(false);
	const [showCreateMenu, setShowCreateMenu] = useState(false);
	const createMenuRef = useRef<HTMLDivElement>(null);

	// Handle click outside for create menu
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
				setShowCreateMenu(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const onPostCreated = () => {
		setPostCreated((prev) => !prev);
	};

	return (
		<section className="md:ml-[21%] w-[52%] flex flex-col gap-2 relative">
			{togglePostForm && (
				<PostForm
					profile={profile}
					user={user}
					setSocialPosts={setSocialPosts}
					setTogglePostForm={setTogglePostForm}
					onPostCreated={onPostCreated}
				/>
			)}

			{/* Filter Posts */}
			<div className="relative flex flex-col">
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

			<CreatePost
				profilePicture={user.photoURL}
				setTogglePostForm={setTogglePostForm}
			/>

			<Posts socialPosts={socialPosts} selectedPost={selected} />

			{/* Floating Action Button and Create Menu */}
			<div className="fixed bottom-8 right-[26%] z-40" ref={createMenuRef}>
				{showCreateMenu && (
					<div className="absolute bottom-6 right-4 w-32 bg-white rounded-lg shadow-lg overflow-hidden">
						<div className="p-2 border-b border-gray-100">
							<h3 className="text-sm font-semibold text-gray-700 px-3 py-2">Create</h3>
						</div>
						<div className="py-1">
							<button
								onClick={() => {
									setTogglePostForm(true);
									setShowCreateMenu(false);
								}}
								className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								<PenSquare className="mr-2 h-4 w-4" />
								Post
							</button>
							<Link href="/blog/create"
								className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => setShowCreateMenu(false)}
							>
								<BookOpen className="mr-2 h-4 w-4" />
								Blog
							</Link>
						</div>
					</div>
				)}
				<button
					onClick={() => setShowCreateMenu(!showCreateMenu)}
					className="bg-greenTheme hover:bg-gray-800 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
				>
					<Plus size={20} />
				</button>
			</div>
		</section>
	);
}
