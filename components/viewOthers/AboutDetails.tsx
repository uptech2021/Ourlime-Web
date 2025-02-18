'use client';

import { Briefcase, GraduationCap, Code, Heart, MapPin, Mail, Phone, Calendar, User, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface AboutDetailsProps {
    about: {
        workExperience: any[];
        education: any[];
        interests: any[];
        skills: any[];
    };
    userData: any;
    contacts?: any[];
    addresses?: any[];

}

export const AboutDetails = ({ about, userData, contacts, addresses }: AboutDetailsProps) => {
    const { workExperience, education, interests, skills } = about;

    return (
        <>
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="text-greenTheme" />
                    Basic Information
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="text-gray-900">{userData.firstName} {userData.lastName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="text-gray-900">@{userData.userName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="text-gray-900">{userData.gender}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Birthday</p>
                            <p className="text-gray-900">{userData.birthday}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Mail className="text-greenTheme" />
                        <span>{userData.email}</span>
                    </div>
                    {contacts?.map(contact => (
                        <div key={contact.id} className="flex items-center gap-3">
                            <Phone className="text-greenTheme" />
                            <div>
                                <span className="text-gray-900">{contact.contactNumber}</span>
                                <span className="text-sm text-gray-500 ml-2">({contact.settings[0]?.setAs})</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Home className="text-greenTheme" />
                    Addresses
                </h3>
                <div className="space-y-4">
                    {addresses?.map(address => (
                        <div key={address.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">{address.settings[0]?.setAs}</span>
                            </div>
                            <p className="text-gray-600">{address.address}</p>
                            <div className="mt-2 text-sm text-gray-500">
                                <span>{address.city}, </span>
                                <span>{address.postalCode} </span>
                                {address.zipCode && <span>- {address.zipCode}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h3 className="text-xl font-semibold mb-4">Work Experience</h3>
                <div className="space-y-6">
                    {workExperience.map((work) => (
                        <div key={work.id} className="flex gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Briefcase className="text-greenTheme" />
                            </div>
                            <div>
                                <h4 className="font-medium text-lg">{work.role}</h4>
                                <p className="text-gray-600">{work.company}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(work.startDate).toLocaleDateString()} -
                                    {work.current ? 'Present' : ''}
                                </p>
                                {work.description && (
                                    <p className="text-gray-600 mt-2">{work.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h3 className="text-xl font-semibold mb-4">Education</h3>
                <div className="space-y-6">
                    {education.map((edu) => (
                        <div key={edu.id} className="flex gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <GraduationCap className="text-greenTheme" />
                            </div>
                            <div>
                                <h4 className="font-medium text-lg">{edu.degree}</h4>
                                <p className="text-gray-600">{edu.school}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(edu.startDate).toLocaleDateString()} -
                                    {edu.current ? 'Present' : ''}
                                </p>
                                {edu.description && (
                                    <p className="text-gray-600 mt-2">{edu.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills and Interests */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Skills */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
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
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
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
        </>
    );
};
