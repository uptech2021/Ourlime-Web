import {
	signOut,
	onAuthStateChanged,
	User,
	createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebaseConfig';
import {
	doc,
	getDoc,
	setDoc,
	collection,
	query,
	where,
	getDocs,
	addDoc,
	updateDoc,
	increment,
	deleteDoc,
	Timestamp,
} from 'firebase/firestore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { uploadFile } from '@/helpers/firebaseStorage';

interface UserRegistrationData {
	firstName: string;
	lastName: string;
	userName: string;
	email: string;
	password: string;
	gender: string;
	birthday: string;
	country: string;
	phone: string;
	address: {
		street: string;
		city: string;
		postalCode: string;
		zipCode: string;
	};
	selectedFiles: {
		profile: File | null;
		cover: File | null;
	};
	profilePicture: string;
	selectedInterests: string[];
	idDocuments: {
		face: File | null;
		front: File | null;
		back: File | null;
	};
}

interface EmailVerificationRecord {
    userId: string;
    email: string;
    verificationToken: string;
    createdAt: { seconds: number; nanoseconds: number };
    expiresAt: { seconds: number; nanoseconds: number };
    isVerified: boolean;
}


class AuthService {
    static async redirectAfterRegistration(router: AppRouterInstance): Promise<void> {
        await signOut(auth);
        router.push('/login');
    }

    static async redirectHome(router: AppRouterInstance): Promise<boolean> {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists() && userDoc.data().emailVerified) {
                        router.push('/');
                        resolve(true);
                    } else {
                        await signOut(auth);
                        router.push('/login');
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            });
        });
    }

    static async redirectLogin(
        router: AppRouterInstance,
        authorized: boolean = true
    ): Promise<User | null> {
        return new Promise((resolve, reject) => {
            onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    router.push('/login');
                    return;
                }

                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (!userDoc.exists() || !userDoc.data().emailVerified) {
                    await signOut(auth);
                    router.push('/login');
                    return;
                }

                if (!authorized) {
                    if (!userDoc.data().isAdmin) {
                        router.push('/');
                        return;
                    }
                }

                resolve(user);
            });
        });
    }

	static async signOut(router: AppRouterInstance): Promise<void> {
		try {
			await signOut(auth);
			localStorage.clear();
			window.location.replace('/login');
		} catch (error) {
			throw new Error('Failed to sign out');
		}
	}
	
}

class RegisterService {
	static async registerUser(userData: UserRegistrationData): Promise<void> {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			userData.email,
			userData.password
		);
		const user = userCredential.user;

