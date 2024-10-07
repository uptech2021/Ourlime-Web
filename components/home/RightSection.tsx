import { Stories } from '@/types/global';
import { RotateCw } from 'lucide-react';
import { useState } from 'react';
import AddStory from './AddStory';
import CommunitiesSlider from './CommunitiesSlider';
import StoriesSlider from './StoriesSlider';
export default function RightSection() {
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

	return (
		<section className=" flex w-1/3 flex-col gap-3">
			{/* Upload Form Form */}
			{addStory && (
				<AddStory setStories={setStories} setAddStory={setAddStory} />
			)}
			<div className="box-border w-full overflow-hidden rounded-xl bg-white px-5 pb-5 shadow-lg">
				<h3 className="text-lg">Stories</h3>
				{/* Display the upload stories form when clicked */}
				<StoriesSlider stories={stories} setAddStory={setAddStory} />
			</div>

			<div className="box-border w-full cursor-pointer overflow-y-scroll rounded-xl bg-white shadow-lg scrollbar-hide">
				<div className="flex flex-row items-center justify-between px-5 py-2">
					<h3 className="text-sm">Suggested Communities</h3>
					<RotateCw />
				</div>
				<CommunitiesSlider />
			</div>
		</section>
	);
}
