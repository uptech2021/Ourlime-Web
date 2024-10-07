'use client';
import { Button, Input } from '@nextui-org/react';
import SettingsSidebar from '@/components/settings/nav/page';
import { ChangeEvent, useState, useEffect } from 'react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { ResizeListener } from '@/helpers/Resize';
import { useRouter } from 'next/navigation';
import { loginRedirect } from '@/helpers/Auth';

export default function Password() {
	const router = useRouter();
	const [, setIsPc] = useState<boolean>(false);
	const user = auth;
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [currentpassword, setCurrentPassword] = useState('');
	const [isCurrentPasswordIncorrect, setIsCurrentPasswordIncorrect] = useState(false);


	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value);
	};

	const passwordsMatch = password === confirmPassword;

	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		const user = auth.currentUser;
		if (user && user.email) {
		  try {
			const credential = EmailAuthProvider.credential(user.email, currentpassword);
			await reauthenticateWithCredential(user, credential);
	  
			setIsCurrentPasswordIncorrect(false);
			await updatePassword(user, password);
	  
			setShowSuccessMessage(true);
			setTimeout(() => {
			  setShowSuccessMessage(false);
			}, 3000);
	  
			setCurrentPassword('');
			setPassword('');
			setConfirmPassword('');
		  } catch (error) {
			console.error("Error updating password:", error);
			setIsCurrentPasswordIncorrect(true);
			setTimeout(() => {
			  setIsCurrentPasswordIncorrect(false);
			}, 3000);
		  }
		}
	  };
	  
	  


	useEffect(() => {
		loginRedirect(router)
		const cleanup = ResizeListener(setIsPc)
		return () => cleanup()
	}, [router])

	if (!user.currentUser) return <></>

	else return (
		<>
			<div className='md:flex flex-row bg-gray-200 min-h-screen'>
				<SettingsSidebar />

				<main className="flex flex-col  text-center  mx-auto">

					<div className="text-gray-600 bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] md:w-[40rem] mt-8">
						<h2 className="mb-4 ml-[1rem] lg:ml-0 lg:mr-[20rem] pt-8 text-left text-2xl font-semibold text-gray-700">
							Change Password
						</h2>
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
							{isCurrentPasswordIncorrect && (
  <p className="text-red-500 text-sm">Current password is incorrect.</p>
)}



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
  className={`mt-4 rounded px-4 py-2 text-white ${!passwordsMatch || !currentpassword || !password || !confirmPassword ? '' : 'bg-green-500'}`}
  type="submit"
  disabled={!passwordsMatch || !currentpassword || !password || !confirmPassword}
  onClick={handleSave}
>
  Save
</Button>


						</form>
					</div>
				</main>
			</div>
		</>
	);
}
