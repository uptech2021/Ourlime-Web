import { useEffect, useState } from 'react';
import { fetchEvents } from '@/helpers/Events';
import { Event } from '@/types/eventTypes';
import { db } from '@/lib/firebaseConfig';
import { doc, increment, setDoc, updateDoc } from 'firebase/firestore';
import { Heart, MessageCircle } from 'lucide-react';
import EventCommentModal from './EventCommentModal';

interface EventsListProps {
    communityId?: string;
    userId: string;
}

export default function EventsList({ communityId, userId }: EventsListProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const openCommentModal = () => {
        // setSelectedEventId(eventId);
        setIsCommentModalOpen(true);
    };

    const closeCommentModal = () => {
        setIsCommentModalOpen(false);
        setSelectedEventId(null);
    };

    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                const fetchedEvents = await fetchEvents(communityId);
                setEvents(fetchedEvents);
            } catch (err) {
                setError('Failed to load events');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        console.log(`Events for community ID ${communityId}:`, events);
        loadEvents();
    }, [communityId]);

   // Function to handle liking an event
const handleLike = async (eventId: string, userId: string) => {
    try {
        // Reference to the specific like document
        const likeRef = doc(db, 'eventVariantLikes', `${eventId}_${userId}`);

        // Add a like document for the user-event pair
        await setDoc(likeRef, {
            eventVariantId: eventId,
            userId: userId
        });

        // Reference to the like counter document
        const likeCounterRef = doc(db, 'eventLikeCounter', eventId);

        // Increment the like counter
        await updateDoc(likeCounterRef, {
            like: increment(1)
        });
    } catch (error) {
        console.error('Error liking event:', error);
    }
};

    if (loading) return <div>Loading events...</div>;
    if (error) return <div>Error: {error}</div>;
    if (events.length === 0) return <div>No events found</div>;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
            {events.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg shadow">
                    {event.image && (
                        <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-48 object-cover rounded-lg mb-4" 
                        />
                    )}
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-2">{event.summary}</p>
                    <p className="text-sm text-gray-500">
                        {new Date(event.startDate).toLocaleDateString()} - 
                        {new Date(event.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={() => handleLike(event.id, userId)}
                            className="flex items-center gap-2 text-gray-600 hover:text-greenTheme"
                        >
                            <Heart className="w-5 h-5" />
                            <span>Like</span>
                        </button>
                        <button
                            onClick={openCommentModal}
                            className="flex items-center gap-2 text-gray-600 hover:text-greenTheme"
                        >
                            <MessageCircle size={20} />
                            Comment
                        </button>
                    </div>
                </div>
            ))}
                        {/* Comment Modal */}
                        {selectedEventId && (
                <EventCommentModal
                    isOpen={isCommentModalOpen}
                    onClose={closeCommentModal}
                    eventId={selectedEventId}
                />
            )}
        </div>
    );
}