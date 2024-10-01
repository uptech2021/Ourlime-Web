'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Heart, MessageSquareMore, Share2 } from 'lucide-react';

const ReactPlayer = dynamic(() => import('react-player'), {
	ssr: false,
});
export default function Post({
	profilePicture,
	userName,
	postTime,
	subject,
	bodyText,
	image,
	video,
}: {
	profilePicture: string;
	userName: string;
	postTime: number;
	subject: string;
	bodyText: string;
	image?: string;
	video?: string;
}) {
	return (
		<div className="my-2 flex flex-col justify-center rounded-lg bg-white p-5 shadow-md">
			<div className="flex items-center gap-3">
				<div className="h-12 w-12 rounded-full">
					<Image
						src={profilePicture}
						alt="profile picture"
						quality={100}
						width={150}
						height={150}
						className="h-full w-full rounded-full object-cover"
					/>
				</div>
				<p className="text-lg font-semibold">{userName}</p>
				<p className="ml-auto text-gray-500">{postTime} mins</p>
			</div>

			<div className="mt-4">
				<p className="text-base">
					{subject}
					<br />
					<br />
					{bodyText}
					{/* <span className="text-gray-500">Read More ...</span> */}
				</p>

				{image && (
					<div className="mt-4">
						<Image
							src="/images/home/trees.jpg"
							alt="trees"
							quality={100}
							width={150}
							height={150}
							className="h-auto w-full"
						/>
					</div>
				)}

				{video && (
					<div className="mt-4">
						<ReactPlayer
							url={video}
							controls={true}
							width="100%"
							height="15rem"
							light={false}
						/>
					</div>
				)}

				<div className="mt-4 flex items-center gap-3">
					<div className="likes">
						<Heart color="red" /> 23k
					</div>
					<div className="comments">
						<MessageSquareMore className="text-greenTheme" />
						115
					</div>
					<div className="share">
						<Share2 className="text-gray-400" />
						Share
					</div>
					<div className="ml-auto flex -space-x-4">
						<div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
							<Image
								src="/images/home/userPicture.png"
								alt="User profile picture"
								quality={100}
								width={150}
								height={150}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
							<Image
								src="/images/home/userPicture.png"
								alt="User profile picture"
								quality={100}
								width={150}
								height={150}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
							<Image
								src="/images/home/userPicture.png"
								alt="User profile picture"
								quality={100}
								width={150}
								height={150}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white">
							<Image
								src="/images/home/userPicture.png"
								alt="User profile picture"
								quality={100}
								width={150}
								height={150}
								className="h-full w-full object-cover"
							/>
						</div>
					</div>
				</div>

				<form className="mt-4">
					<textarea
						name="comment"
						placeholder="Type your comment here..."
						className="w-full rounded-b-lg border border-gray-300 p-2 text-base outline-none"
					/>
				</form>
			</div>
		</div>
	);
}
