'use client';

import { Briefcase, GraduationCap, Code, Heart, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface AboutSectionProps {
    about: {
        workExperience: Array<{
            id: string;
            role: string;
            company: string;
            current: boolean;
            startDate: string;
            description: string;
        }>;
        education: Array<{
            id: string;
            degree: string;
            school: string;
            current: boolean;
            startDate: string;
            description: string;
        }>;
        interests: Array<{
            id: string;
            value: string;
            type: 'interests';
        }>;
        skills: Array<{
            id: string;
            value: string;
            type: 'skills';
        }>;
    };
}

export const AboutSection = ({ about }: AboutSectionProps) => {
    const { workExperience, education, interests, skills } = about;
    const [showAllWork, setShowAllWork] = useState(false);
    const [showAllEducation, setShowAllEducation] = useState(false);


    return (
        <div className="space-y-6">
            {/* Work Experience */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                        <Briefcase className="text-greenTheme" />
                        Work Experience
                    </h3>
                    {workExperience.length > 1 && (
                        <button 
                            onClick={() => setShowAllWork(!showAllWork)}
                            className="text-sm text-greenTheme hover:text-green-600 flex items-center gap-1"
                        >
                            {showAllWork ? 'Show Less' : 'View More'}
                            <ChevronRight className={`w-4 h-4 transition-transform ${showAllWork ? 'rotate-90' : ''}`} />
                        </button>
                    )}
                </div>
                <div className="space-y-4">
                    {(showAllWork ? workExperience : workExperience.slice(0, 1)).map(work => (
                        <div key={work.id} className="p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-all">
                            <h4 className="font-medium text-gray-900">{work.role}</h4>
                            <p className="text-gray-600">{work.company}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(work.startDate).toLocaleDateString()} - 
                                {work.current ? 'Present' : ''}
                            </p>
                            {work.description && (
                                <p className="text-gray-600 mt-2">{work.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                        <GraduationCap className="text-greenTheme" />
                        Education
                    </h3>
                    {education.length > 1 && (
                        <button 
                            onClick={() => setShowAllEducation(!showAllEducation)}
                            className="text-sm text-greenTheme hover:text-green-600 flex items-center gap-1"
                        >
                            {showAllEducation ? 'Show Less' : 'View More'}
                            <ChevronRight className={`w-4 h-4 transition-transform ${showAllEducation ? 'rotate-90' : ''}`} />
                        </button>
                    )}
                </div>
                <div className="space-y-4">
                    {(showAllEducation ? education : education.slice(0, 1)).map(edu => (
                        <div key={edu.id} className="p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-all">
                            <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.school}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(edu.startDate).toLocaleDateString()} - 
                                {edu.current ? 'Present' : ''}
                            </p>
                            {edu.description && (
                                <p className="text-gray-600 mt-2">{edu.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills & Interests */}
            <div className="grid grid-cols-2 gap-4">
                {/* Skills */}
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                        <Code className="text-greenTheme" />
                        Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span 
                                key={skill.id}
                                className="px-4 py-2 bg-green-50 text-greenTheme rounded-xl text-sm font-medium hover:bg-green-100 transition-all"
                            >
                                {skill.value}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Interests */}
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                        <Heart className="text-greenTheme" />
                        Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {interests.map(interest => (
                            <span 
                                key={interest.id}
                                className="px-4 py-2 bg-green-50 text-greenTheme rounded-xl text-sm font-medium hover:bg-green-100 transition-all"
                            >
                                {interest.value}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
