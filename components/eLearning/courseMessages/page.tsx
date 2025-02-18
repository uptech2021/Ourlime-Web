'use client';

import { MessageSquare, Plus, Bell, Share2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export const CourseMessages: React.FC = () => {
    const messages = [
        {
            id: 1,
            author: "Dr. Sarah Johnson",
            authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            time: "2 hours ago",
            content: "New financial literacy course materials have been uploaded. Check out the updated content on budgeting and investment basics. Join our live Q&A session tomorrow!",
            tags: ["Finance", "New Content", "Live Session"],
            isImportant: true,
            engagement: "324 students enrolled"
        },
        {
            id: 2,
            author: "Prof. David Chen",
            authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
            time: "5 hours ago",
            content: "Join our live session on stress management techniques tomorrow at 2 PM EST. Don't forget to prepare your questions! Resources available in the course portal.",
            tags: ["Wellness", "Live Session", "Mental Health"],
            isImportant: false,
            engagement: "156 attending"
        },
        {
            id: 3,
            author: "Emma Wilson",
            authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
            time: "1 day ago",
            content: "Updated communication skills workshop materials are now available. New role-play scenarios have been added. Check out the interactive exercises!",
            tags: ["Communication", "Updates", "Interactive"],
            isImportant: false,
            engagement: "89 responses"
        },
        {
            id: 4,
            author: "Dr. Michael Chang",
            authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
            time: "2 days ago",
            content: "Exciting news! We're launching a new AI and Machine Learning course next week. Early bird registration opens tomorrow with a 30% discount.",
            tags: ["AI", "New Course", "Early Bird"],
            isImportant: true,
            engagement: "543 interested"
        },
        {
            id: 5,
            author: "Prof. Lisa Martinez",
            authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
            time: "3 days ago",
            content: "📢 Important: End of semester project submissions deadline extended. New deadline: June 30th. Check updated requirements in the portal.",
            tags: ["Announcement", "Deadline", "Projects"],
            isImportant: true,
            engagement: "892 views"
        },

        {
            id: 6,
            author: "Prof. James Miller",
            authorImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857",
            time: "4 days ago",
            content: "New workshop series on 'Cloud Computing Fundamentals' starts next week. Limited seats available. Early registration discount of 25% ends tomorrow!",
            tags: ["Cloud Computing", "Workshop", "Early Bird"],
            isImportant: true,
            engagement: "423 registered"
        },
        {
            id: 7,
            author: "Dr. Anna Kim",
            authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
            time: "5 days ago",
            content: "📚 Just released: Complete guide to Mobile App Development. Includes practical projects and real-world case studies.",
            tags: ["Mobile Dev", "New Resource", "Practical"],
            isImportant: false,
            engagement: "267 downloads"
        }
    ];

    return (
        <div className="bg-white shadow-sm rounded-xl p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                        <MessageSquare className="text-greenTheme" />
                        Course Messages
                    </h2>
                    <span className="bg-green-50 text-greenTheme text-xs md:text-sm px-3 py-1 rounded-full">
                        {messages.length} Updates
                    </span>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
                    <button className="flex items-center gap-2 text-xs md:text-sm text-gray-600 hover:text-greenTheme transition-colors">
                        <Bell className="w-4 h-4" />
                        <span className="hidden sm:inline">Notifications</span>
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors text-xs md:text-sm">
                        <Plus className="w-4 h-4" />
                        <span>New Message</span>
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 24,
                    },
                    1280: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    }
                }}
                className="py-4"
            >
                {messages.map((message) => (
                    <SwiperSlide key={message.id}>
                        <div className="p-2 md:p-4">
                            <div className="bg-gray-50 rounded-xl p-4 md:p-6 hover:shadow-md transition-all h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
                                            <Image
                                                src={message.authorImage}
                                                alt={message.author}
                                                fill
                                                className="object-cover"
                                            />
                                            {message.isImportant && (
                                                <div className="absolute top-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm md:text-base">{message.author}</h4>
                                            <p className="text-xs md:text-sm text-gray-500">{message.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-gray-400 hover:text-greenTheme transition-colors p-1" title="Share">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button className="text-gray-400 hover:text-greenTheme transition-colors p-1" title="Open">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3">{message.content}</p>
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-2 flex-wrap">
                                        {message.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 md:px-3 py-1 bg-green-50 text-greenTheme text-xs md:text-sm rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs md:text-sm text-gray-500">{message.engagement}</p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
