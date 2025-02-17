'use client';

import { UserData, ProfileImage } from '@/types/userTypes';
import ContactSection from './abouts/ContactSection';
import AddressSection from './abouts/AddressSection';
import BasicInformationSection from './abouts/BasicInfoSection';
import WorkExperienceSection from './abouts/WorkExperienceSection';
import EducationSection from './abouts/EducationSection';
import InterestSkillsSection from './abouts/InterestsSkillsSection';
import SocialLinksSection from './abouts/SocialLinksSection';

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
      <WorkExperienceSection userData={userData} />

      {/* Education */}
      <EducationSection userData={userData} />

      {/* Interests & Skills */}
      <InterestSkillsSection userData={userData} />

      {/* Social Links */}
      <SocialLinksSection userData={userData} />

    </div>
  );

}
