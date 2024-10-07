'use client';
import SettingsSidebar from '@/components/settings/nav/page';
import { Button } from '@nextui-org/react';
import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '@/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { ResizeListener } from '@/helpers/Resize';
import { useRouter } from 'next/navigation';
import { loginRedirect } from '@/helpers/Auth';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { getDoc } from 'firebase/firestore';

export default function Avatar() {
    const router = useRouter();
    const [, setIsPc] = useState<boolean>(false);
    const user = auth;
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [avatarImage, setAvatarImage] = useState(null);
    const backgroundInputRef = useRef(null);
    const avatarInputRef = useRef(null);
    const isButtonDisabled = !backgroundImage && !avatarImage;
    const [dbBackgroundImage, setDbBackgroundImage] = useState(null);
    const [dbAvatarImage, setDbAvatarImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);



    const handleBackgroundClick = () => {
        if (backgroundInputRef.current) {
            (backgroundInputRef.current as HTMLInputElement).click();
        }
    };


    const handleAvatarClick = () => {

        if (avatarInputRef.current) {
            (avatarInputRef.current as HTMLInputElement).click();
        }
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && typeof e.target.result === 'string') {
                    setImage(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const handleSave = async () => {
        setIsLoading(true);
        const user = auth.currentUser;
        if (user) {
            try {
                const storage = getStorage();
                const profileRef = doc(db, 'profiles', user.uid);
                const updates: { banner?: string, avatar?: string } = {};

                if (backgroundImage) {
                    const bannerRef = ref(storage, `images/${user.uid}_banner.jpg`);
                    await uploadString(bannerRef, backgroundImage, 'data_url');
                    const bannerUrl = await getDownloadURL(bannerRef);
                    updates.banner = bannerUrl;
                }

                if (avatarImage) {
                    const avatarRef = ref(storage, `images/${user.uid}_avatar.jpg`);
                    await uploadString(avatarRef, avatarImage, 'data_url');
                    const avatarUrl = await getDownloadURL(avatarRef);
                    updates.avatar = avatarUrl;
                }

                await updateDoc(profileRef, updates);

                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 3000);
            } catch (error) {
                console.error("Error updating profile: ", error);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const fetchImages = async () => {
            const user = auth.currentUser;
            if (user) {
                const profileRef = doc(db, 'profiles', user.uid);
                const docSnap = await getDoc(profileRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.banner) setDbBackgroundImage(data.banner);
                    if (data.avatar) setDbAvatarImage(data.avatar);
                }
            }
        };

        fetchImages();
    }, []);


    useEffect(() => {
        loginRedirect(router)
        const cleanup = ResizeListener(setIsPc)
        return () => cleanup()
    }, [router])

    if (!user.currentUser) return <></>

    else return (
        <>
            <div className='flex flex-row bg-gray-200 min-h-screen'>
                <SettingsSidebar />

                <main className="flex flex-col  text-center  mx-auto">

                    <div className="text-gray-600 bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] md:w-[40rem] mt-8">
                        <h1 className="text-ml mb-8 mt-10 mx-auto text-gray-800 font-bold text-left" >Avatar & Cover Settings</h1>
                        {showSuccessMessage && (
                            <div className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
                                Avatar saved successfully!
                            </div>
                        )}
                        <input
                            type="file"
                            ref={backgroundInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileChange(e, setBackgroundImage as React.Dispatch<React.SetStateAction<string | null>>)}
                            accept="image/*"
                        />
                        <input
                            type="file"
                            ref={avatarInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileChange(e, setAvatarImage as React.Dispatch<React.SetStateAction<string | null>>)}
                            accept="image/*"
                        />
                        <section
                            className="bg-gray-200 p-4 rounded-lg mx-auto w-full h-[11rem]"
                            onClick={handleBackgroundClick}
                            style={{
                                backgroundImage: backgroundImage ? `url(${backgroundImage})` : dbBackgroundImage ? `url(${dbBackgroundImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            {(!avatarImage && !backgroundImage && !dbBackgroundImage && !dbAvatarImage) && (
                                <p className="mt-4 text-gray-800 text-ml">Add New</p>
                            )}
                        </section>

                        <button
                            className="w-20 lg:w-24 h-20 lg:h-24 rounded-full bg-gray-200 border-2 border-t border-white -translate-y-1/2 translate-x-1/2"
                            onClick={handleAvatarClick}
                            style={{
                                backgroundImage: avatarImage ? `url(${avatarImage})` : dbAvatarImage ? `url(${dbAvatarImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />

                        <Button
                            className={`mt-4 w-20 lg:w-24 h-8 translate-y-1/3 -translate-x-1/2 ${!isButtonDisabled ? 'bg-green-500' : 'bg-gray-300'}`}
                            disabled={isButtonDisabled || isLoading}
                            onClick={handleSave}
                        >
                            {isLoading ? 'Loading...' : 'Save'}
                        </Button>


                    </div>
                </main>
            </div>
        </>
    );
}
