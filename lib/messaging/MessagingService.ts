import { db } from '@/lib/firebaseConfig';
import { 
    collection, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    arrayUnion, 
    Timestamp, 
    query, 
    where, 
    getDocs 
} from 'firebase/firestore';

interface MessageData {
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: Timestamp;
    status: 'sent' | 'delivered' | 'read';
}

interface ChatRoom {
    participants: string[];
    lastMessageTime: Timestamp;
    messages: MessageData[];
}

export class MessagingService {
    private static instance: MessagingService;
    private readonly db;

    private constructor() {
        this.db = db;
    }

    public static getInstance(): MessagingService {
        if (!MessagingService.instance) {
            MessagingService.instance = new MessagingService();
        }
        return MessagingService.instance;
    }

    private getChatRoomId(userId1: string, userId2: string): string {
        return [userId1, userId2].sort().join('_');
    }

    public async sendMessage(receiverId: string, message: string, senderId: string) {
        const chatRoomId = this.getChatRoomId(senderId, receiverId);
        const chatRef = doc(db, 'chats', chatRoomId);

        const messageData: MessageData = {
            senderId,
            receiverId,
            message,
            status: 'sent',
            timestamp: Timestamp.now()
        };

        const chatDoc = await getDoc(chatRef);

        if (!chatDoc.exists()) {
            // Create new chat room
            const chatRoom: ChatRoom = {
                participants: [senderId, receiverId],
                lastMessageTime: messageData.timestamp,
                messages: [messageData]
            };
            await setDoc(chatRef, chatRoom);
        } else {
            // Update existing chat room
            await updateDoc(chatRef, {
                messages: arrayUnion(messageData),
                lastMessageTime: messageData.timestamp
            });
        }

        return {
            id: chatRoomId,
            ...messageData
        };
    }

    public async getMessages(receiverId: string, senderId: string) {
        const chatRoomId = this.getChatRoomId(senderId, receiverId);
        const chatRef = doc(db, 'chats', chatRoomId);
        
        console.log('Fetching chat room:', chatRoomId);
        
        const chatDoc = await getDoc(chatRef);
        
        if (!chatDoc.exists()) {
            return [];
        }
    
        const chatData = chatDoc.data();
        console.log('Chat data:', chatData);
    
        // Return the messages array from the chat document
        return chatData.messages || [];
    }
    
}
