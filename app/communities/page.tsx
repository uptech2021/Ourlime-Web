'use client'
import React, { useEffect, useState } from 'react';
import { Button, Image } from '@nextui-org/react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Communities } from '@/types/global';
import CreateCommunities from '@/components/communities/CreateCommunities';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Communities[]>([]);
  const [toggleCommunityForm, setToggleCommunityForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the communities from Firestore
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'communities'));
        const fetchedCommunities = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Communities[];
        setCommunities(fetchedCommunities);
      } catch (error) {
        toast.error('Error fetching communities');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  // Toggle the form to create a new community
  const handleOpenForm = () => {
    setToggleCommunityForm(true);
  };

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Communities</h1>
          <Button onClick={handleOpenForm} className="bg-buttonGradientTheme">
            Create Community
          </Button>
        </div>

        {/* Display list of communities */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {communities.length > 0 ? (
              communities.map((community) => (
                <div
                  key={community.id}
                  className="flex flex-col items-center border rounded-lg p-4 shadow-md"
                >
                  <Image
                    src={community.communityImage as string}
                    alt={community.name}
                    width={150}
                    height={150}
                    className="rounded-full mb-4"
                  />
                  <h2 className="text-lg font-semibold">{community.name}</h2>
                  <p className="text-sm">{community.category}</p>
                  <p className="text-sm">{community.memberCount} members</p>
                  <Button size="sm" className="mt-4">
                    View Community
                  </Button>
                </div>
              ))
            ) : (
              <p>No communities found.</p>
            )}
          </div>
        )}

        {/* Create Community Form */}
        {toggleCommunityForm && (
          <CreateCommunities
            setToggleCommunityForm={setToggleCommunityForm}
            setCommunities={setCommunities}
          />
        )}
      </div>
    </>
  );
}
