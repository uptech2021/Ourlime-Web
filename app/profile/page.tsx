// 'use client';

// import { useEffect, useState } from 'react';
// import ProfileSidebar from '@/components/profile/ProfileSidebar';
// import { Camera, CircleUser, ImageIcon, Info, Users, Video } from 'lucide-react';
// import Image from 'next/image';
// import { UserData, ProfileImage } from '@/types/userTypes';
// import ChangeProfileImageModal from '@/components/profile/ChangeProfileImageModal';
// import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
// import { auth, db, storage } from '@/lib/firebaseConfig';
// import { onAuthStateChanged } from 'firebase/auth';
// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// import { useProfileStore } from 'src/store/useProfileStore';

// export default function ProfilePage() {
//   const [activeTab, setActiveTab] = useState('general');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const { profileImage } = useProfileStore();
//   const [isChangeImageModalOpen, setIsChangeImageModalOpen] = useState(false);
//   const [userImages, setUserImages] = useState<ProfileImage[]>([]);

//   const handleImageSelect = (image) => {
//     // Handle image selection logic
//   };

//   // In your profile page where handleImageUpload is defined
//   const handleImageUpload = async (file: File) => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}_${file.name}`);

//     const uploadTask = await uploadBytes(storageRef, file);
//     const imageURL = await getDownloadURL(uploadTask.ref);

//     const profileImageRef = await addDoc(collection(db, 'profileImages'), {
//       userId: user.uid,
//       imageURL: imageURL,
//       uploadedAt: serverTimestamp()
//     });

//     const profileSetAsQuery = query(
//       collection(db, 'profileImageSetAs'),
//       where('userId', '==', user.uid),
//       where('setAs', '==', 'profile')
//     );
//     const setAsSnapshot = await getDocs(profileSetAsQuery);

//     if (!setAsSnapshot.empty) {
//       const setAsDoc = setAsSnapshot.docs[0];
//       await updateDoc(doc(db, 'profileImageSetAs', setAsDoc.id), {
//         profileImageId: profileImageRef.id
//       });
//     }

//     // Update the global store
//     useProfileStore.getState().setProfileImage({
//       id: profileImageRef.id,
//       imageURL,
//       userId: user.uid,
//       typeOfImage: 'profile',
//       createdAt: new Date(),
//       updatedAt: new Date()
//     });
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         console.log('Current user:', user);

//         const profileImagesQuery = query(
//           collection(db, 'profileImages'),
//           where('userId', '==', user.uid)
//         );
//         console.log('Query created for user:', user.uid);

//         const profileImagesSnapshot = await getDocs(profileImagesQuery);
//         console.log('Query snapshot:', profileImagesSnapshot.docs);

//         const images = profileImagesSnapshot.docs.map(doc => {
//           console.log('Document data:', doc.data());
//           return {
//             id: doc.id,
//             ...doc.data()
//           };
//         }) as ProfileImage[];

//         console.log('Processed images:', images);
//         setUserImages(images);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <div className="min-h-screen w-full bg-gray-50">
//       <main className="h-[calc(100vh-10px)] pt-24 md:pt-24 lg:pt-32 w-full px-2 md:px-8">
//         <div className="max-w-7xl mx-auto h-full">
//           <div className="flex flex-col lg:flex-row gap-4 h-full relative">
//             <ProfileSidebar
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//               setIsSidebarOpen={setIsSidebarOpen}
//               isSidebarOpen={isSidebarOpen}
//               setUserData={setUserData}
//               setProfileImage={setProfileImage}
//             />

//             <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-x-hidden">
//               {/* Cover Image Section */}
//               <div className="relative h-40 md:h-48 lg:h-60">
//                 <div className="absolute inset-0">
//                   <Image
//                     src={userData?.coverImage ? userData.coverImage : "https://images.unsplash.com/photo-1707343843437-caacff5cfa74"}
//                     alt="Cover"
//                     fill
//                     className="object-cover"
//                     priority
//                     loader={({ src }) => src}
//                     unoptimized={true}
//                   />
//                 </div>
//               </div>

