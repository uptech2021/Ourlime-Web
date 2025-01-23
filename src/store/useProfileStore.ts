import { create } from 'zustand';
import { ProfileImage } from '@/types/userTypes';

type ProfileStore = {
  profileImage: ProfileImage | null;
  coverImage: ProfileImage | null;
  postProfileImage: ProfileImage | null;
  setProfileImage: (profileImage: ProfileImage) => void;
  setCoverImage: (coverImage: ProfileImage) => void;
  setPostProfileImage: (postProfileImage: ProfileImage) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profileImage: null,
  coverImage: null,
  postProfileImage: null,
  setProfileImage: (profileImage) => set({ profileImage }),
  setCoverImage: (coverImage) => set({ coverImage }),
  setPostProfileImage: (postProfileImage) => set({ postProfileImage }),
}));
