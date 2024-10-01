'use client'
import React, { useState, useEffect } from 'react';
import { Input, Select, SelectItem, Button } from "@nextui-org/react";


export default function ProfilePage() {
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

  const [isFormComplete, setIsFormComplete] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); 
  const handleSave = () => {
   
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000); 
  };

  useEffect(() => {
    setIsFormComplete(
      firstName !== '' &&
      lastName !== '' &&
      aboutMe !== '' &&
      location !== '' &&
      gender !== '' &&
      website !== '' &&
      school !== '' &&
      workingAt !== '' &&
      companyWebsite !== ''
    );
  }, [firstName, lastName, aboutMe, location, gender, website, school, workingAt, companyWebsite]);

  return (
    <main className="flex flex-col bg-gray-200 min-h-screen p-4 lg:p-8 lg:items-center">
      <h2 className="text-2xl text-gray-700 font-semibold mb-4 lg:mr-[20rem]">Profile Settings</h2>
      <div className="bg-white p-4 rounded-lg shadow-md w-full lg:w-[30rem] mx-auto">
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
        <div className="mt-4">
          <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
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
            <input type="checkbox" checked={isSchoolCompleted} onChange={(e) => setIsSchoolCompleted(e.target.checked)} />
            <label className="ml-2">Completed</label>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Input label="Working at" value={workingAt} onChange={(e) => setWorkingAt(e.target.value)} />
          <Input label="Company Website" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
        </div>
        <Button 
		className={`mt-4 mx-auto rounded px-4 py-2 text-white ${!isFormComplete ? 'bg-none' : ''}`}
		disabled={!isFormComplete}
		onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </main>
  );
}
