'use client';
import { Button } from '@nextui-org/react';
import { Dispatch, SetStateAction, useState, useRef } from 'react';

type FifthStepProps = {
    setStep: Dispatch<SetStateAction<number>>;
};

export default function FifthStep({ setStep }: FifthStepProps) {
    const [photo1Name, setPhoto1Name] = useState('');
    const [photo2Name, setPhoto2Name] = useState('');
    const [photo3Name, setPhoto3Name] = useState('');
    
    const fileInput1Ref = useRef<HTMLInputElement>(null);
    const fileInput2Ref = useRef<HTMLInputElement>(null);
    const fileInput3Ref = useRef<HTMLInputElement>(null);

    const handleUpload = (index: number) => {
        switch(index) {
            case 1:
                fileInput1Ref.current?.click();
                break;
            case 2:
                fileInput2Ref.current?.click();
                break;
            case 3:
                fileInput3Ref.current?.click();
                break;
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file) {
            switch(index) {
                case 1:
                    setPhoto1Name(file.name);
                    break;
                case 2:
                    setPhoto2Name(file.name);
                    break;
                case 3:
                    setPhoto3Name(file.name);
                    break;
            }
        }
    };

    return (
        <div className="step-4 flex flex-col  text-white items-center border-none bg-black bg-opacity-[50%] px-5 py-4 font-bold text-white sm:border-x-2 lg:px-0 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-center text-white">Welcome to Ourlime</h1>
            <p className="text-center mb-6 text-white">
                Please upload the required photos for verification:
            </p>
            <div className="flex flex-col w-full max-w-md space-y-4">
                <div className="flex items-center rounded-md p-4">
                    <input
                        type="file"
                        ref={fileInput1Ref}
                        onChange={(e) => handleFileChange(e, 1)}
                        className="hidden"
                        accept="image/*"
                        aria-label="Upload photo of yourself holding your ID next to your face"
                    />
                    <input
                        type="text"
                        value={photo1Name}
                        placeholder="1.) Please upload a photo of yourself holding your ID next to your face"
                        className="flex-1 bg-white text-black px-4 py-2 rounded-md mr-2"
                        readOnly
                    />
                    <Button onClick={() => handleUpload(1)} className="ml-4 bg-greenTheme text-white rounded-full">
                        +
                    </Button>
                </div>
                <div className="flex items-center rounded-md p-4">
                    <input
                        type="file"
                        ref={fileInput2Ref}
                        onChange={(e) => handleFileChange(e, 2)}
                        className="hidden"
                        accept="image/*"
                        aria-label="Upload photo of the front of your ID"
                    />
                    <input
                        type="text"
                        value={photo2Name}
                        placeholder="2.) Please upload a photo of the front of your ID"
                        className="flex-1 bg-white text-black px-4 py-2 rounded-md mr-2"
                        readOnly
                    />
                    <Button onClick={() => handleUpload(2)} className="ml-4 bg-greenTheme text-white rounded-full">
                        +
                    </Button>
                </div>
                <div className="flex items-center rounded-md p-4">
                    <input
                        type="file"
                        ref={fileInput3Ref}
                        onChange={(e) => handleFileChange(e, 3)}
                        className="hidden"
                        accept="image/*"
                        aria-label="Upload photo of the back of your ID"
                    />
                    <input
                        type="text"
                        value={photo3Name}
                        placeholder="3.) Please upload a photo of the back of your ID"
                        className="flex-1 bg-white text-black px-4 py-2 rounded-md mr-2"
                        readOnly
                    />
                    <Button onClick={() => handleUpload(3)} className="ml-4 bg-greenTheme text-white rounded-full">
                        +
                    </Button>
                </div>
            </div>
            <p className="mt-6 text-center text-white">
                Your information is in safe hands, all data is private!
            </p>
            <div className="flex space-x-4 mt-6">
                <Button onClick={() => setStep(5)} className="px-4 py-2 bg-white text-greenTheme rounded-full hover:bg-gray-200">
                    Previous Step
                </Button>
                <Button onClick={() => setStep(7)} className="px-4 py-2 bg-greenTheme text-white rounded-full hover:bg-green-600">
                    Confirm
                </Button>
            </div>
        </div>
    );
}