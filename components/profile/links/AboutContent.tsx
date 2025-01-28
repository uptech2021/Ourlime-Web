'use client';

import { UserData, ProfileImage } from '@/types/userTypes';
import { Mail, Phone, MapPin, Building2, GraduationCap, MapPinned, AtSign, Briefcase, User, School, Heart, Code, Globe, Twitter, Linkedin, Github } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import ContactSection from './abouts/ContactSection';
import AddressSection from './abouts/AddressSection';
import BasicInformationSection from './abouts/BasicInfoSection';

type AboutContentProps = {
  userData: UserData;
  profileImage: ProfileImage;
}

export default function AboutContent({ userData, profileImage }: AboutContentProps) {


  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Contact Information */}
      <ContactSection userData={userData} />

      {/* Address Information */}
      <AddressSection userData={userData} />

      {/* Basic Information */}
      <BasicInformationSection userData={userData} />

      {/* Work Experience */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
          <Building2 className="text-greenTheme" />
          Work Experience
        </h3>
        <div className="space-y-4">
          {[
            { role: 'Senior Developer', company: 'Tech Corp', duration: '2020 - Present', description: 'Leading web development projects' },
            { role: 'Full Stack Developer', company: 'Digital Solutions', duration: '2018 - 2020', description: 'Full stack development and system architecture' }
          ].map((work, index) => (
            <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-all">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="text-greenTheme" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{work.role}</h4>
                <p className="text-gray-600">{work.company}</p>
                <p className="text-sm text-gray-500">{work.duration}</p>
                <p className="text-gray-600 mt-2">{work.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
          <GraduationCap className="text-greenTheme" />
          Education
        </h3>
        <div className="space-y-4">
          {[
            { degree: 'Bachelor of Computer Science', school: 'Tech University', duration: '2016 - 2020', description: 'Specialized in Software Engineering' }
          ].map((edu, index) => (
            <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-all">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <School className="text-greenTheme" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                <p className="text-gray-600">{edu.school}</p>
                <p className="text-sm text-gray-500">{edu.duration}</p>
                <p className="text-gray-600 mt-2">{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interests & Skills */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Interests */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
            <Heart className="text-greenTheme" />
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Technology', 'Photography', 'Travel', 'Music', 'Reading', 'Art'].map((interest, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-green-50 text-greenTheme rounded-xl text-sm font-medium hover:bg-green-100 transition-all"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
            <Code className="text-greenTheme" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Node.js', 'Firebase', 'UI/UX', 'Git'].map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-green-50 text-greenTheme rounded-xl text-sm font-medium hover:bg-green-100 transition-all"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
          <Globe className="text-greenTheme" />
          Social Links
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Twitter, name: 'Twitter', username: '@username' },
            { icon: Linkedin, name: 'LinkedIn', username: 'linkedin/username' },
            { icon: Github, name: 'GitHub', username: 'github/username' }
          ].map((social, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-all cursor-pointer">
              <social.icon className="w-5 h-5 text-greenTheme" />
              <div>
                <p className="text-gray-900 font-medium">{social.name}</p>
                <p className="text-sm text-gray-500">{social.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}
