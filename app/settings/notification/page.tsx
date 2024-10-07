'use client';
import SettingsSidebar from '@/components/settings/nav/page';
import { Button } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import { useRouter } from 'next/navigation'
import { loginRedirect } from '@/helpers/Auth'
import { ResizeListener } from '@/helpers/Resize'


// Initialize Firebase


type NotificationItemProps = {
  title: string;
  isActive: boolean;
  onToggle: (value: boolean) => void;
};

function NotificationItem({ title, isActive, onToggle }: NotificationItemProps) {
  const handleToggle = () => {
    onToggle(!isActive);
  };

  return (
    <div className="flex items-center py-2">
      <button
        className={`h-4 w-8 lg:h-6 lg:w-12 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'} p-1`}
        onClick={handleToggle}
      >
        <div
          className={`h-2 lg:h-4 w-2 lg:w-4 transform rounded-full bg-white shadow-md transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}
        ></div>
      </button>
      <span className="ml-2 text-xs lg:text-sm text-gray-700">{title}</span>
    </div>
  );
}

export default function Notification() {
  const [notificationSettings, setNotificationSettings] = useState<boolean[]>(Array(11).fill(false));
  const [initialSettings, setInitialSettings] = useState<boolean[]>(Array(11).fill(false));
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const user = auth
  const router = useRouter()
  const [, setIsPc] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchNotificationSettings = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().notification) {
          const settings = docSnap.data().notification;
          setNotificationSettings(settings);
          setInitialSettings(settings);
        }
      }
    };

    fetchNotificationSettings();
  }, []);

  const handleToggle = (index: number, value: boolean) => {
    const newSettings = [...notificationSettings];
    newSettings[index] = value;
    setNotificationSettings(newSettings);
  };

  const saveNotificationSettings = async () => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'profiles', user.uid);
      await setDoc(docRef, { notification: notificationSettings }, { merge: true });
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      setInitialSettings([...notificationSettings]);
    }
    setIsLoading(false);
  };


  const hasChanges = JSON.stringify(notificationSettings) !== JSON.stringify(initialSettings);

  const notificationItems = [
    "Someone liked my posts",
    "Someone commented on my posts",
    "Someone shared on my posts",
    "Someone followed me",
    "Someone liked my pages",
    "Someone visited my profile",
    "Someone mentioned me ",
    "Someone joined my groups",
    "Someone accepted my friend/follow request",
    "Someone posted on my timeline",
    "You have remembrance on this day"
  ];

  useEffect(() => {
    loginRedirect(router)
    const cleanup = ResizeListener(setIsPc)
    return () => cleanup()
  }, [router])

  if (!user.currentUser) return <></>

  else return (
    <div className='flex flex-row bg-gray-200 min-h-screen'>
      <SettingsSidebar />

      <main className="flex flex-col text-center mx-auto">
        <div className="text-gray-600 bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] md:w-[40rem] mt-8">
          <h2 className="mb-4 text-2xl text-left font-semibold text-gray-700">
            Notification Settings
          </h2>

          {showSuccessMessage && (
            <div className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
              Settings saved successfully!
            </div>
          )}

          <p className="text-md lg:text-lg mt-2 text-left mb-4 text-gray-900">
            Notify me when
          </p>
          <div>
            {notificationItems.map((item, index) => (
              <NotificationItem
                key={index}
                title={item}
                isActive={notificationSettings[index]}
                onToggle={(value) => handleToggle(index, value)}
              />
            ))}
            <div className="mt-4 flex justify-center">
              <Button
                className={`mt-4 rounded px-4 py-2 text-white shadow ${hasChanges ? 'bg-green-500' : 'bg-gray-300'}`}
                onClick={saveNotificationSettings}
                disabled={!hasChanges || isLoading}
              >
                {isLoading ? 'Loading...' : 'Save'}
              </Button>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
