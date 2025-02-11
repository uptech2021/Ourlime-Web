import React, { useEffect, useState } from "react";
import { addDoc, serverTimestamp, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { UserData } from "@/types/userTypes";
import Image from "next/image";
import { fetchCommentsForPost } from "@/helpers/Posts"; // Import the new fetch function
import PostMedia from './PostMedia'; // Import PostMedia component
import { auth } from '@/lib/firebaseConfig'; // Import auth to access current user

interface CommunityPostCommentsModalProps {
    communityVariantDetailsId: string;
    onClose: () => void;
}

const CommunityPostCommentsModal: React.FC<CommunityPostCommentsModalProps> = ({ communityVariantDetailsId, onClose }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<any[]>([]); // Adjust type as needed
    const [isLoading, setIsLoading] = useState(true);
    const [postDetails, setPostDetails] = useState<any>(null); // Add state for post details

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const fetchedComments = await fetchCommentsForPost('communityVariantDetailsComments', communityVariantDetailsId); // Use the new fetch function
                setComments(fetchedComments);
                // Fetch post details here if needed
                // Example: const fetchedPostDetails = await fetchPostDetails(communityVariantDetailsId);
                // setPostDetails(fetchedPostDetails);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [communityVariantDetailsId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            const commentData = {
                comment,
                createdAt: serverTimestamp(),
                communityVariantDetailsId,
                userId: auth.currentUser?.uid,
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
                <button className="ml-auto p-2" aria-label="Close modal" onClick={onClose}>X</button>

                {/* Post Media Section */}
                {postDetails && postDetails.media && postDetails.media.length > 0 && (
                    <div className="md:w-1/2 w-full h-auto flex items-center justify-center">
                        <PostMedia media={postDetails.media} />
                    </div>
                )}

                {/* Scrollable Comments */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {isLoading ? (
                        <p>Loading comments...</p>
                    ) : (
                        comments.map((c) => (
                            <div key={c.id} className="flex items-start space-x-3">
                                <Image
                                    src={c.userData?.profileImage || ""}
                                    alt={`${c.userData?.firstName}'s avatar`}
                                    className="w-10 h-10 rounded-full"
                                    width={100}
                                    height={100}
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