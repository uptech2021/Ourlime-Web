import { collection, getDocs, query, where, orderBy, Timestamp, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Event } from '@/types/eventTypes';

export const fetchEvents = async (communityVariantId?: string) => {
    try {
        let eventsQuery;
        
        if (communityVariantId) {
            // If communityId is provided, fetch events for that community
            eventsQuery = query(
                collection(db, 'events'),
                where('communityVariantId', '==', communityVariantId),
                orderBy('startDate', 'desc')
            );
        } else {
            // If no communityId, fetch all events
            eventsQuery = query(
                collection(db, 'events'),
                orderBy('startDate', 'desc')
            );
        }

        const querySnapshot = await getDocs(eventsQuery);
        const events: Event[] = [];

        querySnapshot.forEach((doc) => {
            const data= doc.data() as Omit<Event, 'id'>;
            events.push({
                id: doc.id,
                ...data
            } as Event);
        });

        return events;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

export const fetchCommentsForEvent = async (eventVariantId: string) => {
    try {
        // Fetch comments for the event
        const commentsRef = collection(db, "eventVariantComments");
        const commentsQuery = query(
            commentsRef,
            where("eventVariantId", "==", eventVariantId),
            orderBy("timestamp", "desc")
        );
        const commentsSnapshot = await getDocs(commentsQuery);

        // Extract comment data and ensure userId is present
        const comments = commentsSnapshot.docs.map(docSnapshot => {
            const data = docSnapshot.data();
            return {
                id: docSnapshot.id,
                userId: data.userId || null, // Ensure userId exists
                comment: data.comment || "",
                timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(data.timestamp),
            };
        });

        if (comments.length === 0) return [];

        // Get unique user IDs from comments
        const userIdsArray = Array.from(new Set(comments.map(c => c.userId).filter(Boolean)));

        // Fetch user data in parallel
        const userPromises = userIdsArray.map(async userId => {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);
            return userDocSnap.exists() ? { id: userId, ...userDocSnap.data() } : null;
        });

        const users = (await Promise.all(userPromises)).filter(Boolean);

        // Fetch profile images where `setAs = "profile"`
        const profileImagePromises = userIdsArray.map(async userId => {
            const profileImageSetQuery = query(
                collection(db, "profileImageSetAs"),
                where("userId", "==", userId),
                where("setAs", "==", "profile")
            );
            const profileImageSetSnapshot = await getDocs(profileImageSetQuery);

            if (!profileImageSetSnapshot.empty) {
                const profileSetAsDoc = profileImageSetSnapshot.docs[0].data();
                const profileImageId = profileSetAsDoc.profileImageId;

                if (profileImageId) {
                    const profileImageRef = doc(db, "profileImages", profileImageId);
                    const profileImageSnap = await getDoc(profileImageRef);

                    if (profileImageSnap.exists()) {
                        return { userId, profileImage: profileImageSnap.data().imageURL };
                    }
                }
            }

            return { userId, profileImage: "/default-avatar.png" }; // Fallback image
        });

        const profileImages = await Promise.all(profileImagePromises);

        // Create lookup maps for users and profile images
        const userMap = Object.fromEntries(users.map(user => [user.id, user]));
        const profileImageMap = Object.fromEntries(profileImages.map(img => [img.userId, img.profileImage]));

        // Attach user data and profile image to comments
        const enrichedComments = comments.map(comment => ({
            ...comment,
            userData: userMap[comment.userId] || { firstName: "Unknown", lastName: "User", userName: "unknown" },
            profileImage: profileImageMap[comment.userId] || "/default-avatar.png",
        }));

        return enrichedComments;
    } catch (error) {
        console.error("Error fetching event comments:", error);
        return [];
    }
};