'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slider = ({ children }) => {
    const sliderRef = useRef(null);

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative w-full">
            <button 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-md rounded-full" 
                onClick={scrollLeft}
                aria-label="Scroll left"
            >
                <ChevronLeft size={24} />
            </button>
            <div 
                ref={sliderRef} 
                className="flex overflow-x-auto space-x-4 p-2 scrollbar-hide"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {children}
            </div>
            <button 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-md rounded-full" 
                onClick={scrollRight}
                aria-label="Scroll right"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default Slider;
