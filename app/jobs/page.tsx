'use client';

import { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import {
    Search, Clock, Sliders, Code, Palette, LineChart,
    Building2, BookOpen, Wrench, Landmark, ShoppingBag,
    Utensils, Stethoscope, LucideIcon, Briefcase, Plus
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ProfessionalJobsList } from '@/components/jobs/ProfessionalJobsList';
import { QuickTasksList } from '@/components/jobs/QuickTasksList';
import { FreelanceProjectsList } from '@/components/jobs/FreelanceProjectsList';
import { ProfessionalJob, QuickTask, FreelanceProject } from '@/types/jobTypes';
import JobCreationModal from '@/components/jobs/createJobsModel/jobCreationModal';
import { Toaster } from 'react-hot-toast';


type JobTypeItem = {
    id: 'professional' | 'quicktasks' | 'freelance';
    label: string;
    icon: LucideIcon;
}


export default function JobsPage() {
    const [activeJobType, setActiveJobType] = useState<JobTypeItem['id']>('professional');
    const [professionalJobs, setProfessionalJobs] = useState<ProfessionalJob[]>([]);
    const [quickTasks, setQuickTasks] = useState<QuickTask[]>([]);
    const [freelanceProjects, setFreelanceProjects] = useState<FreelanceProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);

    const [jobs, setJobs] = useState([]);


    const jobTypes: JobTypeItem[] = [
        { id: 'professional', label: 'Professional Jobs', icon: Briefcase },
        { id: 'quicktasks', label: 'Quick Tasks', icon: Clock },
        { id: 'freelance', label: 'Freelance', icon: Code }
    ];

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

    // Add this useEffect for fetching jobs
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/jobs');
            const data = await response.json();

            if (data.status === 'success') {
                console.log(data);
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const renderJobContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            );
        }

        switch (activeJobType) {
            case 'professional':
                return <ProfessionalJobsList jobs={jobs} />;
            case 'quicktasks':
                return <QuickTasksList jobs={jobs} />;
            case 'freelance':
                return <FreelanceProjectsList jobs={jobs} />;
        }
    };

    return (
        <>
            <Toaster />
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 pt-36">
                    {/* Hero Section */}
                    <div className="mb-8 lg:mb-12 text-center">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Find Your Next Career Opportunity
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-600">
                            Discover <span className="text-greenTheme font-semibold">
                                {jobs.length}
                            </span> job opportunities waiting for you

                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="relative mb-8 lg:mb-12">
                        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-8">
                            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
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

                    {/* Create Job Button */}
                    <div className="flex justify-end mb-6">
                        <Button
                            onClick={() => setIsJobModalOpen(true)}
                            className="bg-greenTheme text-white rounded-full px-6 py-2 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Create Job
                        </Button>
                    </div>

                    {/* Job Creation Modal */}
                    {isJobModalOpen && (
                        <JobCreationModal
                            isOpen={isJobModalOpen}
                            onClose={() => setIsJobModalOpen(false)}
                        />
                    )}

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

                    {/* Job Listings Section */}
                    <div className="mb-8 lg:mb-12">
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

                        {renderJobContent()}
                    </div>
                </main>
            </div>
        </>
    );
}
