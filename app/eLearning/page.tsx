'use client';

import { BookOpen, BookText, Users } from 'lucide-react';
import { useState } from 'react';
import { HeroSection } from '@/components/eLearning/heroSection/page';
import { CourseMessages } from '@/components/eLearning/courseMessages/page';
import { LearningMaterials } from '@/components/eLearning/learningMaterials/page';
import Resources from '@/components/eLearning/resources/page';
import Tutors from '@/components/eLearning/tutors/page';

export default function ELearningPage() {
    const [activeTab, setActiveTab] = useState('materials');

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

                {/* Mobile Tabs */}
                <div className="lg:hidden px-4 py-6">
                    <div className="bg-white rounded-xl p-4">
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
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-4 py-6">
                    <LearningMaterials />
                    <Resources />
                    <Tutors />
                </div>
            </main>
        </div>
    );
}
