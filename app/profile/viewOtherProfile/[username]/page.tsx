'use client';

import { useEffect, useState } from 'react';
import { UserData } from '@/types/userTypes';
import { useParams } from 'next/navigation';
import { ViewOtherProfileHeader } from '@/components/commonProfileHeader/ViewOtherProfileHeader';
import { CircleUser, ImageIcon, Info, Users, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostAndDetails } from '@/components/viewOthers/PostAndDetails';
import { AboutDetails } from '@/components/viewOthers/AboutDetails';
import { FriendDetails } from '@/components/viewOthers/FriendDetails';
import { PhotosAndVideosDetails } from '@/components/viewOthers/PhotosAndVideosDetails';

export default function ViewProfile() {
    const [viewedUser, setViewedUser] = useState<UserData | null>(null);
    const [posts, setPosts] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [images, setImages] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [about, setAbout] = useState({
        workExperience: [],
        education: [],
        interests: [],
        skills: []
    });
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const username = (params.username as string).replace('@', '');
    const [activeTab, setActiveTab] = useState('posts');

    useEffect(() => {
        const fetchOtherUserProfile = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/profile/viewOtherProfile?username=${username}`);
                const data = await response.json();

                if (data.status === 'success') {
                    setViewedUser(data.user);
                    setPosts(data.posts);
                    setCommunities(data.communities);
                    setImages(data.images);
                    setFollowing(data.following);
                    setFollowers(data.followers);
                    setAbout(data.about);
                    setFriends(data.friends);
                }

                console.log("fetchinng all data", data);
                setLoading(false);
            } catch (error) {
                console.log('Error Data:', error);
                setLoading(false);
            }
        };

        fetchOtherUserProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse">Loading profile...</div>
            </div>
        );

    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="pt-12 sm:pt-20 md:pt-28 lg:pt-36 w-full 2xl:w-9/12 2xl:mx-auto tvScreen:w-7/12">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden w-full mb-6">
                    <ViewOtherProfileHeader userData={viewedUser} />
                    <div className="border-b">
                        <div className="flex gap-x-4 md:gap-x-6 overflow-x-auto scrollbar-hide">
                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'posts' ? 'text-greenTheme border-b-2 border-greenTheme' : 'text-gray-600 hover:text-greenTheme'}`}
                            >
                                <CircleUser size={18} />
                                <span>Posts</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('about')}
                                className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'about' ? 'text-greenTheme border-b-2 border-greenTheme' : 'text-gray-600 hover:text-greenTheme'}`}
                            >
                                <Info size={18} />
                                <span>About</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('friends')}
                                className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'friends' ? 'text-greenTheme border-b-2 border-greenTheme' : 'text-gray-600 hover:text-greenTheme'}`}
                            >
                                <Users size={18} />
                                <span>Friends</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('photos_and_videos')}
                                className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'photos' ? 'text-greenTheme border-b-2 border-greenTheme' : 'text-gray-600 hover:text-greenTheme'}`}
                            >
                                <ImageIcon size={18} />
                                <span>Photos & Videos</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-2 md:px-8">
                    <div className="flex-1 overflow-y-auto min-h-0">
                        <div className="p-4 sm:p-6 lg:p-8 relative min-h-[600px] scrollbar-hide">
                            <AnimatePresence mode="wait">
                                {activeTab === 'posts' && (
                                    <motion.div
                                        key="posts"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{
                                            duration: 0.2,
                                            ease: "easeInOut"
                                        }}
                                        className="w-full"
                                    >
                                        <PostAndDetails
                                            posts={posts}
                                            communities={communities}
                                            images={images}
                                            following={following}
                                            followers={followers}
                                            about={about}
                                        />
                                    </motion.div>
                                )}
                                {activeTab === 'about' && (
                                    <motion.div
                                        key="about"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{
                                            duration: 0.2,
                                            ease: "easeInOut"
                                        }}
                                        className="w-full"
                                    >
                                        <AboutDetails about={about} userData={viewedUser} />
                                    </motion.div>
                                )}
                                {activeTab === 'friends' && (
                                    <motion.div
                                        key="friends"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{
                                            duration: 0.2,
                                            ease: "easeInOut"
                                        }}
                                        className="w-full"
                                    >
                                        <FriendDetails friends={friends} />
                                    </motion.div>
                                )}
                                {activeTab === 'photos_and_videos' && (
                                    <motion.div
                                        key="photos_and_videos"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{
                                            duration: 0.2,
                                            ease: "easeInOut"
                                        }}
                                        className="w-full"
                                    >
                                        <PhotosAndVideosDetails media={images} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
