'use client';
import { Button } from '@nextui-org/react';
import { Dispatch, SetStateAction, useRef, useState, RefObject } from 'react';

type SixthStepProps = {
    setStep: Dispatch<SetStateAction<number>>;
    idFaceRef: RefObject<HTMLInputElement>;
    idFrontRef: RefObject<HTMLInputElement>;
    idBackRef: RefObject<HTMLInputElement>;
    handleSubmit: (e: React.FormEvent) => void;
    isStepValid: boolean;
    validationError: string;
    successMessage: string;
    faceFileName: string | null;
    frontFileName: string | null;
    backFileName: string | null;
    setFaceFileName: Dispatch<SetStateAction<string | null>>;
    setFrontFileName: Dispatch<SetStateAction<string | null>>;
    setBackFileName: Dispatch<SetStateAction<string | null>>;
};

export default function SixthStep({ 
    setStep, 
    idFaceRef, 
    idFrontRef, 
    idBackRef,
    handleSubmit, 
    isStepValid, 
    validationError, 
    successMessage,
    faceFileName,
    frontFileName,
    backFileName,
    setFaceFileName,
    setFrontFileName,
    setBackFileName,
    }: SixthStepProps) {
        
    // Separate error states for each file
    const [faceFileError, setFaceFileError] = useState<string>('');
    const [frontFileError, setFrontFileError] = useState<string>('');
    const [backFileError, setBackFileError] = useState<string>('');

    const handleUpload = (index: number) => {
        switch(index) {
            case 1:
                idFaceRef.current?.click();
                break;
            case 2:
                idFrontRef.current?.click();
                break;
            case 3:
                idBackRef.current?.click();
                break;
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
        const file = e.target.files?.[0]; // Get the file object from the file's array
        if (file) {
            switch (fileType) {
                case 'face':
                    setFaceFileName(file.name); 
                    setFaceFileError(''); 
                    break;
                case 'front':
                    setFrontFileName(file.name); 
                    setFrontFileError(''); 
                    break;
                case 'back':
                    setBackFileName(file.name);
                    setBackFileError(''); 
                    break;
                default:
                    break;
            }
        } else {
            // If no file is selected, set the error message
            switch (fileType) {
                case 'face':
                    setFaceFileError('Please upload a photo of yourself holding your ID next to your face.');
                    break;
                case 'front':
                    setFrontFileError('Please upload a photo of the front of your ID.');
                    break;
                case 'back':
                    setBackFileError('Please upload a photo of the back of your ID.');
                    break;
                default:
                    break;
            }
        }
    };


    const validateFiles = () => {
        let formValid = true; // Initialize formValid
        // Reset error messages
        setFaceFileError('');
        setFrontFileError('');
        setBackFileError('');
        console.log(`Face file name: ${faceFileName}`);
        console.log(`Front file name: ${frontFileName}`);
        console.log(`Back file name: ${backFileName}`);
        if (!faceFileName) {
            setFaceFileError('Please upload a photo of yourself holding your ID next to your face.');
            formValid = false;
        }
        if (!frontFileName) {
            setFrontFileError('Please upload a photo of the front of your ID.');
            formValid = false;
        }
        if (!backFileName) {
            setBackFileError('Please upload a photo of the back of your ID.');
            formValid = false;
        }

        return formValid; 
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        if (validateFiles()) { 
            handleSubmit(e); 
         } 
        //else {
        //     console.log(`Face file name: ${faceFileName}`);
        //     console.log(`Front file name: ${frontFileName}`);
        //     console.log(`Back file name: ${backFileName}`);
        // }
    };

    return (
        <div className="step-4 flex flex-col text-white items-center border-none bg-black bg-opacity-[50%] px-5 py-4 font-bold text-white sm:border-x-2 lg:px-0 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center text-white">Welcome to Ourlime</h1>
            <p className="text-center mb-6 text-white">
                Please upload the required photos for verification:
            </p>
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <form onSubmit={handleFormSubmit} className="flex flex-col w-full max-w-md space-y-4">
                <div className="flex flex-col rounded-md p-4">
                    <label className="mb-2 text-white">1.) Please upload a photo of yourself holding your ID next to your face:</label>
                    <input
                        type="file"
                        ref={idFaceRef}
                        onChange={(e) => handleFileChange(e, 'face')}
                        className="hidden"
                        accept="image/*"
                        aria-label="Upload photo of yourself holding your ID next to your face"
                        title="Upload photo of yourself holding your ID next to your face"
                    />
                    <input
                        type="text"
                        value={faceFileName}
                        readOnly
                        className="p-2 border border-gray-300 rounded text-green-500"
                        placeholder="No file chosen"
                    />
                    {faceFileError && <p className="text-red-500">{faceFileError}</p>}
                    <div className="flex flex-col items-center mt-2">
                        <Button onClick={() => handleUpload(1)} className="bg-greenTheme text-white rounded-full w-8 h-8 flex items-center justify-center">
                            +
                        </Button>
                        <span className="text-white text-sm mt-1">Upload</span>
                    </div>
                </div>
                <div className="flex flex-col rounded-md p-4">
                    <label className="mb-2 text-white">2.) Please upload a photo of the front of your ID:</label>
                    <input
                        type="file"
                        ref={idFrontRef}
                        onChange={(e) => handleFileChange(e, 'front')}
                        className="hidden"
                        accept="image/*"
                        aria-label="Upload photo of the front of your ID"
                        title="Upload photo of the front of your ID"
                    />
                    <input
                        type="text"
                        value={frontFileName}
                        readOnly
                        className="p-2 border border-gray-300 rounded text-green-500"
                        placeholder="No file chosen"
                    />
                    {frontFileError && <p className="text-red-500">{frontFileError}</p>}
                    <div className="flex flex-col items-center mt-2">
                        <Button onClick={() => handleUpload(2)} className="bg-greenTheme text-white rounded-full w-8 h-8 flex items-center justify-center">
                            +
                        </Button>
                        <span className="text-white text-sm mt-1">Upload</span>
                    </div>
                </div>
                <div className="flex flex-col rounded-md p-4">
                    <label className="mb-2 text-white">3.) Please upload a photo of the back of your ID:</label>
                    <input
                        type="file"
                        ref={idBackRef}
                        onChange={(e) => handleFileChange(e, 'back')}
                        className="hidden"
                        accept="image/*"
                        aria-label="Upload photo of the back of your ID"
                        title="Upload photo of the back of your ID"
                    />
                    <input
                        type="text"
                        value={backFileName}
                        readOnly
                        className="p-2 border border-gray-300 rounded text-green-500"
                        placeholder="No file chosen"
                    />
                    {backFileError && <p className="text-red-500">{backFileError}</p>}
                    <div className="flex flex-col items-center mt-2">
                        <Button onClick={() => handleUpload(3)} className="bg-greenTheme text-white rounded-full w-8 h-8 flex items-center justify-center">
                            +
                        </Button>
                        <span className="text-white text-sm mt-1">Upload</span>
                    </div>
                </div>
                <div className="flex space-x-4 mt-6">
                    <Button type="submit" className="px-4 py-2 bg-greenTheme text-white rounded-full hover:bg-green-600">
                        Confirm
                    </Button>
                    <Button onClick={() => setStep(4)} type="button" className="px-4 py-2 bg-white text-greenTheme rounded-full hover:bg-gray-200">
                        Previous Step
                    </Button>
                </div>
            </form>
        </div>
    );
}