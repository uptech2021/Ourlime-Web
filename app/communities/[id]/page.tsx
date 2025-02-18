    'use client';

    import Image from 'next/image';
    import { ChevronLeft, ChevronRight, Heart, Play, MessageCircle } from 'lucide-react';
    import { useEffect, useState, useCallback } from 'react';
    import { useParams } from 'next/navigation';
    import { getFriends } from '@/helpers/friendsAndFollowingHelper';
    import { UserData, ProfileImage, BasePost } from '@/types/userTypes';
    import { fetchCommunityData, fetchCommunityMembers, fetchCommunityPosts } from '@/helpers/communities';
    import { addDoc, collection, query, where, getDocs, deleteDoc, onSnapshot, writeBatch, serverTimestamp, increment, doc, updateDoc } from 'firebase/firestore';
    import { db, auth } from '@/lib/firebaseConfig';
    import CreateCommunityPost from '@/components/communities/CreateCommunityPosts';
    import PostMedia from '@/components/communities/PostMedia';
    import { debounce } from 'lodash';
    import CommunityPostCommentsModal from '@/components/communities/CommunityPostCommentsModal';
    import PostEventModal from '@/components/events/PostEventModal';
    import EventsList from '@/components/events/EventsList';
    import EventCommentModal from '@/components/events/EventCommentModal';
    import { event } from 'cypress/types/jquery';
    import Slider from '@/components/comm/Slider';
    import { Community } from '@/types/communityTypes';
    import { uploadFile } from '@/helpers/firebaseStorage';

    // type BasePost = {
    //     id: string;
    //     title: string;
    //     content: string;
    //     author: {
    //         id: string;
    //         name: string;
    //         avatar: string;
    //         role: string;
    //     };
    //     // stats: {
    //     //     likes: number;
    //     //     comments: number;
    //     //     shares: number;
    //     // };
    //     // tags: string[];
    //     timestamp: string;
    // };

    type GalleryPost = BasePost & {
        type: 'gallery';
        media: string[];
    };

    type VideoPost = BasePost & {
        type: 'video';
        media: string;
        thumbnail: string;
        duration: string;
    };

    type ArticlePost = BasePost & {
        type: 'article';
        coverImage: string;
        readTime: string;
        link: string;
    };

    type MusicPost = BasePost & {
        type: 'music';
        albumArt: string;
        trackList: Array<{ name: string; duration: string; }>;
        platform: string;
        playlistLink: string;
    };

    type ResourcePost = BasePost & {
        type: 'resource';
        resources: Array<{
            title: string;
            author: string;
            cover: string;
            link: string;
        }>;
    };

    type Post = GalleryPost | VideoPost | ArticlePost | MusicPost | ResourcePost;

    export default function CommunityDetailPage() {
        const [isPostModalOpen, setIsPostModalOpen] = useState(false);
        const [isEventModalOpen, setIsEventModalOpen] = useState(false);
        const [isEventCommentModalOpen, setIsEventCommentModalOpen] = useState(false);
        const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
        const [isCommunityPostModalOpen, setIsCommunityPostModalOpen] = useState(false);
        const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
        const [members, setMembers] = useState<UserData[]>([]);
        const [posts, setPosts] = useState<BasePost[]>([]);
        const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
        const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
        const { id } = useParams();
        const communityVariantId = id? String(id): "";
        const currentUserId = auth.currentUser?.uid;
        const [communityData, setCommunityData] = useState<Community>();
        const [isEditFormOpen, setIsEditFormOpen] = useState(false);
        const [editTitle, setEditTitle] = useState(communityData?.title || '');
        const [editDescription, setEditDescription] = useState(communityData?.description || '');
        const [editImageUrl, setEditImageUrl] = useState(communityData?.imageUrl || '');
        const [editIsPrivate, setEditIsPrivate] = useState(communityData?.isPrivate || false);
        const [communityImage, setCommunityImage] = useState<File | null>(null);

        const loadCommunityData = async () => {
            const fetchedCommunityData = await fetchCommunityData(communityVariantId);
            setCommunityData(fetchedCommunityData);
        };

        useEffect(() => {
            loadCommunityData();
        }, [communityVariantId]);
        
        useEffect(() => {
            const loadMembers = async () => {
                const fetchedMembers = await fetchCommunityMembers(communityVariantId);
                setMembers(fetchedMembers);

                console.log("Fetched Members: ", fetchedMembers)
            };
            loadMembers();
        }, [communityVariantId]);

        useEffect(() => {
            const loadPosts = async () => {
                if (communityVariantId) {
                    const fetchedCommunityPosts = await fetchCommunityPosts(communityVariantId);
                    setPosts(fetchedCommunityPosts);
                }
            };

            loadPosts();
        }, [communityVariantId]);
        console.log("Fetched Posts: ", posts);


        // Check if user has liked the post
        useEffect(() => {
            if (!currentUserId) return;

            const likesRef = collection(db, 'communityVariantDetailsLikes');
            const unsubscribe = onSnapshot(likesRef, (snapshot) => {
                const userLikedPosts: { [key: string]: boolean } = {};
                const counts: { [key: string]: number } = {};

                snapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    userLikedPosts[data.postId] = true;
                    counts[data.postId] = (counts[data.postId] || 0) + 1;
                });

                setLikedPosts(userLikedPosts);
                setLikeCounts(counts);
            });

            return () => unsubscribe();
        }, [currentUserId]);

        // Debounced like handler
        const debouncedLikeHandler = useCallback(
            debounce(async (communityVariantDetailsId: string, currentLikeState: boolean) => {
                const currentUserId = auth.currentUser?.uid;
                if (!currentUserId) return;

                const batch = writeBatch(db);
                const likesRef = collection(db, 'communityVariantDetailsLikes');
                const userLikeQuery = query(
                    likesRef,
                    where('postId', '==', communityVariantDetailsId),
                    where('userId', '==', currentUserId)
                );

                const snapshot = await getDocs(userLikeQuery);

                // Handle communityVariantLikes
                if (!currentLikeState) {
                    const newLikeRef = doc(likesRef);
                    batch.set(newLikeRef, {
                        communityVariantDetailsId,
                        userId: currentUserId,
                        timestamp: serverTimestamp()
                    });
                } else {
                    if (!snapshot.empty) {
                        batch.delete(snapshot.docs[0].ref);
                    }
                }

                // Handle like counts
                const likesCountRef = collection(db, 'communityVariantDetailsCounter');
                const countQuery = query(likesCountRef, where('communityVariantDetailsId', '==', communityVariantDetailsId));
                const countSnapshot = await getDocs(countQuery);

                if (countSnapshot.empty) {
                    const newCountRef = doc(likesCountRef);
                    batch.set(newCountRef, {
                        communityVariantDetailsId,
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
            }, 5000), // 5 seconds delay
            []
        );

        const handleLike = (postId: string) => {
            const currentLikeState = likedPosts[postId] || false;
            setLikedPosts((prev) => ({ ...prev, [postId]: !currentLikeState }));
            debouncedLikeHandler(postId, currentLikeState);
        };

        const closeCreateModal = () => {
            setIsCommunityPostModalOpen(false);
        }

        const openCommentsModal = (postId: string) => {
            setSelectedPostId(postId);
            setIsPostModalOpen(true);
        };

        const closeEventsModal = () => {
            setIsEventModalOpen(false);
        }

        const openEventCommentModal = (eventId: string) => {
            setSelectedEventId(eventId);
            setIsEventCommentModalOpen(true);
        }

        const closeEventCommentModal = () => {
            setIsEventCommentModalOpen(false);
        }

        const handleEditSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            const communityRef = doc(db, 'communityVariant', communityData.id);
            let imageUrl = editImageUrl;

            if (communityImage) {
                try {
                    imageUrl = await uploadFile(communityImage, `images/communities/thumbnails/${communityImage.name}`);
                } catch (error) {
                    console.error('Error uploading image: ', error);
                    return;
                }
            }

            try {
                await updateDoc(communityRef, {
                    title: editTitle,
                    description: editDescription,
                    imageUrl: imageUrl,
                    isPrivate: editIsPrivate,
                });

                console.log('Community data updated successfully');
                setIsEditFormOpen(false);
            } catch (error) {
                console.error('Error updating community data: ', error);
            }
        };

        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                setCommunityImage(e.target.files[0]);
            }
        };

        return (
            <>
                <div className="min-h-screen bg-gray-50">
                    <main className="pt-36 w-full 2xl:w-9/12 2xl:mx-auto tvScreen:w-7/12 px-2 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,2fr)_1fr] gap-4">
                            {/* Left Section */}
                            <section className="hidden lg:flex flex-col bg-white rounded-lg shadow-sm p-4">
                                <h2 className="text-lg font-bold">Topics</h2>
                                <ul className="mt-4 space-y-2">
                                    <li className="text-gray-600">Plants</li>
                                    <li className="text-gray-600">Animals</li>
                                    <li className="text-gray-600">Educational</li>
                                    <li className="text-gray-600">Wildlife</li>
                                    <li className="text-gray-600">Marine</li>
                                </ul>
                                <h2 className="text-lg font-bold mt-6">Members</h2>
                                <ul className="mt-4 space-y-2">
                                    {members.map(member => (
                                        <li key={member.id} className="flex items-center gap-2">
                                        <img src={member.profileImages?.['undefined'] || 'image' || ''} alt={member.userName} className="rounded-full w-10 h-10" />
                                        <div>
                                            <div className="font-semibold">{`${member.firstName} ${member.lastName}`}</div>
                                            <div className="text-sm text-gray-500">@{member.userName}</div>
                                        </div>
                                    </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Middle Section - Posts Feed */}
                            <section className="w-full overflow-y-auto h-[calc(100vh-9rem)] scrollbar-hide">
                                {/* Community Header Card */}
                                {communityData ? (
                                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 w-full max-w-full">
                                        <h2 className="text-xl font-bold break-words">{communityData.title}</h2>
                                        <p className="text-gray-600 text-sm my-2 break-words">{communityData.description}</p>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                            <button className="px-4 py-1.5 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors">
                                                Join Community
                                            </button>
                                            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title='heart'>
                                                <Heart className="w-5 h-5 text-gray-500" />
                                            </button>
                                            <button className="px-4 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                Share
                                            </button>
                                            <button className="px-4 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                More
                                            </button>
                                        </div>
                                        {/* Move the Edit Button Below All Other Data */}
                                        {communityData?.userId === currentUserId && (
                                            <button 
                                                onClick={() => setIsEditFormOpen(prev => !prev)} 
                                                className="mt-4 px-4 py-1.5 bg-greenTheme text-white rounded-lg hover:bg-blue-600 transition-colors">
                                                {isEditFormOpen ? 'Cancel Edit' : 'Edit Community'}
                                            </button>
                                        )}  
                                    </div>
                                ) : (
                                    <p>Loading community data or community not found.</p>
                                )}

                                <div className='flex gap-4 lg:hidden'>
                                    <button 
                                    className="px-4 py-1.5 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors"
                                    onClick={() => setIsCommunityPostModalOpen(true)}>
                                        Create Post +
                                    </button>
                                    <button 
                                    className="px-4 py-1.5 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors" 
                                    onClick={() => setIsEventModalOpen(true)}>
                                        Host Event +
                                    </button>
                                </div>

                                {/* Events Grid */}
                                <div className="mb-8 border-black border-b">
                                    <h2 className="mb-4">Community Events</h2>
                                    <EventsList communityVariantId={communityVariantId} userId={currentUserId}/>
                                </div>
                          
                                {/* Posts Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                                    {posts.map((post) => {
                                        return (
                                            <div key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                                                {/* Dynamic Media Section */}
                                                <PostMedia media={post.mediaDetails} />

                                                {/* Post Content Section */}
                                                <div className="p-4">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <Image
                                                            src={post.author.profileImage}
                                                            alt={post.author.firstName}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-full"
                                                            loader={({ src }) => src}
                                                            unoptimized={true}
                                                        />
                                                        <div>
                                                            <div className="font-semibold">{post.author.firstName} {post.author.lastName}</div>
                                                            <div className="text-sm text-gray-500">{post.author.role}</div>
                                                        </div>
                                                    </div>

                                                    <h3 className="font-bold mb-2">{post.title}</h3>
                                                    <p className="text-gray-600 text-sm mb-3">{post.content}</p>

                                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                                        <span>{new Date(post.timestamp).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 pt-3">
                                                        {/* Like Button */}
                                                        <button 
                                                        onClick={() => handleLike(post.id)} 
                                                        className={`flex items-center gap-2 ${likedPosts[post.id] ? 'text-greenTheme' : 'text-gray-600'}`}>
                                                            <Heart className="w-5 h-5" fill={likedPosts[post.id] ? 'currentColor' : 'none'} />
                                                            <span>{likedPosts[post.id] ? 'Liked' : 'Like'}</span>
                                                        </button>

                                                        {/* Comments Button */}
                                                        <button
                                                            className="flex items-center gap-2 text-gray-600 hover:text-greenTheme"
                                                            onClick={() => openCommentsModal(post.id)}
                                                        >
                                                            <MessageCircle size={20} />
                                                            <span>Comment</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>


                            {/* Right Section */}
                            {communityData? (
                            <section className="bg-white rounded-lg shadow-sm p-4">
                                <h2 className="text-lg font-bold">Details</h2>
                                <p>Created: <span>{new Date(communityData.createdAt).toLocaleDateString()}</span></p>
                                <p>Status: <span>{communityData.isPrivate ? "Private" : "Public"}</span></p>
                                <div className="mt-4">
                                    <p>Online: 76 Members</p>
                                </div>
                                <button 
                                className="hidden lg:block px-4 py-1.5 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors"
                                onClick={() => setIsCommunityPostModalOpen(true)}>
                                    Create Post +
                                </button>
                                <button className="hidden lg:block mt-2 px-4 py-1.5 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors" 
                                onClick={() => setIsEventModalOpen(true)}>
                                    Host Event +
                                </button>
                                <h2 className="text-lg font-bold mt-6">Join Your Friends</h2>
                                <ul className="mt-4 space-y-2">
                                    <li className="text-gray-600">Bruce Banner</li>
                                    <li className="text-gray-600">Tony Stark</li>
                                    <li className="text-gray-600">Wade Wilson</li>
                                </ul>
                                <h2 className="text-lg font-bold mt-6">Recommended</h2>
                                <ul className="mt-4 space-y-2">
                                    <li className="text-gray-600">Food World</li>
                                    <li className="text-gray-600">Fitness Hub</li>
                                </ul>
                            </section>
                            ): (<p></p>)}
                        </div>
                    </main>
                </div>

                {/* Render the Comments Modal */}
                {isPostModalOpen && selectedPostId && (
                    <CommunityPostCommentsModal 
                        communityVariantDetailsId={selectedPostId} 
                        onClose={() => setIsPostModalOpen(false)} 
                    />
                )}

                {isCommunityPostModalOpen && (
                                <CreateCommunityPost 
                                    communityVariantId={communityVariantId}
                                    setTogglePostForm={closeCreateModal} 
                                    profilePicture={''}
                                />
                )}

                {isEventModalOpen && (
                    <PostEventModal
                    isOpen={isEventModalOpen}
                    onClose={closeEventsModal}
                    communityVariantId={communityVariantId}/>
                )}

                {isEventCommentModalOpen && (
                    <EventCommentModal
                    onClose={closeEventCommentModal}
                    eventId={selectedEventId} />
                )}

                {/* Edit Form */}
                {isEditFormOpen && (
                    <form onSubmit={handleEditSubmit} className="bg-white p-4 rounded-lg shadow-md mt-4">
                        <div>
                            <label>Title:</label>
                            <input 
                                type="text" 
                                value={editTitle} 
                                onChange={(e) => setEditTitle(e.target.value)} 
                                className="border rounded p-2 w-full" 
                                placeholder="Edit Title"
                            />
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea 
                                value={editDescription} 
                                onChange={(e) => setEditDescription(e.target.value)} 
                                className="border rounded p-2 w-full" 
                                placeholder="Edit Description"
                            />
                        </div>
                        <div>
                            <label>Image:</label>
                            <input 
                                placeholder='Change Image'
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                className="border rounded p-2 w-full" 
                            />
                        </div>
                        <div>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={editIsPrivate} 
                                    onChange={(e) => setEditIsPrivate(e.target.checked)} 
                                />
                                Private
                            </label>
                        </div>
                        <button type="submit" className="mt-2 px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                            Save Changes
                        </button>
                    </form>
                )}
            </>
        );
    }
