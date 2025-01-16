import React, { useState } from "react";
import { doc, addDoc, serverTimestamp, collection } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig"; // Update the path based on your project structure

interface CommentModalProps {
  postId: string;
  userId: string;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ postId, userId, onClose }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
    //   const commentId = `${postId}_${Date.now()}`; // Generate a unique ID for the comment
      const commentData = {
        comments: comment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        feedsPostId: postId,
        userId: userId,
      };

      try{
        console.log("Post ID in CommentModal:", postId);
        const commentsRef = await addDoc(collection(db, 'feedsPostComments'), commentData);
        setComment("");    
    }catch(e){
        console.error('Error adding document', e)
    }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add a Comment</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full h-20 border rounded-md p-2 mb-4"
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
