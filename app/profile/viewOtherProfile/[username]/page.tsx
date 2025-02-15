'use client';

import { useEffect, useState } from 'react';
import { UserData } from '@/types/userTypes';
import { useParams } from 'next/navigation';
import { ViewOtherProfileHeader } from '@/components/commonProfileHeader/ViewOtherProfileHeader';

export default function ViewProfile() {
    const [viewedUser, setViewedUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const username = (params.username as string).replace('@', '');

    useEffect(() => {
        const fetchOtherUserProfile = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/profile/viewOtherProfile?username=${username}`);
                const data = await response.json();
                
                if (data.status === 'success') {
                    setViewedUser(data.user);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setLoading(false);
            }
        };

        fetchOtherUserProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse">Loading profile...</div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">
			<main className="pt-12 sm:pt-20 md:pt-28 lg:pt-36 w-full 2xl:w-9/12 2xl:mx-auto tvScreen:w-7/12 px-2 md:px-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <ViewOtherProfileHeader userData={viewedUser} />
                    {/* Rest of your profile content */}
                </div>
            </main>
        </div>
    );
    
}
