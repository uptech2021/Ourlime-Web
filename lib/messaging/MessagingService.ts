import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, Timestamp, query, where, orderBy, getDocs } from 'firebase/firestore';

interface MessageData {
    senderId: string;
    receiverId: string;
    message: string;
    status: 'sent' | 'delivered' | 'read';
    createdAt: Timestamp;
    updatedAt: Timestamp;
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

    public async sendMessage(receiverId: string, message: string, senderId: string) {
        const messageData: MessageData = {
            senderId,
            receiverId,
            message,
            status: 'sent',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(this.db, 'messages'), messageData);
        return {
            id: docRef.id,
            ...messageData
        };
    }

    public async getMessages(receiverId: string, senderId: string) {
        console.log('Fetching messages for:', { senderId, receiverId });
        
        const messagesQuery = query(
            collection(this.db, 'messages'),
            where('senderId', 'in', [senderId, receiverId]),
            where('receiverId', 'in', [senderId, receiverId]),
            orderBy('createdAt', 'asc') 
        );
    
        const messagesSnapshot = await getDocs(messagesQuery);
        console.log('Found messages:', messagesSnapshot.size);
    
        const messages = messagesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    
        return messages;
    
    }
}
