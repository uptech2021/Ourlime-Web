'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from '@nextui-org/react';
import {
    Car, ShoppingCart, Laptop, Gamepad, Trees, Newspaper,
    Music, ChefHat, Briefcase, Church, Dumbbell, Film, TestTube,
    Book, Dog, Globe, BookOpen, Plane, Heart, GraduationCap,
    Sword, Tv, Check
} from 'lucide-react';
import transparentLogo from 'public/images/transparentLogo.png';
import Image from 'next/image';

type FourthStepProps = {
    setStep: Dispatch<SetStateAction<number>>;
    setCountry: Dispatch<SetStateAction<string>>;
    setBirthday: Dispatch<SetStateAction<string>>;
    setPhone: Dispatch<SetStateAction<string>>;
    phoneError?: string;
    isStepValid: boolean;
    validateStep: () => boolean;
    handleSubmit: (e: React.FormEvent) => void;
    countryError: string;
    birthdayError: string;
    error: string;
    setCity: Dispatch<SetStateAction<string>>;
    setPostalCode: Dispatch<SetStateAction<string>>;
    setAddress: Dispatch<SetStateAction<string>>;
    AddressError: string;
    phone?: string;
    setZipCode: Dispatch<SetStateAction<string>>;
    zipCodeError: string;
    selectedInterests: string[];
    setSelectedInterests: Dispatch<SetStateAction<string[]>>;
};

export default function FourthStep({
    selectedInterests,
    setSelectedInterests,
    setStep
}: FourthStepProps) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const interests = [
        { name: "Vehicles", icon: "Car" },
        { name: "Fashion", icon: "ShoppingCart" },
        { name: "Technology", icon: "Laptop" },
        { name: "Videogames", icon: "Gamepad" },
        { name: "Sports", icon: "Dumbbell" },
        { name: "Nature", icon: "Trees" },
        { name: "News", icon: "Newspaper" },
        { name: "Music", icon: "Music" },
        { name: "Cooking", icon: "ChefHat" },
        { name: "Business", icon: "Briefcase" },
        { name: "Religious", icon: "Church" },
        { name: "Fitness", icon: "Dumbbell" },
        { name: "Movies", icon: "Film" },
        { name: "Anime", icon: "Film" },
        { name: "Science", icon: "TestTube" },
        { name: "Animals", icon: "Dog" },
        { name: "Politics", icon: "Globe" },
        { name: "History", icon: "BookOpen" },
        { name: "Travel", icon: "Plane" },
        { name: "Reading", icon: "Book" },
        { name: "Health", icon: "Heart" },
        { name: "Education", icon: "GraduationCap" },
        { name: "Martial Arts", icon: "Sword" },
        { name: "TV Show", icon: "Tv" },
        { name: "Work", icon: "Briefcase" }
    ];

    const totalSteps = 5;
    const currentStep = 4;
    const progressPercentage = (currentStep / totalSteps) * 100;

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedInterests.length < 2) {
            setErrorMessage("Please select at least 2 interests to continue");
            setTimeout(() => setErrorMessage(null), 3000);
        } else {
            setStep(5);
        }
    };

    const getIcon = (iconName: string) => {
        const iconSize = 24;
        const icons = {
            Car: <Car size={iconSize} />,
            ShoppingCart: <ShoppingCart size={iconSize} />,
            Laptop: <Laptop size={iconSize} />,
            Gamepad: <Gamepad size={iconSize} />,
            Trees: <Trees size={iconSize} />,
            Newspaper: <Newspaper size={iconSize} />,
            Music: <Music size={iconSize} />,
            ChefHat: <ChefHat size={iconSize} />,
            Briefcase: <Briefcase size={iconSize} />,
            Church: <Church size={iconSize} />,
            Dumbbell: <Dumbbell size={iconSize} />,
            Film: <Film size={iconSize} />,
            TestTube: <TestTube size={iconSize} />,
            Book: <Book size={iconSize} />,
            Dog: <Dog size={iconSize} />,
            Globe: <Globe size={iconSize} />,
            BookOpen: <BookOpen size={iconSize} />,
            Plane: <Plane size={iconSize} />,
            Heart: <Heart size={iconSize} />,
            GraduationCap: <GraduationCap size={iconSize} />,
            Sword: <Sword size={iconSize} />,
            Tv: <Tv size={iconSize} />
        };
        return icons[iconName as keyof typeof icons];
    };

    return (
        <div className="step-4 mt-5 flex flex-col justify-center relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-300">
                <div
                    className="h-full bg-greenTheme transition-all duration-700 ease-in-out relative progress-bar"
                    style={{ width: `${progressPercentage}%` }}
                >
                    <Image
                        src={transparentLogo}
                        alt="Logo"
                        className="absolute -top-2 right-0 transform translate-x-1/2"
                        width={20}
                        height={20}
                    />
                </div>
            </div>

            <div className="mx-auto w-full border-none bg-black bg-opacity-[50%] px-5 py-4">
                <h1 className="text-3xl font-bold text-white text-center mt-8">Welcome to Ourlime</h1>
                <h2 className="text-xl text-white text-center mb-16">What are your interests? (Select at least 2)</h2>
                {errorMessage && (
                    <div className="text-red-500 mb-4 text-center">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-11/12 mx-auto">
                    <div className="grid grid-cols-2 mt-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {interests.map(({ name, icon }) => (
                            <div key={name} className="m-2">
                                {selectedInterests.includes(name) ? (
                                    <Button
                                        className={`bg-greenTheme text-white lg:w-36 lg:h-12 flex items-center justify-center gap-2 relative ${selectedInterests.includes(name) ? 'ring-2 ring-white' : ''
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleInterest(name);
                                        }}
                                    >
                                        {getIcon(icon)}
                                        <span>{name}</span>
                                        {selectedInterests.includes(name) && (
                                            <div className="absolute top-1 right-1">
                                                <Check size={16} className="text-white" />
                                            </div>
                                        )}
                                    </Button>

                                ) : (
                                    <Button
                                        className="bg-greenTheme text-white w-full lg:w-36 lg:h-12 flex items-center justify-center gap-2 relative"
                                        onClick={() => toggleInterest(name)}
                                    >
                                        {getIcon(icon)}
                                        <span>{name}</span>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex w-full flex-col gap-1 md:gap-12 md:flex-row mt-16">
                        <Button
                            onClick={() => setStep(3)}
                            type="button"
                            className="submit my-4 w-full md:w-2/5 mx-auto rounded-full bg-white px-8 py-3 text-greenTheme hover:bg-gray-300 text-lg font-semibold"
                        >
                            Previous Step
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            type="button"
                            className="submit my-4 w-full md:w-2/5 mx-auto rounded-full bg-greenTheme px-8 py-3 text-white hover:bg-green-600 text-lg font-semibold"
                        >
                            Confirm
                        </Button>
                    </div>
                </form>

            </div>
        </div>
    );

}
