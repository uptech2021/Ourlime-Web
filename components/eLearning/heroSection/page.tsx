'use client';

import { Search, Menu } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const HeroSection: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6",
            title: "Welcome to Limes Academy",
            subtitle: "Start your learning journey today",
            accent: "from-greenTheme via-green-500/80 to-green-400/60"
        },
        {
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
            title: "Learn from the Best",
            subtitle: "Expert instructors to guide your path",
            accent: "from-green-600 via-greenTheme/80 to-green-400/70"
        },
        {
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
            title: "Grow Your Skills",
            subtitle: "Discover new opportunities",
            accent: "from-greenTheme via-green-400/80 to-green-300/60"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 2000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-white shadow-sm overflow-visible mb-2 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center h-32 relative">
                {/* Logo and Label Section */}
                <div className="flex items-center gap-8 px-8 h-full border-r border-gray-100">
                    <div className="relative group flex flex-col items-center">
                        <div className="absolute -inset-1 bg-gradient-to-r from-greenTheme/20 to-green-300/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <Image
                            src="/images/transparentLogo.png"
                            alt="Ourlime Logo"
                            width={90}
                            height={90}
                            className="relative object-contain transform group-hover:scale-105 transition-transform duration-300"
                            priority
                        />
                        <p className="text-xs text-gray-600 leading-tight italic lg:hidden">e-Learning</p>
                    </div>
                    <div className="flex-col hidden lg:flex">
                        <h1 className="text-4xl font-bold text-greenTheme leading-tight">Limes</h1>
                        <h2 className="text-3xl font-semibold text-gray-800 leading-tight">Academy</h2>
                        <p className="text-base text-gray-600 leading-tight">
                            <span className="italic">e-Learning Platform</span>
                        </p>
                    </div>
                </div>

                {/* Desktop Search - Compact */}
                <div className="hidden lg:flex flex-1 px-8 z-20">
                    <div className="relative w-[280px]">
                        <div className={`relative flex items-center border rounded-lg bg-white transition-all duration-300 ${isInputFocused ? 'border-greenTheme ring-1 ring-greenTheme/30' : 'border-gray-200'}`}>
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full py-3 pl-10 pr-10 bg-transparent focus:outline-none text-sm"
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                            />
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="absolute left-2 p-2 hover:text-greenTheme transition-colors"
                                title="Toggle categories"
                            >
                                <Menu className="w-5 h-5 text-gray-400" />
                            </button>
                            <button
                                className="absolute right-2 p-2 hover:text-greenTheme transition-colors"
                                title="Search courses"
                            >
                                <Search className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-lg border py-2 z-[999]">
                                {['Development', 'Business', 'Design', 'Marketing'].map((category) => (
                                    <button
                                        key={category}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                                        title={category}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Enhanced Sliding Content Section */}
                <div className="absolute right-0 h-full lg:w-[55%] xl:w-[60%] 2xl:w-[65%] md:w-[70%] w-[80%] overflow-hidden">
                    <div className="absolute inset-0"
                        style={{
                            clipPath: "polygon(35% 0, 100% 0, 100% 100%, 15% 100%)",
                        }}>
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-1000 transform ${
                                    currentSlide === index 
                                        ? 'opacity-100 scale-100' 
                                        : 'opacity-0 scale-110'
                                }`}
                            >
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover transition-transform duration-1000"
                                    priority
                                />
                                <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} transition-opacity duration-1000 opacity-90`}></div>
                                <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-transparent to-transparent"></div>
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 h-full flex items-center">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute w-full transition-all duration-700 transform ${
                                    currentSlide === index 
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-4'
                                }`}
                            >
                                <div className="pl-28 sm:pl-32 md:pl-36 lg:pl-40 pr-6">
                                    <h2 className="text-white font-semibold text-lg sm:text-xl md:text-2xl transform transition-transform hover:scale-105 duration-300 leading-tight">{slide.title}</h2>
                                    <p className="text-green-50/90 text-sm sm:text-base mt-2 transform hover:translate-x-2 transition-transform duration-300 max-w-[280px]">{slide.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Search with Branding */}
            <div className="lg:hidden w-full px-4 py-4 relative">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col justify-center">
                        <h1 className="text-base font-bold text-greenTheme leading-tight">Limes</h1>
                        <h2 className="text-sm font-semibold text-gray-800 leading-tight">Academy</h2>
                    </div>
                    <div className={`relative flex-1 flex items-center border rounded-lg bg-white transition-all duration-300 ${isInputFocused ? 'border-greenTheme ring-1 ring-greenTheme/30' : 'border-gray-200'}`}>
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full py-3 pl-10 pr-10 bg-transparent focus:outline-none text-sm"
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                        />
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="absolute left-2 p-2 hover:text-greenTheme transition-colors"
                            title="Toggle categories"
                        >
                            <Menu className="w-5 h-5 text-gray-400" />
                        </button>
                        <button 
                            className="absolute right-2 p-2 hover:text-greenTheme transition-colors"
                            title="Search courses"
                        >
                            <Search className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {isDropdownOpen && (
                    <div className="absolute left-4 right-4 top-full mt-2 bg-white rounded-lg shadow-lg border py-2 z-[999]">
                        {['Development', 'Business', 'Design', 'Marketing'].map((category) => (
                            <button
                                key={category}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                                title={category}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
