'use client';
import { Button } from '@nextui-org/react';
import React, { useState, useRef } from 'react';

export default function Avatar() {
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [avatarImage, setAvatarImage] = useState(null);
    const backgroundInputRef = useRef(null);
    const avatarInputRef = useRef(null);
    const isButtonDisabled = !backgroundImage && !avatarImage;


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
    const handleSave = () => {

        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
    };


    return (
        <>
            <main className="flex flex-col text-center bg-gray-200 min-h-screen">
                <h1 className="text-ml mb-8 mt-10 mx-auto text-gray-800 font-bold text-left" >Avatar & Cover Settings</h1>
                <div className='bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] lg:w-[60%] h-[22rem]'>
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
                            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        {(!avatarImage && !backgroundImage) && (
                            <p className="mt-4 text-gray-800 text-ml">Add New</p>
                        )}
                    </section>


                    <button
                        className="w-20 lg:w-24 h-20 lg:h-24 rounded-full bg-gray-200 border-2 border-t border-white -translate-y-1/2 translate-x-1/2"
                        onClick={handleAvatarClick}
                        style={{
                            backgroundImage: avatarImage ? `url(${avatarImage})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Button
                        className={`mt-4 w-20 lg:w-24 h-8 translate-y-1/3 -translate-x-1/2 ${isButtonDisabled ? 'bg-none cursor-not-allowed' : ''}`}
                        disabled={isButtonDisabled}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </div>
            </main>
        </>
    );
}
