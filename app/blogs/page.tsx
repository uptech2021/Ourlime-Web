'use client';

import post6 from '@/public/images/blogs/post6.jpg';
import post7 from '@/public/images/blogs/post7.jpg';
import post8 from '@/public/images/blogs/post8.jpeg';
import post9 from '@/public/images/blogs/post9.jpg';
import post2 from '@/public/images/blogs/post2.jpg';

import Navbar from '@/comm/Navbar';
import Categories from '@/components/blog/Categories';
import PopularPosts from '@/components/blog/PopularPosts';
import RecentArticles from '@/components/blog/RecentArticles';
import { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import { fetchArticles } from '@/helpers/fetchArticles';

type Blog = {
    id: string;
    title: string;
    image: string;
    date: { seconds: number; nanoseconds: number };
    author: string;
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

    const [blogs, setBlogs] = useState<Blog[]>([]);

    const [popularPosts, setPosts] = useState<Array<StaticImageData>>([
        post9,
        post6,
        post7,
        post8,
        post2,
    ]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const fetchedBlogs = await fetchArticles();
            console.log('Fetched Blogs:', fetchedBlogs);
            setBlogs(fetchedBlogs as Blog[]);
        };
       
        fetchBlogs();
    }, []);

    return (
        <Navbar>
            <div className="bg-gray-200 px-4 py-8">
                <main className="mx-auto w-4/5 text-gray-800">
                    <header className="text-left">
                        <h1 className="text-3xl font-bold">Blogs</h1>
                    </header>

                    <Categories categories={categories} />
                    <RecentArticles articles={blogs} />
                    <PopularPosts posts={popularPosts} />
                </main>
            </div>
        </Navbar>
    );
}
