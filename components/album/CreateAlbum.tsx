'use client';

import React from 'react';
import Image from 'next/image';
import pic from '@/public/images/album/Image.png';
import top from '@/public/images/album/topimg.png';

interface CreateAlbumProps {
	onGoBack: () => void;
}

export default function CreateAlbum({ onGoBack }: CreateAlbumProps) {
	return (
		<div className="flex flex-col items-center justify-center bg-gray-200">
			<div className="w-[60vw] rounded-lg bg-white p-6 shadow-md">
				<div className="mb-2 flex flex-col items-center justify-start">
					<Image src={top} alt="topimage" className="h-14 w-14" />
					<p className="ml-2 text-lg font-semibold text-black">Create album</p>
				</div>
				<form>
					<div className="mb-4">
						<input
							type="text"
							className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							id="albumName"
							placeholder="Album name"
						/>
						<p className="mt-1 text-sm text-gray-500">Choose your album name</p>
					</div>
					<div className="mb-6">
						<div className="flex flex-col items-start">
							<p className="mb-2 font-semibold text-gray-700">Photos</p>
							<Image src={pic} alt="upload" className="h-24 w-32" />
						</div>
					</div>
					<div className="flex items-center justify-between">
						<p className="cursor-pointer text-blue-500" onClick={onGoBack}>
							Go back
						</p>
						<button
							type="submit"
							className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-red-600"
						>
							Publish
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
