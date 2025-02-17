import React, { useState, useEffect } from 'react';
import { Button, DatePicker } from '@nextui-org/react';
import { db, auth, storage } from '@/lib/firebaseConfig';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Upload, X } from 'lucide-react';

interface PostEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    communityVariantId?: string;
}

const PostEventModal: React.FC<PostEventModalProps> = ({ isOpen, onClose, communityVariantId }) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState('');
    const [summary, setSummary] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState<string>('');
    const userId = auth.currentUser?.uid;
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // Update previews when selectedFiles changes
    useEffect(() => {
        if (selectedFiles.length > 0) {
            const newPreviews: string[] = [];
            selectedFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string);
                    if (newPreviews.length === selectedFiles.length) {
                        setPreviews(newPreviews);
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            setPreviews([]);
        }
    }, [selectedFiles]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]); // Updates selected files
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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

                const eventData: any = {
                    title,
                    summary,
                    startDate,
                    endDate,
                    location,
                    userId,
                    ...(imageUrl && { image: imageUrl })
                };

                if (communityVariantId) {
                    eventData.communityVariantId = communityVariantId;
                }

                const eventRef = await addDoc(collection(db, 'events'), eventData);

                const eventVariantData = {
                    eventId: eventRef.id,
                    title,
                    description
                };

                await addDoc(collection(db, 'eventVariant'), eventVariantData);

                setTitle('');
                setDescription('');
                setSummary('');
                setStartDate('');
                setEndDate('');
                setLocation('');
                setSelectedFiles([]);
                onClose();
            } catch (error) {
                console.error("Error adding event:", error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh] shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close modal"
                >
                    <X size={24} />
                </button>

                <h3 className="font-semibold text-xl text-center mb-4">Create Event</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Event Title"
                        className="w-full p-2 border rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Event Description"
                        className="w-full p-2 border rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Event Summary"
                        className="w-full p-2 border rounded"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Location"
                        className="w-full p-2 border rounded"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm">Start Date</label>
                            <DatePicker
                                onChange={(date) => setStartDate(date.toString())}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm">End Date</label>
                            <DatePicker
                                onChange={(date) => setEndDate(date.toString())}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                            <Upload className="text-gray-400 w-10 h-10 mb-2" />
                            <p className="text-gray-600 text-sm">Upload event image</p>
                            <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 mt-2">
                                Browse Files
                            </button>
                        </label>

                        {previews.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {previews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="rounded-lg object-cover w-24 h-24"
                                        />
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            title="Remove"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Post Event
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostEventModal;
