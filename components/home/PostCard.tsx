import { Post } from '@/types/userTypes'; // Adjust the import based on your project structure
import Image from 'next/image';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { useState } from 'react';


const PostMedia = ({ media }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="relative h-[400px] mb-4">
            {/* Main Active Media */}
            <div className="relative w-full h-full">
                {media[activeIndex].type === 'image' ? (
                    <Image
                        src={media[activeIndex].typeUrl}
                        alt="Post content"
                        fill
                        className="object-cover rounded-lg"
                        loader={({ src }) => src}
                        unoptimized={true}
                    />
                ) : (
                    <video controls className="w-full h-full object-cover rounded-lg">
                        <source src={media[activeIndex].typeUrl} />
                    </video>
                )}
            </div>

            {/* Overlay Slider */}
            <div className="absolute bottom-4 left-0 right-0 flex gap-2 px-4 overflow-x-auto">
                {media.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`relative w-16 h-16 rounded-lg cursor-pointer transition-all 
                            ${activeIndex === index ? 'opacity-100 ring-2 ring-greenTheme' : 'opacity-50'}`}
                    >
                        {item.type === 'image' ? (
                            <Image
                                src={item.typeUrl}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover rounded-lg"
                                loader={({ src }) => src}
                                unoptimized={true}
                            />
                        ) : (
                            <video className="w-full h-full object-cover rounded-lg">
                                <source src={item.typeUrl} />
                            </video>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const PostCard = ({ post }: { post: Post }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            {/* User Info Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    {post.user.profileImage ? (
                        <Image
                            src={post.user.profileImage}
                            alt={`${post.user.firstName}'s profile`}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            priority
                            unoptimized={true}
                            loader={({ src }) => src}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200" />
                    )}
                </div>
                <div>
                    <h3 className="font-semibold">{post.user.firstName} {post.user.lastName}</h3>
                    <span className="text-sm text-gray-500">@{post.user.userName}</span>
                </div>
            </div>

            {/* Caption */}
            {post.caption && (
                <p className="text-lg mb-3">{post.caption}</p>
            )}

            {/* Description */}
            {post.description && (
                <p className="text-gray-600 mb-4">{post.description}</p>
            )}

            {/* Media Content */}
            {post.media && post.media.length > 0 && (
                <PostMedia media={post.media} />
            )}

            {/* Hashtags */}
            {post.hashtags && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.hashtags.map((tag, index) => (
                        <span key={index} className="text-greenTheme hover:underline cursor-pointer">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* User References */}
            {post.userReferences && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.userReferences.map((user, index) => (
                        <span key={index} className="text-blue-500 hover:underline cursor-pointer">
                            @{user}
                        </span>
                    ))}
                </div>
            )}

            {/* Interaction Buttons */}
            <div className="flex items-center gap-4 pt-3 border-t">
                <button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
                    <Heart size={20} />
                    <span>Like</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
                    <MessageCircle size={20} />
                    <span>Comment</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
                    <Share size={20} />
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
};

export default PostCard;
