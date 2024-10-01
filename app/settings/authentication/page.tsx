'use client';
import React, { useState } from 'react';
import { Button, Input } from "@nextui-org/react";

export default function Authentication() {
	const [email, setEmail] = useState('');
	const validateEmail = (email: string) => email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
	const isInvalid = React.useMemo(() => {
		if (email === "") return false;
	
		return validateEmail(email) ? false : true;
	  }, [email]);
	

	return (
		<>
			<main className="flex min-h-screen flex-col bg-gray-200 text-center">
				<h1 className="mx-auto mb-6 mt-6 pr-20 text-2xl font-bold text-gray-800">
					Two-factor authentication{' '}
				</h1>

				<section className="mx-auto flex w-[19rem] flex-col items-center rounded-lg bg-white p-8 shadow-md">
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
		</>
	);
}
