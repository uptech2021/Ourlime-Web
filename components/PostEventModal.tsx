import React, { useState } from 'react';
import { Button, DatePicker } from '@nextui-org/react';
import { db } from '@/lib/firebaseConfig'; // Import your Firebase config
import { addDoc, collection } from 'firebase/firestore';
import { Event } from '@/types/eventTypes'; // Import the Event type

interface PostEventModalProps {
    onClose: () => void;
}

const PostEventModal: React.FC<PostEventModalProps> = ({ onClose }) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title && description && startDate && endDate) {
            const eventData: Event = {
                title,
                description,
                startDate,
                endDate,
            };

            try {
                // Add the event data to the Firestore collection
                await addDoc(collection(db, 'events'), eventData);
                // Reset fields after submission
                setTitle('');
                setDescription('');
                setStartDate(null);
                setEndDate(null);
                onClose(); // Close the modal after submission
            } catch (error) {
                console.error("Error adding event:", error);
            }
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close modal"
                >
                    X
                </button>

                <h3 className="font-semibold mb-4">Create Event</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Event Title"
                            className="w-full p-2 border rounded"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <textarea
                            placeholder="Event Description"
                            className="w-full p-2 border rounded"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Start Date</label>
                        <DatePicker
                            onChange={(date) => setStartDate(date.toString())}
                            className="w-full p-2 border rounded"
                            showMonthAndYearPickers
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">End Date</label>
                        <DatePicker
                            onChange={(date) => setEndDate(date.toString())}
                            className="w-full p-2 border rounded"
                            showMonthAndYearPickers
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" className="bg-greenTheme text-white rounded px-4 py-2">
                            Post Event
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostEventModal; 