import { useState } from 'react';
import { ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import Image from 'next/image';

interface FollowerUser {
    id: string;
    user: {
        firstName: string;
        lastName: string;
        userName: string;
        profileImage: string | null;
    };
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
}

interface FollowersSliderProps {
    followers: FollowerUser[];
}

export const FollowersSlider = ({ followers }: FollowersSliderProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerPage = 3;
    const totalSlides = Math.ceil((followers?.length || 0) / itemsPerPage);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    return (
        <div className="relative">
            <div className="overflow-hidden">
                <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                        <div key={slideIndex} className="w-full flex-shrink-0">
                            <div className="grid grid-cols-3 gap-3">
                                {followers?.slice(
                                    slideIndex * itemsPerPage,
                                    (slideIndex + 1) * itemsPerPage
                                ).map((follower) => (
                                    <div
                                        key={follower.id}
                                        className="group relative bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-16 h-16 mb-3">
                                                {follower.user.profileImage ? (
                                                    <Image
                                                        src={follower.user.profileImage}
                                                        alt={`${follower.user.firstName}'s profile`}
                                                        fill
                                                        className="rounded-full object-cover border-2 border-gray-200 group-hover:border-greenTheme transition-colors"
                                                        loader={({ src }) => src}
                                                        unoptimized={true}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-200 group-hover:border-greenTheme transition-colors">
                                                        <span className="text-xl font-semibold text-gray-500">
                                                            {follower.user.firstName[0]}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-sm group-hover:bg-greenTheme transition-colors">
                                                    <UserCheck className="w-3 h-3 text-greenTheme group-hover:text-white transition-colors" />
                                                </div>
                                            </div>
                                            <h3 className="font-medium text-center text-gray-800 group-hover:text-gray-900">
                                                {follower.user.firstName} {follower.user.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500 text-center group-hover:text-greenTheme transition-colors">
                                                @{follower.user.userName}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {totalSlides > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
                        title="Previous slide"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all"
                        title="Next slide"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </>
            )}
        </div>
    );
};