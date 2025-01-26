import { useState } from 'react';
import { X, FileText, Clock, MapPin, DollarSign, CheckCircle, Briefcase, GraduationCap, Code, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { storage, db, auth } from '@/lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface JobApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: any;
    jobType: 'professional' | 'quicktasks' | 'freelance';
}

export default function JobApplicationModal({ isOpen, onClose, job, jobType }: JobApplicationModalProps) {
    const [coverLetter, setCoverLetter] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [portfolioLink, setPortfolioLink] = useState('');
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAnswerChange = (questionId: string, value: string | string[]) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log('Starting application submission...');
            console.log('Answers:', answers);

            let resumeUrl = '';
            if (resumeFile) {
                const storageRef = ref(storage, `resumes/${auth.currentUser?.uid}/${resumeFile.name}`);
                console.log('Uploading resume file...');
                const uploadResult = await uploadBytes(storageRef, resumeFile);
                resumeUrl = await getDownloadURL(uploadResult.ref);
                console.log('Resume uploaded successfully:', resumeUrl);
            }

            const resumeDoc = await addDoc(collection(db, 'jobResumes'), {
                resumeFile: resumeUrl,
                createdAt: serverTimestamp(),
                userId: auth.currentUser?.uid,
                jobsVariantId: job.id,
                portfolioLink
            });
            console.log('Resume document created:', resumeDoc.id);

            const answerPromises = job.questions.map(async question => {
                const answerDoc = await addDoc(collection(db, 'jobAnswers'), {
                    answer: answers[question.id],
                    jobQuestionsId: question.id,
                    userId: auth.currentUser?.uid,
                    createdAt: serverTimestamp()
                });
                console.log('Answer document created:', answerDoc.id);
                return answerDoc;
            });

            await Promise.all(answerPromises);
            
            toast.success('Application submitted successfully!');
            console.log('Application submission completed');
            onClose();

        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !job) return null;


    return (
        <>
            <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[400] transition-opacity"
                onClick={onClose}
            />
            
            <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] bg-white shadow-xl z-[401] flex flex-col">
                {/* Header with Company/User Info */}
                <div className="relative border-b">
                    <button
                        title='Close'
                        onClick={onClose}
                        className="absolute left-4 top-4 p-2 hover:bg-gray-100 rounded-full z-10"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="p-6 text-center">
                        <div className="w-20 h-20 mx-auto mb-3 relative rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <Image
                                src={job.userImage || '/default-avatar.png'}
                                alt={job.userName}
                                fill
                                className="object-cover"
                                unoptimized={true}
                            />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{job.jobTitle}</h2>
                        <p className="text-gray-600 mt-1">{job.userName}</p>
                    </div>
                </div>
    
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Job Overview */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                            <div className="flex flex-wrap gap-4 text-gray-700">
                                <div className="flex items-center gap-2">
                                    <Clock className="text-greenTheme" size={18} />
                                    <span>{jobType === 'quicktasks' ? job.duration : job.type}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-greenTheme" size={18} />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="text-greenTheme" size={18} />
                                    <span>{job.priceRange.from} - {job.priceRange.to}</span>
                                </div>
                            </div>
                        </div>
    
                        {/* Requirements Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="text-greenTheme" size={24} />
                                <h3 className="text-lg font-semibold">Requirements</h3>
                            </div>
                            <ul className="space-y-2">
                                {job.requirements.description.map((req: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-600">
                                        <span className="mt-1.5 w-1.5 h-1.5 bg-greenTheme rounded-full flex-shrink-0" />
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
    
                        {/* Dynamic Questions */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="text-greenTheme" size={24} />
                                <h3 className="text-lg font-semibold">Application Questions</h3>
                            </div>
                            
                            {job.questions.map((question, index) => (
                                <div key={index} className="space-y-2">
                                    <label className="block font-medium">{question.question}</label>
                                    
                                    {question.answerType === 'input' && (
                                        <input
                                            type="text"
                                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-greenTheme"
                                            placeholder="Your answer"
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            required
                                        />
                                    )}
    
                                    {question.answerType === 'dropdown' && (
                                        <select 
                                            title='dropdown'
                                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-greenTheme"
                                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                            required
                                        >
                                            <option value="">Select an option</option>
                                            {question.answerOptions.map((option, idx) => (
                                                <option key={idx} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    )}
    
                                    {question.answerType === 'checkbox' && (
                                        <div className="space-y-2">
                                            {question.answerOptions.map((option, idx) => (
                                                <label key={idx} className="flex items-center gap-2">
                                                    <input 
                                                        type="checkbox"
                                                        className="rounded text-greenTheme"
                                                        onChange={(e) => {
                                                            const currentAnswers = answers[question.id] as string[] || [];
                                                            const newAnswers = e.target.checked
                                                                ? [...currentAnswers, option]
                                                                : currentAnswers.filter(a => a !== option);
                                                            handleAnswerChange(question.id, newAnswers);
                                                        }}
                                                    />
                                                    <span>{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
    
                        {/* Portfolio Link */}
                        <div>
                            <label className="block font-medium mb-2">Portfolio Link (Optional)</label>
                            <input
                                type="url"
                                value={portfolioLink}
                                onChange={(e) => setPortfolioLink(e.target.value)}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-greenTheme"
                                placeholder="https://your-portfolio.com"
                            />
                        </div>
    
                        {/* Resume Upload */}
                        <div>
                            <label className="block font-medium mb-2">Resume</label>
                            <div className="border-2 border-dashed rounded-xl p-6 text-center">
                                <input
                                    type="file"
                                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="resume-upload"
                                    accept=".pdf,.doc,.docx"
                                    required
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className="cursor-pointer text-greenTheme hover:text-green-600"
                                >
                                    <FileText className="mx-auto mb-2" size={24} />
                                    <span className="font-medium">Upload Resume</span>
                                    <p className="text-sm text-gray-500 mt-1">PDF, DOC up to 10MB</p>
                                </label>
                            </div>
                            {resumeFile && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                    <FileText size={16} />
                                    <span>{resumeFile.name}</span>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
    
                {/* Fixed Bottom Submit Button */}
                <div className="border-t p-6 bg-white">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-greenTheme text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? (
                            'Submitting...'
                        ) : (
                            <>
                                <Briefcase size={20} />
                                Submit Application
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
    

}