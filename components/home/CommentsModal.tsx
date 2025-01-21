import React, { useEffect, useState } from "react";
import { addDoc, serverTimestamp, collection, getDoc, query, getDocs, where, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Comment, Post } from '@/types/global';
import { fetchCommentsForPost, fetchPosts } from '@/helpers/Posts';
import { UserData, ProfileImage } from "@/types/userTypes";
import Image from "next/image";


interface CommentModalProps {
  postId: string;
  userId: string;
  // profilePicture: string;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ postId, userId, onClose }) => {
  const [comment, setComment] = useState("");

  // Static data for post details and comments

  const staticComments = [
    {
      id: 1,
      user: "Jane Doe",
      username: "@janedoe",
      text: "This event sounds amazing!",
      avatar: "https://via.placeholder.com/40",
      timestamp: "2h ago",
      replies: [
        {
          id: 11,
          user: "John Smith",
          username: "@johnsmith",
          text: "I agree with you!",
          avatar: "https://via.placeholder.com/40",
          timestamp: "1h ago",
        },
        {
          id: 12,
          user: "Emily Johnson",
          username: "@emilyj",
          text: "Looking forward to it as well!",
          avatar: "https://via.placeholder.com/40",
          timestamp: "30m ago",
        },
      ],
    },
    {
      id: 2,
      user: "John Smith",
      username: "@johnsmith",
      text: "Can't wait to attend!",
      avatar: "https://via.placeholder.com/40",
      timestamp: "3h ago",
      replies: [],
    },
  ];

  const [postDetails, setPostDetails] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
	const [isLoadingComments, setIsLoadingComments] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<ProfileImage | null>(null);
	const [commentUserData, setCommentUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    const loadPostDetails = async () => {
      console.log("Fetching post with ID: ", postId);
      const fetchedPosts = await fetchPosts(); // Fetch all posts
      const specificPost = fetchedPosts.find(post => post.id === postId); // Find the specific post by ID
      setPostDetails(specificPost || null); // Set the specific post or null if not found
      setIsLoading(false);
    };

    console.log("post details: ",postDetails);

    loadPostDetails();
}, [postId, postDetails]);

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
      } catch (e) {
        console.error("Error adding comment:", e);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-4xl mx-4 rounded-lg shadow-lg flex flex-col md:flex-row">
        {/* Post Rectangle */}
        <div className="bg-gray-200 md:w-1/2 w-full h-48 md:h-auto flex items-center justify-center">
          <div className="w-full h-full bg-gray-300"></div>
        </div>

        {/* Comments Section */}
        <div className="md:w-1/2 w-full flex flex-col">
          {/* Top Section: Post Details */}
          {postDetails ? (
                        <div>
                            {postDetails.user ? ( // Check if user exists
                                <p className="text-sm font-medium">
                                    {postDetails.user.firstName} {postDetails.user.lastName} <span className="text-gray-400">@{postDetails.user.userName}</span>
                                </p>
                            ) : (
                                <p>User information not available.</p> // Fallback message
                            )}
                            <p className="text-gray-600 text-sm mt-2">{postDetails.caption}</p>
                        </div>
                    ) : (
                        <p>Post details not available.</p> // Fallback message
                    )}
         <button className="ml-auto" aria-label="Close modal" onClick={onClose}>X</button>

          
          {/* Scrollable Comments */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {comments.map((c) => (
              <div key={c.id}>
                {/* Parent Comment */}
                <div className="flex items-start space-x-3">
                  <Image
                    src={c.userData?.profileImage}
                    alt={`${c}'s avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.userData?.firstName} {c.userData?.lastName} <span className="text-gray-400">@{c.userData?.userName}</span></p>
                    <p className="text-gray-600 text-sm">{c.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">{}</p>
                  </div>
                </div>
                {/* Replies */}
                <div className="pl-12 mt-2 space-y-2">
                  {/* {c.replies.map((r) => (
                    <div key={r.id} className="flex items-start space-x-3">
                      <img
                        src={r.avatar}
                        alt={`${r.user}'s avatar`}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {r.user} <span className="text-gray-400">{r.username}</span>
                        </p>
                        <p className="text-gray-600 text-sm">{r.text}</p>
                        <p className="text-xs text-gray-400">{r.timestamp}</p>
                      </div>
                    </div>
                  ))} */}
                </div>
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
