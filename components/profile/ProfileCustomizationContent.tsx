import React, { useState } from 'react';
import { ImageIcon, Search, Info } from 'lucide-react';
import Image from 'next/image';
import { UserData, ProfileImage } from '@/types/userTypes';
import { auth, db } from '@/lib/firebaseConfig';
import { addDoc, collection, getDocs, query, updateDoc, doc, where } from 'firebase/firestore';
import { useProfileStore } from 'src/store/useProfileStore';

interface ProfileCustomizationContentProps {
    userData: UserData | null;
    profileImage: ProfileImage | null;
    userImages: ProfileImage[];
    onImageSelect: (image: ProfileImage) => void;
    onImageUpload: (file: File) => void;
}

const getOptionDescription = (option: string) => {
    switch (option) {
        case 'profile':
            return 'This will be your main profile picture shown across the platform';
        case 'coverProfile':
            return 'This image will appear as your profile background/banner';
        case 'postProfile':
            return 'This image will appear next to your posts instead of your main profile picture';
        default:
            return '';
    }
};

const ProfileCustomizationContent: React.FC<ProfileCustomizationContentProps> = ({
    userData,
    profileImage,
    userImages,
    onImageSelect,
    onImageUpload,
}) => {
    const [selectedImage, setSelectedImage] = useState<ProfileImage | null>(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredImages = userImages.filter(image =>
        image.imageURL.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleImageSave = async () => {
        const user = auth.currentUser;
        if (!user || !selectedOption || !selectedImage) return;

        const setAsQuery = query(
            collection(db, 'profileImageSetAs'),
            where('userId', '==', user.uid),
            where('setAs', '==', selectedOption)
        );

        const setAsSnapshot = await getDocs(setAsQuery);

        try {
            if (!setAsSnapshot.empty) {
                const setAsDoc = setAsSnapshot.docs[0];
                await updateDoc(doc(db, 'profileImageSetAs', setAsDoc.id), {
                    profileImageId: selectedImage.id
                });
            } else {
                await addDoc(collection(db, 'profileImageSetAs'), {
                    userId: user.uid,
                    profileImageId: selectedImage.id,
                    setAs: selectedOption
                });
            }

            switch (selectedOption) {
                case 'profile':
                    useProfileStore.getState().setProfileImage(selectedImage);
                    break;
                case 'coverProfile':
                    useProfileStore.getState().setCoverImage(selectedImage);
                    break;
                case 'postProfile':
                    useProfileStore.getState().setPostProfileImage(selectedImage);
                    break;
            }

            setSelectedOption('');
            setSelectedImage(null);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full h-24 sm:h-32 bg-gradient-to-r from-green-400 to-green-600 rounded-xl mb-4 flex items-center justify-center">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Customize Your Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Your Images</h2>
                        <div className="relative w-48 sm:w-56">
                            <input
                                type="text"
                                placeholder="Search images..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-1.5 pl-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenTheme focus:outline-none"
                            />
                            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex lg:grid lg:grid-cols-6 gap-2 overflow-x-auto 
                    lg:overflow-x-hidden overflow-y-hidden lg:overflow-y-auto 
                    h-[calc(100vh-250px)] pb-2 lg:pb-0 snap-x lg:snap-none 
                    scrollbar-thin scrollbar-thumb-greenTheme 
                    scrollbar-track-gray-200">
                            {filteredImages.map((image) => (
                                <div
                                    key={image.id}
                                    onClick={() => setSelectedImage(image)}
                                    className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 lg:w-full lg:aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:opacity-90 snap-center ${selectedImage?.id === image.id ? 'ring-2 ring-greenTheme' : ''
                                        }`}
                                >
                                    <Image
                                        src={image.imageURL}
                                        alt="Gallery image"
                                        fill
                                        className="object-cover"
                                        loader={({ src }) => src}
                                        unoptimized={true}
                                    />
                                </div>
                            ))}
                            <label className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-full lg:aspect-square flex-shrink-0 rounded-lg border-2 border-dashed border-gray-300 hover:border-greenTheme cursor-pointer transition-colors">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                                    <ImageIcon size={16} />
                                    <span className="mt-1 text-xs">Upload</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900">Selected Image</h2>
                    {selectedImage ? (
                        <>
                            <div className="relative aspect-square max-w-sm mx-auto rounded-lg overflow-hidden">
                                <Image
                                    src={selectedImage.imageURL}
                                    alt="Selected image"
                                    fill
                                    className="object-cover"
                                    loader={({ src }) => src}
                                    unoptimized={true}
                                />
                            </div>
                            <div className="space-y-2 max-w-sm mx-auto">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Set this image as:
                                    </label>
                                    <select
                                    aria-label='Set this image as'
                                        value={selectedOption}
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                        className="w-full p-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-greenTheme focus:outline-none"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="profile">Profile Picture</option>
                                        <option value="coverProfile">Cover Photo</option>
                                        <option value="postProfile">Post Profile Picture</option>
                                    </select>
                                </div>

                                {selectedOption && (
                                    <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg text-xs">
                                        <Info className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-gray-600">{getOptionDescription(selectedOption)}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleImageSave}
                                    className="w-full bg-greenTheme text-white py-1.5 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                >
                                    Save Selection
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                            Select an image from your gallery
                        </div>
                    )}
                </div>
            </div>
        </div>


    );
};

export default ProfileCustomizationContent;
