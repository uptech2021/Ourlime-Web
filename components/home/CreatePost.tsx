import { useState } from 'react';
import { Avatar, Button, Skeleton } from '@nextui-org/react';
import { Smile, X, ImageIcon, Video, Upload, Hash, AtSign } from 'lucide-react';
import Image from 'next/image';
import { auth, db, storage } from '@/lib/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

type CreatePostProp = {
	setTogglePostForm: React.Dispatch<React.SetStateAction<boolean>>;
	profilePicture: string;
};

export default function CreatePost({ setTogglePostForm, profilePicture }: CreatePostProp) {
	const [caption, setCaption] = useState('');
	const [description, setDescription] = useState('');
	const [visibility, setVisibility] = useState('public');
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			setSelectedFiles(prev => [...prev, ...files]);

			files.forEach(file => {
				const reader = new FileReader();
				reader.onloadend = () => {
					setPreviews(prev => [...prev, reader.result as string]);
				};
				reader.readAsDataURL(file);
			});
		}
	};

	const removeFile = (index: number) => {
		setSelectedFiles(prev => prev.filter((_, i) => i !== index));
		setPreviews(prev => prev.filter((_, i) => i !== index));
	};

	const handlePost = async () => {
		if (!auth.currentUser) return;

		try {
			const postData = {
				caption,
					description,
					visibility,
					createdAt: new Date(),
					userId: auth.currentUser.uid
			};

			const postRef = collection(db, 'feedPosts');
			const docRef = await addDoc(postRef, postData);

			if (selectedFiles.length > 0) {
				const uploadPromises = selectedFiles.map(async (file) => {
					const storageRef = ref(storage, `posts/${docRef.id}/${file.name}`);
					const uploadResult = await uploadBytes(storageRef, file);
					const downloadURL = await getDownloadURL(uploadResult.ref);

					return addDoc(collection(db, 'feedsPostSummary'), {
						type: file.type.split('/')[0],
						typeUrl: downloadURL,
						feedsPostId: docRef.id
					});
				});

				await Promise.all(uploadPromises);
			}

			setCaption('');
			setDescription('');
			setSelectedFiles([]);
			setPreviews([]);
			setVisibility('public');
			setTogglePostForm(false);

		} catch (error) {
			console.error('Error creating post:', error);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			onClick={() => setTogglePostForm(false)}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div
				className="bg-white rounded-xl p-8 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={() => setTogglePostForm(false)}
					className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors"
					aria-label="Close modal"
				>
					<X size={24} />
				</button>

				<div className="flex items-center gap-4 mb-6">
					<div className="w-12 h-12 rounded-full overflow-hidden">
						<Avatar
							src={profilePicture}
							alt="profile picture"
							className="h-full w-full"
							showFallback
							fallback={<Skeleton className="h-full w-full rounded-full" />}
						/>
					</div>
					<div>
						<h3 id="modal-title" className="font-semibold">Create Post</h3>
						<div className="flex items-center gap-2">
							<select
								className="text-sm text-gray-600 border-none focus:outline-none"
								aria-label="Post visibility"
								value={visibility}
								onChange={(e) => setVisibility(e.target.value)}
							>
								<option value="public">Public</option>
								<option value="private">Private</option>
								<option value="friends">Friends Only</option>
							</select>
						</div>
					</div>
				</div>

				<input
					type="text"
					placeholder="Add a caption..."
					className="w-full p-4 border rounded-lg mb-4 focus:outline-none focus:border-greenTheme"
					aria-label="Post caption"
					value={caption}
					onChange={(e) => setCaption(e.target.value)}
				/>

				<textarea
					placeholder="Write a detailed description..."
					className="w-full p-4 border rounded-lg mb-4 h-32 resize-none focus:outline-none focus:border-greenTheme"
					aria-label="Post description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>

				<div className="border-2 border-dashed rounded-lg p-8 mb-4">
					<input
						type="file"
						multiple
						accept="image/*,video/*"
						onChange={handleFileSelect}
						className="hidden"
						id="file-upload"
					/>
					<label htmlFor="file-upload" className="cursor-pointer">
						<div className="text-center">
							<Upload className="mx-auto text-gray-400 w-12 h-12" aria-hidden="true" />
							<p className="text-gray-600">Drag and drop media files here</p>
							<span className="text-sm text-gray-400">or</span>
							<button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
								Browse Files
							</button>
						</div>
					</label>

					{previews.length > 0 && (
						<div className="grid grid-cols-3 gap-4 mt-4">
							{previews.map((preview, index) => (
								<div key={index} className="relative">
									<Image
										src={preview}
										alt={`Preview ${index + 1}`}
										width={100}
										height={100}
										className="rounded-lg object-cover w-full h-24"
									/>
									<button
										onClick={() => removeFile(index)}
										className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
										title="delete"
									>
										<X size={16} />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="mb-4">
					<div className="flex items-center gap-2 mb-2">
						<Hash className="text-gray-500" aria-hidden="true" />
						<span className="font-medium">Hashtags</span>
					</div>
					<input
						type="text"
						placeholder="Add hashtags (separate with spaces)..."
						className="w-full p-3 border rounded-lg focus:outline-none focus:border-greenTheme"
						aria-label="Add hashtags"
					/>
					<ul className="flex flex-wrap gap-2 mt-2" role="list">
						<li className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">#example</li>
					</ul>
				</div>

				<div className="mb-6">
					<div className="flex items-center gap-2 mb-2">
						<AtSign className="text-gray-500" aria-hidden="true" />
						<span className="font-medium">References</span>
					</div>
					<input
						type="text"
						placeholder="@mention people..."
						className="w-full p-3 border rounded-lg focus:outline-none focus:border-greenTheme"
						aria-label="Mention people"
					/>
					<ul className="flex flex-wrap gap-2 mt-2" role="list">
						<li className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">@username</li>
					</ul>
				</div>

				<div className="flex items-center justify-between pt-4 border-t">
					<div className="flex items-center gap-4">
						<Button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
							<Smile size={20} aria-hidden="true" />
							<span>Emoji</span>
						</Button>
					</div>
					<Button
						onClick={handlePost}
						className="px-8 py-2 bg-greenTheme text-white rounded-full hover:bg-green-600 transition-colors"
						aria-label="Create post"
					>
						Post
					</Button>
				</div>
			</div>
		</div>
	);
}