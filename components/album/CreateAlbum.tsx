'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import top from '@/public/images/album/topimg.png';
import { FaTrash, FaImage } from 'react-icons/fa';

import { uploadFile } from '@/helpers/firebaseStorage';
import { Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseConfig';
import { collection, addDoc, updateDoc } from 'firebase/firestore';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getDoc, doc } from 'firebase/firestore';

interface CreateAlbumProps {
	onGoBack: () => void;
}

export default function CreateAlbum({ onGoBack }: CreateAlbumProps) {
	const [images, setImages] = useState<File[]>([]);
	const [albumName, setAlbumName] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isPublished, setIsPublished] = useState(false);


	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setImages(prevImages => [...prevImages, event.target.files![0]]);
		}
	};

	const handleDeleteImage = (index: number) => {
		setImages(prevImages => prevImages.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!auth.currentUser) {
		  return;
		}
	
		// Disable button immediately
		setIsPublished(true);
		setIsSubmitting(true);

		try {

		  const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
		  const userName = userDoc.data()?.userName;

		  // 1. Insert album name and user email into Firestore
		  const albumRef = await addDoc(collection(db, 'albums'), {
			name: albumName,
			userEmail: auth.currentUser.email,
			createdAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		  });

		  // 2. Upload images to Firebase Storage
		  const imageUrls = await Promise.all(
			images.map(async (image, index) => {
			  const path = `images/${albumRef.id}/${image.name}`;
			  const url = await uploadFile(image, path);
			  return url;
			})
		  );
	
		  // 3. Update the album document with image URLs
		  await updateDoc(albumRef, { imageUrls });
	
		  // Clear form after successful submission
		  setAlbumName('');
		  setImages([]);

		  toast.success(`Congratualtions ${userName}, \n your album has been created successsfully!`, {
			position: "top-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
		  });
	
		} catch (error) {

		  setIsPublished(false);
		  toast.error('Failed to create album. Please try again.', {
			position: "top-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
		  });

		  setTimeout(() => {
			setIsSubmitting(false);
		  }, 3000);
		}
	  };

	return (
		<>
		<ToastContainer />
		<div className="flex flex-col items-center justify-center bg-gray-200">
			<div className="w-[60vw] rounded-lg bg-white p-6 shadow-md">
				<div className="mb-2 flex flex-col items-center justify-start">
					<Image src={top} alt="topimage" className="h-14 w-14" />
					<p className="ml-2 text-lg font-semibold text-black">Create album</p>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="albumName" className="sr-only">Album Name</label>
						<input
						type="text"
						className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						id="albumName"
						placeholder="Album name"
						value={albumName}
						onChange={(e) => setAlbumName(e.target.value)}
						/>

						<p className="mt-1 text-sm text-gray-500">Choose your album name</p>
					</div>
					<div className="mb-6">
						<p className="mb-2 font-semibold text-gray-700">Photos</p>

						<div className="flex flex-row flex-wrap items-center gap-4">
							{images.map((image, index) => (
								<div key={index} className="relative">
									<Image
										src={URL.createObjectURL(image)}
										alt={image.name}
										width={100}
										height={100}
										className="h-28 w-32 object-cover"
									/>
									<button
										onClick={() => handleDeleteImage(index)}
										className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 p-2 text-white"
										aria-label="Delete image"
									>
										<FaTrash size={16} />
									</button>
								</div>
							))}
							<label htmlFor="imageUpload" className="cursor-pointer">
								<div className="flex h-28 w-32 flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400">
									<FaImage size={24} className="text-gray-400" />
									<span className="mt-2 text-sm text-gray-400">Add image</span>
								</div>
							</label>

							<input
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
								id="imageUpload"
								aria-label="Upload image"
							/>
						</div>


						{images.length > 0 && (
						<div className="mt-4 flex flex-row flex-wrap gap-4 text-sm text-gray-600">
							{images.map((image, index) => (
							<p key={index} className="whitespace-nowrap">
								{index + 1}. {image.name}
							</p>
							))}
						</div>
						)}

					</div>
					<div className="flex items-center justify-between">
						<button type="button" className="cursor-pointer text-blue-500" onClick={onGoBack}>
							Go back
						</button>
						
						<button
							type="submit"
							className={`rounded-md px-4 py-2 text-white transition-colors duration-300 ${
								albumName.trim() !== '' && images.length > 0 && !isSubmitting
								? 'bg-red-500 hover:bg-red-600'
								: 'bg-gray-400 cursor-not-allowed'
							}`}
							disabled={albumName.trim() === '' || images.length === 0 || isSubmitting}
						>
							{isPublished ? 'Published' : isSubmitting ? 'Publishing...' : 'Publish'}
						</button>

					</div>
				</form>
			</div>
		</div>
		</>
	);
}