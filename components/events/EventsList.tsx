import { useEffect, useState } from 'react';
import { fetchEvents } from '@/helpers/Events';
import { Event } from '@/types/eventTypes';
import { auth, db } from '@/lib/firebaseConfig';
import { addDoc, collection, doc, getDoc, getDocs, increment, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Heart, MessageCircle, CheckCircle } from 'lucide-react';
import EventCommentModal from './EventCommentModal';
import { Button } from '@nextui-org/react';
import Slider from '../comm/Slider';

interface EventsListProps {
    communityVariantId?: string;
    userId: string;
}

export default function EventsList({ communityVariantId }: EventsListProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [likedEvents, setLikedEvents] = useState<{ [key: string]: boolean }>({});
    const [registeredEvents, setRegisteredEvents] = useState<{ [key: string]: boolean }>({});
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [registrationMessage, setRegistrationMessage] = useState<{ [key: string]: boolean }>({});
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

        const fetchRegisteredEvents = async () => {
            try {
                const registeredQuery = query(collection(db, 'eventSubscription'), where('userId', '==', currentUserId));
                const registeredSnapshot = await getDocs(registeredQuery);

                const registeredEventIds: { [key: string]: boolean } = {};
                registeredSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    registeredEventIds[data.eventId] = true;
                });

                setRegisteredEvents(registeredEventIds);
            } catch (error) {
                console.error("Error fetching registered events:", error);
            }
        };

        fetchLikedEvents();
        fetchRegisteredEvents();
    }, [currentUserId]);

    const handleLike = async (eventId: string) => {
        if (!currentUserId) return;

        try {
            const likeRef = doc(db, 'eventVariantLikes', `${eventId}_${currentUserId}`);
            const likeCounterRef = doc(db, 'eventLikeCounter', eventId);

            if (likedEvents[eventId]) {
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
                    await setDoc(likeCounterRef, { 
                        like: 1,
                        eventVariantId: eventId 
                    });
                }

                setLikedEvents((prev) => ({ ...prev, [eventId]: true }));
            }
        } catch (error) {
            console.error('Error liking event:', error);
        }
    };

    const handleRegisterForEvent = async (eventId: string) => {
        if (registeredEvents[eventId]) return;

        try {
            await addDoc(collection(db, 'eventSubscription'), {
                isAttending: true,
                userId: currentUserId,
                eventId: eventId
            });

            setRegisteredEvents(prev => ({ ...prev, [eventId]: true }));
            setRegistrationMessage(prev => ({ ...prev, [eventId]: true }));

            setTimeout(() => {
                setRegistrationMessage(prev => {
                    const updatedMessages = { ...prev };
                    delete updatedMessages[eventId];
                    return updatedMessages;
                });
            }, 3000);
        } catch (error) {
            console.error('Error registering for event:', error);
        }
    };

    const openCommentsModal = async (eventId: string) => {
        setSelectedEventId(eventId);
        setIsCommentModalOpen(true);
    };

    if (loading) return <div>Loading events...</div>;
    if (error) return <div>Error: {error}</div>;
    if (events.length === 0) return <div>No events found</div>;

    return (
        <div className="w-full mb-4">
            <Slider>
                {events.map((event) => (
                    <div key={event.id} className="flex-none w-full md:w-1/2 p-4 border rounded-lg shadow">
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
                            <div className="mt-4">
                                {registeredEvents[event.id] ? (
                                    <Button disabled className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md flex items-center gap-2">
                                        <CheckCircle size={16} />
                                        Registered
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={() => handleRegisterForEvent(event.id)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                    >
                                        Register
                                    </Button>
                                )}

                                {registrationMessage[event.id] && (
                                    <p className="text-green-600 text-sm mt-2">You have successfully registered!</p>
                                )}
                            </div>
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
                                className="flex items-center gap-2 text-gray-600 hover:text-green-600"
                            >
                                <MessageCircle size={20} />
                                Comment
                            </button>
                        </div>
                    </div>
                ))}
            </Slider>

            {isCommentModalOpen && selectedEventId && (
                <EventCommentModal
                    onClose={() => setIsCommentModalOpen(false)}
                    eventId={selectedEventId}
                />
            )}
        </div>
    );
}
