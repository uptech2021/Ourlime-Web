import Image, { StaticImageData } from 'next/image';
import React, { useState } from 'react';

type Blog = {
    id: string;
    title: string;
    image: string;
    date: { seconds: number; nanoseconds: number };
    author: string;
};

type BlogsProps = {
    articles: Blog[];
};

export default function RecentArticles({ articles }: BlogsProps) {
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20,11H4V8H20M20,15H13V13H20M20,19H13V17H20M11,19H4V13H11M20.33,4.67L18.67,3L17,4.67L15.33,3L13.67,4.67L12,3L10.33,4.67L8.67,3L7,4.67L5.33,3L3.67,4.67L2,3V19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19V3L20.33,4.67Z"></path>
                    </svg>
                </span>
                <h2 className="text-2xl font-semibold">Most recent articles</h2>
            </div>

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

            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredArticles.map((article, index) => (
                        <div key={index} className="rounded overflow-hidden shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                            <div className="relative h-48 overflow-hidden">
                                <a href="#">
                                    <Image
                                        src={article.image}
                                        alt="post thumbnail"
                                        fill
                                        className="object-cover transition-transform duration-300 hover:scale-110"
                                        quality={100}
                                    />
                                    <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                                    </div>
                                </a>
                            </div>

                            <div className="px-6 py-4 mb-auto">
                                <a href="#" className="font-medium text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2">
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
                    ))}
                </div>
            </div>
        </section>
    );
}
