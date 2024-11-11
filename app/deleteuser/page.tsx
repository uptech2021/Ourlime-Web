'use client';
import { useEffect, useState } from 'react';
import { arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, increment, query, updateDoc, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebaseConfig';
import {
	signInWithEmailAndPassword,
	deleteUser,
	onAuthStateChanged,
	User,
} from 'firebase/auth';
import { homeRedirect, loginRedirect } from '@/helpers/Auth';
import AnimatedLogo from '@/components/AnimatedLoader';

const DeleteUserPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const checkAdmin = async (user: User | null) => {
			if (!user) {
				console.log('No user is logged in, redirecting to login.');
				loginRedirect(router, false);
				return;
			}

			const userDoc = await getDoc(doc(db, 'users', user.uid));
			if (!userDoc.exists() || !userDoc.data().isAdmin) {
				console.log('User is not an admin, redirecting to login.');
				loginRedirect(router, false);
				return;
			}

			if (!user.emailVerified) {
				console.log('Admin has not verified, redirecting to login.');
				homeRedirect(router)
				return;
			}

			setLoading(false);
		};

		const unsubscribe = onAuthStateChanged(auth, checkAdmin);

		return () => unsubscribe();
	}, [router]);

	const handleDeleteUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		try {
			// Sign in the user
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// Remove user from communities
			const communitiesRef = collection(db, 'communities');
			const q = query(
				communitiesRef,
				where('members', 'array-contains', user.uid)
			);
			const querySnapshot = await getDocs(q);

			const updatePromises = querySnapshot.docs.map(async (communityDoc) => {
				await updateDoc(doc(db, 'communities', communityDoc.id), {
					members: arrayRemove(user.uid),
					memberCount: increment(-1),
				});
			});

			await Promise.all(updatePromises);

			await deleteDoc(doc(db, 'users', user.uid));

			// Delete profile data
			const profilesRef = collection(db, 'profiles');
			const profileQuery = query(profilesRef, where('email', '==', user.email));
			const profileSnapshot = await getDocs(profileQuery);
			profileSnapshot.forEach(async (doc) => {
				await deleteDoc(doc.ref);
			});

			// Delete posts data
			const postsRef = collection(db, 'posts');
			const postsQuery = query(postsRef, where('email', '==', user.email));
			const postsSnapshot = await getDocs(postsQuery);
			postsSnapshot.forEach(async (doc) => {
				await deleteDoc(doc.ref);
			});


			// Delete user from Firebase Authentication
			await deleteUser(user);

			setSuccess('User deleted successfully.');
		} catch (error: any) {
			console.error('Error deleting user:', error);
			setError(
				'Failed to delete user. Please check the credentials and try again.'
			);
		}
	};


	if (loading) {
		return <AnimatedLogo />;
	}

	return (
		<div className="flex h-screen items-center justify-center bg-gray-100">
			<div className="w-full max-w-md bg-white p-8 shadow-md">
				<h1 className="mb-4 text-2xl font-bold">Delete User</h1>
				{error && <p className="mb-4 text-red-500">{error}</p>}
				{success && <p className="mb-4 text-green-500">{success}</p>}
				<form onSubmit={handleDeleteUser}>
					<div className="mb-4">
						<label className="block text-gray-700">Email</label>
						<input
							type="email"
							placeholder='Email Address'
							className="w-full rounded border px-3 py-2"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">Password</label>
						<input
							type="password"
							placeholder='********'
							className="w-full rounded border px-3 py-2"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full rounded bg-red-500 py-2 text-white hover:bg-red-600"
					>
						Delete User
					</button>
				</form>
			</div>
		</div>
	);
};

export default DeleteUserPage;
