'use client';

import { useState, ReactNode } from 'react';
import { Button } from '@nextui-org/react';
import { X, Plus, Building2, Clock, Briefcase } from 'lucide-react';
import { auth } from '@/lib/firebaseConfig';
import toast from 'react-hot-toast';

interface JobCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Question {
    question: string;
    answerType: 'input' | 'checkbox' | 'dropdown';
    options: string[];
}

interface LocationDetails {
    type: 'onsite' | 'hybrid' | 'remote';
    address?: string;
    city?: string;
    country?: string;
}

interface CompanyDetails {
    name: string;
    size: string;
    industry: string;
    benefits: string[];
}

interface ProjectDetails {
    timeline: string;
    milestones: string[];
    deliverables: string[];
    technicalRequirements: string[];
}

interface TaskDetails {
    urgency: 'low' | 'medium' | 'high';
    duration: string;
    complexity: 'simple' | 'moderate' | 'complex';
}

export default function JobCreationModal({ isOpen, onClose }: JobCreationModalProps): ReactNode {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [jobCategory, setJobCategory] = useState<'professional' | 'freelancer' | 'quickTask'>('professional');
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');
    const [requirements, setRequirements] = useState<string[]>([]);
    const [newRequirement, setNewRequirement] = useState('');
    const [qualifications, setQualifications] = useState<string[]>([]);
    const [newQualification, setNewQualification] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newBenefit, setNewBenefit] = useState('');

    // Category-specific states
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
        name: '',
        size: '',
        industry: '',
        benefits: []
    });
    const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
        timeline: '',
        milestones: [],
        deliverables: [],
        technicalRequirements: []
    });
    const [taskDetails, setTaskDetails] = useState<TaskDetails>({
        urgency: 'medium',
        duration: '',
        complexity: 'moderate'
    });

    const [locationDetails, setLocationDetails] = useState<LocationDetails>({
        type: 'remote'
    });

    const categoryIcons = {
        professional: Building2,
        freelancer: Briefcase,
        quickTask: Clock
    };

    const addItem = (
        item: string,
        items: string[],
        setItems: (items: string[]) => void,
        setNewItem: (item: string) => void
    ) => {
        if (item.trim()) {
            setItems([...items, item.trim()]);
            setNewItem('');
        }
    };

    const removeItem = (
        index: number,
        items: string[],
        setItems: (items: string[]) => void
    ) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // Questions Management
    const addQuestion = () => {
        setQuestions([...questions, {
            question: '',
            answerType: 'input',
            options: []
        }]);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value,
            options: field === 'answerType' && value === 'input' ? [] : updatedQuestions[index].options
        };
        setQuestions(updatedQuestions);
    };

    const addOption = (questionIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options.push('');
        setQuestions(updatedQuestions);
    };

    const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, index) => index !== optionIndex);
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!auth.currentUser?.uid || !title || !description || !priceFrom || !priceTo) {
            toast.error('Please fill in all required fields');
            setIsSubmitting(false);
            return;
        }

        const categoryData = {
            professional: { 
                companyDetails: {
                    ...companyDetails,
                    benefits: companyDetails.benefits 
                }
            },
            freelancer: { projectDetails },
            quickTask: { taskDetails }
        }[jobCategory];

        const jobData = {
            userId: auth.currentUser.uid,
            jobTitle: title,
            jobDescription: description,
            jobCategory,
            status: 'active',
            priceRange: {
                from: Number(priceFrom),
                to: Number(priceTo)
            },
            location: locationDetails,
            skills,
            requirements,
            qualifications,
            questions: questions.map(q => ({
                question: q.question,
                answerType: q.answerType,
                options: q.answerType !== 'input' ? q.options.filter(opt => opt.trim() !== '') : []
            })),
            ...categoryData
        };

        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jobData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                toast.success('Job created successfully!');
                setTimeout(() => onClose(), 1000);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error('Failed to create job. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };




    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-[10000]">
                <div className="flex justify-between items-center mb-6">
                    <h2 id="modal-title" className="text-2xl font-bold text-gray-800">Create New Job</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                        aria-label="Close modal"
                        title="Close modal"
                    >
                        <X size={24} className="text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Job Category Selection */}
                    <div className="space-y-3">
                        <label className="block text-lg font-semibold text-gray-700">Select Job Type</label>
                        <div className="grid grid-cols-3 gap-4" role="radiogroup" aria-label="Job type selection">
                            {['professional', 'freelancer', 'quickTask'].map((type) => {
                                const Icon = categoryIcons[type];
                                return (
                                    <label
                                        key={type}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-greenTheme/50 ${jobCategory === type ? 'border-greenTheme bg-greenTheme/10 shadow-md' : 'border-gray-200'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="jobCategory"
                                            value={type}
                                            checked={jobCategory === type}
                                            onChange={(e) => setJobCategory(e.target.value as typeof jobCategory)}
                                            className="hidden"
                                            aria-label={`Select ${type} job type`}
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <Icon size={24} className="text-greenTheme" />
                                            <span className="block text-center font-medium capitalize">
                                                {type === 'quickTask' ? 'Quick Task' : type}
                                            </span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category-specific fields */}
                    {jobCategory === 'professional' && (
                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-700">Company Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                                    <input
                                        id="companyName"
                                        type="text"
                                        value={companyDetails.name}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">Company Size</label>
                                    <select
                                        id="companySize"
                                        value={companyDetails.size}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, size: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                    >
                                        <option value="">Select size</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="501+">501+ employees</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                                    <input
                                        id="industry"
                                        type="text"
                                        value={companyDetails.industry}
                                        onChange={(e) => setCompanyDetails({ ...companyDetails, industry: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                        placeholder="e.g., Technology, Healthcare, Finance"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Benefits</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {companyDetails.benefits.map((benefit, index) => (
                                            <span key={index} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm flex items-center gap-2">
                                                {benefit}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newBenefits = companyDetails.benefits.filter((_, i) => i !== index);
                                                        setCompanyDetails({ ...companyDetails, benefits: newBenefits });
                                                    }}
                                                    className="text-gray-400 hover:text-red-500"
                                                    title='close'
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newBenefit}
                                            onChange={(e) => setNewBenefit(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (newBenefit.trim()) {
                                                        setCompanyDetails({
                                                            ...companyDetails,
                                                            benefits: [...companyDetails.benefits, newBenefit.trim()]
                                                        });
                                                        setNewBenefit('');
                                                    }
                                                }
                                            }}
                                            placeholder="Add a benefit"
                                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (newBenefit.trim()) {
                                                    setCompanyDetails({
                                                        ...companyDetails,
                                                        benefits: [...companyDetails.benefits, newBenefit.trim()]
                                                    });
                                                    setNewBenefit('');
                                                }
                                            }}
                                            className="px-4 py-2 bg-greenTheme text-white rounded-lg"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {jobCategory === 'freelancer' && (
                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-700">Project Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">Project Timeline</label>
                                    <input
                                        id="timeline"
                                        type="text"
                                        value={projectDetails.timeline}
                                        onChange={(e) => setProjectDetails({ ...projectDetails, timeline: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                        placeholder="e.g., 3 months"
                                        aria-label="Project timeline"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700">Project Deliverables</label>
                                    <textarea
                                        id="deliverables"
                                        value={projectDetails.deliverables.join('\n')}
                                        onChange={(e) => setProjectDetails({
                                            ...projectDetails,
                                            deliverables: e.target.value.split('\n').filter(item => item.trim() !== '')
                                        })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                        rows={4}
                                        placeholder="List your deliverables (one per line)"
                                        aria-label="Project deliverables"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="techRequirements" className="block text-sm font-medium text-gray-700">Technical Requirements</label>
                                    <textarea
                                        id="techRequirements"
                                        value={projectDetails.technicalRequirements.join('\n')}
                                        onChange={(e) => setProjectDetails({
                                            ...projectDetails,
                                            technicalRequirements: e.target.value.split('\n').filter(item => item.trim() !== '')
                                        })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                        rows={4}
                                        placeholder="List technical requirements (one per line)"
                                        aria-label="Technical requirements"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {jobCategory === 'quickTask' && (
                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                            <h3 className="text-lg font-semibold text-gray-700">Task Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="taskUrgency" className="block text-sm font-medium text-gray-700">Task Urgency</label>
                                    <select
                                        id="taskUrgency"
                                        value={taskDetails.urgency}
                                        onChange={(e) => setTaskDetails({ ...taskDetails, urgency: e.target.value as TaskDetails['urgency'] })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                        aria-label="Task urgency"
                                    >
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="high">High Priority</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="taskDuration" className="block text-sm font-medium text-gray-700">Expected Duration</label>
                                    <input
                                        id="taskDuration"
                                        type="text"
                                        value={taskDetails.duration}
                                        onChange={(e) => setTaskDetails({ ...taskDetails, duration: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                        placeholder="e.g., 2 hours"
                                        aria-label="Task duration"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="taskComplexity" className="block text-sm font-medium text-gray-700">Task Complexity</label>
                                    <select
                                        id="taskComplexity"
                                        value={taskDetails.complexity}
                                        onChange={(e) => setTaskDetails({ ...taskDetails, complexity: e.target.value as TaskDetails['complexity'] })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                        aria-label="Task complexity"
                                    >
                                        <option value="simple">Simple</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="complex">Complex</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                <input
                                    id="jobTitle"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme transition-all duration-200"
                                    placeholder="Enter a clear title for your job"
                                    required
                                    aria-label="Job title"
                                />
                            </div>
                            <div>
                                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    id="jobDescription"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme transition-all duration-200"
                                    placeholder="Provide a detailed description of the job"
                                    required
                                    aria-label="Job description"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-700">Price Range</h3>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="priceFrom" className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                <input
                                    id="priceFrom"
                                    type="number"
                                    value={priceFrom}
                                    onChange={(e) => setPriceFrom(e.target.value)}
                                    placeholder="Minimum amount"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme transition-all duration-200"
                                    required
                                    aria-label="Minimum price"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="priceTo" className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <input
                                    id="priceTo"
                                    type="number"
                                    value={priceTo}
                                    onChange={(e) => setPriceTo(e.target.value)}
                                    placeholder="Maximum amount"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme transition-all duration-200"
                                    required
                                    aria-label="Maximum price"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-700">Work Location</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                {['onsite', 'hybrid', 'remote'].map((type) => (
                                    <label
                                        key={type}
                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:border-greenTheme/50 ${locationDetails.type === type ? 'border-greenTheme bg-greenTheme/10 shadow-md' : 'border-gray-200'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="locationType"
                                            value={type}
                                            checked={locationDetails.type === type}
                                            onChange={(e) => setLocationDetails({
                                                ...locationDetails,
                                                type: e.target.value as LocationDetails['type']
                                            })}
                                            className="hidden"
                                            aria-label={`Select ${type} work location`}
                                        />
                                        <span className="block text-center font-medium capitalize">
                                            {type}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {(locationDetails.type === 'onsite' || locationDetails.type === 'hybrid') && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <input
                                            id="address"
                                            type="text"
                                            value={locationDetails.address || ''}
                                            onChange={(e) => setLocationDetails({
                                                ...locationDetails,
                                                address: e.target.value
                                            })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                            placeholder="Enter work location address"
                                            aria-label="Work location address"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            id="city"
                                            type="text"
                                            value={locationDetails.city || ''}
                                            onChange={(e) => setLocationDetails({
                                                ...locationDetails,
                                                city: e.target.value
                                            })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                            placeholder="Enter city"
                                            aria-label="City"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            id="country"
                                            type="text"
                                            value={locationDetails.country || ''}
                                            onChange={(e) => setLocationDetails({
                                                ...locationDetails,
                                                country: e.target.value
                                            })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                            placeholder="Enter country"
                                            aria-label="Country"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Skills Section */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-700">Required Skills</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {skills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm flex items-center gap-2 shadow-sm">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index, skills, setSkills)}
                                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        aria-label={`Remove ${skill}`}
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a required skill"
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme transition-all duration-200"
                                aria-label="New skill input"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addItem(newSkill, skills, setSkills, setNewSkill);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => addItem(newSkill, skills, setSkills, setNewSkill)}
                                className="px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-greenTheme/90 transition-colors duration-200"
                                aria-label="Add skill"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Questions Section */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-700">Application Questions</h3>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="flex items-center gap-2 text-greenTheme hover:text-greenTheme/80 transition-colors duration-200"
                                aria-label="Add new question"
                            >
                                <Plus size={20} />
                                Add Question
                            </button>
                        </div>

                        <div className="space-y-4">
                            {questions.map((question, qIndex) => (
                                <div key={qIndex} className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                                    <div className="flex justify-between gap-4">
                                        <input
                                            type="text"
                                            value={question.question}
                                            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                            placeholder="Enter your question"
                                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                            aria-label={`Question ${qIndex + 1}`}
                                        />
                                        <select
                                            value={question.answerType}
                                            onChange={(e) => updateQuestion(qIndex, 'answerType', e.target.value)}
                                            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                            aria-label={`Answer type for question ${qIndex + 1}`}
                                        >
                                            <option value="input">Text Input</option>
                                            <option value="checkbox">Multiple Choice</option>
                                            <option value="dropdown">Dropdown</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(qIndex)}
                                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                            aria-label={`Remove question ${qIndex + 1}`}
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {question.answerType !== 'input' && (
                                        <div className="space-y-2">
                                            {question.options.map((option, oIndex) => (
                                                <div key={oIndex} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                        placeholder="Enter option"
                                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                                        aria-label={`Option ${oIndex + 1} for question ${qIndex + 1}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOption(qIndex, oIndex)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                                        aria-label={`Remove option ${oIndex + 1}`}
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addOption(qIndex)}
                                                className="text-sm text-greenTheme hover:text-greenTheme/80 transition-colors duration-200"
                                                aria-label={`Add option to question ${qIndex + 1}`}
                                            >
                                                Add Option
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Requirements Section */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-700">Requirements</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {requirements.map((requirement, index) => (
                                <span key={index} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm flex items-center gap-2 shadow-sm">
                                    {requirement}
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index, requirements, setRequirements)}
                                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        aria-label={`Remove requirement ${requirement}`}
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newRequirement}
                                onChange={(e) => setNewRequirement(e.target.value)}
                                placeholder="Add a job requirement"
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme transition-all duration-200"
                                aria-label="New requirement input"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addItem(newRequirement, requirements, setRequirements, setNewRequirement);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => addItem(newRequirement, requirements, setRequirements, setNewRequirement)}
                                className="px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-greenTheme/90 transition-colors duration-200"
                                aria-label="Add requirement"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Qualifications Section */}
                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-700">Qualifications</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {qualifications.map((qualification, index) => (
                                <span key={index} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm flex items-center gap-2 shadow-sm">
                                    {qualification}
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index, qualifications, setQualifications)}
                                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        aria-label={`Remove qualification ${qualification}`}
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newQualification}
                                onChange={(e) => setNewQualification(e.target.value)}
                                placeholder="Add a qualification"
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme transition-all duration-200"
                                aria-label="New qualification input"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addItem(newQualification, qualifications, setQualifications, setNewQualification);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => addItem(newQualification, qualifications, setQualifications, setNewQualification)}
                                className="px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-greenTheme/90 transition-colors duration-200"
                                aria-label="Add qualification"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            aria-label="Cancel job creation"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 text-white rounded-lg transition-all duration-200 flex items-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-greenTheme hover:bg-greenTheme/90'
                                }`}
                            aria-label="Create job"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Job'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );


}