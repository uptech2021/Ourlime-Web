import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Check if user is logged in and email is verified on page load
// export const homeRedirect = (router: AppRouterInstance): Promise<boolean> => {
// 	return new Promise((resolve) => {
// 		onAuthStateChanged(auth, (user) => {
// 			if (user) {
// 				if (user.emailVerified) {
// 					// console.log('Already Logged In and Verified, Redirecting...');
// 					router.push('/');
// 					resolve(true);
// 				} else {
// 					console.log(
// 						'Email not verified, Redirecting to login...'
// 					);
// 					router.push('/login');
// 					resolve(false);
// 				}
// 			} else {
// 				// console.log('No user');
// 				resolve(false);
// 			}
// 		});
// 	});
// };

export const homeRedirect = (router: AppRouterInstance): Promise<boolean> => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/');
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};






// export const loginRedirect = (
// 	router: AppRouterInstance,
// 	authorized: boolean = true
// ): Promise<User | null> => {
// 	return new Promise((resolve, reject) => {
// 		onAuthStateChanged(auth, async (user) => {
// 			if (!user) {
// 				// console.log('Redirecting to login');
// 				router.push('/login');
// 			} else if (!authorized) {
// 				try {
// 					const userDoc = await getDoc(doc(db, 'users', user.uid));
// 					if (!userDoc.exists() || !userDoc.data().isAdmin) {
// 						console.warn('Unauthorized user');
// 						router.push('/');
// 						// console.log('Unauthorized user');
// 					}
// 				} catch (error) {
// 					console.error('Error checking user authorization:', error);
// 					reject(error);
// 				}
// 			} else if (!user.emailVerified) {
// 				// console.log('Email not verified, Redirecting to verification page...');
// 				router.push('/login');
// 			} else {
// 				resolve(user);
// 			}
// 		});
// 	});
// };


export const loginRedirect = (
    router: AppRouterInstance,
    authorized: boolean = true
): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/login');
            } else if (!authorized) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (!userDoc.exists() || !userDoc.data().isAdmin) {
                        router.push('/');
                    }
                } catch (error) {
                    reject(error);
                }
            } else {
                resolve(user);
            }
        });
    });
};





export const handleSignOut = async (router: AppRouterInstance) => {
	try {
		await signOut(auth);
		router.push('/login');
	} catch (error) {
		// console.error('Sign out error:', error);
	}
};

export const fetchProfile = async(uid: string) => {
    try {
        const profileRef = doc(db, 'users', uid);
        const profileSnap = await getDoc(profileRef);
        return profileSnap;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};


export const fetchUser = async (uid: string) => {
	try {
		const userRef = doc(db, 'users', uid);
		const userSnap = await getDoc(userRef);
		return userSnap;
	} catch (error) {
		console.error('Error fetching user:', error);
		return null;
	}
};

// Function to check if a user exists
export const checkUserExists = async (email: string, username: string) => {
	const usersRef = collection(db, 'users');

	const promises = [];

	if (email) {
		const emailQuery = query(usersRef, where('email', '==', email));
		promises.push(getDocs(emailQuery));
	}

	if (username) {
		const usernameQuery = query(usersRef, where('userName', '==', username));
		promises.push(getDocs(usernameQuery));
	}

	const results = await Promise.all(promises);
	const exists = results.some(snapshot => !snapshot.empty);
	console.log('User exists:', exists); // Log the result
	console.log('Checking email:', email);
	console.log('Checking username:', username);
	return exists;
};

// export const sendOtp = async (phone: string) => {
// 	try {
// 		const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha', {
// 			size: 'invisible',
// 			callback: (response: any) => {
// 				console.log('reCAPTCHA solved:', response);
// 			},
// 		});

// 		const confirmation = await signInWithPhoneNumber(
// 			auth,
// 			phone,
// 			recaptchaVerifier
// 		);
// 		console.log(confirmation);
// 	} catch (error) {
// 		console.error('Error sending OTP:', error);
// 	}
// };