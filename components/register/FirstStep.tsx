'use client';
// import { sendOtp } from '@/helpers/Auth';
import { Button, Checkbox, DatePicker, Select, SelectItem } from '@nextui-org/react';


import { useEffect, useState } from 'react';
import { db } from '@/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Dispatch, SetStateAction } from 'react';
import styles from "./register.module.css"
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';
import Link from 'next/link';
import transparentLogo from 'public/images/transparentLogo.png';
import Image from 'next/image';

// Function to check if a user exists
const checkUserExists = async (email: string, username: string) => {
	const usersRef = collection(db, 'users'); // Replace 'users' with your collection name

	const promises = [];

	if (email) {
		const emailQuery = query(usersRef, where('email', '==', email));
		promises.push(getDocs(emailQuery));
	}

	if (username) {
		const usernameQuery = query(usersRef, where('username', '==', username));
		promises.push(getDocs(usernameQuery));
	}

	const results = await Promise.all(promises);
	const exists = results.some(snapshot => !snapshot.empty);
	return exists;
};

type FirstStepProps = {
	setUserName: Dispatch<SetStateAction<string>>;
	userNameError: string;
	userExistsError: string;
	firstNameError: string;
	lastNameError: string;
	genderError: string;
	setEmail: Dispatch<SetStateAction<string>>;
	emailError: string;
	emailExistsError: string;
	setBirthday: Dispatch<SetStateAction<string>>;
	birthdayError: string;
	setPassword: Dispatch<SetStateAction<string>>;
	setConfirmPassword: Dispatch<SetStateAction<string>>;
	confirmPasswordError: string;
	setStep: Dispatch<SetStateAction<number>>;
	validateStep: () => boolean;
	passwordError: string;
	setGender: Dispatch<SetStateAction<string>>;
	setFirstName: Dispatch<SetStateAction<string>>;
	setLastName: Dispatch<SetStateAction<string>>;
	handleUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FirstStep({
	setUserName,
	userNameError,
	userExistsError,
	firstNameError,
	lastNameError,
	genderError,
	setEmail,
	emailExistsError,
	emailError,
	setBirthday,
	birthdayError,
	setPassword,
	setConfirmPassword,
	confirmPasswordError,
	setStep,
	validateStep,
	passwordError,
	setGender,
	setFirstName,
	setLastName,
	handleUsernameChange,
	handleEmailChange
}: FirstStepProps) {
	const [attemptedNextStep, setAttemptedNextStep] = useState(false);
	const [isTermsOpen, setIsTermsOpen] = useState(false);
	const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
	const [isTermsAccepted, setIsTermsAccepted] = useState(false);
	const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
	const [termsError, setTermsError] = useState('');
	const [privacyError, setPrivacyError] = useState('');

	useEffect(() => {
		validateStep();
	}, [validateStep]);

	const handleNextStep = () => {
		setAttemptedNextStep(true);
		let valid = true;

		if (!isTermsAccepted) {
			setTermsError('You must accept the Terms and Conditions to proceed.');
			valid = false;
		} else {
			setTermsError(''); // Clear error if accepted
		}

		if (!isPrivacyAccepted) {
			setPrivacyError('You must accept the Privacy Policy to proceed.');
			valid = false;
		} else {
			setPrivacyError(''); // Clear error if accepted
		}

		if (valid && validateStep()) {
			setStep(2);
		}
	};

	// const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const email = e.target.value;
    //     setEmail(email); // Call the handler passed from the Page component
    // };

    // const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const username = e.target.value;
    //     setUserName(username);
    // };

	const totalSteps = 5;
	const currentStep = 1;
	const progressPercentage = (currentStep / totalSteps) * 100;

	return (
			<div className='step-1 border-none bg-black bg-opacity-[50%] px-5 py-4 h-screen'>
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
							<div className="md:text-center mb-4">
								<p className="text-2xl font-bold text-white xl:text-2xl">
									Welcome to{' '}
									<p className="text-4xl md:inline md:text-2xl">Ourlime</p>
								</p>
								<h2 className="text-2xl font-bold text-white md:text-4xl xl:text-5xl">
									Create your new account
								</h2>
								<p className="mt-4 flex flex-col gap-1 text-xl font-bold text-white md:flex-row md:justify-center">
									Already have an account ?
									<Link
										href="/login"
										className="text-xl font-bold text-[#01EB53]"
									>
										Sign In
									</Link>
								</p>
							</div>
			
			<div className="mb-4 flex flex-col gap-4 md:flex-row md:gap-10">
			
				<div className="w-full md:w-1/2">
					<div className="relative">
						<input
							type="text"
							className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
							placeholder="First Name"
							onChange={(e) => setFirstName(e.target.value)}
						/>
						{attemptedNextStep && firstNameError && (
							<p className="text-bold mt-1 text-left text-red-500">
								{firstNameError}
							</p>
						)}
					</div>
				</div>
				<div className="w-full md:w-1/2">
					<div className="relative">
						<input
							type="text"
							className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
							placeholder="Last Name"
							onChange={(e) => setLastName(e.target.value)}
						/>
						{attemptedNextStep && lastNameError && (
							<p className="text-bold mt-1 text-left text-red-500">
								{lastNameError}
							</p>
						)}
					</div>
				</div>
			</div>
			<div className="mb-4">
				<div className="relative">
					<input
						type="text"
						className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
						placeholder="Username"
						onChange={handleUsernameChange}
						required
					/>
				</div>
				{attemptedNextStep && userNameError && (
					<p className="text-bold mt-1 text-left text-red-500">
						{userNameError}
					</p>
				)}
				{attemptedNextStep && userExistsError && (
					<p className="text-bold mt-1 text-left text-red-500">
						{userExistsError}
					</p>
				)}

			</div>
			<div className="mb-4">
				<div className="relative">
					<input
						type="email"
						className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
						placeholder="Email Address"
						onChange={handleEmailChange}
						required
					/>
				</div>
				{attemptedNextStep && emailError && (
					<p className="text-bold mt-1 text-left text-red-500">{emailError}</p>
				)}
				{attemptedNextStep && emailExistsError && (
					<p className="text-bold mt-1 text-left text-red-500">
						{emailExistsError}
					</p>
				)}
			</div>
			<div className="mb-4">
				<Select
					placeholder="Gender"
					onChange={(e) => setGender(e.target.value)}
					className={`${styles.nextuiInput} w-full rounded-md border border-none border-gray-300 bg-white px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500`}
					classNames={{
						base: "text-black",
						trigger: "text-black",
						value: "text-black"
					}}
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
			</div>
			<div className="mb-4">
				<DatePicker
					variant='underlined'
					onChange={(date) => setBirthday(date.toString())}
					className={`${styles.nextuiInput} w-full rounded-md border bg-white text-black border-none border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500`}
					showMonthAndYearPickers
					classNames={{
						base: "text-black",
						selectorIcon: "text-black",
						input: "text-black"
					}}
				/>
				{attemptedNextStep && birthdayError && (
					<p className="text-bold mt-1 text-left text-red-500">
						{birthdayError}
					</p>
				)}
			</div>
			<div className="mb-4 flex flex-col gap-4 md:flex-row md:gap-10">
				<div className="w-full md:w-1/2">
					<div className="relative">
						<input
							type="password"
							className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
							placeholder="Password"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						{attemptedNextStep && passwordError && (
							<p className="text-bold mt-1 text-left text-red-500">
								{passwordError}
							</p>
						)}
					</div>
				</div>
				<div className="w-full md:w-1/2">
					<div className="relative">
						<input
							type="password"
							className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
							placeholder="Confirm Password"
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
						{attemptedNextStep && confirmPasswordError && (
							<p className="text-bold mt-1 text-left text-red-500">
								{confirmPasswordError}
							</p>
						)}
					</div>
				</div>
			</div>

			<div className="justify-center items-center md:flex flex-col w-full">
				<div className="flex items-center justify-between mb-2">
					<p className="text-sm font-bold text-white flex-grow">
						I accept Ourlime 
						<span className="font-bold text-greenTheme">
							<button 
								onClick={() => setIsTermsOpen(true)}
								className="text-greenTheme underline ml-1"
							>
								Terms and Conditions
							</button>
						</span>
					</p>
					<Checkbox 
					 isSelected={isTermsAccepted}
					 onChange={() => setIsTermsAccepted(!isTermsAccepted)}
					 color="success" className="ml-2">	
					 </Checkbox>
				</div>
				
				<div className="flex items-center justify-between">
					<p className="text-sm font-bold text-white flex-grow">
						I accept Ourlime 
						<span className="font-bold text-greenTheme">
							<button 
								onClick={() => setIsPrivacyOpen(true)}
								className="text-greenTheme underline ml-1"
							>
								Privacy Policy
							</button>
						</span>
					</p>
					<Checkbox 
					 isSelected={isPrivacyAccepted}
					 onChange={() => setIsPrivacyAccepted(!isPrivacyAccepted)}
					 color="success" className="ml-2"></Checkbox>
				</div>
			</div>

			 {/* Display error message if checkboxes are not accepted */}
			 {termsError && <p className="text-red-500">{termsError}</p>}
			 {privacyError && <p className="text-red-500">{privacyError}</p>}


			<Button
				onClick={handleNextStep}
				type="button"
				className="submit my-4 w-full rounded-full bg-greenTheme px-4 py-2 text-white hover:bg-green-600"
			>
				Next Step!
			</Button>

			<TermsModal 
				isOpen={isTermsOpen} 
				onClose={() => setIsTermsOpen(false)} 
			/>
			<PrivacyModal 
				isOpen={isPrivacyOpen} 
				onClose={() => setIsPrivacyOpen(false)} 
			/>
		</div>
	);
}