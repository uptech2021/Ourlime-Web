import { Post } from '@/types/userTypes';
import PostCard from '../home/PostCard';
import { Community } from '@/types/communityTypes';
import Image from 'next/image';
import { CommunitySlider } from './communitySlider/CommunitySlider';
import { ImageSlider } from './imageSlider/ImageSlider';
import { FollowingSlider } from './followingSlider/FollowingSlider';
import { FollowersSlider } from './followerSlider/FollowingSlider';
import { AboutSection } from './about/about';

interface PostAndDetailsProps {
    posts: Post[];
    communities?: Community[];
    images?: any[];
    following?: any[];
    followers?: any[];
    about?: {
        workExperience: any[];
        education: any[];
        interests: any[];
        skills: any[];
    };
}

export const PostAndDetails = ({ 
    posts, communities, images, 
    following, followers, about
}: PostAndDetailsProps) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 -mx-4 sm:-mx-6 lg:-mx-8">
            {/* Main Content - Posts Column */}
            <div className="lg:col-span-2 space-y-4">
                {posts?.length > 0 ? (
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Posts Yet</h3>
                        <p className="text-gray-500">This user hasn't shared any posts yet.</p>
                    </div>
                )}
            </div>

            {/* Sidebar - User Details Column */}
            <div className="space-y-4">
                {/* About Card */}
                <div className="bg-white rounded-xl shadow-sm p-3">
                    <h3 className="font-semibold text-lg mb-3">About</h3>
                    {/* About content */}
                    {about && <AboutSection about={about} />}
                </div>

                {/* Community Card */}
                <div className="bg-white rounded-xl shadow-sm p-3 overflow-hidden">
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold">Communities</h2>
                            <div className="flex items-center gap-2">
                                <select aria-label="Filter communities" className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white hover:border-gray-300 transition-colors">
                                    <option value="all">All Communities</option>
                                    <option value="newest">Newest</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="active">Most Active</option>
                                </select>
                                <button
                                    onClick={() => (window.location.href = "/communities")}
                                    className="text-sm text-greenTheme hover:underline whitespace-nowrap"
                                >
                                    See All
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <CommunitySlider communities={communities} />
                </div>

                {/* Likes Card */}
                <div className="bg-white rounded-xl shadow-sm p-3">
                    <h3 className="font-semibold text-lg mb-3">Likes</h3>
                    {/* Likes content */}
                </div>

                {/* Following Card */}
                <div className="bg-white rounded-xl shadow-sm p-3">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">Following</h3>
                        <button
                            className="text-sm text-greenTheme hover:underline"
                        >
                            See All
                        </button>
                    </div>
                    <FollowingSlider following={following} />
                </div>


                {/* Photos & Videos Card */}
                <div className="bg-white rounded-xl shadow-sm p-3">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">Photos & Videos</h3>
                        <select aria-label="Filter media" className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white hover:border-gray-300 transition-colors">
                            <option value="all">All Media</option>
                            <option value="photos">Photos</option>
                            <option value="videos">Videos</option>
                        </select>
                    </div>
                    <ImageSlider images={images} />
                    <button
                        className="w-full mt-3 text-sm text-greenTheme hover:underline text-center"
                    >
                        View All Media
                    </button>
                </div>

                {/* Followers Card */}
                <div className="bg-white rounded-xl shadow-sm p-3">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">Followers</h3>
                        <button
                            className="text-sm text-greenTheme hover:underline"
                        >
                            See All
                        </button>
                    </div>
                    <FollowersSlider followers={followers} />
                </div>

            </div>
        </div>
    );
};