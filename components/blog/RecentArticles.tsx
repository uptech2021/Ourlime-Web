import Image, { StaticImageData } from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BlogCard from '../comm/BlogCard';


type Articles = {
    id: string;
    title: string;
    image: string;
    date: { seconds: number; nanoseconds: number };
    author: string;
    category?: string;
};

type ArticlesProps = {
    articles: Articles[];
};

export default function RecentArticles({ articles }: ArticlesProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [displayCount, setDisplayCount] = useState(3);
    const LOAD_INCREMENT = 3;
    const MINIMUM_DISPLAY = 3;

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        const currentParams = new URLSearchParams(searchParams.toString());
        const currentCategories = currentParams.get('categories');
        
    
        if (currentCategories) {
            currentParams.set('categories', currentCategories);
        }
        
        // Add search parameter
        if (searchTerm.trim()) {
            currentParams.set('search', searchTerm.trim());
        } else {
            currentParams.delete('search');
        }
        
        router.replace(`${window.location.pathname}?${currentParams.toString()}`, {
            scroll: false
        });
    };

    // Update fetchArticles function call
    useEffect(() => {
        const currentSearch = searchParams.get('search');
        const currentCategories = searchParams.get('categories');
        
        let queryParams = [];
        if (currentCategories) queryParams.push(currentCategories);
        if (currentSearch) queryParams.push(currentSearch);
    }, [searchParams]);

    const filteredArticles = articles
        .filter((article) => {
            const searchQuery = searchParams.get('search')?.toLowerCase();
            const categoryQuery = searchParams.get('categories')?.split(',');
            
            const matchesSearch = !searchQuery || 
                article.title.toLowerCase().includes(searchQuery) ||
                article.author.toLowerCase().includes(searchQuery);
                
            const matchesCategory = !categoryQuery || 
                categoryQuery.includes('All') ||
                categoryQuery.includes(article.category);
                
            return matchesSearch && matchesCategory;
        })
        .slice(0, displayCount);


    const handleLoadMore = () => {
        setDisplayCount(prev => prev + LOAD_INCREMENT);
    };

    const handleLoadLess = () => {
        setDisplayCount(prev => Math.max(MINIMUM_DISPLAY, prev - LOAD_INCREMENT));
    };


    const totalFilteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
    ).length;

    return (
        <section className="mb-8 rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-center border-b pb-2">
                <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20,11H4V8H20M20,15H13V13H20M20,19H13V17H20M11,19H4V13H11M20.33,4.67L18.67,3L17,4.67L15.33,3L13.67,4.67L12,3L10.33,4.67L8.67,3L7,4.67L5.33,3L3.67,4.67L2,3V19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19V3L20.33,4.67Z"></path>
                    </svg>
                </span>
                <h2 className="text-2xl font-semibold">Most recent articles</h2>
            </div>

            <div className="relative">

                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search for articles"
                        className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 pl-10"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </form>

            </div>


            <div className="max-w-7xl mx-auto p-2 sm:p-6 md:p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* {filteredArticles.map((article, index) => (
                        <div key={index} className="rounded overflow-hidden shadow-lg flex 
                            flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 opacity-100 
                            animate-fadeIn group">
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={article.image}
                                    alt={`Thumbnail for ${article.title}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    quality={100}
                                />
                                <div className="transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25 group-hover:bg-transparent">
                                </div>

                                {article.category && (
                                    <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3">
                                        {article.category}
                                    </div>
                                )}
                            </div>

                            <div className="px-6 py-4 mb-auto">
                                <a href="#" aria-label={`Read more about ${article.title}`} className="font-medium text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2">
                                    {article.author}
                                </a>
                                <p className="text-gray-500 text-sm">
                                    {article.title}
                                </p>
                            </div>

                            <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                                {new Date(article.date.seconds * 1000).toLocaleDateString()}
                            </div>
                        </div>
                    ))} */}
                    {filteredArticles.map((article, index) => (
                        <BlogCard
                            key={index}
                            {...article}
                        />
                    ))}
                </div>


                <div className="mt-12 flex items-center justify-center space-x-4">
                    {displayCount > MINIMUM_DISPLAY && (
                        <div
                            className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={handleLoadLess}
                        >
                            <svg
                                className="mr-2 h-8 w-8 text-red-500 rotate-180"
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
                            <span className="font-medium text-red-500">Load less</span>
                        </div>
                    )}

                    {filteredArticles.length < totalFilteredArticles && (
                        <div
                            className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={handleLoadMore}
                        >
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
                    )}
                </div>
            </div>
        </section>
    );
}
