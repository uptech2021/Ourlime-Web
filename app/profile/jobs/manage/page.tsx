'use client';

import { useState, ReactNode, useEffect } from 'react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { ProfileImage, UserData } from '@/types/userTypes';
import { useProfileStore } from 'src/store/useProfileStore';
import ProfileHeader from '@/components/commonProfileHeader/ProfileHeader';
import { Button } from '@nextui-org/react';
import { auth } from '@/lib/firebaseConfig';
import {
    Briefcase, Users, Calendar, MapPin,
    DollarSign, Building2, Clock, Code,
    FileText, ExternalLink, CheckCircle, XCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';


interface Question {
    id: string;
    question: string;
    type: 'input' | 'dropdown' | 'checkbox';
    options?: string[] | Array<{
        label: string;
        value: string;
    }>;
}

interface Job {
    id: string;
    basic_info: {
        type: string;
        title: string;
        createdAt: {
            seconds: number;
            nanoseconds: number;
        };
        location: {
            type: string;
        };
        priceRange: {
            from: number;
            to: number;
        };
        userId: string;
    };
    applications?: Application[];
    questions?: Question[];
}

interface Application {
    id: string;
    basic_info: {
        status: 'pending' | 'accepted' | 'rejected';
        createdAt: {
            seconds: number;
            nanoseconds: number;
        };
        jobId: string;
        userId: string;
    };
    details: {
        coverLetter: string;
        resumeUrl?: string;
        portfolioLink?: string;
    };
    answers: Record<string, string>;
    applicant: {
        userId: string;
        name: string;
        imageUrl: string;
        education: {
            id: string;
            degree: string;
            school: string;
            description: string;
            startDate: string;
            endDate: string;
            current: boolean;
        }[];
        workExperience: {
            id: string;
            role: string;
            company: string;
            description: string;
            startDate: string;
            endDate: string | null;
            current: boolean;
        }[];
    };
}

interface JobCardProps {
    job: Job;
    isSelected: boolean;
    onSelect: (job: Job) => void;
    getJobTypeIcon: (type: string) => ReactNode;
    formatDate: (timestamp: { seconds: number; nanoseconds: number }) => string;
}

interface ApplicationsListProps {
    selectedJob: Job | null;
    selectedApplication: Application | null;
    setSelectedApplication: (application: Application | null) => void;
    getStatusColor: (status: string) => string;
    formatDate: (timestamp: { seconds: number; nanoseconds: number }) => string;
}


export default function ManageJobsPage() {
    const [activeTab, setActiveTab] = useState('timeline');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const { profileImage, userImages } = useProfileStore();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserJobs();
            } else {
                console.log('No authenticated user');
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserJobs = async () => {
        const userId = auth.currentUser?.uid;
        console.log('Current userId:', userId);

        if (!userId) {
            console.log('No user ID found');
            return;
        }

        try {
            console.log('Fetching jobs with questions for user:', userId);
            const response = await fetch(`/api/jobs/myJobs/applications?userId=${userId}`);
            const data = await response.json();
            console.log('API Response:', data);

            if (data.status === 'success') {
                console.log('Jobs with questions fetched successfully:', data.jobs);
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getJobTypeIcon = (type: string): ReactNode => {
        switch (type) {
            case 'professional':
                return <Building2 className="text-blue-500" />;
            case 'quickTask':
                return <Clock className="text-green-500" />;
            case 'freelancer':
                return <Code className="text-purple-500" />;
            default:
                return <Briefcase className="text-gray-500" />;
        }
    };

    const formatDate = (timestamp: { seconds: number; nanoseconds: number }): string => {
        if (!timestamp) return '';
        return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleJobSelect = async (job: Job) => {
        setSelectedApplication(null);
        try {
            // Preserve the existing applications data that contains applicant info
            const existingApplications = job.applications || [];

            const response = await fetch(`/api/jobs/myJobs/applications?jobId=${job.id}`);
            const data = await response.json();

            if (data.status === 'success') {
                // Merge the existing applicant data with new application data
                const mergedApplications = existingApplications.map(existingApp => {
                    const updatedApp = data.applications.find(newApp => newApp.id === existingApp.id);
                    return {
                        ...updatedApp,
                        applicant: existingApp.applicant // Preserve the applicant data
                    };
                });

                setSelectedJob({
                    ...job,
                    applications: mergedApplications
                });
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'pending':
                return 'text-yellow-600 bg-yellow-50';
            case 'accepted':
                return 'text-green-600 bg-green-50';
            case 'rejected':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const handleApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
        setIsUpdating(applicationId);

        try {
            const response = await fetch('/api/jobs/myJobs/applications', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ applicationId, status })
            });

            if (response.ok) {
                if (selectedJob) {
                    const updatedResponse = await fetch(`/api/jobs/myJobs/applications?jobId=${selectedJob.id}`);
                    const data = await updatedResponse.json();

                    if (data.status === 'success') {
                        const updatedApplications = selectedJob.applications?.map(existingApp => {
                            const updatedApp = data.applications.find(newApp => newApp.id === existingApp.id);
                            return {
                                ...updatedApp,
                                applicant: existingApp.applicant
                            };
                        });

                        setSelectedJob(prevJob => ({
                            ...prevJob!,
                            applications: updatedApplications
                        }));
                    }
                }
                toast.success(`Application ${status} and notification email sent`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update application status');
        } finally {
            setIsUpdating(null);
        }
    };

    const JobCard = ({ job, isSelected, onSelect, getJobTypeIcon, formatDate }: JobCardProps) => (
        <button
            onClick={() => onSelect(job)}
            className={`w-full text-left p-4 rounded-lg transition-all ${isSelected
                ? 'bg-greenTheme/10 border-2 border-greenTheme'
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
        >
            <div className="flex items-center gap-2 mb-2">
                {getJobTypeIcon(job.basic_info.type)}
                <span className="text-sm font-medium capitalize text-gray-600">
                    {job.basic_info.type}
                </span>
            </div>
            <h3 className="font-semibold text-gray-900">{job.basic_info.title}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(job.basic_info.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {job.basic_info.location.type}
                </span>
                <span className="flex items-center gap-1">
                    <DollarSign size={14} />
                    {job.basic_info.priceRange.from} - {job.basic_info.priceRange.to}
                </span>
            </div>
        </button>
    );

    const ApplicationsList = ({ selectedJob, selectedApplication, setSelectedApplication, getStatusColor, formatDate }: ApplicationsListProps) => {
        const formatAnyDate = (date: string | { seconds: number; nanoseconds: number } | null) => {
            if (!date) return '';
            if (typeof date === 'string') {
                return new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            }
            return formatDate(date);
        };

        return (
            <div className="bg-white rounded-lg shadow-sm p-4">
                {selectedJob ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Applications</h2>
                            <div className="flex items-center gap-2">
                                <Users size={20} className="text-gray-400" />
                                <span className="font-medium">
                                    {selectedJob.applications?.length || 0} Applicants
                                </span>
                            </div>
                        </div>

                        {selectedJob.applications?.length > 0 ? (
                            <div className="space-y-4">
                                {selectedJob.applications.map((application) => {
                                    console.log('Application Data:', application);
                                    return (
                                        <div
                                            key={application.id}
                                            className={`p-4 rounded-lg transition-all ${selectedApplication?.id === application.id
                                                ? 'bg-greenTheme/5 border-2 border-greenTheme'
                                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                                }`}
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                <div className="flex items-start gap-4">
                                                    {application.applicant?.imageUrl ? (
                                                        <img
                                                            src={application.applicant.imageUrl}
                                                            alt={application.applicant?.name || 'Profile'}
                                                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/default-avatar.png';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <Users size={24} className="text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-medium text-lg">
                                                            {application.applicant?.name || 'Anonymous'}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.basic_info.status)}`}>
                                                                {application.basic_info.status}
                                                            </span>
                                                            <span className="text-sm text-gray-600">
                                                                Applied {formatDate(application.basic_info.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="bg-greenTheme text-white w-full sm:w-auto"
                                                    onClick={() => {
                                                        console.log('Setting selected application:', application);
                                                        setSelectedApplication(application);
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </div>

                                            {selectedApplication?.id === application.id && (
                                                <div className="mt-6 space-y-6 bg-white rounded-lg border-2 border-greenTheme/20 p-6">
                                                    {/* Work Experience Section */}
                                                    {application.applicant?.workExperience?.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 mb-3">Work Experience</h4>
                                                            <div className="space-y-3">
                                                                {application.applicant.workExperience.map((work) => (
                                                                    <div key={work.id} className="bg-gray-50 p-3 rounded-lg">
                                                                        <div className="flex justify-between">
                                                                            <h5 className="font-medium">{work.role}</h5>
                                                                            <span className="text-sm text-gray-600">
                                                                                {work.current ? 'Current' : formatAnyDate(work.endDate)}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm text-gray-600">{work.company}</p>
                                                                        <p className="text-sm text-gray-500 mt-1">{work.description}</p>
                                                                        <p className="text-xs text-gray-400 mt-2">
                                                                            Started: {formatAnyDate(work.startDate)}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Education Section */}
                                                    {application.applicant?.education?.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 mb-3">Education</h4>
                                                            <div className="space-y-3">
                                                                {application.applicant.education.map((edu) => (
                                                                    <div key={edu.id} className="bg-gray-50 p-3 rounded-lg">
                                                                        <div className="flex justify-between">
                                                                            <h5 className="font-medium">{edu.degree}</h5>
                                                                            <span className="text-sm text-gray-600">
                                                                                {edu.current ? 'Current' : formatAnyDate(edu.endDate)}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm text-gray-600">{edu.school}</p>
                                                                        <p className="text-sm text-gray-500 mt-1">{edu.description}</p>
                                                                        <p className="text-xs text-gray-400 mt-2">
                                                                            Started: {formatAnyDate(edu.startDate)}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Questions Section */}
                                                    {selectedJob.questions?.length > 0 && (
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 mb-3">Application Questions</h4>
                                                            <div className="space-y-3">
                                                                {selectedJob.questions.map((question) => (
                                                                    <div key={question.id} className="bg-gray-50 p-3 rounded-lg">
                                                                        <p className="text-sm font-medium text-gray-700">{question.question}</p>
                                                                        <p className="text-gray-600 mt-1">
                                                                            {application.answers[question.id] || 'No answer provided'}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Cover Letter */}
                                                    <div className="w-full">
                                                        <h4 className="font-medium text-gray-900 mb-3">Cover Letter</h4>
                                                        <div className="bg-gray-50 p-4 rounded-lg w-full">
                                                            <div className="prose max-w-none break-words">
                                                                <p className="text-gray-600 whitespace-pre-wrap overflow-hidden">
                                                                    {application.details.coverLetter}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Links */}
                                                    <div className="flex flex-wrap gap-4">
                                                        {application.details.resumeUrl && (
                                                            <a
                                                                href={application.details.resumeUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 text-greenTheme hover:text-green-600 transition-colors"
                                                            >
                                                                <FileText size={20} />
                                                                View Resume
                                                            </a>
                                                        )}
                                                        {application.details.portfolioLink && (
                                                            <a
                                                                href={application.details.portfolioLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 text-greenTheme hover:text-green-600 transition-colors"
                                                            >
                                                                <ExternalLink size={20} />
                                                                View Portfolio
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2 pt-4">
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-500 text-white"
                                                            disabled={application.basic_info.status === 'accepted' || isUpdating === application.id}
                                                            onClick={() => handleApplicationStatus(application.id, 'accepted')}
                                                        >
                                                            {isUpdating === application.id ? (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="animate-spin">⚪</span>
                                                                    Processing
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    ✓ Accept
                                                                </>
                                                            )}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-red-500 text-white"
                                                            disabled={application.basic_info.status === 'rejected' || isUpdating === application.id}
                                                            onClick={() => handleApplicationStatus(application.id, 'rejected')}
                                                        >
                                                            {isUpdating === application.id ? (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="animate-spin">⚪</span>
                                                                    Processing
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    ✕ Reject
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>

                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No applications yet
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        Select a job to view applications
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <main className="h-[calc(100vh-10px)] pt-24 md:pt-24 lg:pt-32 w-full px-2 md:px-8">
                <div className="max-w-7xl mx-auto h-full">
                    <div className="flex flex-col lg:flex-row gap-4 h-full relative">
                        <div className="lg:sticky lg:top-32">
                            <ProfileSidebar
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                setIsSidebarOpen={setIsSidebarOpen}
                                isSidebarOpen={isSidebarOpen}
                                setUserData={setUserData}
                                setProfileImage={useProfileStore.getState().setProfileImage}
                            />
                        </div>
                        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto">
                            <ProfileHeader
                                onCustomizationSelect={(selectedImage: ProfileImage) => {
                                    setActiveTab('customize');
                                }}
                                userImages={userImages}
                            />
                            {/* Scrollable Content Area */}
                            <div className="flex-1">
                                {/* Mobile View */}
                                <div className="lg:hidden flex flex-col gap-4 p-4">
                                    <div className="overflow-x-auto pb-4">
                                        <div className="flex gap-4 min-w-max">
                                            {jobs.map((job) => (
                                                <div key={job.id} className="w-80">
                                                    <JobCard
                                                        job={job}
                                                        isSelected={selectedJob?.id === job.id}
                                                        onSelect={handleJobSelect}
                                                        getJobTypeIcon={getJobTypeIcon}
                                                        formatDate={formatDate}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <ApplicationsList
                                            selectedJob={selectedJob}
                                            selectedApplication={selectedApplication}
                                            setSelectedApplication={setSelectedApplication}
                                            getStatusColor={getStatusColor}
                                            formatDate={formatDate}
                                        />
                                    </div>
                                </div>

                                {/* Desktop View */}
                                <div className="hidden lg:flex gap-4 p-4">
                                    <div className="w-1/3">
                                        <div className="bg-white rounded-lg p-4">
                                            <h2 className="text-xl font-bold mb-4">My Jobs</h2>
                                            <div className="space-y-3">
                                                {jobs.map((job) => (
                                                    <JobCard
                                                        key={job.id}
                                                        job={job}
                                                        isSelected={selectedJob?.id === job.id}
                                                        onSelect={handleJobSelect}
                                                        getJobTypeIcon={getJobTypeIcon}
                                                        formatDate={formatDate}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-2/3">
                                        <ApplicationsList
                                            selectedJob={selectedJob}
                                            selectedApplication={selectedApplication}
                                            setSelectedApplication={setSelectedApplication}
                                            getStatusColor={getStatusColor}
                                            formatDate={formatDate}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Toaster />
        </div>
    );

}
