'use client'
import React, { useState, useEffect } from 'react';
import { Input, Select, SelectItem, Button, Checkbox } from "@nextui-org/react";
import SettingsSidebar from '@/components/settings/nav/page';
import { auth, db } from '@/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { ResizeListener } from '@/helpers/Resize';
import { useRouter } from 'next/navigation';
import { loginRedirect } from '@/helpers/Auth';





export default function ProfilePage() {
  const router = useRouter();
  const [, setIsPc] = useState<boolean>(false);
  const user = auth;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('');
  const [website, setWebsite] = useState('');
  const [school, setSchool] = useState('');
  const [isSchoolCompleted, setIsSchoolCompleted] = useState(false);
  const [workingAt, setWorkingAt] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);


  const [isLoading, setIsLoading] = useState(false);


  const [, setIsFormComplete] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const handleSave = async () => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (user) {
      try {
        const profileRef = doc(db, 'profiles', user.uid);
        await updateDoc(profileRef, {
          firstName,
          lastName,
          aboutMe,
          location,
          gender,
          website,
          school,
          isSchoolCompleted,
          workingAt,
          companyWebsite
        });

        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } catch (error) {
        console.error("Error updating profile: ", error);
      }
    }
    setIsLoading(false);
  };
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Lat: ${latitude}, Long: ${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setLocation("Unable to retrieve location");
        }
      );
    } else {
      setLocation("Geolocation is not supported by this browser");
    }
  };





  useEffect(() => {
    if (useCurrentLocation) {
      getCurrentLocation();
    }
  }, [useCurrentLocation]);

  useEffect(() => {
    setIsFormComplete(
      !!(firstName || lastName || aboutMe || location || gender || website || school || workingAt || companyWebsite)
    );
  }, [firstName, lastName, aboutMe, location, gender, website, school, workingAt, companyWebsite]);

  useEffect(() => {
    loginRedirect(router)
    const cleanup = ResizeListener(setIsPc)
    return () => cleanup()
  }, [router])

  if (!user.currentUser) return <></>

  else return (
    <div className='md:flex md:flex-row bg-gray-200 min-h-screen'>
      <SettingsSidebar />
      <main className="flex flex-col mx-auto">

        <div className="text-gray-600 bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] md:w-[40rem] mt-8 ">
          <h2 className="text-2xl text-gray-700 font-semibold mb-4 lg:mr-[20rem]">Profile Settings</h2>
          {showSuccessMessage && (
            <div className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
              Profile saved successfully!
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="mt-4">
            <Input label="About me" value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-grow"
            />
            <Checkbox
              isSelected={useCurrentLocation}
              onValueChange={(checked) => {
                setUseCurrentLocation(checked);
                if (checked) {
                  getCurrentLocation();
                }
              }}
            >
              Use current location
            </Checkbox>
          </div>


          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Select
              label="Gender"
              placeholder="Select gender"
              selectedKeys={gender ? [gender] : []}
              onSelectionChange={(keys) => setGender(Array.from(keys)[0] as string)}
            >
              <SelectItem key="male" value="male">Male</SelectItem>
              <SelectItem key="female" value="female">Female</SelectItem>
              <SelectItem key="other" value="other">Other</SelectItem>
            </Select>

            <Input label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input label="School" value={school} onChange={(e) => setSchool(e.target.value)} />
            <div className="flex items-center">
              <Checkbox defaultSelected checked={isSchoolCompleted} onChange={(e) => setIsSchoolCompleted(e.target.checked)}>Completed</Checkbox>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Input label="Working at" value={workingAt} onChange={(e) => setWorkingAt(e.target.value)} />
            <Input label="Company Website" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />

          </div>
          <Button
            className={`mt-4 mx-auto block rounded px-4 py-2 text-white ${firstName || lastName || aboutMe || location || gender || website || school || workingAt || companyWebsite
              ? 'bg-green-500'
              : 'bg-gray-300 cursor-not-allowed'
              }`}
            disabled={!(firstName || lastName || aboutMe || location || gender || website || school || workingAt || companyWebsite) || isLoading}
            onClick={handleSave}
          >
            {isLoading ? 'Loading...' : 'Save'}
          </Button>


        </div>
      </main>
    </div>
  );
}
