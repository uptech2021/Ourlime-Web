'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, DatePicker, Select, SelectItem } from '@nextui-org/react';
import styles from "./register.module.css"

type ThirdStepProps = {
	verificationMessage: string;
	setStep: Dispatch<SetStateAction<number>>;
	setFirstName: Dispatch<SetStateAction<string>>;
	setLastName: Dispatch<SetStateAction<string>>;
	setCountry: Dispatch<SetStateAction<string>>;
	setGender: Dispatch<SetStateAction<string>>;
	setBirthday: Dispatch<SetStateAction<string>>;
	isStepValid: boolean;
	validateStep: () => boolean;
	handleSubmit: (e: React.FormEvent) => void;
	firstNameError: string;
	lastNameError: string;
	countryError: string;
	genderError: string;
	birthdayError: string;
	error: string;
};

const ThirdStep: React.FC<ThirdStepProps> = ({
	verificationMessage,
	setStep,
	setFirstName,
	setLastName,
	setCountry,
	setGender,
	setBirthday,
	isStepValid,
	validateStep,
	handleSubmit,
	firstNameError,
	lastNameError,
	countryError,
	genderError,
	birthdayError,
	error
}) => {
	const [attemptedNextStep, setAttemptedNextStep] = useState(false);

	useEffect(() => {
		validateStep();
	}, [
		setFirstName,
		setLastName,
		setCountry,
		setGender,
		setBirthday,
		validateStep,
	]);

	useEffect(() => {
		const monthElement = document.querySelector(
			'[data-type="month"]'
		) as HTMLElement;
		const dayElement = document.querySelector(
			'[data-type="day"]'
		) as HTMLElement;
		const yearElement = document.querySelector(
			'[data-type="year"]'
		) as HTMLElement;

		if (monthElement) {
			monthElement.style.color = 'white';
		}
		if (dayElement) {
			dayElement.style.color = 'white';
		}
		if (yearElement) {
			yearElement.style.color = 'white';
		}
	}, []);

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setAttemptedNextStep(true);
		console.log('submitted');
		if (isStepValid) {
			handleSubmit(e);
			console.log('validated');
		}
	};

	return (
		<div className="step-3 mx-auto">
			<h1 className="text-2xl font-bold text-white">
				Let the community know about you
			</h1>
			{error && <p className="text-red-500">{error}</p>}
			{attemptedNextStep && !isStepValid && (
				<h2 className="text-bold text-bold mt-1 text-left text-red-500">
					Oops, you forgot to input some data {`:'(`}
				</h2>
			)}
			{verificationMessage && (
				<p className="text-bold mt-4 text-left text-red-500">
					{verificationMessage}
				</p>
			)}
			<form onSubmit={handleFormSubmit} className="mt-4 flex flex-col gap-4">
				<input
					type="text"
					className="w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500"
					placeholder="First Name"
					onChange={(e) => setFirstName(e.target.value)}
				/>
				{attemptedNextStep && firstNameError && (
					<p className="text-bold mt-1 text-left text-red-500">
						{firstNameError}
					</p>
				)}
				<input
					type="text"
					className="w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500"
					placeholder="Last Name"
					onChange={(e) => setLastName(e.target.value)}
				/>
				{attemptedNextStep && lastNameError && (
					<p className="text-bold mt-1 text-left text-red-500">
						{lastNameError}
					</p>
				)}
				<input
					type="text"
					className="w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500"
					placeholder="Country"
					onChange={(e) => setCountry(e.target.value)}
				/>
				{attemptedNextStep && countryError && (
					<p className="text-bold mt-1 text-left text-red-500">
						{countryError}
					</p>
				)}
				<Select
					placeholder="Gender"
					onChange={(e) => setGender(e.target.value)}
					className={`${styles.nextuiInput}  white-text-select w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500`}
				>
					<SelectItem className="greenForm" key="male" value="male">
						Male
					</SelectItem>
					<SelectItem className="greenForm" key="female" value="female">
						Female
					</SelectItem>
					<SelectItem className="greenForm" key="other" value="other">
						Other
					</SelectItem>
				</Select>
				{attemptedNextStep && genderError && (
					<p className="text-bold mt-1 text-left text-red-500">{genderError}</p>
				)}
				<DatePicker
					onChange={(date) => setBirthday(date.toString())}
					className={`${styles.nextuiInput} w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500`}
				/>
				{attemptedNextStep && birthdayError && (
					<p className="text-bold mt-1 text-left text-red-500">
						{birthdayError}
					</p>
				)}
				<div className="flex w-full flex-col gap-1 md:flex-row md:px-20">
					<Button
						onClick={() => setStep(2)}
						type="button"
						className="submit my-4 w-full rounded-full bg-white px-4 py-2 text-greenTheme hover:bg-gray-300"
					>
						Previous Step
					</Button>
					<Button
						type="submit"
						className="submit my-4 w-full rounded-full bg-greenTheme px-4 py-2 text-white hover:bg-green-600"
					>
						Register!
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ThirdStep;
