import React, { useState } from 'react';
import { Button, DatePicker } from '@nextui-org/react';
import { db, auth, storage } from '@/lib/firebaseConfig';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { Event } from '@/types/eventTypes';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Upload, X } from 'lucide-react';

interface PostEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    communityVariantId?: string;
}

const PostEventModal: React.FC<PostEventModalProps> = ({ isOpen, onClose, communityVariantId }) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState('')
    const [summary, setSummary] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState<string>('');
    const userId = auth.currentUser?.uid;
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title && summary && startDate && endDate && location && userId) {
            try {
                let imageUrl = '';
                
                if (selectedFiles.length > 0) {
                    const file = selectedFiles[0];
                    const storageRef = ref(storage, `eventImages/${Date.now()}_${file.name}`);
                    const uploadResult = await uploadBytes(storageRef, file);
                    imageUrl = await getDownloadURL(uploadResult.ref);
                }
    
                // Create event data
                const eventData: any = {
                    title,
                    summary,
                    startDate,
                    endDate,
                    location,
                    userId,
                    ...(imageUrl && { image: imageUrl })
                };
    
                // Conditionally add communityVariantId
                if (communityVariantId) {
                    eventData.communityVariantId = communityVariantId;
                }
    
                // Add the event data to Firestore
                const eventRef = await addDoc(collection(db, 'events'), eventData);
    
                // Create eventVariant data
                const eventVariantData = {
                    eventId: eventRef.id,
                    title,
                    description
                };
    
                // Add the eventVariant data to Firestore
                await addDoc(collection(db, 'eventVariant'), eventVariantData);
    
                // Reset form
                setTitle('');
                setDescription('');
                setSummary('');
                setStartDate('');
                setEndDate('');
                setLocation('');
                setSelectedFiles([]);
                setPreviews([]);
                onClose();
            } catch (error) {
                console.error("Error adding event:", error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close modal"
                >
                    <X size={24} />
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
                        <textarea
                            placeholder="Event Summary"
                            className="w-full p-2 border rounded"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Location"
                            className="w-full p-2 border rounded"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-1">Start Date</label>
                            <DatePicker
                                onChange={(date) => setStartDate(date.toString())}
                                className="w-full p-2 border rounded"
                                showMonthAndYearPickers
                                classNames={{
                                    base: "text-black",
                                    selectorIcon: "text-black",
                                    input: "text-black"
                                }}
                            />
                        </div>
                        <div>
                            <label className="block mb-1">End Date</label>
                            <DatePicker
                                onChange={(date) => setEndDate(date.toString())}
                                className="w-full p-2 border rounded"
                                showMonthAndYearPickers
                                classNames={{
                                    base: "text-black",
                                    selectorIcon: "text-black",
                                    input: "text-black"
                                }}
                            />
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="border-2 border-dashed rounded-lg p-8 mb-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="text-center">
                                <Upload className="mx-auto text-gray-400 w-12 h-12" aria-hidden="true" />
                                <p className="text-gray-600">Upload event image</p>
                                <span className="text-sm text-gray-400">or</span>
                                <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
                                    Browse Files
                                </button>
                            </div>
                        </label>

                        {previews.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {previews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="rounded-lg object-cover w-full h-24"
                                        />
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            title="delete"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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