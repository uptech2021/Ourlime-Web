import { UserData, Post, ProfileImage } from '@/types/userTypes';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import MemoriesSection from './MemoriesSection';
import { useState, useEffect, useRef } from 'react';
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
	user,
	profileImage
}: {
	posts: Post[];
	user: UserData;
	profileImage: ProfileImage;
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
		<section className="
			w-full lg:w-auto
			bg-white rounded-lg shadow-md 
			p-4 md:p-6
			order-1 lg:order-2
			min-h-screen
			flex flex-col
			gap-4
			">
			{/* Feed Filters */}
			<div
				ref={sliderRef}
				style={sliderStyles}
				className="
					flex items-center 
					space-x-4 
					overflow-x-auto 
					pb-4 
					select-none 
					cursor-grab 
					scroll-smooth 
					scrollbar-none
					-mx-4 md:-mx-6
					px-4 md:px-6
					sticky top-0 
					bg-white 
					z-10
					"
				>
				{feedFilters.map((filter) => (
					<button
						key={filter.name || 'menu'}
						className="
							flex items-center 
							gap-2 px-4 py-2 
							rounded-full 
							bg-gray-100 
							hover:bg-greenTheme 
							hover:text-white 
							transition-colors 
							whitespace-nowrap 
							flex-shrink-0 
							select-none
							text-sm md:text-base
							"
						>
						<filter.icon size={18} className="flex-shrink-0" />
						{filter.name && <span className="hidden sm:inline">{filter.name}</span>}
					</button>
				))}
			</div>

			{/* Create Post Card */}
			<div
				onClick={() => setIsPostModalOpen(true)}
				className="
					border rounded-lg 
					p-4 
					bg-white 
					cursor-pointer 
					shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
					hover:shadow-lg 
					transition-all 
					duration-300
					transform hover:scale-[1.01]
					"
				>
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0">
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
					<div className="flex-1">
						<div className="border rounded-full px-4 py-2 text-gray-500 hover:bg-gray-50">
							<span className="text-sm md:text-base">Tell us what&apos;s on your mind</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-4 mt-4">
					<button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
						<ImageIcon size={20} />
						<span className="hidden sm:inline">Gallery</span>
					</button>
					<button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme" title="smile">
						<Smile size={20} />
					</button>
				</div>
			</div>
			
			<div className="relative -mx-4 md:-mx-6 px-4 md:px-6">
				<MemoriesSection profileImage={profileImage} />
			</div>

			{isPostModalOpen && (
				<CreatePost
					setTogglePostForm={setIsPostModalOpen}
					profilePicture={profileImage?.imageURL || ''}
				/>
			)}

			<div className="space-y-4 mt-4">
				{posts.map((post) => (
					<div key={post.id}>
						<PostCard post={post} />
						{/* <CommentsFetcher post={post} /> */}
					</div>

				))}
			</div>
		</section>
	);
}
