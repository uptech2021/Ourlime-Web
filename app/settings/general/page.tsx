'use client'
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import React, { useState } from 'react';

export default function General() {
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [country, setCountry] = useState('');
  const [memberType, setMemberType] = useState('');
  const [wallet, setWallet] = useState('');
  const [verified, setVerified] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const handleSave = () => {

    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };
  const validateEmail = (email: string) => email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  const isInvalid = React.useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);



  return (
    <>
      <main className="flex flex-col  text-center bg-gray-200 min-h-screen">
        <h2 className="text-2xl text-gray-700 font-semibold mb-4 text-left ml-[1rem] pt-8">General Settings</h2>
        <div className="text-gray-600 bg-white p-4 rounded-lg shadow-md mx-auto w-[90%]">
          {showSuccessMessage && (
            <div className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
              Settings saved successfully!
            </div>
          )}
          <Input
            label="Username"
            placeholder='Admin'
            radius="sm"
            type="text"
            className='mb-6'
            onChange={(e) => setUsername(e.target.value)}
            description="Username is available"
          />
          <Input
            label="Email"
            placeholder='your@gmaill.com'
            radius="sm"
            type="text"
            className='mb-6'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            isInvalid={isInvalid}
            color={isInvalid ? "danger" : "success"}
            errorMessage="Please enter a valid email"

          />
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-6">
            <Input
              label="Birthday"
              radius="sm"
              type="date"
              onChange={(e) => setBirthday(e.target.value)}
            />
            <Input
              label="Phone"
              placeholder="1868#######"
              radius="sm"
              type="text"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onChange={(event) => {
                const value = event.target.value.replace(/[^0-9]/g, '');
                setPhone(value);
                event.target.value = value;
              }}
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-6">
            <Select
              label="Select Gender"
              onChange={(e) => setGender(e.target.value)}
              className="selectTag"
            >
              <SelectItem key="Male" value="Male">Male</SelectItem>
              <SelectItem key="Female" value="Female">Female</SelectItem>
              <SelectItem key="Rather Not Say" value="Rather Not Say">Rather Not Say</SelectItem>
            </Select>
            <Select
              label="Country"
              placeholder='Select Country'
              onChange={(e) => setCountry(e.target.value)}
              className="selectTag"
            >
              <SelectItem key="Trinidad" value="Trinidad">Trinidad</SelectItem>
              <SelectItem key="Tobago" value="Tobago">Tobago</SelectItem>
            </Select>
          </div>
          <div className='mx-auto text-left mb-6'>
            <p className='text-gray-600 text-left ml-7 mb-2'>Verification</p>
            <div className="ml-7">
              <label className="flex items-center mr-4">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                />
                <span>verified</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={!verified}
                  onChange={(e) => setVerified(!e.target.checked)}
                />
                <span>not verified</span>
              </label>
            </div>
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-6">
            <Select
              label="Member Type"
              placeholder='Select Member Type'
              onChange={(e) => setMemberType(e.target.value)}
              className="selectTag"
            >
              <SelectItem key="Free Member" value="Free Member">Free Member</SelectItem>
              <SelectItem key="Star" value="Star">Star</SelectItem>
              <SelectItem key="Hot" value="Hot">Hot</SelectItem>
              <SelectItem key="Ultima" value="Ultima">Ultima</SelectItem>
              <SelectItem key="VIP" value="VIP">VIP</SelectItem>
            </Select>
            <Input
              label="Wallet"
              placeholder="0"
              radius="sm"
              type="text"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onChange={(event) => {
                const value = event.target.value.replace(/[^0-9]/g, '');
                setWallet(value);
                event.target.value = value;
              }}
            />
          </div>
          <Button

            disabled={!gender || !phone || !username || !email || !birthday || !country || !memberType || !wallet}
            type='submit'
            className={` ${!gender || !phone || !username || !email || !birthday || !country || !memberType || !wallet ? 'bg-none' : ''}`}
            onClick={handleSave}
          >
            Save
          </Button>

        </div>
      </main>
    </>
  )
}
