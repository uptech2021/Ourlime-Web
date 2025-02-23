'use client'

import { useEffect, useState } from 'react';
import { Heart, MessageCircle, X, Star, Shield, Clock, Package, Truck } from 'lucide-react';
import Image from 'next/image';
import { Product, ColorVariant, SizeVariant, ProductVariant } from '@/types/productTypes';

interface ProductDetailsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    marketData: {
        colorVariants: ColorVariant[];
        sizeVariants: SizeVariant[];
        variants: ProductVariant[];
        subImages: any[]; // Add proper type from your types file
    };
}

export default function ProductDetailsSidebar({ isOpen, onClose, product, marketData }: ProductDetailsSidebarProps) {
    const [selectedImage, setSelectedImage] = useState(product?.thumbnailImage);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedVariantPrice, setSelectedVariantPrice] = useState<number | null>(null);

    // Filter data specific to this product
    const productColorVariants = marketData.colorVariants.filter(cv => cv.productId === product.id);
    const productSizeVariants = marketData.sizeVariants.filter(sv => sv.productId === product.id);
    const productVariants = marketData.variants.filter(v => v.productId === product.id);
    const productSubImages = marketData.subImages.filter(si => si.productId === product.id);

    // Set initial selections
    useEffect(() => {
        if (productColorVariants.length > 0) {
            setSelectedColor(productColorVariants[0].id);
        }
        if (productSizeVariants.length > 0) {
            setSelectedSize(productSizeVariants[0].id);
        }
    }, []);

    // Update price when variants change
    useEffect(() => {
        let variant;

        // Handle different variant combinations
        if (productColorVariants.length > 0 && productSizeVariants.length > 0) {
            variant = productVariants.find(v =>
                v.colorVariantId === selectedColor &&
                v.sizeVariantId === selectedSize
            );
        } else if (productSizeVariants.length > 0) {
            variant = productVariants.find(v =>
                v.sizeVariantId === selectedSize
            );
        } else if (productColorVariants.length > 0) {
            variant = productVariants.find(v =>
                v.colorVariantId === selectedColor
            );
        }

        if (variant) {
            setSelectedVariantPrice(variant.price);
        } else {
            // If no variant is selected, show the default price range
            const minPrice = Math.min(...productVariants.map(v => v.price));
            const maxPrice = Math.max(...productVariants.map(v => v.price));
            setSelectedVariantPrice(minPrice);
        }
    }, [selectedColor, selectedSize, productVariants, productColorVariants.length, productSizeVariants.length]);



    // Static data for marketplace features
    const sellerMetrics = {
        rating: 4.8,
        responseRate: "98%",
        shippingSpeed: "Fast",
        totalReviews: 1243,
        memberSince: "2021"
    };

    const specifications = {
        material: "Premium Cotton Blend",
        dimensions: "24\" x 36\"",
        weight: "0.5 kg",
        origin: "Made in Trinidad and Tobago",
        warranty: "12 months manufacturer warranty"
    };

    const shippingInfo = {
        methods: ["Standard", "Express", "Next Day"],
        estimatedDays: "3-5 business days",
        returnPeriod: "30 days",
        shippingFee: "Free over $50"
    };

    const reviews = {
        average: 4.5,
        total: 128,
        breakdown: {
            5: 80,
            4: 30,
            3: 10,
            2: 5,
            1: 3
        }
    };

    const guarantees = [
        { title: "Authentic Products", icon: Shield },
        { title: "Fast Delivery", icon: Truck },
        { title: "30-Day Returns", icon: Package },
        { title: "24/7 Support", icon: Clock }
    ];

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, index) => (
            <Star
                key={index}
                size={16}
                className={`${index < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    if (!product) return null;


    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[400]
                    transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            />

            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[580px] bg-white shadow-xl z-[401]
                    transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    flex flex-col`}
            >
                {/* Header */}
                <div className="relative h-14 border-b flex items-center px-4">
                    <button
                        onClick={onClose}
                        className="absolute left-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        title="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                    <h2 className="w-full text-center font-semibold text-sm sm:text-base truncate px-12">
                        {product.title}
                    </h2>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-3 sm:p-4 space-y-4">
                        {/* Image Gallery */}
                        <div className="flex gap-3 h-[400px]">
                            <div className="w-16 flex-shrink-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                <div className="flex flex-col gap-1.5">
                                    {[product.thumbnailImage, ...productSubImages.map(img => img.imageName)].map((image, index) => (
                                        <button
                                            key={index}
                                            className={`relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 flex-shrink-0
                                                ${selectedImage === image ? 'ring-2 ring-greenTheme' : 'ring-1 ring-gray-200'}`}
                                            onClick={() => setSelectedImage(image)}
                                            title={`View image ${index + 1}`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.title} ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                loader={({ src }) => src}
                                                unoptimized={true}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 relative rounded-lg overflow-hidden bg-gray-50">
                                <Image
                                    src={selectedImage || product.thumbnailImage}
                                    alt={product.title}
                                    fill
                                    className="object-contain"
                                    loader={({ src }) => src}
                                    unoptimized={true}
                                />
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                    <Image
                                        src="/images/transparentLogo.png"
                                        alt="Shop logo"
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <h3 className="text-sm font-medium">Tech Store Ltd</h3>
                                        <div className="flex items-center">
                                            {renderStars(sellerMetrics.rating)}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">Member since {sellerMetrics.memberSince}</p>
                                </div>
                            </div>
                            <button
                                className="text-xs font-medium text-greenTheme hover:underline"
                                title="View shop"
                            >
                                View Shop
                            </button>
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 className="text-base sm:text-lg font-semibold text-gray-900">{product.title}</h1>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{product.shortDescription}</p>
                        </div>

                        {/* Price and Stock */}
                        <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-medium">Price</h3>
                                <span className="text-xs text-green-600 font-medium">In Stock</span>
                            </div>
                            <span className="text-base sm:text-lg font-bold text-gray-900">
                                {selectedVariantPrice
                                    ? `$${selectedVariantPrice.toFixed(2)}`
                                    : productVariants.length > 0
                                        ? (() => {
                                            const minPrice = Math.min(...productVariants.map(v => v.price));
                                            const maxPrice = Math.max(...productVariants.map(v => v.price));
                                            return minPrice === maxPrice
                                                ? `$${minPrice.toFixed(2)}`
                                                : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
                                        })()
                                        : 'Price unavailable'
                                }
                            </span>
                        </div>

                        {/* Variants Selection */}
                        {productColorVariants.length > 0 && (
                            <div>
                                <h3 className="text-xs font-medium mb-2">Select Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    {productColorVariants.map((colorVariant) => (
                                        <button
                                            key={colorVariant.id}
                                            onClick={() => setSelectedColor(colorVariant.id)}
                                            className={`w-8 h-8 rounded-full border-2 transition-all
                                                ${selectedColor === colorVariant.id ? 'border-greenTheme shadow-lg' : 'border-gray-200'}`}
                                            style={{ backgroundColor: colorVariant.colorVariantName }}
                                            title={`Select ${colorVariant.colorVariantName} color`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {productSizeVariants.length > 0 && (
                            <div>
                                <h3 className="text-xs font-medium mb-2">Select Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {productSizeVariants.map((sizeVariant) => (
                                        <button
                                            key={sizeVariant.id}
                                            onClick={() => setSelectedSize(sizeVariant.id)}
                                            className={`px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all
                                                ${selectedSize === sizeVariant.id
                                                    ? 'border-greenTheme bg-green-50 text-greenTheme'
                                                    : 'border-gray-200 hover:border-gray-300'}`}
                                            title={`Select size ${sizeVariant.sizeVariantName}`}
                                        >
                                            {sizeVariant.sizeVariantName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rest of the sections remain the same */}
                        {/* Specifications */}
                        <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                            <h3 className="text-xs font-medium">Specifications</h3>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {Object.entries(specifications).map(([key, value]) => (
                                    <div key={key}>
                                        <span className="text-gray-500 capitalize">{key}: </span>
                                        <span className="font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                            <h3 className="text-xs font-medium">Shipping Information</h3>
                            <div className="space-y-1 text-xs">
                                <p><span className="text-gray-500">Delivery: </span>{shippingInfo.estimatedDays}</p>
                                <p><span className="text-gray-500">Shipping Fee: </span>{shippingInfo.shippingFee}</p>
                                <p><span className="text-gray-500">Returns: </span>{shippingInfo.returnPeriod}</p>
                            </div>
                        </div>

                        {/* Guarantees */}
                        <div className="grid grid-cols-2 gap-2">
                            {guarantees.map((guarantee, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <guarantee.icon size={16} className="text-greenTheme" />
                                    <span className="text-xs font-medium">{guarantee.title}</span>
                                </div>
                            ))}
                        </div>

                        {/* Reviews Summary */}
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-medium">Customer Reviews</h3>
                                <div className="flex items-center gap-1">
                                    {renderStars(reviews.average)}
                                    <span className="text-xs text-gray-500">({reviews.total})</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                {Object.entries(reviews.breakdown).reverse().map(([rating, count]) => (
                                    <div key={rating} className="flex items-center gap-2">
                                        <span className="text-xs w-6">{rating}★</span>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-greenTheme"
                                                style={{ width: `${(count / reviews.total) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="border-t p-3 bg-white">
                    <div className="flex gap-2">
                        <button
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium
                                hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                            title="Add to wishlist"
                        >
                            <Heart size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="text-xs sm:text-sm">Add to Wishlist</span>
                        </button>
                        <button
                            className="flex-1 px-3 py-2 bg-greenTheme text-white rounded-lg font-medium
                                hover:bg-green-600 active:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            title="Contact seller"
                        >
                            <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="text-xs sm:text-sm">Contact Seller</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

}