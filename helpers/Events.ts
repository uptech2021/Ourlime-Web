import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { Event } from '@/types/eventTypes';

export const fetchEvents = async (communityId?: string) => {
    try {
        let eventsQuery;
        
        if (communityId) {
            // If communityId is provided, fetch events for that community
            eventsQuery = query(
                collection(db, 'events'),
                where('communityId', '==', communityId),
                orderBy('startDate', 'desc')
            );
        } else {
            // If no communityId, fetch all events
            eventsQuery = query(
                collection(db, 'events'),
                orderBy('startDate', 'desc')
            );
        }

        const querySnapshot = await getDocs(eventsQuery);
        const events: Event[] = [];

        querySnapshot.forEach((doc) => {
            const data= doc.data() as Omit<Event, 'id'>;
            events.push({
                id: doc.id,
                ...data
            } as Event);
        });

        return events;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};