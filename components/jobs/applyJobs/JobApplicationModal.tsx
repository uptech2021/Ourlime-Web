import { useState } from 'react';
import { X, FileText, Clock, MapPin, DollarSign, CheckCircle, Briefcase, 
         GraduationCap, Code, MessageSquare, Building2, Star } from 'lucide-react';
import Image from 'next/image';
import { storage, db, auth } from '@/lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { Button } from '@nextui-org/react';

interface JobApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: any;
    jobType: 'professional' | 'quicktasks' | 'freelance';
}

export default function JobApplicationModal({ isOpen, onClose, job, jobType }: JobApplicationModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [coverLetter, setCoverLetter] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [portfolioLink, setPortfolioLink] = useState('');
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalSteps = 3;

    const handleAnswerChange = (questionId: string, value: string | string[]) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const validateCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return coverLetter.length >= 100;
            case 2:
                return resumeFile !== null;
            case 3:
                return Object.keys(answers).length === job.questions?.length;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        } else {
            toast.error('Please complete all required fields');
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {
            let resumeUrl = '';
            if (resumeFile) {
                const storageRef = ref(storage, `applications/${auth.currentUser?.uid}/${resumeFile.name}`);
                const uploadResult = await uploadBytes(storageRef, resumeFile);
                resumeUrl = await getDownloadURL(uploadResult.ref);
            }
    
            const applicationData = {
                userId: auth.currentUser?.uid,
                jobId: job.id,
                jobType,
                coverLetter,
                resumeUrl,
                portfolioLink: portfolioLink || null,
                answers
            };
    
            // Submit application
            const applicationResponse = await fetch('/api/jobs/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(applicationData)
            });
    
            if (applicationResponse.ok) {
                // Send email notification
                await fetch('/api/jobs/email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: job.creator.email,
                        applicationData: {
                            jobTitle: job.basic_info.title,
                            applicantName: auth.currentUser?.displayName,
                            applicantEmail: auth.currentUser?.email,
                            coverLetter,
                            portfolioLink,
                            answers: Object.entries(answers).map(([id, response]) => ({
                                question: job.questions.find(q => q.id === id)?.question,
                                response
                            }))
                        }
                    })
                });
    
                toast.success('Application submitted successfully! Email notification sent.');
                onClose();
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    


    if (!isOpen || !job) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[400]"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                className="fixed inset-y-0 right-0 w-full sm:w-[600px] bg-white shadow-xl z-[401] flex flex-col"
                role="dialog"
                aria-modal="true"
                aria-labelledby="application-title"
            >
                {/* Header */}
                <div className="relative border-b bg-gradient-to-r from-green-50 to-blue-50 p-6">
                    <button
                        onClick={onClose}
                        className="absolute left-4 top-4 p-2 hover:bg-white/50 rounded-full transition-colors"
                        aria-label="Close application modal"
                        title="Close"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 relative rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <Image
                                src={job.creator?.profileImage || '/default-avatar.png'}
                                alt={`${job.creator?.name}'s profile picture`}
                                fill
                                className="object-cover"
                                unoptimized={true}
                            />
                        </div>
                        <h2 id="application-title" className="text-xl font-bold text-gray-900">
                            {job.basic_info.title}
                        </h2>
                        <p className="text-gray-600 mt-1">{job.category_specific.name}</p>

                        {/* Progress Steps */}
                        <div className="flex justify-center items-center gap-4 mt-6">
                            {[1, 2, 3].map((step) => (
                                <div
                                    key={step}
                                    className="flex items-center"
                                    aria-label={`Step ${step} of 3`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === step
                                            ? 'bg-greenTheme text-white'
                                            : currentStep > step
                                                ? 'bg-green-100 text-greenTheme'
                                                : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {currentStep > step ? <CheckCircle size={16} /> : step}
                                    </div>
                                    {step < 3 && (
                                        <div className={`w-12 h-1 ${currentStep > step ? 'bg-greenTheme' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Cover Letter</h3>
                                <p className="text-gray-600">Tell us why you're the perfect fit for this role.</p>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-greenTheme min-h-[200px]"
                                    placeholder="Write your cover letter here..."
                                    aria-label="Cover letter"
                                />
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Minimum 100 characters</span>
                                    <span className={`${coverLetter.length >= 100 ? 'text-greenTheme' : 'text-gray-500'}`}>
                                        {coverLetter.length} characters
                                    </span>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Resume Upload</h3>
                                    <p className="text-gray-600 mt-1">Upload your latest resume</p>

                                    <div className="mt-4 border-2 border-dashed border-gray-200 rounded-xl p-8">
                                        <input
                                            type="file"
                                            id="resume-upload"
                                            className="hidden"
                                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                            accept=".pdf,.doc,.docx"
                                            aria-label="Upload resume"
                                        />
                                        <label
                                            htmlFor="resume-upload"
                                            className="cursor-pointer block text-center"
                                        >
                                            {resumeFile ? (
                                                <div className="space-y-2">
                                                    <FileText size={32} className="mx-auto text-greenTheme" />
                                                    <p className="text-gray-900 font-medium">{resumeFile.name}</p>
                                                    <p className="text-sm text-gray-500">Click to change file</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <FileText size={32} className="mx-auto text-gray-400" />
                                                    <p className="text-gray-900 font-medium">Drop your resume here</p>
                                                    <p className="text-sm text-gray-500">or click to browse</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Portfolio Link (Optional)</h3>
                                    <p className="text-gray-600 mt-1">Share your work portfolio</p>
                                    <input
                                        type="url"
                                        value={portfolioLink}
                                        onChange={(e) => setPortfolioLink(e.target.value)}
                                        className="mt-2 w-full p-3 border rounded-xl focus:ring-2 focus:ring-greenTheme"
                                        placeholder="https://your-portfolio.com"
                                        aria-label="Portfolio link"
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900">Screening Questions</h3>
                                <p className="text-gray-600">Please answer all questions below</p>

                                {job.questions?.map((question, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
                                        <label className="block font-medium text-gray-900">
                                            {question.question}
                                        </label>

                                        {question.type === 'input' && (
                                            <input
                                                type="text"
                                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-greenTheme"
                                                placeholder="Your answer"
                                                aria-label={question.question}
                                            />
                                        )}

                                        {question.type === 'checkbox' && (
                                            <div className="space-y-2">
                                                {question.options.map((option, idx) => (
                                                    <label key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => {
                                                                const currentAnswers = answers[question.id] as string[] || [];
                                                                const newAnswers = e.target.checked
                                                                    ? [...currentAnswers, option]
                                                                    : currentAnswers.filter(a => a !== option);
                                                                handleAnswerChange(question.id, newAnswers);
                                                            }}
                                                            className="w-4 h-4 rounded text-greenTheme focus:ring-greenTheme"
                                                            aria-label={option}
                                                        />
                                                        <span>{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {question.type === 'dropdown' && (
                                            <select
                                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-greenTheme"
                                                aria-label={question.question}
                                            >
                                                <option value="">Select an option</option>
                                                {question.options.map((option, idx) => (
                                                    <option key={idx} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t p-6 bg-white">
                    <div className="flex justify-between gap-4">
                        {currentStep > 1 && (
                            <Button
                                onClick={handleBack}
                                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                aria-label="Go back to previous step"
                            >
                                Back
                            </Button>
                        )}

                        <Button
                            onClick={currentStep === totalSteps ? handleSubmit : handleNext}
                            disabled={isSubmitting || !validateCurrentStep()}
                            className="flex-1 py-3 bg-greenTheme text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={currentStep === totalSteps ? "Submit application" : "Continue to next step"}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </div>
                            ) : currentStep === totalSteps ? (
                                'Submit Application'
                            ) : (
                                'Continue'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );

}