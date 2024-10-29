'use client';

import { Suspense } from 'react';
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
import { useSearchParams } from 'next/navigation';
import { fetchArticles } from '@/helpers/fetchArticles';

type Blog = {
    id: string;
    title: string;
    image: string;
    date: { seconds: number; nanoseconds: number };
    author: string;
};

type CategoriesProps = {
    categories: Array<string>;
    filteredBlogs: Blog[];
};

export const dynamic = 'force-dynamic'

function BlogsContent() {
    const searchParams = useSearchParams();

    const [categories, setCategories] = useState<Array<string>>([
        "All",
        "Shawn",
        "Kyle",
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

    const [popularPosts, setPosts] = useState<Array<StaticImageData>>([
        post9,
        post6,
        post7,
        post8,
        post2,
    ]);

    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const category = searchParams.get('categories');
        const updateFilteredBlogs = async () => {
            const fetchedBlogs = await fetchArticles(category);
            setFilteredBlogs(fetchedBlogs as Blog[]);
        };
        updateFilteredBlogs();
    }, [searchParams]);

    return (
        <Navbar>
            <div className="bg-gray-200 px-4 py-8">
                <main className="mx-auto w-4/5 text-gray-800">
                    <header className="text-left">
                        <h1 className="text-3xl font-bold">Blogs</h1>
                    </header>

                    <Categories categories={categories} filteredBlogs={filteredBlogs} />
                    <RecentArticles articles={filteredBlogs} />
                    <PopularPosts posts={popularPosts} />
                </main>
            </div>
        </Navbar>
    );
}

export default function Blogs() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BlogsContent />
        </Suspense>
    );
}
