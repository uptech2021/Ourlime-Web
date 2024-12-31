'use client';
import AnimatedLogo from '@/components/AnimatedLoader';
import FirstStep from '@/components/register/FirstStep';
import SecondStep from '@/components/register/SecondStep';
import ThirdStep from '@/components/register/ThirdStep';
import SecondStepOptional from '@/components/register/SecondStepOptional'
import FourthStep from '@/components/register/FourthStep';
import SixthStep from '@/components/register/SixthStep';
import Authentication from '@/components/register/Authentication';
import { checkUserExists } from '@/helpers/Auth';
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
import React, { useEffect, useState, useRef } from 'react';
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
	const [emailExistsError, setEmailExistsError] = useState('');

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [firstNameError, setFirstNameError] = useState('');
	const [lastNameError, setLastNameError] = useState('');
	const [countryError, setCountryError] = useState('');
	const [genderError, setGenderError] = useState('');
	const [birthdayError, setBirthdayError] = useState('');
	const [userNameError, setUserNameError] = useState('');
	const [userExistsError, setUserExistsError] = useState('');

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
	const [isStep5Valid, setIsStep5Valid] = useState(false);
	

	const [verificationMessage, setVerificationMessage] = useState('');
	 const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status

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
	
	const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

	const [idFaceRef] = useState<React.RefObject<HTMLInputElement>>(useRef(null));
	const [idFrontRef] = useState<React.RefObject<HTMLInputElement>>(useRef(null));
	const [idBackRef] = useState<React.RefObject<HTMLInputElement>>(useRef(null));

	const [faceFileName, setFaceFileName] = useState<string>('');
	const [frontFileName, setFrontFileName] = useState<string>('');
	const [backFileName, setBackFileName] = useState<string>('');
	const [validationError, setValidationError] = useState<string>('');
	const [isStepValid, setIsStepValid] = useState<boolean>(false);
	const [successMessage, setSuccessMessage] = useState<string>('');
	const [faceFileError, setFaceFileError] = useState<string>('');
	const [frontFileError, setFrontFileError] = useState<string>('');
	const [backFileError, setBackFileError] = useState<string>('');

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

	/* 
	[Confirm function]
	- creates the user.
	- check if the user is created, if they were created create a function that:
	- post request => api/verification/aaron@gmail.com/123abc

	/* This route takes in the user email and id
    When designing the confirm button, attach this url to that href
    <button href="https://ourlime.vercel.app/verify/123abc">Confirm</button>
*/
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

	const validateStep6 = () => {
		let formValid = true;

		if (!faceFileName) {
			console.log('Face file is missing.');
			setFaceFileError('Please upload a photo of yourself holding your ID next to your face.');
			formValid = false;
		} else {
			setFaceFileError('');
		}

		if (!frontFileName) {
			console.log('Front file is missing.');
			setFrontFileError('Please upload a photo of the front of your ID.');
			formValid = false;
		} else {
			setFrontFileError('');
		}

		if (!backFileName) {
			console.log('Back file is missing.');
			setBackFileError('Please upload a photo of the back of your ID.');
			formValid = false;
		} else {
			setBackFileError('');
		}

		console.log('Step 5 validation result:', formValid);
		return formValid;
	};

	useEffect(() => {
		const valid = validateStep6();
		setIsStepValid(valid);
	});

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
		console.log('Registration process initiated.');

		const uploadBasicData = async () => {
			console.log("Uploading all data besides authentication data to the database...");
			try {
				console.log('Proceeding with registration...');
	
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
					country,
					birthday,
					isAdmin: true,
					last_loggedIn: new Date(Date.now()),
					userTier: 1,
				});
	
				// Save user interests to 'interests' collection
				if (selectedInterests.length > 0) {
					const interestsPromises = selectedInterests.map((interest) =>
						setDoc(doc(db, 'interests', `${user.uid}_${interest}`), {
							preference: interest,
							userId: user.uid,
						})
					);
	
					await Promise.all(interestsPromises);
				}
	
				// Upload profile picture(s) to Firebase Storage and save to Firestore
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
					postalCode,
					city,
					Address,
					zipCode
				});
	
				// Store the uid in localStorage
				localStorage.setItem('uid', user.uid);
				await handleSignOut(router);
	
				// Set success message after successful registration
				setSuccessMessage('Successfully signed up! A verification email has been sent to your email address.');
				console.log('Registration successful.');
	
				// Optionally, redirect to another page after a short delay
				setTimeout(() => {
					router.push('/login'); // Change to your desired route
				}, 3000); // Redirect after 3 seconds
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
				console.error('Error during registration:', error);
				setValidationError('An error occurred during registration. Please try again.');
			}
		}
		const uploadAllData = async () => {
		let formValid = true;
		if (!validateStep6()) {
			formValid = false;
		}

		if(!formValid) {
			console.log("Step Validation failed.")
			console.log('Current validation states:'); // Log current validation states
			console.log('Face file name:', faceFileName); // Log face file name
			console.log('Front file name:', frontFileName); // Log front file name
			console.log('Back file name:', backFileName); // Log back file name
			console.log('Face file error:', faceFileError); // Log face file error
			console.log('Front file error:', frontFileError); // Log front file error
			console.log('Back file error:', backFileError); // Log back file error
			return;}

		try {
			console.log('Proceeding with registration...');

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
			// Upload authentication images to Firebase Storage
			const faceImageURL = await uploadFile(idFaceRef.current?.files[0], `authentication/${user.uid}/faceID`);
			const frontImageURL = await uploadFile(idFrontRef.current?.files[0], `authentication/${user.uid}/frontID`);
			const backImageURL = await uploadFile(idBackRef.current?.files[0], `authentication/${user.uid}/backID`);

			// Save authentication data to 'authentication' collection
			await setDoc(doc(db, 'authentication', user.uid), {
				userId: user.uid,
				proofOfId: faceImageURL, // Use the uploaded face image URL
				idFront: frontImageURL, // Use the uploaded front ID image URL
				idBack: backImageURL, // Use the uploaded back ID image URL
				createdAt: new Date().toISOString(), // Store the creation date
			});

			// Save user interests to 'interests' collection
			if (selectedInterests.length > 0) {
				const interestsPromises = selectedInterests.map((interest) =>
					setDoc(doc(db, 'interests', `${user.uid}_${interest}`), {
						preference: interest,
						userId: user.uid,
					})
				);

				await Promise.all(interestsPromises);
			}

			// Upload profile picture(s) to Firebase Storage and save to Firestore
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

			// Set success message after successful registration
			setSuccessMessage('Successfully signed up! A verification email has been sent to your email address.');
			console.log('Registration successful.');

			// Optionally, redirect to another page after a short delay
			setTimeout(() => {
				router.push('/login'); // Change to your desired route
			}, 3000); // Redirect after 3 seconds
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
			console.error('Error during registration:', error);
			setValidationError('An error occurred during registration. Please try again.');
		}}

		 // Check if the user is on the Sixth Step
		 if (step === 6) {
            if (isAuthenticated) {
                await uploadAllData(); // Upload all data including authentication
            } else {
                console.log('User did not complete authentication, skipping upload of authentication data.');
            }
        } else if (step === 5) {
            console.log('User skipped authentication, uploading basic data.');
            await uploadBasicData(); // Upload basic data only
        } else {
            console.log('Proceeding without authentication.');
        }
	};

	
	const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const email = e.target.value;
		setEmail(email);
		const exists = await checkUserExists(email, ''); // Check for email existence
		if (exists) {
			setEmailExistsError('This email is already registered.');
			console.log(emailExistsError)
		} else {
			setEmailExistsError('');
		}
	};

	const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const username = e.target.value;
		setUserName(username);
		const exists = await checkUserExists('', username); // Check for username existence
		if (exists) {
			setUserExistsError('This username is already taken.');
			console.log(userExistsError)
		} else {
			setUserExistsError('');
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
								// phoneError={phoneError}
								setPassword={setPassword}
								setConfirmPassword={setConfirmPassword}
								confirmPasswordError={confirmPasswordError}
								setStep={setStep}
								validateStep={validateStep1}
								passwordError={passwordError}
								setBirthday={setBirthday}
								birthdayError={birthdayError}
								handleUsernameChange={handleUsernameChange}
								handleEmailChange={handleEmailChange}
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
								selectedInterests={selectedInterests}
								setSelectedInterests={setSelectedInterests}
							/>
						) 
						: step === 5 ? (
							<Authentication 
								setStep={setStep} 
								handleSubmit={handleRegister}
							/>
						) : step === 6 ? (
							<SixthStep 
								setStep={setStep} 
								idFaceRef={idFaceRef} 
								idFrontRef={idFrontRef} 
								idBackRef={idBackRef} 
								handleSubmit={handleRegister}
								isStepValid={isStepValid}
								setIsAuthenticated={setIsAuthenticated}
								validationError={validationError}
								successMessage={successMessage}
								faceFileName={faceFileName}
								frontFileName={frontFileName}
								backFileName={backFileName}
								setFaceFileName={setFaceFileName}
								setFrontFileName={setFrontFileName}
								setBackFileName={setBackFileName}
							/>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}