//               <div className="px-4 md:px-6 lg:px-8">
//                 {/* Profile Picture and User Info in same line */}
//                 <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 -mt-12 mb-6">
//                   {/* Profile Picture */}
//                   <div className="relative group">
//                     <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
//                       <Image
//                         src={profileImage?.imageURL || "/images/default-avatar.jpg"}
//                         alt="Profile"
//                         width={112}
//                         height={112}
//                         className="w-full h-full object-cover"
//                         loader={({ src }) => src}
//                         unoptimized={true}
//                       />
//                     </div>
//                     <button
//                       onClick={() => setIsChangeImageModalOpen(true)}
//                       className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
//                       title='Change Profile Picture'
//                     >
//                       <Camera size={20} className="text-white" />
//                     </button>

//                     {isChangeImageModalOpen && (
//                       <ChangeProfileImageModal
//                         isOpen={isChangeImageModalOpen}
//                         onClose={() => setIsChangeImageModalOpen(false)}
//                         existingImages={userImages}
//                         onSelectImage={handleImageSelect}
//                         onUploadNewImage={handleImageUpload}
//                       />
//                     )}
//                   </div>

//                   {/* User Info */}
//                   <div className="flex flex-col md:flex-row flex-1 items-start md:items-center justify-between mt-2 md:mt-8 w-full">
//                     <div>
//                       <div className="flex flex-wrap items-center gap-2">
//                         <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//                           {userData?.firstName} {userData?.lastName}
//                         </h1>
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                           <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
//                           Online
//                         </span>
//                       </div>
//                       <p className="text-gray-600 text-sm">@{userData?.userName}</p>
//                     </div>

//                     <div className="flex gap-2 mt-3 md:mt-0">
//                       <button className="bg-greenTheme text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
//                         Edit Profile
//                       </button>
//                       <button className="border border-gray-300 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
//                         Share
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Bio Section */}
//                 <div className="mb-6">
//                   <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
//                     {userData?.bio || "No bio available"}
//                   </p>
//                 </div>

