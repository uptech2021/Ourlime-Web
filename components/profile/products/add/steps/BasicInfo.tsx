'use client';

import { useState, useEffect } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { ProductFormData } from '@/types/productTypes';
import Image from 'next/image';

type BasicInfoProps = {
    formData: ProductFormData;
    setFormData: (data: ProductFormData) => void;
    onNext: () => void;
};

export default function BasicInfo({ formData, setFormData, onNext }: BasicInfoProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);
    const [touchedFields, setTouchedFields] = useState({
        title: false,
        category: false,
        shortDescription: false,
        longDescription: false,
        coverImage: false
    });
    const [errors, setErrors] = useState({
        title: '',
        category: '',
        shortDescription: '',
        longDescription: '',
        coverImage: ''
    });

    const validateTitle = (title: string) => {
        if (!title.trim()) return 'Title is required';
        if (title.length < 3) return 'Title must be at least 3 characters';
        if (title.length > 100) return 'Title must be less than 100 characters';
        return '';
    };

    const validateCategory = (category: string) => {
        if (!category) return 'Please select a category';
        return '';
    };

    const validateShortDescription = (desc: string) => {
        if (!desc.trim()) return 'Short description is required';
        if (desc.length < 10) return 'Short description must be at least 10 characters';
        if (desc.length > 150) return 'Short description must be less than 150 characters';
        return '';
    };

    const validateLongDescription = (desc: string) => {
        if (!desc.trim()) return 'Detailed description is required';
        if (desc.length < 50) return 'Detailed description must be at least 50 characters';
        return '';
    };

    const checkFormValidity = () => {
        const validations = {
            title: validateTitle(formData.title),
            category: validateCategory(formData.category),
            shortDescription: validateShortDescription(formData.shortDescription),
            longDescription: validateLongDescription(formData.longDescription)
        };

        setErrors(prev => ({
            ...prev,
            ...validations
        }));

        const isFormValid = !Object.values(validations).some(error => error !== '') && 
                          formData.thumbnailImage !== undefined;
        
        setIsValid(isFormValid);
    };

    useEffect(() => {
        checkFormValidity();
    }, [formData]);

    const handleInputChange = (field: keyof ProductFormData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleBlur = (field: string) => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
    };

    const handleImageUpload = (file: File) => {
        setTouchedFields(prev => ({ ...prev, coverImage: true }));

        if (file.size > 10 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, coverImage: 'Image must be less than 10MB' }));
            return;
        }

        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, coverImage: 'Please upload an image file' }));
            return;
        }

        setFormData({ ...formData, thumbnailImage: file });
        setErrors(prev => ({ ...prev, coverImage: '' }));

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setFormData({ ...formData, thumbnailImage: undefined });
        setImagePreview(null);
        setErrors(prev => ({ ...prev, coverImage: 'Cover image is required' }));
        setTouchedFields(prev => ({ ...prev, coverImage: true }));
    };


    return (
        <div className="p-6 lg:p-8 bg-white rounded-xl shadow-sm">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                <p className="text-gray-600 mt-2">Start by adding the basic information about your product</p>
            </div>
    
            <form className="space-y-8 max-w-3xl">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Cover Image
                    </label>
                    <div className="relative h-64 rounded-xl border-2 border-dashed border-gray-300 hover:border-greenTheme transition-colors bg-gray-50">
                        {imagePreview ? (
                            <div className="relative h-full w-full group">
                                <Image
                                    src={imagePreview}
                                    alt="Product cover"
                                    fill
                                    className="object-contain rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove image"
                                >
                                    <X size={16} className="text-gray-600" />
                                </button>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <ImageIcon size={32} className="text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">Drop your product image here, or click to browse</p>
                                <p className="text-xs text-gray-500 mt-1">High-quality PNG or JPG up to 10MB</p>
                            </div>
                        )}
                        <input
                            type="file"
                            title="Upload product image"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file);
                            }}
                        />
                    </div>
                    {touchedFields.coverImage && errors.coverImage && (
                        <p className="mt-1 text-sm text-red-500">{errors.coverImage}</p>
                    )}
                </div>
    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="productTitle" className="block text-sm font-medium text-gray-700 mb-2">
                            Product Title
                        </label>
                        <input
                            id="productTitle"
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            onBlur={() => handleBlur('title')}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenTheme focus:border-transparent transition-colors"
                            placeholder="Enter your product title"
                        />
                        {touchedFields.title && errors.title && (
                            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Product Category
                        </label>
                        <select 
                            id="category"
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            onBlur={() => handleBlur('category')}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenTheme focus:border-transparent transition-colors"
                        >
                            <option value="">Select a category</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="home">Home & Living</option>
                            <option value="sports">Sports & Outdoors</option>
                            <option value="beauty">Beauty & Personal Care</option>
                            <option value="books">Books & Media</option>
                            <option value="toys">Toys & Games</option>
                            <option value="automotive">Automotive</option>
                        </select>
                        {touchedFields.category && errors.category && (
                            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                        )}
                    </div>
                </div>
    
                <div>
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description
                    </label>
                    <input
                        id="shortDescription"
                        type="text"
                        value={formData.shortDescription}
                        onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                        onBlur={() => handleBlur('shortDescription')}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenTheme focus:border-transparent transition-colors"
                        placeholder="Brief description of your product"
                        maxLength={150}
                    />
                    <div className="flex justify-between mt-1">
                        {touchedFields.shortDescription && errors.shortDescription && (
                            <p className="text-sm text-red-500">{errors.shortDescription}</p>
                        )}
                        <p className="text-sm text-gray-500">
                            {formData.shortDescription.length}/150 characters
                        </p>
                    </div>
                </div>
    
                <div>
                    <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Detailed Description
                    </label>
                    <textarea
                        id="longDescription"
                        rows={6}
                        value={formData.longDescription}
                        onChange={(e) => handleInputChange('longDescription', e.target.value)}
                        onBlur={() => handleBlur('longDescription')}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenTheme focus:border-transparent transition-colors resize-none"
                        placeholder="Provide a detailed description of your product"
                    />
                    {touchedFields.longDescription && errors.longDescription && (
                        <p className="mt-1 text-sm text-red-500">{errors.longDescription}</p>
                    )}
                </div>
    
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Save as draft"
                    >
                        Save Draft
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        disabled={!isValid}
                        className={`px-6 py-2.5 rounded-lg transition-colors ${
                            isValid 
                                ? 'bg-greenTheme text-white hover:bg-green-600' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        title={isValid ? 'Proceed to next step' : 'Please fill all required fields correctly'}
                    >
                        Next Step
                    </button>
                </div>
            </form>
        </div>
    );
    


}