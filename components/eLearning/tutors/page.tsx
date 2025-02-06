import { Star, Users } from "lucide-react";
import Image from "next/image";

export default function Tutors() {
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

    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 sticky top-32">
                <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-4 md:mb-6">
                    <Users className="text-greenTheme w-5 h-5" />
                    Tutors
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 md:gap-4 h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar scrollbar-hide">
                    {tutors.map((tutor) => (
                        <div 
                            key={tutor.id} 
                            className="bg-gray-50 rounded-xl p-3 md:p-4 hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden mb-2 md:mb-3 group-hover:ring-2 ring-greenTheme transition-all duration-300">
                                    <Image
                                        src={tutor.image}
                                        alt={tutor.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="font-semibold text-sm md:text-base">{tutor.name}</h3>
                                <p className="text-xs md:text-sm text-gray-600 mb-2">{tutor.specialty}</p>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                                    <span className="text-xs md:text-sm">{tutor.rating}</span>
                                    <span className="text-xs text-gray-400">({tutor.students})</span>
                                </div>
                                <div className="flex gap-1.5 mt-2 flex-wrap justify-center">
                                    {tutor.badges.map((badge, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-0.5 md:py-1 bg-green-50 text-greenTheme text-xs rounded-full group-hover:text-white transition-colors duration-300"
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
    );
}
