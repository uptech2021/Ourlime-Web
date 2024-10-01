'use client';
import post1 from '@/public/images/blogs/post1.jpg';
import post2 from '@/public/images/blogs/post2.jpg';
import post3 from '@/public/images/blogs/post3.jpg';
import post4 from '@/public/images/blogs/post4.jpg';
import post6 from '@/public/images/blogs/post6.jpg';
import post7 from '@/public/images/blogs/post7.jpg';
import post8 from '@/public/images/blogs/post8.jpeg';
import post9 from '@/public/images/blogs/post9.jpg';

import Navbar from '@/comm/Navbar';
import Categories from '@/components/blog/Categories';
import PopularPosts from '@/components/blog/PopularPosts';
import RecentArticles from '@/components/blog/RecentArticles';
import { StaticImageData } from 'next/image';
import { useState } from 'react';

type Article = {
	title: string;
	image: StaticImageData;
	date: string;
	author: string;
	// description: string
	// category: string,
};

export default function Blogs() {
	const [categories, setCategories] = useState<Array<string>>([
		'Cars and Vehicles',
		'Comedy',
		'Economics and Trade',
		'Education',
		'Entertainment',
		'Movies & Animation',
		'Gaming',
		'History',
		'Live style',
		'Natural',
		'News and Politics',
		'People and Nations',
		'Pets and Animals',
		'Places and Regions',
		'Science and Technology',
		'Sport',
		'Travel Events',
		'Other',
	]);
	const [articles, setArticles] = useState<Article[]>([
		{
			title: 'egg the Forces Shaping Wearable Market Landscape in...',
			image: post1,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landsca5pe in...',
			image: post2,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape23 in...',
			image: post3,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'egg the Forces Shaping Wearable Market Landscape in...',
			image: post1,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landsca5pe in...',
			image: post2,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape23 in...',
			image: post3,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'egg the Forces Shaping Wearable Market Landscape in...',
			image: post1,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landsca5pe in...',
			image: post2,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape23 in...',
			image: post3,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'egg the Forces Shaping Wearable Market Landscape in...',
			image: post1,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landsca5pe in...',
			image: post2,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape23 in...',
			image: post3,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'egg the Forces Shaping Wearable Market Landscape in...',
			image: post1,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landsca5pe in...',
			image: post2,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape23 in...',
			image: post3,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
		{
			title: 'Unravelling the Forces Shaping Wearable Market Landscape54 in...',
			image: post4,
			date: '16 Feb 2024',
			author: 'Sunita Lawankar',
		},
	]);
	const [popularPosts, setPosts] = useState<Array<StaticImageData>>([
		post9,
		post6,
		post7,
		post8,
		post2,
	]);
	console.log(setCategories, setPosts, setArticles)


	return (
		<Navbar>
			<div className="bg-gray-200 px-4 py-8">
				<main className="mx-auto w-4/5 text-gray-800">
					<header className="text-left">
						<h1 className="text-3xl font-bold">Blogs</h1>
					</header>

					<Categories categories={categories} />

					<RecentArticles articles={articles} />

					<PopularPosts posts={popularPosts} />
				</main>
			</div>
		</Navbar>
		
	);
}
