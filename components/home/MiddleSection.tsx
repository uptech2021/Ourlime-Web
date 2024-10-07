import ourlimeImage from '@/public/images/logo.png';
import { ProfileData, SocialPosts, UserData } from '@/types/global';
import { Avatar, Button, Skeleton } from '@nextui-org/react';
import { BookImage, CircleEllipsis, Smile, UsersRound } from 'lucide-react';
import React, { SetStateAction, useState } from 'react';
import PostFilter from './posts/PostFilter';
import PostForm from './posts/PostForm';
import Posts from './posts/Posts';
import CreatePost from './CreatePost';
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
	const [postCreated, setPostCreated] = useState<boolean>(false); //Checks if a post was created
	
	  // Use this function to signal that a post was created
	  const onPostCreated = () => {
		setPostCreated((prev) => !prev); // Toggle postCreated state
	  };

	return (
		<section className="flex w-2/5 flex-col gap-2">
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
				profilePicture={profile.profilePicture}
				setTogglePostForm={setTogglePostForm}
			/>

			<Posts socialPosts={socialPosts} selectedPost={selected} />
		</section>
	);
}
