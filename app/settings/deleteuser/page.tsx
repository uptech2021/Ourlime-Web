'use client';
import { useEffect, useState } from 'react';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebaseConfig';
import {
	signInWithEmailAndPassword,
	deleteUser,
	onAuthStateChanged,
	User,
} from 'firebase/auth';
import { homeRedirect, loginRedirect } from '@/helpers/Auth';
import SettingsSidebar from '@/components/settings/nav/page';

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

			// Delete user data from Firestore
			await deleteDoc(doc(db, 'users', user.uid));
			await deleteDoc(doc(db, 'profiles', user.uid));

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
		return <div>Loading...</div>;
	}

	return (
		<div className='md:flex md:flex-row bg-gray-200 min-h-screen'>
      <SettingsSidebar />
      <main className="flex flex-col mx-auto">

        <div className="text-gray-600 bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] md:w-[40rem] mt-8">
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
						className="w-full rounded bg-green-500 py-2 text-white hover:bg-green-500"
					>
						Delete User
					</button>
				</form>
			</div>
			</main>
		</div>
	);
};

export default DeleteUserPage;
