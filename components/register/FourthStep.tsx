'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { Car, ShoppingCart, Smartphone, Gamepad, Trees, Newspaper, Music, ChefHat, Briefcase, Church, Dumbbell, Film, TestTube, Book, Dog, Globe, BookOpen, Plane, Heart, GraduationCap, Sword, Tv } from 'lucide-react';
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


export default function FourthStep({verificationMessage, selectedInterests, setSelectedInterests, setStep}: FourthStepProps){
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const interests = [
		{ name: "Vehicles", icon: "Car" },
		{ name: "Fashion", icon: "ShoppingCart" },
		{ name: "Technology", icon: "Smartphone" },
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
		{ name: "Animals", icon: "Paw" },
		{ name: "Politics", icon: "Globe" },
		{ name: "History", icon: "BookOpen" },
		{ name: "Travel", icon: "Plane" },
		{ name: "Reading", icon: "Book" },
		{ name: "Health", icon: "Heart" },
		{ name: "Education", icon: "GraduationCap" },
		{ name: "Martial Arts", icon: "Sword" },
		{ name: "TV Show", icon: "Tv" },
		{ name: "Work", icon: "Briefcase" },
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
		if (selectedInterests.length < 5) {
			setErrorMessage("Please select at least 5 interests.");
		} else {
			setErrorMessage(null);
			// Handle form submission
		}
	};

	const getIcon = (iconName: string) => {
		const icons = {
			Car: <Car className="mr-2" />,
			ShoppingCart: <ShoppingCart className="mr-2" />,
			Smartphone: <Smartphone className="mr-2" />,
			Gamepad: <Gamepad className="mr-2" />,
			Trees: <Trees className="mr-2" />,
			Newspaper: <Newspaper className="mr-2" />,
			Music: <Music className="mr-2" />,
			ChefHat: <ChefHat className="mr-2" />,
			Briefcase: <Briefcase className="mr-2" />,
			Church: <Church className="mr-2" />,
			Dumbbell: <Dumbbell className="mr-2" />,
			Film: <Film className="mr-2" />,
			TestTube: <TestTube className="mr-2" />,
			Book: <Book className="mr-2" />,
			Paw: <Dog className="mr-2" />,
			Globe: <Globe className="mr-2" />,
			BookOpen: <BookOpen className="mr-2" />,
			Plane: <Plane className="mr-2" />,
			Heart: <Heart className="mr-2" />,
			GraduationCap: <GraduationCap className="mr-2" />,
			Sword: <Sword className="mr-2" />,
			Tv: <Tv className="mr-2" />,
		};
		return icons[iconName as keyof typeof icons];
	};

	return (
		<div className="step-4 flex flex-col  text-white items-center border-none bg-black bg-opacity-[50%] px-5 py-4 font-bold text-white sm:border-x-2 lg:px-0 min-h-screen">
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
			<h2 className="text-xl text-center mb-16">What are your interests? (Choose 5)</h2>
			{errorMessage && <p className="text-red-500">{errorMessage}</p>}
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-2 gap-4 lg:gap-8 mt-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
					{interests.map(({ name, icon }) => (
						<Button
							key={name}
							className={`bg-greenTheme text-white lg:w-32 lg:h-12 ${selectedInterests.includes(name) ? 'ring-2 ring-white' : ''}`}
							onClick={() => toggleInterest(name)}
						>
							{getIcon(icon)}
							{name}
						</Button>
					))}
				</div>
				<div className="flex w-full justify-center gap-8 mt-16">
					<Button onClick={() => setStep(3)} className="bg-white text-green-600 w-1/4">Previous Step</Button>
					<Button onClick={() => setStep(5)} type="submit" className="bg-greenTheme w-1/4 text-white">Confirm</Button>
				</div>
			</form>
		</div>
	);
};