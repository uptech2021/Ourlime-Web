import { Stories } from '@/types/global';
import { useState } from 'react';
import CreatePost from './CreatePost';
import StoriesSlider from './StoriesSlider';
import Post from './posts/Post';

export default function Mobile() {
	const [addStory, setAddStory] = useState<boolean>(false);
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
	const userPosts = [
		{
			profilePicture: '/images/home/blackWoman.jpg',
			userName: 'Angelo',
			postTime: 2,
			subject: 'Hey there, eco-friends! 🙌',
			bodyText:
				"Today, I took a stroll through the whispering pines and couldn't help but feel a deep connection with the symphony of nature. It's moments like these that remind me why we need to step up our game in environmental conservation. 🌳✨",
			image: '/images/home/trees.jpg',
			// video: "/videos/uptechAd.mp4"
		},
		{
			profilePicture: '/images/logo.png',
			userName: 'Ourlime Admin',
			postTime: 20,
			subject: 'Welcome to Ourlime! See our other Services',
			bodyText:
				"We are excited to have you on board! We are a community of like-minded individuals who are passionate about creating a sustainable future. We have a lot of exciting projects lined up for you, and we can't wait to see what you will create. Check out our other services below.",
			video: '/videos/uptechAd.mp4',
		},
	];

	console.log(addStory, setStories)

	return (
		<div>
			<div className="mt-4 flex flex-col border">
				<div className="flex flex-row items-center justify-between pl-10 pr-10">
					<h2 className="text-2xl">Stories</h2> <button>View all</button>
				</div>

				<StoriesSlider stories={stories} setAddStory={setAddStory} />
			</div>

			<main className="mt-5 flex h-full flex-col gap-5 pl-5 pr-5">
				<CreatePost />

				{userPosts.map((post, i) => (
					<Post {...post} key={i} />
				))}
			</main>
		</div>
	);
};