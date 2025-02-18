// components/market/promotion/PromotionSlider.tsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

interface Promotion {
    id: string;
    name: string;
    count: number;
    image: string;
    description: string;
}

export default function PromotionSlider() {
    const promotions = [
        {
            id: '1',
            name: "Summer Collection",
            count: 24,
            image: "/images/promotions/summer-collection.jpg",
            description: "Discover our latest summer essentials"
        },
        {
            id: '2',
            name: "Best Sellers",
            count: 42,
            image: "/images/promotions/best-sellers.jpg",
            description: "Shop customer favorites and trending items"
        },
        {
            id: '3',
            name: "New Arrivals",
            count: 18,
            image: "/images/promotions/new-arrivals.jpg",
            description: "Fresh drops and latest additions"
        },
        {
            id: '4',
            name: "Special Offers",
            count: 15,
            image: "/images/promotions/special-offers.jpg",
            description: "Limited time deals and discounts"
        }
    ];

    const handlePromotionSelect = (promotionId: string) => {
        // Handle promotion selection logic here
        console.log('Selected promotion:', promotionId);
    };

    return (
        <div className="hidden lg:block mb-8">
            <Swiper
                slidesPerView={1}
                spaceBetween={20}
                pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet !bg-gray-300 !opacity-100',
                    bulletActiveClass: 'swiper-pagination-bullet-active !bg-greenTheme'
                }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 }
                }}
                modules={[Pagination]}
                className="!pb-12"
            >
                {promotions.map((promotion) => (
                    <SwiperSlide key={promotion.id}>
                        <PromotionCard
                            promotion={promotion}
                            onSelect={() => handlePromotionSelect(promotion.id)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

function PromotionCard({ promotion, onSelect }: {
    promotion: Promotion;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className="group relative w-full h-64 rounded-2xl overflow-hidden"
            title={`View ${promotion.name}`}
        >
            <Image
                src={promotion.image}
                alt={promotion.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                        {promotion.count} items
                    </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{promotion.name}</h3>
                <p className="text-gray-200 text-sm line-clamp-2">{promotion.description}</p>
                <div className="absolute right-6 bottom-6 transform translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-white rounded-full p-2">
                        <ArrowRight size={20} className="text-gray-900" />
                    </div>
                </div>
            </div>
        </button>
    );
}
