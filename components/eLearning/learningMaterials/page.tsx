'use client';

import { BookOpen, Star, Clock, BookText, Video, Zap, Lock, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export const LearningMaterials: React.FC = () => {

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

    const courses = [
        {
            id: 1,
            title: "Financial Literacy Basics",
            instructor: "Sarah Johnson",
            rating: 4.8,
            students: 1234,
            duration: "6 hours",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
            category: "Finance",
            level: "Beginner",
            type: "video",
            price: 49.99
        },
        {
            id: 2,
            title: "Digital Marketing Essentials",
            instructor: "David Chen",
            rating: 4.9,
            students: 2156,
            duration: "4 hours",
            image: "https://images.unsplash.com/photo-1591228127791-8e2eaef098d3",
            category: "Marketing",
            level: "Intermediate",
            type: "video",
            price: 0
        },
        {
            id: 3,
            title: "Python Programming Guide",
            instructor: "Emma Wilson",
            rating: 4.7,
            students: 1789,
            duration: "250 pages",
            image: "https://images.unsplash.com/photo-1557425955-df376b5903c8",
            category: "Programming",
            level: "Advanced",
            type: "ebook",
            price: 29.99
        },
        {
            id: 4,
            title: "Web Development Fundamentals",
            instructor: "Alex Turner",
            rating: 4.6,
            students: 3421,
            duration: "8 hours",
            image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613",
            category: "Web Development",
            level: "Beginner",
            type: "video",
            price: 0
        },
        {
            id: 5,
            title: "Data Science Handbook",
            instructor: "Dr. Rachel Lee",
            rating: 4.9,
            students: 2890,
            duration: "400 pages",
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
            category: "Data Science",
            level: "Advanced",
            type: "ebook",
            price: 39.99
        },
        {
            id: 6,
            title: "UI/UX Design Masterclass",
            instructor: "Michael Foster",
            rating: 4.8,
            students: 1567,
            duration: "10 hours",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
            category: "Design",
            level: "Intermediate",
            type: "video",
            price: 79.99
        }
    ];

    const [selectedSubCategory, setSelectedSubCategory] = useState(subCategories[selectedMainCategory]?.[0] || '');

    return (
        <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 sticky top-32">
                {/* First Scrollable Section - Main Categories */}
                <div className="mb-2">
                    <div className="overflow-x-auto flex gap-3 pb-4 scrollbar-hide">
                        {mainCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedMainCategory(category)}
                                className={`flex-shrink-0 px-3 md:px-4 py-2 md:py-3 transition-all duration-300 ease-in-out whitespace-nowrap text-sm md:text-base ${selectedMainCategory === category
                                    ? 'text-lg font-medium border-b-2 border-greenTheme transform-none'
                                    : 'hover:text-lg'
                                    }`}
                            >
                                <span>{category}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dividing Line */}
                <div className="w-full h-px bg-gray-200 mb-4 md:mb-6"></div>

                {/* Second Scrollable Section - Sub Categories */}
                <div className="overflow-x-auto scrollbar-hide mb-4 md:mb-6">
                    <div className="flex gap-2 md:gap-3 pb-4">
                        {subCategories[selectedMainCategory]?.map((subCategory) => (
                            <button
                                key={subCategory}
                                onClick={() => setSelectedSubCategory(subCategory)}
                                className={`flex-shrink-0 px-4 md:px-6 py-2 md:py-3 transition-all duration-300 whitespace-nowrap border text-sm md:text-base rounded-md ${selectedSubCategory === subCategory
                                    ? 'border-greenTheme text-greenTheme'
                                    : 'border-black'
                                    }`}
                            >
                                <span>{subCategory}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Section */}
                <div className="h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col"
                            >
                                <div className="relative h-32 sm:h-36 md:h-40">
                                    <Image
                                        src={course.image}
                                        alt={course.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                                        {course.level}
                                    </div>
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        {course.type === 'video' ? (
                                            <>
                                                <Video className="w-3 h-3" />
                                                Video Course
                                            </>
                                        ) : (
                                            <>
                                                <BookText className="w-3 h-3" />
                                                Digital Book
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="p-3 md:p-4 flex-1 flex flex-col">
                                    <h3 className="font-semibold text-base md:text-lg mb-2 line-clamp-2">{course.title}</h3>
                                    <p className="text-gray-600 text-xs md:text-sm mb-3">by {course.instructor}</p>

                                    <div className="flex items-center justify-between text-xs md:text-sm mt-auto">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                                            <span>{course.rating}</span>
                                            <span className="text-gray-400">({course.students} students)</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                            {course.duration}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                                        {course.price === 0 ? (
                                            <span className="text-greenTheme font-medium text-sm flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4" />
                                                Free
                                            </span>
                                        ) : (
                                            <span className="font-medium text-sm flex items-center gap-1">
                                                ${course.price}
                                            </span>
                                        )}
                                        <button className="text-xs md:text-sm text-white bg-greenTheme px-3 py-1 rounded-full hover:bg-green-600 transition-colors">
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
