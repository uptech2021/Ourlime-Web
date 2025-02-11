import React, { useEffect, useState } from "react";
import { addDoc, serverTimestamp, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { UserData } from "@/types/userTypes";
import Image from "next/image";

interface CommunityPostCommentsModalProps {
    postId: string;
    onClose: () => void;
}

const CommunityPostCommentsModal: React.FC<CommunityPostCommentsModalProps> = ({ postId, onClose }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<any[]>([]); // Adjust type as needed
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            const commentsRef = collection(db, 'communityVariantDetailsComments');
            const q = query(commentsRef, where('communityVariantDetailsId', '==', postId));
            const snapshot = await getDocs(q);
            const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComments(fetchedComments);
            setIsLoading(false);
        };

        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            const commentData = {
                comment,
                createdAt: serverTimestamp(),
                communityVariantDetailsId: postId,
                userId: "currentUserId", // Replace with actual user ID
            };

            try {
                await addDoc(collection(db, "communityVariantDetailsComments"), commentData);
                setComment(""); // Clear the input field after submission
            } catch (e) {
                console.error("Error adding comment:", e);
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-4xl mx-4 rounded-lg shadow-lg flex flex-col">
                <button className="ml-auto" aria-label="Close modal" onClick={onClose}>X</button>

                {/* Scrollable Comments */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {isLoading ? (
                        <p>Loading comments...</p>
                    ) : (
                        comments.map((c) => (
                            <div key={c.id} className="flex items-start space-x-3">
                                <Image
                                    src={c.userData?.profileImage || "https://via.placeholder.com/40"}
                                    alt={`${c.userData?.firstName}'s avatar`}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{c.userData?.firstName} {c.userData?.lastName}</p>
                                    <p className="text-gray-600 text-sm">{c.comment}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(c.createdAt?.seconds * 1000).toLocaleString()}</p>
                                </div>
                            </div>
                        ))
                    )}
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
    );
};

export default CommunityPostCommentsModal; 