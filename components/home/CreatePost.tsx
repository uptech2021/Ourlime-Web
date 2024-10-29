import ourlimeImage from '@/public/images/logo.png';
import { Avatar, Button, Skeleton } from '@nextui-org/react';
import { CircleEllipsis, Smile } from 'lucide-react';

type CreatePostProp = {
	setTogglePostForm: React.Dispatch<React.SetStateAction<boolean>>;
	profilePicture: string;
} 
export default function CreatePost({ setTogglePostForm, profilePicture }: CreatePostProp) { 
	return (
		<div className="box-border flex flex-col justify-around rounded-xl bg-white p-5 shadow-md">
			<div className="overflow-huidden h-10 w-10 rounded-full">
				<Avatar
					src={profilePicture}
					alt="profile picture"
					className="h-full w-full"
					showFallback
					fallback={<Skeleton className="h-full w-full rounded-full" />}
				/>
			</div>

			<form
				onClick={() => setTogglePostForm((prev) => !prev)}
				className="mb-5 mt-5 cursor-pointer"
			>
				<div className="w-full border-b border-gray-300 bg-transparent pb-2 text-base outline-none">
					<p className="opacity-50">What&apos;s going on?</p>
				</div>

				<div className="mt-5 flex flex-wrap items-center gap-3">
					<Button>Gallery</Button>
					<Smile className="text-green-600" />
					<CircleEllipsis className="ml-auto cursor-pointer" color="grey" />
				</div>
			</form>
		</div>
	);
}