'use client'
import SettingsSidebar from "@/components/settings/nav/page";
import { Select, SelectItem, Button } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import { auth, db } from '@/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ResizeListener } from '@/helpers/Resize';
import { useRouter } from 'next/navigation';
import { loginRedirect } from '@/helpers/Auth';

const privacyOptions = {
  status: ["Online", "Away", "Offline"],
  followMe: ["Everyone", "Friends", "Nobody"],
  messageMe: ["Everyone", "Friends", "Nobody"],
  seeFriends: ["People I Follow", "Everyone", "Nobody"],
  postTimeline: ["Everyone", "Friends", "Nobody"],
  seeBirthday: ["Everyone", "Friends", "Nobody"],
  confirmRequest: ["Yes", "No"],
  showActivities: ["Yes", "No"],
  shareLocation: ["Yes", "No"],
  allowSearch: ["Yes", "No"]
};

export default function Privacy() {
  const router = useRouter();
	const [, setIsPc] = useState<boolean>(false);
	const user = auth;
  const [privacySettings, setPrivacySettings] = useState({
    status: "Online",
    followMe: "Everyone",
    messageMe: "Everyone",
    seeFriends: "People I Follow",
    postTimeline: "Everyone",
    seeBirthday: "Everyone",
    confirmRequest: "No",
    showActivities: "Yes",
    shareLocation: "Yes",
    allowSearch: "Yes"
  });

  const [isChanged, setIsChanged] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchPrivacySettings = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().privacy) {
          setPrivacySettings(docSnap.data().privacy);
        }
      }
    };

    fetchPrivacySettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
    setIsChanged(true);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'profiles', user.uid);
      await setDoc(docRef, { privacy: privacySettings }, { merge: true });
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      setIsChanged(false);
    }
  };

  useEffect(() => {
		loginRedirect(router)
		const cleanup = ResizeListener(setIsPc)
		return () => cleanup()
	}, [router])

	if (!user.currentUser) return <></>

	else return (
    <>
    <div className='md:flex flex-row bg-gray-200 min-h-screen'>
      <SettingsSidebar />

      <main className="flex flex-col text-center mx-auto">
        <div className="text-gray-600 bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] md:w-[40rem] mt-8 mb-8">
          <h2 className="mb-4 ml-[1rem] lg:ml-0 lg:mr-[20rem] text-left text-2xl font-semibold text-gray-700">
            Privacy Settings
          </h2>
          
          {showSuccessMessage && (
            <div className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
              Privacy settings saved successfully!
            </div>
          )}

          {Object.entries(privacySettings).map(([key, value]) => (
            <div key={key} className="pt-2 mb-4">
              <Select
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                labelPlacement="outside"
                placeholder="Select option"
                selectedKeys={[value]}
                onChange={(e) => handleChange(key, e.target.value)}
                classNames={{
                  label: "text-left",
                }}
              >
                {privacyOptions[key as keyof typeof privacyOptions].map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </Select>
            </div>
          ))}

          <Button
            className={`mt-6 rounded px-6 py-2 text-white ${isChanged ? 'bg-green-500' : 'bg-gray-300'}`}
            disabled={!isChanged}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </main>
    </div>
    </>
  );
}
