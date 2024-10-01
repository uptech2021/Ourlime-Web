'use client';
import { Button, Input } from '@nextui-org/react';
import { ChangeEvent, useState } from 'react';
export default function Password() {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [currentpassword, setCurrentPassword] = useState('');

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value);
	};

	const passwordsMatch = password === confirmPassword;

	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const handleSave = () => {

		setShowSuccessMessage(true);
		setTimeout(() => {
			setShowSuccessMessage(false);
		}, 3000);
	};

	return (
		<>
			<main className="flex min-h-screen lg:items-center flex-col bg-gray-200 text-center">
				<h2 className="mb-4 ml-[1rem] lg:ml-0 lg:mr-[20rem] pt-8 text-left text-2xl font-semibold text-gray-700">
					Change Password
				</h2>
				<div className="mx-auto mb-6 w-[90%] lg:w-[30rem] rounded-lg bg-white p-4 text-gray-600 shadow-md">
					<form>
						{showSuccessMessage && (
							<div className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
								Password saved successfully!
							</div>
						)}

						<Input

							label='Current Password'
							type="password"
							className='mb-4'
							onChange={(e) => setCurrentPassword(e.target.value)}
						/>


						<Input

							label='New Password'
							type="password"
							className='mb-4'
							value={password}
							onChange={handlePasswordChange}
							id='password'
						/>

						<Input

							label='Repeat Password'
							type="password"
							className='mb-4'
							id="confirmPassword"
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
						/>
						{!passwordsMatch && (
							<p className="text-red-500 text-sm ">Passwords do not match.</p>
						)}

						<Input
							label='Two-factor authentication?'
							type="password"
							className='mb-4'
							placeholder="Disable"
							isDisabled
						/>





						<Button
							className={`mt-4 rounded px-4 py-2 text-white ${!passwordsMatch || !currentpassword ? 'bg-none' : ''}`}
							type="submit"
							disabled={!passwordsMatch || !currentpassword}
							onClick={handleSave}
						>
							Save
						</Button>
					</form>
				</div>
			</main>
		</>
	);
}
