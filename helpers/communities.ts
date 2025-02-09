import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { UserData, Post, BasePost } from "@/types/userTypes"; // Adjust the import based on your project structure
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
        const userDocRef = doc(db, 'users', postdoc.data().userId);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();

          // Get user's profile image
          const profileImagesQuery = query(
            collection(db, 'profileImages'),
            where('userId', '==', postdoc.data().userId)
        );
        const profileImagesSnapshot = await getDocs(profileImagesQuery);
        const profileSetAsQuery = query(
            collection(db, 'profileImageSetAs'),
            where('userId', '==', postdoc.data().userId),
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
    const summaryQuery = query(summaryRef, where('communityVariantDetailsId', '==', postdoc.id));
    const summarySnapshot = await getDocs(summaryQuery);

    const mediaDetails: CommunityVariantDetailsSummary[] = summarySnapshot.docs.map(summaryDoc => {
        const data = summaryDoc.data(); // Get the data from the document
        return {
            id: summaryDoc.id,
            type: data.type, // Ensure type is included
            typeUrl: data.typeUrl, // Ensure typeUrl is included
            communityVariantDetailsId: data.communityVariantDetailsId, // Ensure communityVariantDetailsId is included
            // Add any other necessary properties from the summaryDoc.data() if needed
        } as CommunityVariantDetailsSummary; // Cast to the correct type
    });

        // Construct the post object ensuring all required properties are included
        const post = {
            id: postdoc.id,
            title: postdoc.data().title,
            caption: postdoc.data().caption,
            content: postdoc.data().content,
            visibility: postdoc.data().visibility,
            userId: postdoc.data().userId,
            hashtags: postdoc.data().hashtags || [],
            media: mediaDetails.map(item => item.typeUrl), // Ensure media is included
            timestamp: postdoc.data().createdAt.toDate(), // Ensure timestamp is included
            userReferences: postdoc.data().userReferences || [], // Ensure userReferences is included
            author: {
                ...userData,
                profileImage: userData.profileImage,
            },
            description: postdoc.data().description || '', // Ensure description is included
            createdAt: postdoc.data().createdAt.toDate(), // Ensure createdAt is included
            mediaDetails,
        } as unknown as BasePost;

        return  post; // Return the post object
    }));

    return postsData;
};