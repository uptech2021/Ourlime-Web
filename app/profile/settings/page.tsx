'use client';

import { useState } from 'react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { ProfileImage, UserData } from '@/types/userTypes';
import { useProfileStore } from 'src/store/useProfileStore';
import ProfileHeader from '@/components/commonProfileHeader/ProfileHeader';
import { 
    UserCircle, Bell, Shield, AlertTriangle, 
    BellRing, Mail, MessageSquare, ShieldCheck, 
    Lock, Link, Activity, ChevronRight, Trash2 
  } from 'lucide-react';
  import { Switch } from "@nextui-org/react";
  
export default function SettingsPage() {
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

                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto min-h-0">
  <div className="p-4 md:p-6 space-y-8">
    {/* Account Settings Section */}
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2">
        <UserCircle className="text-greenTheme" />
        Account Settings
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Email Preferences */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 hover:border-greenTheme/20 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-500">Manage your email preferences</p>
            </div>
            <Switch defaultSelected color="success" />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 hover:border-greenTheme/20 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Profile Privacy</h3>
              <p className="text-sm text-gray-500">Control your profile visibility</p>
            </div>
            <Switch defaultSelected color="success" />
          </div>
        </div>

        {/* Activity Status */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 hover:border-greenTheme/20 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Activity Status</h3>
              <p className="text-sm text-gray-500">Show when you're active</p>
            </div>
            <Switch defaultSelected color="success" />
          </div>
        </div>
      </div>
    </div>

    {/* Notification Preferences */}
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2">
        <Bell className="text-greenTheme" />
        Notifications
      </h2>
      
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-4 space-y-4">
          {[
            { title: 'Push Notifications', description: 'Receive push notifications', icon: BellRing },
            { title: 'Email Updates', description: 'Get email updates about your account', icon: Mail },
            { title: 'SMS Alerts', description: 'Receive SMS notifications', icon: MessageSquare }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-3 px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <item.icon className="w-5 h-5 text-greenTheme" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <Switch defaultSelected color="success" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Privacy & Security */}
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2">
        <Shield className="text-greenTheme" />
        Privacy & Security
      </h2>
      
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {[
            { title: 'Two-Factor Authentication', description: 'Add an extra layer of security', icon: ShieldCheck },
            { title: 'Password', description: 'Change your password', icon: Lock },
            { title: 'Connected Accounts', description: 'Manage connected social accounts', icon: Link },
            { title: 'Login Activity', description: 'Review your login history', icon: Activity }
          ].map((item, index) => (
            <div key={index} 
                 className="p-4 flex items-center justify-between hover:bg-green-50/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg group-hover:bg-white transition-colors">
                  <item.icon className="w-5 h-5 text-greenTheme" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-greenTheme transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Danger Zone */}
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold text-red-600 flex items-center gap-2">
        <AlertTriangle className="text-red-600" />
        Danger Zone
      </h2>
      
      <div className="bg-red-50 rounded-xl border border-red-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-red-900">Delete Account</h3>
            <p className="text-sm text-red-600">Permanently delete your account and all data</p>
          </div>
          <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 whitespace-nowrap">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</div>


                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
