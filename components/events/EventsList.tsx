import { useEffect, useState } from 'react';
import { fetchEvents } from '@/helpers/Events';
import { Event } from '@/types/eventTypes';
import { auth, db } from '@/lib/firebaseConfig';
import { addDoc, collection, doc, getDoc, getDocs, increment, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Heart, MessageCircle } from 'lucide-react';
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

                        <div className="flex items-center gap-4 mt-4">
                            <button
                                onClick={() => console.log('Liked')}
                                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                            >
                                <Heart className="w-5 h-5" />
                                Like
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
