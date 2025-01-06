'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Select, SelectItem } from '@nextui-org/react';
import styles from "./register.module.css";
import { countries } from 'countries-list';
import PhoneInput from 'react-phone-number-input';
import transparentLogo from 'public/images/transparentLogo.png';
import Image from 'next/image';
import { isValidPhoneNumber } from 'react-phone-number-input';

type ThirdStepProps = {
	setStep: Dispatch<SetStateAction<number>>;
	setCountry: Dispatch<SetStateAction<string>>;
	setPhone: Dispatch<SetStateAction<string>>;
	phoneError?: string;
	isStepValid: boolean;
	validateStep: () => boolean;
	countryError: string;
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
const totalSteps = 5;
const currentStep = 3;
const progressPercentage = (currentStep / totalSteps) * 100;
const ThirdStep: React.FC<ThirdStepProps> = ({
	setStep,
	setCountry,
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
	// const [attemptedNextStep, setAttemptedNextStep] = useState(false);

	useEffect(() => {
		validateStep();
	}, [setCountry, validateStep]);

	const countryList = Object.entries(countries).map(([code, country]) => ({
		code,
		name: country.name,
	}));

	const handleNextStep = (e: React.MouseEvent) => {
		e.preventDefault();
		const isValid = validateStep();
		if (isValid) {
			setStep(4);
		}
	};

	const handlePhoneChange = (value: string | undefined) => {
		setPhone(value ?? '');
	};

	return (
		<div className="step-3 mx-auto border-none bg-black bg-opacity-[50%] px-5 py-4 h-screen lg:w-5/6 ">
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
			<h1 className="text-2xl font-bold text-white text-center">
				Let the community know about you
			</h1>
			<div className='w-3/4 mx-auto'>
			<form className="mt-4 flex flex-col gap-4">
			<div className='flex flex-col gap-4 md:flex-row md:gap-10'>
			<div className="w-full md:w-1/2 ">
			<div className="relative">
			<input
					type="text"
					className="w-full rounded-md border border-none border-gray-300 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
					placeholder="City (Optional)"
					onChange={(e) => setCity(e.target.value)}
				/>
				</div>
				</div>
				<div className="w-full md:w-1/2 ">
				<div className="relative">
				<input
					type="text"
					className="w-full rounded-md border border-none border-gray-300 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
					placeholder="Region (Optional)"
					onChange={(e) => setAddress(e.target.value)}
				/>
				
				</div>
				</div>
				</div>
				<Select
					placeholder="Country"
					onChange={(e) => setCountry(e.target.value)}
					className={`${styles.nextuiInput} w-full rounded-md border border-none border-gray-300 bg-white text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500`}
					classNames={{
						base: "text-black",
						trigger: "text-black",
						value: "text-black"
					}}
					required
				>
					{countryList.map((country) => (
						<SelectItem key={country.code} value={country.name}>
							{country.name}
						</SelectItem>
					))}
				</Select>
				{countryError && (
					<p className="text-bold mt-1 text-left text-red-500">
						{countryError}
					</p>
				)}
				<input
					type="text"
					className="w-full rounded-md border border-none border-gray-300 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
					placeholder="Address (Optional)"
					onChange={(e) => setAddress(e.target.value)}
				/>
					<PhoneInput
						value={phone}
						className="phone"
						defaultCountry="TT"
						onChange={handlePhoneChange}
						inputClass="w-full border-none text-black placeholder-black focus:outline-none"
						autoComplete="off"
						required
						placeholder="Enter your phone number (e.g., (800) 784-8819)"
					/>
				{phoneError && (
					<p className="text-bold mt-1 text-left text-red-500">{phoneError}</p>
				)}
				
				<div className='flex flex-col gap-4 md:flex-row md:gap-10'>
			<div className="w-full md:w-1/2 ">
			<div className="relative">
				<input
					type="text"
					className="w-full rounded-md border border-none border-gray-300 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
					placeholder="Zip Code (Optional)"
					onChange={(e) => setZipCode(e.target.value)}
				/>
				</div>	
				</div>
				
			<div className="w-full md:w-1/2 ">
			<div className="relative">
				<input
					type="text"
					className="w-full rounded-md border border-none border-gray-300 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
					placeholder="Postal Code (Optional)"
					onChange={(e) => setPostalCode(e.target.value)}
				/>
				</div>
				</div>
				</div>
				<div className="flex w-full flex-col gap-1 md:gap-12 md:flex-row md:px-20">
					<Button
						onClick={() => setStep(2)}
						type="button"
						className="submit my-4 w-full rounded-full bg-white px-4 py-2 text-greenTheme hover:bg-gray-300"
					>
						Previous Step
					</Button>
					<Button
						onClick={handleNextStep}
						type="button"
						className="submit my-4 w-full rounded-full bg-greenTheme px-4 py-2 text-white hover:bg-green-600"
						>
						Confirm
					</Button>
				</div>
			</form>
			</div>
		</div>
	);
};

export default ThirdStep;
