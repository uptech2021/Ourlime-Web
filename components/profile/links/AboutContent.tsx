'use client';

import { UserData, ProfileImage } from '@/types/userTypes';
import { Mail, Phone, MapPin, Building2, GraduationCap, MapPinned, AtSign, Briefcase, User, School, Heart, Code, Globe, Twitter, Linkedin, Github } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

type AboutContentProps = {
  userData: UserData;
  profileImage: ProfileImage;
}

export default function AboutContent({ userData, profileImage }: AboutContentProps) {
  const [contactInfo, setContactInfo] = useState([]);
  const [addressInfo, setAddressInfo] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch Contacts
        const contactsQuery = query(
          collection(db, 'contact'),
          where('userId', '==', user.uid)
        );
        const contactsSnapshot = await getDocs(contactsQuery);
        const contacts = contactsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Get contact settings
        const contactsWithSettings = await Promise.all(
          contacts.map(async (contact) => {
            const setAsQuery = query(
              collection(db, 'contactSetAs'),
              where('contactId', '==', contact.id)
            );
            const setAsSnapshot = await getDocs(setAsQuery);
            return {
              ...contact,
              settings: setAsSnapshot.docs.map(doc => doc.data())
            };
          })
        );
        setContactInfo(contactsWithSettings);

        // Fetch Addresses
        const addressesQuery = query(
          collection(db, 'addresses'),
          where('userId', '==', user.uid)
        );
        const addressesSnapshot = await getDocs(addressesQuery);
        const addresses = addressesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Get address settings
        const addressesWithSettings = await Promise.all(
          addresses.map(async (address) => {
            const setAsQuery = query(
              collection(db, 'addressSetAs'),
              where('addressId', '==', address.id)
            );
            const setAsSnapshot = await getDocs(setAsQuery);
            return {
              ...address,
              settings: setAsSnapshot.docs.map(doc => doc.data())
            };
          })
        );
        setAddressInfo(addressesWithSettings);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Contact Information */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
          <Phone className="text-greenTheme" />
          Contact Numbers
        </h3>
        <div className="space-y-3">
          {contactInfo.map((contact, index) => (
            contact.settings.map((setting, settingIndex) => (
              <div
                key={`${index}-${settingIndex}`}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-all"
              >
                <Phone className="w-5 h-5 text-greenTheme" />
                <div className="flex-1">
                  <p className="text-gray-900">{contact.contactNumber}</p>
                  <p className="text-sm text-gray-500 capitalize">{setting.setAs}</p>
                </div>
              </div>
            ))
          ))}
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
          <MapPinned className="text-greenTheme" />
          Addresses
        </h3>
        <div className="space-y-3">
          {addressInfo.map((address, index) => (
            address.settings.map((setting, settingIndex) => (
              <div
                key={`${index}-${settingIndex}`}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-all"
              >
                <MapPin className="w-5 h-5 text-greenTheme flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-gray-900">{address.address}</p>
                  <p className="text-gray-700">{address.city}, {address.postalCode}</p>
                  <p className="text-sm text-gray-500 capitalize mt-1">{setting.setAs}</p>
                </div>
              </div>
            ))
          ))}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-900">
          <User className="text-greenTheme" />
          Basic Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900">{userData?.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-gray-900">@{userData?.userName}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-gray-900">{userData?.firstName} {userData?.lastName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Joined</p>
              {userData?.createdAt instanceof Timestamp
                ? userData.createdAt.toDate().toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                  timeZone: 'UTC'
                })
                : 'Not available'
              }
            </div>

          </div>
        </div>
      </div>

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
