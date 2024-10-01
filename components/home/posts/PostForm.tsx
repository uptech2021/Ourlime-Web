import {
	AtSign,
	BarChart4,
	Earth,
	FileIcon,
	Film,
	Hash,
	ImageIcon,
	Lock,
	MapPin,
	Mic,
	Music,
	Smile,
	UserRound,
	Users,
	Video,
	X,
} from 'lucide-react';
import React, { SetStateAction, useRef, useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import styles from './postform.module.css';
import { SocialPosts } from '@/types/global';
import ReactPlayer from 'react-player';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Image } from '@nextui-org/react';
import { getAuth } from 'firebase/auth';
import { uploadFile } from '@/helpers/firebaseStorage';
import { db } from '@/firebaseConfig';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';

//TODO aaron Add Gif icon
export default function PostForm({
	setTogglePostForm,
	setSocialPosts,
}: {
	setTogglePostForm: React.Dispatch<SetStateAction<boolean>>;
	setSocialPosts: React.Dispatch<SetStateAction<SocialPosts[]>>;
}) {
	const [togglePrivacy, setTogglePrivacy] = useState<boolean>(false);
	const [toggleEmojiPicker, setToggleEmojiPicker] = useState<boolean>(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
	const [textareaValue, setTextareaValue] = useState('');

	//Closes the post form by toggling the `togglePostForm`, `togglePrivacy`, and `toggleEmojiPicker` state variables.
	const closeForm = () => {
		setTogglePostForm((prev: boolean) => !prev);
		setTogglePrivacy((prev: boolean) => !prev);
		setToggleEmojiPicker((prev: boolean) => !prev);
	};

	// Adds a hashtag character to the textarea when the hashtag icon is clicked.
	const handleHashtagClick = () =>
		textareaRef.current ? (textareaRef.current.value += '#') : null;
	//Adds an at-sign character to the textarea when the at-sign icon is clicked.
	const handleAtSignClick = () =>
		textareaRef.current ? (textareaRef.current.value += '@') : null;

	//Adds the selected emoji to the textarea when an emoji is clicked in the emoji picker.
	const handleEmojiClick = (emojiObject: EmojiClickData) =>
		textareaRef.current
			? (textareaRef.current.value += emojiObject.emoji)
			: null;

	const createSocialPost = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const content = formData.get('content') as string;
		const image = formData.get('image') as File;
		const video = formData.get('video') as File;

		if (content) {
			const auth = getAuth();
			const user = auth.currentUser;

			if (!user) {
				toast.error('You must be logged in to create a post.', {
					position: 'top-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
				return;
			}

			let postImageUrl = '';
			let videoUrl = '';

			if (image && image.name) {
				console.log('uploading image');
				postImageUrl = await uploadFile(image, `images/${image.name}`);
			}
			if (video && video.name) {
				console.log('uploading video');
				videoUrl = await uploadFile(video, `videos/${video.name}`);
			}

			// Fetch username from the user collection
			const userDoc = await getDoc(doc(db, 'users', user.uid));
			const username = userDoc.exists() ? userDoc.data().userName : 'Anonymous';

			const newSocialPost = {
				profileImage: user.photoURL || '/images/avatar.jpg',
				username: username || 'Anonymous',
				email: user.email || 'anonymous@mail.com',
				time: new Date().toISOString(),
				content,
				postImage: postImageUrl,
				video: videoUrl,
			};
			console.log(newSocialPost);

			try {
				await addDoc(collection(db, 'posts'), newSocialPost);

				setSocialPosts((prevSocialPosts: SocialPosts[]) => [
					newSocialPost,
					...prevSocialPosts,
				]);
				setTogglePostForm(false);
			} catch (error) {
				toast.error('Error creating post. Please try again.', {
					position: 'top-right',
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			}
		} else {
			toast.error('Please enter some content before posting.', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	};

	return (
		<>
			<ToastContainer />

			<form
				onSubmit={createSocialPost}
				className="fixed top-0 z-40 flex h-full w-full flex-col bg-white sm:left-1/2 sm:top-1/2 sm:mx-auto sm:h-auto sm:w-[70%] sm:-translate-x-1/2 sm:-translate-y-1/2 lg:w-[50%]"
			>
				<div className="flex items-center justify-between border-b-2 p-5">
					<X onClick={closeForm} className="cursor-pointer" />

					<Button
						isDisabled={!textareaValue.trim()}
						type="submit"
						className="bg-buttonGradientTheme"
					>
						Share
					</Button>
				</div>

				<textarea
					ref={textareaRef}
					onChange={(event) => setTextareaValue(event.target.value)}
					name="content"
					placeholder="What's happening?"
					className="relative h-full w-full resize-none p-3 outline-none"
				/>

				{/* Privacy and shortcuts */}
				<div className="relative bottom-0">
					<div className="flex w-full flex-row items-center justify-between border-b-2 px-3 pb-3">
						<div
							onClick={() => setTogglePrivacy((prev) => !prev)}
							className="relative flex cursor-pointer flex-row gap-1"
						>
							{togglePrivacy && (
								<ul className="absolute -top-40 flex w-[11rem] flex-col gap-3 rounded-lg bg-black px-3 py-2 text-sm text-white">
									<li className="flex cursor-pointer flex-row gap-2">
										<Lock color="white" className="" />
										Only Me
									</li>
									<li className="flex cursor-pointer flex-row gap-2">
										<Earth color="white" className="" />
										Everyone
									</li>
									<li className="flex cursor-pointer flex-row gap-2">
										<UserRound color="white" className="" />
										People I follow
									</li>
									<li className="flex cursor-pointer flex-row gap-2">
										<Users color="white" className="" />
										People Follow Me
									</li>
								</ul>
							)}
							<Earth />
							<p>Everyone</p>
						</div>

						<div className="flex flex-row gap-2">
							<Hash onClick={handleHashtagClick} className="cursor-pointer" />
							<AtSign onClick={handleAtSignClick} className="cursor-pointer" />
							<div className="relative">
								{toggleEmojiPicker && (
									<div className="absolute left-[-16.5rem] top-[-29rem] sm:left-[-22rem] sm:top-0 lg:top-[-2rem]">
										<EmojiPicker width={290} onEmojiClick={handleEmojiClick} />
									</div>
								)}

								<Smile
									onClick={() => setToggleEmojiPicker((prev: boolean) => !prev)}
									className="cursor-pointer"
								/>
							</div>
						</div>
					</div>

					<div className="mx-auto flex w-1/2 flex-row flex-wrap justify-center gap-3">
						{selectedImage && (
							<Image
								src={URL.createObjectURL(selectedImage)}
								alt="post image"
								radius="sm"
								className="mx-auto h-56 w-full object-contain"
							/>
						)}
						{selectedVideo && (
							<ReactPlayer
								url={URL.createObjectURL(selectedVideo)}
								controls
								width="100%"
								height="15rem"
							/>
						)}
						
					</div>

					{/* Icons */}
					<div className="flex flex-row justify-center py-5 sm:gap-4 sm:overflow-x-visible">
						<div className={styles.iconsLayout}>
							<label className={styles.iconWrapper}>
								<ImageIcon className={styles.icon} />
								<p className={styles.iconType}>Upload Images</p>
								<input
									type="file"
									name="image"
									accept="image/*"
									className="hidden"
									onChange={(e) =>
										setSelectedImage(e.target.files?.[0] || null)
									}
								/>
							</label>
							<label className={styles.iconWrapper}>
								<Video className={styles.icon} />
								<p className={styles.iconType}>Upload Video</p>
								<input
									type="file"
									name="video"
									accept="video/*"
									className="hidden"
									onChange={(e) =>
										setSelectedVideo(e.target.files?.[0] || null)
									}
								/>
							</label>
							<label className={styles.iconWrapper}>
								<Film className={styles.icon} />
								<p className={styles.iconType}>Upload Reels</p>
							</label>
							<label className={styles.iconWrapper}>
								<Mic className={styles.icon} />
								<p className={styles.iconType}>Record Voice</p>
							</label>
						</div>

						<div className={styles.iconsLayout}>
							<label className={styles.iconWrapper}>
								<FileIcon className={styles.icon} />
								<p className={styles.iconType}>Upload File</p>
							</label>
							<label className={styles.iconWrapper}>
								<BarChart4 className={styles.icon} />
								<p className={styles.iconType}>Create Poll</p>
							</label>
							<label
								className={styles.iconWrapper}
							>
								<MapPin className={styles.icon} />
								<p className={styles.iconType}>Location</p>
							</label>
							<label className={styles.iconWrapper}>
								<Music className={styles.icon} />
								<p className={styles.iconType}>Upload Audio</p>
							</label>
						</div>
					</div>
				</div>
			</form>
		</>
	);
}
