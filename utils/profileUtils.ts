import { collection, getDocs, doc, getDoc, query, where, documentId, updateDoc } from 'firebase/firestore';
import { User, updateProfile } from 'firebase/auth';
import { db } from '@/config/firebase';
import { ProfileData, UserData, SocialPosts, Communities, Follower, Following } from '@/types/global';

/**
 * Fetches user data from the Firestore database.
 * @param {User} currentUser - The user to fetch data for.
 * @returns {Promise<{ profileData: ProfileData; userData: UserData } | null>} - A promise that resolves to the user's profile
 * data and user data, or null if the user does not exist.
 */
export const fetchUserData = async (currentUser: User): Promise<{ profileData: ProfileData; userData: UserData } | null> => {
  const profileRef = doc(db, 'profiles', currentUser.uid);
  const profileSnap = await getDoc(profileRef);

  const userRef = doc(db, 'users', currentUser.uid);
  const userSnap = await getDoc(userRef);

  if (profileSnap.exists() && userSnap.exists()) {
    const profileData = profileSnap.data() as ProfileData;
    const userData = userSnap.data() as UserData;

    if (userData.photoURL && userData.photoURL !== currentUser.photoURL) {
      // Update the user's photo if it has changed
      await updateProfile(currentUser, { photoURL: userData.photoURL });
    }

    return { profileData, userData };
  }

  return null;
};

/**
 * Fetches all posts from the Firestore database and filters them by the given user's email.
 * @param {string} userEmail - The email of the user to fetch posts for.
 * @returns {Promise<SocialPosts[]>} - A promise that resolves to the user's posts.
 */
export const fetchUserPosts = async (userEmail: string): Promise<SocialPosts[]> => {
  const getPosts = await getDocs(collection(db, 'posts'));
  const postsData = getPosts.docs.map((doc) => doc.data() as SocialPosts);
  return postsData
    .filter((post) => post.email === userEmail)
    .sort((a, b) => b.time - a.time);
};

/**
 * Fetches the communities that the given user is a member of.
 * @param {string} userId - The id of the user to fetch communities for.
 * @returns {Promise<Communities[]>} - A promise that resolves to the user's communities.
 */
export const fetchUserCommunities = async (userId: string): Promise<Communities[]> => {
  const communitiesCollection = collection(db, 'communities');
  const communitySnapshot = await getDocs(communitiesCollection);
  const communitiesData = communitySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Communities));

  return communitiesData.filter((community) =>
    community.members && community.members.includes(userId)
  );
};

/**
 * Fetches the followers and people the given user is following.
 * @param {User} currentUser - The user to fetch followers and following for.
 * @returns {Promise<{ followers: Follower[]; following: Following[] }>} - A promise that resolves to the user's followers and
 * following.
 */
export const fetchFollowersAndFollowing = async (currentUser: User): Promise<{ followers: Follower[]; following: Following[] }> => {
  const followersSnapshot = await getDocs(query(collection(db, 'followers'), where('followedId', '==', currentUser.uid)));
  const followerIds = followersSnapshot.docs.map(doc => doc.data().followerId);

  const followingSnapshot = await getDocs(query(collection(db, 'following'), where('followerId', '==', currentUser.uid)));
  const followingIds = followingSnapshot.docs.map(doc => doc.data().followedId);

  const userIds = Array.from(new Set([...followerIds, ...followingIds]));
  
  let usersData: { [key: string]: any } = {};
  if (userIds.length > 0) {
    const usersSnapshot = await getDocs(query(collection(db, 'users'), where(documentId(), 'in', userIds)));
    usersData = usersSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {} as { [key: string]: any });
  }

  const followers: Follower[] = followerIds.map(id => ({
    uid: id,
    username: usersData[id]?.userName,
    profilePicture: usersData[id]?.profilePicture,
    email: usersData[id]?.email
  }));

  const following: Following[] = followingIds.map(id => ({
    uid: id,
    username: usersData[id]?.userName,
    profilePicture: usersData[id]?.profilePicture,
    email: usersData[id]?.email
  }));

  return { followers, following };
};

/**
 * Updates the user's profile data in the Firestore database.
 * @param {User} currentUser - The user to update the profile for.
 * @param {Partial<ProfileData & { photoURL?: string }>} updatedData - The new profile data to update with.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
export const updateUserProfile = async (currentUser: User, updatedData: Partial<ProfileData & { photoURL?: string }>): Promise<void> => {
  const profileRef = doc(db, 'profiles', currentUser.uid);
  await updateDoc(profileRef, updatedData);

  if (updatedData.photoURL) {
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      photoURL: updatedData.photoURL,
    });
    await updateProfile(currentUser, { photoURL: updatedData.photoURL });
  }
};
