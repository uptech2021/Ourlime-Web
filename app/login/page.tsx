'use client';

import { auth } from '@/firebaseConfig';
import { homeRedirect } from '@/helpers/Auth';
import { Button } from '@nextui-org/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	useEffect(() => {
		homeRedirect(router)
			.then(() => {
				setLoading(false);
			})
			.catch((error) => {
				// console.error('Error during home redirect:', error);
				setLoading(false);
			});
	}, [router]);

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setError('');
		let formValid = true;

		if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			setEmailError('Please enter a valid email address.');
			formValid = false;
		} else setEmailError('');

		if (password.length < 6) {
			setPasswordError('Password should be at least 6 characters.');
			formValid = false;
		} else setPasswordError('');

		// Stop form submission if validation fails
		if (!formValid) return;

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			if (!user.emailVerified) {
				// console.log('Email not verified');
				setError('Please verify your email before logging in.');
				return;
			}

			// console.log(user.emailVerified, ' is verified');
    		window.location.replace('/');
		} catch (error: any) {
			// console.error('Login error', error.code);
			switch (error.code) {
				case 'auth/user-not-found':
					setError('No user found with this email.');
					break;
				case 'auth/wrong-password':
					setError('Incorrect password.');
					break;
				case 'auth/invalid-email':
					setError('The email address is not valid.');
					break;
				case 'auth/user-disabled':
					setError('This user account has been disabled.');
					break;
				case 'auth/too-many-requests':
					setError('Too many login attempts. Please try again later.');
					break;
				case 'auth/invalid-credential':
					setError('Invalid credentials provided.');
					break;
				default:
					setError('Something went wrong. Please try again.');
			}
		}
	}

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="relative h-screen bg-gray-100">
			{/* Background Image for Mobile */}
			<div className="absolute inset-0 md:hidden">
				<Image
					className="h-full w-full object-cover"
					src="/images/login/mobileBackground.svg"
					alt="background image"
					fill
				/>
			</div>

			{/* Background Image for Desktop */}
			<div className="absolute inset-0 hidden md:block">
				<Image
					className="h-full w-full object-cover"
					src="/images/login/pcBackground.svg"
					alt="background image"
					fill
				/>
			</div>

			{/* Form Container */}
			<div className="relative flex h-screen justify-center bg-black bg-opacity-[35%] px-8 pt-10 md:pt-40 md:absolute md:right-0 md:top-0 md:w-1/2 md:text-left lg:w-1/3">
				<div className="w-full">
					<h2 className="text-xl font-bold text-white">
						Welcome back to Ourlime
					</h2>
					<h3 className="mb-2 text-4xl font-bold text-white">Sign back in.</h3>
					<p className="mb-4 text-md font-bold text-white">
						Don&apos;t have an account?
						<Link
							href="/register"
							className="md:ml-2 md:text-md font-bold text-[#01EB53]"
						>
							Sign Up
						</Link>
					</p>
					{error && <p className="text-red-500">{error}</p>}
					<form onSubmit={handleLogin}>
						<div className="mb-4">
							<div className="mb-4">
								<div className="relative">
									<input
										type="email"
										className="w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500"
										placeholder="Email Address"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
									{emailError && (
										<p className="mt-1 text-xs text-red-500">{emailError}</p>
									)}
								</div>
							</div>

							<div className="mb-4">
								<div className="relative">
									<input
										type="password"
										className="w-full rounded-md border border-none border-gray-300 bg-greenForm px-4 py-2 text-white placeholder-white focus:border-green-500 focus:outline-none focus:ring-green-500"
										placeholder="Password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
									{passwordError && (
										<p className="mt-1 text-xs text-red-500">{passwordError}</p>
									)}
								</div>
							</div>
						</div>

						<Link
							href="/forgot-password"
							className="mb-4 block text-sm font-bold text-white"
						>
							Forgot password?
						</Link>

						<Button
							type="submit"
							className="submit mb-4 w-full rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-600"
						>
							Login
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
