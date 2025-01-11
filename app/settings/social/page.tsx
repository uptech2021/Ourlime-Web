'use client';
import { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import SettingsSidebar from "@/components/settings/nav/page";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { ResizeListener } from '@/helpers/Resize';
import { useRouter } from 'next/navigation';
import { loginRedirect } from '@/helpers/Auth';
import AnimatedLogo from "@/components/AnimatedLoader";

export default function Social() {
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    vkontakte: '',
    linkedin: '',
    instagram: '',
    youtube: ''
  });
  const router = useRouter();
  const [, setIsPc] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const currentUser = await loginRedirect(router, true);
        if (currentUser) {
          setUserId(currentUser.uid);
          const docRef = doc(db, 'profiles', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().social) {
            setSocialLinks(docSnap.data().social);
          }
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
      }
    };

    fetchSocialLinks();
    const cleanup = ResizeListener(setIsPc);
    return () => cleanup();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    if (userId) {
      try {
        const docRef = doc(db, 'profiles', userId);
        await setDoc(docRef, { social: socialLinks }, { merge: true });
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } catch (error) {
        console.error('Error saving social links:', error);
      }
    }
    setIsLoading(false);
  };

  const isFormValid = Object.values(socialLinks).some(value => value !== '');

  if (isLoading) {
    return <AnimatedLogo />;
  }

  if (!userId) {
    return <AnimatedLogo />; 
  }

  return (
    <div className='flex flex-row bg-gray-200 min-h-screen'>
      <SettingsSidebar />

      <main className="flex flex-col text-center mx-auto">
        <div className="text-gray-600 bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] md:w-[40rem] mt-8">
          <h2 className="mb-4 mr-[10rem] lg:mr-[20rem] pt-8 text-left text-2xl font-semibold text-gray-700">
            Social Links
          </h2>

          {showSuccessMessage && (
            <div className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
              Social links saved successfully!
            </div>
          )}

          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4">
            <Input
              type="text"
              name="facebook"
              placeholder="Facebook Username"
              value={socialLinks.facebook}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="twitter"
              placeholder="Twitter Username"
              value={socialLinks.twitter}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4">
            <Input
              type="text"
              name="vkontakte"
              placeholder="Vkontakte Username"
              value={socialLinks.vkontakte}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="linkedin"
              placeholder="Linkedin Username"
              value={socialLinks.linkedin}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4">
            <Input
              type="text"
              name="instagram"
              placeholder="Instagram Username"
              value={socialLinks.instagram}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              name="youtube"
              placeholder="Youtube Username"
              value={socialLinks.youtube}
              onChange={handleInputChange}
            />
          </div>

          <Button
            className={`mt-4 mx-auto rounded px-4 py-2 text-white ${isFormValid ? 'bg-green-500' : 'bg-gray-300'}`}
            isDisabled={!isFormValid || isLoading}
            onClick={handleSave}
          >
            {isLoading ? 'Loading...' : 'Save'}
          </Button>

        </div>
      </main>
    </div>
  );
}
