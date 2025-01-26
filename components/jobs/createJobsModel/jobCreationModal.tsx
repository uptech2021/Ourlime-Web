import { useState, useEffect, ReactNode } from 'react';
import { Button } from '@nextui-org/react';
import { X } from 'lucide-react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseConfig';
import { JobType } from '@/types/jobTypes';

interface JobCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function JobCreationModal({ isOpen, onClose }: JobCreationModalProps): ReactNode {
    const [jobTypes, setJobTypes] = useState<JobType[]>([]);
    const [selectedJobType, setSelectedJobType] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');
    const [requirements, setRequirements] = useState<string[]>([]);
    const [newRequirement, setNewRequirement] = useState('');
    const [qualifications, setQualifications] = useState<string[]>([]);
    const [newQualification, setNewQualification] = useState('');

    const [questions, setQuestions] = useState<Array<{
        question: string;
        answerType: 'checkbox' | 'dropdown' | 'input';
        options: string[];
    }>>([]);

    useEffect(() => {
        const fetchJobTypes = async () => {
            const querySnapshot = await getDocs(collection(db, 'jobs'));
            const types = querySnapshot.docs.map(doc => ({
                id: doc.id,
                jobCategory: doc.data().jobCategory
            }));
            setJobTypes(types);
        };

        fetchJobTypes();
    }, []);

    const addQuestion = () => {
        setQuestions([...questions, { question: '', answerType: 'input', options: [] }]);
    };

