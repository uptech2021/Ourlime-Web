import { useState } from 'react';
import Image from 'next/image';
import { CommunityVariantDetailsSummary } from '@/types/communityTypes';

type PostMediaProps = {
    media: CommunityVariantDetailsSummary[];
};

const PostMedia = ({ media }: PostMediaProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Ensure media is defined and has items
    if (!media || media.length === 0) {
        return <div>No media available</div>; // Handle empty media case
    }

    return (
        <div className="relative h-[400px] mb-4">
            {/* Main Active Media */}
            <div className="relative w-full h-full">
                {media[activeIndex]?.type === 'image' ? ( // Use optional chaining
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

export default PostMedia;