'use client';

import Navbar from '@/comm/Navbar';
import communityImage3 from '@/public/images/home/car.jpg';
import communityImage2 from '@/public/images/home/computer.webp';
import communityImage1 from '@/public/images/home/hands.webp';
import { Avatar, AvatarGroup, Button } from '@nextui-org/react';
import { CircleEllipsis, Smile, UsersRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileData, UserData, SocialPosts } from '@/types/global';
import { useEffect, useState } from 'react';
import { auth, db } from '@/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { loginRedirect } from '@/helpers/Auth';
import { useRouter } from 'next/navigation';
import ProfilePosts from '@/components/profile/profilePosts';
import PostForm from '@/components/home/posts/PostForm'; 

const communitiesData = [
  { imageUrl: communityImage1, name: 'Community 1' },
  { imageUrl: communityImage2, name: 'Community 2' },
  { imageUrl: communityImage3, name: 'Community 3' },
];

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<SocialPosts[]>([]); // State for posts
  const [loading, setLoading] = useState(true);
  const [togglePostForm, setTogglePostForm] = useState<boolean>(false);
  const [socialPosts, setSocialPosts] = useState<SocialPosts[]>([]); // For new posts
   // New state for filtering
   const [selectedFilter, setSelectedFilter] = useState<string>('all'); // Default is 'all'


  useEffect(() => {
    loginRedirect(router, true)
      .then(() => setLoading(false))
      .catch((error) => {
        console.error('Error during login redirect:', error);
        setLoading(false);
      });
  
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
  
        const profileRef = doc(db, 'profiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);
  
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        console.log(userSnap.data())
  
        if (profileSnap.exists() && userSnap.exists()) {
          setProfile(profileSnap.data() as ProfileData);
          setUserData(userSnap.data() as UserData);
          console.log(profileSnap.data())
        } else {
          console.log('No profile or user data found');
        }
  
        // Fetch posts
        const fetchPosts = async () => {
          try {
            const getPosts = await getDocs(collection(db, 'posts'));
            const postsData = getPosts.docs.map((doc) => doc.data() as SocialPosts);
            
            // Filter posts by the current user
            const userPosts = postsData.filter(post => post.email === currentUser.email).reverse();;
            setPosts(userPosts);
            console.log(postsData[0])
          } catch (error) {
            console.error('Error fetching posts:', error);
          }
        };
        fetchPosts();
      } else {
        setUser(null);
        setProfile(null);
        setUserData(null);
        setPosts([]);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  

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
    // if (selectedFilter === 'likes') return post.likes && post.likes > 0; // Filter liked posts

    return true;
  });

  return (
    <Navbar>
      {/* Overlay for post form */}
      {togglePostForm && (
        <>
          <div className="fixed top-0 z-40 h-full w-full bg-black opacity-50"></div>
          {/* PostForm Component */}
          <PostForm 
          setSocialPosts={setSocialPosts}
					setTogglePostForm={setTogglePostForm} />
        </>
      )}

      <div className="flex h-full min-h-screen w-full flex-col overflow-y-auto bg-gray-200 pl-1 pt-3 text-gray-800">
        {/* Profile Information Section */}
        <section className="mb-4 w-full rounded-xl bg-white p-4 shadow-lg flex flex-col md:flex-row">
          <div className="h-24 w-24 overflow-hidden rounded-full mx-auto md:mx-0">
            <Avatar
              src={profile.profilePicture as string} // Use profile data for image
              alt="Profile picture"
              className="h-full w-full object-cover"
            />
            
          </div>
          <div className="ml-4 text-center md:text-left mt-4 md:mt-0">
            <p className="text-xl font-semibold">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-gray-600">@{userData.userName}</p> {/* Display username as @username */}
            <div className="mt-2 flex flex-col gap-4 md:flex-row">
              <Button className="border-gradient-to-r rounded-lg from-green-400 to-teal-400 px-4 py-2 text-black">
                <Link href="/settings/general">Edit</Link>
              </Button>
              <Button className="rounded-lg bg-gradient-to-r from-green-400 to-teal-400 px-4 py-2 text-white">
                Activities
              </Button>
            </div>
            <div className="mt-2 flex justify-center gap-6 md:justify-start text-sm text-gray-600">
              <p>11 Following</p>
              <p>{posts.length} Posts</p>
              <p>6 Followers</p>
            </div>
          </div>
        </section>

        {/* Navigation Section */}
        <nav className="mb-4 border-b border-gray-300">
          <ul className="flex justify-between md:justify-start gap-4 p-2 text-sm md:text-base">
            <li 
              className={`cursor-pointer ${selectedFilter === 'all' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
              onClick={() => setSelectedFilter('all')}>
              Timeline
            </li>
            <li 
              className={`cursor-pointer ${selectedFilter === 'communities' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
              onClick={() => setSelectedFilter('communities')}>
              Communities
            </li>
            <li 
              className={`cursor-pointer ${selectedFilter === 'likes' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
              onClick={() => setSelectedFilter('likes')}>
              Likes
            </li>
            <li 
              className={`cursor-pointer ${selectedFilter === 'following' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
              onClick={() => setSelectedFilter('following')}>
              Following
            </li>
            <li 
              className={`cursor-pointer ${selectedFilter === 'photos' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
              onClick={() => setSelectedFilter('photos')}>
              Photos
            </li>
            <li 
              className={`cursor-pointer ${selectedFilter === 'followers' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
              onClick={() => setSelectedFilter('followers')}>
              Followers
            </li>
            <li 
              className={`cursor-pointer ${selectedFilter === 'videos' ? 'font-bold border-b-2 border-green-400' : 'text-gray-600'}`}
              onClick={() => setSelectedFilter('videos')}>
              Videos
            </li>
          </ul>
        </nav>
        {/* Posts Section */}

        <section className="flex flex-col md:flex-row flex-grow gap-4 overflow-y-auto">
          {/* Timeline Posts Section */}
          <div className="w-full overflow-y-auto p-2 md:w-2/3">
            {/* New Post Section */}
            <div
              className="mb-4 rounded-xl bg-white p-4 shadow-lg cursor-pointer"
              onClick={() => setTogglePostForm(true)}
            >
              <div className="flex flex-col md:flex-row justify-around rounded-xl p-5">
                <div className="h-10 w-10 overflow-hidden rounded-full">
                  <Avatar src={profile.profilePicture as string} alt="Avatar" className="h-full w-full object-cover" />
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

            {/* Dynamically Render Posts */}
            <ProfilePosts socialPosts={filteredPosts} selectedPost={selectedFilter} />
            </div>

          {/* Sidebar Section */}
          <div className="w-full overflow-y-auto p-2 md:w-1/3">
            {/* About Section */}
            <div className="mb-4 rounded-xl bg-white p-4 shadow-lg">
              <h2 className="mb-2 border-b pb-2 text-lg font-semibold">About</h2>
              <p>{profile.aboutMe ? profile.aboutMe : 'This user has not updated their bio'}</p>
            </div>

            {/* Communities Section */}
            <div className="mb-4 rounded-xl bg-white p-4 shadow-lg">
              <div className="mb-2 flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-semibold">Communities</h2>
                <a className="cursor-pointer text-blue-500">View all</a>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {communitiesData.map((community, index) => (
                  <div className="relative h-24 w-24 cursor-pointer" key={index}>
                    <Image
                      src={community.imageUrl}
                      alt={community.name}
                      layout="fill"
                      className="rounded-lg object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Likes Section */}
            <div className="mb-4 rounded-xl bg-white p-4 shadow-lg">
              <h2 className="mb-2 border-b pb-2 text-lg font-semibold">Likes</h2>
              <div className="flex items-center gap-2">
                <UsersRound className="h-6 w-6 text-green-500" />
                <p className="text-base">12.4k Likes</p>
              </div>
            </div>

            {/* Photos Section */}
            <div className="mb-4 rounded-xl bg-white p-4 shadow-lg">
              <h2 className="mb-2 border-b pb-2 text-lg font-semibold">Photos</h2>
              <div className="grid grid-cols-3 gap-2">
                {Array(6)
                  .fill(1)
                  .map((_, i) => (
                    <Image
                      key={i}
                      src={communityImage1}
                      alt={`Photo ${i}`}
                      layout="responsive"
                      width={50}
                      height={50}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ))}
              </div>
            </div>

            {/* Followers Section */}
            <div className="mb-4 rounded-xl bg-white p-4 shadow-lg">
              <h2 className="mb-2 border-b pb-2 text-lg font-semibold">Followers</h2>
              <AvatarGroup size="md">
                <Avatar src={communityImage2.src} />
                <Avatar src={communityImage1.src} />
                <Avatar src={communityImage3.src} />
              </AvatarGroup>
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
                      src={communityImage2}
                      alt={`Video ${i}`}
                      layout="responsive"
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
  );
}