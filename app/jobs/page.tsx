'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@nextui-org/react';
import { db, auth } from '@/lib/firebaseConfig';
import {
    Search, MessageSquare, Bell, Settings, Compass,
    Plus, Users, Calendar, X, LogOut, HelpCircle,
    Bookmark, Wallet, User, MapPin, DollarSign,
    Clock, Sliders, Code, Palette, LineChart, Star,
    Building2, LayoutGrid, List, BookOpen, Wrench, Landmark, ShoppingBag, Utensils, Stethoscope, LucideIcon, Briefcase, Menu
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { formatDistanceToNow } from 'date-fns';
import { addDoc, doc, getDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { doc as firestoreDoc } from 'firebase/firestore';

export type JobTypeItem = {
    id: 'professional' | 'quicktasks' | 'freelance';
    label: string;
    icon: LucideIcon;
}

export type JobType = {
    id: string;
    jobCategory: string;
};

export type Job = {
    id: string;
    title: string;
    company: string;
    location: string;
    salaryRange: string;
    type: JobType;
    skills: string[];
    postedDate: string;
    logo: string;
}

export type ProfessionalJob = {
    id: string;
    jobTitle: string;
    jobDescription: string;
    userId: string;
    jobId: string;
    company: {
        name: string;
        logo: string;
    };
    requirements: {
        id: string;
        description: string[];
    };
    skills: {
        id: string;
        skillsNeeded: string[];
    };
    qualifications: {
        id: string;
        qualificationsNeeded: string[];
    };
    questions: Array<{
        id: string;
        question: string;
        answerType: 'text' | 'multiple' | 'single';
        answerOptions?: string[];
    }>;
    createdAt: string;
    location: string;
    priceRange: {
        from: string;
        to: string;
    };
    type: 'Full-time' | 'Part-time' | 'Contract';
    userImage: string | null;
    userName: string;
};

export type QuickTask = {
    id: string;
    jobTitle: string;
    jobDescription: string;
    userId: string;
    jobId: string;
    requirements: {
        id: string;
        description: string[];
    };
    skills: {
        id: string;
        skillsNeeded: string[];
    };
    budget: string;
    duration: string;
    location: string;
    createdAt: string;
    taskProvider: {
        name: string;
        avatar: string;
        rating: number;
        tasksCompleted: number;
    };
    priceRange: {
        from: string;
        to: string;
    };
};

export type FreelanceProject = {
    id: string;
    jobTitle: string;
    jobDescription: string;
    userId: string;
    jobId: string;
    requirements: {
        id: string;
        description: string[];
    };
    skills: {
        id: string;
        skillsNeeded: string[];
    };
    qualifications: {
        id: string;
        qualificationsNeeded: string[];
    };
    budget: {
        range: string;
        type: 'Fixed' | 'Hourly';
    };
    duration: string;
    clientInfo: {
        name: string;
        avatar: string;
        rating: number;
        projectsPosted: number;
        successRate: number;
    };
    proposalCount: number;
    deadline: string;
    createdAt: string;
    priceRange: {
        from: string;
        to: string;
    };
};



export default function JobsPage() {
    const router = useRouter();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const dropdownRef = useRef(null);

    const [activeJobType, setActiveJobType] = useState<JobTypeItem['id']>('professional');

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Events', href: '/events' },
        { name: 'Jobs', href: '/jobs' },
        { name: 'Communities', href: '/communities' },
        { name: 'Marketplace', href: '/marketplace' }
    ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const ProfileDropdown = () => (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden focus:outline-none ring-2 ring-greenTheme ring-offset-2 transition-all duration-200"
            >
                {profileImage?.imageURL ? (
                    <Image
                        src={profileImage.imageURL}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        loader={({ src }) => src}
                        unoptimized={true}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200" />
                )}
            </button>

            {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl py-2 z-[1000] transform transition-all duration-200 ease-out">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <p className="text-lg font-semibold text-gray-800">{userData?.firstName} {userData?.lastName}</p>
                        <p className="text-sm text-gray-500">@{userData?.userName}</p>
                        <div className="mt-2 flex gap-4">
                            <span className="text-sm"><b>245</b> Friends</span>
                            <span className="text-sm"><b>128</b> Posts</span>
                        </div>
                    </div>

                    <div className="py-2">
                        <a href="/profile" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
                            <User className="w-5 h-5 mr-3 text-greenTheme" />
                            <span>View Profile</span>
                        </a>
                        <a href="/settings" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
                            <Settings className="w-5 h-5 mr-3 text-greenTheme" />
                            <span>Settings</span>
                        </a>
                        <a href="/wallet" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
                            <Wallet className="w-5 h-5 mr-3 text-greenTheme" />
                            <span>Wallet</span>
                        </a>
                        <a href="/saved" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
                            <Bookmark className="w-5 h-5 mr-3 text-greenTheme" />
                            <span>Saved Items</span>
                        </a>
                    </div>

                    <div className="border-t border-gray-100 py-2">
                        <a href="/help" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
                            <HelpCircle className="w-5 h-5 mr-3 text-greenTheme" />
                            <span>Help & Support</span>
                        </a>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-6 py-3 hover:bg-red-50 transition-colors text-red-600"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );


    const jobTypes: Array<{ id: 'professional' | 'quicktasks' | 'freelance', label: string, icon: LucideIcon }> = [
        { id: 'professional', label: 'Professional Jobs', icon: Briefcase },
        { id: 'quicktasks', label: 'Quick Tasks', icon: Clock },
        { id: 'freelance', label: 'Freelance', icon: Code }
    ];

    // First, add the job categories array at the top level of your component
    const jobCategories = [
        { icon: Code, name: 'Development', count: 420 },
        { icon: Palette, name: 'Design', count: 233 },
        { icon: LineChart, name: 'Marketing', count: 156 },
        { icon: Building2, name: 'Business', count: 89 },
        { icon: BookOpen, name: 'Teaching', count: 167 },
        { icon: Wrench, name: 'Plumbing', count: 92 },
        { icon: Landmark, name: 'Banking', count: 145 },
        { icon: ShoppingBag, name: 'Retail', count: 234 },
        { icon: Utensils, name: 'Food Service', count: 189 },
        { icon: Stethoscope, name: 'Healthcare', count: 278 }
    ];



    // State for storing fetched data
    const [selectedTab, setSelectedTab] = useState<'professional' | 'quicktasks' | 'freelance'>('professional');
    const [professionalJobs, setProfessionalJobs] = useState<ProfessionalJob[]>([]);
    const [quickTasks, setQuickTasks] = useState<QuickTask[]>([]);
    const [freelanceProjects, setFreelanceProjects] = useState<FreelanceProject[]>([]);

    // Fetch data when component mounts

    const fetchJobs = async () => {
        try {
            const jobTypesSnapshot = await getDocs(collection(db, 'jobs'));
            const jobTypesMap = new Map(
                jobTypesSnapshot.docs.map(doc => [doc.id, doc.data().jobCategory])
            );
            console.log('Job Types:', Object.fromEntries(jobTypesMap));
    
            const jobsSnapshot = await getDocs(collection(db, 'jobsVariant'));
            const professionalJobs: ProfessionalJob[] = [];
            const quickTasks: QuickTask[] = [];
            const freelanceProjects: FreelanceProject[] = [];
    
            for (const doc of jobsSnapshot.docs) {
                const baseData = doc.data();
                const jobCategory = jobTypesMap.get(baseData.jobId);
                console.log('Processing job:', {
                    id: doc.id,
                    category: jobCategory,
                    jobId: baseData.jobId
                });
    
                if (!jobCategory || !baseData.jobId) {
                    console.log('Skipping invalid job:', {
                        id: doc.id,
                        jobId: baseData.jobId,
                        category: jobCategory
                    });
                    continue;
                }
    
                const userRef = firestoreDoc(db, 'users', baseData.userId);
                const userDoc = await getDoc(userRef);
                const userData = userDoc.data();
                const creatorName = userData ? `${userData.firstName} ${userData.lastName}` : '';
    
                let profileSetAsRef = query(
                    collection(db, 'profileImageSetAs'),
                    where('userId', '==', baseData.userId),
                    where('setAs', '==', 'jobProfile')
                );
                let profileSetAsSnapshot = await getDocs(profileSetAsRef);
    
                if (profileSetAsSnapshot.empty) {
                    profileSetAsRef = query(
                        collection(db, 'profileImageSetAs'),
                        where('userId', '==', baseData.userId),
                        where('setAs', '==', 'profile')
                    );
                    profileSetAsSnapshot = await getDocs(profileSetAsRef);
                }
    
                let profileImageUrl = null;
                if (!profileSetAsSnapshot.empty) {
                    const imageId = profileSetAsSnapshot.docs[0].data().profileImageId;
                    const imageRef = firestoreDoc(db, 'profileImages', imageId);
                    const imageDoc = await getDoc(imageRef);
                    profileImageUrl = imageDoc.data()?.imageURL;
                }
    
                const requirementsSnapshot = await getDocs(
                    query(collection(db, 'jobRequirements'),
                        where('jobProfessionalId', '==', doc.id))
                );
    
                const skillsSnapshot = await getDocs(
                    query(collection(db, 'jobSkills'),
                        where('jobProfessionalId', '==', doc.id))
                );
    
                const qualificationsSnapshot = await getDocs(
                    query(collection(db, 'jobQualifications'),
                        where('jobProfessionalId', '==', doc.id))
                );
    
                const questionsSnapshot = await getDocs(
                    query(collection(db, 'jobQuestions'),
                        where('jobProfessionalId', '==', doc.id))
                );
    
                const questions = await Promise.all(
                    questionsSnapshot.docs.map(async (questionDoc) => {
                        const optionsSnapshot = await getDocs(
                            query(collection(db, 'jobAnswerOptions'),
                                where('jobProfessionalQuestionsId', '==', questionDoc.id))
                        );
    
                        return {
                            id: questionDoc.id,
                            question: questionDoc.data().question,
                            answerType: questionDoc.data().answerType as 'text' | 'multiple' | 'single',
                            answerOptions: optionsSnapshot.docs.map(opt => opt.data().optionText)
                        };
                    })
                );
    
                const commonData = {
                    id: doc.id,
                    jobTitle: baseData.jobTitle,
                    jobDescription: baseData.jobDescription,
                    userId: baseData.userId,
                    jobId: baseData.jobId,
                    createdAt: baseData.createdAt,
                    userName: creatorName,
                    userImage: profileImageUrl,
                    requirements: {
                        id: requirementsSnapshot.docs[0]?.id || '',
                        description: requirementsSnapshot.docs[0]?.data()?.description || []
                    },
                    skills: {
                        id: skillsSnapshot.docs[0]?.id || '',
                        skillsNeeded: skillsSnapshot.docs[0]?.data()?.skillsNeeded || []
                    }
                };
    
                if (jobCategory === 'professional') {
                    professionalJobs.push({
                        ...commonData,
                        company: {
                            name: baseData.company?.name || '',
                            logo: baseData.company?.logo || ''
                        },
                        location: baseData.location || '',
                        priceRange: baseData.priceRange || { from: '', to: '' },
                        type: baseData.type || 'Full-time',
                        qualifications: {
                            id: qualificationsSnapshot.docs[0]?.id || '',
                            qualificationsNeeded: qualificationsSnapshot.docs[0]?.data()?.qualificationsNeeded || []
                        },
                        questions
                    } as ProfessionalJob);
                }
                else if (jobCategory === 'quickTask') {
                    console.log('Adding Quick Task:', baseData);
                    quickTasks.push({
                        ...commonData,
                        budget: baseData.budget || '',
                        duration: baseData.duration || '',
                        location: baseData.location || '',
                        priceRange: baseData.priceRange || { from: '', to: '' },
                        taskProvider: {
                            name: creatorName,
                            avatar: profileImageUrl,
                            rating: 0,
                            tasksCompleted: 0
                        }
                    } as QuickTask);
                }
                else if (jobCategory === 'freelance') {
                    freelanceProjects.push({
                        ...commonData,
                        budget: baseData.budget || { range: '', type: 'Fixed' },
                        duration: baseData.duration || '',
                        priceRange: baseData.priceRange || { from: '', to: '' },
                        clientInfo: {
                            name: creatorName,
                            avatar: profileImageUrl,
                            rating: 0,
                            projectsPosted: 0,
                            successRate: 0
                        },
                        proposalCount: baseData.proposalCount || 0,
                        deadline: baseData.deadline || '',
                        qualifications: {
                            id: qualificationsSnapshot.docs[0]?.id || '',
                            qualificationsNeeded: qualificationsSnapshot.docs[0]?.data()?.qualificationsNeeded || []
                        }
                    } as FreelanceProject);
                }
            }
    
            console.log('Final Jobs Data:', {
                professional: professionalJobs,
                quickTasks,
                freelance: freelanceProjects
            });
    
            setProfessionalJobs(professionalJobs);
            setQuickTasks(quickTasks);
            setFreelanceProjects(freelanceProjects);
    
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };
    

    useEffect(() => {
        fetchJobs();
    }, []);







    // Render Function
    const renderJobContent = () => {
        switch (activeJobType) {
            case 'professional':
                return (
                    <div className="space-y-6">
                        {professionalJobs.map((job) => (
                            <div
                                key={job.id}
                                className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    <div className="w-full lg:w-64 bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden mb-4 group-hover:scale-105 transition-transform">
                                            <Image
                                                src={job.userImage || '/default-avatar.png'}
                                                alt={job.userName}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                                unoptimized={true}
                                            />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900 text-center">{job.userName}</h4>
                                        <span className="text-sm text-gray-500">View profile</span>
                                    </div>

                                    <div className="flex-1 p-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-greenTheme transition-colors">
                                                        {job.jobTitle}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                                                            ${job.type === 'Full-time' ? 'bg-green-100 text-green-700' :
                                                            job.type === 'Part-time' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-purple-100 text-purple-700'}`}>
                                                        {job.type}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={16} className="text-gray-400" />
                                                        {job.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign size={16} className="text-gray-400" />
                                                        {job.priceRange?.from} - {job.priceRange?.to}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="bookmark">
                                                    <Bookmark size={20} className="text-gray-400 hover:text-greenTheme" />
                                                </button>
                                                <Button className="flex-1 sm:flex-none bg-greenTheme text-white rounded-full px-6 py-2 hover:bg-greenTheme/90 transition-colors">
                                                    Apply Now
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex flex-wrap gap-2">
                                                {job.skills.skillsNeeded.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-1.5 bg-gray-50 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-4">
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={16} />
                                                        Posted {new Date(job.createdAt).toLocaleDateString()}

                                                    </span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Users size={16} />
                                                        23 applicants
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-500">Job matching score:</span>
                                                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-greenTheme w-3/4 rounded-full"></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-greenTheme">75%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                );

            case 'quicktasks':
                console.log('Quick Tasks after fetch:', quickTasks);
                return (
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {quickTasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
                            >
                                <div className="relative h-32 bg-gradient-to-r from-green-50 to-blue-50 p-4">
                                    <span className="absolute top-4 right-4 px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-greenTheme">
                                        Quick Task
                                    </span>
                                    <div className="absolute -bottom-6 left-4">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={task.taskProvider.avatar}
                                                alt={task.taskProvider.name}
                                                width={48}
                                                height={48}
                                                className="rounded-full border-4 border-white"
                                                unoptimized={true}
                                            />
                                            <div className="bg-white px-3 py-1 rounded-full shadow-sm">
                                                <div className="flex items-center gap-1">
                                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                                    <span className="text-sm font-medium">{task.taskProvider.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 pt-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{task.jobTitle}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{task.jobDescription}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {task.skills.skillsNeeded.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-50 rounded-full text-sm font-medium text-gray-600"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                            <Clock size={16} className="text-gray-400" />
                                            <span className="text-sm text-gray-600">{task.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span className="text-sm text-gray-600">{task.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                            <span className="flex items-center gap-2">
                                                <span className="flex items-center">
                                                    <DollarSign size={16} className="text-gray-400" />
                                                    {task.priceRange.from}
                                                </span>
                                                <span>-</span>
                                                <span className="flex items-center">
                                                    <DollarSign size={16} className="text-gray-400" />
                                                    {task.priceRange.to}
                                                </span>
                                            </span>
                                        </div>

                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Posted {new Date(task.createdAt).toLocaleDateString()}

                                        </div>
                                        <Button
                                            className="bg-greenTheme/10 text-greenTheme hover:bg-greenTheme hover:text-white rounded-full px-6 py-2 transition-colors"
                                        >
                                            Apply Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'freelance':
                return (
                    <div className="space-y-6">
                        {freelanceProjects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-gradient-to-r from-white to-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Left Column - Client Info */}
                                    <div className="w-full lg:w-72 p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
                                        <div className="flex flex-col items-center text-center">
                                            <Image
                                                src={project.clientInfo.avatar}
                                                alt={project.clientInfo.name}
                                                width={80}
                                                height={80}
                                                className="rounded-full mb-4"
                                                unoptimized={true}
                                            />
                                            <h4 className="text-lg font-semibold text-gray-900">{project.clientInfo.name}</h4>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                                <span className="font-medium">{project.clientInfo.rating}</span>
                                            </div>
                                            <div className="text-sm text-gray-600 mt-2">
                                                {project.clientInfo.projectsPosted} projects posted
                                            </div>

                                            <div className="mt-4 w-full">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-gray-600">Project Success</span>
                                                    <span className="text-gray-900 font-medium">{project.clientInfo.successRate}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full">
                                                    <div
                                                        className="h-full bg-greenTheme rounded-full"
                                                        style={{ width: `${project.clientInfo.successRate}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Project Details */}
                                    <div className="flex-1 p-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">{project.jobTitle}</h3>
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                                        {project.proposalCount} proposals
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                                    <span className="flex items-center gap-2">
                                                        <Clock size={16} className="text-gray-400" />
                                                        {project.deadline} deadline
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <span className="flex items-center">
                                                            <DollarSign size={16} className="text-gray-400" />
                                                            {project.priceRange.from}
                                                        </span>
                                                        <span>-</span>
                                                        <span className="flex items-center">
                                                            <DollarSign size={16} className="text-gray-400" />
                                                            {project.priceRange.to}
                                                        </span>
                                                        <span>({project.budget.type})</span>
                                                    </span>

                                                </div>
                                            </div>
                                            <Button className="w-full sm:w-auto bg-greenTheme text-white rounded-full px-6 py-2">
                                                Submit Proposal
                                            </Button>
                                        </div>

                                        <p className="text-gray-600 mb-6">{project.jobDescription}</p>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Required Skills</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.skills.skillsNeeded.map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                    <span className="flex items-center gap-1 text-sm text-gray-500">
                                                        <Clock size={16} />
                                                        Posted {formatDistanceToNow(new Date(project.createdAt))} ago
                                                    </span>
                                                    <span className="hidden sm:inline text-gray-500">•</span>
                                                    <span className="text-sm text-gray-500">Proposals close in {project.deadline}</span>
                                                </div>
                                                <button className="text-greenTheme hover:underline text-sm font-medium">
                                                    Save Project
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

        }

    };


    // THIS SECTION IS TO BE DELETED AFTER SUCCESSFUL TEST

    // Add to your existing state declarations
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);


    const JobCreationModal = () => {
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

        // Questions
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
                // 1. Create main job document
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

                // 2. Add requirements
                await addDoc(collection(db, 'jobRequirements'), {
                    description: requirements,
                    jobProfessionalId: jobRef.id
                });

                // 3. Add skills
                await addDoc(collection(db, 'jobSkills'), {
                    skillsNeeded: skills,
                    jobProfessionalId: jobRef.id
                });

                // 4. Add qualifications
                await addDoc(collection(db, 'jobQualifications'), {
                    qualificationsNeeded: qualifications,
                    jobProfessionalId: jobRef.id
                });

                // 5. Add questions and their options
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

                setIsJobModalOpen(false);
                const handleSubmit = async (e: React.FormEvent) => {
                    e.preventDefault();

                    try {
                        // 1. Create main job document
                        const jobRef = await addDoc(collection(db, 'jobsVariant'), {
                            jobTitle: title,
                            jobDescription: description,
                            userId: auth.currentUser?.uid,
                            jobId: selectedJobType,
                            createdAt: serverTimestamp()
                        });

                        // 2. Add requirements
                        await addDoc(collection(db, 'jobRequirements'), {
                            description: requirements,
                            jobProfessionalId: jobRef.id
                        });

                        // 3. Add skills
                        await addDoc(collection(db, 'jobSkills'), {
                            skillsNeeded: skills,
                            jobProfessionalId: jobRef.id
                        });

                        // 4. Add qualifications
                        await addDoc(collection(db, 'jobQualifications'), {
                            qualificationsNeeded: qualifications,
                            jobProfessionalId: jobRef.id
                        });

                        // 5. Add questions and their options
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

                        setIsJobModalOpen(false);
                        alert('Job created successfully!');

                    } catch (error) {
                        alert('Failed to create a job, Please Try Again');
                        console.error('Error creating job:', error);
                    }
                };


            } catch (error) {
                console.error('Error creating job:', error);
                // Optional: Add error notification here
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-[10000]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Create Job</h2>
                        <button onClick={() => setIsJobModalOpen(false)}>
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
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
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
                                onClick={() => setIsJobModalOpen(false)}
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
    };





    return (
        <div className="min-h-screen bg-gray-50">
        
            {/* Main Content */}
            <main className="container mx-auto px-4 pt-36">
                {/* Hero Section */}
                <div className="mb-8 lg:mb-12 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Find Your Next Career Opportunity
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-600">
                        Discover <span className="text-greenTheme font-semibold">2,148</span> job opportunities waiting for you
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="relative mb-8 lg:mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-8">
                        <div className="flex flex-col lg:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Job title, keywords, or company"
                                    className="w-full h-12 lg:h-14 pl-12 pr-4 bg-gray-50 rounded-xl text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-greenTheme/20"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                            </div>
                            <Button className="h-12 lg:h-14 px-8 bg-greenTheme text-white rounded-xl text-base lg:text-lg font-semibold hover:bg-greenTheme/90">
                                Search Jobs
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                {['Remote', 'Full-time', 'Tech', 'Marketing', 'Design'].map((filter) => (
                                    <button
                                        key={filter}
                                        className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-greenTheme hover:text-greenTheme transition-colors text-sm"
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                            <button className="flex items-center gap-2 text-greenTheme hover:text-greenTheme/80 ml-auto">
                                <Sliders size={20} />
                                <span className="text-sm">Advanced Filters</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Job Categories */}
                <div className="mb-8 lg:mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Popular Categories</h2>
                        <Button className="text-greenTheme bg-transparent hover:bg-greenTheme/10 text-sm">
                            View All Categories
                        </Button>
                    </div>

                    <Swiper
                        slidesPerView={1}
                        spaceBetween={16}
                        pagination={{
                            clickable: true,
                            bulletClass: 'swiper-pagination-bullet !bg-gray-300 !opacity-100',
                            bulletActiveClass: 'swiper-pagination-bullet-active !bg-greenTheme'
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 4 }
                        }}
                        modules={[Pagination]}
                        className="!pb-12"
                    >
                        {jobCategories.map((category) => (
                            <SwiperSlide key={category.name}>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-greenTheme/50 hover:shadow-lg transition-all cursor-pointer group h-full">
                                    <category.icon size={32} className="text-greenTheme mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                                    <p className="text-gray-500">{category.count} jobs</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>


                <Button
                    onClick={() => setIsJobModalOpen(true)}
                    className="bg-greenTheme text-white rounded-full px-6 py-2"
                >
                    Create Job
                </Button>

                {isJobModalOpen && <JobCreationModal />}

                {/* Job Listings Section */}
                <div className="mb-8 lg:mb-12">
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
                        {jobTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setActiveJobType(type.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${activeJobType === type.id
                                    ? 'bg-greenTheme text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <type.icon size={20} />
                                <span className="whitespace-nowrap">{type.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Section */}
                    {renderJobContent()}
                </div>

            </main>


        </div>
    );

}
