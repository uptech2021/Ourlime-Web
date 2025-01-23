import React, { useEffect, useState } from "react";
import { addDoc, serverTimestamp, collection, getDoc, query, getDocs, where, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Comment, Post, Reply } from '@/types/global';
import { fetchCommentsForPost, fetchPosts } from '@/helpers/Posts';
import { UserData, ProfileImage } from "@/types/userTypes";
import { MessageCircle } from "lucide-react";
import Image from "next/image";


interface CommentModalProps {
  postId: string;
  userId: string;
  // profilePicture: string;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ postId, userId, onClose }) => {
  const [comment, setComment] = useState("");
  const [reply, setReply] = useState("");

  // Static data for post details and comments

 
  const [postDetails, setPostDetails] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
	const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    const loadPostDetails = async () => {
      try {
        const fetchedPosts = await fetchPosts(); // Fetch all posts
        const specificPost = fetchedPosts.find(post => post.id === postId); // Find the specific post by ID
        console.log("Fetched Posts: ", specificPost);
        setPostDetails(specificPost || null); // Set the specific post or null if not found
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadPostDetails();
  }, [postId]);

		useEffect(() => {
			const fetchComments = async () => {
				if (!postId || hasFetched) return;
				setIsLoadingComments(true);

				try {
					const fetchedComments = await fetchCommentsForPost(postId);
					setComments(fetchedComments);
					setHasFetched(true);
				} catch (error) {
					console.error('Error fetching comments:', error);
				} finally {
					setIsLoadingComments(false);
				}
        
			};
      console.log("Comments: ", comments);
			fetchComments();
		}, [postId, hasFetched, comments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      const commentData = {
        comment,
        createdAt: serverTimestamp(),
        feedsPostId: postId,
        userId,
      };

      console.log("Submitting comment with userId:", userId);

      try {
        await addDoc(collection(db, "feedsPostComments"), commentData);
        setComment(""); // Clear the input field after submission

        //Refetch comments after creating a new comment
        const fetchedComments = await fetchCommentsForPost(postId);
        setComments(fetchedComments);

      } catch (e) {
        console.error("Error adding comment:", e);
      }
    }
  };
  
  const handleReply = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if(reply.trim()){
      const replyData = {
        reply,
        feedsPostCommentId: commentId,
        userId,
        createdAt: serverTimestamp(),
      };

      try{
        await addDoc(collection(db, "feedsPostCommentsReplies"), replyData);
        setReply("");

        const fetchedComments = await fetchCommentsForPost(postId);
        setComments(fetchedComments);
      }catch (error){
        console.error("Error adding reply: ", error);
      }
    }
  }

  const PostMedia = ({ media }) => {
    const [activeIndex, setActiveIndex] = useState(0);
  
    if (!media || media.length === 0) {
      return <p>No media available.</p>;
    }
  
    return (
      <div className="relative h-[400px] w-full mb-4 flex flex-col items-center">
        {/* Main Media */}
        <div className="relative h-[400px] w-full flex items-center justify-center bg-gray-100">
          {media[activeIndex].type === 'image' ? (
            <Image
              src={media[activeIndex].typeUrl}
              alt="Post content"
              width={400}
              height={400}
              className="object-cover rounded-lg"
            />
          ) : (
            <video
              controls
              className="rounded-lg"
              style={{ maxHeight: '400px', maxWidth: '100%' }}
            >
              <source src={media[activeIndex].typeUrl} type="video/mp4" />
            </video>
          )}
        </div>
  
        {/* Thumbnails */}
        <div className="absolute bottom-4 left-0 right-0 flex gap-4 px-4 overflow-x-auto">
          {media.map((item, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative w-20 h-20 rounded-lg cursor-pointer transition-all ${
                activeIndex === index ? 'opacity-100 ring-2 ring-green-500' : 'opacity-50'
              }`}
            >
              {item.type === 'image' ? (
                <Image
                  src={item.typeUrl}
                  alt={`Preview ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover rounded-lg"
                />
              ) : (
                <video className="object-cover rounded-lg" style={{ width: '100%', height: '100%' }}>
                  <source src={item.typeUrl} type="video/mp4" />
                </video>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  
  
  
  


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div className="bg-white w-full max-w-4xl mx-4 rounded-lg shadow-lg flex flex-col md:flex-row relative">
    {/* Close Button */}
    <button className="absolute top-2 right-2" aria-label="Close modal" onClick={onClose}>
      X
    </button>

    {/* Post Rectangle */}
    {postDetails && postDetails.media && postDetails.media.length > 0 && (
      <div className="md:w-1/2 w-full h-auto flex items-center justify-center">
        <PostMedia media={postDetails.media} />
      </div>
    )}

    {/* Comments Section */}
    <div
      className={`${
        postDetails && postDetails.media && postDetails.media.length > 0
          ? 'md:w-1/2' // Half-width when media is present
          : 'w-full'   // Full-width when no media
      } w-full flex flex-col`}
    >
      {/* Top Section: Post Details */}
      {postDetails ? (
        <div>
          {postDetails.user ? (
            <p className="text-sm font-medium">
              {postDetails.user.firstName} {postDetails.user.lastName}{' '}
              <span className="text-gray-400">@{postDetails.user.userName}</span>
            </p>
          ) : (
            <p>User information not available.</p>
          )}
          <p className="text-gray-600 text-sm mt-2">{postDetails.caption}</p>
        </div>
      ) : (
        <p>Post details not available.</p>
      )}

      {/* Scrollable Comments */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {comments.map((c) => (
          <div key={c.id}>
            <div className="flex items-start space-x-3">
              <img
                src={c.userData?.profileImage}
                alt={`${c}'s avatar`}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {c.userData?.firstName} {c.userData?.lastName}{' '}
                  <span className="text-gray-400">@{c.userData?.userName}</span>
                </p>
                <p className="text-gray-600 text-sm">{c.comment}</p>
              </div>
                <button 
                className="flex items-center gap-2 text-gray-600 hover:text-greenTheme" 
                onClick={() => setReplyingTo(c.id === replyingTo ? null: c.id)}>
                  <MessageCircle/>
                  <span>Reply</span>
                </button>
            </div>
            {replyingTo === c.id && (
          <form onSubmit={(e)=> handleReply(e, c.id)} className="flex items-center space-x-2 mt-20">
            <textarea 
              className="flex-1 border rounded-md p-2 text-sm resize-none"
              placeholder="Write youre reply..."
              value={reply}
              onChange={(e)=> setReply(e.target.value)}
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounder-md">
                Send Reply
              </button>
          </form>
        )}

          </div>
        ))}
      </div>

      {/* Comment Input Box */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <textarea
            className="flex-1 border rounded-md p-2 text-sm resize-none"
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

  );
};

export default CommentModal;
