'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { Car, ShoppingCart, Smartphone, Gamepad, Trees, Newspaper, Music, ChefHat, Briefcase, Church, Dumbbell, Film, TestTube, Book, Dog } from 'lucide-react';
import styles from "./register.module.css";

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
};

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
	{ name: "Education", icon: "Book" },
	{ name: "Animals", icon: "Paw" },
];

const FourthStep: React.FC<FourthStepProps> = ({
	verificationMessage,
	setStep,
	setCountry,
	setBirthday,
	isStepValid,
	validateStep,
	countryError,
	setPhone,
	phoneError,
	phone,
	error,
	setCity,
	cityError,
	setPostalCode,
	postalCodeError,
	setAddress,
	AddressError,
	setZipCode,
	zipCodeError,
}) => {
	const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

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
			alert("Please select at least 5 interests.");
		} else {
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
		};
		return icons[iconName as keyof typeof icons];
	};

	return (
		<div className="step-4 flex flex-col justify-center items-center">
			<h1 className="text-3xl font-bold text-green-600">Welcome to Ourlime</h1>
			<h2 className="text-xl text-center">What are your interests? (Choose 5)</h2>
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-2 gap-4 mt-4 lg:grid-cols-5">
					{interests.map(({ name, icon }) => (
						<Button
							key={name}
							className={`bg-green-500 text-white lg:w-32 lg:h-12 ${selectedInterests.includes(name) ? 'ring-2 ring-white' : ''}`}
							onClick={() => toggleInterest(name)}
						>
							{getIcon(icon)}
							{name}
						</Button>
					))}
				</div>
				<div className="flex w-full justify-between mt-6">
					<Button onClick={() => setStep(2)} className="bg-white text-green-600">Previous Step</Button>
					<Button type="submit" className="bg-green-600 text-white">Confirm</Button>
				</div>
			</form>
		</div>
	);
};

export default FourthStep;
