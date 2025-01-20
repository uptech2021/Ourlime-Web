import { db } from "@/lib/firebaseConfig";
import { collection, getDoc, getDocs, query, Timestamp, where, doc } from "firebase/firestore";
import { Comment } from '@/types/global';
import { UserData } from "@/types/userTypes";
import { Post } from "@/types/userTypes";
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

// Function to fetch all feed posts
export const fetchAllFeedPosts = async (): Promise<Post[]> => {
    const postsRef = collection(db, 'feedsPost'); // Reference to the feedsPost collection

    try {
        const snapshot = await getDocs(postsRef); // Fetch all documents in the collection
        const postsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(), // Spread the document data
        })) as Post[]; // Cast to Post type

        console.log(`Fetched ${postsData.length} posts`);
        return postsData;
    } catch (error) {
        console.error('Error fetching feed posts:', error);
        return [];
    }
};

// Function to fetch a specific post by ID
export const fetchPostById = async (postId: string): Promise<Post | null> => {
    const postRef = doc(db, 'feedPosts', postId); // Reference to the specific post

    try {
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
            return { id: postDoc.id, ...postDoc.data() } as Post; // Return the post data
            
        } else {
            console.log("No such post!");
            return null;
        }
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
};

// Reusable function to fetch comments for a specific post
export const fetchCommentsForPost = async (postId: string): Promise<Comment[]> => {
    const commentsRef = collection(db, 'feedsPostComments');
    const q = query(commentsRef, where('feedsPostId', '==', postId));

    try {
        const snapshot = await getDocs(q);
        const commentsData = await Promise.all(snapshot.docs.map(async (commentDoc) => {
            const data = commentDoc.data();
            const userId = data.userId;

            // Fetch user data for the comment
            const userDoc = await getDoc(doc(db, "users", userId));
            let userData: UserData | null = null;

            if (userDoc.exists()) {
                userData = userDoc.data() as UserData;
            } else {
                console.log("No user document found for userId:", userId);
            }

            return {
                id: commentDoc.id,
                comments: data.comments,
                createdAt: new Date(data.createdAt), // Convert Firestore timestamp to Date
                updatedAt: new Date(data.updatedAt), // Convert Firestore timestamp to Date
                feedsPostId: data.feedsPostId,
                userId: userId,
                userData: userData, // Include userData in the comment object
                replies: [], // Initialize replies as an empty array
            } as Comment;
        }));

        console.log(`Fetched ${commentsData.length} comments for post ID: ${postId}`);
        return commentsData;
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
};
