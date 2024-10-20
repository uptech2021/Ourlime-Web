import React, { useState, useEffect, useCallback } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadFile } from '@/helpers/firebaseStorage';
import { db, auth } from '@/firebaseConfig';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@nextui-org/react';
import ImageCropper from '@/helpers/ImageCropper';
import { ProfileData } from '@/types/global';
import { toast } from 'react-toastify'; // Make sure you have this import if you're using react-toastify for notifications

const EditProfileModal = ({ isOpen, onClose, onSave }) => {
  const [profilePicture, setProfilePicture] = useState<Blob | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const [userId, setUserId] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<ProfileData | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setError('');

        const profileDocRef = doc(db, "profiles", user.uid);
        const profileDoc = await getDoc(profileDocRef);

        if (profileDoc.exists()) {
          const data = profileDoc.data();
          setOriginalData(data as ProfileData);
          setBio(data.aboutMe || '');
        } else {
          setError('Profile data not found.');
        }
      } else {
        setError('No user is currently logged in.');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImageToCrop(imageURL);
      setIsCropping(true); // Show cropping modal
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      img.onload = () => {
        if (img.width > img.height) {
          setBanner(file);
          setBannerPreview(URL.createObjectURL(file));
        } else {
          toast.error('Please upload a landscape orientation image for the banner.');
          e.target.value = ''; // Reset the file input
        }
      };
      img.onerror = () => {
        toast.error('Error loading image. Please try another file.');
        e.target.value = ''; // Reset the file input
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleCroppedImage = (dataUrl: string) => {
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        setProfilePicture(blob);
        setProfilePicturePreview(dataUrl);
      });
    setIsCropping(false);
    setImageToCrop(null);
  };

  const handleSave = async () => {
    if (!userId) {
      setError('You must be logged in to save changes.');
      return;
    }

    setIsSaving(true);
    setSuccessMessage(''); // Clear any previous success message
    setError(''); // Clear any previous error message

    let profilePictureUrl = originalData?.profilePicture || '';
    let bannerUrl = originalData?.banner || '';

    try {
      if (profilePicture) {
        const profilePictureFile = new File([profilePicture], 'profile_picture', { type: profilePicture.type });
        profilePictureUrl = await uploadFile(profilePictureFile, `images/profilePictures/${userId}`);
      }

      if (banner) {
        bannerUrl = await uploadFile(banner, `images/banners/${banner.name}`);
      }

      const updatedData = {
        profilePicture: profilePictureUrl,
        banner: bannerUrl,
        aboutMe: bio,
      };

      const hasChanges = originalData 
        ? Object.keys(updatedData).some(
            key => updatedData[key as keyof ProfileData] !== originalData[key as keyof ProfileData]
          )
        : true;

      if (hasChanges) {
        const profileDocRef = doc(db, "profiles", userId);
        await updateDoc(profileDocRef, updatedData);
        onSave(updatedData);
        setSuccessMessage('Changes made successfully!'); // Set success message
      }
    } catch (error) {
      // console.error("Error updating profile:", error);
      setError('An error occurred while saving changes.'); // Set error message
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>} {/* Display success message */}

        <div className="mb-4">
          <label className="font-semibold">Change Profile Picture</label>
          {profilePicturePreview && !isCropping && (
            <img src={profilePicturePreview} alt="Profile Preview" className="mt-2 w-full h-32 object-cover rounded-full" />
          )}
          {isCropping ? (
            <ImageCropper
              closeModal={() => setIsCropping(false)}
              updateAvatar={handleCroppedImage}
            />
          ) : (
            <Input 
              type="file" 
              accept="image/*" 
              className="mt-2 w-full border p-2 rounded"
              onChange={handleProfilePictureChange}
            />
          )}
        </div>

        <div className="mb-4">
          <label className="font-semibold">Change Banner (Landscape orientation only)</label>
          {bannerPreview && (
            <img src={bannerPreview} alt="Banner Preview" className="mt-2 w-full h-32 object-cover rounded" />
          )}
          <Input 
            type="file" 
            accept="image/*" 
            className="mt-2 w-full border p-2 rounded"
            onChange={handleBannerChange}
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">Bio</label>
          <textarea
            placeholder="Update your Bio"
            className="mt-2 w-full border p-2 rounded"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditProfileModal;
