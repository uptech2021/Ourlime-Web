import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ImageSliderProps {
    images: {
        id: string;
        imageURL: string;
        uploadedAt: Date;
    }[];
}

export const ImageSlider = ({ images }: ImageSliderProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const itemsPerPage = 6;
    const totalSlides = Math.ceil((images?.length || 0) / itemsPerPage);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    return (
        <div className="relative">
            <div className="overflow-hidden rounded-lg">
                <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                        <div key={slideIndex} className="w-full flex-shrink-0">
                            <div className="grid grid-cols-3 gap-2">
                                {images?.slice(
                                    slideIndex * itemsPerPage,
                                    (slideIndex + 1) * itemsPerPage
                                ).map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
                                    >
                                        <Image
                                            src={image.imageURL}
                                            alt="User image"
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            unoptimized={true}
                                            loader={({ src }) => src}
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                        title="Previous slide"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
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
