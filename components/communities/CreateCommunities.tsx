import {
  Earth,
  ImageIcon,
  Lock,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import React, { SetStateAction, useRef, useState } from 'react';
import { uploadFile } from '@/helpers/firebaseStorage';
import { db } from '@/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { Communities } from '@/types/global';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Image } from '@nextui-org/react';
import { getAuth } from 'firebase/auth';
import 'react-toastify/dist/ReactToastify.css';
import styles from './createcommunities.module.css';

export default function CreateCommunities({
  setToggleCommunityForm,
  setCommunities,
}: {
  setToggleCommunityForm: React.Dispatch<SetStateAction<boolean>>;
  setCommunities: React.Dispatch<SetStateAction<Communities[]>>;
}) {
  const [communityName, setCommunityName] = useState<string>('');
  const [communityImage, setCommunityImage] = useState<File | null>(null);
  const [category, setCategory] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const closeForm = () => {
    setToggleCommunityForm((prev: boolean) => !prev);
  };

  const handleCreateCommunity = async () => {
    if (!communityName || !category || !communityImage) {
      toast.error('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        toast.error('You need to be logged in to create a community.');
        setLoading(false);
        return;
      }

      // Upload community image using the helper function
      const imageUrl = await uploadFile(communityImage, `images/communities/thumbnails/${communityImage.name}`);

      // Create new community object
      const newCommunity: Omit<Communities, 'id'> = {
        name: communityName,
        communityImage: imageUrl,
        memberCount: 1, // Creator is the first member
        members: [currentUser.uid], // Add creator to the members array
        category: category,
        isPublic: isPublic,
        posts: [],
      };

      // Save the new community to Firestore
      const docRef = await addDoc(collection(db, 'communities'), newCommunity);

      // Add the new community to the local state
      setCommunities((prev) => [...prev, { ...newCommunity, id: docRef.id }]);

      toast.success('Community created successfully!');
      setToggleCommunityForm(false);
    } catch (error) {
      toast.error('Error creating community. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCommunityImage(e.target.files[0]);
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateCommunity();
        }}
        className="fixed top-0 z-40 flex h-full w-full flex-col bg-white sm:left-1/2 sm:top-1/2 sm:mx-auto sm:h-auto sm:w-[70%] sm:-translate-x-1/2 sm:-translate-y-1/2 lg:w-[50%]"
      >
        {/* Form Header */}
        <div className="flex items-center justify-between border-b-2 p-5">
          <X onClick={closeForm} className="cursor-pointer" />
          <Button type="submit" className="bg-buttonGradientTheme" disabled={loading}>
            {loading ? 'Creating...' : 'Create Community'}
          </Button>
        </div>

        {/* Community Name */}
        <div className="p-5">
          <input
            type="text"
            placeholder="Community Name"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Community Image */}
        <div className="p-5">
          <label className="block text-sm font-medium text-gray-700">Community Image</label>
          <div className="flex items-center">
            <label className={styles.iconWrapper}>
              <ImageIcon className={styles.icon} />
              <p className={styles.iconType}>Upload Image</p>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          {communityImage && (
            <div className="mt-4">
              <Image
                src={URL.createObjectURL(communityImage)}
                alt="Selected Community Image"
                width={150}
                height={150}
                className="rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Category */}
        <div className="p-5">
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </form>
    </>
  );
}
