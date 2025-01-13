import { db } from '@/config/firebase';
import {
	collection,
	query,
	where,
	getDocs,
	deleteDoc,
	doc,
} from 'firebase/firestore';

/**
 * Deletes all data associated with a given user, including:
 * - All documents in "addresses", "profileImages", "messageLogs", "callLogs", "followers", "interests", "friendShip", 
 *   and "contact" collections with the given userId.
 * - All documents in "profileImageIsSet" collection with any of the ids in the "profileImages" collection.
 * - The user document itself in the "users" collection.
 * @param {string} userId - The id of the user to delete.
 */
export async function deleteUserRelatedData(userId: string): Promise<void> {
	try {
		const collectionsToDelete = [
			'addresses',
			'profileImages',
			'messageLogs',
			'callLogs',
			'followers',
			'interests',
			'friendShip',
			'contact',
		];

		for (const collectionName of collectionsToDelete) {
			const q = query(
				collection(db, collectionName),
				where('userId', '==', userId)
			);
			const snapshot = await getDocs(q);

			const deletePromises = snapshot.docs.map((docSnap) =>
				deleteDoc(doc(db, collectionName, docSnap.id))
			);
			await Promise.all(deletePromises);
		}

		// Delete all profile images associated with the user
		const profileImagesQuery = query(
			collection(db, 'profileImages'),
			where('userId', '==', userId)
		);
		const profileImagesSnapshot = await getDocs(profileImagesQuery);

		const profileImageIds = profileImagesSnapshot.docs.map(
			(docSnap) => docSnap.id
		);
		const profileImageIsSetPromises = profileImageIds.map(
			async (profileImagesId) => {
				// Delete all profileImageIsSet documents associated with the profile images
				const q = query(
					collection(db, 'profileImageIsSet'),
					where('profileImagesId', '==', profileImagesId)
				);
				const snapshot = await getDocs(q);
				return Promise.all(
					snapshot.docs.map((docSnap) =>
						deleteDoc(doc(db, 'profileImageIsSet', docSnap.id))
					)
				);
			}
		);

		await Promise.all(profileImageIsSetPromises);

		// Finally, delete the profile images themselves
		const profileImagesDeletePromises = profileImagesSnapshot.docs.map(
			(docSnap) => deleteDoc(doc(db, 'profileImages', docSnap.id))
		);
		await Promise.all(profileImagesDeletePromises);

		await deleteDoc(doc(db, 'users', userId));

		console.log(
			`All data for userId ${userId} and its dependencies have been deleted.`
		);
	} catch (error) {
		console.error(`Failed to delete user data for userId ${userId}:`, error);
		throw error;
	}
}
