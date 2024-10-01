import ourlimeImage from '@/public/images/logo.png';
import { SocialPosts } from '@/types/global';
import { Avatar, Button, Skeleton } from '@nextui-org/react';
import { BookImage, CircleEllipsis, Smile, UsersRound } from 'lucide-react';
import React, { SetStateAction, useState } from 'react';
import PostFilter from './posts/PostFilter';
import PostForm from './posts/PostForm';
import Posts from './posts/Posts';
export default function MuiddleSection({
	togglePostForm,
	setTogglePostForm,
}: {
	togglePostForm: boolean;
	setTogglePostForm: React.Dispatch<SetStateAction<boolean>>;
}) {
	const [showDropdown, setShowDropdown] = useState<boolean>(false);
	const [selected, setSelected] = useState<string>('all');
	const [selectedFilter, setSelectedFilter] = useState<string>('all');

	const [socialPosts, setSocialPosts] = useState<SocialPosts[]>([
		// {
		// 	uid: '4',
		// 	profileImage: '/images/home/tech.jpg',
		// 	username: 'Test',
		// email:'example@gmail.com'
		// 	time: '1 min',
		// 	content: ``,
		// 	likes: '23k',
		// 	comments: '115',
		// },
		{
			uid: '1',
			profileImage: '/images/home/blackWoman.jpg',
			username: 'Nicole',
			email:'example@gmail.com',
			time: '2 mins',
			content: `Hey there, eco-friends! 🙌 Today, I took a stroll through the whispering pines and couldn't help but feel a deep connection with the symphony of nature. It's moments like these that remind me why we need to step up our game in environmental conservation. 🌳✨`,
			postImage: '/images/home/trees.jpg',
			likes: '23k',
			comments: '115',
		},
		{
			uid: '2',
			profileImage: '/images/home/sonic.jpg',
			username: 'Rishi',
			email:'example@gmail.com',
			time: '20 mins',
			content: `🚀 Tech Innovations: Shaping Our Tomorrow 💡 Hey Tech Enthusiasts! 👋 What a time to be alive in the tech world! Just wrapped up a week exploring the latest gadgets at the annual TechNow conference, and my mind is blown! 🤯 From AI-driven home assistants that not only understand your mood but also suggest activities, to VR setups that can virtually transport you to Mars, innovation is at an all-time high! 🏠👽 But what really caught my attention was the breakthrough in sustainable tech. Solar panels as thin as paper, yet as powerful as traditional panels, and smartphones made from recycled materials that are fully biodegradable. We're not just thinking smart; we're thinking forward. 🌞♻️ It's not the gadgets that excite me the most; it's the potential they have to change lives. Imagine remote education with AR that brings the classroom to you, or medical drones delivering auid in record time. The future is about tech with a heart. ❤️🛸 What tech advancements are you most excited about? Drop a comment below and let's geek out about the innovations that are reshaping our world! #TechNow #FutureIsNow #Innovation #SustainableTech #SmartTech #TechWithAHeart`,
			likes: '23k',
			comments: '115',
		},
		{
			uid: '3',
			profileImage: '/images/home/tech.jpg',
			username: 'Rishi',
			email:'example@gmail.com',
			time: '1 min',
			content: `Gamers, Assemble! 🌟 Just when we thought games couldn't get more immersive, the latest wave of gaming tech has us rethinking what's possible! I've just spent the weekend testing out the newest console on the block, and let me tell you, it's like stepping into the future. 🌌 We're talking crystal-clear 8K resolution, frame rates that make gameplay smoother than ever, and AI-driven personal game assistants that adapt to your play style. It's not just gaming; it's a doorway to new worlds! 🤩 But it's not all about the specs. It's about the stories, the adventures, and the communities we build along the way. Indie developers are bringing heart and soul into their games, proving once again that a powerful narrative can be as gripping as stunning visuals. 📖❤️ And can we talk about cross-platform play? The barriers are down, friends! You can now team up (or face off) with players regardless of the device. It's a united gaming universe, and everyone's invited to the party. 🎉🌐 So, what's your current gaming obsession? Are you a solo adventurer or a co-op champion? Share your latest gaming feats and favorite in-game moments! #GamingLife #NextGenConsoles #IndieGameDev #8KGaming #CrossPlatformPlay #GamerCommunity`,
			likes: '23k',
			comments: '115',
		},
	]);
	return (
		<section className="flex w-2/5 flex-col gap-2">
			{togglePostForm && (
				<PostForm
					setSocialPosts={setSocialPosts}
					setTogglePostForm={setTogglePostForm}
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

			<div className="box-border flex flex-col justify-around rounded-xl bg-white p-5 shadow-md">
				<div className="h-10 w-10 overflow-huidden rounded-full">
					<Avatar
						src={ourlimeImage.src}
						alt="profile picture"
						className="h-full w-full"
						showFallback
						fallback={<Skeleton className="h-full w-full rounded-full" />}
					/>
				</div>

				<form
					onClick={() => setTogglePostForm((prev) => !prev)}
					className="mb-5 mt-5 cursor-pointer"
				>
					<div className="w-full border-b border-gray-300 bg-transparent pb-2 text-base outline-none">
						<p className="opacity-50">What&apos;s going on?</p>
					</div>

					<div className="mt-5 flex flex-wrap items-center gap-3">
						<Button>Gallery</Button>
						<Smile className="text-green-600" />
						<CircleEllipsis className="ml-auto cursor-pointer" color="grey" />
					</div>
				</form>
			</div>

			<Posts socialPosts={socialPosts} selectedPost={selected} />
		</section>
	);
}
