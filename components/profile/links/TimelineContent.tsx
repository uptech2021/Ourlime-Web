'use client';

import { UserData, ProfileImage } from '@/types/userTypes';
import PostCard from '@/components/home/PostCard';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

type TimelineContentProps = {
  userData: UserData;
  profileImage: ProfileImage;
}


export default function TimelineContent({ userData, profileImage }: TimelineContentProps) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Current user ID:', user.uid);
        try {
          const postsRef = collection(db, 'feedPosts');
          const q = query(
            postsRef, 
            where('userId', '==', user.uid)
          );
          
          const snapshot = await getDocs(q);
          const postsWithUserData = await Promise.all(
            snapshot.docs.map(async (postDoc) => {
              const postData = postDoc.data();
  
              // Fetch media for this post
              const mediaQuery = query(
                collection(db, 'feedsPostSummary'),
                where('feedsPostId', '==', postDoc.id)
              );
              const mediaSnapshot = await getDocs(mediaQuery);
              const media = mediaSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
  
              return {
                id: postDoc.id,
                caption: postData.caption,
                description: postData.description,
                visibility: postData.visibility,
                createdAt: postData.createdAt,
                userId: postData.userId,
                hashtags: postData.hashtags || [],
                media,
                user: {
                  ...userData,
                  profileImage: profileImage?.imageURL,
                },
              };
            })
          );
  
          console.log('Posts with user data:', postsWithUserData);
          setPosts(postsWithUserData);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
    });
  
    return () => unsubscribe();
  }, [userData, profileImage]);
  

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No posts found
        </div>
      )}
    </div>
  );
}
