'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@nextui-org/react';
import { getDocs, collection, addDoc, setDoc, getDoc, doc, serverTimestamp, query, where, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseConfig';
import { Communities } from '@/types/global';
import { Community } from '@/types/communityTypes';
import { Search, MessageSquare, Bell, Settings, Compass, Plus, Users, Calendar, X, LogOut, HelpCircle, Bookmark, Wallet, User, Heart, LayoutGrid, ChevronDown, List, Flag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { doc as firestoreDoc } from 'firebase/firestore';


// type Community = {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl: string;
//   isPrivate: boolean;
//   userId: string;
//   categoryId: string;
//   bannerImageUrl: string;
//   membershipCount: number;
//   membershipLikes: number;
//   topMembers: string[];
//   creatorProfileImage?: string | null;
//   creatorName: string;
//   isMember: boolean;
//   requestStatus: string;
// }

type CategoryType = {
  id: string;
  type: string;
  bannerImageUrl: string;
}




export default function CommunitiesPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCommunities, setFilteredCommunities] = useState<Communities[]>([]);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const dropdownRef = useRef(null);

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);



  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Events', href: '/events' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Communities', href: '/communities' },
    { name: 'Marketplace', href: '/marketplace' }
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const ProfileDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        className="w-10 h-10 rounded-full overflow-hidden focus:outline-none ring-2 ring-greenTheme ring-offset-2 transition-all duration-200"
      >
        {profileImage?.imageURL ? (
          <Image
            src={profileImage.imageURL}
            alt="Profile"
            width={40}
            height={40}
            className="w-full h-full object-cover"
            loader={({ src }) => src}
            unoptimized={true}
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </button>

      {isProfileDropdownOpen && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl py-2 z-[1000] transform transition-all duration-200 ease-out">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-lg font-semibold text-gray-800">{userData?.firstName} {userData?.lastName}</p>
            <p className="text-sm text-gray-500">@{userData?.userName}</p>
            <div className="mt-2 flex gap-4">
              <span className="text-sm"><b>245</b> Friends</span>
              <span className="text-sm"><b>128</b> Posts</span>
            </div>
          </div>

          <div className="py-2">
            <a href="/profile" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
              <User className="w-5 h-5 mr-3 text-greenTheme" />
              <span>View Profile</span>
            </a>
            <a href="/settings" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
              <Settings className="w-5 h-5 mr-3 text-greenTheme" />
              <span>Settings</span>
            </a>
            <a href="/wallet" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
              <Wallet className="w-5 h-5 mr-3 text-greenTheme" />
              <span>Wallet</span>
            </a>
            <a href="/saved" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
              <Bookmark className="w-5 h-5 mr-3 text-greenTheme" />
              <span>Saved Items</span>
            </a>
          </div>

          <div className="border-t border-gray-100 py-2">
            <a href="/help" className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors">
              <HelpCircle className="w-5 h-5 mr-3 text-greenTheme" />
              <span>Help & Support</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-6 py-3 hover:bg-red-50 transition-colors text-red-600"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const communityRef = collection(db, 'communityVariant');
        const querySnapshot = await getDocs(communityRef);
        if (querySnapshot.empty) {
          setCommunities([]);
        } else {
          const communityData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Community[];
          setCommunities(communityData);
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
        setCommunities([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);



  const handleCommunityAction = async (communityId: string, isPrivate: boolean) => {
    if (!auth.currentUser) return;

    try {
      if (isPrivate) {
        // Check if request already exists
        const existingRequestRef = query(
          collection(db, 'communityRequests'),
          where('userId', '==', auth.currentUser.uid),
          where('communityVariantId', '==', communityId)
        );
        const requestSnapshot = await getDocs(existingRequestRef);

        if (requestSnapshot.empty) {
          await addDoc(collection(db, 'communityRequests'), {
            userId: auth.currentUser.uid,
            communityVariantId: communityId,
            status: 'pending',
            requestedAt: serverTimestamp()
          });
        }
      } else {
        // Check if membership already exists
        const existingMembershipRef = query(
          collection(db, 'communityVariantMembership'),
          where('userId', '==', auth.currentUser.uid),
          where('communityVariantId', '==', communityId),
          where('isMember', '==', true)
        );
        const membershipSnapshot = await getDocs(existingMembershipRef);

        if (membershipSnapshot.empty) {
          // Add to communityVariantMembership
          await addDoc(collection(db, 'communityVariantMembership'), {
            userId: auth.currentUser.uid,
            communityVariantId: communityId,
            isMember: true,
            from: serverTimestamp(),
            to: null
          });

          // Create or update communityVariantMembershipAndLikeCount
          const countRef = doc(db, 'communityVariantMembershipAndLikeCount', communityId);
          const countDoc = await getDoc(countRef);

          if (countDoc.exists()) {
            await updateDoc(countRef, {
              membershipCount: increment(1)
            });
          } else {
            await setDoc(countRef, {
              membershipCount: 1,
              membershipLikes: 0,
              communityVariantId: communityId
            });
          }

          // Update local state
          setCommunities(prevCommunities =>
            prevCommunities.map(community =>
              community.id === communityId
                ? {
                  ...community,
                  isMember: true,
                  membershipCount: (community.membershipCount || 0) + 1
                }
                : community
            )
          );
        }
      }
    } catch (error) {
      console.error('Error updating membership:', error);
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      const categoryRef = collection(db, 'communityCategory');
      const querySnapshot = await getDocs(categoryRef);
      const categoryData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CategoryType[];
      setCategories(categoryData);

      const communityRef = collection(db, 'communityVariant');
      const communitySnapshot = await getDocs(communityRef);
      const communityData = await Promise.all(communitySnapshot.docs.map(async doc => {
        const data = doc.data();

        // Fetch user details
        const userDoc = await getDoc(firestoreDoc(db, 'users', data.userId));
        const userData = userDoc.data();
        const creatorName = `${userData?.firstName} ${userData?.lastName}`;

        // Try communityProfile first
        let profileSetAsRef = query(
          collection(db, 'profileImageSetAs'),
          where('userId', '==', data.userId),
          where('setAs', '==', 'communityProfile')
        );
        let profileSetAsSnapshot = await getDocs(profileSetAsRef);
        console.log('Found communityProfile:', !profileSetAsSnapshot.empty);

        // If no communityProfile, try profile
        if (profileSetAsSnapshot.empty) {
          profileSetAsRef = query(
            collection(db, 'profileImageSetAs'),
            where('userId', '==', data.userId),
            where('setAs', '==', 'profile')
          );
          profileSetAsSnapshot = await getDocs(profileSetAsRef);
          console.log('Found profile:', !profileSetAsSnapshot.empty);
        }

        let profileImageUrl = null;
        if (!profileSetAsSnapshot.empty) {
          const imageId = profileSetAsSnapshot.docs[0].data().profileImageId;
          console.log('Profile Image ID:', imageId);
          const imageRef = firestoreDoc(db, 'profileImages', imageId);
          const imageDoc = await getDoc(imageRef);
          console.log('Image Document Data:', imageDoc.data());
          profileImageUrl = imageDoc.data()?.imageURL;
          console.log('Final Image URL:', profileImageUrl);
        }

        // Check membership status
        const membershipRef = query(
          collection(db, 'communityVariantMembership'),
          where('userId', '==', auth.currentUser?.uid),
          where('communityVariantId', '==', doc.id),
          where('isMember', '==', true)
        );
        const membershipSnapshot = await getDocs(membershipRef);
        const isMember = !membershipSnapshot.empty;

        // Get membership count
        const countRef = query(
          collection(db, 'communityVariantMembershipAndLikeCount'),
          where('communityVariantId', '==', doc.id)
        );
        const countSnapshot = await getDocs(countRef);
        const countData = countSnapshot.docs[0]?.data();

        // Check request status for private communities
        const requestRef = query(
          collection(db, 'communityRequests'),
          where('userId', '==', auth.currentUser?.uid),
          where('communityVariantId', '==', doc.id)
        );
        const requestSnapshot = await getDocs(requestRef);
        const requestStatus = !requestSnapshot.empty ? requestSnapshot.docs[0].data().status : null;

        return {
          id: doc.id,
          ...data,
          creatorProfileImage: profileImageUrl,
          creatorName,
          isMember,
          requestStatus,
          membershipCount: countData?.membershipCount || 0,
          membershipLikes: countData?.membershipLikes || 0
        } as Community;
      }));


      setCommunities(communityData);
    };

    fetchData();
  }, []);






  // Add the CreateCommunityModal component
  const CreateCommunityModal = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);



    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!auth.currentUser?.uid) {
        return;
      }

      const newCommunity = {
        title: title,
        description: description,
        imageUrl: imageUrl,
        categoryId: selectedCategory,
        isPrivate: isPrivate,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      };

      try {
        // Create the community document
        const docRef = await addDoc(collection(db, 'communityVariant'), newCommunity);

        // Initialize membership and like counts
        await setDoc(doc(db, 'communityVariantMembershipAndLikeCount', docRef.id), {
          membershipCount: 1,
          membershipLikes: 0,
          communityVariantId: docRef.id
        });

        // Add creator as first member
        await addDoc(collection(db, 'communityVariantMembership'), {
          isMember: true,
          from: serverTimestamp(),
          to: null,
          userId: auth.currentUser.uid,
          communityVariantId: docRef.id
        });

        // Reset form and close modal
        setTitle('');
        setDescription('');
        setImageUrl('');
        setSelectedCategory('');
        setIsPrivate(false);
        setIsModalOpen(false);

        // Refresh communities list
        window.location.reload();
      } catch (error) {
        console.error('Error creating community:', error);
      }
    };



    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-xl p-6 w-full max-w-md relative z-[10000]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create Community</h2>
            <button onClick={() => setIsModalOpen(false)} aria-label="Close modal">
              <X size={24} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="communityName" className="block text-sm font-medium text-gray-700 mb-1">
                Community Name
              </label>
              <input
                id="communityName"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                required
                placeholder="Enter community name"
              />
            </div>

            <div>
              <label htmlFor="communityDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="communityDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                rows={3}
                required
                placeholder="Enter community description"
              />
            </div>

            <div>
              <label htmlFor="communityImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                id="communityImageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                required
                placeholder="Enter image URL"
              />
            </div>

            <div>
              <label htmlFor="communityCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="communityCategory"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded text-greenTheme focus:ring-greenTheme"
              />
              <label htmlFor="isPrivate" className="text-sm text-gray-700">
                Make this community private
              </label>
            </div>

            <Button type="submit" className="w-full bg-greenTheme text-white py-2 rounded-lg">
              Create Community
            </Button>
          </form>
        </div>
      </div>
    );
  };


  return (
    <>
      {isModalOpen && <CreateCommunityModal />}

      <div className="min-h-screen bg-gray-50">


        {/* Main content*/}
        <main className="container mx-auto px-4 pt-36">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Featured Communities</h1>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-greenTheme text-white rounded-full px-6 py-2 flex items-center gap-2"
            >
              <Plus size={20} />
              Create Community
            </Button>
          </div>

          <div className="mb-8 space-y-6">
            {/* Advanced Search Bar with Integrated Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search communities..."
                    className="w-full px-4 py-3 pl-12 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-greenTheme/20 transition-all"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>

                <div className="flex gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 lg:flex-none lg:min-w-[160px]">
                    <select className="w-full appearance-none px-4 py-3 pr-10 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-greenTheme/20" title="Sort options">
                      <option value="">Sort by: Popular</option>
                      <option value="newest">Sort by: Newest</option>
                      <option value="active">Sort by: Active</option>
                      <option value="trending">Sort by: Trending</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>

                  <div className="relative flex-1 lg:flex-none lg:min-w-[160px]">
                    <select className="w-full appearance-none px-4 py-3 pr-10 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-greenTheme/20" title="Category options">
                      <option value="">All Categories</option>
                      <option value="tech">Technology</option>
                      <option value="art">Art & Design</option>
                      <option value="fitness">Health & Fitness</option>
                      <option value="education">Education</option>
                      <option value="entertainment">Entertainment</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                </div>
              </div>
            </div>


            {/* Interactive Category Pills with Active States */}
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                {['All', 'Technology', 'Art & Design', 'Health & Fitness', 'Education', 'Entertainment', 'Gaming', 'Music', 'Travel', 'Food', 'Photography'].map((category) => (
                  <button
                    key={category}
                    className="px-6 py-2.5 rounded-full bg-white border border-gray-200 hover:bg-greenTheme hover:text-white hover:border-greenTheme active:scale-95 transition-all duration-150 whitespace-nowrap font-medium text-sm shadow-sm"
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white pointer-events-none" />
            </div>

            {/* View Toggle and Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">Showing <span className="font-medium">127</span> communities</p>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Grid View">
                  <LayoutGrid size={20} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="List View">
                  <List size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>



          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-20">
            {loading ? (
              <div>Loading...</div>
            ) : communities.length > 0 ? (
              communities.map((community) => (

                <div key={community.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-24 relative">
                    <Image
                      src={community.imageUrl}
                      alt={`${community.title} banner`}
                      fill
                      className="object-cover w-full h-full"
                      unoptimized={true}
                    />

                    {/* Category Icon */}
                    <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded-full flex items-center space-x-1">
                      <div className="w-4 h-4 relative">
                        <Image
                          src={categories.find(cat => cat.id === community.categoryId)?.bannerImageUrl || ''}
                          alt="Category"
                          fill
                          className="rounded-full object-cover"
                          unoptimized={true}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-800 leading-none">
                        {categories.find(cat => cat.id === community.categoryId)?.type}
                      </span>
                    </div>


                    <button
                      className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors duration-200"
                      title="Report Community"
                    >
                      <Flag size={16} className="text-gray-600 hover:text-red-500" />
                    </button>

                    <div className="absolute -bottom-8 left-4">
                      <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden">
                        <Image
                          src={community.creatorProfileImage || '/default-avatar.png'}
                          alt="Creator"
                          width={64}
                          height={64}
                          className="object-cover"
                          unoptimized={true}
                        />
                      </div>
                    </div>

                  </div>

                  <div className="p-4 pt-10">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0 mr-2">
                        <h2 className="text-lg font-bold text-gray-900 truncate">{community.title}</h2>
                        <p className="text-sm text-gray-600 line-clamp-2">{community.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <span className="text-xs uppercase tracking-wider text-gray-500">Created by</span>
                          <span className="ml-1 font-medium text-greenTheme">{community.creatorName}</span>
                        </div>
                      </div>
                      {auth.currentUser?.uid !== community.userId && (
                        <Button
                          className={`rounded-full px-3 py-1 text-sm flex-shrink-0 ${community.requestStatus === 'pending' || community.requestStatus === 'declined'
                            ? 'bg-gray-400'
                            : 'bg-greenTheme'
                            } text-white`}
                          disabled={community.requestStatus === 'pending' || community.requestStatus === 'declined'}
                          onClick={() => {
                            if (community.isMember) {
                              router.push(`/communities/${community.id}`);
                            } else if (community.id && typeof community.isPrivate === 'boolean') {
                              handleCommunityAction(community.id, community.isPrivate);
                            }
                          }}
                        >
                          {community.isMember
                            ? 'View'
                            : community.requestStatus === 'pending'
                              ? 'Pending'
                              : community.requestStatus === 'declined'
                                ? 'Declined'
                                : community.isPrivate
                                  ? 'Request'
                                  : 'Join'}
                        </Button>
                      )}
                    </div>


                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{community.membershipCount?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={14} />
                          <span>{community.membershipLikes?.toLocaleString() || '0'}</span>
                        </div>
                      </div>

                      {community.topMembers && (
                        <div className="flex -space-x-2">
                          {community.topMembers.slice(0, 3).map((member, index) => (
                            <div key={index} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                              <Image
                                src={member}
                                alt="Member"
                                width={24}
                                height={24}
                                className="object-cover"
                                unoptimized={true}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>



              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-lg text-gray-600">No communities available</p>
              </div>
            )}
          </div>



        </main>

      </div>

    </>
  );
}
