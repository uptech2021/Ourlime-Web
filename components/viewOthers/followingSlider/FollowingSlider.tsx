import { useState } from 'react';
import { ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import Image from 'next/image';

interface FollowingUser {
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

interface FollowingSliderProps {
    following: FollowingUser[];
}

export const FollowingSlider = ({ following }: FollowingSliderProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerPage = 3;
    const totalSlides = Math.ceil((following?.length || 0) / itemsPerPage);

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
                            <div className="grid grid-cols-3 gap-4">
                                {following?.slice(
                                    slideIndex * itemsPerPage,
                                    (slideIndex + 1) * itemsPerPage
                                ).map((followingUser) => (
                                    <div
                                        key={followingUser.id}
                                        className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-16 h-16 mb-3">
                                                {followingUser.user.profileImage ? (
                                                    <Image
                                                        src={followingUser.user.profileImage}
                                                        alt={`${followingUser.user.firstName}'s profile`}
                                                        fill
                                                        className="rounded-full object-cover border-2 border-greenTheme"
                                                        loader={({ src }) => src}
                                                        unoptimized={true}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-xl font-semibold text-gray-500">
                                                            {followingUser.user.firstName[0]}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute -bottom-1 -right-1 bg-greenTheme rounded-full p-1">
                                                    <UserPlus className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-center">
                                                {followingUser.user.firstName} {followingUser.user.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500 text-center">
                                                @{followingUser.user.userName}
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
                        className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}
        </div>
    );
};