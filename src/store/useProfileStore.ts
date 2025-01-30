import { create } from 'zustand';
import { ProfileImage } from '@/types/userTypes';

interface Notification {
  id: string;
  type: 'friendRequest' | 'postTag' | 'comment' | 'like' | 'share' | 'message' | 'groupInvite';
  fromUserId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  metadata?: any;
}

type ProfileStore = {
  // Existing states
  profileImage: ProfileImage | null;
  coverImage: ProfileImage | null;
  postProfileImage: ProfileImage | null;
  jobProfileImage: ProfileImage | null;
  userImages: ProfileImage[];
  userName: string | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;

  // New notification states
  notifications: Notification[];
  unreadCount: number;
  lastCheckedAt: Date | null;

  // new count state
  friendsCount: number;
  postsCount: number;

  // Existing setters
  setProfileImage: (profileImage: ProfileImage) => void;
  setCoverImage: (coverImage: ProfileImage) => void;
  setPostProfileImage: (postProfileImage: ProfileImage) => void;
  setJobProfileImage: (jobProfileImage: ProfileImage) => void;
  setUserImages: (userImages: ProfileImage[]) => void;
  setUserName: (userName: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setCountry: (country: string) => void;

  // New notification setters
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  updateLastChecked: () => void;

  // new count setters
  setFriendsCount: (count: number) => void;
  setPostsCount: (count: number) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  // Existing state values
  profileImage: null,
  coverImage: null,
  postProfileImage: null,
  jobProfileImage: null,
  userImages: [],
  userName: null,
  firstName: null,
  lastName: null,
  country: null,

  // New notification state values
  notifications: [],
  unreadCount: 0,
  lastCheckedAt: null,

  // New count state values
  friendsCount: 0,
  postsCount: 0,


  // Existing setters remain the same
  setProfileImage: (profileImage) => set({ profileImage }),
  setCoverImage: (coverImage) => set({ coverImage }),
  setPostProfileImage: (postProfileImage) => set({ postProfileImage }),
  setJobProfileImage: (jobProfileImage) => set({ jobProfileImage }),
  setUserImages: (userImages) => set({ userImages }),
  setUserName: (userName) => set({ userName }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setCountry: (country) => set({ country }),

  // New notification setters
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

    // New count setters
    setFriendsCount: (count) => set({ friendsCount: count }),
    setPostsCount: (count) => set({ postsCount: count })
  
}));


