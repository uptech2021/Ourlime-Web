import { useEffect, useState } from 'react';
import { fetchEvents } from '@/helpers/Events';
import { Event } from '@/types/eventTypes';
import { auth, db } from '@/lib/firebaseConfig';
import { addDoc, collection, doc, getDoc, getDocs, increment, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Heart, MessageCircle } from 'lucide-react';
import EventCommentModal from './EventCommentModal';
import { Button } from '@nextui-org/react';

interface EventsListProps {
    communityVariantId?: string;
    userId: string;
}

export default function EventsList({ communityVariantId }: EventsListProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [likedEvents, setLikedEvents] = useState<{ [key: string]: boolean }>({});
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const currentUserId = auth.currentUser?.uid; 

    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                const fetchedEvents = await fetchEvents(communityVariantId);
                setEvents(fetchedEvents);
            } catch (err) {
                setError('Failed to load events');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, [communityVariantId]);

    // Fetch liked events for the user on mount
    useEffect(() => {
        if (!currentUserId) return;

        const fetchLikedEvents = async () => {
            try {
                const likesQuery = query(collection(db, 'eventVariantLikes'), where('userId', '==', currentUserId));
                const likesSnapshot = await getDocs(likesQuery);

                const likedEventIds: { [key: string]: boolean } = {};
                likesSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    likedEventIds[data.eventVariantId] = true;
                });

                setLikedEvents(likedEventIds);
            } catch (error) {
                console.error("Error fetching liked events:", error);
            }
        };

        fetchLikedEvents();
    }, [currentUserId]);

    const handleLike = async (eventId: string) => {
        if (!currentUserId) return;

        try {
            const likeRef = doc(db, 'eventVariantLikes', `${eventId}_${currentUserId}`);
            const likeCounterRef = doc(db, 'eventLikeCounter', eventId);

            if (likedEvents[eventId]) {
                // Unlike the event
                await deleteDoc(likeRef);
                await updateDoc(likeCounterRef, {
                    like: increment(-1),
                });
                setLikedEvents((prev) => {
                    const updatedLikes = { ...prev };
                    delete updatedLikes[eventId];
                    return updatedLikes;
                });
            } else {
                // Like the event
                await setDoc(likeRef, {
                    eventVariantId: eventId,
                    userId: currentUserId
                });

                const likeCounterSnap = await getDoc(likeCounterRef);
                if (likeCounterSnap.exists()) {
                    await updateDoc(likeCounterRef, {
                        like: increment(1),
                    });
                } else {
                    await setDoc(likeCounterRef, { like: 1 });
                }

                setLikedEvents((prev) => ({ ...prev, [eventId]: true }));
            }
        } catch (error) {
            console.error('Error liking event:', error);
        }
    };

    const handleRegisterForEvent = async (eventId: string) => {
        try {
            await addDoc(collection(db, 'eventSubscription'), {
                isAttending: true,
                userId: currentUserId,
                eventId: eventId
            });
            console.log('User registered for event:', eventId);
        } catch (error) {
            console.error('Error registering for event:', error);
        }
    };

    const openCommentsModal = async (eventId: string) => {
        setSelectedEventId(eventId);
        setIsCommentModalOpen(true);
    }

    if (loading) return <div>Loading events...</div>;
    if (error) return <div>Error: {error}</div>;
    if (events.length === 0) return <div>No events found</div>;

    return (
        <div className="grid grid-cols-1 w-full gap-4 md:grid-cols-2 mb-4">
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

                    {event.userId !== currentUserId && (
                        <Button onClick={() => handleRegisterForEvent(event.id)}>
                            Register
                        </Button>
                    )}

                    <div className="flex items-center gap-4 mt-4">
                        <button
                            onClick={() => handleLike(event.id)}
                            className={`flex items-center gap-2 ${
                                likedEvents[event.id] ? 'text-greenTheme' : 'text-gray-600'
                            } hover:text-greenTheme transition-colors`}
                        >
                            <Heart className="w-5 h-5" fill={likedEvents[event.id] ? 'currentColor' : 'none'} />
                            <span>{likedEvents[event.id] ? 'Liked' : 'Like'}</span>
                        </button>

                        <button
                            onClick={() => openCommentsModal(event.id)}
                            className="flex items-center gap-2 text-gray-600 hover:text-greenTheme"
                        >
                            <MessageCircle size={20} />
                            Comment
                        </button>
                    </div>
                </div>
            ))}

            {isCommentModalOpen && selectedEventId && (
                <EventCommentModal
                    onClose={() => setIsCommentModalOpen(false)}
                    eventId={selectedEventId}
                />
            )}
        </div>
    );
}
