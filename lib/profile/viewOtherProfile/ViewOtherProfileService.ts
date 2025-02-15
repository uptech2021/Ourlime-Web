import { db } from '@/lib/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
            const usersQuery = query(
                collection(this.db, 'users'),
                where('userName', '==', username)
            );
    
            const userSnapshot = await getDocs(usersQuery);
    
            if (userSnapshot.empty) {
                return { error: 'User not found', status: 404 };
            }
    
            const userData = userSnapshot.docs[0].data();
            const userId = userSnapshot.docs[0].id;
    
            // Fetch profile images and their assignments
            const [profileImagesSnapshot, setAsSnapshot] = await Promise.all([
                getDocs(query(
                    collection(this.db, 'profileImages'),
                    where('userId', '==', userId)
                )),
                getDocs(query(
                    collection(this.db, 'profileImageSetAs'),
                    where('userId', '==', userId)
                ))
            ]);
    
            const images = {};
            setAsSnapshot.docs.forEach(doc => {
                const setAsData = doc.data();
                const matchingImage = profileImagesSnapshot.docs.find(img => img.id === setAsData.profileImageId);
                if (matchingImage) {
                    images[setAsData.setAs] = matchingImage.data().imageURL;
                }
            });
    
            return {
                status: 'success',
                user: {
                    id: userId,
                    ...userData,
                    profileImages: images
                }
            };
        } catch (error) {
            return { error: 'Failed to fetch user profile', status: 500 };
        }
    }
    
}
