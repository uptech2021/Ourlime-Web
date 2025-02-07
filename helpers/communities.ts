import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { UserData, Post } from "@/types/userTypes"; // Adjust the import based on your project structure

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

export const fetchCommunityPosts = async (communityVariantId: string): Promise<Post[]> => {
    const postsRef = collection(db, 'communityVariantDetails');
    const q = query(postsRef, where('communityVariantId', '==', communityVariantId));
    const snapshot = await getDocs(q);

    const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Post[];

    return postsData;
};