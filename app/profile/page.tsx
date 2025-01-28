'use client';

import { useState } from 'react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import {
  Bookmark, Calendar, CircleUser, ImageIcon,
  Info, Palette, Users, UsersRound, Video
} from 'lucide-react';
import { ProfileImage, UserData } from '@/types/userTypes';
import { useProfileStore } from 'src/store/useProfileStore';
import TimelineContent from '@/components/profile/links/TimelineContent';
import AboutContent from '@/components/profile/links/AboutContent';
import FriendsContent from '@/components/profile/links/FriendsContent';
import PhotosContent from '@/components/profile/links/PhotosContent';
import VideosContent from '@/components/profile/links/VideosContent';
import ProfileHeader from '@/components/commonProfileHeader/ProfileHeader';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCustomizationContent from '@/components/profile/links/ProfileCustomizationContent';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { profileImage, userImages } = useProfileStore();

  return (
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

              {/* Navigation */}
              <div className="border-b">
                <div className="flex gap-x-4 md:gap-x-6 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'timeline'
                      ? 'text-greenTheme border-b-2 border-greenTheme'
                      : 'text-gray-600 hover:text-greenTheme'
                      }`}
                  >
                    <CircleUser size={18} />
                    <span>Timeline</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('customize')}
                    className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'customize'
                      ? 'text-greenTheme border-b-2 border-greenTheme'
                      : 'text-gray-600 hover:text-greenTheme'
                      }`}
                  >
                    <Palette size={18} />
                    <span>Customize</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('about')}
                    className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'about'
                      ? 'text-greenTheme border-b-2 border-greenTheme'
                      : 'text-gray-600 hover:text-greenTheme'
                      }`}
                  >
                    <Info size={18} />
                    <span>About</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('friends')}
                    className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'friends'
                      ? 'text-greenTheme border-b-2 border-greenTheme'
                      : 'text-gray-600 hover:text-greenTheme'
                      }`}
                  >
                    <Users size={18} />
                    <span>Friends</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('photos')}
                    className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'photos'
                      ? 'text-greenTheme border-b-2 border-greenTheme'
                      : 'text-gray-600 hover:text-greenTheme'
                      }`}
                  >
                    <ImageIcon size={18} />
                    <span>Photos</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('videos')}
                    className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'videos'
                      ? 'text-greenTheme border-b-2 border-greenTheme'
                      : 'text-gray-600 hover:text-greenTheme'
                      }`}
                  >
                    <Video size={18} />
                    <span>Videos</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('groups')}
                    className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'groups'
                      ? 'text-greenTheme border-b-2 border-greenTheme'
                      : 'text-gray-600 hover:text-greenTheme'
                      }`}
                  >
                    <UsersRound size={18} />
                    <span>Groups</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('events')}
                    className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'events'
                      ? 'text-greenTheme border-b-2 border-greenTheme'
                      : 'text-gray-600 hover:text-greenTheme'
                      }`}
                  >
                    <Calendar size={18} />
                    <span>Events</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('saved')}
                    className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'saved'
                      ? 'text-greenTheme border-b-2 border-greenTheme'
                      : 'text-gray-600 hover:text-greenTheme'
                      }`}
                  >
                    <Bookmark size={18} />
                    <span>Saved</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-4 sm:p-6 lg:p-8 relative min-h-[600px] overflow-x-hidden">
                  <AnimatePresence mode="wait">
                    {activeTab === 'timeline' && (
                      <motion.div
                        key="timeline"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut"
                        }}
                        className="absolute w-full"
                      >
                        <TimelineContent userData={userData} profileImage={profileImage} />
                      </motion.div>
                    )}
                    {activeTab === 'customize' && (
                      <motion.div
                        key="customize"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut"
                        }}
                        className="absolute w-full"
                      >
                        <ProfileCustomizationContent
                          userData={userData}
                          profileImage={profileImage}
                          userImages={userImages}
                        />
                      </motion.div>
                    )}
                    {activeTab === 'about' && (
                      <motion.div
                        key="about"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut"
                        }}
                        className="absolute w-full"
                      >
                        <AboutContent userData={userData} profileImage={profileImage} />
                      </motion.div>
                    )}
                    {activeTab === 'friends' && (
                      <motion.div
                        key="friends"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut"
                        }}
                        className="absolute w-full"
                      >
                        <FriendsContent userData={userData} profileImage={profileImage} />
                      </motion.div>
                    )}
                    {activeTab === 'photos' && (
                      <motion.div
                        key="photos"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut"
                        }}
                        className="absolute w-full"
                      >
                        <PhotosContent userData={userData} profileImage={profileImage} />
                      </motion.div>
                    )}
                    {activeTab === 'videos' && (
                      <motion.div
                        key="videos"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut"
                        }}
                        className="absolute w-full"
                      >
                        <VideosContent userData={userData} profileImage={profileImage} />
                      </motion.div>
                    )}
                    {activeTab === 'groups' && (
                      <motion.div
                        key="groups"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut"
                        }}
                        className="absolute w-full"
                      >
                        <div>Groups Content</div>
                      </motion.div>
                    )}
                    {activeTab === 'events' && (
                      <motion.div
                        key="events"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut"
                        }}
                        className="absolute w-full"
                      >
                        <div>Events Content</div>
                      </motion.div>
                    )}
                    {activeTab === 'saved' && (
                      <motion.div
                        key="saved"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut"
                        }}
                        className="absolute w-full"
                      >
                        <div>Saved Content</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
