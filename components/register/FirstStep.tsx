'use client';
// import { sendOtp } from '@/helpers/Auth';
import { Button, Checkbox, DatePicker, Select, SelectItem } from '@nextui-org/react';

import { useEffect, useState } from 'react';

import { Dispatch, SetStateAction } from 'react';
import styles from "./register.module.css"


type FirstStepProps = {
	setUserName: Dispatch<SetStateAction<string>>;
	userNameError: string;
	firstNameError: string;
	lastNameError: string;
	genderError: string;
	setEmail: Dispatch<SetStateAction<string>>;
	emailError: string;
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
};

export default function FirstStep({
	setUserName,
	userNameError,
	firstNameError,
	lastNameError,
	genderError,
	setEmail,
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
	setLastName
}: FirstStepProps) {
	const [attemptedNextStep, setAttemptedNextStep] = useState(false);

	useEffect(() => {
		validateStep();
	}, [validateStep]);

	const handleNextStep = () => {
		setAttemptedNextStep(true);
		if (validateStep()) {
			setStep(2);
		}
	};

	return (
		<div className="step-1">
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
							className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-white phaceholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
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
						className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-black phaceholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
						placeholder="Username"
						onChange={(e) => setUserName(e.target.value)}
						required
					/>
				</div>
				{attemptedNextStep && userNameError && (
					<p className="text-bold mt-1 text-left text-red-500">
						{userNameError}
					</p>
				)}
			</div>
			<div className="mb-4">
				<div className="relative">
					<input
						type="email"
						className="w-full rounded-md border border-none border-gray-300 px-4 py-2 text-white phaceholder-black focus:border-green-500 focus:outline-none focus:ring-green-500"
						placeholder="Email Address"
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				{attemptedNextStep && emailError && (
					<p className="text-bold mt-1 text-left text-red-500">{emailError}</p>
				)}
			</div>
			<div className="mb-4">
				<Select
					placeholder="Gender"
					onChange={(e) => setGender(e.target.value)}
					className={`${styles.nextuiInput} w-full rounded-md border border-none border-gray-300 bg-white px-4 py-2 text-black phaceholder-black focus:border-green-500 focus:outline-none focus:ring-green-500`}
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
					className={`${styles.nextuiInput} w-full rounded-md border bg-white border-none border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500`}
					showMonthAndYearPickers
					classNames={{
						base: "text-white",
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
							<a href="/terms-and-conditions" className="text-greenTheme underline ml-1">Terms and Conditions</a>
						</span>
					</p>
					<Checkbox color="success" className="ml-2"></Checkbox>
				</div>
				
				<div className="flex items-center justify-between">
					<p className="text-sm font-bold text-white flex-grow">
						I accept Ourlime 
						<span className="font-bold text-greenTheme">
							<a href="/privacy-policy" className="text-greenTheme underline ml-1">Privacy Policy</a>
						</span>
					</p>
					<Checkbox color="success" className="ml-2"></Checkbox>
				</div>
			</div>

			<Button
				onClick={handleNextStep}
				type="button"
				className="submit my-4 w-full rounded-full bg-greenTheme px-4 py-2 text-white hover:bg-green-600"
			>
				Next Step!
			</Button>
		</div>
	);
}