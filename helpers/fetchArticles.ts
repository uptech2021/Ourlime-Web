import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export const fetchArticles = async () => {
    try {
        const collections = await getDocs(collection(db, 'blog'));
        const collectionData = collections.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        console.log('Available Collection Data:', collectionData);
        return collectionData;
    } catch (error) {
        console.log('Error fetching collections:', error);
        return [];
    }
};
