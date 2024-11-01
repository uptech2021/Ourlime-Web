import React, { useState, useEffect } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadFile } from '@/helpers/firebaseStorage';
import { db, auth } from '@/firebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Button, Input } from '@nextui-org/react';
import { ProfileData, UserData } from '@/types/global';
import { toast } from 'react-toastify';
import CropModal from './CropModal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ProfileData & { photoURL?: string }>) => void;
  initialData: ProfileData & { photoURL?: string };
  onNavigateToAbout: () => void;
}

const EditProfileModal = ({ isOpen, onClose, onSave, initialData, onNavigateToAbout }: EditProfileModalProps) => {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<Blob | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [bio, setBio] = useState(initialData?.aboutMe || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);

  useEffect(() => {
    setBio(initialData?.aboutMe || '');
  }, [initialData]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImageToCrop(imageURL);
      setShowCropModal(true);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new window.Image();
      img.onload = () => {
        if (img.width > img.height) {
          setBanner(file);
          setBannerPreview(URL.createObjectURL(file));
          setBannerError(null); // Clear any previous error
        } else {
          setBannerError('Please upload a landscape orientation image for the banner.');
          e.target.value = ''; // Reset the file input
        }
      };
      img.onerror = () => {
        setBannerError('Error loading image. Please try another file.');
        e.target.value = ''; // Reset the file input
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleCroppedImage = (croppedImageUrl: string) => {
    setProfilePicturePreview(croppedImageUrl);
    fetch(croppedImageUrl)
      .then(res => res.blob())
      .then(blob => setProfilePicture(blob));
    setShowCropModal(false);
  };

  const handleSave = async () => {
    if (!auth.currentUser) {
      setError('You must be logged in to save changes.');
      return;
    }

    setIsSaving(true);
    setSuccessMessage('');
    setError('');

    let photoURL = initialData?.photoURL || auth.currentUser?.photoURL || '';
    let bannerUrl = initialData?.banner || '';

    try {
      if (profilePicture) {
        const profilePictureFile = new File([profilePicture], 'profile_picture', { type: profilePicture.type });
        photoURL = await uploadFile(profilePictureFile, `images/profilePictures/${auth.currentUser.uid}`);
      }

      if (banner) {
        bannerUrl = await uploadFile(banner, `images/banners/${banner.name}`);
      }

      const updatedData: Partial<ProfileData & UserData> = {
        banner: bannerUrl,
        aboutMe: bio,
        photoURL: photoURL,
        // Add any other fields that you're updating
      };

      console.log("Saving updated data:", updatedData);

      // Call onSave with the updated data
      await onSave(updatedData);

      setSuccessMessage('Changes made successfully!');
      onClose(); // Close the modal after successful save
    } catch (error) {
      console.error("Error updating profile:", error);
      setError('An error occurred while saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNavigateToAbout = () => {
    onClose();
    router.push('?filter=about');
    onNavigateToAbout();
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
          <div className="flex justify-center mt-2">
            {profilePicturePreview ? (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  width={100}
                  height={100}
                  src={profilePicturePreview} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  width={100}
                  height={100}
                  src={initialData.photoURL} 
                  alt="Current Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <Input 
            type="file" 
            accept="image/*" 
            className="mt-4 w-full border p-2 rounded"
            onChange={handleProfilePictureChange}
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">Change Banner (Landscape orientation only)</label>
          {bannerPreview && (
            <Image
              width={100}
              height={100}
              src={bannerPreview} alt="Banner Preview" className="mt-2 w-full h-32 object-cover rounded" />
          )}
          <Input 
            type="file" 
            accept="image/*" 
            className="mt-2 w-full border p-2 rounded"
            onChange={handleBannerChange}
          />
          {bannerError && <p className="text-red-500 mt-1">{bannerError}</p>}
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

        <Button
          className="w-full bg-gray-100 hover:bg-gray-200 mb-4"
          onClick={handleNavigateToAbout}
        >
          Edit Additional Information →
        </Button>

        <button
          onClick={handleSave}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>

        {showCropModal && (
          <CropModal
            imageUrl={imageToCrop}
            onCrop={handleCroppedImage}
            onClose={() => setShowCropModal(false)}
            aspect={1} // Force 1:1 aspect ratio for circular crop
          />
        )}
      </div>
    </div>
  );
};

export default EditProfileModal;
