'use client';
import React, { useEffect, useState } from 'react';
import { Button, Input } from "@nextui-org/react";
import SettingsSidebar from '@/components/settings/nav/page';
import { auth } from '@/firebaseConfig';
import { ResizeListener } from '@/helpers/Resize';
import { useRouter } from 'next/navigation';
import { loginRedirect } from '@/helpers/Auth';

export default function Authentication() {
	const router = useRouter();
	const [, setIsPc] = useState<boolean>(false);
	const user = auth;
	const [email, setEmail] = useState('');
	const validateEmail = (email: string) => email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
	const isInvalid = React.useMemo(() => {
		if (email === "") return false;

		return validateEmail(email) ? false : true;
	}, [email]);


	useEffect(() => {
		loginRedirect(router)
		const cleanup = ResizeListener(setIsPc)
		return () => cleanup()
	}, [router])

	if (!user.currentUser) return <></>

	else return (
		<>
			<div className='flex flex-row bg-gray-200 min-h-screen'>


				<SettingsSidebar />

				<main className="flex flex-col  text-center  mx-auto">
					<section className="text-gray-600 bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] md:w-[40rem] mt-8">
						<h1 className="mx-auto mb-6 mt-6 pr-20 text-2xl font-bold text-gray-800">
							Two-factor authentication{' '}
						</h1>
						<button className="mt-2 h-12 w-12 rounded-full bg-purple-200" />
						<p className="text-ml mb-20 mt-4 text-gray-600">
							Turn on 2-step login to level-up your account&apos;s security.Once
							turned on, you&apos;ll use both your password and a 6-digit security
							code sent to your phone or email to log in.
						</p>

						<form>
							<Input
								type="text"
								placeholder="E-mail"
								label="Two-factor authentication method"
								labelPlacement='outside'
								radius="sm"
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								isInvalid={isInvalid}
								variant='bordered'
								errorMessage="Please enter a valid email"

							/>


						</form>
						<Button
							isDisabled={!email}
							className={`text-sm text-white mt-6  ${!email ? 'bg-none' : ''}`}>
							Save
						</Button>
					</section>
				</main>
			</div>
		</>
	);
}
