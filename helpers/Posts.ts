import { db } from "@/lib/firebaseConfig";
import { collection, getDoc, getDocs, query, Timestamp, where, doc, orderBy } from "firebase/firestore";
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

export const fetchPosts = async (): Promise<Post[]> => {
    const postsRef = collection(db, 'feedPosts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const postsWithUserData = await Promise.all(
        snapshot.docs.map(async (postDoc) => {
            const postData = postDoc.data();

            // Fetch user data
            const userDocRef = doc(db, 'users', postData.userId);
            const userDocSnap = await getDoc(userDocRef);
            const userData = userDocSnap.data();

            // Get user's profile image
            const profileImagesQuery = query(
                collection(db, 'profileImages'),
                where('userId', '==', postData.userId)
            );
            const profileImagesSnapshot = await getDocs(profileImagesQuery);
            const profileSetAsQuery = query(
                collection(db, 'profileImageSetAs'),
                where('userId', '==', postData.userId),
                where('setAs', '==', 'profile')
            );
            const setAsSnapshot = await getDocs(profileSetAsQuery);

            let profileImage = null;
            if (!setAsSnapshot.empty) {
                const setAsDoc = setAsSnapshot.docs[0].data();
                const matchingImage = profileImagesSnapshot.docs
                    .find(img => img.id === setAsDoc.profileImageId);
                if (matchingImage) {
                    profileImage = matchingImage.data();
                }
            }

            // Fetch media for this post
            const mediaQuery = query(
                collection(db, 'feedsPostSummary'),
                where('feedsPostId', '==', postDoc.id)
            );
            const mediaSnapshot = await getDocs(mediaQuery);
            const media = mediaSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return {
                id: postDoc.id,
                caption: postData.caption,
                description: postData.description,
                visibility: postData.visibility,
                createdAt: postData.createdAt.toDate(),
                userId: postData.userId,
                hashtags: postData.hashtags || [],
                media,
                user: {
                    ...userData,
                    profileImage: profileImage?.imageURL,
                },
            } as unknown as Post;
        })
    );

    return postsWithUserData;
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
            let commentUserData: UserData | null = null;

            if (userDoc.exists()) {
                commentUserData = userDoc.data() as UserData;
            } else {
                console.log("No user document found for userId:", userId);
            }

            return {
                id: commentDoc.id,
                comment: data.comment,
                createdAt: new Date(data.createdAt), // Convert Firestore timestamp to Date
                updatedAt: new Date(data.updatedAt), // Convert Firestore timestamp to Date
                feedsPostId: data.feedsPostId,
                userId: userId,
                userData: commentUserData, // Include userData in the comment object
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
