'use client';

import Image from 'next/image';
import { Film, Loader2, X } from 'lucide-react';
import { ProductFormData, Colors, Sizes, ColorVariants, SizeVariants, ProductVariant } from '@/types/productTypes';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { auth, db, storage } from '@/lib/firebaseConfig';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useState } from 'react';

type SaveProductProps = {
    formData: ProductFormData;
    setFormData: (data: ProductFormData) => void;
    onPrevious: () => void;
    onSubmit: () => void;
};

export default function SaveProduct({ formData, setFormData, onPrevious, onSubmit }: SaveProductProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                toast.error('You must be logged in to add products');
                return;
            }
    
            const formDataToSend = new FormData();
            formDataToSend.append('userId', user.uid);
            formDataToSend.append('thumbnailImage', formData.thumbnailImage as File);
            
            // Append other media files
            formData.media?.forEach((file) => {
                formDataToSend.append('media', file);
            });
    
            // Append other data as JSON string
            formDataToSend.append('productData', JSON.stringify({
                title: formData.title,
                category: formData.category,
                shortDescription: formData.shortDescription,
                longDescription: formData.longDescription,
                variants: formData.variants,
                colors: formData.colors,
                sizes: formData.sizes,
                newColors: formData.newColors,
                newSizes: formData.newSizes
            }));
    
            const response = await fetch('/api/profile/products/addProduct', {
                method: 'POST',
                body: formDataToSend
            });
    
            const data = await response.json();
            if (data.status === 'success') {
                toast.success('Product Added Successfully! 🎉');
                onSubmit();
            }
        } catch (error) {
            console.error('Error details:', error);
            toast.error('Failed to add product. Please try again.');
        }
    };
    
    

    return (
        <div className="p-6 lg:p-8 bg-white rounded-xl shadow-sm">
            {/* Header Section */}
            <div className="mb-8 border-b pb-6">
                <h2 className="text-2xl font-bold text-gray-900">Review Product Details</h2>
                <p className="text-gray-600 mt-2">Verify all product information before publishing</p>
            </div>
    
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Image Gallery Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Thumbnail Image */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Main Image</h3>
                        <div className="relative h-80 w-full rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed">
                            {formData.thumbnailImage && (
                                <Image
                                    src={URL.createObjectURL(formData.thumbnailImage)}
                                    alt="Product thumbnail"
                                    fill
                                    className="object-contain"
                                />
                            )}
                        </div>
                    </div>
    
                    {/* Additional Media */}
                    {formData.media && formData.media.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Gallery Images</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-80 overflow-y-auto p-2">
                                {formData.media.map((file, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 border">
                                        {file.type.startsWith('image/') ? (
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt={`Product image ${index + 1}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Film size={24} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
    
                {/* Product Information Card */}
                <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Title</p>
                            <p className="text-lg font-medium">{formData.title}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="text-lg font-medium">{formData.category}</p>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <p className="text-sm text-gray-500">Description</p>
                            <p className="text-base">{formData.shortDescription}</p>
                        </div>
                    </div>
                </div>
    
                {/* Variants Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Color Variants */}
                    {formData.colors.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Color Variants</h3>
                            <div className="flex flex-wrap gap-3">
                                {formData.colors
                                    .filter(color => formData.variants.some(v => v.colorVariantId === color.id))
                                    .map(color => {
                                        const baseColor = formData.newColors.find(c => c.id === color.colorId);
                                        return (
                                            <div
                                                key={color.id}
                                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm"
                                            >
                                                <div
                                                    className="w-6 h-6 rounded-full shadow-inner"
                                                    style={{ backgroundColor: color.colorVariantName }}
                                                />
                                                <span className="font-medium">{baseColor?.colorName}</span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
    
                    {/* Size Variants */}
                    {formData.sizes.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-4">Size Variants</h3>
                            <div className="flex flex-wrap gap-3">
                                {formData.sizes.map(size => {
                                    const baseSize = formData.newSizes.find(s => s.id === size.sizeId);
                                    return (
                                        <div
                                            key={size.id}
                                            className="px-4 py-2 bg-white rounded-lg shadow-sm"
                                        >
                                            <span className="font-medium">
                                                {baseSize?.sizeName}: {size.sizeVariantName}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
    
                {/* Variants Table */}
                <div className="bg-gray-50 rounded-xl p-6 overflow-hidden">
                    <h3 className="text-lg font-semibold mb-4">Variant Combinations</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {formData.variants.map(variant => {
                                    const colorVariant = formData.colors.find(cv => cv.id === variant.colorVariantId);
                                    const baseColor = formData.newColors.find(c => c.id === colorVariant?.colorId);
                                    
                                    const sizeVariant = formData.sizes.find(sv => sv.id === variant.sizeVariantId);
                                    const baseSize = formData.newSizes.find(s => s.id === sizeVariant?.sizeId);
    
                                    return (
                                        <tr key={variant.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                {colorVariant && (
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-4 h-4 rounded-full shadow-sm"
                                                            style={{ backgroundColor: colorVariant.colorVariantName }}
                                                        />
                                                        <span>{baseColor?.colorName}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {baseSize?.sizeName} {sizeVariant?.sizeVariantName}
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                ${variant.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {variant.quantity}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                    variant.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {variant.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
    
                {/* Action Buttons */}
                <div className="flex justify-between pt-6 border-t">
                    <button
                        onClick={onPrevious}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Previous
                    </button>
                    <button
                        onClick={async () => {
                            setIsUploading(true);
                            await handleSubmit();
                            onSubmit();
                            setIsUploading(false);
                        }}
                        disabled={isUploading}
                        className={`px-6 py-2.5 bg-greenTheme text-white rounded-lg transition-all
                            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600 hover:shadow-lg'}`}
                    >
                        {isUploading ? 'Publishing...' : 'Publish Product'}
                    </button>
                </div>
    
                {/* Upload Overlay */}
                {isUploading && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center"
                        >
                            <Loader2 className="w-16 h-16 text-greenTheme animate-spin" />
                            <p className="mt-4 text-lg font-medium text-gray-700">Publishing your product...</p>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
    

}