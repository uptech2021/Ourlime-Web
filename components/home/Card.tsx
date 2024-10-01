import { Avatar, Skeleton } from '@nextui-org/react';
import Image from 'next/image';

type CardProps = {
	username: string;
	file: string;
	profilePicture: string;
};

export default function Card({ username, file, profilePicture }: CardProps) {
	return (
		<div className="ml-5 flex flex-col items-center border border-dashed">
			<div className="story scroll-snap-align-start flex w-full cursor-grab flex-col">
				<div className="user relative flex w-24 flex-col items-center rounded-2xl">
					<div className="h-40 w-full rounded-2xl border">
						<Image
							src={file}
							alt="story thumbnail"
							width={150}
							height={150}
							className="h-full w-full rounded-2xl object-cover"
						/>

						{!file && <Skeleton className="h-full w-full rounded-2xl" />}
					</div>

					<div className="profileImage-wrapper absolute bottom-[-16%] w-1/2 rounded-full">
						<Avatar
							size="md"
							radius="full"
							src={profilePicture}
							showFallback
							fallback={<Skeleton className="h-full w-full rounded-full" />}
						/>
					</div>
				</div>
				<p className="username mt-10 text-center">{username}</p>
			</div>
		</div>
	);
}
