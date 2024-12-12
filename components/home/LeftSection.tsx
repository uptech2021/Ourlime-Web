import userPicture from '@/public/images/home/userPicture.png';
import { ProfileData, UserData } from '@/types/global';
import { Avatar, Input, Skeleton } from '@nextui-org/react';
import { Settings, Users, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

type LeftSectionProps = {
	user: UserData;
	profile: ProfileData;
};

export default function LeftSection({user, profile}: LeftSectionProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [showAllChats, setShowAllChats] = useState(false);
	const [visibleChats, setVisibleChats] = useState(3);
	const [maxHeight, setMaxHeight] = useState('300px');

	const allNames = [
		'Aaron Hazzard',
		'Rishi Kowlesser',
		'Raushawn Mitchell',
		'Kyle Nagee',
		'Josiah James',
		'Neola Hernadez',
	];

	const filteredNames = allNames.filter((name) => 
		name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Update visible chats and container height based on screen size
	useEffect(() => {
		const handleResize = () => {
			const screenHeight = window.innerHeight;
			if (screenHeight < 600) {
				setVisibleChats(2);
				setMaxHeight('150px');
			} else if (screenHeight < 800) {
				setVisibleChats(3);
				setMaxHeight('200px');
			} else {
				setVisibleChats(4);
				setMaxHeight('300px');
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const displayedNames = showAllChats 
		? filteredNames 
		: filteredNames.slice(0, visibleChats);

	return (
		<section className="fixed top-[120px] left-4 flex w-1/5 flex-col gap-1">
			<div className="flex flex-col items-center rounded-xl bg-white p-5 shadow-md">
				<div className="w-1/2 rounded-full p-1">
					<Avatar
						src={user.photoURL || ''}
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
				<div className="mt-4 flex w-full justify-center gap-3 text-sm">
					<div className="text-center">
						<p className="text-sm font-medium">{profile.following || 0}</p>
						<p className="text-gray-700">Following</p>
					</div>
					<div className="text-center">
						<p className="text-sm font-medium">{profile.posts || 0}</p>
						<p className="text-sm text-gray-700">Posts</p>
					</div>
					<div className="text-center">
						<p className="text-sm font-medium">{profile.followers || 0}</p>
						<p className="text-sm text-gray-700">Followers</p>
					</div>
				</div>
			</div>

			<aside className="flex flex-col pt-5 w-full">
				<div className="flex items-center justify-between px-3">
					<h2 className="mr-auto">Chats</h2>
					<Users className="ml-1" />
					<Settings className="ml-1" />
				</div>
				<div className="flex flex-col rounded-xl bg-white py-5 shadow-md">
					<form className="flex w-full justify-center px-3 mb-4">
						<Input
							type="text"
							labelPlacement="outside"
							label="Search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</form>
					<div className="flex flex-col">
						<div 
							className="flex flex-col gap-3 pl-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
							style={{ maxHeight: showAllChats ? maxHeight : 'auto' }}
						>
							{displayedNames.map((name, index) => (
								<div 
									key={index}
									className="flex cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors items-center"
								>
									<div className="h-10 w-10 rounded-full shrink-0">
										<Image
											src={userPicture}
											alt="profile picture"
											width={40}
											height={40}
											className="rounded-full object-cover"
										/>
									</div>
									<div className="flex flex-col justify-center pl-3">
										<p className="m-0 text-sm truncate">{name}</p>
									</div>
								</div>
							))}
						</div>
						{filteredNames.length > visibleChats && (
							<button
								onClick={() => setShowAllChats(!showAllChats)}
								className="mt-2 flex items-center justify-center gap-2 text-sm text-[#027823] hover:text-[#025c1c] transition-colors p-2 hover:bg-gray-50 rounded-lg"
							>
								{showAllChats ? (
									<>
										Show Less <ChevronUp size={16} />
									</>
								) : (
									<>
										See More ({filteredNames.length - visibleChats}) <ChevronDown size={16} />
									</>
								)}
							</button>
						)}
					</div>
				</div>
			</aside>

			<aside>
				<p className='text-sm pt-12 pl-2'>Privacy Terms Cookies </p>
			</aside>
		</section>
	);
}
