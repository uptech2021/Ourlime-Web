'use client'

import { useEffect, useState } from 'react';
import { Heart, MessageCircle, X, Star, Shield, Clock, Package, Truck, ExternalLink, Globe } from 'lucide-react';
import Image from 'next/image';
import { Product, ColorVariants, SizeVariants, ProductVariant } from '@/types/productTypes';

interface OwnershipData {
    id: string;
    productId: string;
    userId: string;
    sellerType: 'business' | 'personal';
    profileImage: string;
    businessDetails: {
        name: string;  // Changed from businessName
        description: string;
        location: string;
        established: string;
        contact: {     // Added contact object
            email: string;
            phone: string;
            website: string;
        }
    };
    businessProfile: {
        rating: {
            overall: number;
            service: number;
            delivery: number;
            product: number;
        };
        feedback: {
            satisfaction: number;
            resolution: number;
            responseTime: number;
        };
        reviews: {
            total: number;
            positive: number;
            negative: number;
        };
    };
    businessOwner: {
        name: string;
        email: string;
    };
}


interface ProductDetailsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    marketData: {
        colorVariants: ColorVariants[];
        sizeVariants: SizeVariants[];
        variants: ProductVariant[];
        subImages: any[];
        ownership: OwnershipData[];
    };
}

export default function ProductDetailsSidebar({ isOpen, onClose, product, marketData }: ProductDetailsSidebarProps) {
    const [selectedImage, setSelectedImage] = useState(product?.thumbnailImage);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedVariantPrice, setSelectedVariantPrice] = useState<number | null>(null);

    // Get ownership data for this product
    const ownership = marketData.ownership.find(o => o.productId === product.id);

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
            const minPrice = Math.min(...productVariants.map(v => v.price));
            setSelectedVariantPrice(minPrice);
        }
    }, [selectedColor, selectedSize, productVariants, productColorVariants.length, productSizeVariants.length]);

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
                <div className="flex-1 overflow-y-auto pb-[80px]"> {/* Added pb-[80px] for bottom padding */}
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
                        {ownership?.sellerType === 'business' && (
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                        <Image
                                            src={ownership?.profileImage || "/images/transparentLogo.png"}
                                            alt={ownership?.businessDetails?.name || "Shop logo"}
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                            loader={({ src }) => src}
                                            unoptimized={true}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <h3 className="text-sm font-medium">
                                                {ownership?.businessDetails?.name}
                                            </h3>
                                            <div className="flex items-center">
                                                {renderStars(ownership?.businessProfile?.rating?.overall || 0)}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">
                                                {ownership?.businessDetails?.established &&
                                                    `Established ${ownership.businessDetails.established}`}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {ownership?.businessDetails?.location}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {ownership?.businessDetails?.contact?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="text-xs font-medium text-greenTheme hover:underline"
                                    title="View shop"
                                >
                                    View Shop
                                </button>
                            </div>
                        )}

                        {ownership?.sellerType === 'business' && ownership?.businessDetails?.contact?.website && (
                            <div className="bg-gray-50 p-3 rounded-xl">
                                <h3 className="text-xs font-medium mb-2">Business Website</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Globe size={16} className="text-gray-500" />
                                        <span className="text-sm text-gray-700">
                                            {ownership.businessDetails.contact.website}
                                        </span>
                                    </div>
                                    <a
                                        href={`${ownership.businessDetails.contact.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium text-greenTheme hover:underline flex items-center gap-1"
                                    >
                                        Visit Website
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        )}


                        {/* Product Info */}
                        <div>
                            <h1 className="text-base sm:text-lg font-semibold text-gray-900">{product.title}</h1>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{product.shortDescription}</p>
                        </div>

                        {/* Price and Stock */}
                        <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                            {ownership?.sellerType === 'business' ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-medium">Price</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-green-600 font-medium">
                                                {productVariants.some(v => v.quantity > 0) ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                            {productVariants.some(v => v.quantity > 0) && (
                                                <div className="flex items-center gap-2">
                                                    <label className="text-xs text-gray-500">Qty:</label>
                                                    <select
                                                        className="text-xs border rounded-md px-2 py-1 bg-white"
                                                        defaultValue={1}
                                                        aria-label="Quantity selector"
                                                        title="Select quantity"
                                                    >
                                                        {[...Array(Math.min(10, productVariants[0]?.quantity || 0))].map((_, i) => (
                                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
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
                                        <span className="text-xs text-gray-500">
                                            {productVariants[0]?.quantity || 0} units available
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-medium">Price</h3>
                                    <span className="text-base sm:text-lg font-bold text-gray-900">
                                        {selectedVariantPrice
                                            ? `$${selectedVariantPrice.toFixed(2)}`
                                            : productVariants.length > 0
                                                ? `$${productVariants[0].price.toFixed(2)}`
                                                : 'Price unavailable'
                                        }
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Long Description */}
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <h3 className="text-xs font-medium mb-2">Product Description</h3>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {product.longDescription}
                            </p>
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

                        {ownership?.sellerType === 'business' && (
                            <>
                                {/* Business Metrics */}
                                <div className="bg-gray-50 p-3 rounded-xl space-y-2">
                                    <h3 className="text-xs font-medium">Business Performance</h3>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-500">Response Rate: </span>
                                            <span className="font-medium">{ownership?.businessProfile?.feedback?.responseTime || 0}%</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Satisfaction: </span>
                                            <span className="font-medium">{ownership?.businessProfile?.feedback?.satisfaction || 0}%</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Total Reviews: </span>
                                            <span className="font-medium">{ownership?.businessProfile?.reviews?.total || 0}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Positive Reviews: </span>
                                            <span className="font-medium">{ownership?.businessProfile?.reviews?.positive || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ratings Breakdown */}
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <h3 className="text-xs font-medium mb-2">Rating Breakdown</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Overall</span>
                                            <div className="flex items-center">
                                                {renderStars(ownership?.businessProfile?.rating?.overall || 0)}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Service</span>
                                            <div className="flex items-center">
                                                {renderStars(ownership?.businessProfile?.rating?.service || 0)}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Delivery</span>
                                            <div className="flex items-center">
                                                {renderStars(ownership?.businessProfile?.rating?.delivery || 0)}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">Product Quality</span>
                                            <div className="flex items-center">
                                                {renderStars(ownership?.businessProfile?.rating?.product || 0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="fixed bottom-0 left-0 right-0 border-t p-3 bg-white z-[402] sm:w-[480px] lg:w-[580px] ml-auto">
                    <div className="flex gap-2">
                        {ownership?.sellerType === 'business' && (
                            <button
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium
                                            hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                                title="Add to wishlist"
                            >
                                <Heart size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="text-xs sm:text-sm">Add to Wishlist</span>
                            </button>
                        )}
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