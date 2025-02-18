'use client';

import { GraduationCap, School, Plus, X, Pencil, Check, Loader2 } from 'lucide-react';
import { UserData } from '@/types/userTypes';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebaseConfig';

interface Education {
    id: string;
    degree: string;
    school: string;
    startDate: Date;
    endDate?: Date | null;
    current: boolean;
    description: string;
}

interface FormData {
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface EducationSectionProps {
    userData: UserData;
}

export default function EducationSection({ userData }: EducationSectionProps) {
    const [education, setEducation] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        degree: '',
        school: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
    });

    useEffect(() => {
        fetchEducation();
    }, []);

    const formatDateForInput = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const handleEducationEdit = (education: Education) => {
        setFormData({
            degree: education.degree,
            school: education.school,
            startDate: formatDateForInput(new Date(education.startDate)),
            endDate: education.endDate ? formatDateForInput(new Date(education.endDate)) : '',
            current: education.current,
            description: education.description
        });
        setEditingId(education.id);
    };

    const fetchEducation = async (): Promise<void> => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const response = await fetch(`/api/profile/abouts/education?userId=${userId}`);
            const data = await response.json();
            setEducation(data);
        } catch (error) {
            console.error('Error fetching education:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (): Promise<void> => {
        setSubmitting(true);
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const educationData = {
                ...formData,
                startDate: new Date(formData.startDate),
                endDate: formData.current ? null : new Date(formData.endDate)
            };

            const response = await fetch('/api/profile/abouts/education', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, educationData })
            });

            const data = await response.json();
            setEducation(prev => [...prev, data]);
            setShowAddForm(false);
            resetForm();
        } catch (error) {
            console.error('Error adding education:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (id: string): Promise<void> => {
        setSubmitting(true);
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const educationData = {
                ...formData,
                startDate: new Date(formData.startDate),
                endDate: formData.current ? null : new Date(formData.endDate)
            };

            const response = await fetch('/api/profile/abouts/education', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, id, educationData })
            });

            const data = await response.json();
            setEducation(prev => prev.map(edu => edu.id === id ? data : edu));
            setEditingId(null);
            resetForm();
        } catch (error) {
            console.error('Error updating education:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string): Promise<void> => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            await fetch(`/api/profile/abouts/education?userId=${userId}&id=${id}`, {
                method: 'DELETE'
            });
            setEducation(prev => prev.filter(edu => edu.id !== id));
        } catch (error) {
            console.error('Error deleting education:', error);
        }
    };

    const resetForm = (): void => {
        setFormData({
            degree: '',
            school: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="animate-pulse">Loading education history...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <GraduationCap className="text-greenTheme" />
                    Education
                </h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-greenTheme hover:bg-green-50 rounded-lg transition-colors"
                >
                    <Plus size={16} />
                    Add Education
                </button>
            </div>

            <div className="space-y-4">
                {education.map((edu) => (
                    <div key={edu.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <School className="text-greenTheme" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                                    <p className="text-gray-600">{edu.school}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(edu.startDate).toLocaleDateString()} - 
                                        {edu.current ? 'Present' : edu.endDate && new Date(edu.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEducationEdit(edu)}
                                        className="text-gray-500 hover:text-gray-700"
                                        title="Edit education"
                                        aria-label="Edit education"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(edu.id)}
                                        className="text-red-500 hover:text-red-600"
                                        title="Delete education"
                                        aria-label="Delete education"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-2">{edu.description}</p>
                        </div>
                    </div>
                ))}

                {(showAddForm || editingId) && (
                    <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                <input
                                    id="degree"
                                    type="text"
                                    value={formData.degree}
                                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g. Bachelor of Science"
                                />
                            </div>
                            <div>
                                <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">School</label>
                                <input
                                    id="school"
                                    type="text"
                                    value={formData.school}
                                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g. University Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>
                            {!formData.current && (
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                id="current"
                                type="checkbox"
                                checked={formData.current}
                                onChange={(e) => setFormData({...formData, current: e.target.checked, endDate: ''})}
                                className="rounded"
                            />
                            <label htmlFor="current" className="text-sm text-gray-600">I currently study here</label>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows={4}
                                placeholder="Describe your studies and achievements"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setEditingId(null);
                                    resetForm();
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
                                disabled={submitting}
                                className="px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
