'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import alb from '@/public/images/album/album.png';
import CreateAlbum from '@/components/album/CreateAlbum';
import Navbar from '@/comm/Navbar';

export default function Albums() {
	const [showCreateAlbum, setShowCreateAlbum] = useState(false);

	const handleCreateAlbumClick = () => {
		setShowCreateAlbum(true);
	};

	const handleGoBack = () => {
		setShowCreateAlbum(false);
	};

	return (
		<Navbar>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gray-200 text-center">
				<h1 className="mb-28 text-4xl font-bold text-gray-800">My Albums</h1>
				{!showCreateAlbum && (
					<section className="flex flex-col items-center justify-start rounded-lg bg-white p-8 shadow-md">
						<Image src={alb} alt="album" />
						<p className="mt-4 text-gray-600">
							You haven&apos;t created any albums yet.
						</p>
						<button
							onClick={handleCreateAlbumClick}
							className="mt-6 rounded bg-red-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-red-700"
						>
							Create album
						</button>
					</section>
				)}
				{showCreateAlbum && <CreateAlbum onGoBack={handleGoBack} />}
			</main>
		</Navbar>
	);
}