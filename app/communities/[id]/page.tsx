'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getFriends } from '@/helpers/friendsAndFollowingHelper';
import { UserData, ProfileImage, BasePost } from '@/types/userTypes';
import { fetchCommunityMembers, fetchCommunityPosts } from '@/helpers/communities';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import CreateCommunityPost from '@/components/communities/CreateCommunityPosts';

// type BasePost = {
//     id: string;
//     title: string;
//     content: string;
//     author: {
//         id: string;
//         name: string;
//         avatar: string;
//         role: string;
//     };
//     // stats: {
//     //     likes: number;
//     //     comments: number;
//     //     shares: number;
//     // };
//     // tags: string[];
//     timestamp: string;
// };

type GalleryPost = BasePost & {
    type: 'gallery';
    media: string[];
};

type VideoPost = BasePost & {
    type: 'video';
    media: string;
    thumbnail: string;
    duration: string;
};

type ArticlePost = BasePost & {
    type: 'article';
    coverImage: string;
    readTime: string;
    link: string;
};

type MusicPost = BasePost & {
    type: 'music';
    albumArt: string;
    trackList: Array<{ name: string; duration: string; }>;
    platform: string;
    playlistLink: string;
};

type ResourcePost = BasePost & {
    type: 'resource';
    resources: Array<{
        title: string;
        author: string;
        cover: string;
        link: string;
    }>;
};

type Post = GalleryPost | VideoPost | ArticlePost | MusicPost | ResourcePost;

