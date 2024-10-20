'use client';

import Navbar from '@/comm/Navbar';
import communityImage2 from '@/public/images/home/computer.webp';
import { Avatar, AvatarGroup, Button, Image } from '@nextui-org/react';
import { CircleEllipsis, Smile, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { ProfileData, UserData, SocialPosts, Communities, Follower, Following } from '@/types/global';
import { useEffect, useState } from 'react';
import { auth, db } from '@/firebaseConfig';
import { collection, getDocs, doc, getDoc, query, where, documentId, updateDoc, doc as firestoreDoc } from 'firebase/firestore';
import { onAuthStateChanged, User, updateProfile, getAuth } from 'firebase/auth';
import { fetchProfile, loginRedirect } from '@/helpers/Auth';
import { useRouter } from 'next/navigation';
import ProfilePosts from '@/components/profile/profilePosts';
import PostForm from '@/components/home/posts/PostForm'; 
import React from 'react';
import EditProfileModal from '@/components/profile/EditProfileModal';
import styles from './profile.module.css';
import About from '@/components/profile/filters/About';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<SocialPosts[]>([]); // State for posts
  const [loading, setLoading] = useState(true);
  const [togglePostForm, setTogglePostForm] = useState<boolean>(false);
  const [postCreated, setPostCreated] = useState<boolean>(false); //Checks if a post was created
  const [socialPosts, setSocialPosts] = useState<SocialPosts[]>([]); // For new posts
  const [communities, setCommunities] = useState<Communities[]>([]); // State for communities
  const [selectedFilter, setSelectedFilter] = useState<string>('all'); // Default is 'all'
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Following[]>([]);

  useEffect(() => {
    loginRedirect(router, true)
      .then(() => setLoading(false))
      .catch((error) => {
        // console.error('Error during login redirect:', error);
        setLoading(false);
      });
  
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
  
        // Add console log for the authenticated user
        console.log('Authenticated user:', {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        });
  
        // Fetch profile and user data
        const profileRef = doc(db, 'profiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);
  
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
  
        if (profileSnap.exists() && userSnap.exists()) {
          const profileData = profileSnap.data() as ProfileData;
          const userData = userSnap.data() as UserData;

          setProfile(profileData);
          setUserData(userData);

          // Update user's photoURL if it exists in userData
          if (userData.photoURL && userData.photoURL !== currentUser.photoURL) {
            await updateProfile(currentUser, { photoURL: userData.photoURL });
          }
        }
        // Fetch posts
        const getPosts = await getDocs(collection(db, 'posts'));
        const postsData = getPosts.docs.map((doc) => doc.data() as SocialPosts);
        const userPosts = postsData
          .filter((post) => post.email === currentUser.email)
          .sort((a, b) => b.time - a.time); // Sort by most recent
        setPosts(userPosts);
  
        // Fetch communities
        const fetchCommunities = async () => {
          try {
            const communitiesCollection = collection(db, 'communities');
            const communitySnapshot = await getDocs(communitiesCollection);
            const communitiesData = communitySnapshot.docs.map((doc) => doc.data() as Communities);
  
            // Filter communities where the current user is in the members array
            const userCommunities = communitiesData.filter((community) =>
              community.members && community.members.includes(currentUser.uid)
            );
  
            setCommunities(userCommunities);
          } catch (error) {
            // console.error('Error fetching communities:', error);
          }
        };
  
        fetchCommunities();
      } else {
        setUser(null);
        setProfile(null);
        setUserData(null);
        setPosts([]);
        setCommunities([]);
        console.log('No authenticated user');
      }
  
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, [router]);
  
  const fetchFollowersAndFollowing = async (currentUser: User) => {
    if (currentUser) {
      // Fetch followers
      const followersSnapshot = await getDocs(query(collection(db, 'followers'), where('followedId', '==', currentUser.uid)));
      const followerIds = followersSnapshot.docs.map(doc => doc.data().followerId);

      // Fetch following
      const followingSnapshot = await getDocs(query(collection(db, 'following'), where('followerId', '==', currentUser.uid)));
      const followingIds = followingSnapshot.docs.map(doc => doc.data().followedId);

      // Fetch user data for followers and following
      const userIds = Array.from(new Set([...followerIds, ...followingIds]));
      
      let usersData = {};
      if (userIds.length > 0) {
        const usersSnapshot = await getDocs(query(collection(db, 'users'), where(documentId(), 'in', userIds)));
        usersData = usersSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {});
      }

      // Construct followers and following arrays
      const followers = followerIds.map(id => ({
        uid: id,
        username: usersData[id]?.userName,
        profilePicture: usersData[id]?.profilePicture,
        email: usersData[id]?.email
      }));

      const following = followingIds.map(id => ({
        uid: id,
        username: usersData[id]?.userName,
        profilePicture: usersData[id]?.profilePicture,
        email: usersData[id]?.email
      }));

      setFollowers(followers);
      setFollowing(following);
    }
  };

  // Use this function to signal that a post was created
  const handlePostCreated = () => {
    setPostCreated((prev) => !prev); // Toggle postCreated state
  };

  // Use another useEffect to refetch posts when postCreated changes
  useEffect(() => {
    if (user) {
      const fetchPosts = async () => {
        try {
          const getPosts = await getDocs(collection(db, 'posts'));
          const postsData = getPosts.docs.map((doc) => doc.data() as SocialPosts);
          const userPosts = postsData
            .filter((post) => post.email === user.email)
            .sort((a, b) => b.time - a.time); // Sort by most recent
          setPosts(userPosts);
        } catch (error) {
          // console.error('Error fetching posts:', error);
        }
      };
  
      fetchPosts();
    }
  }, [postCreated, user]);
  
  const handleProfileUpdate = (updatedData) => {
    console.log("Received updated data in Profile:", updatedData);
    if (user) {
      try {
        // Update Firestore profile
        const profileRef = firestoreDoc(db, 'profiles', user.uid);
        updateDoc(profileRef, updatedData);

        // Update local state
        setProfile(prevProfile => {
          const newProfile = { ...prevProfile, ...updatedData };
          console.log("Updated profile state:", newProfile);
          return newProfile;
        });

      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Optional: Add a loading spinner
  }

  if (!user || !profile || !userData) {
    return <div></div>;
  }

  // Logic to filter posts based on selected filter
  const filteredPosts = posts.filter(post => {
    if (selectedFilter === 'all') return true; // Show all posts
    if (selectedFilter === 'photos') return post.postImage !== undefined; // Filter posts with images
    if (selectedFilter === 'videos') return post.video !== undefined; // Filter posts with videos
    return true;
  });

  const toggleEditModal = () => {
    setEditModalOpen(!isEditModalOpen);
  };

  const handleSave = async (updatedData) => {
    console.log("Received updated data in Profile:", updatedData);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        // Update Firestore profile
        const profileRef = doc(db, 'profiles', currentUser.uid);
        await updateDoc(profileRef, updatedData);

        // Update user collection
        const userRef = doc(db, 'users', currentUser.uid);
        if (updatedData.photoURL) {
          await updateDoc(userRef, {
            photoURL: updatedData.photoURL,
          });
          // Update auth profile
          await updateProfile(currentUser, { photoURL: updatedData.photoURL });
        }

        // Update local state
        setProfile(prevProfile => ({
          ...prevProfile,
          ...updatedData,
        }));

        setUserData(prevUserData => ({
          ...prevUserData,
          ...(updatedData.photoURL && { photoURL: updatedData.photoURL }),
        }));

        setUser(currentUser); // This will trigger a re-render with the updated user object

        console.log("Profile updated successfully");
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    } else {
      console.error('No authenticated user found');
    }

    setEditModalOpen(false);
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen w-full">
      <div className="w-full max-w-screen-xl">
        <Navbar>
          {/* Overlay for post form */}
          {togglePostForm && (
            <>
              <div className="fixed top-0 z-40 h-full w-full bg-black opacity-50"></div>
              {/* PostForm Component */}
              <PostForm 
                profile={profile}
                user={userData}
                setSocialPosts={setSocialPosts}
                setTogglePostForm={setTogglePostForm}
                onPostCreated={handlePostCreated} // Pass the callback function
              />
            </>
          )}

          {isEditModalOpen && (
            <EditProfileModal 
              isOpen={isEditModalOpen} 
              onClose={toggleEditModal} 
              onSave={handleSave}
              initialData={profile} // Pass the current profile data
            />
          )}

          <div className="flex h-full min-h-screen w-full flex-col overflow-y-auto bg-gray-100 text-gray-800">
            {/* Profile Information Section */}
            <section className={styles.profileContainer}>
              <Image 
                src={profile.banner} 
                alt="Profile Banner" 
                className={styles.bannerImage}
                width={4000}
                height={200}
              />
              <div className={styles.avatarContainer}>
                <Image
                  src={user.photoURL}
                  alt="Profile picture"
                  className={styles.avatar}
                  width={120}
                  height={120}
                />
              </div>
              <div className={styles.profileInfo}>
                <div className="md:flex md:justify-between md:items-start">
                  <div>
                    <h1 className="text-xl font-semibold">{profile.firstName} {profile.lastName}</h1>
                    <p className="text-gray-600">@{userData.userName}</p>
                    <div className="mt-2 flex space-x-2">
                      <Button 
                        onClick={toggleEditModal}
                        className="border border-gray-300 rounded-md px-4 py-1 text-sm"
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="mt-2 flex space-x-4 text-sm">
                      <div>
                        <p>{following.length} Following</p>
                        <AvatarGroup isBordered max={3}>
                          {following.map((follow, index) => (
                            <Avatar key={index} src={follow.profilePicture} alt={follow.username} />
                          ))}
                        </AvatarGroup>
                      </div>
                      <p>{posts.length} Posts</p>
                      <div>
                        <p>{followers.length} Followers</p>
                        <AvatarGroup isBordered max={3}>
                          {followers.map((follower, index) => (
                            <Avatar key={index} src={follower.profilePicture} alt={follower.username} />
                          ))}
                        </AvatarGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Navigation Section */}
            <nav className="mb-4 border-b border-gray-300 sticky top-0 bg-white z-10 rounded-t-lg overflow-x-auto">
              <ul className="flex whitespace-nowrap p-2 text-sm md:text-base min-w-max">
                <li 
                  className={`cursor-pointer px-4 py-2 ${selectedFilter === 'all' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
                  onClick={() => setSelectedFilter('all')}>
                  Timeline
                </li>
                <li 
                  className={`cursor-pointer px-4 py-2 ${selectedFilter === 'communities' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
                  onClick={() => setSelectedFilter('communities')}>
                  Communities
                </li>
                <li 
                  className={`cursor-pointer px-4 py-2 ${selectedFilter === 'likes' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
                  onClick={() => setSelectedFilter('likes')}>
                  Likes
                </li>
                <li 
                  className={`cursor-pointer px-4 py-2 ${selectedFilter === 'photos' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
                  onClick={() => setSelectedFilter('photos')}>
                  Photos
                </li>
                <li 
                  className={`cursor-pointer px-4 py-2 ${selectedFilter === 'videos' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
                  onClick={() => setSelectedFilter('videos')}>
                  Videos
                </li>
                <li
                  className={`cursor-pointer px-4 py-2 ${selectedFilter === 'about' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
                  onClick={() => setSelectedFilter('about')}>
                  About
                </li>
              </ul>
            </nav>
            {/* Posts Section */}

            <section className="flex flex-col md:flex-row flex-grow gap-4 overflow-y-auto">
              {/* Timeline Posts Section */}
              <div className="w-full overflow-y-auto p-2 md:w-2/3">
                {/* New Post Section */}
                {selectedFilter === 'all' && (
                  <div
                    className="mb-4 rounded-xl bg-white p-4 shadow-lg cursor-pointer"
                    onClick={() => setTogglePostForm(true)}
                  >
                    <div className="flex flex-col md:flex-row justify-around rounded-xl p-5">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <Avatar src={user.photoURL as string} alt="Avatar" className="h-full w-full object-cover" />
                      </div>
                      <p className="mb-5 mt-5 w-full cursor-pointer border-b border-gray-300 pb-2 text-base outline-none">
                        What&apos;s going on?
                      </p>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Button>Gallery</Button>
                      <Smile className="text-green-600 cursor-pointer" />
                      <CircleEllipsis className="ml-auto cursor-pointer" color="grey" />
                    </div>
                  </div>
                )}

                {/* Dynamically Render Posts */}
                <ProfilePosts 
                  socialPosts={filteredPosts} 
                  selectedPost={selectedFilter} 
                  user={userData} // Add this line
                />
                </div>

              {/* Sidebar Section */}
              <div className="w-full overflow-y-auto p-2 md:w-1/3">
                {/* About Section */}
                <div className="mb-4 rounded-xl bg-white p-4 shadow-lg" key={profile?.aboutMe}>
                  <h2 className="mb-2 border-b pb-2 text-lg font-semibold">About</h2>
                  <div className="flex flex-col justify-between mt-4 md:mt-0 ml-auto text-sm text-gray-600 mr-auto">
                    <p><strong>Bio:</strong> {profile?.aboutMe || 'This user has not updated their bio'}</p>
                    <p><strong>Date of Birth:</strong> {profile?.birthday || 'Not specified'}</p>
                    <p><strong>Gender:</strong> {userData?.gender || 'Not specified'}</p>
                    <p><strong>Job:</strong> {profile?.workingAt || 'Not specified'}</p>
                    <p><strong>School:</strong> {profile?.school || 'Not specified'}</p>
                    <p><strong>Country:</strong> {profile?.country || 'Not specified'}</p>
                  </div>
                </div>

               {/* Communities Section */}  
                <div className="mb-4 rounded-xl bg-white p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold"> Joined Communities</h3>
                    <Link href="/communities">
                      <UsersRound className="text-green-600" />
                    </Link>
                  </div>
                  <ul className="mt-3 flex flex-wrap justify-around">
                    {/* Dynamically render communities fetched from Firestore */}
                    {communities.length > 0 ? (
                      communities.map((community) => (
                        <li key={community.id} className="mb-3 text-center">
                          <Image
                            src={community.communityImage as string}
                            alt={community.name}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <p className="mt-2 text-sm">{community.name}</p>
                        </li>
                      ))
                    ) : (
                      <p>No communities found.</p>
                    )}
                  </ul>
                </div>
                {/* Photos Section */}
                <div className="mb-4 rounded-xl bg-white p-4 shadow-lg">
                  <h2 className="mb-2 border-b pb-2 text-lg font-semibold">Photos</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Filter posts with images and display them */}
                    {posts.filter(post => post.postImage).length > 0 ? (
                      posts
                        .filter(post => post.postImage) // Filter posts that contain images
                        .slice(0, 6) // Limit to 6 images for display
                        .map((post, i) => (
                          <Image
                            key={i}
                            src={post.postImage as string} // Render the post image
                            alt={`Photo ${i}`}
                            width={50}
                            height={50}
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ))
                    ) : (
                      <p>No photos available.</p>
                    )}
                  </div>
                </div>

                {/* Videos Section */}
                <div className="mb-4 rounded-xl bg-white p-4 shadow-lg">
                  <h2 className="mb-2 border-b pb-2 text-lg font-semibold">Videos</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {Array(3)
                      .fill(1)
                      .map((_, i) => (
                        <Image
                          key={i}
                          src={communityImage2.toString()}
                          alt={`Video ${i}`}
                          width={50}
                          height={50}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </Navbar>
      </div>
    </div>
  );
}
