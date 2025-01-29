import { create } from 'zustand';
import { ProfileImage } from '@/types/userTypes';
import { FollowerWithDetails, FriendWithDetails } from '@/types/friendTypes';

type ProfileStore = {
    // State (data storage)
  profileImage: ProfileImage | null;
  coverImage: ProfileImage | null;
  postProfileImage: ProfileImage | null;
  jobProfileImage: ProfileImage | null;
  userImages: ProfileImage[];
  userName: string | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  
  
  // Actions (ways to update the data)
  setProfileImage: (profileImage: ProfileImage) => void;
  setCoverImage: (coverImage: ProfileImage) => void;
  setPostProfileImage: (postProfileImage: ProfileImage) => void;
  setJobProfileImage: (jobProfileImage: ProfileImage) => void;
  setUserImages: (userImages: ProfileImage[]) => void;
  setUserName: (userName: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setCountry: (country: string) => void;
};


type FriendsStore = {
  friends: FriendWithDetails[];
  followers: FollowerWithDetails[];
  following: FollowerWithDetails[];
  loading: boolean;
  setFriends: (friends: FriendWithDetails[]) => void;
  setFollowers: (followers: FollowerWithDetails[]) => void;
  setFollowing: (following: FollowerWithDetails[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profileImage: null,
  coverImage: null,
  postProfileImage: null,
  jobProfileImage: null,
  userImages: [],
  userName: null,
  firstName: null,
  lastName: null,
  country: null,
  
  // Existing setters
  setProfileImage: (profileImage) => set({ profileImage }),
  setCoverImage: (coverImage) => set({ coverImage }),
  setPostProfileImage: (postProfileImage) => set({ postProfileImage }),
  setJobProfileImage: (jobProfileImage) => set({ jobProfileImage }),
  setUserImages: (userImages) => set({ userImages }),
  setUserName: (userName) => set({ userName }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setCountry: (country) => set({ country }),
}));


export const useFriendsStore = create<FriendsStore>((set) => ({
  friends: [],
  followers: [],
  following: [],
  loading: true,
  setFriends: (friends) => set({ friends }),
  setFollowers: (followers) => set({ followers }),
  setFollowing: (following) => set({ following }),
  setLoading: (loading) => set({ loading }),
}));