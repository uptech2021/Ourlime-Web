'use client';

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
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchArticles } from '@/helpers/fetchArticles';
import type { Articles, Categories as CategoryType } from '@/types/global';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export const dynamic = 'force-dynamic'

function ArticlesContent() {
    const searchParams = useSearchParams();
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Articles[]>([]);

    const fetchCategories = async () => {
        try {
            const categoriesRef = collection(db, 'categories');
            const categoriesSnapshot = await getDocs(categoriesRef);
            const categoriesData = categoriesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CategoryType[];
    
            return categoriesData.sort((a, b) => {
                if (a.name === "All") return -1;
                if (b.name === "All") return 1;
                return a.name.localeCompare(b.name);
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    };
    
    useEffect(() => {
        const loadCategories = async () => {
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories as CategoryType[]);
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const category = searchParams.get('categories');
        const updateFilteredArticles = async () => {
            const fetchedArticles = await fetchArticles(category);
            setFilteredArticles(fetchedArticles as Articles[]);
        };
        updateFilteredArticles();
    }, [searchParams]);

    let popularPosts: Array<StaticImageData> = [
        post9,
        post6,
        post7,
        post8,
        post2,
    ];

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
