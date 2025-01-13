'use client';

import { Button, Checkbox, DatePicker, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Dispatch, SetStateAction } from 'react';
import styles from "./register.module.css"
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';
import Link from 'next/link';
import transparentLogo from 'public/images/transparentLogo.png';
import Image from 'next/image';
import { gsap } from 'gsap';

const checkUserExists = async (email: string, username: string) => {
	const usersRef = collection(db, 'users');
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
	checkIfUsernameAlreadyExist: (e: React.ChangeEvent<HTMLInputElement>) => void;
	checkIfEmailAlreadyExist: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
	checkIfUsernameAlreadyExist,
	checkIfEmailAlreadyExist
}: FirstStepProps) {
	const [attemptedNextStep, setAttemptedNextStep] = useState(false);
	const [isTermsOpen, setIsTermsOpen] = useState(false);
	const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
	const [isTermsAccepted, setIsTermsAccepted] = useState(false);
	const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
	const [termsError, setTermsError] = useState('');
	const [privacyError, setPrivacyError] = useState('');
	const [isFormValid, setIsFormValid] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		userName: '',
		email: '',
		gender: '',
		birthday: '',
		password: '',
		confirmPassword: ''
	});

	useEffect(() => {
		const isValid =
			formData.firstName.trim() !== '' &&
			formData.lastName.trim() !== '' &&
			formData.userName.trim() !== '' &&
			formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
			formData.gender !== '' &&
			formData.birthday !== '' &&
			formData.password.length >= 6 &&
			isTermsAccepted &&
			isPrivacyAccepted;

		setIsFormValid(isValid);
	}, [formData, isTermsAccepted, isPrivacyAccepted]);

	const handleNextStep = () => {
		if (validateStep() && isFormValid) {
			gsap.to(".step-1", {
				x: -100,
				opacity: 0,
				duration: 0.5,
				onComplete: () => {
					setStep(2);
					gsap.fromTo(".step-2",
						{ x: 100, opacity: 0 },
						{ 
							x: 0, 
							opacity: 1, 
							duration: 0.5,
							onComplete: () => {
								// Wait 1 second after content appears
								setTimeout(() => {
									gsap.to(".progress-bar", {
										width: `${(2/5) * 100}%`,
										duration: 1,
										ease: "power2.inOut"
									});
								}, 1000);
							}
						}
					);
				}
			});
		}
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			setErrorMessage('Passwords do not match.');
			return;
		}
		setErrorMessage(''); // Clear error message if passwords match
		handleNextStep();
	};

	const totalSteps = 5;
	const currentStep = 1;
	const progressPercentage = (currentStep / totalSteps) * 100;

	return (
		<div className='step-1 border-none bg-black bg-opacity-[50%] px-5 py-4 mt-5 h-screen relative'>
			{/* Custom progress bar */}
			<div className="absolute top-0 left-0 right-0 h-1 bg-gray-300">
				<div
					className="h-full bg-greenTheme transition-all duration-700 ease-in-out relative"
					style={{ width: `${progressPercentage}%` }}
				>
					<Image
						src={transparentLogo}
						alt="Logo"
						className="absolute -top-2 right-0 transform translate-x-1/2 transition-all duration-700"
						width={20}
						height={20}
					/>
				</div>
			</div>

			<div className="md:text-center mb-4 mt-6">
				<p className="text-2xl font-bold text-white xl:text-2xl">
					Welcome to{' '}
					<span className="text-4xl block md:inline md:text-2xl">Ourlime</span>
				</p>
				<h2 className="text-2xl font-bold text-white md:text-4xl xl:text-5xl">
					Create your new account
				</h2>
				<p className="mt-4 flex flex-col gap-1 text-xl font-bold text-white md:flex-row md:justify-center">
					Already have an account?
					<Link href="/login" className="text-xl font-bold text-[#01EB53]">
						Sign In
					</Link>
				</p>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="mb-4 flex flex-col gap-4 md:flex-row md:gap-10">
					<div className="w-full md:w-1/2">
						<div className="relative">
							<input
								aria-label="First Name"
								type="text"
								className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
								placeholder="First Name"
								onChange={(e) => {
									setFormData({ ...formData, firstName: e.target.value });
									setFirstName(e.target.value);
								}}
							/>
							{attemptedNextStep && firstNameError && (
								<p className="text-bold mt-1 text-left text-red-500">{firstNameError}</p>
							)}
						</div>
					</div>
					<div className="w-full md:w-1/2">
						<div className="relative">
							<input
								aria-label="Last Name"
								type="text"
								className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
								placeholder="Last Name"
								onChange={(e) => {
									setFormData({ ...formData, lastName: e.target.value });
									setLastName(e.target.value);
								}}
							/>
							{attemptedNextStep && lastNameError && (
								<p className="text-bold mt-1 text-left text-red-500">{lastNameError}</p>
							)}
						</div>
					</div>
				</div>

				<div className="mb-4">
					<div className="relative">
						<input
							aria-label="Username"
							type="text"
							className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
							placeholder="Username"
							onChange={(e) => {
								setFormData({ ...formData, userName: e.target.value });
								checkIfUsernameAlreadyExist(e);
							}}
							required
						/>
						{userExistsError && (
							<p className="text-bold mt-1 text-left text-red-500">{userExistsError}</p>
						)}
					</div>
				</div>

				<div className="mb-4">
					<div className="relative">
						<input
							aria-label="Email Address"
							type="email"
							className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
							placeholder="Email Address"
							onChange={(e) => {
								setFormData({ ...formData, email: e.target.value });
								checkIfEmailAlreadyExist(e);
							}}
							required
						/>
						{emailExistsError && (
							<p className="text-bold mt-1 text-left text-red-500">{emailExistsError}</p>
						)}
					</div>
				</div>

				<div className="mb-4">
					<Select
						aria-label="Gender"
						placeholder="Gender"
						onChange={(e) => {
							setFormData({ ...formData, gender: e.target.value });
							setGender(e.target.value);
						}}
						className={`${styles.nextuiInput} w-full rounded-md border border-none border-gray-300 bg-white px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500`}
						classNames={{
							base: "text-black",
							trigger: "text-black",
							value: "text-black"
						}}
					>
						<SelectItem className="greenForm" key="male" value="male">Male</SelectItem>
						<SelectItem className="greenForm" key="female" value="female">Female</SelectItem>
						<SelectItem className="greenForm" key="other" value="other">Other</SelectItem>
					</Select>
					{attemptedNextStep && genderError && (
						<p className="text-bold mt-1 text-left text-red-500">{genderError}</p>
					)}
				</div>

				<div className="mb-4">
					<DatePicker
						aria-label="Birthday"
						variant='underlined'
						onChange={(date) => {
							setFormData({ ...formData, birthday: date.toString() });
							setBirthday(date.toString());
						}}
						className={`${styles.nextuiInput} w-full rounded-md border bg-white text-black border-none border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500`}
						showMonthAndYearPickers
						classNames={{
							base: "text-black",
							selectorIcon: "text-black",
							input: "text-black"
						}}
					/>
					{attemptedNextStep && birthdayError && (
						<p className="text-bold mt-1 text-left text-red-500">{birthdayError}</p>
					)}
				</div>

				<div className="mb-4 flex flex-col gap-4 md:flex-row md:gap-10">
					<div className="w-full md:w-1/2">
						<div className="relative">
							<input
								aria-label="Password"
								type="password"
								className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
								placeholder="Password"
								onChange={(e) => {
									const newPassword = e.target.value;
									setFormData({ ...formData, password: newPassword });
									setPassword(newPassword);
								}}
								required
							/>
							{attemptedNextStep && passwordError && (
								<p className="text-bold mt-1 text-left text-red-500">{passwordError}</p>
							)}
						</div>
					</div>
					<div className="w-full md:w-1/2">
						<div className="relative">
							<input
								aria-label="Confirm Password"
								type="password"
								className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black placeholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
								placeholder="Confirm Password"
								onChange={(e) => {
									const confirmPwd = e.target.value;
									setFormData({ ...formData, confirmPassword: confirmPwd });
									setConfirmPassword(confirmPwd);
								}}
								required
							/>
							{attemptedNextStep && confirmPasswordError && (
								<p className="text-bold mt-1 text-left text-red-500">{confirmPasswordError}</p>
							)}
						</div>
					</div>
				</div>

				{errorMessage && <div className="text-red-500">{errorMessage}</div>}

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
							color="success"
							className="ml-2"
						/>
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
							color="success"
							className="ml-2"
						/>
					</div>
				</div>

				{termsError && <p className="text-red-500">{termsError}</p>}
				{privacyError && <p className="text-red-500">{privacyError}</p>}

				<Button
					type="submit"
					disabled={!isFormValid}
					className={`submit mt-6 mb-8 w-full rounded-full px-4 py-2 text-white ${isFormValid ? 'bg-greenTheme hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
						}`}
				>
					Next Step!
				</Button>
			</form>

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