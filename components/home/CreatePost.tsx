import Image from 'next/image';
import { Camera, CircleEllipsis, Smile } from 'lucide-react';

export default function CreatePost() {
	return (
		<div className="post-container flex flex-row items-center rounded-lg bg-white p-5 shadow-md">
			<div className="border-10 h-12 w-12 rounded-full border border-greenTheme">
				<Image
					src="/images/Aaron.jpg"
					alt="profile picture"
					quality={100}
					width={150}
					height={150}
					className="h-full w-full rounded-full object-cover"
				/>
			</div>

			<div className="ml-10 flex w-full flex-col">
				<form className="mb-5 mt-5 w-full border-b">
					<input
						type="text"
						name="content"
						placeholder="What's going on?"
						className="w-full border-b border-none border-gray-400 bg-transparent pb-2 text-base outline-none"
					/>
				</form>

				<div className="flex items-center justify-between">
					<div className="flex flex-row gap-3">
						<Camera className="text-greenTheme" />
						<Smile className="text-greenTheme" />
					</div>

					<CircleEllipsis className="cursor-pointer" color="grey" />
				</div>
			</div>
		</div>
	);
}