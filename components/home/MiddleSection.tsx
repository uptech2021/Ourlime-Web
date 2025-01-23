import { UserData, Post, ProfileImage } from '@/types/userTypes';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import MemoriesSection from './MemoriesSection';
import { useState, useEffect, useRef, useMemo } from 'react';
import { LucideIcon, Smile } from 'lucide-react';
import {
	Menu, Grid, Image as ImageIcon, Video,
	Music, FileText, Link2, Calendar, BarChart,
	BookOpen, Users, Newspaper, TrendingUp, Star,
	Bookmark
} from 'lucide-react';
import Image from 'next/image';

type FilterItem = {
	name: string;
	icon: LucideIcon;
	mediaType?: string;
	label?: string;
}

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
	const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set(['All']));
	const sliderRef = useRef<HTMLDivElement>(null);

	const sliderStyles = {
		userSelect: 'none',
		WebkitUserSelect: 'none',
		MozUserSelect: 'none',
		msUserSelect: 'none'
	} as const;


	const feedFilters: FilterItem[] = [
		{ name: '', icon: Menu },
		{ name: 'All', icon: Grid },
		{ name: 'image', icon: ImageIcon, mediaType: 'image', label: 'Photos' },
		{ name: 'video', icon: Video, mediaType: 'video', label: 'Videos' },
		{ name: 'audio', icon: Music, mediaType: 'audio', label: 'Sound' },
		{ name: 'document', icon: FileText, mediaType: 'document', label: 'Documents' },
		{ name: 'link', icon: Link2, mediaType: 'link', label: 'Links' },
		{ name: 'events', icon: Calendar, mediaType: 'events', label: 'Events' },
		{ name: 'polls', icon: BarChart, mediaType: 'polls', label: 'Polls' },
		{ name: 'stories', icon: BookOpen, mediaType: 'stories', label: 'Stories' },
		{ name: 'groups', icon: Users, mediaType: 'groups', label: 'Groups' },
		{ name: 'blogs', icon: FileText, mediaType: 'blogs', label: 'Blogs' },
		{ name: 'news', icon: Newspaper, mediaType: 'news', label: 'News' },
		{ name: 'trending', icon: TrendingUp, mediaType: 'trending', label: 'Trending' },
		{ name: 'favorites', icon: Star, mediaType: 'favorites', label: 'Favorites' },
		{ name: 'saved', icon: Bookmark, mediaType: 'saved', label: 'Saved' }
	];
	



	const toggleFilter = (filterName: string) => {
		const newFilters = new Set(selectedFilters);

		if (filterName === 'All') {
			setSelectedFilters(new Set(['All']));
			return;
		}

		newFilters.delete('All');

		if (newFilters.has(filterName)) {
			newFilters.delete(filterName);
			if (newFilters.size === 0) {
				newFilters.add('All');
			}
		} else {
			newFilters.add(filterName);
		}

		setSelectedFilters(newFilters);
	};



	const filteredPosts = useMemo(() => {
		console.log('Selected Filters:', Array.from(selectedFilters));

		if (selectedFilters.has('All')) {
			return posts;
		}

		return posts.filter(post => {

			if (!post.mediaTypes) return false;

			const hasMatchingType = Array.from(selectedFilters).some(filter => {
				const filterItem = feedFilters.find(f => f.name === filter);
				const mediaType = filterItem?.mediaType;
				const matches = mediaType && post.mediaTypes?.includes(mediaType);
				return matches;
			});

			return hasMatchingType;
		});
	}, [posts, selectedFilters]);



	return (
		<section className="w-full lg:w-auto bg-white rounded-lg shadow-md p-4 md:p-6 order-1 lg:order-2 min-h-screen flex flex-col gap-4">
			{/* Feed Filters */}
			<div
				ref={sliderRef}
				style={sliderStyles}
				className="flex items-center space-x-4 overflow-x-auto pb-4 select-none cursor-grab scroll-smooth scrollbar-none -mx-4 md:-mx-6 px-4 md:px-6 sticky top-0 bg-white z-10"
			>
				{feedFilters.map((filter) => (
					<button
						key={filter.name || 'menu'}
						onClick={() => filter.name && toggleFilter(filter.name)}
						className={`
							flex items-center gap-2 px-4 py-2 rounded-full 
							${selectedFilters.has(filter.name)
								? 'bg-greenTheme text-white'
								: 'bg-gray-100 hover:bg-greenTheme hover:text-white'
							}
							transition-colors whitespace-nowrap flex-shrink-0 select-none
							text-sm md:text-base
						`}
					>
						<filter.icon size={18} className="flex-shrink-0" />
						{filter.name && <span className="hidden sm:inline">{filter.label || filter.name}</span>}

					</button>
				))}
			</div>

			{/* Create Post Card */}
			<div
				onClick={() => setIsPostModalOpen(true)}
				className="border rounded-lg p-4 bg-white cursor-pointer shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
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
							<span className="text-sm md:text-base">Tell us what's on your mind</span>
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

			<div className="space-y-4 mt-4 mb-20">
				{filteredPosts.length > 0 ? (
					filteredPosts.map((post) => (
						<div key={post.id}>
							<PostCard post={post} />
						</div>
					))
				) : (
					<div className="flex flex-col items-center justify-center py-20 px-4">
						<div className="bg-gray-50 rounded-xl p-8 shadow-sm w-full max-w-lg">
							<div className="text-center space-y-4">
								{/* You can import and use any icon from lucide-react here */}
								<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
									<FileText className="w-8 h-8 text-gray-400" />
								</div>
								<h3 className="text-xl font-semibold text-gray-800">No posts found</h3>
								<p className="text-gray-500">
									Try selecting different filters or create a new post to share with your network
								</p>
								<button
									onClick={() => setSelectedFilters(new Set(['All']))}
									className="mt-4 text-greenTheme hover:text-green-600 font-medium transition-colors"
								>
									View all posts
								</button>
							</div>
						</div>
					</div>
				)}
			</div>


		</section>
	);

}
