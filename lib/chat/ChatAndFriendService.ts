import { db } from '@/lib/firebaseConfig';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
} from 'firebase/firestore';
import { useProfileStore } from '@/src/store/useProfileStore';

interface FriendshipData {
    userId1: string;
    userId2: string;
    friendshipStatus: string;
}

export class ChatService {
    private static instance: ChatService;
    private readonly db;
    private readonly store;

    private constructor() {
        this.db = db;
        this.store = useProfileStore.getState();
    }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    public async getFriends() {
        try {
            const currentUserId = this.store.id;
            const currentUserData = this.store;
            if (!currentUserId) throw new Error('User not authenticated');
    
            const [friendsSnapshot1, friendsSnapshot2] = await Promise.all([
                getDocs(query(
                    collection(this.db, 'friendship'),
                    where('userId1', '==', currentUserId),
                    where('friendshipStatus', '==', 'accepted')
                )),
                getDocs(query(
                    collection(this.db, 'friendship'),
                    where('userId2', '==', currentUserId),
                    where('friendshipStatus', '==', 'accepted')
                ))
            ]);
    
            const friendIds = new Set([
                ...friendsSnapshot1.docs.map(doc => doc.data().userId2),
                ...friendsSnapshot2.docs.map(doc => doc.data().userId1)
            ]);
    
            const friendsData = await Promise.all(
                Array.from(friendIds).map(async (friendId) => {
                    if (friendId === currentUserData.id) {
                        return {
                            id: friendId,
                            firstName: currentUserData.firstName,
                            lastName: currentUserData.lastName,
                            userName: currentUserData.userName,
                            profileImage: currentUserData.profileImage?.imageURL
                        };
                    }
    
                    const [userDoc, profileSetAs] = await Promise.all([
                        getDoc(doc(this.db, 'users', friendId)),
                        getDocs(query(
                            collection(this.db, 'profileImageSetAs'),
                            where('userId', '==', friendId),
                            where('setAs', '==', 'profile')
                        ))
                    ]);
    
                    if (!userDoc.exists()) return null;
    
                    let profileImage = null;
                    if (!profileSetAs.empty) {
                        const setAsDoc = profileSetAs.docs[0].data();
                        const profileImageDoc = await getDoc(doc(this.db, 'profileImages', setAsDoc.profileImageId));
                        
                        if (profileImageDoc.exists()) {
                            profileImage = profileImageDoc.data().imageURL;
                        }
                    }
    
                    const userData = userDoc.data();
                    return {
                        id: friendId,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        userName: userData.userName,
                        profileImage
                    };
                })
            );
    
            return friendsData.filter(friend => friend !== null);
        } catch (error) {
            console.error('Error fetching friends:', error);
            throw error;
        }
    }

    private async getUserData(userId: string) {
        try {
            console.log('Fetching user data for ID:', userId);
            const userDocRef = doc(db, 'users', userId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                console.log('User data found:', userData);
                return {
                    ...userData,
                    id: userId,
                };
            }
            console.log('No user document found for ID:', userId);
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }
}
