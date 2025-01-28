'use client';

import { useState, useEffect } from 'react';
import { Camera, ImageIcon, Type, Info } from 'lucide-react';
import { ProfileImage, UserData } from '@/types/userTypes';
import Image from 'next/image';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useProfileStore } from 'src/store/useProfileStore';

interface ProfileCustomizationContentProps {
    userData: UserData | null;
    profileImage: ProfileImage | null;
    userImages: ProfileImage[];
}

export default function ProfileCustomizationContent({
    userData,
    profileImage,
    userImages
}: ProfileCustomizationContentProps) {
    const [images, setImages] = useState<ProfileImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<ProfileImage | null>(null);
    const [selectedType, setSelectedType] = useState<string>('');

    const imageTypes = [
        { 
            value: 'profile', 
            label: 'Profile Picture', 
            description: 'This will be your main profile picture shown across the platform',
            store: useProfileStore.getState().setProfileImage 
        },
        { 
            value: 'coverProfile', 
            label: 'Cover Photo', 
            description: 'This will be displayed as your profile background image',
            store: useProfileStore.getState().setCoverImage 
        },
        { 
            value: 'jobProfile', 
            label: 'Job Profile Picture', 
            description: 'This image will represent you in job-related activities',
            store: useProfileStore.getState().setJobProfileImage 
        },
        { 
            value: 'postProfile', 
            label: 'Post Profile Picture', 
            description: 'This will appear alongside your posts and comments',
            store: useProfileStore.getState().setPostProfileImage 
        }
    ];
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const imagesQuery = query(
                    collection(db, 'profileImages'),
                    where('userId', '==', user.uid)
                );
                const snapshot = await getDocs(imagesQuery);
                const userImages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as ProfileImage));
                setImages(userImages);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleImageSelect = (image: ProfileImage) => {
        setSelectedImage(image);
    };

    const handleImageTypeSelect = (type: string) => {
        if (!selectedImage) return;
        setSelectedType(type);
    };

    const getTypeMessage = (selectedType: string) => {
        switch (selectedType) {
            case 'profile':
                return "This will be your main profile picture that users see when they visit your profile. It represents you across the entire platform.";
            case 'coverProfile':
                return "This will be displayed as your profile's background banner, creating a personalized header for your profile page.";
            case 'jobProfile':
                return "This image will represent you in all job-related activities, including job applications and professional networking.";
            case 'postProfile':
                return "This image will appear next to all your posts and comments, helping others identify your contributions.";
            default:
                return "Select how you'd like to use this image. Each option serves a different purpose in your profile.";
        }
    };

    const handleSave = async () => {
        const currentUser = auth.currentUser;
        if (!selectedImage || !selectedType || !currentUser) {
            return;
        }
    
        try {
            const profileSetAsQuery = query(
                collection(db, 'profileImageSetAs'),
                where('userId', '==', currentUser.uid),
                where('setAs', '==', selectedType)
            );
            const setAsSnapshot = await getDocs(profileSetAsQuery);
    
            if (!setAsSnapshot.empty) {
                const setAsDoc = setAsSnapshot.docs[0];
                await updateDoc(doc(db, 'profileImageSetAs', setAsDoc.id), {
                    profileImageId: selectedImage.id
                });
            } else {
                await addDoc(collection(db, 'profileImageSetAs'), {
                    userId: currentUser.uid,
                    profileImageId: selectedImage.id,
                    setAs: selectedType,
                    createdAt: new Date()
                });
            }
    
            const typeConfig = imageTypes.find(t => t.value === selectedType);
            if (typeConfig?.store) {
                typeConfig.store(selectedImage);
            }
    
            setSelectedType('');
            setSelectedImage(null);
    
        } catch (error) {
            console.error('Error saving image assignment:', error);
        }
    };
    

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Profile Customization</h2>
                    <p className="mt-1 text-sm text-gray-500">Personalize your profile appearance</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 bg-green-50 text-greenTheme rounded-full text-sm font-medium">
                    Customization Settings
                </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Images Column */}
                <div className="w-full lg:w-2/3"> {/* Increased width */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Images</h3>
                            <div className="h-[600px] overflow-y-auto pr-2">
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"> {/* Grid layout */}
                                    {images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group transition-all ${selectedImage?.id === image.id ? 'ring-2 ring-greenTheme' : ''
                                                }`}
                                            onClick={() => handleImageSelect(image)}
                                        >
                                            <Image
                                                src={image.imageURL}
                                                alt={`Profile Image ${index + 1}`}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                                unoptimized={true}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview and Settings Column */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Preview & Settings</h3>
                            {/* Default help message */}
                            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400 mb-5">
                                <div className="flex gap-2">
                                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                    <p className="text-sm text-amber-700">
                                        Select how you'd like to use this image. Each option serves a different purpose in your profile.
                                    </p>
                                </div>
                            </div>
                            {selectedImage ? (
                                <div className="space-y-6">
                                    <div className="relative aspect-[3/2] rounded-lg overflow-hidden">
                                        <Image
                                            src={selectedImage.imageURL}
                                            alt="Selected Image"
                                            fill
                                            className="object-cover"
                                            unoptimized={true}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block">
                                            <span className="text-sm font-medium text-gray-700">Set this image as:</span>
                                            <select
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-greenTheme focus:ring-greenTheme"
                                                onChange={(e) => handleImageTypeSelect(e.target.value)}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Choose an option</option>
                                                {imageTypes.map((type) => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        {/* Dynamic Message based on selection */}
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <div className="flex gap-2">
                                                <Info className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <p className="text-sm text-green-800 font-medium">
                                                    {getTypeMessage(selectedType)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSave}
                                            className="mt-6 w-full bg-greenTheme text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!selectedImage || !selectedType}
                                        >
                                            Save Changes
                                        </button>


                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No image selected</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Select an image from the left to preview and set its usage
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
