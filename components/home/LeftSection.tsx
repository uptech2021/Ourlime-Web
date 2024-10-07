import userPicture from '@/public/images/home/userPicture.png';
import { ProfileData, UserData } from '@/types/global';
import { Avatar, Input, Skeleton } from '@nextui-org/react';
import { Settings, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type LeftSectionProps = {
	user: UserData;
	profile: ProfileData;
};

export default function LeftSection({user, profile}: LeftSectionProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const filteredNames = [
		'Aaron Hazzard',
		'Rishi Kowlesser',
		'Raushawn Mitchell',
		'Kyle Nagee',
		'Josiah James',
		'Neola Hernadez',
	].filter((name) => name.toLowerCase().includes(searchQuery.toLowerCase()));

	return (
		<section className="flex w-1/4 flex-col gap-1">
			<div className="flex flex-col items-center rounded-xl bg-white p-5 shadow-md">
				<div className="w-1/2 rounded-full p-1">
					<Avatar
						src={profile.profilePicture}
						alt="profile picture"
						className="h-full w-full"
						isBordered
						color="success"
						showFallback
						fallback={<Skeleton className="h-full w-full" />}
					/>
				</div>
				<div className="w-full text-center">
					<p className="mb-0 text-xl font-semibold">
						{profile.firstName} {profile.lastName}
					</p>
					<p className="mt-0 text-gray-500">@{user.userName}</p>
				</div>
				<div className="mt-4 flex w-full justify-center gap-5">
					<div className="text-center">
						<p className="text-sm font-medium">{profile.following || 0}</p>
						<p className="text-gray-700">Following</p>
					</div>
					<div className="text-center">
						<p className="text-sm font-medium">{profile.posts || 0}</p>
						<p className="text-gray-700">Posts</p>
					</div>
					<div className="text-center">
						<p className="text-sm font-medium">{profile.followers || 0}</p>
						<p className="text-gray-700">Followers</p>
					</div>
				</div>
			</div>

			<aside className="flex flex-col p-5">
				<div className="flex items-center justify-between px-3">
					<h2 className="mr-auto">Chats</h2>
					<Users className="ml-1" />
					<Settings className="ml-1" />
				</div>
				<div className="flex flex-col rounded-xl bg-white py-5 shadow-md">
					<form className="flex w-full justify-center px-3">
						<Input
							type="text"
							labelPlacement="outside"
							label="Search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</form>
					<div className="mt-5 flex flex-col gap-5 pl-5">
						{filteredNames.map((name, index) => (
							<div className="flex cursor-pointer" key={index}>
								<div className="mt-3 h-12 w-12 rounded-full">
									<Image
										src={userPicture}
										alt="profile picture"
										priority={
											userPicture.src === '/public/images/logo.png'
												? true
												: false
										}
										className="h-full w-full rounded-full object-cover"
									/>
								</div>
								<div className="flex flex-col justify-center pl-5">
									<p className="m-0 text-sm">{name}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</aside>
		</section>
	);
}
