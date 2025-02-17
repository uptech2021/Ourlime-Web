import React, { useEffect, useState } from 'react';
import { Button, Textarea } from '@nextui-org/react';
import { auth, db } from '@/lib/firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { fetchEvents, fetchCommentsForEvent } from '@/helpers/Events';
import { Event } from '@/types/eventTypes';
import Image from 'next/image';

interface EventCommentModalProps {
    onClose: () => void;
    eventId: string;
}

const EventCommentModal: React.FC<EventCommentModalProps> = ({ onClose, eventId }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<any[]>([]);
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replies, setReplies] = useState<{ [key: string]: any[] }>({});

    useEffect(() => {
        const loadEventDetails = async () => {
            try {
                const fetchedEvents = await fetchEvents();
                const selectedEvent = fetchedEvents.find(e => e.id === eventId);
                setEvent(selectedEvent || null);
            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setLoading(false);
            }
        };

        loadEventDetails();
    }, [eventId]);

    useEffect(() => {
        const loadComments = async () => {
            const fetchedComments = await fetchCommentsForEvent(eventId);
            setComments(fetchedComments);
            console.log("Event comments: ", fetchedComments);
        };

        loadComments();
    }, [eventId]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents page reload

        // Ensure the user is logged in before submitting
        const user = auth.currentUser;
        if (!user) {
            console.error("User is not logged in");
            return;
        }

        if (comment.trim()) {
            try {
                await addDoc(collection(db, 'eventVariantComments'), {
                    eventVariantId: eventId,
                    comment,
                    userId: user.uid, // Ensure we fetch user ID dynamically
                    timestamp: serverTimestamp(),
                });

                setComment('');
                
                // Fetch updated comments
                const updatedComments = await fetchCommentsForEvent(eventId);
                setComments(updatedComments);
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl md:flex md:items-stretch">
                {/* Event Image - Left side on larger screens */}
                {event && event.image && (
                    <div className="hidden md:flex w-1/2 p-4">
                        <Image
                            src={event.image}
                            alt={event.title}
                            width={300}
                            height={300}
                            className="rounded-lg object-cover w-full"
                        />
                    </div>
                )}

                {/* Event Details & Comments */}
                <div className="w-full md:w-1/2 flex flex-col p-6">
                    <button className="self-end text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>

                    {/* Event Details */}
                    {loading ? (
                        <p className="text-gray-500">Loading event details...</p>
                    ) : event ? (
                        <div className="mb-4">
                            {event.image && (
                                <div className="md:hidden w-full mb-4">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        width={300}
                                        height={200}
                                        className="rounded-lg object-cover w-full"
                                    />
                                </div>
                            )}
                            <h3 className="text-lg font-semibold">{event.title}</h3>
                            <p className="text-gray-600 text-sm">
                                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500 text-sm">{event.location}</p>
                            <p className="text-gray-700 mt-2">{event.summary}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">Event not found</p>
                    )}

                    {/* Comments Section */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
                        {comments.map((c) => (
                            <div key={c.id} className="border-b pb-2">
                                <div className="flex items-start space-x-3">
                                    <img
                                        src={c.profileImage || "/default-avatar.png"}
                                        alt={`${c.userData?.firstName}'s avatar`}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {c.userData?.firstName} {c.userData?.lastName}
                                            <span className="text-gray-400">@{c.userData?.userName}</span>
                                        </p>
                                        <p className="text-gray-600 text-sm">{c.comment}</p>
                                        <p className="text-xs text-gray-400 mt-1">{c.timestamp.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comment Input Box */}
                    <div className="p-4 border-t">
                        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
                            <textarea
                                className="flex-1 border rounded-md p-2 text-sm resize-none"
                                placeholder="Write your comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button type="submit" className="px-4 py-2 bg-greenTheme text-white rounded-md">
                                Post
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCommentModal;
