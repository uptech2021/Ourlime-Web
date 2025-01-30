import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

class AuthService {
    static async redirectHome(router: AppRouterInstance): Promise<boolean> {
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

                if (!authorized) {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', user.uid));
                        if (!userDoc.exists() || !userDoc.data().isAdmin) {
                            router.push('/');
                            return;
                        }
                    } catch (error) {
                        reject(error);
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
            router.push('/login');
        } catch (error) {
            throw new Error('Failed to sign out');
        }
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

    static async checkUserExists(email: string, username: string): Promise<boolean> {
        const usersRef = collection(db, 'users');
        const queries = [];

        if (email) {
            queries.push(getDocs(query(usersRef, where('email', '==', email))));
        }

        if (username) {
            queries.push(getDocs(query(usersRef, where('userName', '==', username))));
        }

        const results = await Promise.all(queries);
        return results.some(snapshot => !snapshot.empty);
    }
}

// Future implementation for email verification
class EmailVerificationService {
    static async verifyEmail(user: User): Promise<void> {
        // Implementation for email verification
    }

    static async checkEmailVerification(user: User): Promise<boolean> {
        // Implementation for checking email verification status
        return true; // Currently always returns true since verification is not required
    }
}

export { AuthService, UserService, EmailVerificationService };
