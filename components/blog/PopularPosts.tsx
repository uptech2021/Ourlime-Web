import Image, { StaticImageData } from 'next/image';

type PopularPostsProps = {
	posts: Array<StaticImageData>;
};

export default function PopularPosts({ posts }: PopularPostsProps) {
	return (
		<div className="rounded-lg bg-white p-4 shadow-md">
			<div className="flex items-center border-b pb-2">
				<svg
					className="mr-2 h-6 w-6 text-red-500"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<path
						fill="currentColor"
						d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
					></path>
				</svg>
				<h2 className="text-2xl font-semibold">Popular posts</h2>
			</div>
			<hr className="my-4" />

			<ol className="space-y-4">
				{posts.map((post, index) => (
					<li key={index} className="flex items-center space-x-4">
						<div className="h-20 w-20 overflow-hidden rounded-lg">
							<Image
								src={post}
								alt="post thumbnail"
								layout="responsive"
								objectFit="cover"
								quality={100}
							/>
						</div>
						<div>
							<p className="font-semibold">
								Particle Size Analysis Market worth $596 million by 2028
							</p>
							<div className="text-sm text-gray-500">
								<span className="text-gray-400">By</span> <span>P N</span> ·
							</div>
						</div>
					</li>
				))}
			</ol>
		</div>
	);
}