//                 {/* Navigation */}
//                 <div className="border-b">
//                   <div className="flex gap-x-4 md:gap-x-6 overflow-x-auto scrollbar-hide">
//                     <button className="px-2 md:px-3 py-3 text-greenTheme border-b-2 border-greenTheme font-medium whitespace-nowrap flex items-center gap-2">
//                       <CircleUser size={18} />
//                       <span>Timeline</span>
//                     </button>
//                     <button className="px-2 md:px-3 py-3 text-gray-600 hover:text-greenTheme font-medium whitespace-nowrap flex items-center gap-2">
//                       <Info size={18} />
//                       <span>About</span>
//                     </button>
//                     <button className="px-2 md:px-3 py-3 text-gray-600 hover:text-greenTheme font-medium whitespace-nowrap flex items-center gap-2">
//                       <Users size={18} />
//                       <span>Friends</span>
//                     </button>
//                     <button className="px-2 md:px-3 py-3 text-gray-600 hover:text-greenTheme font-medium whitespace-nowrap flex items-center gap-2">
//                       <ImageIcon size={18} />
//                       <span>Photos</span>
//                     </button>
//                     <button className="px-2 md:px-3 py-3 text-gray-600 hover:text-greenTheme font-medium whitespace-nowrap flex items-center gap-2">
//                       <Video size={18} />
//                       <span>Videos</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Content Area */}
//               <div className="p-4 sm:p-6 lg:p-8">
//                 <div className="space-y-4">
//                   {/* Content sections will be added here */}
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import { Bookmark, Calendar, Camera, CircleUser, ImageIcon, Info, Users, UsersRound, Video } from 'lucide-react';
import Image from 'next/image';
import { UserData, ProfileImage } from '@/types/userTypes';
import ChangeProfileImageModal from '@/components/profile/ChangeProfileImageModal';
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { auth, db, storage } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useProfileStore } from 'src/store/useProfileStore';
import ChangeCoverImageModal from '@/components/profile/ChangeCoverImageModal';
import TimelineContent from '@/components/profile/links/TimelineContent';
import AboutContent from '@/components/profile/links/AboutContent';
import FriendsContent from '@/components/profile/links/FriendsContent';
import PhotosContent from '@/components/profile/links/PhotosContent';
import VideosContent from '@/components/profile/links/VideosContent';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { profileImage } = useProfileStore();
  const [isChangeImageModalOpen, setIsChangeImageModalOpen] = useState(false);
  const [userImages, setUserImages] = useState<ProfileImage[]>([]);
  const [isChangeCoverModalOpen, setIsChangeCoverModalOpen] = useState(false);
  const [selectedCoverImage, setSelectedCoverImage] = useState<ProfileImage | null>(null);
  const [coverImage, setCoverImage] = useState<ProfileImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const handleImageSelect = async (selectedImage: ProfileImage) => {
    const user = auth.currentUser;
    if (!user) return;

    const profileSetAsQuery = query(
      collection(db, 'profileImageSetAs'),
      where('userId', '==', user.uid),
      where('setAs', '==', 'profile')
    );
    const setAsSnapshot = await getDocs(profileSetAsQuery);

    if (!setAsSnapshot.empty) {
      const setAsDoc = setAsSnapshot.docs[0];
      await updateDoc(doc(db, 'profileImageSetAs', setAsDoc.id), {
        profileImageId: selectedImage.id
      });
    }

    useProfileStore.getState().setProfileImage(selectedImage);
    setIsChangeImageModalOpen(false);
  };

  const handleImageUpload = async (file: File) => {
    const user = auth.currentUser;
    if (!user) return;

    const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}_${file.name}`);

    const uploadTask = await uploadBytes(storageRef, file);
    const imageURL = await getDownloadURL(uploadTask.ref);

    const profileImageRef = await addDoc(collection(db, 'profileImages'), {
      userId: user.uid,
      imageURL: imageURL,
      uploadedAt: serverTimestamp()
    });

    const profileSetAsQuery = query(
      collection(db, 'profileImageSetAs'),
      where('userId', '==', user.uid),
      where('setAs', '==', 'profile')
    );
    const setAsSnapshot = await getDocs(profileSetAsQuery);

    if (!setAsSnapshot.empty) {
      const setAsDoc = setAsSnapshot.docs[0];
      await updateDoc(doc(db, 'profileImageSetAs', setAsDoc.id), {
        profileImageId: profileImageRef.id
      });
    }

    useProfileStore.getState().setProfileImage({
      id: profileImageRef.id,
      imageURL,
      userId: user.uid,
      typeOfImage: 'profile',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    setIsChangeImageModalOpen(false);
  };

  const handleCoverImageSelect = (selectedImage: ProfileImage) => {
    setSelectedCoverImage(selectedImage);
  };


  const handleSaveCoverImage = async () => {
    if (!selectedCoverImage) return;

    const user = auth.currentUser;
    if (!user) return;

    const coverSetAsQuery = query(
      collection(db, 'profileImageSetAs'),
      where('userId', '==', user.uid),
      where('setAs', '==', 'coverProfile')
    );
    const setAsSnapshot = await getDocs(coverSetAsQuery);

    if (!setAsSnapshot.empty) {
      const setAsDoc = setAsSnapshot.docs[0];
      await updateDoc(doc(db, 'profileImageSetAs', setAsDoc.id), {
        profileImageId: selectedCoverImage.id
      });
    } else {
      await addDoc(collection(db, 'profileImageSetAs'), {
        userId: user.uid,
        profileImageId: selectedCoverImage.id,
        setAs: 'coverProfile'
      });
    }

    // Instant update
    setCoverImage(selectedCoverImage);
    setIsChangeCoverModalOpen(false);
    setSelectedCoverImage(null);
  };


  const handleCoverImageUpload = async (file: File) => {
    const user = auth.currentUser;
    if (!user) return;

    const storageRef = ref(storage, `profiles/${user.uid}/covers/${Date.now()}_${file.name}`);

    const uploadTask = await uploadBytes(storageRef, file);
    const imageURL = await getDownloadURL(uploadTask.ref);

    const coverImageRef = await addDoc(collection(db, 'profileImages'), {
      userId: user.uid,
      imageURL,
      typeOfImage: 'coverProfile',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const newCoverImage = {
      id: coverImageRef.id,
      imageURL,
      userId: user.uid,
      typeOfImage: 'coverProfile',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSelectedCoverImage(newCoverImage);
    setUserImages(prev => [...prev, newCoverImage]);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profileImagesQuery = query(
          collection(db, 'profileImages'),
          where('userId', '==', user.uid)
        );

        const profileImagesSnapshot = await getDocs(profileImagesQuery);
        const images = profileImagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ProfileImage[];

        setUserImages(images);

        // Fetch current cover image
        const coverSetAsQuery = query(
          collection(db, 'profileImageSetAs'),
          where('userId', '==', user.uid),
          where('setAs', '==', 'coverProfile')
        );
        const coverSnapshot = await getDocs(coverSetAsQuery);

        if (!coverSnapshot.empty) {
          const setAsDoc = coverSnapshot.docs[0].data();
          const matchingCoverImage = images.find(img => img.id === setAsDoc.profileImageId);
          if (matchingCoverImage) {
            setCoverImage(matchingCoverImage);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="min-h-screen w-full bg-gray-50">
      <main className="h-[calc(100vh-10px)] pt-24 md:pt-24 lg:pt-32 w-full px-2 md:px-8">
        <div className="max-w-7xl mx-auto h-full">
          <div className="flex flex-col lg:flex-row gap-4 h-full relative">
            {/* Fixed Left Sidebar */}
            <div className="lg:sticky lg:top-32">
              <ProfileSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsSidebarOpen={setIsSidebarOpen}
                isSidebarOpen={isSidebarOpen}
                setUserData={setUserData}
                setProfileImage={useProfileStore.getState().setProfileImage}
              />
            </div>

            <div className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto">
              <div className="flex-shrink-0">
                {/* Cover Image Section */}
                <div className="relative h-40 md:h-48 lg:h-60">
                  <div className="absolute inset-0">
                    {isLoading && (
                      <div className="w-full h-full bg-gray-200 animate-pulse" />
                    )}
                    {coverImage?.imageURL && (
                      <Image
                        src={coverImage.imageURL}
                        alt="Cover"
                        fill
                        className="object-cover"
                        priority
                        loader={({ src }) => src}
                        unoptimized={true}
                        onLoadingComplete={() => setIsLoading(false)}
                      />
                    )}
                  </div>

                  <button
                    onClick={() => setIsChangeCoverModalOpen(true)}
                    className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
                  >
                    <Camera size={18} />
                    Change Cover
                  </button>

                  {isChangeCoverModalOpen && (
                    <ChangeCoverImageModal
                      isOpen={isChangeCoverModalOpen}
                      onClose={() => setIsChangeCoverModalOpen(false)}
                      existingImages={userImages}
                      onSelectImage={handleCoverImageSelect}
                      onSave={handleSaveCoverImage}
                      onUploadNewImage={handleCoverImageUpload}
                    />
                  )}
                </div>

                <div className="px-4 md:px-6 lg:px-8">
                  {/* Profile Picture and User Info */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 -mt-12 mb-6">
                    <div className="relative group">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                        <Image
                          src={profileImage?.imageURL || "/images/default-avatar.jpg"}
                          alt="Profile"
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                          loader={({ src }) => src}
                          unoptimized={true}
                        />
                      </div>
                      <button
                        onClick={() => setIsChangeImageModalOpen(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                        title='Change Profile Picture'
                      >
                        <Camera size={20} className="text-white" />
                      </button>

                      {isChangeImageModalOpen && (
                        <ChangeProfileImageModal
                          isOpen={isChangeImageModalOpen}
                          onClose={() => setIsChangeImageModalOpen(false)}
                          existingImages={userImages}
                          onSelectImage={handleImageSelect}
                          onUploadNewImage={handleImageUpload}
                        />
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 items-start md:items-center justify-between mt-2 md:mt-8 w-full">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {userData?.firstName} {userData?.lastName}
                          </h1>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                            Online
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">@{userData?.userName}</p>
                      </div>

                      <div className="flex gap-2 mt-3 md:mt-0">
                        <button className="bg-greenTheme text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                          Edit Profile
                        </button>
                        <button className="border border-gray-300 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          Share
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="mb-6">
                    <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
                      {userData?.bio || "No bio available"}
                    </p>
                  </div>

                  {/* Navigation */}
                  <div className="border-b">
                    <div className="flex gap-x-4 md:gap-x-6 overflow-x-auto scrollbar-hide">
                      <button
                        onClick={() => setActiveTab('timeline')}
                        className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'timeline'
                          ? 'text-greenTheme border-b-2 border-greenTheme'
                          : 'text-gray-600 hover:text-greenTheme'
                          }`}
                      >
                        <CircleUser size={18} />
                        <span>Timeline</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('about')}
                        className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'about'
                          ? 'text-greenTheme border-b-2 border-greenTheme'
                          : 'text-gray-600 hover:text-greenTheme'
                          }`}
                      >
                        <Info size={18} />
                        <span>About</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('friends')}
                        className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'friends'
                          ? 'text-greenTheme border-b-2 border-greenTheme'
                          : 'text-gray-600 hover:text-greenTheme'
                          }`}
                      >
                        <Users size={18} />
                        <span>Friends</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('photos')}
                        className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'photos'
                          ? 'text-greenTheme border-b-2 border-greenTheme'
                          : 'text-gray-600 hover:text-greenTheme'
                          }`}
                      >
                        <ImageIcon size={18} />
                        <span>Photos</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('videos')}
                        className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'videos'
                          ? 'text-greenTheme border-b-2 border-greenTheme'
                          : 'text-gray-600 hover:text-greenTheme'
                          }`}
                      >
                        <Video size={18} />
                        <span>Videos</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('groups')}
                        className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'groups'
                          ? 'text-greenTheme border-b-2 border-greenTheme'
                          : 'text-gray-600 hover:text-greenTheme'
                          }`}
                      >
                        <UsersRound size={18} />
                        <span>Groups</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('events')}
                        className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'events'
                          ? 'text-greenTheme border-b-2 border-greenTheme'
                          : 'text-gray-600 hover:text-greenTheme'
                          }`}
                      >
                        <Calendar size={18} />
                        <span>Events</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('saved')}
                        className={`px-2 md:px-3 py-3 font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'saved'
                          ? 'text-greenTheme border-b-2 border-greenTheme'
                          : 'text-gray-600 hover:text-greenTheme'
                          }`}
                      >
                        <Bookmark size={18} />
                        <span>Saved</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-4 sm:p-6 lg:p-8">
                  {activeTab === 'timeline' && (
                    <TimelineContent userData={userData} profileImage={profileImage} />
                  )}
                  {activeTab === 'about' && (
                    <AboutContent userData={userData} profileImage={profileImage} />
                  )}
                  {activeTab === 'friends' && (
                    <FriendsContent userData={userData} profileImage={profileImage} />
                  )}
                  {activeTab === 'photos' && (
                    <PhotosContent userData={userData} profileImage={profileImage} />
                  )}
                  {activeTab === 'videos' && (
                    <VideosContent userData={userData} profileImage={profileImage} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

}

