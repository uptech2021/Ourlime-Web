// try {
// 	console.log('Creating user authentication...');
// 	const userCredentials = await createUserWithEmailAndPassword(
// 		auth,
// 		email,
// 		password
// 	);
// 	const user = userCredentials.user;

// 	console.log('User created successfully:', user.uid);

// 	const actionCodeSettings = {
// 		url: 'http://localhost:3000/login',
// 		handleCodeInApp: true, // Ensures the link is opened within your app
// 	};

// 	console.log('Attempting to send verification email...');
// 	await sendEmailVerification(user, actionCodeSettings);
// 	console.log('Verification email sent successfully');
// 	console.log('Email sent to:', user.email);
// 	console.log('Verification URL:', actionCodeSettings.url);

// 	console.log('Creating documents...');
// 	await Promise.all([
// 		createUserDocument(user),
// 		createAddressDocument(user),
// 		createProfileImageDocument(user),
// 		createContactDocument(user),
// 		createInterestsDocuments(user),
// 	]);

// 	setVerificationMessage('Check your email to verify your account');
// 	setTimeout(() => {
// 		router.push('/login');
// 	}, 5000); // 5 second delay
// } catch (error) {
// 	console.error('Registration error:', error);
// 	if (newUser) {
// 		try {
// 			await deleteDoc(doc(db, 'users', newUser.uid));
// 			await newUser.delete();
// 		} catch (deleteError) {
// 			console.error('Error cleaning up failed registration:', deleteError);
// 		}
// 	}

// 	switch (error.code) {
// 		case 'auth/email-already-in-use':
// 			setError('Email already in use.');
// 			break;
// 		case 'auth/invalid-email':
// 			setError('Invalid email.');
// 			break;
// 		case 'auth/operation-not-allowed':
// 			setError('Operation not allowed.');
// 			break;
// 		case 'auth/weak-password':
// 			setError('Weak password.');
// 			break;
// 		case 'auth/too-many-requests':
// 			setError('Too many attempts. Please try again later.');
// 			break;
// 		default:
// 			setError('Something went wrong.');
// 			break;
// 	}
// 	setValidationError(
// 		'An error occurred during registration. Please try again.'
// 	);
// }
