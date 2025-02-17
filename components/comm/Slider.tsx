'use client';

import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slider = ({ children }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [slideWidth, setSlideWidth] = useState(0);

    useEffect(() => {
        const updateSlideWidth = () => {
            if (window.innerWidth >= 768) {
                setSlideWidth(window.innerWidth / 2); // 2 items per row on md+
            } else {
                setSlideWidth(window.innerWidth); // 1 item per row on mobile
            }
        };

        updateSlideWidth(); // Initial set
        window.addEventListener('resize', updateSlideWidth);

        return () => {
            window.removeEventListener('resize', updateSlideWidth);
        };
    }, []);

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: slideWidth, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative w-full overflow-hidden">
            {/* Left Scroll Button */}
            <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-md rounded-full z-10"
                onClick={scrollLeft}
                aria-label="Scroll left"
            >
                <ChevronLeft size={24} />
            </button>

            {/* Slider Container */}
            <div
                ref={sliderRef}
                className="flex overflow-x-auto space-x-4 p-2 scrollbar-hide scroll-smooth whitespace-nowrap"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {children}
            </div>

            {/* Right Scroll Button */}
            <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-md rounded-full z-10"
                onClick={scrollRight}
                aria-label="Scroll right"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default Slider;
