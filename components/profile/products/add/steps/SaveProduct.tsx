'use client';
import Image from 'next/image';
import { Film } from 'lucide-react';

import { ProductFormData } from '@/types/productTypes';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { auth, db, storage } from '@/lib/firebaseConfig';

import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
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
            // Get current user ID
            const user = auth.currentUser;
            if (!user) {
                toast.error('You must be logged in to add products');
                return;
            }
            // Upload thumbnail image
            const thumbnailRef = ref(storage, `products/${user.uid}/thumbnails/${formData.thumbnailImage?.name}`);
            const thumbnailSnapshot = await uploadBytes(thumbnailRef, formData.thumbnailImage as File);
            const thumbnailUrl = await getDownloadURL(thumbnailSnapshot.ref);

            // Add main product
            const productRef = await addDoc(collection(db, 'products'), {
                title: formData.title,
                category: formData.category,
                shortDescription: formData.shortDescription,
                longDescription: formData.longDescription,
                thumbnailImage: thumbnailUrl,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            console.log('Product created with ID:', productRef.id);

            // Get or create base colors if they exist
            const colorMap = new Map();
            if (formData.colors && formData.colors.length > 0) {
                for (const color of formData.colors) {
                    const colorQuery = query(
                        collection(db, 'colors'),
                        where('colorName', '==', color.name.toLowerCase())
                    );
                    const colorSnapshot = await getDocs(colorQuery);

                    if (colorSnapshot.empty) {
                        const newColorRef = await addDoc(collection(db, 'colors'), {
                            colorName: color.name.toLowerCase()
                        });
                        console.log('New base color added:', {
                            id: newColorRef.id,
                            colorName: color.name.toLowerCase()
                        });
                        colorMap.set(color.name.toLowerCase(), newColorRef.id);
                    } else {
                        console.log('Using existing base color:', {
                            id: colorSnapshot.docs[0].id,
                            colorName: color.name.toLowerCase()
                        });
                        colorMap.set(color.name.toLowerCase(), colorSnapshot.docs[0].id);
                    }
                }
            }

            // Get or create base sizes if they exist
            const sizeMap = new Map();
            if (formData.sizes && formData.sizes.length > 0) {
                for (const size of formData.sizes) {
                    const sizeQuery = query(
                        collection(db, 'sizes'),
                        where('sizeName', '==', size.name.toLowerCase())
                    );
                    const sizeSnapshot = await getDocs(sizeQuery);

                    if (sizeSnapshot.empty) {
                        const newSizeRef = await addDoc(collection(db, 'sizes'), {
                            sizeName: size.name.toLowerCase()
                        });
                        console.log('New base size added:', {
                            id: newSizeRef.id,
                            sizeName: size.name.toLowerCase()
                        });
                        sizeMap.set(size.name.toLowerCase(), newSizeRef.id);
                    } else {
                        console.log('Using existing base size:', {
                            id: sizeSnapshot.docs[0].id,
                            sizeName: size.name.toLowerCase()
                        });
                        sizeMap.set(size.name.toLowerCase(), sizeSnapshot.docs[0].id);
                    }
                }
            }

            // Add color variants if colors exist
            let colorVariantRefs = [];
            if (formData.colors && formData.colors.length > 0) {
                const usedColorIds = formData.variants.map(v => v.colorVariantId);
                const colorVariantPromises = formData.colors
                    .filter(color => usedColorIds.includes(color.id))
                    .map(color =>
                        addDoc(collection(db, 'colorVariants'), {
                            colorVariantName: color.hexCode,
                            productId: productRef.id,
                            colorsId: colorMap.get(color.name.toLowerCase())
                        })
                    );
                colorVariantRefs = await Promise.all(colorVariantPromises);
                console.log('Color variants created:', colorVariantRefs.map(ref => ({
                    id: ref.id,
                    colorVariantName: formData.colors.find(c => usedColorIds.includes(c.id))?.hexCode
                })));
            }

            // Add size variants if sizes exist
            let sizeVariantRefs = [];
            if (formData.sizes && formData.sizes.length > 0) {
                const sizeVariantPromises = formData.sizes.map(size =>
                    addDoc(collection(db, 'sizeVariants'), {
                        sizeVariantName: size.measurement,
                        productId: productRef.id,
                        sizeId: sizeMap.get(size.name.toLowerCase())
                    })
                );
                sizeVariantRefs = await Promise.all(sizeVariantPromises);
                console.log('Size variants created:', sizeVariantRefs.map(ref => ({
                    id: ref.id,
                    sizeVariantName: formData.sizes.find(s => s.id)?.measurement
                })));
            }

            // Upload and add sub images if they exist
            if (formData.media && formData.media.length > 0) {
                const mediaPromises = formData.media.map(async (file) => {
                    const imageRef = ref(storage, `products/${user.uid}/images/${file.name}`);
                    const snapshot = await uploadBytes(imageRef, file);
                    const imageUrl = await getDownloadURL(snapshot.ref);
                    return addDoc(collection(db, 'subImages'), {
                        imageName: imageUrl,
                        productId: productRef.id
                    });
                });
                const mediaRefs = await Promise.all(mediaPromises);
                console.log('Media images uploaded:', mediaRefs.map(ref => ref.id));
            }

            // Create variant mappings and add variants
            if (formData.variants && formData.variants.length > 0) {
                const colorVariantMapping = new Map();
                const sizeVariantMapping = new Map();

                if (colorVariantRefs.length > 0) {
                    formData.colors
                        .filter(color => formData.variants.some(v => v.colorVariantId === color.id))
                        .forEach((color, index) => {
                            colorVariantMapping.set(color.id, colorVariantRefs[index].id);
                        });
                }

                if (sizeVariantRefs.length > 0) {
                    formData.sizes.forEach((size, index) => {
                        sizeVariantMapping.set(size.id, sizeVariantRefs[index].id);
                    });
                }

                const variantPromises = formData.variants.map(variant => {
                    const variantData: any = {
                        productId: productRef.id,
                        price: variant.price,
                        quantity: variant.quantity,
                        status: variant.status
                    };

                    if (colorVariantRefs.length > 0) {
                        variantData.colorVariantId = colorVariantMapping.get(variant.colorVariantId);
                    }
                    if (sizeVariantRefs.length > 0) {
                        variantData.sizeVariantId = sizeVariantMapping.get(variant.sizeVariantId);
                    }

                    return addDoc(collection(db, 'variants'), variantData);
                });

                const variantRefs = await Promise.all(variantPromises);
                console.log('Product variants created:', variantRefs.map(ref => ({
                    id: ref.id,
                    details: formData.variants.find(v => v.id)
                })));
            }

            toast.success('Product Added Successfully! 🎉', {
                duration: 5000,
                position: 'top-center',
                className: 'bg-green-500',
                style: {
                    background: '#10B981',
                    color: '#fff',
                    padding: '16px',
                    fontSize: '1.2rem',
                    borderRadius: '10px',
                    minWidth: '300px'
                }
            });

        } catch (error) {
            console.error('Error details:', error);
            toast.error('Failed to add product. Please try again.', {
                duration: 5000,
                position: 'top-right',
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
            });
        }
    };


    return (
        <div className="p-6 lg:p-8 bg-white rounded-xl shadow-sm">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Review Product Details</h2>
                <p className="text-gray-600 mt-2">Verify all product information before saving</p>
            </div>

            {/* Thumbnail Image */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Product Images</h3>
                <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-100">
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
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Additional Images</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {formData.media.map((file, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                {file.type.startsWith('image/') ? (
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={`Product image ${index + 1}`}
                                        fill
                                        className="object-cover"
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


            {/* Product Basic Info */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Title</p>
                        <p className="font-medium">{formData.title}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">{formData.category}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{formData.shortDescription}</p>
                </div>
            </div>


            {/* Color Variants */}
            {formData.colors.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Color Variants</h3>
                    <div className="flex flex-wrap gap-4">
                        {formData.colors
                            .filter(color => formData.variants.some(v => v.colorVariantId === color.id))
                            .map(color => (
                                <div
                                    key={color.id}
                                    className="flex items-center gap-2 px-4 py-2 border rounded-lg"
                                >
                                    <div
                                        className="w-6 h-6 rounded-full border"
                                        style={{ backgroundColor: color.hexCode }}
                                    />
                                    <span>{color.name}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}


            {/* Size Variants */}
            {formData.sizes.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Size Variants</h3>
                    <div className="flex flex-wrap gap-4">
                        {formData.sizes.map(size => (
                            <div
                                key={size.id}
                                className="px-4 py-2 border rounded-lg"
                            >
                                <span>{size.name}: {size.measurement}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Price and Stock Table */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Variant Combinations</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {formData.variants.map(variant => {
                                const color = formData.colors.find(c => c.id === variant.colorVariantId);
                                const size = formData.sizes.find(s => s.id === variant.sizeVariantId);

                                return (
                                    <tr key={variant.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {color && (
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: color.hexCode }}
                                                    />
                                                    <span>{color.name}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {size?.name} {size?.measurement}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            ${variant.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {variant.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${variant.status === 'active'
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

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={onPrevious}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
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
                    className={`px-6 py-2 bg-greenTheme text-white rounded-lg transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                        }`}
                >
                    {isUploading ? 'Uploading...' : 'Save Product'}
                </button>

                {isUploading && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                            <Loader2 className="w-16 h-16 text-greenTheme animate-spin" />
                            <p className="mt-4 text-lg font-medium text-gray-700">Uploading Product...</p>
                        </motion.div>
                    </div>

                )}

            </div>
        </div>
    );
}
