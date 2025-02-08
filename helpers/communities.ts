import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { UserData, BasePost } from "@/types/userTypes"; // Adjust the import based on your project structure
import { CommunityVariantDetailsSummary } from "@/types/communityTypes";

export const fetchCommunityMembers = async (communityVariantId: string): Promise<UserData[]> => {
    const membersRef = collection(db, 'communityVariantMembership');
    const q = query(membersRef, where('communityVariantId', '==', communityVariantId));
    const snapshot = await getDocs(q);

    const membersData = await Promise.all(snapshot.docs.map(async (memberDoc) => {
        const memberData = memberDoc.data();
        const userId = memberData.userId;

        // Fetch user data
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();

        // Fetch profile image
        const profileImagesQuery = query(
            collection(db, 'profileImages'),
            where('userId', '==', userId)
        );
        const profileImagesSnapshot = await getDocs(profileImagesQuery);
        const profileSetAsQuery = query(
            collection(db, 'profileImageSetAs'),
            where('userId', '==', userId),
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

        return {
            ...userData,
            profileImage: profileImage?.imageURL,
        } as UserData;
    }));

    return membersData;
};

export const fetchCommunityPosts = async (communityVariantId: string): Promise<BasePost[]> => {
    const postsRef = collection(db, 'communityVariantDetails');
    const q = query(postsRef, where('communityVariantId', '==', communityVariantId));
    const snapshot = await getDocs(q);

    const postsData = await Promise.all(snapshot.docs.map(async (postdoc) => {
        
        const userDocRef = doc(db, 'users',postdoc.data().userId);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();

        const post = {
            id: postdoc.id,
            title: postdoc.data().title,
            caption: postdoc.data().caption,
            content: postdoc.data().content,
            visibility: postdoc.data().visibility,
            userId: postdoc.data().userId,
            hashtags: postdoc.data().hashtags || [],
            media: postdoc.data().media,
            userReferences: postdoc.data().userReferences || [],
            timestamp: postdoc.data().createdAt.toDate(),
            author: {
                id: postdoc.data().userId,
                name: userData.firstName,
                avatar: userData.profileImage,
                role: userData.role,
            },
            mediaDetails: [],
        } as BasePost;


         // Get user's profile image
         const profileImagesQuery = query(
            collection(db, 'profileImages'),
            where('userId', '==', post.userId)
        );
        const profileImagesSnapshot = await getDocs(profileImagesQuery);
        const profileSetAsQuery = query(
            collection(db, 'profileImageSetAs'),
            where('userId', '==', post.userId),
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

        // Fetch associated summary data from communityVariantDetailsSummary
        const summaryRef = collection(db, 'communityVariantDetailsSummary');
        const summaryQuery = query(summaryRef, where('communityVariantDetailsId', '==', post.id));
        const summarySnapshot = await getDocs(summaryQuery);

        const summaries: CommunityVariantDetailsSummary[] = summarySnapshot.docs.map(summaryDoc => ({
            id: summaryDoc.id,
            ...summaryDoc.data(),
        })) as CommunityVariantDetailsSummary[];

        return {
            ...post,
            summaries, // Add summaries to the post object
        };
    }));

    return postsData;
};