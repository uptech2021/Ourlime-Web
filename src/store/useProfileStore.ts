// src/store/useProfileStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProfileImage } from '@/types/userTypes';
import { NotificationData } from '@/helpers/notificationHelper';

type ProfileStore = {
  profileImage: ProfileImage | null;
  coverImage: ProfileImage | null;
  postProfileImage: ProfileImage | null;
  jobProfileImage: ProfileImage | null;
  userImages: ProfileImage[];
  userName: string | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  notifications: NotificationData[];
  unreadCount: number;
  lastCheckedAt: Date | null;
  friendsCount: number;
  postsCount: number;

  setUserData: (data: {
    firstName: string | null;
    lastName: string | null;
    userName: string | null;
    country: string | null;
    friendsCount: number;
    postsCount: number;
  }) => void;

  setProfileImage: (profileImage: ProfileImage) => void;
  setCoverImage: (coverImage: ProfileImage) => void;
  setPostProfileImage: (postProfileImage: ProfileImage) => void;
  setJobProfileImage: (jobProfileImage: ProfileImage) => void;
  setUserImages: (userImages: ProfileImage[]) => void;
  setUserName: (userName: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setCountry: (country: string) => void;
  setNotifications: (notifications: NotificationData[]) => void;
  addNotification: (notification: NotificationData) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  updateLastChecked: () => void;
  setFriendsCount: (count: number) => void;
  setPostsCount: (count: number) => void;
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profileImage: null,
      coverImage: null,
      postProfileImage: null,
      jobProfileImage: null,
      userImages: [],
      userName: null,
      firstName: null,
      lastName: null,
      country: null,
      notifications: [],
      unreadCount: 0,
      lastCheckedAt: null,
      friendsCount: 0,
      postsCount: 0,

      setUserData: (data) => {
        set({
          firstName: data.firstName,
          lastName: data.lastName,
          userName: data.userName,
          country: data.country,
          friendsCount: data.friendsCount,
          postsCount: data.postsCount
        });
      },

      setProfileImage: (profileImage) => {
        set({ profileImage });
      },

      setCoverImage: (coverImage) => set({ coverImage }),
      setPostProfileImage: (postProfileImage) => set({ postProfileImage }),
      setJobProfileImage: (jobProfileImage) => set({ jobProfileImage }),
      setUserImages: (userImages) => set({ userImages }),
      setUserName: (userName) => set({ userName }),
      setFirstName: (firstName) => set({ firstName }),
      setLastName: (lastName) => set({ lastName }),
      setCountry: (country) => set({ country }),

      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter(n => !n.isRead).length
        }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + (notification.isRead ? 0 : 1)
        })),

      markAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          ),
          unreadCount: state.unreadCount - 1
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0
        })),

      removeNotification: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== notificationId),
          unreadCount: state.unreadCount - (state.notifications.find(n => n.id === notificationId)?.isRead ? 0 : 1)
        })),

      updateLastChecked: () =>
        set({ lastCheckedAt: new Date() }),

      setFriendsCount: (count) => set({ friendsCount: count }),
      setPostsCount: (count) => set({ postsCount: count })
    }),
    {
      name: 'profile-storage',
      partialize: (state) => {
        return {
          profileImage: state.profileImage,
          userName: state.userName,
          firstName: state.firstName,
          lastName: state.lastName,
          country: state.country,
          friendsCount: state.friendsCount,
          postsCount: state.postsCount
        };
      }
    }
  )
);
