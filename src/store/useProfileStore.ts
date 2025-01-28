import { create } from 'zustand';
import { ProfileImage } from '@/types/userTypes';

type ProfileStore = {
  profileImage: ProfileImage | null;
  coverImage: ProfileImage | null;
  postProfileImage: ProfileImage | null;
  jobProfileImage: ProfileImage | null;
  userImages: ProfileImage[];
  // Add user data
  userName: string | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  
  
  // Existing setters
  setProfileImage: (profileImage: ProfileImage) => void;
  setCoverImage: (coverImage: ProfileImage) => void;
  setPostProfileImage: (postProfileImage: ProfileImage) => void;
  setJobProfileImage: (jobProfileImage: ProfileImage) => void;
  setUserImages: (userImages: ProfileImage[]) => void;
  // Add new setters
  setUserName: (userName: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setCountry: (country: string) => void;
};

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
  // New setters
  setUserName: (userName) => set({ userName }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setCountry: (country) => set({ country }),
}));
