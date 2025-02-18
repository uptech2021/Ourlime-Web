// components/market/filters/ProductFilter.tsx
'use client';

import { X } from 'lucide-react';
import { Color, Size } from '@/types/productTypes';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface ProductFilterProps {
    isMobileOpen: boolean;
    onMobileClose: () => void;
    selectedCategories: string[];
    setSelectedCategories: Dispatch<SetStateAction<string[]>>;
    selectedColors: string[];
    setSelectedColors: Dispatch<SetStateAction<string[]>>;
    selectedSizes: string[];
    setSelectedSizes: Dispatch<SetStateAction<string[]>>;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    categories: string[];
    colors: Color[];
    sizes: Size[];
}

export default function ProductFilter({
    isMobileOpen,
    onMobileClose,
    selectedCategories,
    setSelectedCategories,
    selectedColors,
    setSelectedColors,
    selectedSizes,
    setSelectedSizes,
    priceRange,
    setPriceRange,
    categories = [],
    colors = [],
    sizes = []
}: ProductFilterProps) {
    const [localMinPrice, setLocalMinPrice] = useState(priceRange[0].toString());
    const [localMaxPrice, setLocalMaxPrice] = useState(priceRange[1].toString());

    useEffect(() => {
        const timer = setTimeout(() => {
            setPriceRange([Number(localMinPrice), Number(localMaxPrice)]);
        }, 1000);
        return () => clearTimeout(timer);
    }, [localMinPrice, localMaxPrice]);


    const handleCategoryChange = (category: string) => {
        if (category === 'all') {
            setSelectedCategories([]);
            return;
        }

        setSelectedCategories((prev: string[]) =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleColorChange = (colorId: string) => {
        setSelectedColors((prev: string[]) =>
            prev.includes(colorId)
                ? prev.filter(c => c !== colorId)
                : [...prev, colorId]
        );
    };
    

    const handleSizeChange = (sizeId: string) => {
        setSelectedSizes((prev: string[]) =>
            prev.includes(sizeId)
                ? prev.filter(s => s !== sizeId)
                : [...prev, sizeId]
        );
    };

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Categories */}
            <div className="border-b pb-4">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selectedCategories.length === 0}
                            onChange={() => handleCategoryChange('all')}
                            className="rounded text-greenTheme"
                        />
                        <span>All Categories</span>
                    </label>
                    {(categories || []).map((category) => (
                        <label key={category} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                                className="rounded text-greenTheme"
                            />
                            <span>{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="border-b pb-4">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Min"
                        className="w-full px-3 py-1.5 rounded border"
                        value={localMinPrice}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setLocalMinPrice(value);
                        }}
                        onBlur={() => {
                            if (localMinPrice !== '') {
                                setPriceRange([Number(localMinPrice), Number(localMaxPrice)]);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                (e.target as HTMLInputElement).blur();
                            }
                        }}

                    />
                    <span>-</span>
                    <input
                        type="text"
                        placeholder="Max"
                        className="w-full px-3 py-1.5 rounded border"
                        value={localMaxPrice}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setLocalMaxPrice(value);
                        }}
                        onBlur={() => {
                            if (localMaxPrice !== '') {
                                setPriceRange([Number(localMinPrice), Number(localMaxPrice)]);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                (e.target as HTMLInputElement).blur();
                            }
                        }}

                    />
                </div>
            </div>

            {/* Colors */}
            <div className="border-b pb-4">
                <h4 className="font-medium mb-3">Colors</h4>
                <div className="grid grid-cols-2 gap-2">
                    {(colors || []).map((color) => (
                        <label key={color.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedColors.includes(color.id)}
                                onChange={() => handleColorChange(color.id)}
                                className="rounded text-greenTheme"
                            />
                            <span>{color.colorName}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div className="border-b pb-4">
                <h4 className="font-medium mb-3">Sizes</h4>
                <div className="grid grid-cols-3 gap-2">
                    {(sizes || []).map((size) => (
                        <label key={size.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedSizes.includes(size.id)}
                                onChange={() => handleSizeChange(size.id)}
                                className="rounded text-greenTheme"
                            />
                            <span>{size.sizeName}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Filter */}
            <div className={`
                fixed inset-0 z-50 lg:hidden
                transform transition-transform duration-300
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
                <div className="absolute inset-y-0 left-0 w-80 bg-white p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button
                            onClick={onMobileClose}
                            title="Close sidebar"
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <FilterContent />
                </div>
            </div>

            {/* Desktop Filter */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-white rounded-xl p-4 shadow-sm sticky top-36 max-h-[calc(100vh-144px)] overflow-y-auto">
                    <h3 className="font-semibold mb-6">Filters</h3>
                    <FilterContent />
                </div>
            </div>
        </>
    );
}