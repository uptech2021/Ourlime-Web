'use client';
// import { sendOtp } from '@/helpers/Auth';
import { Button, Checkbox } from '@nextui-org/react';

import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';

import { Dispatch, SetStateAction } from 'react';

type FirstStepProps = {
	setUserName: Dispatch<SetStateAction<string>>;
	userNameError: string;
	setEmail: Dispatch<SetStateAction<string>>;
	emailError: string;
	setPhone: Dispatch<SetStateAction<string>>;
	phoneError?: string;
	setPassword: Dispatch<SetStateAction<string>>;
	setConfirmPassword: Dispatch<SetStateAction<string>>;
	confirmPasswordError: string;
	setStep: Dispatch<SetStateAction<number>>;
	validateStep: () => boolean;
	passwordError: string;
	phone?: string;
};

export default function FirstStep({
	setUserName,
	userNameError,
	setEmail,
	emailError,
	setPhone,
	phoneError,
	setPassword,
	setConfirmPassword,
	confirmPasswordError,
	setStep,
	validateStep,
	passwordError,
	phone
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
				<div className="w-full">
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
					By creating your account, you agree to our
				</p>

				<div>
					<Checkbox className="md:hidden" color="success"></Checkbox>
					<span className="font-bold text-greenTheme">Terms and Condition</span>
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