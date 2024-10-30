'use client';
import React, { useEffect, useState } from 'react';
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { ResizeListener } from '@/helpers/Resize';
import { useRouter } from 'next/navigation';
import { fetchProfile, fetchUser, loginRedirect } from '@/helpers/Auth';
import { ProfileData, UserData } from '@/types/global';

export default function Payments() {
  const [textModel, setTextModel] = useState('Paypal');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const router = useRouter();
  const [, setIsPc] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePayments = async () => {
      try {
        const currentUser = await loginRedirect(router, true);
        if (currentUser) {
          const profileSnap = await fetchProfile(currentUser.uid);
          const userSnap = await fetchUser(currentUser.uid);
          setProfile(profileSnap.data() as ProfileData);
          setUser(userSnap.data() as UserData);
        }
      } catch (error) {
        console.error('Error initializing payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePayments();
    const cleanup = ResizeListener(setIsPc);
    return () => cleanup();
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile || !user) {
    return <></>;
  }

  return (
    <>
      <main className="flex flex-col bg-gray-200 min-h-screen">
        <h1 className="text-xl mb-4 mt-5 text-gray-800 text-left font-bold ml-10" >My Earnings $0.00</h1>
        <div className='bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] h-[50%] mb-10'>
          <p className="ssl-warning mb-4 rounded bg-orange-100 p-1 text-sm font-semibold text-orange-500">
            Available funds to withdrawal: $0, minimum withdrawal request is $50
          </p>
          <p className="ssl-warning mb-4 rounded bg-orange-100 p-1 text-sm font-semibold text-orange-500">
            Please note that you are to withdrawal only your Earnings, wallet top ups are not withdrawalable.
          </p>
          <form className='mb-5 flex flex-col gap-3'>
            <Select
              label="Withdrawal Method"
              value={textModel}
              onChange={(e) => setTextModel(e.target.value)}
              className="selectTag"
              defaultSelectedKeys={["Paypal"]}
            >
              <SelectItem key="Paypal" value="Paypal">
                Paypal
              </SelectItem>
              <SelectItem key="Bank Transfer" value="Bank Transfer">
                Bank Transfer
              </SelectItem>
            </Select>
            <Input type="email" label="Email" placeholder="youremail@gmail.com" onChange={(e) => setEmail(e.target.value)} />
            <Input type="text"
              label="Amount"
              placeholder="0"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onChange={(event) => {
                const value = event.target.value.replace(/[^0-9]/g, '');
                setAmount(value);
                event.target.value = value;
              }} />
          </form>

          <Button
            isDisabled={!email || !amount}
            type='submit'
            className={`mx-[20%] md:mx-[40%] lg:mx-[43%] text-center ${!amount || !email ? 'bg-none' : ''}`}
          >Request Withdrawal</Button>

        </div>
        <div className='bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] h-[50%] '>
          <p>Payment History</p>
          <hr />

          <button className="w-12 h-12 rounded-full bg-blue-200 mt-16 lg:mt-6 mx-[40%] md:mx-[50%]" />
          <p className="mt-2 text-gray-800 text-sm text-center">Looks like you don&apos;t have any transactions yet</p>

        </div>
      </main>
    </>
  )
}
