type CategoriesProps = {
	categories: Array<string>;
};

export default function Categories({ categories }: CategoriesProps) {
	return (
		<div className="mb-8 rounded-lg bg-white p-4 shadow-md">
			<div className="flex items-center border-b pb-2">
				<span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M11,13.5V21.5H3V13.5H11M12,2L17.5,11H6.5L12,2M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13Z"
						></path>
					</svg>
				</span>
				<h2 className="text-2xl font-semibold">Categories</h2>
			</div>
			<div className="mt-2 flex flex-wrap">
				{categories.map((category) => (
					<span
						key={category}
						className="mb-2 mr-2 cursor-pointer rounded-full bg-gray-200 px-3 py-1 text-sm"
					>
						{category}
					</span>
				))}
			</div>
		</div>
	);
}
