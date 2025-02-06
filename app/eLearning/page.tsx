'use client';

import { Search, Menu, BookOpen, Users, GraduationCap, ChevronRight, Star, Clock, BookMarked, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';


import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


export default function ELearningPage() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');

    const [selectedMainCategory, setSelectedMainCategory] = useState('Information Technology');

    const mainCategories = [
        'Information Technology',
        'Science',
        'Business',
        'Language',
        'Art',
        'History',
        'Mathematics',
        'Engineering',
        'Health Sciences',
        'Social Sciences'
    ];

    const subCategories = {
        'Information Technology': [
            'Programming',
            'Computer Science',
            'Networking',
            'UI/UX Design',
            'Cybersecurity',
            'Database Management',
            'Cloud Computing',
            'DevOps',
            'Mobile Development',
            'Web Development'
        ],
        'Science': [
            'Physics',
            'Chemistry',
            'Biology',
            'Astronomy',
            'Environmental Science'
        ],
        'Business': [
            'Marketing',
            'Finance',
            'Management',
            'Entrepreneurship',
            'Economics'
        ],
        'Language': [
            'English',
            'Spanish',
            'French',
            'German',
            'Mandarin',
            'Japanese',
            'Arabic'
        ],
        'Art': [
            'Digital Art',
            'Painting',
            'Photography',
            'Graphic Design',
            'Animation'
        ],
        'History': [
            'World History',
            'Ancient Civilizations',
            'Modern History',
            'Art History',
            'Military History'
        ],
        'Mathematics': [
            'Algebra',
            'Calculus',
            'Statistics',
            'Geometry',
            'Number Theory'
        ],
        'Engineering': [
            'Mechanical',
            'Electrical',
            'Civil',
            'Chemical',
            'Software'
        ],
        'Health Sciences': [
            'Anatomy',
            'Physiology',
            'Nutrition',
            'Public Health',
            'Mental Health'
        ],
        'Social Sciences': [
            'Psychology',
            'Sociology',
            'Anthropology',
            'Political Science',
            'Economics'
        ]
    };

    const categories = [
        'All',
        'Personal Development',
        'Business',
        'Finance',
        'IT & Software',
        'Office Productivity',
        'Design',
        'Marketing',
        'Health & Fitness',
        'Music',
        'Teaching & Academics'
    ];

    const courses = [
        {
            id: 1,
            title: "Financial Literacy Basics",
            instructor: "Sarah Johnson",
            rating: 4.8,
            students: 1234,
            duration: "6 hours",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
            category: "Finance"
        },
        {
            id: 2,
            title: "Mindfulness & Stress Management",
            instructor: "David Chen",
            rating: 4.9,
            students: 2156,
            duration: "4 hours",
            image: "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3",
            category: "Personal Development"
        },
        {
            id: 3,
            title: "Effective Communication Skills",
            instructor: "Emma Wilson",
            rating: 4.7,
            students: 1789,
            duration: "5 hours",
            image: "https://images.unsplash.com/photo-1557425955-df376b5903c8",
            category: "Business"
        }
    ];

    const messages = [
        {
            id: 1,
            author: "Dr. Sarah Johnson",
            authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            time: "2 hours ago",
            content: "New financial literacy course materials have been uploaded. Check out the updated content on budgeting and investment basics.",
            tags: ["Finance", "New Content"]
        },
        {
            id: 2,
            author: "Prof. David Chen",
            authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
            time: "5 hours ago",
            content: "Join our live session on stress management techniques tomorrow at 2 PM EST. Don't forget to prepare your questions!",
            tags: ["Wellness", "Live Session"]
        },
        {
            id: 3,
            author: "Emma Wilson",
            authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
            time: "1 day ago",
            content: "Updated communication skills workshop materials are now available. New role-play scenarios have been added.",
            tags: ["Communication", "Updates"]
        }
    ];

    const tutors = [
        {
            id: 1,
            name: "Dr. Michael Foster",
            specialty: "Business Strategy",
            rating: 4.9,
            students: 1500,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
            badges: ["Top Rated", "Expert"]
        },
        {
            id: 2,
            name: "Prof. Lisa Zhang",
            specialty: "Data Science",
            rating: 4.8,
            students: 1200,
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
            badges: ["Certified", "Expert"]
        },
        {
            id: 3,
            name: "James Anderson",
            specialty: "Personal Finance",
            rating: 4.7,
            students: 980,
            image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef",
            badges: ["Rising Star"]
        }
    ];

    const subjects = [
        "Mathematics",
        "Science",
        "Language Arts",
        "Social Studies",
        "Computer Science",
        "Art & Design",
        "Music Theory",
        "Physical Education",
        "Economics",
        "Psychology"
    ];

    const [selectedSubCategory, setSelectedSubCategory] = useState(subCategories[selectedMainCategory]?.[0] || '');


    return (
        <div className="min-h-screen w-full bg-gray-100">
            <main className="pt-16 sm:pt-20 md:pt-32 lg:pt-32">
                {/* Hero Section */}
                <div className="bg-white shadow-sm overflow-visible mb-2 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center h-32 relative">
                        {/* Logo and Label */}
                        <div className="flex items-center gap-8 px-8 h-full border-r border-gray-100">
                            <Image
                                src="/images/transparentLogo.png"
                                alt="Ourlime Logo"
                                width={90}
                                height={90}
                                className="object-contain"
                                priority
                            />
                            <div className="flex flex-col">
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
                                <div className={`flex items-center border rounded-lg bg-white transition-all duration-300 ${isInputFocused ? 'border-greenTheme ring-1 ring-greenTheme/30' : 'border-gray-200'}`}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="px-4 py-3"
                                        title="Toggle categories"
                                    >
                                        <Menu className="w-5 h-5 text-gray-400" />
                                    </button>

                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        className="w-full py-3 bg-transparent focus:outline-none text-sm"
                                        onFocus={() => setIsInputFocused(true)}
                                        onBlur={() => setIsInputFocused(false)}
                                    />

                                    <button
                                        className="px-4 py-3"
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

                        {/* Welcome Message with Image */}
                        <div
                            className="absolute right-0 h-full flex items-center justify-between lg:w-[47%] md:w-[65%] w-[75%]"
                            style={{
                                clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0% 100%)",
                                right: 0,
                                zIndex: 1,
                                background: "linear-gradient(90deg, rgba(61, 231, 25, 0.8) 0%, rgba(61, 231, 25, 0.8) 80%, rgba(61, 231, 25, 0.95) 100%)"
                            }}
                        >
                            <div className="pl-36 pr-4">
                                <h2 className="text-white font-medium text-xl">Welcome to Limes Academy</h2>
                                <p className="text-green-50 text-base">Start your learning journey today</p>
                            </div>
                            <div className="relative h-full lg:w-52 md:w-64 w-72">
                                <Image
                                    src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6"
                                    alt="Education"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile/Tablet Search - Full Width */}
                    <div className="lg:hidden w-full px-4 py-4 relative">
                        <div className={`flex items-center border rounded-lg bg-white transition-all duration-300 ${isInputFocused ? 'border-greenTheme ring-1 ring-greenTheme/30' : 'border-gray-200'}`}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="px-4 py-3"
                                title="Toggle categories"
                            >
                                <Menu className="w-5 h-5 text-gray-400" />
                            </button>

                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full py-3 bg-transparent focus:outline-none text-sm"
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                            />

                            <button
                                className="px-4 py-3"
                                title="Search courses"
                            >
                                <Search className="w-5 h-5 text-gray-400" />
                            </button>
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

                {/* Course Messages Slider */}
                <div className="bg-white shadow-sm mb-6 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <MessageSquare className="text-greenTheme" />
                            Course Messages
                        </h2>
                    </div>

                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={30}
                        slidesPerView={2}
                        pagination={{
                            clickable: true,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                            },
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 16,
                            }
                        }}
                        className="py-4"
                    >
                        {messages.map((message) => (
                            <SwiperSlide key={message.id}>
                                <div className="p-4">
                                    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all h-full">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                                <Image
                                                    src={message.authorImage}
                                                    alt={message.author}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{message.author}</h4>
                                                <p className="text-sm text-gray-500">{message.time}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-4">{message.content}</p>
                                        <div className="flex gap-2">
                                            {message.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-green-50 text-greenTheme text-sm rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Three Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 py-8">

                    {/* Learning Materials Section */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">

                            {/* First Scrollable Section - Main Categories */}
                            <div className="mb-2">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <BookOpen className="text-greenTheme w-5 h-5" />
                                    Categories
                                </h3>
                                <div className="overflow-x-auto flex gap-3 pb-4 scrollbar-hide">
                                    {mainCategories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedMainCategory(category)}
                                            className={`flex-shrink-0 px-4 py-3 transition-all duration-300 ease-in-out whitespace-nowrap ${selectedMainCategory === category
                                                ? 'text-lg font-medium border-b-2 border-greenTheme transform-none'
                                                : 'text-base hover:text-lg'
                                                }`}
                                        >
                                            <span>{category}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dividing Line */}
                            <div className="w-full h-px bg-gray-200 mb-6"></div>

                            {/* Second Scrollable Section - Sub Categories */}
                            <div className="overflow-x-auto scrollbar-hide">
                                <div className="flex gap-3 pb-4">
                                    {subCategories[selectedMainCategory]?.map((subCategory) => (
                                        <button
                                            key={subCategory}
                                            onClick={() => setSelectedSubCategory(subCategory)}
                                            className={`flex-shrink-0 px-6 py-3 transition-all duration-300 whitespace-nowrap border border-black rounded-md ${selectedSubCategory === subCategory
                                                    ? 'border-greenTheme text-greenTheme'
                                                    : ''
                                                }`}
                                        >
                                            <span>{subCategory}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* content */}
                            <div className="h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {courses.map((course) => (
                                        <div key={course.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="relative h-48">
                                                <Image
                                                    src={course.image}
                                                    alt={course.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                                                <p className="text-gray-600 text-sm mb-3">by {course.instructor}</p>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                        <span>{course.rating}</span>
                                                        <span className="text-gray-400">({course.students} students)</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Clock className="w-4 h-4" />
                                                        {course.duration}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2 - Resources & Scrollable Links (3/12) */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <BookOpen className="text-greenTheme" />
                                    Resources
                                </h2>
                                <button className="text-sm text-greenTheme hover:underline">View All</button>
                            </div>

                            <div className="h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all ${activeCategory === category
                                            ? 'bg-green-50 text-greenTheme font-medium'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{category}</span>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === category ? 'rotate-90' : ''
                                                }`} />
                                        </div>
                                    </button>
                                ))}

                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">Popular Subjects</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {subjects.map((subject) => (
                                            <span
                                                key={subject}
                                                className="px-3 py-1.5 bg-gray-50 rounded-full text-sm hover:bg-green-50 hover:text-greenTheme cursor-pointer transition-colors"
                                            >
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3 - Tutors (2/12) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                                <Users className="text-greenTheme" />
                                Tutors
                            </h2>

                            <div className="space-y-4 h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
                                {tutors.map((tutor) => (
                                    <div key={tutor.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3">
                                                <Image
                                                    src={tutor.image}
                                                    alt={tutor.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <h3 className="font-semibold">{tutor.name}</h3>
                                            <p className="text-sm text-gray-600">{tutor.specialty}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm">{tutor.rating}</span>
                                                <span className="text-xs text-gray-400">({tutor.students})</span>
                                            </div>
                                            <div className="flex gap-2 mt-3 flex-wrap justify-center">
                                                {tutor.badges.map((badge, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-green-50 text-greenTheme text-xs rounded-full"
                                                    >
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>


            </main>
        </div>
    );
}
