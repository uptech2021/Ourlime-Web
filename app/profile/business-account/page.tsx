'use client';

import { useState, useEffect } from 'react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { ProfileImage, UserData } from '@/types/userTypes';
import { useProfileStore } from 'src/store/useProfileStore';
import ProfileHeader from '@/components/commonProfileHeader/ProfileHeader';
import BusinessAccountContent from '@/components/profile/business-account/BusinessAccountContent';
import { auth } from '@/lib/firebaseConfig';

export default function BusinessAccountPage() {
    const [activeTab, setActiveTab] = useState('timeline');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isBusinessAccount, setIsBusinessAccount] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { profileImage, userImages } = useProfileStore();

    
    useEffect(() => {
        const checkBusinessStatus = async () => {
            const user = auth.currentUser;
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/business-account', {
                    headers: {
                        'userId': user.uid
                    }
                });
                const data = await response.json();
                console.log('Business account data:', data);
                setIsBusinessAccount(data.data !== null);
            } catch (error) {
                console.error('Error checking business status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkBusinessStatus();
    }, []);

    const handleBusinessRequest = async () => {
        const user = auth.currentUser;
        if (!user) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/business-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.uid,
                    businessName: 'New Business',
                    description: '',
                    established: '',
                    location: '',
                    contact: {
                        email: user.email || '',
                        phone: '',
                        website: ''
                    },
                    categories: []
                })
            });

            const data = await response.json();
            if (data.status === 'success') {
                setIsBusinessAccount(true);
            }
        } catch (error) {
            console.error('Error requesting business account:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                            <div className="flex-1 overflow-y-auto min-h-0 p-6">
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greenTheme"></div>
                                    </div>
                                ) : (
                                    isBusinessAccount ? (
                                        <BusinessAccountContent />
                                    ) : (
                                        <div className="text-center space-y-4">
                                            <h2 className="text-2xl font-bold">Upgrade to Business Account</h2>
                                            <p className="text-gray-600">
                                                Get access to exclusive business features and grow your presence on our platform.
                                            </p>
                                            <button
                                                onClick={handleBusinessRequest}
                                                className="bg-greenTheme text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                                disabled={isLoading}
                                            >
                                                Request Business Account
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
