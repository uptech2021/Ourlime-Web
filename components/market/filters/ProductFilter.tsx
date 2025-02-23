'use client';

import { X } from 'lucide-react';
import { Color, Size } from '@/types/productTypes';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

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
    setPriceRange,
    categories = [],
    colors = [],
    sizes = []
}: ProductFilterProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [newPercentage, setNewPercentage] = useState(0);

    const sliderRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const [initialPrice, setInitialPrice] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const maxPrice = params.get('maxPrice');

        if (maxPrice) {
            const percentage = parseInt(maxPrice) / 100000;
            setNewPercentage(percentage);
            setInitialPrice(parseInt(maxPrice));
        } else {
            // Set default to 50% if no URL parameter
            setNewPercentage(0.5);
            setInitialPrice(50000);
        }
    }, []);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        event.preventDefault();
    };

    // Update handleMouseUp to include URL handling for price
    const handleMouseUp = () => {
        setIsDragging(false);
        const newPrice = Math.round(newPercentage * 100000);

        const params = new URLSearchParams(window.location.search);
        params.set('minPrice', '0');
        params.set('maxPrice', newPrice.toString());
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);

        setPriceRange([0, newPrice]);
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        handleMouseMove(event);
    };

    const handleTouchEnd = () => {
        handleMouseUp();
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (isDragging && sliderRef.current && thumbRef.current) {
            const boundingBox = sliderRef.current.getBoundingClientRect();
            const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
            const offsetX = clientX - boundingBox.left;
            const constrainedX = Math.min(Math.max(0, offsetX), boundingBox.width);
            const newPercentage = constrainedX / boundingBox.width;
            setNewPercentage(newPercentage);
        }
    };

    // Add URL handling to category changes
    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(window.location.search);

        if (category === 'all') {
            params.delete('categories');
            setSelectedCategories([]);
        } else {
            const newCategories = selectedCategories.includes(category)
                ? selectedCategories.filter(c => c !== category)
                : [...selectedCategories, category];

            params.delete('categories');
            newCategories.forEach(cat => params.append('categories', cat));
            setSelectedCategories(newCategories);
        }

        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    };

    // Add URL handling to color changes
    const handleColorChange = (colorId: string) => {
        const params = new URLSearchParams(window.location.search);
        const newColors = selectedColors.includes(colorId)
            ? selectedColors.filter(c => c !== colorId)
            : [...selectedColors, colorId];

        params.delete('colors');
        newColors.forEach(color => params.append('colors', color));
        setSelectedColors(newColors);

        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    };

    // Add URL handling to size changes
    const handleSizeChange = (sizeId: string) => {
        const params = new URLSearchParams(window.location.search);
        const newSizes = selectedSizes.includes(sizeId)
            ? selectedSizes.filter(s => s !== sizeId)
            : [...selectedSizes, sizeId];

        params.delete('sizes');
        newSizes.forEach(size => params.append('sizes', size));
        setSelectedSizes(newSizes);

        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    };

    const FilterContent = () => (
        <div className="space-y-6 overflow-y-auto scrollbar-none">
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
                    {categories.map((category) => (
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

            {/* Price Range Slider */}
            <div className="border-b pb-4">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="px-2 py-4">
                    <div className="relative w-full">
                        <div
                            ref={sliderRef}
                            className="relative w-full h-3 bg-gray-200 rounded-full"
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={handleTouchEnd}
                        >
                            <div
                                className="absolute h-full bg-greenTheme rounded-full"
                                style={{
                                    width: `${newPercentage * 100}%`
                                }}
                            />
                            <div
                                ref={thumbRef}
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleMouseDown}
                                style={{
                                    position: "absolute",
                                    left: `${newPercentage * 100}%`,
                                    top: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                                className="w-5 h-5 bg-white border-2 border-greenTheme rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-sm">
                        <span>${Math.round(newPercentage * 100000).toLocaleString()}</span>
                        <span>$100,000</span>
                    </div>

                </div>
            </div>

            {/* Colors */}
            <div className="border-b pb-4">
                <h4 className="font-medium mb-3">Colors</h4>
                <div className="grid grid-cols-2 gap-2">
                    {colors.map((color) => (
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
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <label
                            key={size.id}
                            className="relative flex items-center group min-w-[120px] w-full max-w-[200px]"
                        >
                            <input
                                type="checkbox"
                                checked={selectedSizes.includes(size.id)}
                                onChange={() => handleSizeChange(size.id)}
                                className="peer h-4 w-4 rounded border-gray-300 text-greenTheme focus:ring-greenTheme"
                            />
                            <span className="ml-2 text-sm text-gray-700 truncate">
                                {size.sizeName}
                            </span>
                            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8">
                                {size.sizeName}
                            </span>
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
                <div className="bg-white rounded-xl p-4 shadow-sm sticky 
                    top-36 max-h-[calc(100vh-144px)] overflow-y-auto 
                    [-ms-overflow-style:none] [scrollbar-width:none] 
                    [&::-webkit-scrollbar]:hidden">
                    <h3 className="font-semibold mb-6">Filters</h3>
                    <FilterContent />
                </div>
            </div>

        </>
    );
}
