// CommunitiesSlider component
import { Image } from '@nextui-org/react';

export default function CommunitiesSlider() {
	const communities = [
		{
			src: '/images/home/gaming.jpg',
			alt: 'Gaming Community',
			name: 'Gaming Community',
		},
		{
			src: '/images/home/computer.webp',
			alt: 'Computer Community',
			name: 'IT Community',
		},
		{
			src: '/images/home/hands.webp',
			alt: 'Hands-on Community',
			name: 'Family Community',
		},
		{
			src: '/images/home/people.jpg',
			alt: 'People Community',
			name: 'Friendly Community',
		},
		{
			src: '/images/home/gaming.jpg',
			alt: 'Gaming Community',
			name: 'Gaming Community',
		},
		{
			src: '/images/home/computer.webp',
			alt: 'Computer Community',
			name: 'IT Community',
		},
		{
			src: '/images/home/hands.webp',
			alt: 'Hands-on Community',
			name: 'Family Community',
		},
		{
			src: '/images/home/people.jpg',
			alt: 'People Community',
			name: 'Friendly Community',
		},
	];

	return (
		<div className="flex w-full gap-5 overflow-x-scroll scrollbar-hide lg:h-[50rem] lg:flex-col lg:justify-center lg:pt-[64rem] xl:mx-auto xl:w-[80%]">
			{communities.map((community, index) => (
				<div
					key={index}
					className="flex w-full cursor-pointer flex-col gap-5 px-3"
				>
					<div className="relative h-48 w-full">
						<Image
							src={community.src}
							alt={community.alt}
							className="h-48 w-[50rem] rounded-xl object-cover"
						/>
					</div>
					{community.name}
				</div>
			))}
		</div>
	);
}
