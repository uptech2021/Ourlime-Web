'use client';

import ContentSection from '@/components/blogs&articles/ContentSection';
import FilterSection from '@/components/blogs&articles/FilterSection';
import CreatePostModal from '@/components/blogs&articles/createPostModel/createPostModel';
import { useState } from 'react';

export default function BlogsAndArticles() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <>
            <div className="min-h-screen w-full bg-gray-100">
                <main className="pt-12 sm:pt-20 md:pt-28 lg:pt-36 w-full 2xl:w-9/12 2xl:mx-auto tvScreen:w-7/12 px-2 md:px-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <FilterSection
                            isOpen={isFilterOpen}
                            setIsOpen={setIsFilterOpen}
                            onCreatePost={() => setIsCreateModalOpen(true)}
                        />
                        <ContentSection />
                    </div>
                </main>

            </div>
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    );
}
