'use client';

import AnimatedLogo from '@/components/AnimatedLoader';
import { auth } from '@/lib/firebaseConfig';
import { AuthService } from '@/helpers/Auth';
import { Button } from '@nextui-org/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	useEffect(() => {
		AuthService.redirectHome(router)
			.then(() => setLoading(false))
			.catch(() => setLoading(false));
	}, [router]);

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setError('');
		setIsSubmitting(true);
		let formValid = true;

		if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			setEmailError('Please enter a valid email address.');
			formValid = false;
		} else setEmailError('');

		if (password.length < 6) {
			setPasswordError('Password should be at least 6 characters.');
			formValid = false;
		} else setPasswordError('');

		if (!formValid) {
			setIsSubmitting(false);
			return;
		}

		try {
			await signInWithEmailAndPassword(auth, email, password);
			setSuccess(true);
			setTimeout(() => {
				window.location.replace('/');
			}, 1000);
		} catch (error: any) {
			const errorMessages = {
				'auth/user-not-found': 'No user found with this email.',
				'auth/wrong-password': 'Incorrect password.',
				'auth/invalid-email': 'The email address is not valid.',
				'auth/user-disabled': 'This user account has been disabled.',
				'auth/too-many-requests': 'Too many login attempts. Please try again later.',
				'auth/invalid-credential': 'Invalid credentials provided.'
			};
			setError(errorMessages[error.code] || 'Something went wrong. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	}

	if (loading) return <AnimatedLogo />;

	return (
		<div className="relative h-screen bg-gray-100">
			{/* Background Image for Mobile */}
			<div className="absolute inset-0 md:hidden">
				<Image
					className="h-full w-full object-cover"
					src="/images/login/mobileBackground.svg"
					alt="background image"
					fill
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 backdrop-blur-sm"></div>
			</div>

			{/* Background Image for Desktop */}
			<div className="absolute inset-0 hidden md:block">
				<Image
					className="h-full w-full object-cover"
					src="/images/login/pcBackground.svg"
					alt="background image"
					fill
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
			</div>

			{/* Form Container */}
			<motion.div
				initial={{ opacity: 0, x: 100 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}
				className="relative flex flex-col h-screen md:justify-center bg-black/35 backdrop-blur-sm
					px-4 sm:px-6 md:px-8 
					md:absolute md:right-0 md:top-0 
					w-full md:w-1/2 lg:w-1/3"
			>

				<div className="w-full max-w-md mx-auto mt-20 md:mt-0">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="mb-8"
					>
						<h2 className="text-xl font-bold text-white flex items-center gap-2">
							Welcome back to
							<div className="flex items-center">
								<Image
									src="/images/transparentLogo.png"
									alt="Ourlime Logo"
									width={24}
									height={24}
									className="drop-shadow-[0_0_15px_rgba(1,235,83,0.3)]"
								/>
								<span className="text-greenTheme ml-1">Ourlime</span>
							</div>
						</h2>
						<h3 className="mb-2 pb-1 text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
							Sign back in.
						</h3>
						<p className="text-md font-bold text-white/80">
							Don&apos;t have an account?
							<Link
								href="/register"
								className="ml-2 text-[#01EB53] hover:text-[#00ff5e] transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(1,235,83,0.5)]"
							>
								Sign Up
							</Link>
						</p>
					</motion.div>

					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="mb-4 p-4 rounded-xl bg-red-500/10 text-red-500 text-sm backdrop-blur-md border border-red-500/20"
						>
							{error}
						</motion.div>
					)}

					<form onSubmit={handleLogin} className="space-y-6">
						<div className="space-y-4">
							<motion.div whileTap={{ scale: 0.995 }}>
								<input
									type="email"
									className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3
									text-white placeholder-white/60 backdrop-blur-xl
									focus:border-[#01EB53] focus:ring-2 focus:ring-[#01EB53]/20
									transition-all duration-300"
									placeholder="Email Address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
								{emailError && (
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="mt-2 text-xs text-red-500"
									>
										{emailError}
									</motion.p>
								)}
							</motion.div>

							<motion.div whileTap={{ scale: 0.995 }}>
								<input
									type="password"
									className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3
									text-white placeholder-white/60 backdrop-blur-xl
									focus:border-[#01EB53] focus:ring-2 focus:ring-[#01EB53]/20
									transition-all duration-300"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								{passwordError && (
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										className="mt-2 text-xs text-red-500"
									>
										{passwordError}
									</motion.p>
								)}
							</motion.div>
						</div>

						<Link
							href="/forgot-password"
							className="block text-sm font-medium text-white/80 hover:text-[#01EB53] 
								transition-all duration-300"
						>
							Forgot password?
						</Link>

						<motion.div
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.98 }}
						>
							<Button
								type="submit"
								disabled={isSubmitting}
								className={`relative w-full overflow-hidden rounded-xl p-4 text-white
									${isSubmitting || success
										? 'bg-green-600 cursor-not-allowed'
										: 'bg-[#01EB53] hover:bg-[#00ff5e] hover:shadow-[0_0_20px_0_rgba(1,235,83,0.3)]'
									} transition-all duration-300`}
							>
								{success ? (
									<motion.span
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className="flex items-center justify-center"
									>
										<svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<motion.path
												initial={{ pathLength: 0 }}
												animate={{ pathLength: 1 }}
												transition={{ duration: 0.5 }}
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</motion.span>
								) : isSubmitting ? (
									<span className="flex items-center justify-center">
										<svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										<span className="ml-2">Signing in...</span>
									</span>
								) : (
									'Login'
								)}
							</Button>
						</motion.div>
					</form>
				</div>
			</motion.div>
		</div>
	);

}
