'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import Image from 'next/image';
import { FaCamera, FaPlus, FaUser, FaImage } from 'react-icons/fa';

interface SelectedFiles {
    profile: File | null;
    cover: File | null;
}

type SecondStepOptionalProps = {
    setStep: (step: number) => void;
    handleAvatarSelection: (avatar: string) => void;
    profilePicture: string;
    setProfilePicture: (url: string) => void;
    selectedFiles: SelectedFiles;
    setSelectedFiles: (files: SelectedFiles) => void;
};

export default function SecondStepOptional({
    setStep,
    setProfilePicture,
    selectedFiles,
    setSelectedFiles
}: SecondStepOptionalProps) {
    const [previews, setPreviews] = useState<{ profile: string; cover: string }>(() => {
        const savedPreviews = sessionStorage.getItem('imagePreviews');
        if (savedPreviews) {
            const parsed = JSON.parse(savedPreviews);
            return {
                profile: parsed.profile || '',
                cover: parsed.cover || ''
            };
        }
        return {
            profile: '',
            cover: ''
        };
    });

    const profileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (type: 'profile' | 'cover') => (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setSelectedFiles({ ...selectedFiles, [type]: file });
            setPreviews(prev => {
                const newPreviews = { ...prev, [type]: previewUrl };
                sessionStorage.setItem('imagePreviews', JSON.stringify(newPreviews));
                return newPreviews;
            });

            if (type === 'profile') {
                setProfilePicture(previewUrl);
                sessionStorage.setItem('profilePicture', previewUrl);
            }
        }
    };

    useEffect(() => {
        // Load saved files on component mount
        const savedProfile = sessionStorage.getItem('profileFile');
        const savedCover = sessionStorage.getItem('coverFile');
        const savedPreviews = sessionStorage.getItem('imagePreviews');

        if (savedPreviews) {
            setPreviews(JSON.parse(savedPreviews));
        }

        return () => {
            // Cleanup blob URLs
            Object.values(previews).forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, []);

    return (
        <div className="step-2_1 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Customize Your Profile</h2>

            <div className="mb-8">
                <label className="block text-gray-700 text-sm font-bold mb-4" htmlFor="profile-picture">
                    Profile Picture
                </label>
                <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-greenTheme">
                        {previews.profile ? (
                            <Image
                                src={previews.profile}
                                alt="Profile Preview"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <FaUser className="text-4xl text-gray-400" />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => profileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-greenTheme rounded-full text-white hover:bg-green-600 transition-colors"
                        title="Upload profile picture"
                        aria-label="Upload profile picture"
                    >
                        <FaCamera className="text-lg" />
                    </button>
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-gray-700 text-sm font-bold mb-4" htmlFor="cover-photo">
                    Cover Photo
                </label>
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                    {previews.cover ? (
                        <Image
                            src={previews.cover}
                            alt="Cover Preview"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <FaImage className="text-4xl text-gray-400" />
                        </div>
                    )}
                    <button
                        onClick={() => coverInputRef.current?.click()}
                        className="absolute bottom-4 right-4 p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        title="Upload cover photo"
                        aria-label="Upload cover photo"
                    >
                        <FaPlus className="text-lg text-gray-800" />
                    </button>
                </div>
            </div>

            <input
                type="file"
                ref={profileInputRef}
                onChange={handleFileSelect('profile')}
                accept="image/*"
                className="hidden"
                id="profile-picture"
                aria-label="Upload profile picture"
            />
            <input
                type="file"
                ref={coverInputRef}
                onChange={handleFileSelect('cover')}
                accept="image/*"
                className="hidden"
                id="cover-photo"
                aria-label="Upload cover photo"
            />

            <div className="flex justify-between gap-4">
                <Button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                    Back
                </Button>
                <Button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-greenTheme text-white hover:bg-green-600"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
