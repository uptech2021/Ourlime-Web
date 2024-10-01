import Image, { StaticImageData } from 'next/image';
import React, { useState } from 'react';
type Article = {
	title: string;
	image: StaticImageData;
	date: string;
	author: string;
	// description: string
	// category: string,
};
type ArticlesProps = {
	articles: Article[];
};

export default function RecentArticles({ articles }: ArticlesProps) {
	const [searchTerm, setSearchTerm] = useState('');

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		setSearchTerm(event.target.value);
	};
	const filteredArticles = articles.filter((article) =>
		article.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<section className="mb-8 rounded-lg bg-white p-4 shadow-md">
			<div className="flex items-center border-b pb-2">
				<span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M20,11H4V8H20M20,15H13V13H20M20,19H13V17H20M11,19H4V13H11M20.33,4.67L18.67,3L17,4.67L15.33,3L13.67,4.67L12,3L10.33,4.67L8.67,3L7,4.67L5.33,3L3.67,4.67L2,3V19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19V3L20.33,4.67Z"
						></path>
					</svg>
				</span>
				<h2 className="text-2xl font-semibold">Most recent articles</h2>
			</div>
			<hr className="my-4" />

			<form className="mb-4">
				<input
					type="text"
					name="search"
					placeholder="Search for articles"
					className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
					value={searchTerm}
					onChange={handleSearchChange}
				/>
			</form>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{filteredArticles.map((article, index) => (
					<div key={index} className="flex flex-col">
						<div className="h-48 w-full cursor-pointer overflow-hidden rounded-lg">
							<Image
								src={article.image}
								alt="post thumbnail"
								layout="responsive"
								width={150}
								height={150}
								objectFit="cover"
								quality={100}
							/>
						</div>

						<p className="mt-2 cursor-pointer font-semibold">{article.title}</p>
						<div className="mt-1 text-sm text-gray-500">
							<span>{article.author}</span> ·<span>{article.date}</span>
						</div>
					</div>
				))}
			</div>

			<div className="mt-8 flex items-center justify-center">
				<svg
					className="mr-2 h-8 w-8 text-red-500"
					viewBox="0 0 88 75"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M83.9264 2.84634L44.0005 72L4.07461 2.84634L43.4806 17.407L44.0005 17.5991L44.5204 17.407L83.9264 2.84634Z"
						stroke="currentColor"
						strokeWidth="3"
					/>
				</svg>
				<span className="font-medium text-red-500">Load more articles</span>
			</div>
		</section>
	);
}
