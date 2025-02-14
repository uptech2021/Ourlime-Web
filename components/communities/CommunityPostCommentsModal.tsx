import React, { useEffect, useState } from "react";
import { addDoc, serverTimestamp, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { BasePost } from "@/types/userTypes";
import Image from "next/image";
import { fetchCommunityPosts, fetchCommunityPostComments, fetchRepliesForCommunityPostComments } from "@/helpers/communities";
import PostMedia from './PostMedia'; 
import { auth } from '@/lib/firebaseConfig'; 

interface CommunityPostCommentsModalProps {
    communityVariantDetailsId: string;
    onClose: () => void;
}

const CommunityPostCommentsModal: React.FC<CommunityPostCommentsModalProps> = ({ communityVariantDetailsId, onClose }) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<any[]>([]);
    const [commentReply, setCommentReply] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [postDetails, setPostDetails] = useState<BasePost | null>(null);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replies, setReplies] = useState<{ [key: string]: any[] }>({});

    const loadPostDetails = async () => {
        const fetchedPosts = await fetchCommunityPosts('communityVariantDetails'); 
        const specificPost = fetchedPosts[0];

        if (specificPost) {
            setPostDetails(specificPost);
            console.log(`Fetched Post ${specificPost.id}: `, specificPost);
        }
    };

    const fetchCommentsAndReplies = async () => {
        setIsLoading(true);
        try {
            const fetchedComments = await fetchCommunityPostComments(communityVariantDetailsId);
            setComments(fetchedComments);

            console.log("Fetched Comments: ", fetchedComments);

            // Fetch replies for each comment
            const repliesData: { [key: string]: any[] } = {};
            for (const comment of fetchedComments) {
                const fetchedReplies = await fetchRepliesForCommunityPostComments('communityVariantDetailsCommentsReplies', comment.id); 
                fetchedReplies.sort((c, d) => {
                    return new Date(d.createdAt).getTime() - new Date(c.createdAt).getTime();
                  });
                  
                  repliesData[comment.id] = fetchedReplies;
            }
            setReplies(repliesData);
            console.log("Replies: ", repliesData);
            } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPostDetails();
    }, []);

    useEffect(() => {
        fetchCommentsAndReplies();
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
                setComment("");
                fetchCommentsAndReplies();
            } catch (e) {
                console.error("Error adding comment:", e);
            }
        }
    };

    const handleReply = async (e: React.FormEvent, commentId: string) => {
        e.preventDefault();
        if (commentReply.trim()) {
            const replyData = {
                commentReply,
                createdAt: serverTimestamp(),
                communityVariantDetailsCommentsId: commentId,
                userId: auth.currentUser?.uid,
            };

            try {
                await addDoc(collection(db, "communityVariantDetailsCommentsReplies"), replyData);
                setCommentReply("");
                fetchCommentsAndReplies(); // Refresh comments and replies
            } catch (e) {
                console.error("Error adding reply:", e);
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-4xl mx-4 rounded-lg shadow-lg flex flex-col">
                <button className="ml-auto p-2" aria-label="Close modal" onClick={onClose}>X</button>

                {/* Post Media Section */}
                {postDetails?.media?.length > 0 && (
                    <div className="md:w-1/2 w-full h-auto flex items-center justify-center">
                        <PostMedia media={postDetails.mediaDetails} />
                    </div>
                )}
                <div className="text-sm text-gray-500 mt-2">
                    Posted by {postDetails?.author.firstName} {postDetails?.author.lastName} on {postDetails?.createdAt?.toLocaleString()}
                </div>

                {/* Scrollable Comments */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {isLoading ? (
                        <p>Loading comments...</p>
                    ) : (
                        comments.map((c) => (
                            <div key={c.id} className="flex flex-col space-y-2">
                                <div className="flex items-start space-x-3">
                                    <img
                                        src={c.userData?.profileImage || ""}
                                        alt={`${c.userData?.firstName}'s avatar`}
                                        className="w-10 h-10 rounded-full"
                                        width={40}
                                        height={40}
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{c.userData?.firstName} {c.userData?.lastName}</p>
                                        <p className="text-gray-600 text-sm">{c.comment}</p>
                                        <p className="text-xs text-gray-400 mt-1">{c.createdAt?.toLocaleString()}</p>
                                    </div>
                                    <button
                                        className="text-blue-500 text-sm"
                                        onClick={() => setReplyingTo(c.id === replyingTo ? null : c.id)}
                                    >
                                        Reply
                                    </button>
                                </div>

                                {/* Replies */}
                                {replies[c.id]?.length > 0 && (
                                    <div className="ml-12 mt-2 space-y-2">
                                        {replies[c.id].map((reply) => (
                                            <div key={reply.id} className="flex items-start space-x-3">
                                                <Image
                                                    src={reply.userData?.profileImage || ""}
                                                    alt={`${reply.userData?.firstName}'s avatar`}
                                                    className="w-8 h-8 rounded-full"
                                                    width={32}
                                                    height={32}
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{reply.userData?.firstName} {reply.userData?.lastName}</p>
                                                    <p className="text-gray-600 text-sm">{reply.reply}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{reply.createdAt?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Reply Input */}
                                {replyingTo === c.id && (
                                    <form onSubmit={(e) => handleReply(e, c.id)} className="ml-12 mt-2 flex items-center space-x-2">
                                        <textarea
                                            className="flex-1 border rounded-md p-2 text-sm resize-none"
                                            placeholder="Write your reply..."
                                            value={commentReply}
                                            onChange={(e) => setCommentReply(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-greenTheme text-white rounded-md"                                        >
                                            Reply
                                        </button>
                                    </form>
                                )}
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
                        <button type="submit" 
                        className="px-4 py-2 bg-greenTheme text-white rounded-md">
                            Post
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CommunityPostCommentsModal;
