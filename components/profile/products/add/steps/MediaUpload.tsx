'use client';

import { useState } from 'react';
import { ImageIcon, X, Upload, Film, Plus } from 'lucide-react';
import Image from 'next/image';
import { ProductFormData } from '@/types/productTypes';

type MediaUploadProps = {
    formData: ProductFormData;
    setFormData: (data: ProductFormData) => void;
    onNext: () => void;
    onPrevious: () => void;
};

export default function MediaUpload({ formData, setFormData, onNext, onPrevious }: MediaUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<{ url: string; type: string }[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files);
        const validFiles = newFiles.filter(file => 
            file.type.startsWith('image/') || file.type.startsWith('video/')
        );

        if (validFiles.length > 0) {
            setSelectedFiles(prev => [...prev, ...validFiles]);
            
            validFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, {
                        url: reader.result as string,
                        type: file.type
                    }]);
                };
                reader.readAsDataURL(file);
            });

            setFormData({
                ...formData,
                media: [...(formData.media || []), ...validFiles]
            });

            setIsValid(true);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setFormData({
            ...formData,
            media: formData.media?.filter((_, i) => i !== index)
        });
        setIsValid(selectedFiles.length > 1);
    };

    return (
        <div className="p-6 lg:p-8 bg-white rounded-xl shadow-sm">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Product Media</h2>
                <p className="text-gray-600 mt-2">Add additional photos and videos of your product</p>
            </div>

            <div className="max-w-3xl mx-auto">
                <div 
                    className={`relative h-48 rounded-xl border-2 border-dashed transition-colors mb-6 ${
                        dragActive ? 'border-greenTheme bg-green-50' : 'border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Upload size={24} className={`mb-2 ${dragActive ? 'text-greenTheme' : 'text-gray-400'}`} />
                        <p className="text-sm text-gray-600">Drop your files here, or click to browse</p>
                        <p className="text-xs text-gray-500 mt-1">Supports images (PNG, JPG) and videos (MP4)</p>
                    </div>
                    <input
                        type="file"
                        title="Upload media"
                        multiple
                        accept="image/*,video/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleFileSelect(e.target.files)}
                    />
                </div>

                {previews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative group aspect-square">
                                <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
                                    {preview.type.startsWith('image/') ? (
                                        <Image
                                            src={preview.url}
                                            alt={`Preview ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                            <Film size={24} className="text-gray-400" />
                                            <span className="text-xs text-gray-500 mt-2">Video</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove"
                                >
                                    <X size={16} className="text-gray-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between mt-8">
                    <button
                        type="button"
                        onClick={onPrevious}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        className="px-6 py-2.5 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Next Step
                    </button>
                </div>
            </div>
        </div>
    );
}
