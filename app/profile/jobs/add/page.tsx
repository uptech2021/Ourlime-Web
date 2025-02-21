'use client';

import { useState } from 'react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { Plus, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import JobCreationModal from '@/components/jobs/createJobsModel/jobCreationModal';
import ProfileHeader from '@/components/commonProfileHeader/ProfileHeader';
import { useProfileStore } from '@/src/store/useProfileStore';
import { ProfileImage, UserData } from '@/types/userTypes';

export default function AddJobPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('jobs');
    const [userData, setUserData] = useState<UserData | null>(null);
    const { profileImage, userImages } = useProfileStore();


    return (
        <>
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
                            <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <Briefcase size={64} className="text-greenTheme mb-6" />
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">Ready to Post a New Job?</h1>
                                <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                                    Create opportunities and find the perfect talent for your projects
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl w-full">
                                    <div className="bg-gray-50 p-6 rounded-xl">
                                        <h3 className="text-lg font-semibold mb-2">Define Your Needs</h3>
                                        <p className="text-gray-600">Clearly describe your job requirements and expectations</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-xl">
                                        <h3 className="text-lg font-semibold mb-2">Set Your Budget</h3>
                                        <p className="text-gray-600">Specify your budget range to attract the right candidates</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-xl">
                                        <h3 className="text-lg font-semibold mb-2">Find Your Match</h3>
                                        <p className="text-gray-600">Connect with skilled professionals ready to contribute</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setIsJobModalOpen(true)}
                                    className="bg-greenTheme text-white rounded-full px-8 py-4 text-lg font-semibold flex items-center gap-3 hover:bg-greenTheme/90 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Plus size={24} />
                                    Create New Job
                                    <ArrowRight size={20} />
                                </Button>
                            </div>

                            {isJobModalOpen && (
                                <JobCreationModal
                                    isOpen={isJobModalOpen}
                                    onClose={() => setIsJobModalOpen(false)}
                                />
                            )}
                        </div>
                        </div>

                    </div>
                </div>
            </main>
            <Toaster />
        </div>
        </>
    );
} 