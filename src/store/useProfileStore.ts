import { create } from 'zustand';
import { ProfileImage } from '@/types/userTypes';

type ProfileStore = {
  profileImage: ProfileImage | null;
  setProfileImage: (profileImage: ProfileImage) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profileImage: null,
  setProfileImage: (profileImage) => set({ profileImage }),
}));
