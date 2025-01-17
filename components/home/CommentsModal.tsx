import React, { useState } from "react";
import { addDoc, serverTimestamp, collection } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface CommentModalProps {
  postId: string;
  userId: string;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ postId, userId, onClose }) => {
  const [comment, setComment] = useState("");

  // Static data for post details and comments
  const postDetails = {
    username: "@janedoe",
    user: "Jane Doe",
    caption: "Excited about this amazing event happening soon! #Culture #Creativity",
  };

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
      text: "Can’t wait to attend!",
      avatar: "https://via.placeholder.com/40",
      timestamp: "3h ago",
      replies: [],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      const commentData = {
        comments: comment,
        createdAt: serverTimestamp(),
        feedsPostId: postId,
        userId: userId,
      };

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
          <div className="p-4 border-b">
            <p className="text-sm font-medium">
              {postDetails.user} <span className="text-gray-400">{postDetails.username}</span>
            </p>
            <p className="text-gray-600 text-sm mt-2">{postDetails.caption}</p>
          </div>

          {/* Scrollable Comments */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {staticComments.map((c) => (
              <div key={c.id}>
                {/* Parent Comment */}
                <div className="flex items-start space-x-3">
                  <img
                    src={c.avatar}
                    alt={`${c.user}'s avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.user} <span className="text-gray-400">{c.username}</span></p>
                    <p className="text-gray-600 text-sm">{c.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{c.timestamp}</p>
                  </div>
                </div>

                {/* Replies */}
                <div className="pl-12 mt-2 space-y-2">
                  {c.replies.map((r) => (
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
                  ))}
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
