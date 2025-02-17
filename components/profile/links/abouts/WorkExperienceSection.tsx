'use client';

import { Building2, Briefcase, Plus, X, Pencil, Check, Loader2 } from 'lucide-react';
import { UserData } from '@/types/userTypes';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebaseConfig';

interface WorkExperience {
    id: string;
    role: string;
    company: string;
    startDate: Date;
    endDate?: Date | null;
    current: boolean;
    description: string;
}

interface FormData {
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface WorkExperienceSectionProps {
    userData: UserData;
}

export default function WorkExperienceSection({ userData }: WorkExperienceSectionProps) {
    const [experiences, setExperiences] = useState<WorkExperience[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        role: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
    });

    useEffect(() => {
        fetchWorkExperience();
    }, []);

    const formatDateForInput = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const handleExperienceEdit = (experience: WorkExperience) => {
        setFormData({
            role: experience.role,
            company: experience.company,
            startDate: formatDateForInput(new Date(experience.startDate)),
            endDate: experience.endDate ? formatDateForInput(new Date(experience.endDate)) : '',
            current: experience.current,
            description: experience.description
        });
        setEditingId(experience.id);
    };

    const fetchWorkExperience = async (): Promise<void> => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const response = await fetch(`/api/profile/abouts/workExperience?userId=${userId}`);
            const data = await response.json();
            setExperiences(data);
        } catch (error) {
            console.error('Error fetching work experience:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (): Promise<void> => {
        setSubmitting(true);
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const workData = {
                ...formData,
                startDate: new Date(formData.startDate),
                endDate: formData.current ? null : new Date(formData.endDate)
            };

            const response = await fetch('/api/profile/abouts/workExperience', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, workData })
            });

            const data = await response.json();
            setExperiences(prev => [...prev, data]);
            setShowAddForm(false);
            resetForm();
        } catch (error) {
            console.error('Error adding work experience:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (id: string): Promise<void> => {
        setSubmitting(true);
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            const workData = {
                ...formData,
                startDate: new Date(formData.startDate),
                endDate: formData.current ? null : new Date(formData.endDate)
            };

            const response = await fetch('/api/profile/abouts/workExperience', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, id, workData })
            });

            const data = await response.json();
            setExperiences(prev => prev.map(exp => exp.id === id ? data : exp));
            setEditingId(null);
            resetForm();
        } catch (error) {
            console.error('Error updating work experience:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string): Promise<void> => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            await fetch(`/api/profile/abouts/workExperience?userId=${userId}&id=${id}`, {
                method: 'DELETE'
            });
            setExperiences(prev => prev.filter(exp => exp.id !== id));
        } catch (error) {
            console.error('Error deleting work experience:', error);
        }
    };

    const resetForm = (): void => {
        setFormData({
            role: '',
            company: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="animate-pulse">Loading work experience...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <Building2 className="text-greenTheme" />
                    Work Experience
                </h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-greenTheme hover:bg-green-50 rounded-lg transition-colors"
                >
                    <Plus size={16} />
                    Add Experience
                </button>
            </div>

            <div className="space-y-4">
                {experiences.map((experience) => (
                    <div key={experience.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <Briefcase className="text-greenTheme" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-medium text-gray-900">{experience.role}</h4>
                                    <p className="text-gray-600">{experience.company}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(experience.startDate).toLocaleDateString()} - 
                                        {experience.current ? 'Present' : experience.endDate && new Date(experience.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleExperienceEdit(experience)}
                                        className="text-gray-500 hover:text-gray-700"
                                        title="Edit experience"
                                    >
                                        <Pencil size={16} />
                                        <span className="sr-only">Edit experience</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(experience.id)}
                                        className="text-red-500 hover:text-red-600"
                                        title="Delete experience"
                                    >
                                        <X size={16} />
                                        <span className="sr-only">Delete experience</span>
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 mt-2">{experience.description}</p>
                        </div>
                    </div>
                ))}

                {(showAddForm || editingId) && (
                    <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                <input
                                    id="role"
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g. Software Engineer"
                                />
                            </div>
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                <input
                                    id="company"
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g. Tech Corp"
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
                            <label htmlFor="current" className="text-sm text-gray-600">I currently work here</label>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full px-3 py-2 border rounded-lg"
                                rows={4}
                                placeholder="Describe your responsibilities and achievements"
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
