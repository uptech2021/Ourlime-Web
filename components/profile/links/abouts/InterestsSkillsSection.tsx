'use client';

import { Code, Heart, Plus, X, Pencil, Check, Loader2 } from 'lucide-react';
import { UserData } from '@/types/userTypes';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebaseConfig';

interface Interest {
    id: string;
    value: string;
}

interface WorkExperienceSectionProps {
    userData: UserData;
}

export default function InterestSkillsSection({ userData }: WorkExperienceSectionProps) {
    const [interests, setInterests] = useState<Interest[]>([]);
    const [skills, setSkills] = useState<Interest[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddInterest, setShowAddInterest] = useState(false);
    const [showAddSkill, setShowAddSkill] = useState(false);
    const [newInterest, setNewInterest] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInterestsAndSkills();
    }, []);

    const fetchInterestsAndSkills = async () => {
        try {
            const userId = auth.currentUser?.uid;
            const response = await fetch(`/api/profile/abouts/interests?userId=${userId}`);
            const data = await response.json();
            setInterests(data.interests || []);
            setSkills(data.skills || []);
        } catch (error) {
            console.error('Error fetching interests and skills:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (type: 'interests' | 'skills', value: string) => {
        setSubmitting(true);
        try {
            const userId = auth.currentUser?.uid;
            const response = await fetch('/api/profile/abouts/interests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, type, value })
            });
            const data = await response.json();
            
            if (type === 'interests') {
                setInterests([...interests, data]);
                setShowAddInterest(false);
                setNewInterest('');
            } else {
                setSkills([...skills, data]);
                setShowAddSkill(false);
                setNewSkill('');
            }
        } catch (error) {
            console.error('Error adding:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (id: string, value: string) => {
        setSubmitting(true);
        try {
            const userId = auth.currentUser?.uid;
            const response = await fetch('/api/profile/abouts/interests', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, id, value })
            });
            const data = await response.json();
            
            const updatedItem = { id, value: data.value };
            if (interests.find(i => i.id === id)) {
                setInterests(interests.map(item => item.id === id ? updatedItem : item));
            } else {
                setSkills(skills.map(item => item.id === id ? updatedItem : item));
            }
            setEditingId(null);
            setEditValue('');
        } catch (error) {
            console.error('Error updating:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const userId = auth.currentUser?.uid;
            await fetch(`/api/profile/abouts/interests?userId=${userId}&id=${id}`, {
                method: 'DELETE'
            });
            
            if (interests.find(i => i.id === id)) {
                setInterests(interests.filter(item => item.id !== id));
            } else {
                setSkills(skills.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    if (loading) {
        return (
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="animate-pulse">Loading interests and skills...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Interests */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                        <Heart className="text-greenTheme" />
                        Interests
                    </h3>
                    <button
                        onClick={() => setShowAddInterest(true)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-greenTheme hover:bg-green-50 rounded-lg transition-colors"
                        title="Add Interest"
                    >
                        <Plus size={16} />
                        Add Interest
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                        <div key={interest.id} className="group relative">
                            {editingId === interest.id ? (
                                <div className="flex items-center gap-2">
                                    <label htmlFor={`edit-interest-${interest.id}`} className="sr-only">Edit interest</label>
                                    <input
                                        id={`edit-interest-${interest.id}`}
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="px-3 py-1.5 border rounded-lg text-sm"
                                        placeholder="Edit interest"
                                    />
                                    <button
                                        onClick={() => handleUpdate(interest.id, editValue)}
                                        disabled={submitting}
                                        className="text-green-500 hover:text-green-600"
                                        title="Save"
                                    >
                                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={16} />}
                                    </button>
                                </div>
                            ) : (
                                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium flex items-center gap-2">
                                    {interest.value}
                                    <button
                                        onClick={() => {
                                            setEditingId(interest.id);
                                            setEditValue(interest.value);
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                        title="Edit"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(interest.id)}
                                        className="text-red-500 hover:text-red-600"
                                        title="Delete"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                        </div>
                    ))}                    {showAddInterest && (                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newInterest}
                                onChange={(e) => setNewInterest(e.target.value)}
                                placeholder="Enter interest"
                                className="px-3 py-1.5 border rounded-lg text-sm"
                            />
                            <button
                                onClick={() => handleAdd('interests', newInterest)}
                                disabled={submitting}
                                className="text-green-500 hover:text-green-600"
                                title="Add Interest"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={16} />}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddInterest(false);
                                    setNewInterest('');
                                }}
                                className="text-red-500 hover:text-red-600"
                                title="Cancel"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
    
            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                        <Code className="text-greenTheme" />
                        Skills
                    </h3>
                    <button
                        onClick={() => setShowAddSkill(true)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-greenTheme hover:bg-green-50 rounded-lg transition-colors"
                        title="Add Skill"
                    >
                        <Plus size={16} />
                        Add Skill
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <div key={skill.id} className="group relative">
                            {editingId === skill.id ? (
                                <div className="flex items-center gap-2">
                                    <label htmlFor={`edit-skill-${skill.id}`} className="sr-only">Edit skill</label>
                                    <input
                                        id={`edit-skill-${skill.id}`}
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="px-3 py-1.5 border rounded-lg text-sm"
                                        placeholder="Edit skill"
                                    />
                                    <button
                                        onClick={() => handleUpdate(skill.id, editValue)}
                                        disabled={submitting}
                                        className="text-green-500 hover:text-green-600"
                                        title={submitting ? "Updating..." : "Update skill"}
                                    >
                                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={16} />}
                                    </button>
                                </div>
                            ) : (
                                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium flex items-center gap-2">
                                    {skill.value}
                                    <button
                                        onClick={() => {
                                            setEditingId(skill.id);
                                            setEditValue(skill.value);
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                        title="Edit skill"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(skill.id)}
                                        className="text-red-500 hover:text-red-600"
                                        title="Delete skill"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                        </div>
                    ))}
                    {showAddSkill && (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Enter skill"
                                className="px-3 py-1.5 border rounded-lg text-sm"
                            />
                            <button
                                onClick={() => handleAdd('skills', newSkill)}
                                disabled={submitting}
                                className="text-green-500 hover:text-green-600"
                                title="Add Skill"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={16} />}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddSkill(false);
                                    setNewSkill('');
                                }}
                                className="text-red-500 hover:text-red-600"
                                title="Cancel"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    
}