import { db } from '@/lib/firebaseConfig';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    onSnapshot
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
    
            const friendshipQuery1 = query(
                collection(this.db, 'friendship'),
                where('userId1', '==', currentUserId),
                where('friendshipStatus', '==', 'accepted')
            );
    
            const friendshipQuery2 = query(
                collection(this.db, 'friendship'),
                where('userId2', '==', currentUserId),
                where('friendshipStatus', '==', 'accepted')
            );
    
            const [snapshot1, snapshot2] = await Promise.all([
                getDocs(friendshipQuery1),
                getDocs(friendshipQuery2)
            ]);
    
            const friendIds = new Set([
                ...snapshot1.docs.map(doc => doc.data().userId2),
                ...snapshot2.docs.map(doc => doc.data().userId1)
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

    public subscribeToMessages(
        receiverId: string, 
        senderId: string, 
        callback: (messages: any[]) => void
    ): () => void {
        const chatRoomId = [senderId, receiverId].sort().join('_');
        const chatRef = doc(this.db, 'chats', chatRoomId);

        return onSnapshot(chatRef, (doc) => {
            if (doc.exists()) {
                const chatData = doc.data();
                callback(chatData.messages || []);
            } else {
                callback([]);
            }
        });
    }
}
