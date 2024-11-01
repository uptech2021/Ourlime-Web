import { formatDate } from '@/helpers/Posts';
import { SocialPosts } from '@/types/global';
import {
	Avatar,
	AvatarGroup,
	Image,
	Skeleton,
	Textarea,
} from '@nextui-org/react';
import { Heart, MessageCircle, Share } from 'lucide-react';
import React from 'react';
import ReactPlayer from 'react-player';

export default function AllPosts({ allPosts }: { allPosts: SocialPosts[] }) {
	return (
		<div>
			{allPosts
				.sort((a, b) => b.time - a.time)
				.map((post, index) => (
					<div
						key={index}
						className="mb-5 mt-5 flex flex-col justify-center rounded-xl bg-white p-5 shadow-md"
					>
						<div className="flex items-center gap-3">
							<div className="h-12 w-12 overflow-hidden rounded-full">
								<Avatar
									src={post.profileImage?.toString()}
									alt="profile picture"
									className="h-full w-full object-cover"
									showFallback
									fallback={<Skeleton className="h-full w-full" />}
								/>
							</div>
							<p className="text-lg font-semibold">{post.username}</p>
							<p className="ml-auto text-sm text-gray-500">
								{formatDate(post.time)}
							</p>
						</div>
						<div className="mt-3">
							<p className="text-base">{post.content}</p>
							<div className="flex w-full flex-wrap gap-3">
								{post.type.video?.length > 1 && (
									<ReactPlayer
										url={post.type.video}
										controls
										width="100%"
										height="15rem"
									/>
								)}
								{post.type.image?.length > 1 && (
									<Image
										src={post.type.image}
										alt="post image"
										className="max-h-65 w-86 object-cover"
										width={1000}
									/>
								)}
							</div>
							<div className="mt-3 flex items-center gap-3">
								<div className="text-base">
									<Heart className="cursor-pointer hover:text-red-500" />{' '}
									{post.likes}
								</div>
								<div className="text-base">
									<MessageCircle className="cursor-pointer hover:text-gray-500" />{' '}
									{post.comments}
								</div>
								<div className="cursor-pointer text-base">
									<Share className="cursor-pointer hover:text-blue-500" />
								</div>
								<div className="ml-auto flex flex-row-reverse">
									<AvatarGroup className="cursor-pointer" isBordered max={3}>
										{[...Array(100)].map((_, idx) => (
											<Avatar
												key={idx}
												src="/images/home/userPicture.png"
												alt="User profile picture"
												size="sm"
											/>
										))}
									</AvatarGroup>
								</div>
							</div>
							<form className="mt-2 w-full">
								<Textarea
									name="comment"
									placeholder="Type your comment here..."
									className="h-12 w-full"
								/>
							</form>
						</div>
					</div>
				))}
		</div>
	);
}
