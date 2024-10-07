import { Stories } from '@/types/global';
import { Button } from '@nextui-org/react';
import { ArrowLeft, VideoIcon } from 'lucide-react';
import React, { SetStateAction } from 'react';

export default function AddStory({
	setAddStory,
	setStories,
}: {
	setAddStory: React.Dispatch<SetStateAction<boolean>>;
	setStories: React.Dispatch<SetStateAction<Stories[]>>;
}) {
	const [fileSelected, setFileSelected] = React.useState<boolean>(false);
	
	const createStory = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const file = formData.get('file') as File;

		if (file?.name) {
			const newStory = [
				{
					id: '12345',
					username: 'Ourlime Admin',
					file: `/images/${file.name}`,
					profilePicture: '/images/avatar.jpg',
				},
			];

			setStories((prevStories) => [...newStory, ...prevStories]);
			setAddStory(false);
		
		} else {
			// console.warn('No file selected');
		}
	};

	return (
		<div className="fixed left-0 top-0 z-50 flex h-full w-full flex-col gap-4 bg-[#141414] p-4">
			<header className="z-60 flex flex-row items-center gap-2">
				<ArrowLeft
					onClick={() => setAddStory((prev: boolean) => !prev)}
					className="h-8 w-8 cursor-pointer text-white"
				/>
				<h3 className="text-2xl text-white">Create New Status</h3>
			</header>

			<form
				onSubmit={createStory}
				className="flex h-full w-full flex-col gap-4 p-4"
			>
				{/* <textarea
                    name="description"
                    placeholder="What's going on?"
                    className="p-3 w-full h-32 text-white bg-[#2b2b2b] rounded-t-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
                /> */}

				<p className="text-white">Media File</p>

				<label className="flex cursor-pointer flex-row items-center gap-2">
					<VideoIcon className="h-10 w-10 rounded-3xl bg-green-600 p-2 text-green-300" />
					<p className="text-white">Select Photos & Videos</p>
					<input
						onChange={() => setFileSelected(true)}
						type="file"
						name="file"
						accept="image/*,video/*"
						className="hidden"
					/>
				</label>

				<Button 
					isDisabled={!fileSelected}
					type="submit" 
					className={`mx-auto w-1/2 lg:w-1/4 ${!fileSelected && 'bg-none'}`}>
					Create
				</Button>
			</form>
		</div>
	);
}
