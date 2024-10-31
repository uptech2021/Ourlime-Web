'use client';

import { Suspense } from 'react';
import post6 from '@/public/images/articles/post6.jpg';
import post7 from '@/public/images/articles/post7.jpg';
import post8 from '@/public/images/articles/post8.jpeg';
import post9 from '@/public/images/articles/post9.jpg';
import post2 from '@/public/images/articles/post2.jpg';

import Navbar from '@/comm/Navbar';
import Categories from '@/components/blog/Categories';
import PopularPosts from '@/components/blog/PopularPosts';
import RecentArticles from '@/components/blog/RecentArticles';
import { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchArticles } from '@/helpers/fetchArticles';

type Articles = {
    id: string;
    title: string;
    image: string;
    date: { seconds: number; nanoseconds: number };
    author: string;
    category: string;
};

type CategoriesProps = {
    categories: Array<string>;
    filteredArticles: Articles[];
};

export const dynamic = 'force-dynamic'

function ArticlesContent() {
    const searchParams = useSearchParams();

    const [categories, setCategories] = useState<Array<string>>([
        "All",
        "Tech",
        "Lifestyle",
        "Cooking",
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

    const [filteredArticles, setFilteredArticles] = useState<Articles[]>([]);

    useEffect(() => {
        const category = searchParams.get('categories');
        const updateFilteredArticles = async () => {
            const fetchedArticles = await fetchArticles(category);
            setFilteredArticles(fetchedArticles as Articles[]);
        };
        updateFilteredArticles();
    }, [searchParams]);

    return (
        <Navbar>
            <div className="bg-gray-200 px-4 py-8">
                <main className="mx-auto w-4/5 text-gray-800">
                    <header className="text-left">
                        <h1 className="text-3xl font-bold">Articles</h1>
                    </header>

                    <Categories categories={categories} filteredArticles={filteredArticles} />
                    <RecentArticles articles={filteredArticles} />
                    <PopularPosts posts={popularPosts} />
                </main>
            </div>
        </Navbar>
    );
}

export default function Articles() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ArticlesContent />
        </Suspense>
    );
}
