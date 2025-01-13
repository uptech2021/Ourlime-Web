import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Fetches articles from the database based on optional search terms
 * @param searchTerms - a comma-separated string of categories to filter by
 * @returns a list of article objects with their respective IDs
 */
export const fetchArticles = async (searchTerms?: string) => {
    try {
        console.log('Search Terms Received:', searchTerms);
        let articlesQuery;

        // If searchTerms is provided, create a filtered query
        if (searchTerms && searchTerms !== 'All') {
            const categories = searchTerms.split(',');
            console.log('Creating filtered query for:', categories);
            articlesQuery = query(
                collection(db, 'blog'),
                where('category', 'in', categories)
            );

            
        } else {
            // Otherwise, just fetch all articles
            console.log('Creating query for all articles');
            articlesQuery = collection(db, 'blog');
        }

        // Fetch the articles and clean up the data
        const collections = await getDocs(articlesQuery);
        const collectionData = collections.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Record<string, unknown>)
        }));
        
        console.log('Query Result:', collectionData);
        return collectionData;
    } catch (error) {
        console.log('Error in fetchArticles:', error);
        return [];
    }
};