    const addOption = (questionIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options.push('');
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const jobRef = await addDoc(collection(db, 'jobsVariant'), {
                jobTitle: title,
                jobDescription: description,
                userId: auth.currentUser?.uid,
                jobId: selectedJobType,
                priceRange: {
                    from: priceFrom,
                    to: priceTo
                },
                createdAt: serverTimestamp()
            });

            await addDoc(collection(db, 'jobRequirements'), {
                description: requirements,
                jobProfessionalId: jobRef.id
            });

            await addDoc(collection(db, 'jobSkills'), {
                skillsNeeded: skills,
                jobProfessionalId: jobRef.id
            });

            await addDoc(collection(db, 'jobQualifications'), {
                qualificationsNeeded: qualifications,
                jobProfessionalId: jobRef.id
            });

            for (const question of questions) {
                const questionRef = await addDoc(collection(db, 'jobQuestions'), {
                    question: question.question,
                    answerType: question.answerType,
                    jobProfessionalId: jobRef.id
                });

                if (question.answerType !== 'input' && question.options.length > 0) {
                    for (const option of question.options) {
                        await addDoc(collection(db, 'jobAnswerOptions'), {
                            optionText: option,
                            jobProfessionalQuestionsId: questionRef.id
                        });
                    }
                }
            }

            onClose();
            alert('Job created successfully!');

        } catch (error) {
            alert('Failed to create a job, Please Try Again');
            console.error('Error creating job:', error);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-[10000]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Create Job</h2>
                    <button onClick={onClose}
                        title='close'
                    >
                        <X size={24} className="text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Job Type Selection */}
                    <div className="grid grid-cols-3 gap-4">
                        {jobTypes.map((type) => (
                            <label
                                key={type.id}
                                className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedJobType === type.id
                                    ? 'border-greenTheme bg-greenTheme/5'
                                    : 'border-gray-200'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="jobType"
                                    value={type.id}
                                    checked={selectedJobType === type.id}
                                    onChange={(e) => setSelectedJobType(e.target.value)}
                                    className="hidden"
                                />
                                <span className="block text-center font-medium">{type.jobCategory}</span>
                            </label>
                        ))}
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                            <input
                                aria-label='job title'
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                aria-label='job description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                            />
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price Range
                        </label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">From</label>
                                <input
                                    type="number"
                                    value={priceFrom}
                                    onChange={(e) => setPriceFrom(e.target.value)}
                                    placeholder="e.g. 500"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">To</label>
                                <input
                                    type="number"
                                    value={priceTo}
                                    onChange={(e) => setPriceTo(e.target.value)}
                                    placeholder="e.g. 1000"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                    required
                                />
                            </div>
                        </div>
                    </div>



                    {/* Skills Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Skills Required</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {skills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                                    {skill}
                                    <button
                                        aria-label='remove skill'
                                        type="button"
                                        onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                                        className="text-gray-500 hover:text-red-500"
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
                                placeholder="Add a skill"
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (newSkill) {
                                        setSkills([...skills, newSkill]);
                                        setNewSkill('');
                                    }
                                }}
                                className="px-4 py-2 bg-greenTheme text-white rounded-lg"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Questions Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">Application Questions</label>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="text-greenTheme hover:text-greenTheme/80"
                            >
                                Add Question
                            </button>
                        </div>

                        {questions.map((question, qIndex) => (
                            <div key={qIndex} className="border rounded-lg p-4 space-y-4">
                                <div className="flex justify-between">
                                    <input
                                        type="text"
                                        value={question.question}
                                        onChange={(e) => {
                                            const newQuestions = [...questions];
                                            newQuestions[qIndex].question = e.target.value;
                                            setQuestions(newQuestions);
                                        }}
                                        placeholder="Enter your question"
                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                    />
                                    <select
                                        title='Select answer type'
                                        value={question.answerType}
                                        onChange={(e) => {
                                            const newQuestions = [...questions];
                                            newQuestions[qIndex].answerType = e.target.value as 'checkbox' | 'dropdown' | 'input';
                                            setQuestions(newQuestions);
                                        }}
                                        className="ml-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                    >
                                        <option value="input">Text Input</option>
                                        <option value="checkbox">Checkbox</option>
                                        <option value="dropdown">Dropdown</option>
                                    </select>
                                </div>

                                {question.answerType !== 'input' && (
                                    <div className="space-y-2">
                                        {question.options.map((option, oIndex) => (
                                            <div key={oIndex} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => {
                                                        const newQuestions = [...questions];
                                                        newQuestions[qIndex].options[oIndex] = e.target.value;
                                                        setQuestions(newQuestions);
                                                    }}
                                                    placeholder="Enter option"
                                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                                />
                                                <button
                                                    aria-label='remove option'
                                                    type="button"
                                                    onClick={() => {
                                                        const newQuestions = [...questions];
                                                        newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
                                                            (_, i) => i !== oIndex
                                                        );
                                                        setQuestions(newQuestions);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addOption(qIndex)}
                                            className="text-sm text-greenTheme hover:text-greenTheme/80"
                                        >
                                            Add Option
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Requirements Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Requirements</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {requirements.map((requirement, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                                    {requirement}
                                    <button
                                        aria-label='remove requirement'
                                        type="button"
                                        onClick={() => setRequirements(requirements.filter((_, i) => i !== index))}
                                        className="text-gray-500 hover:text-red-500"
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
                                placeholder="Add a requirement"
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (newRequirement) {
                                        setRequirements([...requirements, newRequirement]);
                                        setNewRequirement('');
                                    }
                                }}
                                className="px-4 py-2 bg-greenTheme text-white rounded-lg"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Qualifications Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Qualifications</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {qualifications.map((qualification, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
                                    {qualification}
                                    <button
                                        aria-label='remove qualification'
                                        type="button"
                                        onClick={() => setQualifications(qualifications.filter((_, i) => i !== index))}
                                        className="text-gray-500 hover:text-red-500"
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
                                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (newQualification) {
                                        setQualifications([...qualifications, newQualification]);
                                        setNewQualification('');
                                    }
                                }}
                                className="px-4 py-2 bg-greenTheme text-white rounded-lg"
                            >
                                Add
                            </button>
                        </div>
                    </div>


                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="px-6 py-2 bg-greenTheme text-white rounded-lg hover:bg-greenTheme/90"
                        >
                            Create Job
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}