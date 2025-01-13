import { auth, db } from "@/config/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, QuerySnapshot, where } from "firebase/firestore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Redirects user to the home page if they are logged in, otherwise redirects
 * them to the login page.
 *
 * @param {AppRouterInstance} router - The Next.js router instance.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user was
 * redirected to the home page, false otherwise.
 */
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

/**
 * Redirects user to the login page if they are not logged in, or if they are
 * not authorized to access the page.
 *
 * @param {AppRouterInstance} router - The Next.js router instance.
 * @param {boolean} authorized - Whether the user is authorized to access the
 * page. Defaults to true.
 * @returns {Promise<User | null>} - A promise that resolves to the user if they
 * are logged in and authorized, null otherwise.
 */
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

/**
 * Signs the user out and redirects them to the login page.
 *
 * @param {AppRouterInstance} router - The Next.js router instance.
 */
export const handleSignOut = async (router: AppRouterInstance) => {
	try {
		await signOut(auth);
		router.push('/login');
	} catch (error) {
		// console.error('Sign out error:', error);
	}
};

/**
 * Fetches the user's profile data from the Firestore database.
 *
 * @param {string} uid - The user's ID.
 * @returns {Promise<QueryDocumentSnapshot<DocumentData> | null>} - A promise
 * that resolves to the user's profile data, null if the user does not exist.
 */
export const fetchProfile = async (uid: string) => {
    try {
        const profileRef = doc(db, 'users', uid);
        const profileSnap = await getDoc(profileRef);
        return profileSnap;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};

/**
 * Fetches the user data from the Firestore database.
 *
 * @param {string} uid - The user's ID.
 * @returns {Promise<QueryDocumentSnapshot<DocumentData> | null>} - A promise
 * that resolves to the user's data, null if the user does not exist.
 */
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

/**
 * Checks if a user exists in the Firestore database based on their email or
 * username.
 *
 * @param {string} email - The user's email.
 * @param {string} username - The user's username.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user
 * exists, false otherwise.
 */
export const checkIfUserExists = async (email?: string, username?: string) => {
	const usersRef = collection(db, 'users');
	const promises: Promise<QuerySnapshot>[] = [];

	if (email) {
		const emailQuery = query(usersRef, where('email', '==', email));
		promises.push(getDocs(emailQuery));
	}

	if (username) {
		const usernameQuery = query(usersRef, where('userName', '==', username));
		promises.push(getDocs(usernameQuery));
	}


	const results = await Promise.all(promises);
	const userExists = results.some(snapshot => !snapshot.empty);
	return userExists;
};