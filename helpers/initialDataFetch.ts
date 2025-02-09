import { UserService } from '@/helpers/Auth';
import { db } from "@/lib/firebaseConfig";
import { useProfileStore } from "@/src/store/useProfileStore";
import { collection, getDocs, query, where } from "firebase/firestore";

export const fetchInitialUserData = async (userId: string) => {
    try {
        const [
            userDoc,
            profileImagesSnapshot,
            setAsSnapshot,
            friendsSnapshot1,
            friendsSnapshot2,
            postsSnapshot
        ] = await Promise.all([
            UserService.fetchUser(userId),
            getDocs(query(
                collection(db, 'profileImages'),
                where('userId', '==', userId)
            )),
            getDocs(query(
                collection(db, 'profileImageSetAs'),
                where('userId', '==', userId),
                where('setAs', '==', 'profile')
            )),
            getDocs(query(
                collection(db, 'friendship'),
                where('userId1', '==', userId),
                where('friendshipStatus', '==', 'accepted')
            )),
            getDocs(query(
                collection(db, 'friendship'),
                where('userId2', '==', userId),
                where('friendshipStatus', '==', 'accepted')
            )),
            getDocs(query(
                collection(db, 'feedPosts'),
                where('userId', '==', userId)
            ))
        ]);
        
        const store = useProfileStore.getState();

        if (!setAsSnapshot.empty) {
            const setAsDoc = setAsSnapshot.docs[0].data();
            const matchingImage = profileImagesSnapshot.docs
                .find(img => img.id === setAsDoc.profileImageId);
                        
            if (matchingImage) {
                const imageData = matchingImage.data();
                store.setProfileImage({
                    id: matchingImage.id,
                    imageURL: imageData.imageURL,
                    userId: imageData.userId,
                    typeOfImage: 'profile',
                    createdAt: imageData.createdAt?.toDate() || new Date(),
                    updatedAt: imageData.updatedAt?.toDate() || new Date()
                });
            }
        }

        const userData = userDoc?.data();
        const totalFriendsCount = friendsSnapshot1.size + friendsSnapshot2.size;

        store.setUserData({
            id: userId,
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            userName: userData?.userName,
            country: userData?.country,
            friendsCount: totalFriendsCount,
            postsCount: postsSnapshot.size
        });

        return true;
    } catch (error) {
        return false;
    }
};
