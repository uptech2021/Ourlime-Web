import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { Comment } from '@/types/global';

// Function to format the Firebase timestamp into a readable format
export const formatDate = (timestamp: any) => {
	let date: Date;

	if (
		timestamp &&
		typeof timestamp.seconds === 'number' &&
		typeof timestamp.nanoseconds === 'number'
	) {
		// Create a new Firebase Timestamp
		const firebaseTimestamp = new Timestamp(
			timestamp.seconds,
			timestamp.nanoseconds
		);
		date = firebaseTimestamp.toDate();
	} else if (timestamp instanceof Date) {
		date = timestamp;
	} else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
		date = new Date(timestamp);
	} else {
		return 'Invalid Date';
	}

	return date.toLocaleString();
};

// Reusable function to fetch comments for a specific post
export const fetchCommentsForPost = async (postId: string) => {
    console.log('Fetching comments for Post ID:', postId); // Log postId

    const commentsRef = collection(db, 'feedsPostComments');
    const q = query(commentsRef, where('feedsPostId', '==', postId));

    try {
        const snapshot = await getDocs(q);

        console.log('Query snapshot size:', snapshot.size); // Log snapshot size

        const commentsData = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('Comment Data:', data); // Log each comment
            return {
                id: doc.id,
                ...data,
                createdAt: new Date(data.createdAt.seconds * 1000),
                updatedAt: new Date(data.updatedAt.seconds * 1000),
            };
        });

        console.log('Fetched comments:', commentsData);
        return commentsData as Comment[];
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
};
