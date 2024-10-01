import Image from 'next/image';
import ourlimeImage from '@/public/images/logo.png';
import userPicture from '@/public/images/home/userPicture.png';
import { useState } from 'react';
import { Avatar, Input, Skeleton } from '@nextui-org/react';
import { Settings, Users } from 'lucide-react';
export default function LeftSection() {
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
						src={ourlimeImage.src}
						alt="profile picture"
						className="h-full w-full"
						isBordered
						color="success"
						showFallback
						fallback={<Skeleton className="h-full w-full" />}
					/>
				</div>
				<div className="w-full text-center">
					<p className="mb-0 text-xl font-semibold">Ourlime Admin</p>
					<p className="mt-0 text-gray-500">@ourlime_admin</p>
				</div>
				<div className="mt-4 flex w-full justify-center gap-5">
					<div className="text-center">
						<p className="text-sm font-medium">11</p>
						<p className="text-gray-700">Following</p>
					</div>
					<div className="text-center">
						<p className="text-sm font-medium">16</p>
						<p className="text-gray-700">Posts</p>
					</div>
					<div className="text-center">
						<p className="text-sm font-medium">6</p>
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
							labelPlacement='outside'
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
