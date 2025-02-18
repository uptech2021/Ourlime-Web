'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon, Video, Grid, LayoutList, Calendar, Clock } from 'lucide-react';

interface MediaItem {
    id: string;
    imageURL: string;
    type: 'image' | 'video';
    uploadedAt: Date;
}

interface PhotosAndVideosDetailsProps {
    media: MediaItem[];
}

export const PhotosAndVideosDetails = ({ media }: PhotosAndVideosDetailsProps) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    return (
        <div className="max-w-7xl mx-auto space-y-4">
            {/* Top Controls */}
            <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">Gallery</h2>
                    <div className="flex gap-2 text-sm">
                        <span className="flex items-center gap-1 text-gray-600">
                            <ImageIcon size={16} />
                            {media.filter(m => m.type === 'image').length} Photos
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                            <Video size={16} />
                            {media.filter(m => m.type === 'video').length} Videos
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-green-50 text-greenTheme' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Grid View"
                        aria-label="Grid View"
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-green-50 text-greenTheme' : 'text-gray-400 hover:text-gray-600'}`}
                        title="List View"
                        aria-label="List View"
                    >
                        <LayoutList size={18} />
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setSelectedPeriod('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedPeriod === 'all' 
                        ? 'bg-greenTheme text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    All Time
                </button>
                <button
                    onClick={() => setSelectedPeriod('recent')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedPeriod === 'recent' 
                        ? 'bg-greenTheme text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    Recent
                </button>
                <button
                    onClick={() => setSelectedPeriod('2023')}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedPeriod === '2023' 
                        ? 'bg-greenTheme text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    2023
                </button>
            </div>

            {/* Media Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                        >
                            <Image
                                src={item.imageURL}
                                alt=""
                                fill
                                className="object-cover"
                                loader={({ src }) => src}
                                unoptimized={true}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="absolute bottom-2 left-2 right-2">
                                    <div className="flex items-center gap-2 text-white text-xs">
                                        <Clock size={12} />
                                        <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 bg-white p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={item.imageURL}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    loader={({ src }) => src}
                                    unoptimized={true}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar size={14} />
                                    <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {item.type === 'image' ? 'Photo' : 'Video'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};