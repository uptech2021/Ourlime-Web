'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import Image from 'next/image';
import ProductDetailsSidebar from '@/components/market/products/ProductDetailsSidebar';
import PromotionSlider from '@/components/market/promotion/PromotionSlider';
import ProductFilter from '@/components/market/filters/ProductFilter';
import { Product, Color, Size, ColorVariant, SizeVariant, ProductVariant } from '@/types/productTypes';
import { MarketService, MarketFilterService } from '@/lib/services/MarketService';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSidebarProductOpen, setIsSidebarProductOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
    const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([]);
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [marketData, setMarketData] = useState<any>(null);
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // filter after hitting enter
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchTerm(inputValue);
        }
    };

    // Load initial data and URL params
    useEffect(() => {
        const loadInitialData = async () => {
            const params = new URLSearchParams(window.location.search);
            const urlCategories = params.getAll('categories');
            const urlSizes = params.getAll('sizes');
            const urlColors = params.getAll('colors');
            const minPrice = params.get('minPrice');
            const maxPrice = params.get('maxPrice');

            if (urlCategories.length > 0) {
                setSelectedCategories(urlCategories);
            }
            if (urlSizes.length > 0) {
                setSelectedSizes(urlSizes);
            }
            if (urlColors.length > 0) {
                setSelectedColors(urlColors);
            }
            if (minPrice && maxPrice) {
                setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
            }

            const response = await MarketService.getBaseData();
            if (response.success && response.data) {
                setCategories(response.data.categories);
                setColors(response.data.colors);
                setSizes(response.data.sizes);
                setColorVariants(response.data.colorVariants);
                setSizeVariants(response.data.sizeVariants);
                setVariants(response.data.variants);
                setProducts(response.data.products);
                setMarketData(response.data);
            }
            setIsLoading(false);
        };

        loadInitialData();
    }, []);

    // Handle filters
    useEffect(() => {
        const handleFilters = async () => {
            const filters = {
                categories: selectedCategories,
                colors: selectedColors,
                sizes: selectedSizes,
                priceRange,
                searchTerm
            };

            const params = new URLSearchParams();
            if (selectedCategories.length > 0) {
                selectedCategories.forEach(cat => params.append('categories', cat));
            }
            selectedColors.forEach(color => params.append('colors', color));
            selectedSizes.forEach(size => params.append('sizes', size));
            params.set('minPrice', priceRange[0].toString());
            params.set('maxPrice', priceRange[1].toString());
            if (searchTerm) params.set('q', searchTerm);

            window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`);

            const response = await MarketFilterService.filterProducts(filters);
            if (response.success && response.data) {
                setProducts(response.data.products);
                setMarketData(response.data);
            }
        };

        handleFilters();
    }, [selectedCategories, selectedColors, selectedSizes, priceRange, searchTerm]);

    const getProductPriceDisplay = (productId: string) => {
        const productVariants = (variants || []).filter(v => v.productId === productId);
        const prices = productVariants.map(v => v.price);

        if (prices.length === 0) return 'Price unavailable';

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }
    // filter design
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1
            }
        }
    };
    
    const productVariants = {
        hidden: { 
            opacity: 0,
            y: 20,
            scale: 0.95,
            rotateX: -10
        },
        visible: { 
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 1
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: -20,
            rotateX: 10,
            transition: {
                duration: 0.4,
                ease: "easeInOut"
            }
        }
    };


    return (
        <div className="min-h-screen w-full bg-gray-100">
            <main className="pt-16 sm:pt-20 md:pt-32 lg:pt-36 w-full 2xl:w-9/12 2xl:mx-auto tvScreen:w-7/12 px-2 md:px-8">
                <div className="max-w-[2000px] mx-auto">
                    <PromotionSlider />

                    <div className="flex flex-col lg:flex-row gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm mb-4"
                            title="Open filters"
                        >
                            <Filter size={20} />
                            <span>Filters</span>
                        </button>

                        <ProductFilter
                            isMobileOpen={isSidebarOpen}
                            onMobileClose={() => setIsSidebarOpen(false)}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            selectedColors={selectedColors}
                            setSelectedColors={setSelectedColors}
                            selectedSizes={selectedSizes}
                            setSelectedSizes={setSelectedSizes}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            categories={categories}
                            colors={colors}
                            sizes={sizes}
                        />

                        <div className="flex-1 overflow-y-auto mb-10">
                            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                                <div className="flex items-center gap-4">

                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={inputValue}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                                            onKeyDown={handleSearch}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-greenTheme focus:border-transparent"
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            title="Grid view"
                                            className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                                                ? 'bg-greenTheme text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Grid size={20} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            title="List view"
                                            className={`p-2.5 rounded-lg transition-all duration-200 ${viewMode === 'list'
                                                ? 'bg-greenTheme text-white shadow-lg'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            <List size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                layout
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className={`
                                    grid gap-3 md:gap-6
                                    ${viewMode === 'grid'
                                        ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                        : 'grid-cols-1'
                                    }
                                `}
                            >
                                <AnimatePresence mode="popLayout">
                                    {(products || []).map((product) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            variants={productVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            whileHover={{ 
                                                scale: 1.02,
                                                y: -5,
                                                transition: { duration: 0.2 }
                                            }}
                                            className={`
                                                bg-white rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300
                                                ${viewMode === 'list' ? 'flex h-48' : ''}
                                            `}
                                        >

                                            {/* Image Section */}
                                            <div className={`
                                                        relative
                                                        ${viewMode === 'list'
                                                    ? 'w-48 h-full flex-shrink-0'
                                                    : 'h-48'
                                                }
                                                        `}>
                                                <Image
                                                    src={product.thumbnailImage}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {/* Company Logo */}
                                                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-lg transform transition-transform group-hover:scale-110">
                                                    <Image
                                                        src="/images/transparentLogo.png"
                                                        alt="Ourlime"
                                                        width={28}
                                                        height={28}
                                                        className="rounded object-contain"
                                                        loader={({ src }) => src}
                                                        unoptimized={true}
                                                    />
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className={`
                                                        p-4 flex flex-col
                                                        ${viewMode === 'list'
                                                    ? 'flex-1 justify-between'
                                                    : 'h-auto'
                                                }
                                                        `}>
                                                <div className="space-y-2">
                                                    {/* Title */}
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                                                            {product.title}
                                                        </h3>
                                                        <span className="px-2 py-0.5 bg-green-50 text-greenTheme text-xs font-medium rounded-full">
                                                            {product.category}
                                                        </span>
                                                    </div>

                                                    {/* Description */}
                                                    <p className="text-gray-600 text-xs line-clamp-2">
                                                        {product.shortDescription.length > 60
                                                            ? `${product.shortDescription.substring(0, 60)}...`
                                                            : product.shortDescription
                                                        }
                                                    </p>

                                                    {/* Variants */}
                                                    <div className="space-y-2 h-10">
                                                        {/* Color Variants */}
                                                        {(colorVariants || []).filter(cv => cv.productId === product.id).length > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-xs text-gray-500">Colors:</span>
                                                                {(colorVariants || [])
                                                                    .filter(cv => cv.productId === product.id)
                                                                    .map((variant) => (
                                                                        <div
                                                                            key={variant.id}
                                                                            className="w-5 h-5 rounded-full border border-gray-300 shadow-inner ring-1 ring-inset ring-gray-200 flex items-center justify-center"
                                                                            style={{
                                                                                backgroundColor: variant.colorVariantName,
                                                                                boxShadow: variant.colorVariantName.toLowerCase() === '#ffffff' ? '0 0 0 1px rgba(0,0,0,0.1)' : 'none'
                                                                            }}
                                                                        >
                                                                            {variant.colorVariantName.toLowerCase() === '#ffffff' && (
                                                                                <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        )}

                                                        {/* Size Variants */}
                                                        {(sizeVariants || []).filter(sv => sv.productId === product.id).length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                <span className="text-xs text-gray-500">Sizes:</span>
                                                                {(sizeVariants || [])
                                                                    .filter(sv => sv.productId === product.id)
                                                                    .map((variant) => (
                                                                        <span
                                                                            key={variant.id}
                                                                            className="text-xs px-2 py-0.5 bg-gray-100 rounded-full"
                                                                        >
                                                                            {variant.sizeVariantName}
                                                                        </span>
                                                                    ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Sold By section */}
                                                <div className="flex items-center gap-2 mt-3">
                                                    <span className="text-xs text-gray-500">Sold by:</span>
                                                    <span className="text-xs font-medium text-gray-700">Tech Store Ltd</span>
                                                </div>

                                                {/* Price and Action */}
                                                <div className={`
                                                                flex items-center justify-between mt-1
                                                                ${viewMode === 'grid' ? 'flex-col sm:flex-row gap-2' : ''}
                                                            `}>
                                                    <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                                        Price: {getProductPriceDisplay(product.id)}
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setIsSidebarProductOpen(true);
                                                        }}
                                                        className={`
                                                                    px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600
                                                                    transition-colors flex items-center justify-center gap-2
                                                                    ${viewMode === 'grid' ? 'w-full sm:w-auto' : ''}
                                                                `}
                                                        title={`View details for ${product.title}`}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>


                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>


            {selectedProduct && (
                <ProductDetailsSidebar
                    isOpen={isSidebarProductOpen}
                    onClose={() => {
                        setIsSidebarProductOpen(false);
                        setSelectedProduct(null);
                    }}
                    product={selectedProduct}
                    marketData={marketData} // Add this line
                />
            )}


        </div>
    );


}