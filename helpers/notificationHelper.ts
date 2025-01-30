import { db } from '@/lib/firebaseConfig';
import { collection, query, where, getDocs, orderBy, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { UserData } from '@/types/userTypes';

export type NotificationType = 
  | 'friendRequest' 
  | 'postTag' 
  | 'comment' 
  | 'like' 
  | 'share' 
  | 'message' 
  | 'groupInvite';

interface BaseNotification {
  id: string;
  type: NotificationType;
  fromUserId: string;
  toUserId: string;
  createdAt: Timestamp;
  isRead: boolean;
  userDetails?: UserData;
}

interface FriendRequestNotification extends BaseNotification {
  type: 'friendRequest';
  status: 'pending' | 'accepted' | 'declined';
  friendshipId: string;
}

interface PostNotification extends BaseNotification {
  type: 'postTag' | 'comment' | 'like' | 'share';
  postId: string;
  postContent: string;
  commentId?: string;
}

interface MessageNotification extends BaseNotification {
  type: 'message';
  messageId: string;
  messagePreview: string;
}

interface GroupInviteNotification extends BaseNotification {
  type: 'groupInvite';
  groupId: string;
  groupName: string;
}

export type NotificationData = 
  | FriendRequestNotification 
  | PostNotification 
  | MessageNotification 
  | GroupInviteNotification;

// Get all notifications for a user
export const getNotifications = async (userId: string): Promise<NotificationData[]> => {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('toUserId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(notificationsQuery);
    
    const notifications = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const notificationData = { 
          id: doc.id, 
          ...doc.data() 
        } as NotificationData;
        
        // Get sender user details
        const userDoc = await getDocs(query(
          collection(db, 'users'), 
          where('uid', '==', notificationData.fromUserId)
        ));
        
        return {
          ...notificationData,
          userDetails: userDoc.docs[0]?.data() as UserData
        };
      })
    );

    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

// Get unread notification count
export const getUnreadCount = async (userId: string): Promise<number> => {
  try {
    const unreadQuery = query(
      collection(db, 'notifications'),
      where('toUserId', '==', userId),
      where('isRead', '==', false)
    );
    
    const snapshot = await getDocs(unreadQuery);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

// Create a new notification
export const createNotification = async (notification: Omit<NotificationData, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      createdAt: Timestamp.now(),
      isRead: false
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Mark notification as read
export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      isRead: true,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllAsRead = async (userId: string): Promise<void> => {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('toUserId', '==', userId),
      where('isRead', '==', false)
    );
    
    const snapshot = await getDocs(notificationsQuery);
    
    const updatePromises = snapshot.docs.map(doc => 
      updateDoc(doc.ref, {
        isRead: true,
        updatedAt: Timestamp.now()
      })
    );
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Delete all notifications for a user
export const deleteAllNotifications = async (userId: string): Promise<void> => {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('toUserId', '==', userId)
    );
    
    const snapshot = await getDocs(notificationsQuery);
    
    const deletePromises = snapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    throw error;
  }
};
