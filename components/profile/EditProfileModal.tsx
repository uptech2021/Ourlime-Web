// import React, { useState, useEffect, useCallback } from 'react';
// // import Cropper from 'react-easy-crop';
// import { uploadFile } from '@/helpers/firebaseStorage';
// import { db, auth } from '@/firebaseConfig';
// import { updateDoc, doc, getDoc } from 'firebase/firestore';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { useRouter } from 'next/navigation';
// import { Button, Input } from '@nextui-org/react';
// import { ProfileData, UserData } from '@/types/global';

const EditProfileModal = ({ isOpen, onClose, onSave }) => {
  // const [profilePicture, setProfilePicture] = useState(null);
  // const [banner, setBanner] = useState(null);
  // const [bio, setBio] = useState('');
  // const [isSaving, setIsSaving] = useState(false);
  // const [error, setError] = useState('');
  // const [userId, setUserId] = useState(null);
  // const [originalData, setOriginalData] = useState<ProfileData | null>(null);
  // const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  // const [bannerPreview, setBannerPreview] = useState(null);

  // // State for cropping
  // const [croppingImage, setCroppingImage] = useState(null); // Store image to crop
  // const [crop, setCrop] = useState({ x: 0, y: 0 });
  // const [zoom, setZoom] = useState(1);
  // const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // const router = useRouter();

  // useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       setUserId(user.uid);
  //       setError('');
        
  //       const profileDocRef = doc(db, "profiles", user.uid);
  //       const profileDoc = await getDoc(profileDocRef);
        
  //       if (profileDoc.exists()) {
  //         const data = profileDoc.data();
  //         setOriginalData(data as ProfileData);
  //         setBio(data.aboutMe || '');
  //       } else {
  //         setError('Profile data not found.');
  //       }
  //     } else {
  //       setError('No user is currently logged in.');
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  // const handleProfilePictureChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setCroppingImage(file); // Set image for cropping
  //     setProfilePicturePreview(URL.createObjectURL(file)); // Set preview URL
  //   }
  // };

  // const handleBannerChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setBanner(file);
  //     setBannerPreview(URL.createObjectURL(file));
  //   }
  // };

  // const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
  //   setCroppedAreaPixels(croppedAreaPixels);
  // }, []);

  // const getCroppedImage = useCallback(async () => {
  //   try {
  //     // const croppedImage = await getCroppedImg(profilePicturePreview, croppedAreaPixels); // Get the cropped image
  //     setProfilePicture(croppedImage);
  //     setProfilePicturePreview(URL.createObjectURL(croppedImage));
  //     setCroppingImage(null); // Done with cropping
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, [profilePicturePreview, croppedAreaPixels]);

  // const handleSave = async () => {
  //   if (!userId) {
  //     setError('You must be logged in to save changes.');
  //     return;
  //   }
  
  //   setIsSaving(true);
  
  //   let profilePictureUrl = originalData?.profilePicture || '';
  //   let bannerUrl = originalData?.banner || '';
  
  //   try {
  //     if (profilePicture) {
  //       profilePictureUrl = await uploadFile(profilePicture, `profilePictures/${profilePicture.name}`);
  //     }
  
  //     if (banner) {
  //       bannerUrl = await uploadFile(banner, `banners/${banner.name}`);
  //     }
  
  //     const updatedData = {
  //       profilePicture: profilePictureUrl,
  //       banner: bannerUrl,
  //       aboutMe: bio,
  //     };
  
  //     const hasChanges = originalData 
  //       ? Object.keys(updatedData).some(
  //           key => updatedData[key as keyof ProfileData] !== originalData[key as keyof ProfileData]
  //         )
  //       : true;
  
  //     if (hasChanges) {
  //       const profileDocRef = doc(db, "profiles", userId);
  //       await updateDoc(profileDocRef, updatedData);
  //       onSave(updatedData);
  //     }
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //   } finally {
  //     setIsSaving(false);
  //     onClose();
  //   }
  // };

  if (!isOpen) return null;
  return <div></div>
  // return (
  //   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  //     <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
  //       <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
  //       <button
  //         className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
  //         onClick={onClose}
  //       >
  //         ✕
  //       </button>

  //       {error && <p className="text-red-600 mb-4">{error}</p>}

  //       <div className="mb-4">
  //         <label className="font-semibold">Change Profile Picture</label>
  //         {profilePicturePreview && !croppingImage && (
  //           <img src={profilePicturePreview} alt="Profile Preview" className="mt-2 w-full h-32 object-cover rounded" />
  //         )}
  //         {croppingImage ? (
  //           <div className="relative h-64">
  //             <Cropper
  //               image={profilePicturePreview}
  //               crop={crop}
  //               zoom={zoom}
  //               aspect={1}
  //               onCropChange={setCrop}
  //               onCropComplete={handleCropComplete}
  //               onZoomChange={setZoom}
  //             />
  //             <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded" onClick={getCroppedImage}>
  //               Crop Image
  //             </button>
  //           </div>
  //         ) : (
  //           <Input 
  //             type="file" 
  //             accept="image/*" 
  //             className="mt-2 w-full border p-2 rounded"
  //             onChange={handleProfilePictureChange}
  //           />
  //         )}
  //       </div>

  //       <div className="mb-4">
  //         <label className="font-semibold">Change Banner</label>
  //         {bannerPreview && (
  //           <img src={bannerPreview} alt="Banner Preview" className="mt-2 w-full h-32 object-cover rounded" />
  //         )}
  //         <Input 
  //           type="file" 
  //           accept="image/*" 
  //           className="mt-2 w-full border p-2 rounded"
  //           onChange={handleBannerChange}
  //         />
  //       </div>

  //       <div className="mb-4">
  //         <label className="font-semibold">Bio</label>
  //         <textarea
  //           placeholder="Update your Bio"
  //           className="mt-2 w-full border p-2 rounded"
  //           value={bio}
  //           onChange={(e) => setBio(e.target.value)}
  //         />
  //       </div>

  //       <button
  //         onClick={handleSave}
  //         className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
  //         disabled={isSaving}
  //       >
  //         {isSaving ? 'Saving...' : 'Save Changes'}
  //       </button>
  //     </div>
  //   </div>
  // );
};

export default EditProfileModal;
