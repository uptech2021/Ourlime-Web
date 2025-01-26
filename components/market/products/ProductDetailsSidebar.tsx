import { useState, useEffect } from 'react';
import { Heart, MessageCircle, X } from 'lucide-react';
import Image from 'next/image';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

interface ProductDetailsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

export default function ProductDetailsSidebar({ isOpen, onClose, product }: ProductDetailsSidebarProps) {
    const [subImages, setSubImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(product?.image);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedVariantPrice, setSelectedVariantPrice] = useState(null);
    const [variants, setVariants] = useState([]);

    // Add state for variant IDs
    const [colorVariants, setColorVariants] = useState([]);
    const [sizeVariants, setSizeVariants] = useState([]);

    // Modify the fetch function
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (product) {
                // Fetch sub images
                const subImagesSnapshot = await getDocs(
                    query(collection(db, 'subImages'),
                        where('productId', '==', product.id))
                );
                const images = subImagesSnapshot.docs.map(doc => doc.data().imageName);
                setSubImages(images);

                // Fetch color variants with IDs and names
                const colorVariantsSnapshot = await getDocs(
                    query(collection(db, 'colorVariants'),
                        where('productId', '==', product.id))
                );
                const colorVariantsData = colorVariantsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    colorVariantName: doc.data().colorVariantName
                }));

                // Fetch size variants with IDs and names
                const sizeVariantsSnapshot = await getDocs(
                    query(collection(db, 'sizeVariants'),
                        where('productId', '==', product.id))
                );
                const sizeVariantsData = sizeVariantsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    sizeVariantName: doc.data().sizeVariantName
                }));

                // Fetch variants for prices
                const variantsSnapshot = await getDocs(
                    query(collection(db, 'variants'),
                        where('productId', '==', product.id))
                );
                const variantsData = variantsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Set default selections
                if (colorVariantsData.length > 0) {
                    setSelectedColor(colorVariantsData[0].id);
                }
                if (sizeVariantsData.length > 0) {
                    setSelectedSize(sizeVariantsData[0].id);
                }

                console.log('Fetched variants:', variantsData);
                setVariants(variantsData);
                setColorVariants(colorVariantsData);
                setSizeVariants(sizeVariantsData);
            }
        };

        fetchProductDetails();
    }, [product]);



    useEffect(() => {
        if (selectedColor && selectedSize) {
            console.log('Selected Color:', selectedColor);
            console.log('Selected Size:', selectedSize);
            console.log('All Variants:', variants);

            const variant = variants.find(v =>
                v.colorVariantId === selectedColor &&
                v.sizeVariantId === selectedSize
            );

            console.log('Found Variant:', variant);
            console.log('Variant Price:', variant?.price);

            setSelectedVariantPrice(variant?.price || null);
        }
    }, [selectedColor, selectedSize, variants]);


    const handleAddToWishlist = async (productId: string) => {
        // Implement wishlist functionality
        console.log('Adding to wishlist:', productId);
    };

    const handleContactSeller = async (productId: string) => {
        // Implement contact seller functionality
        console.log('Contacting seller for product:', productId);
    };

    if (!product) return null;


    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[400] 
                transition-all duration-500 ease-in-out
                ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[580px] bg-white shadow-xl z-[401] 
                transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                flex flex-col`}
            >

                {/* Header */}
                <div className="relative h-14 sm:h-16 border-b flex items-center px-4">
                    <button
                        onClick={onClose}
                        className="absolute left-4 p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title='Close'
                    >
                        <X size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <h2 className="w-full text-center font-semibold text-base sm:text-lg truncate px-12">{product.name}</h2>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
                        {/* Main Image and Sub Images */}
                        <div className="flex flex-col">
                            <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-xl overflow-hidden bg-gray-50">
                                <Image
                                    src={selectedImage || product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain"
                                    loader={({ src }) => src}
                                    unoptimized={true}
                                />
                            </div>

                            {/* Sub Images Carousel */}
                            {subImages.length > 0 && (
                                <div className="flex gap-1 overflow-x-auto mt-0.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    <div
                                        className="relative w-16 sm:w-20 aspect-square flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-greenTheme transition-all"
                                        onClick={() => setSelectedImage(product.image)}
                                    >
                                        <Image
                                            src={product.image}
                                            alt="Main"
                                            fill
                                            className="object-cover hover:scale-110 transition-transform duration-300"
                                            loader={({ src }) => src}
                                            unoptimized={true}
                                        />
                                    </div>
                                    {subImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative w-16 sm:w-20 aspect-square flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-greenTheme transition-all"
                                            onClick={() => setSelectedImage(image)}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                fill
                                                className="object-cover hover:scale-110 transition-transform duration-300"
                                                loader={({ src }) => src}
                                                unoptimized={true}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Product Info */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{product.name}</h1>
                                <p className="text-sm sm:text-base text-gray-600">{product.description}</p>

                            </div>


                            {/* Price Card */}
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                                <h3 className="text-sm font-medium mb-1">Price</h3>
                                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {selectedVariantPrice
                                        ? `$${selectedVariantPrice.toFixed(2)}`
                                        : product.priceRange.lowest === product.priceRange.highest
                                            ? `$${product.priceRange.lowest.toFixed(2)}`
                                            : `$${product.priceRange.lowest.toFixed(2)} - $${product.priceRange.highest.toFixed(2)}`
                                    }
                                </span>

                            </div>

                            {/* Variants Selection */}
                            <div className="space-y-4">

                                {product.colors?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">Select Color</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {colorVariants.map((colorVariant) => (
                                                <button
                                                    title='Color'
                                                    key={colorVariant.id}
                                                    onClick={() => setSelectedColor(colorVariant.id)}
                                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all hover:scale-110
                                                    ${selectedColor === colorVariant.id ? 'border-greenTheme scale-110 shadow-lg' : 'border-gray-200'}`}
                                                    style={{ backgroundColor: colorVariant.colorVariantName }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}


                                {product.sizes?.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">Select Size</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {sizeVariants.map((sizeVariant) => (
                                                <button
                                                    key={sizeVariant.id}
                                                    onClick={() => setSelectedSize(sizeVariant.id)}
                                                    className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all
                        ${selectedSize === sizeVariant.id
                                                            ? 'border-greenTheme bg-green-50 text-greenTheme'
                                                            : 'border-gray-200 hover:border-gray-300'}`}
                                                >
                                                    {sizeVariant.sizeVariantName}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Detailed Description */}
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-xl">
                                <h3 className="text-sm font-medium mb-2">Product Details</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {product.longDescription}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Bottom Actions */}
                <div className="border-t p-3 sm:p-4 bg-white">
                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={() => handleAddToWishlist(product.id)}
                            className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium 
                                hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <Heart size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="text-sm sm:text-base">Add to Wishlist</span>
                        </button>
                        <button
                            onClick={() => handleContactSeller(product.id)}
                            className="flex-1 px-3 sm:px-4 py-2 bg-greenTheme text-white rounded-lg font-medium 
                                hover:bg-green-600 active:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="text-sm sm:text-base">Contact Seller</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

}
