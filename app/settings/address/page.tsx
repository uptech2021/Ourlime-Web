'use client'
import SettingsSidebar from '@/components/settings/nav/page';
import { Button, Input } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { auth } from '@/firebaseConfig';
import { ResizeListener } from '@/helpers/Resize';
import { useRouter } from 'next/navigation';
import { loginRedirect } from '@/helpers/Auth';

type Address = {
  name: string,
  phone: string,
  city: string,
  country: string,
  zip: string,
  address: string
}

export default function Address() {
  const router = useRouter();
  const [, setIsPc] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [addressToDeleteIndex, setAddressToDeleteIndex] = useState<number | null>(null);
  const [showAddress, setShowAddress] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');
  const [address, setAddress] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [, setIsEdited] = useState(false);
  const [showDeleteSuccessMessage, setShowDeleteSuccessMessage] = useState(false);
  const [isOverlayActive, setIsOverlayActive] = useState(false);

  const areAllFieldsFilled = () => {
    return name !== '' && phone !== '' && city !== '' && country !== '' && zip !== '' && address !== '';
  };

  const resetFormFields = () => {
    setName('');
    setPhone('');
    setCity('');
    setCountry('');
    setZip('');
    setAddress('');
  };
  
  const handleAddNewAddress = () => {
    resetFormFields();
    setEditIndex(null);
    setShowAddress(true);
    setIsOverlayActive(true);
  };
  
  const checkIfEdited = () => {
    if (editIndex !== null) {
      const currentAddress = addresses[editIndex];
      return name !== currentAddress.name ||
        phone !== currentAddress.phone ||
        city !== currentAddress.city ||
        country !== currentAddress.country ||
        zip !== currentAddress.zip;
    }
    return name !== '' || phone !== '' || city !== '' || country !== '' || zip !== '' || address !== '';
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    const addressToEdit = addresses[index];

    setName(addressToEdit.name);
    setPhone(addressToEdit.phone);
    setCity(addressToEdit.city);
    setCountry(addressToEdit.country);
    setZip(addressToEdit.zip);

    setShowAddress(true);
    setIsOverlayActive(true);
  };

  const handleDelete = async (index: number) => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const currentAddresses = docSnap.data().address || [];
        currentAddresses.splice(index, 1);

        await updateDoc(userRef, { address: currentAddresses });

        setAddresses(currentAddresses);
        setShowDeleteSuccessMessage(true);
        setTimeout(() => setShowDeleteSuccessMessage(false), 3000);
      }
    }
  };

  const confirmDelete = (index: number) => {
    setAddressToDeleteIndex(index);
    setShowDeleteConfirmation(true);
  };

  const handleSave = async () => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'profiles', user.uid);

      try {
        const newAddress: Address = { name, phone, city, country, zip, address };

        if (editIndex !== null) {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const addresses = docSnap.data().address || [];
            addresses[editIndex] = newAddress;
            await updateDoc(userRef, { address: addresses });
            setAddresses(addresses);
          }
        } else {
          await updateDoc(userRef, {
            address: arrayUnion(newAddress)
          });
          setAddresses([...addresses, newAddress]);
        }

        setShowAddress(false);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);

        resetFormFields();
        setEditIndex(null);
        setIsOverlayActive(false);

      } catch (error) {
        console.error("Error updating document: ", error);
      }
    } else {
      console.log("User not logged in");
    }
  };

  const handleCloseForm = () => {
    resetFormFields();
    setEditIndex(null);
    setShowAddress(false);
    setIsOverlayActive(false);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, 'profiles', user.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const fetchedAddresses = docSnap.data().address || [];
            setAddresses(fetchedAddresses);
          }
        } catch (error) {
          console.error("Error fetching addresses: ", error);
        }
      }
    };

    fetchAddresses();
  }, [showSuccessMessage]);

  useEffect(() => {
    loginRedirect(router)
      .then(() => {
        const cleanup = ResizeListener(setIsPc);
        return () => cleanup();
      })
      .catch((error) => {
        console.error('Error during login redirect:', error);
      });
  }, [router]);

  if (!auth.currentUser) return <div>Loading...</div>;

  else return (
    <>
      <div className='flex flex-row bg-gray-200 min-h-screen'>
        <SettingsSidebar />
        <main className="flex flex-col text-center bg-gray-200 mx-auto">
          <div className='bg-white p-4 rounded-lg shadow-md mx-auto w-[90%] md:w-[40rem] mt-8'>
            <h1 className="text-4xl mb-8 text-gray-800 font-bold text-left">My Addresses</h1>
            {showSuccessMessage && (
              <div className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
                Your address has been added successfully.
              </div>
            )}
            {showDeleteSuccessMessage && (
              <div className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
                Address deleted successfully.
              </div>
            )}
            {addresses.map((addr, index) => (
              <section key={index} className="bg-white border border-gray-300 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{addr.name}</p>
                    <p>{addr.phone}</p>
                    <p>{addr.city}, {addr.country}, {addr.zip}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="w-8 h-8 rounded-full bg-green-500 text-white" onClick={() => handleEdit(index)}>
                      Edit
                    </button>
                    <button className="w-8 h-8 rounded-full bg-red-500 text-white" onClick={() => confirmDelete(index)}>
                      Del
                    </button>
                  </div>
                </div>
              </section>
            ))}
            {showAddress && (
              <div className="z-40 absolute top-[18rem] w-60 lg:w-[40rem] mr-20 rounded border border-gray-300 bg-white p-4 shadow-md">
                <div className="mb-4">
                  <Input type='text'
                    label="Name"
                    placeholder='Admin'
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setIsEdited(checkIfEdited());
                    }}
                    className='mb-4' />
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Input
                      type="text"
                      label="Phone"
                      placeholder="1868#######"
                      value={phone}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onChange={(event) => {
                        const value = event.target.value.replace(/[^0-9]/g, '');
                        setPhone(value);
                        event.target.value = value;
                        setIsEdited(checkIfEdited());
                      }} />
                    <Input type="text"
                      label="Country"
                      placeholder="Trinidad & Tobago"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setIsEdited(checkIfEdited());
                      }}
                      className='mb-4' />
                  </div>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Input type="text"
                      label="City"
                      placeholder="Diego Martin"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setIsEdited(checkIfEdited());
                      }} />
                    <Input type="text"
                      label="Zip Code"
                      placeholder="00000"
                      value={zip}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onChange={(event) => {
                        const value = event.target.value.replace(/[^0-9]/g, '');
                        setZip(value);
                        event.target.value = value;
                        setIsEdited(checkIfEdited());
                      }}
                      className='mb-4' />
                  </div>
                  <Input size='lg'
                    type='text'
                    label="Address"
                    placeholder="1234 Main St"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setIsEdited(checkIfEdited());
                    }} />
                </div>

                <div className="flex justify-between mt-4">
                  <Button
                    color="success"
                    className={`mr-4 ${!areAllFieldsFilled() ? 'bg-gray-300 cursor-not-allowed' : ''}`}
                    onClick={handleSave}
                    disabled={!areAllFieldsFilled()}
                  >
                    {editIndex !== null ? 'Save' : 'Add'}
                  </Button>

                  <Button color="danger" className="ml-4" onClick={handleCloseForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {isOverlayActive && <div className="fixed inset-0 bg-gray-500 opacity-50 z-30" />}
            <Button color="success" className="mt-4" onClick={handleAddNewAddress}>
              Add New Address
            </Button>
          </div>
          {showDeleteConfirmation && (
            <div className="fixed inset-0 flex items-center justify-center z-20">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs text-center z-40">
                <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this address?</h3>
                <div className="flex justify-between">
                  <Button color="success" onClick={() => {
                    if (addressToDeleteIndex !== null) {
                      handleDelete(addressToDeleteIndex);
                      setShowDeleteConfirmation(false);
                    }
                  }}>Yes</Button>
                  <Button color="danger" onClick={() => setShowDeleteConfirmation(false)}>No</Button>
                </div>
              </div>
              <div className="fixed inset-0 bg-gray-500 opacity-50 z-30"></div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}