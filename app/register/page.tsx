'use client';

import { checkIfUserExists } from '@/helpers/Auth';
import { uploadFile } from '@/helpers/firebaseStorage';
import { auth, db } from '@/config/firebase';
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	User
} from 'firebase/auth';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import AnimatedLogo from '@/components/AnimatedLoader';
import Authentication from '@/components/register/Authentication';
import FirstStep from '@/components/register/FirstStep';
import FourthStep from '@/components/register/FourthStep';
import SecondStep from '@/components/register/SecondStep';
import SecondStepOptional from '@/components/register/SecondStepOptional';
import SixthStep from '@/components/register/SixthStep';
import ThirdStep from '@/components/register/ThirdStep';




export default function Page() {
	// Navigation and Step Control
	const [step, setStep] = useState(1);
	const [prevStep, setPrevStep] = useState(1);
	const router = useRouter();
	let newUser: User | null = null;

	// User Information States
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [gender, setGender] = useState('');
	const [birthday, setBirthday] = useState('');
	const [country, setCountry] = useState('');
	const [phone, setPhone] = useState('');
	const [city, setCity] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [Address, setAddress] = useState('');
	const [zipCode, SetZipCode] = useState('');
	const [profilePicture, setProfilePicture] = useState('');
	const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

	// Avatar Selection States
	const [selectedCartoonAvatarBlackBoy, setSelectedCartoonAvatarBlackBoy] = useState(false);
	const [selectedCartoonAvatarWhiteBoy, setSelectedCartoonAvatarWhiteBoy] = useState(false);
	const [selectedCartoonAvatarBlackGirl, setSelectedCartoonAvatarBlackGirl] = useState(false);
	const [selectedCartoonAvatarWhiteGirl, setSelectedCartoonAvatarWhiteGirl] = useState(false);
	const [selectedRealisticAvatarWhiteMan, setSelectedRealisticAvatarWhiteMan] = useState(false);
	const [selectedRealisticAvatarBlackWoman, setSelectedRealisticAvatarBlackWoman] = useState(false);

	// Error States
	const [firstNameError, setFirstNameError] = useState('');
	const [lastNameError, setLastNameError] = useState('');
	const [userNameError, setUserNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [genderError, setGenderError] = useState('');
	const [birthdayError, setBirthdayError] = useState('');
	const [countryError, setCountryError] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [AddressError, setAddressError] = useState('');
	const [zipCodeError, setZipCodeError] = useState('');
	const [emailExistsError, setEmailExistsError] = useState('');
	const [userExistsError, setUserExistsError] = useState('');
	const [error, setError] = useState('');

	// Authentication and Verification States
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isStepValid, setIsStepValid] = useState(false);
	const [validationError, setValidationError] = useState('');

	// File Upload States and Refs
	const [idFaceRef] = useState<React.RefObject<HTMLInputElement>>(useRef(null));
	const [idFrontRef] = useState<React.RefObject<HTMLInputElement>>(useRef(null));
	const [idBackRef] = useState<React.RefObject<HTMLInputElement>>(useRef(null));
	const [faceFileName, setFaceFileName] = useState('');
	const [frontFileName, setFrontFileName] = useState('');
	const [backFileName, setBackFileName] = useState('');

	// Form Validation Functions
	const validateStep1 = () => {
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

		if (gender.trim() === '') {
			setGenderError('Please select a gender.');
			formValid = false;
		} else {
			setGenderError('');
		}

		if (birthday.trim() === '') {
			setBirthdayError('Please select your date of birth.');
			formValid = false;
		} else {
			setBirthdayError('');
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

		if (phone.trim() === '') {
			setPhoneError('Please enter your phone number.');
			formValid = false;
		} else if (!isValidPhoneNumber(phone)) {
			setPhoneError('Please enter a valid phone number.');
			formValid = false;
		} else {
			setPhoneError('');
		}

		return formValid;
	};
	const validateStep6 = useCallback(() => {
		let formValid = true;
	
		switch (true) {
			case !faceFileName:
			case !frontFileName:
			case !backFileName:
				formValid = false;
				break;
			default:
				break;
		}
	
		return formValid;
	}, [faceFileName, frontFileName, backFileName]);
	const checkIfEmailAlreadyExist = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const _email = e.target.value
		setEmail(_email);
		const userExists = await checkIfUserExists(_email, '');
		if (userExists) setEmailExistsError('This email is already registered.');
		else setEmailExistsError('');
	};
	const checkIfUsernameAlreadyExist = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const _username = e.target.value
		setUserName(_username);
		const userExists = await checkIfUserExists('', _username);
		if (userExists) setUserExistsError('This username is already taken.');
		else setUserExistsError('');
	};

	// Animation Functions
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

	const handleRegistrationError = (error: any) => {
		if (newUser) {
			try {
				deleteDoc(doc(db, 'users', newUser.uid));
				newUser.delete();
			} catch (deleteError) {
				console.error('Error cleaning up failed registration:', deleteError);
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
		setValidationError('An error occurred during registration. Please try again.');
	};
	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Starting registration process...');
	
		const userData = {
			email,
			password,
			firstName,
			lastName,
			userName,
			gender,
			birthday,
			country,
			phone,
			Address,
			city,
			postalCode,
			zipCode,
			profilePicture,
			selectedInterests,
			idFace: idFaceRef.current?.files[0],
			idFront: idFrontRef.current?.files[0],
			idBack: idBackRef.current?.files[0]
		};
	
		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userData)
			});
	
			if (!response.ok) {
				throw new Error('Failed to register');
			}
	
			const data = await response.json();
			console.log(data.message); // Log success message
	
			// Redirect to login after successful registration
			router.push('/login');
	
		} catch (error) {
			console.error('Registration error:', error);
			handleRegistrationError(error);

		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});

		
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const valid = validateStep6();
		setIsStepValid(valid);
	}, [validateStep6]);  

	// Redirect User to home page if logged in
	useEffect(() => {
		if (user) {
			router.push('/'); 
		}
	}, [user, router]);

	// Step Animation Effect
	useEffect(() => {
		if (step > prevStep) {
			animateStepForward(step);
		} else if (step < prevStep) {
			animateStepBackward(step);
		}
		setPrevStep(step);
	}, [step, prevStep]);

	if(loading) return <AnimatedLogo />
	if (user && user.emailVerified) return <AnimatedLogo />

	return (
		<div className="fixed inset-0 bg-gray-100">
			<div
				className="absolute inset-0 bg-cover bg-center md:hidden"
				style={{
					backgroundImage: "url('/images/register/registerBackgroundImage.png')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			/>
			<div
				className="absolute inset-0 hidden bg-cover bg-center md:block"
				style={{
					backgroundImage: "url('/images/register/pcRegisterBackgroundImage.png')",
				}}
			/>
			<div className="absolute inset-0 flex justify-center bg-black bg-opacity-[35%] overflow-auto">
				<div className="w-9/12 text-left sm:w-9/12 md:w-8/12 lg:w-1/2">
					<div className="flex flex-col justify-center">
						{step === 1 && (
							<FirstStep
								setUserName={setUserName}
								userNameError={userNameError}
								userExistsError={userExistsError}
								setFirstName={setFirstName}
								firstNameError={firstNameError}
								setLastName={setLastName}
								lastNameError={lastNameError}
								setGender={setGender}
								genderError={genderError}
								setEmail={setEmail}
								emailError={emailError}
								emailExistsError={emailExistsError}
								setPassword={setPassword}
								setConfirmPassword={setConfirmPassword}
								confirmPasswordError={confirmPasswordError}
								setStep={setStep}
								validateStep={validateStep1}
								passwordError={passwordError}
								setBirthday={setBirthday}
								birthdayError={birthdayError}
								checkIfUsernameAlreadyExist={checkIfUsernameAlreadyExist}
								checkIfEmailAlreadyExist={checkIfEmailAlreadyExist}
							/>
						)}                        
						{step === 2 && (
							<SecondStep
								setStep={setStep}
								handleAvatarSelection={handleAvatarSelection}
								selectedCartoonAvatarBlackBoy={selectedCartoonAvatarBlackBoy}
								selectedCartoonAvatarWhiteBoy={selectedCartoonAvatarWhiteBoy}
								selectedCartoonAvatarBlackGirl={selectedCartoonAvatarBlackGirl}
								selectedCartoonAvatarWhiteGirl={selectedCartoonAvatarWhiteGirl}
								selectedRealisticAvatarWhiteMan={selectedRealisticAvatarWhiteMan}
								selectedRealisticAvatarBlackWoman={selectedRealisticAvatarBlackWoman}
								profilePicture={profilePicture}
								setProfilePicture={setProfilePicture}
							/>
						)}

						{step === 2.1 && (
							<SecondStepOptional
								setStep={setStep}
								handleAvatarSelection={handleAvatarSelection}
								profilePicture={profilePicture}
								setProfilePicture={setProfilePicture}
							/>
						)}

						{step === 3 && (
							<ThirdStep
								setStep={setStep}
								setCountry={setCountry}
								validateStep={validateStep3}
								countryError={countryError}
								setPhone={setPhone}
								phone={phone}
								phoneError={phoneError}
								error={error}
								setCity={setCity}
								setPostalCode={setPostalCode}
								setAddress={setAddress}
								AddressError={AddressError}
								setZipCode={SetZipCode}
							/>
						)}

						{step === 4 && (
							<FourthStep
								setStep={setStep}
								setCountry={setCountry}
								setBirthday={setBirthday}
								validateStep={validateStep3}
								handleSubmit={handleRegister}
								countryError={countryError}
								birthdayError={birthdayError}
								setPhone={setPhone}
								phone={phone}
								error={error}
								setCity={setCity}
								setPostalCode={setPostalCode}
								setAddress={setAddress}
								AddressError={AddressError}
								setZipCode={SetZipCode}
								zipCodeError={zipCodeError}
								selectedInterests={selectedInterests}
								setSelectedInterests={setSelectedInterests}
								isStepValid={false}
							/>
						)}

						{step === 5 && (
							<Authentication
								setStep={setStep}
								handleSubmit={handleRegister}
							/>
						)}

						{step === 6 && (
							<SixthStep
								setStep={setStep}
								idFaceRef={idFaceRef}
								idFrontRef={idFrontRef}
								idBackRef={idBackRef}
								handleSubmit={handleRegister}
								isStepValid={isStepValid}
								validationError={validationError}
								faceFileName={faceFileName}
								frontFileName={frontFileName}
								backFileName={backFileName}
								setFaceFileName={setFaceFileName}
								setFrontFileName={setFrontFileName}
								setBackFileName={setBackFileName}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
