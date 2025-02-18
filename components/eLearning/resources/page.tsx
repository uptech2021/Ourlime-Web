import { BookOpen, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Resources() {

    const [activeCategory, setActiveCategory] = useState('All');

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

    return (
        <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32 ">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <BookOpen className="text-greenTheme" />
                        Resources
                    </h2>
                    <button className="text-sm text-greenTheme hover:underline">View All</button>
                </div>

                <div className="h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar overflow-x-auto scrollbar-hide">
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
    );
}