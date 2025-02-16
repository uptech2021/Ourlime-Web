import { db } from '@/lib/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { UserData, Post } from '@/types/userTypes';

export class ViewOtherProfileService {
    private static instance: ViewOtherProfileService;
    private readonly db;

    private constructor() {
        this.db = db;
    }

    public static getInstance(): ViewOtherProfileService {
        if (!ViewOtherProfileService.instance) {
            ViewOtherProfileService.instance = new ViewOtherProfileService();
        }
        return ViewOtherProfileService.instance;
    }

    public async fetchUserProfile(username: string) {
        try {
            // First get the user document
            const usersQuery = query(
                collection(this.db, 'users'),
                where('userName', '==', username)
            );

            const userSnapshot = await getDocs(usersQuery);

            if (userSnapshot.empty) {
                return { error: 'User not found', status: 404 };
            }

            const userDoc = userSnapshot.docs[0];
            const userId = userDoc.id;
            const userData = userDoc.data() as UserData;

            // Fetch all related data in parallel
            const [
                profileImagesSnapshot, 
                setAsSnapshot,
                postsSnapshot,
                friendsSnapshot1,
                friendsSnapshot2
            ] = await Promise.all([
                getDocs(query(
                    collection(this.db, 'profileImages'),
                    where('userId', '==', userId)
                )),
                getDocs(query(
                    collection(this.db, 'profileImageSetAs'),
                    where('userId', '==', userId)
                )),
                getDocs(query(
                    collection(this.db, 'posts'),
                    where('userId', '==', userId)
                )),
                getDocs(query(
                    collection(this.db, 'friendship'),
                    where('userId1', '==', userId),
                    where('friendshipStatus', '==', 'accepted')
                )),
                getDocs(query(
                    collection(this.db, 'friendship'),
                    where('userId2', '==', userId),
                    where('friendshipStatus', '==', 'accepted')
                ))
            ]);

            // Process profile images
            const profileImages = {};
            setAsSnapshot.docs.forEach(doc => {
                const setAsData = doc.data();
                const matchingImage = profileImagesSnapshot.docs.find(img => img.id === setAsData.profileImageId);
                if (matchingImage) {
                    profileImages[setAsData.setAs] = matchingImage.data().imageURL;
                }
            });

            // Return complete user data
            return {
                status: 'success',
                user: {
                    id: userId,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    userName: userData.userName,
                    email: userData.email,
                    gender: userData.gender,
                    birthday: userData.birthday,
                    country: userData.country,
                    isAdmin: userData.isAdmin,
                    last_loggedIn: userData.last_loggedIn,
                    userTier: userData.userTier,
                    createdAt: userData.createdAt,
                    bio: userData.bio,
                    profileImages,
                    postsCount: postsSnapshot.size,
                    friendsCount: friendsSnapshot1.size + friendsSnapshot2.size
                }
            };

        } catch (error) {
            return { error: 'Failed to fetch user profile', status: 500 };
        }
    }
}