		try {
			await this.createUserProfile(user, userData);
			await this.createAddressDocuments(user, userData.address);
			await this.handleProfileImages(user, userData);
			await this.createContactDocuments(user, userData.phone);
			await this.handleInterests(userData.selectedInterests);
			await this.createAuthenticationDocuments(user, userData.idDocuments);
			await EmailVerificationService.sendCustomVerification(user, userData);
			await signOut(auth);
		} catch (error) {
			await user.delete();
			throw error;
		}
	}

	private static async createUserProfile(
		user: User,
		userData: UserRegistrationData
	) {
		await setDoc(doc(db, 'users', user.uid), {
			firstName: userData.firstName,
			lastName: userData.lastName,
			userName: userData.userName,
			email: user.email,
			emailVerified: false,
			gender: userData.gender,
			birthday: userData.birthday,
			country: userData.country,
			isAdmin: false,
			last_loggedIn: new Date(),
			userTier: 1,
			createdAt: new Date(),
			interests: userData.selectedInterests,
		});
	}

	private static async createAddressDocuments(
		user: User,
		address: UserRegistrationData['address']
	) {
		const addressRef = doc(collection(db, 'addresses'));
		await setDoc(addressRef, {
			userId: user.uid,
			Address: address.street,
			city: address.city,
			postalCode: address.postalCode,
			zipCode: address.zipCode,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await setDoc(doc(collection(db, 'addressSetAs')), {
			setAs: 'home',
			addressId: addressRef.id,
		});
	}

	private static async handleProfileImages(
		user: User,
		userData: UserRegistrationData
	) {
		const profileImageRef = doc(collection(db, 'profileImages'));
		const coverImageRef = doc(collection(db, 'profileImages'));

		const profileImageURL = userData.selectedFiles.profile
			? await uploadFile(
					userData.selectedFiles.profile,
					`profiles/${user.uid}/profile`
				)
			: await uploadFile(
					new File(
						[
							await fetch(`/images/register/${userData.profilePicture}`).then(
								(res) => res.blob()
							),
						],
						userData.profilePicture,
						{ type: 'image/svg+xml' }
					),
					`profiles/${user.uid}/${userData.profilePicture}`
				);

		const coverImageURL = userData.selectedFiles.cover
			? await uploadFile(
					userData.selectedFiles.cover,
					`profiles/${user.uid}/cover`
				)
			: null;

		await setDoc(profileImageRef, {
			imageURL: profileImageURL,
			typeOfImage: 'profile',
			userId: user.uid,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await setDoc(doc(collection(db, 'profileImageSetAs')), {
			setAs: 'profile',
			profileImageId: profileImageRef.id,
			userId: user.uid,
		});

		if (coverImageURL) {
			await setDoc(coverImageRef, {
				imageURL: coverImageURL,
				typeOfImage: 'cover',
				userId: user.uid,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			await setDoc(doc(collection(db, 'profileImageSetAs')), {
				setAs: 'coverProfile',
				profileImageId: coverImageRef.id,
				userId: user.uid,
			});
		}
	}
	private static async createContactDocuments(user: User, phone: string) {
		const contactRef = doc(collection(db, 'contact'));
		await setDoc(contactRef, {
			userId: user.uid,
			contactNumber: phone,
			isVerified: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await setDoc(doc(collection(db, 'contactSetAs')), {
			setAs: 'personal',
			contactId: contactRef.id,
		});
	}

	private static async handleInterests(interests: string[]) {
		await Promise.all(
			interests.map(async (interestName) => {
				const interestsRef = collection(db, 'interests');
				const q = query(interestsRef, where('name', '==', interestName));
				const querySnapshot = await getDocs(q);

				if (querySnapshot.empty) {
					await addDoc(collection(db, 'interests'), {
						name: interestName,
						likeCount: 1,
					});
				} else {
					const interestDoc = querySnapshot.docs[0];
					await updateDoc(interestDoc.ref, {
						likeCount: increment(1),
					});
				}
			})
		);
	}

	private static async createAuthenticationDocuments(
		user: User,
		idDocuments: UserRegistrationData['idDocuments']
	) {
		const faceImageURL = await uploadFile(
			idDocuments.face,
			`authentication/${user.uid}/faceID`
		);
		const frontImageURL = await uploadFile(
			idDocuments.front,
			`authentication/${user.uid}/frontID`
		);
		const backImageURL = await uploadFile(
			idDocuments.back,
			`authentication/${user.uid}/backID`
		);

		await setDoc(doc(db, 'authentication', user.uid), {
			userId: user.uid,
			proofOfId: faceImageURL,
			idFront: frontImageURL,
			idBack: backImageURL,
			createdAt: new Date(),
		});
	}
}

class UserService {
	static async fetchProfile(uid: string) {
		try {
			const profileRef = doc(db, 'users', uid);
			return await getDoc(profileRef);
		} catch (error) {
			throw new Error('Failed to fetch profile');
		}
	}

	static async fetchUser(uid: string) {
		try {
			const userRef = doc(db, 'users', uid);
			return await getDoc(userRef);
		} catch (error) {
			throw new Error('Failed to fetch user');
		}
	}

	static async checkUserExists(
		email: string,
		username: string,
		contactNumber?: string
	): Promise<boolean> {
		const usersRef = collection(db, 'users');
		const contactRef = collection(db, 'contact');
		const queries = [];

		if (email) {
			queries.push(getDocs(query(usersRef, where('email', '==', email))));
		}

		if (username) {
			queries.push(getDocs(query(usersRef, where('userName', '==', username))));
		}

		if (contactNumber) {
			queries.push(
				getDocs(query(contactRef, where('contactNumber', '==', contactNumber)))
			);
		}

		const results = await Promise.all(queries);
		return results.some((snapshot) => !snapshot.empty);
	}
}

class EmailVerificationService {
    static async sendCustomVerification(user: User, userData: UserRegistrationData): Promise<void> {
        const verificationToken = crypto.randomUUID();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 30 * 60000); // 30 minutes

        // Create verification document
        await setDoc(doc(db, 'emailVerifications', user.uid), {
            userId: user.uid,
            email: user.email,
            verificationToken,
            createdAt: now,
            expiresAt,
            isVerified: false
        });

        // Send verification email through API route
        await fetch('/api/register/verificationEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: userData.firstName,
                verificationToken,
                userId: user.uid,
                email: user.email,
                expiresIn: '30 minutes'
            })
        });

        // Set cleanup timeout for unverified accounts
        setTimeout(async () => {
            const docRef = doc(db, 'emailVerifications', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && !docSnap.data().isVerified) {
                await deleteDoc(docRef);
                await user.delete();
            }
        }, 30 * 60000);
    }

	static async verifyEmail(userId: string, token: string): Promise<boolean> {
		const verificationDoc = await getDoc(doc(db, 'emailVerifications', userId));
		if (!verificationDoc.exists()) return false;
	
		const data = verificationDoc.data() as EmailVerificationRecord;
		if (data.verificationToken !== token || 
			Timestamp.now().seconds > data.expiresAt.seconds) return false;
	
		// Updates emailVerified in users collection
		await Promise.all([
			updateDoc(doc(db, 'users', userId), {
				emailVerified: true
			}),
			deleteDoc(doc(db, 'emailVerifications', userId))
		]);
	
		return true;
	}
	

    static async checkEmailVerification(userId: string): Promise<boolean> {
        const userDoc = await getDoc(doc(db, 'users', userId));
        return userDoc.exists() && userDoc.data()?.emailVerified === true;
    }

    static async resendVerificationEmail(userId: string): Promise<void> {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) throw new Error('User not found');

        const userData = userDoc.data();
        const user = auth.currentUser;
        if (!user) throw new Error('No authenticated user');

        await this.sendCustomVerification(user, userData as UserRegistrationData);
    }
}

export { AuthService, UserService, EmailVerificationService, RegisterService };
