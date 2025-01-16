import { UserData, Post } from '@/types/userTypes';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import MemoriesSection from './MemoriesSection';


import { useState, useRef } from 'react';
import { Smile } from 'lucide-react';
import {
	Menu, Grid, Image as ImageIcon, Video,
	Music, FileText, Link2, Calendar, BarChart,
	BookOpen, Users, Newspaper, TrendingUp, Star,
	Bookmark
} from 'lucide-react';
import Image from 'next/image';

export default function MiddleSection({
	posts,
	user
}: {
	posts: Post[];
	user: UserData;
}) {
	const [isPostModalOpen, setIsPostModalOpen] = useState(false);
	const sliderRef = useRef<HTMLDivElement>(null);
	const sliderStyles = {
		userSelect: 'none',
		WebkitUserSelect: 'none',
		MozUserSelect: 'none',
		msUserSelect: 'none'
	} as const;

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

	return (
		<section className="w-[calc(100%-600px)] bg-white rounded-lg shadow-md p-4 mx-auto min-h-screen">
			<div
				ref={sliderRef}
				style={sliderStyles}
				className="flex items-center space-x-4 overflow-x-auto pb-4 select-none cursor-grab scroll-smooth scrollbar-none"
			>
				{/* Assuming feedFilters is passed as a prop or defined here */}
				{/* Replace with actual feedFilters data */}
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
				<div className="flex justify-start mb-4">
					<div className="w-16 h-16 rounded-full overflow-hidden">
						{user?.imageUrl ? (
							<Image
								src={user.imageUrl}
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
						<span className="text-gray-500">Tell us what&apos;s on your mind</span>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
						<ImageIcon size={20} />
						<span>Gallery</span>
					</button>
					<button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
						<Smile size={20} />
					</button>
				</div>
			</div>

			<MemoriesSection />

			{isPostModalOpen && (
				<CreatePost
					setTogglePostForm={setIsPostModalOpen}
					profilePicture={user?.imageUrl || ''}
				/>
			)}

			<div className="space-y-4 mt-4">
				{posts.map((post) => (
					<PostCard key={post.id} post={post} />

				))}
			</div>
		</section>
	);
}