export default function CommunityDetailPage() {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [members, setMembers] = useState<UserData[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const { id } = useParams();
    const communityVariantId = id? String(id): "";

    useEffect(() => {
        const loadMembers = async () => {
            const fetchedMembers = await fetchCommunityMembers(communityVariantId);
            setMembers(fetchedMembers);
        };
        loadMembers();
    }, [communityVariantId]);

    useEffect(() => {
        const loadPosts = async () => {
            if (communityVariantId) {
                const fetchedCommunityPosts = await fetchCommunityPosts(communityVariantId);
                // const validPosts = fetchedCommunityPosts.filter(isPost); // Ensure valid posts
                setPosts(fetchedCommunityPosts); // Set the posts to state

                console.log(fetchedCommunityPosts);
            }
        };

        loadPosts();
    }, [communityVariantId]);


    // Rich test data for community
    const communityData = {
        id: "1",
        name: "Tech Innovators Hub",
        description: "A vibrant community for tech enthusiasts and innovators to share ideas and collaborate on cutting-edge projects",
        memberCount: 15432,
        postsCount: 1250,
        rules: [
            "Be respectful and professional",
            "Share valuable content only",
            "No spam or self-promotion"
        ],
        categories: ["Technology", "Development", "Innovation"]
    };

    // Test data for posts with reliable images
    // const initialPosts: Post[] = [
    //     {
    //         id: "1",
    //         type: "gallery",
    //         title: "Our Latest Tech Conference",
    //         content: "Highlights from our amazing 3-day tech conference featuring industry leaders",
    //         media: [
    //             "https://picsum.photos/seed/tech1/800/600",
    //             "https://picsum.photos/seed/tech2/800/600",
    //             "https://picsum.photos/seed/tech3/800/600",
    //         ],
    //         author: {
    //             id: "a1",
    //             name: "Sarah Chen",
    //             avatar: "https://picsum.photos/seed/sarah/200/200",
    //             role: "Event Coordinator"
    //         },
    //         stats: { likes: 1234, comments: 89, shares: 45 },
    //         tags: ["Conference", "Technology", "Events"],
    //         timestamp: "2 hours ago"
    //     },
    //     {
    //         id: "2",
    //         type: "video",
    //         title: "New Framework Tutorial",
    //         content: "A comprehensive guide to building modern applications",
    //         media: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    //         thumbnail: "https://picsum.photos/seed/tutorial/800/600",
    //         duration: "15:24",
    //         author: {
    //             id: "a2",
    //             name: "Alex Rivera",
    //             avatar: "https://picsum.photos/seed/alex/200/200",
    //             role: "Senior Developer"
    //         },
    //         stats: { likes: 892, comments: 156, shares: 78 },
    //         tags: ["Tutorial", "Development", "Coding"],
    //         timestamp: "5 hours ago"
    //     },
    //     {
    //         id: "3",
    //         type: "article",
    //         title: "The Future of AI Development",
    //         content: "Exploring upcoming trends in artificial intelligence and machine learning",
    //         coverImage: "https://picsum.photos/seed/ai/800/600",
    //         readTime: "5 min read",
    //         link: "https://techblog.com/ai-future",
    //         author: {
    //             id: "a3",
    //             name: "Emma Watson",
    //             avatar: "https://picsum.photos/seed/emma/200/200",
    //             role: "AI Researcher"
    //         },
    //         stats: { likes: 756, comments: 93, shares: 41 },
    //         tags: ["AI", "Research", "Technology"],
    //         timestamp: "1 day ago"
    //     },
    //     {
    //         id: "4",
    //         type: "music",
    //         title: "Coding Playlist 2024",
    //         content: "Perfect background music for your programming sessions",
    //         albumArt: "https://picsum.photos/seed/music/800/600",
    //         trackList: [
    //             { name: "Algorithm Beats", duration: "3:45" },
    //             { name: "Debug Dance", duration: "4:20" },
    //             { name: "Function Flow", duration: "3:30" }
    //         ],
    //         platform: "Spotify",
    //         playlistLink: "https://spotify.com/playlist/coding2024",
    //         author: {
    //             id: "a4",
    //             name: "Michael Chang",
    //             avatar: "https://picsum.photos/seed/michael/200/200",
    //             role: "Music Curator"
    //         },
    //         stats: { likes: 645, comments: 72, shares: 38 },
    //         tags: ["Music", "Productivity", "Coding"],
    //         timestamp: "2 days ago"
    //     },
    //     {
    //         id: "5",
    //         type: "resource",
    //         title: "Essential Developer Books",
    //         content: "Must-read books for every software developer",
    //         resources: [
    //             {
    //                 title: "Clean Code",
    //                 author: "Robert C. Martin",
    //                 cover: "https://picsum.photos/seed/book1/800/600",
    //                 link: "https://amazon.com/clean-code"
    //             },
    //             {
    //                 title: "Design Patterns",
    //                 author: "Gang of Four",
    //                 cover: "https://picsum.photos/seed/book2/800/600",
    //                 link: "https://amazon.com/design-patterns"
    //             }
    //         ],
    //         author: {
    //             id: "a5",
    //             name: "Lisa Johnson",
    //             avatar: "https://picsum.photos/seed/lisa/200/200",
    //             role: "Technical Lead"
    //         },
    //         stats: { likes: 923, comments: 147, shares: 256 },
    //         tags: ["Books", "Learning", "Development"],
    //         timestamp: "3 days ago"
    //     }
    // ];

    const [currentSlide, setCurrentSlide] = useState<Record<string, number>>({});

    const nextSlide = (postId: string, resourcesLength: number) => {
        setCurrentSlide((prev) => ({
            ...prev,
            [postId]: ((prev[postId] || 0) + 1) % resourcesLength
        }));
    };
    
    const prevSlide = (postId: string, resourcesLength: number) => {
        setCurrentSlide((prev) => ({
            ...prev,
            [postId]: prev[postId] === 0 ? resourcesLength - 1 : prev[postId] - 1
        }));
    };
    

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 pt-36 h-[calc(100vh-144px)] fixed">
                    <div className="flex w-full gap-6 h-full">
                        {/* Left Section */}
                        <section className="w-[20%] bg-white rounded-lg shadow-sm p-4">
                            <h2 className="text-lg font-bold">Topics</h2>
                            <ul className="mt-4 space-y-2">
                                <li className="text-gray-600">Plants</li>
                                <li className="text-gray-600">Animals</li>
                                <li className="text-gray-600">Educational</li>
                                <li className="text-gray-600">Wildlife</li>
                                <li className="text-gray-600">Marine</li>
                            </ul>
                            <h2 className="text-lg font-bold mt-6">Members</h2>
                            <ul className="mt-4 space-y-2">
                                {members.map(member => (
                                    <li key={member.id} className="flex items-center gap-2">
                                    <img src={member.profileImage} alt={member.userName} className="rounded-full w-10 h-10" />
                                    <div>
                                        <div className="font-semibold">{`${member.firstName} ${member.lastName}`}</div>
                                        <div className="text-sm text-gray-500">@{member.userName}</div>
                                    </div>
                                </li>
                                ))}
                            </ul>
                        </section>

                        {/* Middle Section - Posts Feed */}
                        <section className="w-[60%] overflow-y-auto h-[calc(100vh-9rem)] scrollbar-hide">
                            {/* Community Header Card */}
                            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                                <h2 className="text-xl font-bold">{communityData.name}</h2>
                                <p className="text-gray-600 text-sm my-2">{communityData.description}</p>
                                <div className="flex items-center gap-4">
                                    <button className="px-4 py-1.5 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors">
                                        Join Community
                                    </button>
                                    <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title='heart'>
                                        <Heart className="w-5 h-5 text-gray-500" />
                                    </button>
                                    <button className="px-4 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        Share
                                    </button>
                                    <button className="px-4 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        More
                                    </button>
                                </div>
                            </div>

                            {/* Posts Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                {posts.map((post) => (
                                    <div key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                                        {/* Dynamic Media Section */}
                                        {post.type === 'gallery' ? (
                                            <div className="aspect-video relative rounded-t-xl overflow-hidden">
                                                <Image
                                                    src={post.media[0]} // Show first image, could add carousel
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                    loader={({ src }) => src}
                                                    unoptimized={true}
                                                />
                                                {post.media.length > 1 && (
                                                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
                                                        +{post.media.length - 1}
                                                    </div>
                                                )}
                                            </div>
                                        ) : post.type === 'video' ? (
                                            <div className="aspect-video relative rounded-t-xl overflow-hidden">
                                                <video
                                                    className="w-full h-full object-cover"
                                                    poster={post.thumbnail}
                                                    controls
                                                    playsInline
                                                >
                                                    <source src={post.media} type="video/mp4" />
                                                </video>
                                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
                                                    {post.duration}
                                                </div>
                                            </div>
                                        
                                        ) : post.type === 'article' ? (
                                            <div className="aspect-video relative rounded-t-xl overflow-hidden">
                                                <Image
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                    loader={({ src }) => src}
                                                    unoptimized={true}
                                                />
                                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
                                                    {post.readTime}
                                                </div>
                                            </div>
                                        ) : post.type === 'music' ? (
                                            <div className="aspect-video relative rounded-t-xl overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 p-6">
                                                <div className="flex items-center gap-6">
                                                    <Image
                                                        src={post.albumArt}
                                                        alt={post.title}
                                                        width={120}
                                                        height={120}
                                                        className="rounded-lg shadow-lg"
                                                        loader={({ src }) => src}
                                                        unoptimized={true}
                                                    />
                                                    <div className="flex-1 text-white">
                                                        <div className="mb-4">
                                                            <h3 className="font-bold text-xl">{post.trackList[0].name}</h3>
                                                            <p className="text-white/80">{post.platform}</p>
                                                        </div>
                                                        <audio
                                                            id={`audio-${post.id}`}
                                                            src={post.trackList[0].name}
                                                            className="w-full"
                                                            controls
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : post.type === 'resource' ? (
                                            <div className="aspect-video relative rounded-t-xl overflow-hidden">
                                                <div className="flex h-full">
                                                    {post.resources.map((resource, index) => (
                                                        <div key={index} className="w-full h-full flex-shrink-0">
                                                            <Image
                                                                src={resource.cover}
                                                                alt={resource.title}
                                                                fill
                                                                className="object-contain"
                                                                loader={({ src }) => src}
                                                                unoptimized={true}
                                                            />
                                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                                                <h4 className="text-white font-medium">{resource.title}</h4>
                                                                <p className="text-white/80 text-sm">{resource.author}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
                                                    {`${(currentSlide[post.id] || 0) + 1}/${post.resources.length}`}

                                                </div>
                                                {post.resources.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={() => prevSlide(post.id, post.resources.length)}
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50"
                                                            title="prev"
                                                        >
                                                            <ChevronLeft size={20} />
                                                        </button>

                                                        <button
                                                            onClick={() => nextSlide(post.id, post.resources.length)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50"
                                                            title="next"
                                                        >
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        ) : null}

                                        {/* Post Content Section - Remains the same for all types */}
                                        <div className="p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Image
                                                    src={post.author.avatar}
                                                    alt={post.author.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                    loader={({ src }) => src}
                                                    unoptimized={true}
                                                />
                                                <div>
                                                    <div className="font-semibold">{post.author.name}</div>
                                                    <div className="text-sm text-gray-500">{post.author.role}</div>
                                                </div>
                                            </div>

                                            <h3 className="font-bold mb-2">{post.title}</h3>
                                            <p className="text-gray-600 text-sm mb-3">{post.content}</p>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {/* {post.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))} */}
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-4">
                                                    {/* <span>{post.stats.likes} likes</span>
                                                    <span>{post.stats.comments} comments</span> */}
                                                </div>
                                                <span>{post.timestamp.toDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                ))}                            </div>

                        </section>


                        {/* Right Section */}
                        <section className="w-[20%] bg-white rounded-lg shadow-sm p-4">
                            <h2 className="text-lg font-bold">Details</h2>
                            <p>Created: <span>February 1st 2025</span></p>
                            <p>Status: <span>Public</span></p>
                            <div className="mt-4">
                                <p>Online: 76 Members</p>
                            </div>
                            <button 
                            className="px-4 py-1.5 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors"
                            onClick={() => setIsPostModalOpen(true)}>
                                Create Post +
                            </button>
                            <h2 className="text-lg font-bold mt-6">Join Your Friends</h2>
                            <ul className="mt-4 space-y-2">
                                <li className="text-gray-600">Bruce Banner</li>
                                <li className="text-gray-600">Tony Stark</li>
                                <li className="text-gray-600">Wade Wilson</li>
                            </ul>
                            <h2 className="text-lg font-bold mt-6">Recommended</h2>
                            <ul className="mt-4 space-y-2">
                                <li className="text-gray-600">Food World</li>
                                <li className="text-gray-600">Fitness Hub</li>
                            </ul>
                        </section>
                    </div>
                </main>
            </div>

            {/* Create Post Modal */}
            {isPostModalOpen && (
                <CreateCommunityPost 
                    communityVariantId={communityVariantId}
                    setTogglePostForm={setIsPostModalOpen} 
                    profilePicture="path/to/profile/picture" // Replace with actual profile picture
                />
            )}
        </>
    );
}
