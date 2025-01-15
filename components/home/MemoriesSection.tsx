import { useEffect, useState } from 'react';
import { auth, db, storage } from '@/lib/firebaseConfig';
import { addDoc, collection, getDoc, getDocs, orderBy, query, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { Plus, Upload } from 'lucide-react';

const MemoriesSection = () => {
    const [shortFile, setShortFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [shorts, setShorts] = useState([]);

    const handleShortSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setShortFile(file);

            // Create preview URL immediately
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // For videos, generate thumbnail
            if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = url;
                video.onloadeddata = () => {
                    video.currentTime = 0;
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(video, 0, 0);
                    const thumbnailUrl = canvas.toDataURL();
                    setPreviewUrl(thumbnailUrl);
                };
            }
        }
    };

    const handleUploadShort = async () => {
        if (!shortFile || !auth.currentUser) return;

        setIsUploading(true);
        const storageRef = ref(storage, `shorts/${auth.currentUser.uid}/${shortFile.name}`);

        try {
            const uploadResult = await uploadBytes(storageRef, shortFile);
            const downloadURL = await getDownloadURL(uploadResult.ref);

            await addDoc(collection(db, 'shorts'), {
                typeUrl: downloadURL,
                userId: auth.currentUser.uid,
                createdAt: new Date()
            });

            setShortFile(null);
            setPreviewUrl(null);
            setIsUploading(false);
        } catch (error) {
            console.error('Error uploading short:', error);
            setIsUploading(false);
        }
    };

    useEffect(() => {
        const fetchShorts = async () => {
            try {
                const shortsRef = collection(db, 'shorts');
                const q = query(shortsRef, orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);

                const shortsData = await Promise.all(
                    snapshot.docs.map(async (docSnapshot) => {
                        const shortData = docSnapshot.data();
                        const userDocRef = doc(db, 'users', shortData.userId);
                        const userDoc = await getDoc(userDocRef);
                        const userData = userDoc.data();

                        return {
                            id: docSnapshot.id,
                            ...shortData,
                            userName: userData?.userName,
                            firstName: userData?.firstName,
                            lastName: userData?.lastName
                        };
                    })
                );

                setShorts(shortsData);
            } catch (error) {
                console.log('Error fetching shorts:', error);
            }
        };

        fetchShorts();
    }, []);

    return (
        <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Moments</h2>
            <div className="relative">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
                    <div className="flex-shrink-0 w-32 aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                        {!shortFile ? (
                            <>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleShortSelect}
                                    className="hidden"
                                    id="short-upload"
                                />
                                <label
                                    htmlFor="short-upload"
                                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                                >
                                    <Plus className="w-8 h-8 text-gray-500" />
                                    <span className="text-sm text-gray-500 mt-2">Add Short</span>
                                </label>
                            </>
                        ) : (
                            <div className="relative w-full h-full">
                                {previewUrl && (
                                    <Image
                                        src={previewUrl}
                                        alt="Short preview"
                                        fill
                                        className="object-cover"
                                        loader={({ src }) => src}
                                        unoptimized={true}
                                    />
                                )}
                                <button
                                    onClick={handleUploadShort}
                                    className="absolute inset-0 bg-black bg-opacity-50 text-white flex flex-col items-center justify-center"
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <span>Uploading...</span>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8" />
                                            <span className="text-sm mt-2">Upload Short</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Shorts preview tiles */}
                    {shorts.map((short) => (
                        <div
                            key={short.id}
                            className="flex-shrink-0 w-32 h-64 relative mb-14"
                        >
                            <div className="h-full rounded-lg overflow-hidden">
                                {short.typeUrl.includes('.mp4') ? (
                                    <video
                                        src={short.typeUrl}
                                        className="w-full h-full object-cover rounded-lg"
                                        controls
                                        muted
                                        loop
                                    />
                                ) : (
                                    <Image
                                        src={short.typeUrl}
                                        alt="Short preview"
                                        fill
                                        className="object-cover rounded-lg"
                                        loader={({ src }) => src}
                                        unoptimized={true}
                                    />
                                )}
                            </div>

                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg">
                                <Image
                                    src="/images/transparentLogo.png"
                                    alt="Ourlime Logo"
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="absolute -bottom-14 left-0 right-0 text-center">
                                <span className="text-sm font-medium text-gray-800">@{short.userName}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MemoriesSection; 