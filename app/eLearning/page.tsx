'use client';

import { BookOpen, BookText, Users, Calendar } from 'lucide-react';
import { useState } from 'react';
import { HeroSection } from '@/components/eLearning/heroSection/page';
import { CourseMessages } from '@/components/eLearning/courseMessages/page';
import { LearningMaterials } from '@/components/eLearning/learningMaterials/page';
import Resources from '@/components/eLearning/resources/page';
import Tutors from '@/components/eLearning/tutors/page';
import Schedule from '@/components/eLearning/schedules/page';

export default function ELearningPage() {
    const [activeSection, setActiveSection] = useState('courseMaterials');
    const [activeTab, setActiveTab] = useState('materials');

    const sections = [
        { id: 'courseMaterials', label: 'Course Materials', icon: BookOpen },
        { id: 'schedule', label: 'Schedule Work', icon: Calendar }
    ];

    const tabs = [
        { id: 'materials', label: 'Learning Materials', icon: BookOpen },
        { id: 'resources', label: 'Resources', icon: BookText },
        { id: 'tutors', label: 'Tutors', icon: Users }
    ];

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <main className="pt-16 sm:pt-20 md:pt-32 lg:pt-32">
                <HeroSection />
                <CourseMessages />

                {/* Section Toggle Buttons */}
                <div className="px-4 py-6">
                    <div className="flex justify-center gap-4 mb-6">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                                    activeSection === section.id
                                        ? 'bg-greenTheme text-white shadow-lg'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                <section.icon className="w-5 h-5" />
                                <span className="text-base font-medium">{section.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Mobile View */}
                    <div className="lg:hidden">
                        <div className="bg-white rounded-xl p-4">
                            {activeSection === 'courseMaterials' && (
                                <>
                                    <div className="flex overflow-x-auto gap-2 mb-4 scrollbar-hide">
                                        {tabs.map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                                    activeTab === tab.id
                                                        ? 'bg-greenTheme text-white'
                                                        : 'bg-gray-50 hover:bg-gray-100'
                                                }`}
                                            >
                                                <tab.icon className="w-4 h-4" />
                                                <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        {activeTab === 'materials' && <LearningMaterials />}
                                        {activeTab === 'resources' && <Resources />}
                                        {activeTab === 'tutors' && <Tutors />}
                                    </div>
                                </>
                            )}
                            {activeSection === 'schedule' && <Schedule />}
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden lg:block">
                        <div className="bg-white rounded-xl p-4">
                            {activeSection === 'courseMaterials' && (
                                <div className="grid lg:grid-cols-12 gap-4">
                                    <LearningMaterials />
                                    <Resources />
                                    <Tutors />
                                </div>
                            )}
                            {activeSection === 'schedule' && <Schedule />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
