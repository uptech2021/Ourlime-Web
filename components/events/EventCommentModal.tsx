import React, { useState } from 'react';
import { Button, Textarea } from '@nextui-org/react';
import { db } from '@/lib/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

interface EventCommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventId: string;
}

const EventCommentModal: React.FC<EventCommentModalProps> = ({ isOpen, onClose, eventId }) => {
    const [comment, setComment] = useState('');

    const handleCommentSubmit = async () => {
        if (comment.trim()) {
            try {
                await addDoc(collection(db, 'eventVariantComments'), {
                    eventVariantId: eventId,
                    comment,
                    userId: 'currentUserId', // Replace with actual user ID
                    timestamp: new Date()
                });
                setComment('');
                onClose();
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment here..."
                    fullWidth
                    rows={4}
                />
                <div className="flex justify-end mt-4">
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleCommentSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EventCommentModal;