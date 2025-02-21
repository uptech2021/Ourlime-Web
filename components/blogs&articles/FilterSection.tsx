'use client';

import { useState } from 'react';
import { Filter, Search, X, ChevronDown } from 'lucide-react';
import { Button } from '@nextui-org/react';

interface FilterSectionProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const categories = [
    { id: 'tech', name: 'Technology', count: 42 },
    { id: 'design', name: 'Design', count: 28 },
    { id: 'business', name: 'Business', count: 35 },
    { id: 'marketing', name: 'Marketing', count: 21 },
    { id: 'development', name: 'Development', count: 56 }
];

const tags = [
    { id: 'react', name: 'React', count: 15 },
    { id: 'nextjs', name: 'Next.js', count: 12 },
    { id: 'typescript', name: 'TypeScript', count: 18 },
    { id: 'ui-design', name: 'UI Design', count: 24 },
    { id: 'ux-design', name: 'UX Design', count: 20 }
];

export default function FilterSection({ isOpen, setIsOpen }: FilterSectionProps) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleTagToggle = (tagId: string) => {
        setSelectedTags(prev => 
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const FilterContent = () => (
        <>
            <div className="mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                    />
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <div className="space-y-2">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryToggle(category.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                                selectedCategories.includes(category.id)
                                    ? 'bg-greenTheme text-white'
                                    : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                        >
                            <span>{category.name}</span>
                            <span className="text-sm">({category.count})</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Popular Tags</h2>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <button
                            key={tag.id}
                            onClick={() => handleTagToggle(tag.id)}
                            className={`px-3 py-1 rounded-full text-sm transition-all ${
                                selectedTags.includes(tag.id)
                                    ? 'bg-greenTheme text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            {tag.name} ({tag.count})
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Newsletter</h2>
                <p className="text-gray-600 text-sm mb-4">
                    Subscribe to our newsletter for the latest updates
                </p>
                <div className="space-y-3">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                    />
                    <Button className="w-full bg-greenTheme text-white">
                        Subscribe
                    </Button>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Filter Toggle Button */}
            <div className="fixed bottom-4 right-4 lg:hidden z-50">
                <Button
                    className="bg-greenTheme text-white rounded-full p-4 shadow-lg"
                    onClick={() => setIsOpen(true)}
                >
                    <Filter size={24} />
                </Button>
            </div>

            {/* Mobile Slide-out Filter */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-300 ease-in-out shadow-2xl
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:hidden overflow-y-auto
            `}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                            title="close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <FilterContent />
                </div>
            </div>

            {/* Desktop Filter */}
            <div className="hidden lg:block w-1/3">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-36">
                    <FilterContent />
                </div>
            </div>
        </>
    );
}
