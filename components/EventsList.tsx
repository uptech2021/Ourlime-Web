import { useEffect, useState } from 'react';
import { fetchEvents } from '@/helpers/Events';
import { Event } from '@/types/eventTypes';

interface EventsListProps {
    communityId?: string;
}

export default function EventsList({ communityId }: EventsListProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

        loadEvents();
    }, [communityId]);

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
                </div>
            ))}
        </div>
    );
}