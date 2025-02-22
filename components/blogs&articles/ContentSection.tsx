'use client';

import { useState, useEffect } from 'react';
import { Clock, ThumbsUp, MessageCircle, Share2, TrendingUp, BookOpen, Edit } from 'lucide-react';
import { Button } from '@nextui-org/react';

interface BlogsAndArticalPost {
    id: string;
    type: 'blog' | 'article';
    title: string;
    excerpt: string;
    category: string;
    author: {
        name: string;
        avatar: string;
    };
    coverImage: string;
    readTime: number;
    likes: number;
    comments: number;
    shares: number;
    publishedAt: string;
    isFeatured?: boolean;
    trending?: boolean;
}

const HeroSection = ({ featuredPosts }: { featuredPosts: BlogsAndArticalPost[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (featuredPosts.length === 0) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [featuredPosts.length]);

    if (featuredPosts.length === 0) return null;

    return (
        <div className="relative h-[280px] sm:h-[320px] md:h-[360px] rounded-xl overflow-hidden mb-8">
            {featuredPosts.map((post, index) => (
                <div
                    key={post.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
                        ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="relative h-full">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                            <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
                                <span className="bg-greenTheme px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm">
                                    {post.category}
                                </span>
                                <span className="bg-white/20 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm flex items-center gap-1">
                                    {post.type === 'article' ? <BookOpen size={12} /> : <Edit size={12} />}
                                    {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 leading-tight line-clamp-2">
                                {post.title}
                            </h1>
                            <p className="text-gray-200 text-sm sm:text-base md:text-lg mb-4 md:mb-6 max-w-3xl line-clamp-2 sm:line-clamp-3">
                                {post.excerpt}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white"
                                    />
                                    <div>
                                        <p className="font-medium text-sm sm:text-base md:text-lg">{post.author.name}</p>
                                        <p className="text-gray-300 text-xs sm:text-sm">
                                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300 text-xs sm:text-sm">
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} className="hidden sm:inline" />
                                        {post.readTime} min read
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ThumbsUp size={14} className="hidden sm:inline" />
                                        {post.likes}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle size={14} className="hidden sm:inline" />
                                        {post.comments}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 flex gap-2">
                {featuredPosts.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300
                            ${index === currentIndex ? 'bg-greenTheme w-6 sm:w-8' : 'bg-white/50 hover:bg-white/80'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

const PostCard = ({ post }: { post: BlogsAndArticalPost }) => {
    const defaultAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330";
    const defaultAuthorName = "Anonymous";

    const authorAvatar = post.author?.avatar || defaultAvatar;
    const authorName = post.author?.name || defaultAuthorName;

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-[16/9] relative overflow-hidden">
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                {post.trending && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <TrendingUp size={12} />
                        Trending
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-greenTheme text-sm">{post.category}</span>
                    <span className="text-gray-400">•</span>
                    <span className={`text-sm flex items-center gap-1 ${post.type === 'article' ? 'text-blue-600' : 'text-purple-600'}`}>
                        {post.type === 'article' ? <BookOpen size={14} /> : <Edit size={14} />}
                        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime} min read
                    </span>
                </div>
                <h3 className="font-bold text-lg mb-2 hover:text-greenTheme transition-colors">
                    {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src={authorAvatar}
                            alt={authorName}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">{authorName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                        <button className="hover:text-greenTheme transition-colors flex items-center gap-1">
                            <ThumbsUp size={18} />
                            <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="hover:text-greenTheme transition-colors flex items-center gap-1">
                            <MessageCircle size={18} />
                            <span className="text-sm">{post.comments}</span>
                        </button>
                        <button className="hover:text-greenTheme transition-colors flex items-center gap-1">
                            <Share2 size={18} />
                            <span className="text-sm">{post.shares}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ContentSection() {
    const [contentType, setContentType] = useState<'all' | 'articles' | 'blogs'>('all');
    const [sortBy, setSortBy] = useState<'latest' | 'trending'>('latest');
    const [posts, setPosts] = useState<BlogsAndArticalPost[]>([]);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/blogs&articles');
            const data = await response.json();

            if (data.status === 'success') {
                const formattedPosts = data.data.map(post => ({
                    id: post.id,
                    type: post.type,
                    title: post.title,
                    excerpt: post.excerpt,
                    category: post.categories[0]?.name || 'Uncategorized',
                    author: {
                        name: 'Anonymous',
                        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
                    },
                    coverImage: post.coverImage,
                    readTime: post.engagement[0]?.readTimeAverage || 0,
                    likes: post.engagement[0]?.likesCount || 0,
                    comments: post.engagement[0]?.commentsCount || 0,
                    shares: post.engagement[0]?.sharesCount || 0,
                    publishedAt: new Date(post.createdAt.seconds * 1000).toISOString(),
                    trending: post.flags?.trending || false,
                    isFeatured: post.flags?.isFeatured || false
                }));
                setPosts(formattedPosts);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const featuredPosts = posts.filter(post => post.isFeatured);
    const filteredPosts = posts.filter(post => {
        if (contentType === 'all') return true;
        return post.type === (contentType === 'articles' ? 'article' : 'blog');
    });

    return (
        <div className="w-full lg:w-4/5">
            {/* <HeroSection featuredPosts={featuredPosts} /> */}
            <HeroSection featuredPosts={posts} />


            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold">Latest Posts</h2>
                <div className="flex items-center gap-4">
                    <div className="flex rounded-lg overflow-hidden border">
                        <button
                            onClick={() => setContentType('all')}
                            className={`px-4 py-2 text-sm ${contentType === 'all'
                                ? 'bg-greenTheme text-white'
                                : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setContentType('articles')}
                            className={`px-4 py-2 text-sm ${contentType === 'articles'
                                ? 'bg-greenTheme text-white'
                                : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            Articles
                        </button>
                        <button
                            onClick={() => setContentType('blogs')}
                            className={`px-4 py-2 text-sm ${contentType === 'blogs'
                                ? 'bg-greenTheme text-white'
                                : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            Blogs
                        </button>
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'latest' | 'trending')}
                        className="bg-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-greenTheme"
                        aria-label="Sort posts by"
                    >
                        <option value="latest">Latest</option>
                        <option value="trending">Trending</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>

            <div className="text-center mt-8">
                <Button
                    className="bg-greenTheme text-white px-8 py-2 rounded-lg hover:bg-greenTheme/90 transition-colors"
                    onClick={() => console.log('Load more posts')}
                >
                    Load More
                </Button>
            </div>

            <div className="mt-12 bg-white p-8 rounded-lg shadow-sm">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                    <p className="text-gray-600">Get the latest articles and blogs delivered to your inbox</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                    />
                    <Button className="bg-greenTheme text-white px-6">
                        Subscribe
                    </Button>
                </div>
            </div>
        </div>
    );
}


