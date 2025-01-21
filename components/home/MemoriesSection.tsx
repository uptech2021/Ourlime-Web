import { useEffect, useRef, useState } from 'react';
import { auth, db, storage } from '@/lib/firebaseConfig';
import { addDoc, collection, getDoc, getDocs, orderBy, query, doc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Plus, Upload } from 'lucide-react';

const MemoriesSection = ({ profileImage }) => {
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

                        // Fetch user's profile image using the provided logic
                        const profileImagesQuery = query(
                            collection(db, 'profileImages'),
                            where('userId', '==', userDoc.id)
                        );
                        const profileImagesSnapshot = await getDocs(profileImagesQuery);

                        const profileSetAsQuery = query(
                            collection(db, 'profileImageSetAs'),
                            where('userId', '==', userDoc.id),
                            where('setAs', '==', 'profile')
                        );
                        const setAsSnapshot = await getDocs(profileSetAsQuery);

                        let profileImageUrl = null;
                        if (!setAsSnapshot.empty) {
                            const setAsDoc = setAsSnapshot.docs[0].data();
                            const matchingImage = profileImagesSnapshot.docs.find(
                                (img) => img.id === setAsDoc.profileImageId
                            );
                            if (matchingImage) {
                                profileImageUrl = matchingImage.data().imageURL;
                            }
                        }

                        return {
                            id: docSnapshot.id,
                            ...shortData,
                            userName: userData?.userName,
                            firstName: userData?.firstName,
                            lastName: userData?.lastName,
                            profileImage: profileImageUrl, // Include profileImage URL
                        };
                    })
                );

                console.log('Fetched Shorts Data with Profile Images:', shortsData);

                setShorts(shortsData);
            } catch (error) {
                console.error('Error fetching shorts:', error);
            }
        };

        fetchShorts();
    }, []);


    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current!.offsetLeft);
        setScrollLeft(scrollRef.current!.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current!.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current!.scrollLeft = scrollLeft - walk;
    };

    
        // attempting a custom video player
        // I WAS ATTEMPTING TO MAKE A CUSTOM VIDEO PLAY FOR THE SHORTS SECTION
        // STARTS HERE

        // const VideoPlayer = ({ src }) => {
        //     const [isPlaying, setIsPlaying] = useState(false);
        //     const [progress, setProgress] = useState(0);
        //     const [volume, setVolume] = useState(1);
        //     const [showControls, setShowControls] = useState(true);
        //     const videoRef = useRef<HTMLVideoElement>(null);
        //     const controlsTimeoutRef = useRef<NodeJS.Timeout>();
    
        //     useEffect(() => {
        //         const hideControlsTimer = () => {
        //             if (isPlaying) {
        //                 controlsTimeoutRef.current = setTimeout(() => {
        //                     setShowControls(false);
        //                 }, 2000);
        //             }
        //         };
    
        //         hideControlsTimer();
        //         return () => {
        //             if (controlsTimeoutRef.current) {
        //                 clearTimeout(controlsTimeoutRef.current);
        //             }
        //         };
        //     }, [isPlaying]);
    
        //     const togglePlay = () => {
        //         if (videoRef.current) {
        //             if (videoRef.current.paused) {
        //                 videoRef.current.play();
        //                 setIsPlaying(true);
        //             } else {
        //                 videoRef.current.pause();
        //                 setIsPlaying(false);
        //             }
        //         }
        //         setShowControls(true);
        //     };
    
        //     const handleTimeUpdate = () => {
        //         if (videoRef.current) {
        //             const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        //             setProgress(progress);
        //         }
        //     };
    
        //     const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //         const value = parseFloat(e.target.value);
        //         setVolume(value);
        //         if (videoRef.current) {
        //             videoRef.current.volume = value;
        //         }
        //     };
    
        //     const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        //         const progressBar = e.currentTarget;
        //         const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
        //         if (videoRef.current) {
        //             videoRef.current.currentTime = clickPosition * videoRef.current.duration;
        //         }
        //     };
    
        //     return (
        //         <div
        //             className="relative w-full h-full group"
        //             onMouseMove={() => setShowControls(true)}
        //         >
        //             <video
        //                 ref={videoRef}
        //                 src={src}
        //                 className="w-full h-full object-cover rounded-xl"
        //                 loop
        //                 playsInline
        //                 onTimeUpdate={handleTimeUpdate}
        //                 onClick={togglePlay}
        //             />
    
        //             {/* Play/Pause Overlay */}
        //             <div
        //                 className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
        //                     }`}
        //             >
        //                 <button
        //                     onClick={togglePlay}
        //                     className="w-20 h-20 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-transform hover:scale-110"
        //                 >
        //                     {isPlaying ? (
        //                         <Pause className="w-10 h-10 text-white" />
        //                     ) : (
        //                         <Play className="w-10 h-10 text-white ml-1" />
        //                     )}
        //                 </button>
        //             </div>
    
        //             {/* Bottom Controls */}
        //             <div
        //                 className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
        //                     }`}
        //             >
        //                 {/* Progress Bar */}
        //                 <div
        //                     className="h-1 bg-white/30 rounded-full cursor-pointer mb-4"
        //                     onClick={handleProgressBarClick}
        //                 >
        //                     <div
        //                         className="h-full bg-white rounded-full relative"
        //                         style={{ width: `${progress}%` }}
        //                     >
        //                         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transform scale-0 group-hover:scale-100 transition-transform" />
        //                     </div>
        //                 </div>
    
        //                 {/* Volume Control */}
        //                 <div className="flex items-center gap-2">
        //                     <button
        //                         onClick={() => setVolume(prev => prev === 0 ? 1 : 0)}
        //                         className="text-white hover:text-gray-200"
        //                     >
        //                         {volume === 0 ? (
        //                             <VolumeX className="w-5 h-5" />
        //                         ) : (
        //                             <Volume2 className="w-5 h-5" />
        //                         )}
        //                     </button>
        //                     <input
        //                         type="range"
        //                         min="0"
        //                         max="1"
        //                         step="0.1"
        //                         value={volume}
        //                         onChange={handleVolumeChange}
        //                         className="w-24 accent-white"
        //                     />
        //                 </div>
        //             </div>
        //         </div>
        //     );
        // };
    
        // return (
        //     <div className="mb-8">
        //         <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
        //             <span>Moments</span>
        //             <div className="flex gap-2">
        //                 <button
        //                     className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
        //                     onClick={() => scrollRef.current?.scrollBy({ left: -128, behavior: 'smooth' })}
        //                     title="left"
        //                 >
        //                     <ChevronLeft className="w-4 h-4 text-gray-600" />
        //                 </button>
        //                 <button
        //                     className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
        //                     onClick={() => scrollRef.current?.scrollBy({ left: 128, behavior: 'smooth' })}
        //                     title="right"
        //                 >
        //                     <ChevronRight className="w-4 h-4 text-gray-600" />
        //                 </button>
        //             </div>
        //         </h2>
    
        //         <div className="relative">
        //             <div
        //                 ref={scrollRef}
        //                 className="moments-scroll flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-14"
        //                 style={{ WebkitOverflowScrolling: 'touch' }}
        //                 onMouseDown={handleMouseDown}
        //                 onMouseLeave={handleMouseLeave}
        //                 onMouseUp={handleMouseUp}
        //                 onMouseMove={handleMouseMove}
        //             >
        //                 <div className="flex-shrink-0 w-32 aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden snap-start">
        //                     {!shortFile ? (
        //                         <>
        //                             <input
        //                                 type="file"
        //                                 accept="image/*,video/*"
        //                                 onChange={handleShortSelect}
        //                                 className="hidden"
        //                                 id="short-upload"
        //                             />
        //                             <label
        //                                 htmlFor="short-upload"
        //                                 className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50 transition-colors"
        //                             >
        //                                 <Plus className="w-8 h-8 text-gray-500" />
        //                                 <span className="text-sm text-gray-500 mt-2">Add Short</span>
        //                             </label>
        //                         </>
        //                     ) : (
        //                         <div className="relative w-full h-full">
        //                             {previewUrl && (
        //                                 <Image
        //                                     src={previewUrl}
        //                                     alt="Short preview"
        //                                     fill
        //                                     className="object-cover"
        //                                     loader={({ src }) => src}
        //                                     unoptimized={true}
        //                                 />
        //                             )}
        //                             <button
        //                                 onClick={handleUploadShort}
        //                                 className="absolute inset-0 bg-black bg-opacity-50 text-white flex flex-col items-center justify-center"
        //                                 disabled={isUploading}
        //                             >
        //                                 {isUploading ? (
        //                                     <span>Uploading...</span>
        //                                 ) : (
        //                                     <>
        //                                         <Upload className="w-8 h-8" />
        //                                         <span className="text-sm mt-2">Upload Short</span>
        //                                     </>
        //                                 )}
        //                             </button>
        //                         </div>
        //                     )}
        //                 </div>
    
        //                 {shorts.map((short) => (
        //                     <div key={short.id} className="flex-shrink-0 w-32 h-64 relative snap-start">
        //                         <div className="h-full rounded-lg overflow-hidden">
        //                             {short.typeUrl.includes('.mp4') ? (
        //                                 <VideoPlayer src={short.typeUrl} />
        //                             ) : (
        //                                 <Image
        //                                     src={short.typeUrl}
        //                                     alt="Short preview"
        //                                     fill
        //                                     className="object-cover rounded-lg"
        //                                     loader={({ src }) => src}
        //                                     unoptimized={true}
        //                                 />
        //                             )}
        //                         </div>
    
        //                         <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-lg">
        //                             {short.profileImage ? (
        //                                 <Image
        //                                     src={short.profileImage}
        //                                     alt="Uploader's Profile"
        //                                     width={48}
        //                                     height={48}
        //                                     className="w-full h-full object-cover"
        //                                     loader={({ src }) => src}
        //                                     unoptimized={true}
        //                                 />
        //                             ) : (
        //                                 <div className="w-full h-full bg-gray-200" />
        //                             )}
        //                         </div>
    
        //                         <div className="absolute -bottom-14 left-0 right-0 text-center">
        //                             <span className="text-sm font-medium text-gray-800">@{short.userName}</span>
        //                         </div>
        //                     </div>
        //                 ))}
        //             </div>
        //         </div>
        //     </div>
        // );

        // ENDS HERE

    return (
        <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
                <span>Moments</span>
                <div className="flex gap-2">
                    <button 
                        className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
                        onClick={() => scrollRef.current?.scrollBy({ left: -128, behavior: 'smooth' })}
                        title="left"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                        className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
                        onClick={() => scrollRef.current?.scrollBy({ left: 128, behavior: 'smooth' })}
                        title="right"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </h2>
    
            <div className="relative">
                <div 
                    ref={scrollRef}
                    className="moments-scroll flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-14"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <div className="flex-shrink-0 w-32 aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden snap-start">
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
                                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50 transition-colors"
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
    
                    {shorts.map((short) => (
                        <div key={short.id} className="flex-shrink-0 w-32 h-64 relative snap-start">
                            <div className="h-full rounded-lg overflow-hidden">
                                {short.typeUrl.includes('.mp4') ? (
                                    <video
                                        src={short.typeUrl}
                                        className="w-full h-full object-cover rounded-lg"
                                        controls
                                        preload="metadata"
                                        onClick={(e) => {
                                            const video = e.target as HTMLVideoElement;
                                            if (video.paused) {
                                                video.play();
                                            } else {
                                                video.pause();
                                            }
                                        }}
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
    
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-lg">
                                {short.profileImage ? (
                                    <Image
                                        src={short.profileImage}
                                        alt="Uploader's Profile"
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                        loader={({ src }) => src}
                                        unoptimized={true}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200" />
                                )}
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