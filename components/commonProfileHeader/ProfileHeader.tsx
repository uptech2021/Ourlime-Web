'use client';

import { useEffect, useState } from 'react';
import {
    Camera, Pencil
} from 'lucide-react';
import Image from 'next/image';
import { UserData, ProfileImage } from '@/types/userTypes';
import ChangeProfileImageModal from '@/components/profile/ChangeProfileImageModal';
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { auth, db, storage } from '@/lib/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useProfileStore } from 'src/store/useProfileStore';
import ChangeCoverImageModal from '@/components/profile/ChangeCoverImageModal';
import { onAuthStateChanged } from 'firebase/auth';

interface ProfileHeaderProps {
    onCustomizationSelect: (selectedImage: ProfileImage) => void;
    userImages: ProfileImage[];
}

export default function ProfileHeader({ onCustomizationSelect }: ProfileHeaderProps) {
    const [userData, setUserData] = useState<UserData | null>(null);
    const { profileImage } = useProfileStore();
    const [isChangeImageModalOpen, setIsChangeImageModalOpen] = useState(false);
    const [userImages, setUserImages] = useState<ProfileImage[]>([]);
    const [isChangeCoverModalOpen, setIsChangeCoverModalOpen] = useState(false);
    const [selectedCoverImage, setSelectedCoverImage] = useState<ProfileImage | null>(null);
    const { coverImage } = useProfileStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [newBio, setNewBio] = useState(userData?.bio || '');
    const { firstName, lastName, userName } = useProfileStore();
    const isOnline = useProfileStore(state => state.isUserOnline(userData?.id));

    const handleImageSelect = async (selectedImage: ProfileImage) => {
        const user = auth.currentUser;
        if (!user) return;

        const profileSetAsQuery = query(
            collection(db, 'profileImageSetAs'),
            where('userId', '==', user.uid),
            where('setAs', '==', 'profile')
        );
        const setAsSnapshot = await getDocs(profileSetAsQuery);

        if (!setAsSnapshot.empty) {
            const setAsDoc = setAsSnapshot.docs[0];
            await updateDoc(doc(db, 'profileImageSetAs', setAsDoc.id), {
                profileImageId: selectedImage.id
            });
        }

        useProfileStore.getState().setProfileImage(selectedImage);
        setIsChangeImageModalOpen(false);
    };

    const handleImageUpload = async (file: File) => {
        const user = auth.currentUser;
        if (!user) return;

        const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}_${file.name}`);

        const uploadTask = await uploadBytes(storageRef, file);
        const imageURL = await getDownloadURL(uploadTask.ref);

        const profileImageRef = await addDoc(collection(db, 'profileImages'), {
            userId: user.uid,
            imageURL: imageURL,
            uploadedAt: serverTimestamp()
        });

        const profileSetAsQuery = query(
            collection(db, 'profileImageSetAs'),
            where('userId', '==', user.uid),
            where('setAs', '==', 'profile')
        );
        const setAsSnapshot = await getDocs(profileSetAsQuery);

        if (!setAsSnapshot.empty) {
            const setAsDoc = setAsSnapshot.docs[0];
            await updateDoc(doc(db, 'profileImageSetAs', setAsDoc.id), {
                profileImageId: profileImageRef.id
            });
        }

        useProfileStore.getState().setProfileImage({
            id: profileImageRef.id,
            imageURL,
            userId: user.uid,
            typeOfImage: 'profile',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        setIsChangeImageModalOpen(false);
    };

    const handleCoverImageSelect = (selectedImage: ProfileImage) => {
        setSelectedCoverImage(selectedImage);
    };

    const handleSaveCoverImage = async () => {
        if (!selectedCoverImage) return;

        const user = auth.currentUser;
        if (!user) return;

        const coverSetAsQuery = query(
            collection(db, 'profileImageSetAs'),
            where('userId', '==', user.uid),
            where('setAs', '==', 'coverProfile')
        );
        const setAsSnapshot = await getDocs(coverSetAsQuery);

        if (!setAsSnapshot.empty) {
            const setAsDoc = setAsSnapshot.docs[0];
            await updateDoc(doc(db, 'profileImageSetAs', setAsDoc.id), {
                profileImageId: selectedCoverImage.id
            });
        } else {
            await addDoc(collection(db, 'profileImageSetAs'), {
                userId: user.uid,
                profileImageId: selectedCoverImage.id,
                setAs: 'coverProfile'
            });
        }

        // Instant update
        useProfileStore.getState().setCoverImage(selectedCoverImage);
        setIsChangeCoverModalOpen(false);
        setSelectedCoverImage(null);
    };

    const handleCoverImageUpload = async (file: File) => {
        const user = auth.currentUser;
        if (!user) return;

        const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}_${file.name}`);

        const uploadTask = await uploadBytes(storageRef, file);
        const imageURL = await getDownloadURL(uploadTask.ref);

        const coverImageRef = await addDoc(collection(db, 'profileImages'), {
            userId: user.uid,
            imageURL,
            typeOfImage: 'coverProfile',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const newCoverImage = {
            id: coverImageRef.id,
            imageURL,
            userId: user.uid,
            typeOfImage: 'coverProfile',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setSelectedCoverImage(newCoverImage);
        setUserImages(prev => [...prev, newCoverImage]);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Fetch user profile data
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data() as UserData;
                        setUserData(userData);
                        setNewBio(userData.bio || '');
                    }
    
                    // Fetch all profile images and their assignments
                    const [imagesSnapshot, setAsSnapshot] = await Promise.all([
                        getDocs(query(collection(db, 'profileImages'), 
                            where('userId', '==', user.uid))),
                        getDocs(query(collection(db, 'profileImageSetAs'), 
                            where('userId', '==', user.uid)))
                    ]);
    
                    const images = imagesSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate(),
                        updatedAt: doc.data().updatedAt?.toDate()
                    })) as ProfileImage[];
    
                    setUserImages(images);
    
                    // Process image assignments
                    setAsSnapshot.docs.forEach(doc => {
                        const setAsData = doc.data();
                        const matchingImage = images.find(img => img.id === setAsData.profileImageId);
                        
                        if (matchingImage) {
                            if (setAsData.setAs === 'profile') {
                                useProfileStore.getState().setProfileImage(matchingImage);
                            } else if (setAsData.setAs === 'coverProfile') {
                                useProfileStore.getState().setCoverImage(matchingImage);
                            }
                        }
                    });
    
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setIsLoading(false);
                }
            }
        });
    
        return () => unsubscribe();
    }, []);
    
    return (
        <div className="flex-shrink-0">
            {/* Cover Image Section */}
            <div className="relative h-40 md:h-48 lg:h-60">
                <div className="absolute inset-0">
                    {isLoading && (
                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                    )}
                    {coverImage?.imageURL && (
                        <Image
                            src={coverImage.imageURL}
                            alt="Cover"
                            fill
                            className="object-cover"
                            priority
                            loader={({ src }) => src}
                            unoptimized={true}
                            onLoadingComplete={() => setIsLoading(false)}
                        />
                    )}
                </div>

                <button
                    onClick={() => setIsChangeCoverModalOpen(true)}
                    className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                >
                    <Camera size={18} />
                    Change Cover
                </button>

                {isChangeCoverModalOpen && (
                    <ChangeCoverImageModal
                        isOpen={isChangeCoverModalOpen}
                        onClose={() => setIsChangeCoverModalOpen(false)}
                        existingImages={userImages}
                        onSelectImage={handleCoverImageSelect}
                        onSave={handleSaveCoverImage}
                        onUploadNewImage={handleCoverImageUpload}
                    />
                )}
            </div>

            <div className="px-4 md:px-6 lg:px-8">
                {/* Profile Picture and User Info */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 -mt-12 mb-6">
                    <div className="relative group">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                            <Image
                                src={profileImage?.imageURL || "/images/default-avatar.jpg"}
                                alt="Profile"
                                width={112}
                                height={112}
                                className="w-full h-full object-cover"
                                loader={({ src }) => src}
                                unoptimized={true}
                            />
                        </div>
                        <button
                            onClick={() => setIsChangeImageModalOpen(true)}
                            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                            title='Change Profile Picture'
                        >
                            <Camera size={20} className="text-white" />
                        </button>

                        {isChangeImageModalOpen && (
                            <ChangeProfileImageModal
                                isOpen={isChangeImageModalOpen}
                                onClose={() => setIsChangeImageModalOpen(false)}
                                existingImages={userImages}
                                onSelectImage={handleImageSelect}
                                onUploadNewImage={handleImageUpload}
                            />
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 items-start md:items-center justify-between mt-2 md:mt-8 w-full">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {firstName || userData?.firstName} {lastName || userData?.lastName}
                                </h1>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                    Online
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm">@{userName || userData?.userName}</p>
                        </div>

                        <div className="flex gap-2 mt-3 md:mt-0">
                            <button className="bg-greenTheme text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                                Edit Profile
                            </button>
                            <button className="border border-gray-300 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mb-6 relative">
                    <div className="flex items-center gap-2">
                        <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
                            {userData?.bio || "No bio available"}
                        </p>
                        <button
                            onClick={() => setIsEditingBio(!isEditingBio)}
                            className="hover:text-greenTheme transition-colors"
                            title='Edit Bio'
                        >
                            <Pencil size={16} />
                        </button>
                    </div>

                    {isEditingBio && (
                        <div className="mt-3 space-y-2">
                            <input
                                type="text"
                                value={newBio}
                                onChange={(e) => setNewBio(e.target.value)}
                                placeholder="Enter your new bio"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                            />
                            <button
                                onClick={async () => {
                                    const user = auth.currentUser;
                                    if (user) {
                                        await updateDoc(doc(db, 'users', user.uid), {
                                            bio: newBio
                                        });
                                        setIsEditingBio(false);
                                        setUserData(prev => prev ? { ...prev, bio: newBio } : null);
                                    }
                                }}
                                className="bg-greenTheme text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                            >
                                Save Bio
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
