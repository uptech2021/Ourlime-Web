'use client';

import Card from './Card';
import { Plus } from 'lucide-react';
import styles from './home.module.css';
import { Stories } from '@/types/global';
import React, { SetStateAction } from 'react';

export default function StoriesSlider({
	setAddStory,
	stories,
}: {
	setAddStory: React.Dispatch<SetStateAction<boolean>>;
	stories: Stories[];
}) {
	return (
		<div className="mt-1 flex cursor-pointer flex-row items-center overflow-x-scroll bg-white p-2 scrollbar-hide">
			{/* Display the upload stories form when clicked */}
			<div
				onClick={() => setAddStory((prev: boolean) => !prev)}
				className={`w-31 box-md h-40 p-4 ${styles.plusIcon}`}
			>
				<Plus
					size={50}
					color="rgb(0, 236, 81)"
					className="rounded-full border-2 border-dashed border-[rgb(0,236,81)] p-2"
				/>
			</div>

			{stories.map((story, key) => (
				<div key={key}>
					<Card
						username={story.username}
						file={story.file}
						profilePicture={story.profilePicture}
					/>
				</div>
			))}
		</div>
	);
}
