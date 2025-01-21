import { Post } from '@/types/userTypes'; // Adjust the import based on your project structure
import Image from 'next/image';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import CommentModal from './CommentsModal';

import { collection, query, where, getDocs, addDoc, updateDoc, onSnapshot, deleteDoc, writeBatch, serverTimestamp, doc, increment, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseConfig';
import debounce from 'lodash/debounce';

import { User } from "@/types/global"

const PostMedia = ({ media }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="relative h-[400px] mb-4">
            {/* Main Active Media */}
            <div className="relative w-full h-full">
                {media[activeIndex].type === 'image' ? (
                    <Image
                        src={media[activeIndex].typeUrl}
                        alt="Post content"
                        fill
                        className="object-cover rounded-lg"
                        loader={({ src }) => src}
                        unoptimized={true}
                    />
                ) : (
                    <video controls className="w-full h-full object-cover rounded-lg">
                        <source src={media[activeIndex].typeUrl} />
                    </video>
                )}
            </div>

            {/* Overlay Slider */}
            <div className="absolute bottom-4 left-0 right-0 flex gap-2 px-4 overflow-x-auto">
                {media.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`relative w-16 h-16 rounded-lg cursor-pointer transition-all 
                            ${activeIndex === index ? 'opacity-100 ring-2 ring-greenTheme' : 'opacity-50'}`}
                    >
                        {item.type === 'image' ? (
                            <Image
                                src={item.typeUrl}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover rounded-lg"
                                loader={({ src }) => src}
                                unoptimized={true}
                            />
                        ) : (
                            <video className="w-full h-full object-cover rounded-lg">
                                <source src={item.typeUrl} />
                            </video>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


const PostCard = ({ post }: { post: Post }) => {
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [activePostId, setActivePostId] = useState<string | null>(null);
    const currentUserId = auth.currentUser?.uid; 

    const handleOpenCommentModal = (postId: string) => {
        setActivePostId(postId); // Set the current postId
        setIsCommentModalOpen(true);
    };

    const handleCommentClick = () => {
        setIsCommentModalOpen(true);
    };


    // Add these states to PostCard component
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // Check if user has liked the post
    useEffect(() => {
        console.log('Checking like status for post:', post.id);
        const checkLikeStatus = async () => {
            const currentUserId = auth.currentUser?.uid;
            const likesRef = collection(db, 'feedsPostLikeCount');
            const q = query(
                likesRef,
                where('feedsPostId', '==', post.id),
                where('userId', '==', currentUserId)
            );
            const snapshot = await getDocs(q);
            setIsLiked(!snapshot.empty);
            console.log('User like status:', !snapshot.empty);
        };
        checkLikeStatus();
    }, [post.id]);


    // Listen to total like count
    useEffect(() => {
        const likesCountRef = collection(db, 'likesCount');
        const q = query(likesCountRef, where('feedsPostId', '==', post.id));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const count = snapshot.docs[0].data().likeCount;
                setLikeCount(count);
            }
        });

        return () => unsubscribe();
    }, [post.id]);


    // Add debounced like handler
    const debouncedLikeHandler = useCallback(
        debounce(async (postId: string, userId: string, currentLikeState: boolean) => {
            try {
                const likesRef = collection(db, 'feedsPostLikeCount');
                const userLikeQuery = query(
                    likesRef,
                    where('feedsPostId', '==', postId),
                    where('userId', '==', userId)
                );

                const batch = writeBatch(db);
                const snapshot = await getDocs(userLikeQuery);

                // Handle feedsPostLikeCount
                if (!currentLikeState) {
                    const newLikeRef = doc(likesRef);
                    batch.set(newLikeRef, {
                        feedsPostId: postId,
                        userId: userId,
                        likes: true,
                        timestamp: serverTimestamp()
                    });
                } else {
                    batch.delete(snapshot.docs[0].ref);
                }

                // Handle likesCount
                const likesCountRef = collection(db, 'likesCount');
                const countQuery = query(likesCountRef, where('feedsPostId', '==', postId));
                const countSnapshot = await getDocs(countQuery);

                if (countSnapshot.empty) {
                    const newCountRef = doc(likesCountRef);
                    batch.set(newCountRef, {
                        feedsPostId: postId,
                        likeCount: 1,
                        commentCount: 0,
                        shareCount: 0
                    });
                } else {
                    const countDoc = countSnapshot.docs[0];
                    const { commentCount, shareCount } = countDoc.data();
                    batch.update(countDoc.ref, {
                        likeCount: currentLikeState ? increment(-1) : increment(1),
                        commentCount,
                        shareCount
                    });
                }


                await batch.commit();
                console.log(`Like ${currentLikeState ? 'removed' : 'added'} successfully`);
            } catch (error) {
                console.error('Error processing like:', error);
                setIsLiked(currentLikeState);
            }
        }, 5000), //5000 for a 5 second dela
        []
    );


    // Update handleLike to use optimistic updates
    const handleLike = () => {
        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) return;

        setIsLiked(!isLiked);
        debouncedLikeHandler(post.id, currentUserId, isLiked);
    };


    // LIKED USERS IMAGE WHICH IS BEING FETCHED
    // STARTS HERE

    const [likedUsers, setLikedUsers] = useState<any[]>([]);

    useEffect(() => {
        const likesRef = collection(db, 'feedsPostLikeCount');
        const q = query(likesRef, where('feedsPostId', '==', post.id));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const users = await Promise.all(
                snapshot.docs.map(async (docSnapshot) => {
                    const likeData = docSnapshot.data();
                    const userDocRef = doc(db, 'users', likeData.userId);
                    const userSnapshot = await getDoc(userDocRef);
                    const userData = userSnapshot.data() as User;

                    const profileImagesQuery = query(
                        collection(db, 'profileImages'),
                        where('userId', '==', likeData.userId)
                    );
                    const profileSetAsQuery = query(
                        collection(db, 'profileImageSetAs'),
                        where('userId', '==', likeData.userId),
                        where('setAs', '==', 'profile')
                    );
                    const [profileImagesSnapshot, setAsSnapshot] = await Promise.all([
                        getDocs(profileImagesQuery),
                        getDocs(profileSetAsQuery)
                    ]);

                    let profileImage = null;
                    if (!setAsSnapshot.empty) {
                        const setAsDoc = setAsSnapshot.docs[0].data();
                        const matchingImage = profileImagesSnapshot.docs
                            .find(img => img.id === setAsDoc.profileImageId);
                        if (matchingImage) {
                            profileImage = matchingImage.data().imageURL;
                        }
                    }

                    return {
                        id: likeData.userId,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        userName: userData.userName,
                        profileImage
                    };
                })
            );
            setLikedUsers(users);
        });

        return () => unsubscribe();
    }, [post.id]);

    // ENDS HERE


    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            {/* User Info Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    {post.user.profileImage ? (
                        <Image
                            src={post.user.profileImage}
                            alt={`${post.user.firstName}'s profile`}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            priority
                            unoptimized={true}
                            loader={({ src }) => src}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200" />
                    )}
                </div>
                <div>
                    <h3 className="font-semibold">{post.user.firstName} {post.user.lastName}</h3>
                    <span className="text-sm text-gray-500">@{post.user.userName}</span>
                </div>
            </div>

            {/* Caption */}
            {post.caption && (
                <p className="text-lg mb-3">{post.caption}</p>
            )}

            {/* Description */}
            {post.description && (
                <p className="text-gray-600 mb-4">{post.description}</p>
            )}

            {/* Media Content */}
            {post.media && post.media.length > 0 && (
                <PostMedia media={post.media} />
            )}

            {/* Hashtags */}
            {post.hashtags && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.hashtags.map((tag, index) => (
                        <span key={index} className="text-greenTheme hover:underline cursor-pointer">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* User References */}
            {post.userReferences && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.userReferences.map((user, index) => (
                        <span key={index} className="text-blue-500 hover:underline cursor-pointer">
                            @{user}
                        </span>
                    ))}
                </div>
            )}

            {/* Interaction Buttons */}
            <div>
                {/* Interaction Buttons */}
                <div className="flex items-center gap-4 pt-3 border-t">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 ${isLiked ? 'text-greenTheme' : 'text-gray-600'
                            } hover:text-greenTheme transition-colors duration-200`}
                    >
                        <Heart
                            size={20}
                            fill={isLiked ? 'currentColor' : 'none'}
                            className="transform transition-transform duration-200 hover:scale-110"
                        />
                        <span>Like</span>
                    </button>

                    <button
                        className="flex items-center gap-2 text-gray-600 hover:text-greenTheme"
                        onClick={() => handleOpenCommentModal(post.id)}
                    >
                        <MessageCircle size={20} />
                        <span>Comment</span>
                    </button>

                    <button className="flex items-center gap-2 text-gray-600 hover:text-greenTheme">
                        <Share size={20} />
                        <span>Share</span>
                    </button>
                </div>

                {/* Likes Avatars Row with Enhanced Hover Effects */}
                <div className="flex items-center">
                    <div className="flex -space-x-3">
                        {likedUsers.slice(0, 3).map((user, index) => (
                            <div
                                key={user.id}
                                className="w-8 h-8 rounded-full relative hover:z-10"
                                style={{ zIndex: 1 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-greenTheme to-emerald-400 rounded-full animate-pulse group-hover:animate-none" />
                                <div className="absolute inset-[2px] bg-white rounded-full" />
                                <div className="absolute inset-[2px] rounded-full overflow-hidden transform transition-all duration-300 hover:scale-110">
                                    {user.profileImage ? (
                                        <Image
                                            src={user.profileImage}
                                            alt={`${user.firstName}'s profile`}
                                            width={32}
                                            height={32}
                                            className="w-full h-full object-cover"
                                            loader={({ src }) => src}
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <span className="text-xs font-medium text-gray-500">
                                                {user.firstName?.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600 flex-shrink-0">
                        {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                    </span>
                </div>
            </div>


            {isCommentModalOpen && activePostId && (
                <CommentModal
                    postId={activePostId}
                    userId={currentUserId}
                    // profilePicture=''
                    onClose={() => setIsCommentModalOpen(false)}
                />
            )}
        </div>
    );
};

export default PostCard;
