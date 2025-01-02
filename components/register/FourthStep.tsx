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
    verificationMessage: string;
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
    cityError: string;
    setPostalCode: Dispatch<SetStateAction<string>>;
    postalCodeError: string;
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
        <div className="step-4 flex flex-col text-white items-center border-none bg-black bg-opacity-[50%] px-5 py-4 font-bold sm:border-x-2 lg:px-0 min-h-screen">
            <div className="relative w-full px-4 mb-4 mt-2">
                <div className="w-full bg-gray-300 h-4 rounded-full">
                    <div
                        className="bg-greenTheme h-full relative rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                    >
                        <Image
                            src={transparentLogo}
                            alt="Logo"
                            className="absolute top-1 right-0 transform translate-x-1/2 -translate-y-1/2"
                            width={40}
                            height={40}
                        />
                    </div>
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">Welcome to Ourlime</h1>
			<h2 className="text-xl text-center mb-16">What are your interests? (Select at least 2)</h2>
            {errorMessage && (
                <div className="text-red-500 mb-4">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full max-w-6xl">
                <div className="grid grid-cols-2 gap-2 lg:gap-4 mt-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {interests.map(({ name, icon }) => (
                        <div key={name}>
                            {selectedInterests.includes(name) ? (
                                <Button
                                    className="bg-greenTheme text-white lg:w-40 lg:h-12 flex items-center justify-center gap-2 relative ring-2 ring-white"
                                    onClick={() => toggleInterest(name)}
                                >
                                    {getIcon(icon)}
                                    <span>{name}</span>
                                    <div className="absolute top-1 right-1">
                                        <Check size={16} className="text-white" />
                                    </div>
                                </Button>
                            ) : (
                                <Button
                                    className="bg-greenTheme text-white lg:w-40 lg:h-12 flex items-center justify-center gap-2 relative"
                                    onClick={() => toggleInterest(name)}
                                >
                                    {getIcon(icon)}
                                    <span>{name}</span>
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex w-full justify-center gap-8 mt-16">
                    <Button 
                        onClick={() => setStep(3)} 
                        className="bg-white text-green-600 w-1/4"
                    >
                        Previous Step
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        className="bg-greenTheme w-1/4 text-white"
                    >
                        Confirm
                    </Button>
                </div>
            </form>
        </div>
    );
}
