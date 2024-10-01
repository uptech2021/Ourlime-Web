'use client';
import FirstStep from '@/components/register/FirstStep';
import SecondStep from '@/components/register/SecondStep';
import ThirdStep from '@/components/register/ThirdStep';
import { auth, db } from '@/firebaseConfig';
import { handleSignOut } from '@/helpers/Auth';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, User } from 'firebase/auth';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import 'react-phone-number-input/style.css';

export default function Page() {
	  const [step, setStep] = useState(1);
		const [prevStep, setPrevStep] = useState(1);
		const router = useRouter();

		let newUser: User | null = null;
		// State variables for input fields
		const [firstName, setFirstName] = useState('');
		const [lastName, setLastName] = useState('');
		const [country, setCountry] = useState('');
		const [gender, setGender] = useState('');
		const [birthday, setBirthday] = useState('');
		const [userName, setUserName] = useState('');
		const [phone, setPhone] = useState('');
		const [email, setEmail] = useState('');
		const [password, setPassword] = useState('');
		const [confirmPassword, setConfirmPassword] = useState('');

		// State variables for error messages
		const [firstNameError, setFirstNameError] = useState('');
		const [lastNameError, setLastNameError] = useState('');
		const [countryError, setCountryError] = useState('');
		const [genderError, setGenderError] = useState('');
		const [birthdayError, setBirthdayError] = useState('');
		const [userNameError, setUserNameError] = useState('');
		// const [phoneError, setPhoneError] = useState('');

		const [emailError, setEmailError] = useState('');
		const [passwordError, setPasswordError] = useState('');
		const [confirmPasswordError, setConfirmPasswordError] = useState('');
		const [error, setError] = useState('');

		const [isStep3Valid, setIsStep3Valid] = useState(false);

		const [verificationMessage, setVerificationMessage] = useState('');

		const [user, setUser] = useState<User | null>(null);
		const [loading, setLoading] = useState(true);

		useEffect(() => {
			const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
				setUser(currentUser);
				setLoading(false);
			});
			return () => unsubscribe();
		}, []);

		useEffect(() => {
			if (user && user.emailVerified) {
				router.push('/'); // Redirect to home if user is authenticated and email is verified
			}
		}, [user, router]);

		useEffect(() => {
			if (step > prevStep) {
				animateStepForward(step);
			} else if (step < prevStep) {
				animateStepBackward(step);
			}
			setPrevStep(step);
		}, [step, prevStep]);

		const animateStepForward = (currentStep: number) => {
			gsap.fromTo(
				`.step-${currentStep}`,
				{ opacity: 0, x: 100 },
				{ opacity: 1, x: 0, duration: 0.5 }
			);
		};

		const animateStepBackward = (currentStep: number) => {
			gsap.fromTo(
				`.step-${currentStep}`,
				{ opacity: 0, x: -100 },
				{ opacity: 1, x: 0, duration: 0.5 }
			);
		};

		const validateStep1 = () => {
			let formValid = true;
			if (userName.trim() === '') {
				setUserNameError('Please enter your username.');
				formValid = false;
			} else {
				setUserNameError('');
			}
			if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
				setEmailError('Please enter a valid email address.');
				formValid = false;
			} else {
				setEmailError('');
			}
			if (password.length < 6) {
				setPasswordError('Password should be at least 6 characters.');
				formValid = false;
			} else {
				setPasswordError('');
			}
			if (password !== confirmPassword) {
				setConfirmPasswordError('Passwords do not match.');
				formValid = false;
			} else {
				setConfirmPasswordError('');
			}
			return formValid;
		};

		const validateStep3 = () => {
			let formValid = true;
			if (firstName.trim() === '') {
				setFirstNameError('Please enter your first name.');
				formValid = false;
			} else {
				setFirstNameError('');
			}
			if (lastName.trim() === '') {
				setLastNameError('Please enter your last name.');
				formValid = false;
			} else {
				setLastNameError('');
			}
			if (country.trim() === '') {
				setCountryError('Please enter your country.');
				formValid = false;
			} else {
				setCountryError('');
			}
			// Validate gender
			if (!gender) {
				setGenderError('Please select your gender');
				formValid = false;
			} else {
				setGenderError('');
			}

			// Validate birthday
			if (!birthday) {
				setBirthdayError('When were you born? 🤔');
				formValid = false;
			} else {
				setBirthdayError('');
			}

			setIsStep3Valid(formValid);
			return formValid;
		};

		async function handleRegister(e: React.FormEvent) {
			e.preventDefault();
			setError('');
			let formValid = true;

			if (!validateStep3()) {
				formValid = false;
			}

			if (!formValid) return;

			try {
				const userCredentials = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				const user = userCredentials.user;
				await sendEmailVerification(user);
				setVerificationMessage(
					'Verification email sent. Please check your inbox.'
				);

				newUser = user;

				// Check if the email is verified
				await setDoc(doc(db, 'users', user.uid), {
					userName,
					email: user.email,
					gender,
					isAdmin: true,
					last_loggedIn: new Date(Date.now()),
					friends: [],
				});

				await setDoc(doc(db, 'profiles', user.uid), {
					profilePicture: 'logo.png',
					banner: 'uptech.png',
					firstName,
					lastName,
					phone,
					country,
					birthday,
					balance: 0,
				});

				// Store the uid in localStorage
				localStorage.setItem('uid', user.uid);
				await handleSignOut(router);
			} catch (error: any) {
				console.error('Error writing document: ', error);
				// Delete user data if profile creation fails
				if (newUser) {
					try {
						await deleteDoc(doc(db, 'users', newUser.uid));
						await newUser.delete();
					} catch (deleteError) {
						console.error('Error deleting user data: ', deleteError);
					}
				}
				switch (error.code) {
					case 'auth/email-already-in-use':
						setError('Email already in use.');
						break;
					case 'auth/invalid-email':
						setError('Invalid email.');
						break;
					case 'auth/operation-not-allowed':
						setError('Operation not allowed.');
						break;
					case 'auth/weak-password':
						setError('Weak password.');
						break;
					default:
						setError('Something went wrong.');
						break;
				}
			}
		}

		if (loading) {
			return <div>Loading...</div>;
		}

		if (user && user.emailVerified) {
			return null; // Do not show the page if the user is authenticated and email is verified
		}
	return (
		<div className="relative h-screen bg-gray-100">
			{/* Background Image for Mobile */}
			<div
				className="bg-center-center absolute inset-0 bg-cover md:hidden"
				style={{
					backgroundImage:
						"url('/images/register/registerBackgroundImage.png')",
				}}
			></div>

			{/* Background Image for Desktop */}
			<div
				className="absolute inset-0 hidden bg-cover bg-center md:block"
				style={{
					backgroundImage:
						"url('/images/register/pcRegisterBackgroundImage.png')",
				}}
			></div>

			{/* Form Container */}
			<div className="relative flex h-screen w-screen justify-center bg-black bg-opacity-[35%] md:items-center">
				<div className="w-9/12 pt-10 text-left sm:w-9/12 md:w-8/12 lg:w-1/2 xl:w-4/12">
					{step == 1 && (
						<div className="md:text-center">
							<p className="text-2xl font-bold text-white xl:text-2xl">
								Welcome to{' '}
								<p className="text-4xl md:inline md:text-2xl">Ourlime</p>
							</p>
							<h2 className="text-2xl font-bold text-white md:text-4xl xl:text-5xl">
								Create your new account
							</h2>
							<p className="mt-4 flex flex-col gap-1 text-xl font-bold text-white md:flex-row md:justify-center">
								Already have an account?
								<Link
									href="/login"
									className="text-xl font-bold text-[#01EB53]"
								>
									Sign In
								</Link>
							</p>
						</div>
					)}
					<div className="mt-4 flex flex-col justify-center">
						{step === 1 ? (
								<FirstStep
									setUserName={setUserName}
									userNameError={userNameError}
									setEmail={setEmail}
									emailError={emailError}
									setPhone={setPhone}
									// phoneError={phoneError}
									setPassword={setPassword}
									setConfirmPassword={setConfirmPassword}
									confirmPasswordError={confirmPasswordError}
									setStep={setStep}
									validateStep={validateStep1}
									passwordError={passwordError}
									phone={phone}
								/>
						) : step === 2 ? (
								<SecondStep setStep={setStep} />
						) : step === 3 ? (
								<ThirdStep
									verificationMessage={verificationMessage}
									setStep={setStep}
									setFirstName={setFirstName}
									setLastName={setLastName}
									setGender={setGender}
									setCountry={setCountry}
									setBirthday={setBirthday}
									validateStep={validateStep3}
									isStepValid={isStep3Valid}
									handleSubmit={handleRegister}
									firstNameError={firstNameError}
									lastNameError={lastNameError}
									countryError={countryError}
									genderError={genderError}
									birthdayError={birthdayError}
									error={error}
								/>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};