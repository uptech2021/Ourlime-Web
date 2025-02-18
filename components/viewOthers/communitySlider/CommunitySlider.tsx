import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Community } from '@/types/communityTypes';

interface CommunitySliderProps {
    communities?: Community[];
}

export const CommunitySlider = ({ communities }: CommunitySliderProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerPage = 4;
    const totalSlides = Math.ceil((communities?.length || 0) / itemsPerPage);

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
                            <div className="grid grid-cols-2 gap-3">
                                {communities?.slice(
                                    slideIndex * itemsPerPage,
                                    (slideIndex + 1) * itemsPerPage
                                ).map((community) => (
                                    <div
                                        key={community.id}
                                        className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
                                        style={{ height: '100px' }}
                                    >
                                        <Image
                                            src={community.imageUrl}
                                            alt={community.title}
                                            fill
                                            className="rounded-lg object-cover"
                                            unoptimized={true}
                                            loader={({ src }) => src}
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/transparentLogo.png'
                                            }}
                                        />

                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                                            <p className="text-white text-sm font-medium truncate">
                                                {community.title}
                                            </p>
                                            <p className="text-gray-300 text-xs">
                                                {community.membershipCount.toLocaleString()} members
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
                        className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50"
                        title="Previous slide"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-50"
                        title="Next slide"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}
        </div>
    );
};
