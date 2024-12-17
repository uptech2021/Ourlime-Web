'use client';
import AnimatedLogo from '@/components/AnimatedLoader';
import FirstStep from '@/components/register/FirstStep';
import SecondStep from '@/components/register/SecondStep';
import ThirdStep from '@/components/register/ThirdStep';
import SecondStepOptional from '@/components/register/SecondStepOptional'
import FourthStep from '@/components/register/FourthStep';
import FifthStep from '@/components/register/FifthStep';
import Authentication from '@/components/register/Authentication';
import { auth, db } from '@/firebaseConfig';
import { handleSignOut } from '@/helpers/Auth';
import { uploadFile } from '@/helpers/firebaseStorage';
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	sendEmailVerification,
	User,
} from 'firebase/auth';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { gsap } from 'gsap';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import 'react-phone-number-input/style.css';
export default function Page() {
	const [step, setStep] = useState(1);
	const [prevStep, setPrevStep] = useState(1);
	const router = useRouter();

	let newUser: User | null = null;

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [profilePicture, setProfilePicture] = useState('');
	const [country, setCountry] = useState('');
	const [gender, setGender] = useState('');
	const [birthday, setBirthday] = useState('');
	const [userName, setUserName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [firstNameError, setFirstNameError] = useState('');
	const [lastNameError, setLastNameError] = useState('');
	const [countryError, setCountryError] = useState('');
	const [genderError, setGenderError] = useState('');
	const [birthdayError, setBirthdayError] = useState('');
	const [userNameError, setUserNameError] = useState('');

	const [selectedCartoonAvatarBlackBoy, setSelectedCartoonAvatarBlackBoy] =
		useState(false);
	const [selectedCartoonAvatarWhiteBoy, setSelectedCartoonAvatarWhiteBoy] =
		useState(false);
	const [selectedCartoonAvatarBlackGirl, setSelectedCartoonAvatarBlackGirl] =
		useState(false);
	const [selectedCartoonAvatarWhiteGirl, setSelectedCartoonAvatarWhiteGirl] =
		useState(false);
	const [selectedRealisticAvatarWhiteMan, setSelectedRealisticAvatarWhiteMan] =
		useState(false);
	const [
		selectedRealisticAvatarBlackWoman,
		setSelectedRealisticAvatarBlackWoman,
	] = useState(false);

	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [error, setError] = useState('');

	const [isStep3Valid, setIsStep3Valid] = useState(false);

	const [verificationMessage, setVerificationMessage] = useState('');

	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const [city, setCity] = useState('');
	const [cityError, setCityError] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [postalCodeError, setPostalCodeError] = useState('');
	const [Address, setAddress] = useState('');
	const [AddressError, setAddressError] = useState('');
	const [zipCode, SetZipCode] = useState('');
	const [zipCodeError, setZipCodeError] = useState('');
	


	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (user && user.emailVerified) {
			router.push('/'); 
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
			`.step-${currentStep.toString().replace('.', '_')}`,
			{ opacity: 0, x: 100 },
			{ opacity: 1, x: 0, duration: 0.5 }
		);
	};

	const animateStepBackward = (currentStep: number) => {
		gsap.fromTo(
			`.step-${currentStep.toString().replace('.', '_')}`,
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

		if (Address.trim() === '') {
			setAddressError('Please enter your Address.');
			formValid = false;
		} else {
			setAddressError('');
		}

		if (zipCode.trim() === '') {
			setZipCodeError('Please enter your zip code.');
			formValid = false;
		} else {
			setZipCodeError('');
		}


		setIsStep3Valid(formValid);
		return formValid;
	};

	const handleAvatarSelection = (avatar: string) => {
		// Reset all avatar selections
		setSelectedCartoonAvatarBlackBoy(false);
		setSelectedCartoonAvatarWhiteBoy(false);
		setSelectedCartoonAvatarBlackGirl(false);
		setSelectedCartoonAvatarWhiteGirl(false);
		setSelectedRealisticAvatarWhiteMan(false);
		setSelectedRealisticAvatarBlackWoman(false);

		// Set the selected avatar
		switch (avatar) {
			case 'cartoonAvatarBlackBoy':
				setSelectedCartoonAvatarBlackBoy(true);
				setProfilePicture('cartoonAvatarBlackBoy.svg');
				break;
			case 'cartoonAvatarWhiteBoy':
				setSelectedCartoonAvatarWhiteBoy(true);
				setProfilePicture('cartoonAvatarWhiteBoy.svg');
				break;
			case 'cartoonAvatarBlackGirl':
				setSelectedCartoonAvatarBlackGirl(true);
				setProfilePicture('cartoonAvatarBlackGirl.svg');
				break;
			case 'cartoonAvatarWhiteGirl':
				setSelectedCartoonAvatarWhiteGirl(true);
				setProfilePicture('cartoonAvatarWhiteGirl.svg');
				break;
			case 'realisticAvatarWhiteMan':
				setSelectedRealisticAvatarWhiteMan(true);
				setProfilePicture('realisticAvatarWhiteMan.svg');
				break;
			case 'realisticAvatarBlackWoman':
				setSelectedRealisticAvatarBlackWoman(true);
				setProfilePicture('realisticAvatarBlackWoman.svg');
				break;
			default:
				break;
		}
	};

	const handleRegister = async (e: React.FormEvent) => {
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

			// Save user data to 'users' collection
			await setDoc(doc(db, 'users', user.uid), {
				firstName,
				lastName,
				userName,
				email: user.email,
				gender,
				birthday,
				isAdmin: true,
				last_loggedIn: new Date(Date.now()),
				userTier: 1,
			});

			// Save profile picture to 'profileImages' collection
			await setDoc(doc(db, 'profileImages', user.uid), {
				imageURL: await uploadFile(
					new File(
						[
							await fetch(`/images/register/${profilePicture}`).then(
								(res) => res.blob()
							),
						],
						profilePicture,
						{ type: 'image/svg+xml' }
					),
					`images/profilePictures/${profilePicture}`
				),
				typeOfImage: profilePicture, // Assuming this is the type of image
				createdAt: new Date().toISOString(), // Store the creation date
				userid: user.uid, // Link to the user
			});

			// Save address data to 'addresses' collection
			await setDoc(doc(db, 'addresses', user.uid), {
				userId: user.uid,
				country,
				postalCode,
				city,
				Address,
				zipCode
			});

			// Store the uid in localStorage
			localStorage.setItem('uid', user.uid);
			await handleSignOut(router);
		} catch (error: any) {
			// console.error('Error writing document: ', error);
			// Delete user data if profile creation fails
			if (newUser) {
				try {
					await deleteDoc(doc(db, 'users', newUser.uid));
					await newUser.delete();
				} catch (deleteError) {
					// console.error('Error deleting user data: ', deleteError);
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
	};

	if (loading) {
		return <AnimatedLogo />;
	  }

	if (user && user.emailVerified) {
		return <AnimatedLogo />; 
	}
	return (
		<div className="fixed inset-0 bg-gray-100">
			{/* Background Image for Mobile */}
			<div
				className="absolute inset-0 bg-cover bg-center md:hidden"
				style={{
					backgroundImage: "url('/images/register/registerBackgroundImage.png')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			></div>

			{/* Background Image for Desktop */}
			<div
				className="absolute inset-0 hidden bg-cover bg-center md:block"
				style={{
					backgroundImage: "url('/images/register/pcRegisterBackgroundImage.png')",
				}}
			></div>

			{/* Form Container */}
			<div className="absolute inset-0 flex justify-center bg-black bg-opacity-[35%] overflow-auto ">
				<div className="w-9/12 text-left sm:w-9/12 md:w-8/12 lg:w-1/2 ">
					
					<div className=" flex flex-col justify-center">
						{step === 1 ? (
							<FirstStep
								setUserName={setUserName}
								userNameError={userNameError}
								setFirstName={setFirstName}
								firstNameError={firstNameError}
								setLastName={setLastName}
								lastNameError={lastNameError}
								setGender={setGender}
								genderError={genderError}
								setEmail={setEmail}
								emailError={emailError}
								// phoneError={phoneError}
								setPassword={setPassword}
								setConfirmPassword={setConfirmPassword}
								confirmPasswordError={confirmPasswordError}
								setStep={setStep}
								validateStep={validateStep1}
								passwordError={passwordError}
								setBirthday={setBirthday}
								birthdayError={birthdayError}
							/>
						) : step === 2 ? (
							<SecondStep
								setStep={setStep}
								handleAvatarSelection={handleAvatarSelection}
								selectedCartoonAvatarBlackBoy={selectedCartoonAvatarBlackBoy}
								selectedCartoonAvatarWhiteBoy={selectedCartoonAvatarWhiteBoy}
								selectedCartoonAvatarBlackGirl={selectedCartoonAvatarBlackGirl}
								selectedCartoonAvatarWhiteGirl={selectedCartoonAvatarWhiteGirl}
								selectedRealisticAvatarWhiteMan={
									selectedRealisticAvatarWhiteMan
								}
								selectedRealisticAvatarBlackWoman={
									selectedRealisticAvatarBlackWoman
								}
								profilePicture={profilePicture}
								setProfilePicture={setProfilePicture}
							/>
						) 
						: step === 2.1 ? (
							<SecondStepOptional
								setStep={setStep}
								handleAvatarSelection={handleAvatarSelection}
								
								profilePicture={profilePicture}
								setProfilePicture={setProfilePicture}
							/>
						)
						: step === 3 ? (
							<ThirdStep
								verificationMessage={verificationMessage}
								setStep={setStep}
								setCountry={setCountry}
								validateStep={validateStep3}
								isStepValid={isStep3Valid}
								handleSubmit={handleRegister}
								countryError={countryError}
								setPhone={setPhone}
								phone={phone}
								// phoneError={phoneError}
								error={error}
								setCity={setCity}
								cityError={cityError}
								setPostalCode={setPostalCode}
								postalCodeError={postalCodeError}
								setAddress={setAddress}
								AddressError={AddressError}
								setZipCode={SetZipCode}
								zipCodeError={zipCodeError}
							/>
						)
						: step === 4 ? (
							<FourthStep
								setStep={setStep}
								verificationMessage={verificationMessage}
								setCountry={setCountry}
								setBirthday={setBirthday}
								validateStep={validateStep3}
								isStepValid={isStep3Valid}
								handleSubmit={handleRegister}
								countryError={countryError}
								birthdayError={birthdayError}
								setPhone={setPhone}
								phone={phone}
								// phoneError={phoneError}
								error={error}
								setCity={setCity}
								cityError={cityError}
								setPostalCode={setPostalCode}
								postalCodeError={postalCodeError}
								setAddress={setAddress}
								AddressError={AddressError}
								setZipCode={SetZipCode}
								zipCodeError={zipCodeError}
							/>
						) 
						: step === 5 ? (
							<Authentication setStep={setStep} />
						) : step === 6 ? (
							<FifthStep setStep={setStep} />
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
