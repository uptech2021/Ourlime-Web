'use client'
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { auth, db } from '@/config/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { ResizeListener } from '@/helpers/Resize'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation'
import { fetchProfile, fetchUser, loginRedirect } from '@/helpers/Auth'
import SettingsSidebar from '@/components/settings/nav/page';
import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { ProfileData, UserData } from '@/types/global';
import AnimatedLogo from '@/components/AnimatedLoader';

export default function General() {
  const router = useRouter()
  const [, setIsPc] = useState<boolean>(false)
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState<string | undefined>('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [country, setCountry] = useState('');
  const [memberType, setMemberType] = useState('');
  const [balance, setbalance] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [usernameStatus, setUsernameStatus] = useState('');

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        const currentUser = await loginRedirect(router, true);
        if (currentUser) {
          const profileSnap = await fetchProfile(currentUser.uid);
          const userSnap = await fetchUser(currentUser.uid);
          setProfile(profileSnap.data() as ProfileData);
          setUser(userSnap.data() as UserData);

          // Set state variables with fetched data
          setUsername(userSnap.data()?.userName || '');
          setEmail(userSnap.data()?.email || '');
          setGender(userSnap.data()?.gender || '');
          setPhone(profileSnap.data()?.phone || '');
          setBirthday(profileSnap.data()?.birthday || '');
          setCountry(profileSnap.data()?.country || '');
          setMemberType(profileSnap.data()?.memberType || '');
          setbalance(profileSnap.data()?.balance || '');
        }
      } catch (error) {
        console.error('Error initializing settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSettings();
    const cleanup = ResizeListener(setIsPc);
    return () => cleanup();
  }, [router]);

  const checkUsername = async (username: string) => {
    if (username.trim() === '') {
      setUsernameStatus('');
      return;
    }
    const q = query(collection(db, "users"), where("userName", "==", username));
    const querySnapshot = await getDocs(q);
    setUsernameStatus(querySnapshot.empty ? "Username is available" : "Username is already taken");
  };

  const validateEmail = (email: string) => email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const handleSave = async () => {
    setIsSubmitted(true);
    if (email && !validateEmail(email)) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
      setIsLoading(true);
      const user = auth.currentUser;
      if (user) {
        try {
          const userData: { [key: string]: any } = {};
          const profileData: { [key: string]: any } = {};

          if (username) userData.userName = username;
          if (email) userData.email = email;
          if (gender) userData.gender = gender;

          if (phone) profileData.phone = phone;
          if (birthday) profileData.birthday = birthday;
          if (country) profileData.country = country;
          if (memberType) profileData.memberType = memberType;
          if (balance) profileData.balance = balance;


          if (Object.keys(userData).length > 0) {
            await setDoc(doc(db, "users", user.uid), userData, { merge: true });
          }

          if (Object.keys(profileData).length > 0) {
            await setDoc(doc(db, "profiles", user.uid), profileData, { merge: true });
          }

          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 3000);
        } catch (error) {
          console.error("Error saving user data: ", error);
        } finally {
          setIsLoading(false); // Set loading back to false when the process is complete
        }
      }
    }
  };

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

        <main className="flex flex-col  text-center  mx-auto">

          <div className="text-gray-600 bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] md:w-[40rem] mt-8">
            <h2 className="text-2xl text-gray-700 font-semibold mb-4 text-left ml-[1rem] ">General Settings</h2>
            {showSuccessMessage && (
              <div className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
                Settings saved successfully!
              </div>
            )}
            <Input
              label="Username"
              placeholder={username || 'Admin'}
              radius="sm"
              type="text"
              className='mb-6'
              onChange={(e) => {
                setUsername(e.target.value);
                checkUsername(e.target.value);
              }}
              description={usernameStatus}
              color={usernameStatus === "Username is available" ? "success" : usernameStatus === "Username is already taken" ? "danger" : "default"}
            />
            <Input
              label="Email"
              placeholder={email || 'example@gmail.com'}
              radius="sm"
              type="text"
              className="mb-6"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              isInvalid={isSubmitted && isInvalid}
              color={isSubmitted && isInvalid ? "danger" : "default"}
              errorMessage="Please enter a valid email"
            />

            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-6">
              <Input
                label="Birthday"
                value={birthday}
                radius="sm"
                type="date"
                onChange={(e) => setBirthday(e.target.value)}
                className="md:w-[48%]"
              />
              <div className="">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="TT"
                  value={phone}
                  onChange={setPhone}
                  className="phoneS w-[90%] md:w-[115%] h-[3.5rem] rounded-lg bg-gray-100 px-8 py-4 text-sm focus:outline-none focus:border-none"
                />

              </div>



            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-6">
              <Select
                label="Gender"
                placeholder='Select Gender'
                selectedKeys={gender ? [gender] : []}
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
                selectedKeys={country ? [country] : []}
                onChange={(e) => setCountry(e.target.value)}
                className="selectTag"
              >
                <SelectItem key="Trinidad" value="Trinidad">Trinidad</SelectItem>
                <SelectItem key="Tobago" value="Tobago">Tobago</SelectItem>
              </Select>
            </div>

            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-6">
              <Select
                label="Member Type"
                placeholder='Select Member Type'
                selectedKeys={memberType ? [memberType] : []}
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
                label="wallet"
                placeholder="0"
                value={balance}
                radius="sm"
                type="text"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                onChange={(event) => {
                  const value = event.target.value.replace(/[^0-9]/g, '');
                  setbalance(value);
                  event.target.value = value;
                }}
              />
            </div>
            <Button
              disabled={(!gender && !phone && !username && !email && !birthday && !country && !memberType && !balance) || isLoading}
              type="submit"
              className={`submit ${(gender || phone || username || email || birthday || country || memberType || balance) && !isLoading ? 'bg-green-500' : ''}`}
              onClick={handleSave}
            >
              {isLoading ? 'Loading...' : 'Save'}
            </Button>



          </div>
        </main>
      </div>
    </>
  )
}
