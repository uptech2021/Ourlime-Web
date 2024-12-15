'use client';
// import { sendOtp } from '@/helpers/Auth';
import { Button, Checkbox, DatePicker, Select, SelectItem } from '@nextui-org/react';

import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';

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
	setPhone: Dispatch<SetStateAction<string>>;
	phoneError?: string;
	setPassword: Dispatch<SetStateAction<string>>;
	setConfirmPassword: Dispatch<SetStateAction<string>>;
	confirmPasswordError: string;
	setStep: Dispatch<SetStateAction<number>>;
	validateStep: () => boolean;
	passwordError: string;
	phone?: string;
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
	setPhone,
	phoneError,
	setPassword,
	setConfirmPassword,
	confirmPasswordError,
	setStep,
	validateStep,
	passwordError,
	phone,
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
			<div className="mb-4 flex flex-col md:flex-row md:gap-10">
				<div className="w-full md:w-1/2">
					<div className="relative">
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
					</div>
				</div>
				<div className="w-full md:w-1/2">
					<div className="relative">
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
					</div>
				</div>
			</div>
			<div className="mb-4">
				<div className="relative">
					<input
						type="text"
						className="w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500"
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
						className="w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500"
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
					className={`${styles.nextuiInput} w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500`}
					classNames={{
						base: "text-white",
						trigger: "text-white",
						value: "text-white"
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
			<DatePicker
				variant='underlined'
				onChange={(date) => setBirthday(date.toString())}
				className={`${styles.nextuiInput} mb-4 w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-green-500`}
				showMonthAndYearPickers
				classNames={{
					base: "text-white",
					selectorIcon: "text-white",
					input: "text-white"
				}}
			/>
			{attemptedNextStep && birthdayError && (
				<p className="text-bold mt-1 text-left text-red-500">
					{birthdayError}
				</p>
			)}
			<div className="mb-4">
				<div className="relative">
					<PhoneInput
						value={phone}
						className="phone"
						defaultCountry="TT"
						onChange={(value) => setPhone(value ?? '')}
						inputClass="w-full rounded-md border-none bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500"
					/>
				</div>
				{attemptedNextStep && phoneError && (
					<p className="text-bold mt-1 text-left text-red-500">{phoneError}</p>
				)}
			</div>
			<div className="mb-4">
				<div className="relative">
					<input
						type="password"
						className="w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500"
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				{attemptedNextStep && passwordError && (
					<p className="text-bold mt-1 text-left text-red-500">
						{passwordError}
					</p>
				)}
			</div>
			<div className="mb-4">
				<div className="relative">
					<input
						type="password"
						className="w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500"
						placeholder="Confirm Password"
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</div>
				{attemptedNextStep && confirmPasswordError && (
					<p className="text-bold mt-1 text-left text-red-500">
						{confirmPasswordError}
					</p>
				)}
			</div>

			<div className="justify-center items-center md:flex flex-col w-full">
				<p className="text-sm font-bold text-white">
					<Checkbox className="hidden md:inline" color="success"></Checkbox>
					I accept Ourlime  <Checkbox className="md:hidden" color="success"></Checkbox>
					<span className="font-bold text-greenTheme">
						<a href="/terms-and-conditions" className="text-greenTheme underline">Terms and Conditions</a>
					</span>
				</p>
				<p className="text-sm font-bold text-white">
					<Checkbox className="hidden md:inline" color="success"></Checkbox>
					I accept Ourlime  <Checkbox className="md:hidden" color="success"></Checkbox>
					<span className="font-bold text-greenTheme">
						<a href="/privacy-policy" className="text-greenTheme underline">Privacy Policy</a>
					</span>
				</p>

				
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