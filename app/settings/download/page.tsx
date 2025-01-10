'use client'
import DownloadData from '@/components/settings/download/data';
import post2 from '@/public/images/articles/post2.jpg';
import { StaticImageData } from 'next/image';
import SettingsSidebar from '@/components/settings/nav/page';
import { Button } from '@nextui-org/react';
import { auth, db } from '@/lib/firebaseConfig';
import { ResizeListener } from '@/helpers/Resize';
import { useRouter } from 'next/navigation';
import { fetchProfile, fetchUser, loginRedirect } from '@/helpers/Auth';
import { useEffect, useState } from 'react';
import { ProfileData, UserData } from '@/types/global';
import AnimatedLogo from '@/components/AnimatedLoader';

type Download = {
    title: string,
    image: StaticImageData,
}

export default function Download() {
    const router = useRouter();
    const [, setIsPc] = useState<boolean>(false);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const downloads = [
        {
            title: 'My Information',
            image: post2
        },
        {
            title: 'My posts',
            image: post2
        },
        {
            title: 'My Groups',
            image: post2,
        },
        {
            title: 'My Pages',
            image: post2
        },
        {
            title: 'Followers',
            image: post2
        },
        {
            title: 'Following',
            image: post2
        }
    ];

    useEffect(() => {
        const initializeDownload = async () => {
            try {
                const currentUser = await loginRedirect(router, true);
                if (currentUser) {
                    const profileSnap = await fetchProfile(currentUser.uid);
                    const userSnap = await fetchUser(currentUser.uid);
                    setProfile(profileSnap.data() as ProfileData);
                    setUser(userSnap.data() as UserData);
                }
            } catch (error) {
                console.error('Error initializing download:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeDownload();
        const cleanup = ResizeListener(setIsPc);
        return () => cleanup();
    }, [router]);

    if (isLoading) {
        return <AnimatedLogo />;
    }

    if (!profile || !user) {
        return <AnimatedLogo />; 
    }

    return (
        <>
            <div className='flex flex-row bg-gray-200 min-h-screen'>
                <SettingsSidebar />

                <main className="flex flex-col text-center mx-auto">
                    <h1 className="text-xl mb-2 mt-10 mx-auto text-gray-800 font-bold lg:[15rem]">Download My Information</h1>
                    <p className="text-sm mb-2 mx-auto text-gray-800 font-bold leg:pr-[3rem]">Please choose whichever Information you would like to download</p>
                    <DownloadData downloads={downloads} />

                    <Button
                        type="submit"
                        className="h-[2rem] w-[8rem] text-white text-sm px-4 py-2 mx-auto rounded-md bg-green-500"
                    >
                        Generate File
                    </Button>
                </main>
            </div>
        </>
    );
}
