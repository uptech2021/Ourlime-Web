'use client'
import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react';

type Address = {
  name: string,
  phone: string,
  city: string,
  country: string,
  zip: string


}

export default function Address() {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [addressToDeleteIndex, setAddressToDeleteIndex] = useState<number | null>(null);

  const [showAddress, setShowAddress] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const handleAddressBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');
  const [address, setAddress] = useState('');
  //TODO review your success message logic, you havent used the setShowSuccessMessage function therefore, how would it display on the page? it caused a build error by not utilizing
  // const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // const handleShowSuccessMessage = () => {
  //   const newAddress: Address = {
  //     name,
  //     phone,
  //     city,
  //     country,
  //     zip,

  //   };
  //   setAddresses([...addresses, newAddress]);
  //   setShowSuccessMessage(true);
  //   setTimeout(() => {
  //     setShowSuccessMessage(false);
  //   }, 3000);

  //   // Clear all form fields
  //   setName('');
  //   setPhone('');
  //   setCity('');
  //   setCountry('');
  //   setZip('');
  //   setAddress('');
  // };

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleEdit = (index: number) => {
    setEditIndex(index);
    const addressToEdit = addresses[index];
    setName(addressToEdit.name);
    setPhone(addressToEdit.phone);
    setCity(addressToEdit.city);
    setCountry(addressToEdit.country);
    setZip(addressToEdit.zip);
    setShowAddress(true);
  };

  const handleDelete = (index: number) => {
    setAddressToDeleteIndex(index);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (addressToDeleteIndex !== null) {
      const newAddresses = addresses.filter((_, i) => i !== addressToDeleteIndex);
      setAddresses(newAddresses);
      setShowDeleteConfirmation(false);
      setAddressToDeleteIndex(null);
    }
  };


  const handleSave = () => {
    const newAddress: Address = { name, phone, city, country, zip };
    if (editIndex !== null) {
      const newAddresses = [...addresses];
      newAddresses[editIndex] = newAddress;
      setAddresses(newAddresses);
      setEditIndex(null);
    } else {
      setAddresses([...addresses, newAddress]);
    }
    setShowAddress(false);
    setName('');
    setPhone('');
    setCity('');
    setCountry('');
    setZip('');
    setAddress('');
  };





  return (
    <>
      <main className="flex flex-col  text-center bg-gray-200 min-h-screen">
        <h1 className="text-4xl mb-8 mt-10 mx-auto text-gray-800 font-bold text-left" >My Addresses</h1>

        <div className='bg-white p-4 rounded-lg shadow-md mx-auto w-[70%] h-[10rem] flex flex-row gap-4'>
          <section className="bg-gray-200 p-4 rounded-lg  mx-auto lg:mx-0 w-full lg:w-[45%] h-[8rem]"
            onClick={() => setShowAddress(!showAddress)}>
            <div
              className={`Address-box z-1000 absolute top-[18rem] w-60 lg:w-[40rem] mr-20 rounded border border-gray-300 bg-white p-4 shadow-md ${showAddress ? 'block' : 'hidden'}`} onClick={handleAddressBoxClick}
            >
              {/* {showSuccessMessage && (
                <p className="success mb-4 rounded bg-green-100 p-1 text-sm font-semibold text-green-500">
                  Your address has been added successfully.
                </p>
              )} */}

              <div className="mb-4 address">

                <Input type='text'
                  label="Name"
                  placeholder='Admin' onChange={(e) => setName(e.target.value)}
                  className='mb-4' />

                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">

                  <Input
                    type="text"
                    label="Phone"
                    placeholder="1868#######"
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={(event) => {
                      const value = event.target.value.replace(/[^0-9]/g, '');
                      setPhone(value);
                      event.target.value = value;
                    }} />

                  <Input type="text"
                    label="Country"
                    placeholder="Trinidad & Tobago" onChange={(e) => setCountry(e.target.value)}
                    className='mb-4' />

                </div>

                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">

                  <Input type="text"
                    label="City"
                    placeholder="Diego Martin" onChange={(e) => setCity(e.target.value)} />


                  <Input type="text"
                    label="Zip Code"
                    placeholder="00000"
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={(event) => {
                      const value = event.target.value.replace(/[^0-9]/g, '');
                      setZip(value);
                      event.target.value = value;
                    }}
                    className='mb-4' />

                </div>
                <Input size='lg'
                  type='text'
                  label="Address"
                  placeholder="1234 Main St" onChange={(e) => setAddress(e.target.value)} />

              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-4 justify-end">
                <Button
                  className='bg-none'
                  onClick={() => setShowAddress(!showAddress)}
                >Cancel</Button>

                <Button
                  isDisabled={!name || !phone || !city || !country || !zip || !address}
                  type='submit'
                  className={` ${!name || !phone || !city || !country || !zip || !address ? 'bg-none' : ''}`}
                  onClick={handleSave}
                >
                  {editIndex !== null ? 'Save' : 'Add'}
                </Button>

              </div>
            </div>
            <button className="w-12 h-12 rounded-full bg-blue-200 mt-2 " />
            <p className="mt-4 text-gray-800 text-ml">Add New</p>
          </section>

          <section className="bg-none border border-solid border-gray-300 p-4 rounded-lg mx-auto lg:mx-0 w-full lg:w-[45%] h-[8rem] ">
            {addresses.map((addr, index) => (
              <div key={index} className="mb-2 flex justify-between items-center">
                <div>
                  <p>{addr.name}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.city}, {addr.country}, {addr.zip}</p>
                </div>
                <div className="flex flex-col">
                  <button className="w-6 h-6 rounded-full mb-2" onClick={() => handleEdit(index)}>Edit</button>
                  <button className="w-6 h-6 rounded-full" onClick={() => handleDelete(index)}>Bin</button>
                  {showDeleteConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white p-4 rounded-lg">
                        <p>Are you sure you want to delete this address?</p>
                        <div className="mt-4 flex justify-end">
                          <Button onClick={() => setShowDeleteConfirmation(false)} className="mr-2">Cancel</Button>
                          <Button onClick={confirmDelete}>Delete</Button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
            {addresses.length === 0 && <p className="mt-4 text-gray-800 text-ml">No addresses added yet</p>}
          </section>



        </div>



      </main>
    </>
  );
}
