import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { Plus, Search, UserMinus, UserPlus, X } from 'lucide-react';
import Image from 'next/image';
import { UserData, SearchUser } from '@/types/userTypes';
import { addDoc, collection, deleteDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseConfig';

type LeftSectionProps = {
    profileImage: { imageURL: string } | null;
    userData: UserData | null;
    searchTerm: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filteredUsers: (UserData | SearchUser)[];
    handleUserClick: (user: UserData | SearchUser) => void;
    selectedUser: UserData | null;
    setShowUserModal: Dispatch<SetStateAction<boolean>>;
};

type UserModalProps = {
    selectedUser: UserData;
    setShowUserModal: Dispatch<SetStateAction<boolean>>;
    onAddFriend: () => Promise<void>;
    onFollow: () => Promise<void>;
    isFollowing: boolean;
};


const UserModal = ({ selectedUser, setShowUserModal, onAddFriend, onFollow, isFollowing }: UserModalProps) => {

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
                onClick={() => setShowUserModal(false)} // Close modal when clicking on the overlay
            />

            {/* Modal */}
            <div className="fixed top-1/4 left-0 right-0 mx-auto z-[110] w-full max-w-md p-4">
                <div className="relative bg-white rounded-2xl transform transition-all duration-300 scale-100 shadow-lg">
                    <div className="relative p-6">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowUserModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="close"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>

                        {/* Modal Content */}
                        <div className="flex flex-col items-center">
                            {/* Profile Image */}
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-greenTheme/20">
                                {selectedUser?.profileImage ? (
                                    <Image
                                        src={selectedUser.profileImage}
                                        alt={selectedUser.firstName}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                        loader={({ src }) => src}
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-2xl text-gray-400">
                                            {selectedUser?.firstName?.charAt(0)}
                                            {selectedUser?.lastName?.charAt(0)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* User Details */}
                            <h3 className="text-2xl font-bold text-gray-900">
                                {selectedUser?.firstName} {selectedUser?.lastName}
                            </h3>
                            <p className="text-gray-500 mb-4">@{selectedUser?.userName}</p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 w-full mb-6 px-4">
                                <div className="text-center">
                                    <p className="text-xl font-bold text-gray-900">245</p>
                                    <p className="text-sm text-gray-500">Posts</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-gray-900">14.3K</p>
                                    <p className="text-sm text-gray-500">Followers</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-gray-900">892</p>
                                    <p className="text-sm text-gray-500">Following</p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={onFollow}
                                    className="flex-1 py-2.5 bg-greenTheme text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                                    ariel-aria-label='followings'
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                                <button
                                    onClick={onAddFriend}
                                    className="flex-1 py-2.5 border-2 border-greenTheme text-greenTheme rounded-xl font-medium hover:bg-green-50 transition-colors"
                                >
                                    Add Friend
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export default function LeftSection({
    profileImage,
    userData,
    searchTerm,
    handleSearch,
    filteredUsers,
    handleUserClick,
    selectedUser,
    setShowUserModal  // Make sure this prop is used
}: LeftSectionProps) {
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'friends' | 'followers' | 'discover'>('discover');
    const [allUsers, setAllUsers] = useState<SearchUser[]>([]);
    const [tabUsers, setTabUsers] = useState<SearchUser[]>([]);
    const [friendsCount, setFriendsCount] = useState(0);
    const [postsCount, setPostsCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        if (isUserModalVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isUserModalVisible]);


    // COUNT THE AMOUNT OF FRIENDS, POSTS AND FOLLOWING
    // START HERE
    useEffect(() => {
        if (!userData?.id) return;

        // Friends Count
        const friendshipRef = collection(db, 'friendship');
        const friendshipQuery = query(
            friendshipRef,
            where('userId1', '==', userData.id),
            where('friendshipStatus', '==', 'accepted')
        );

        // Posts Count
        const postsRef = collection(db, 'feedPosts');
        const postsQuery = query(postsRef, where('userId', '==', userData.id));

        // Following Count
        const followingRef = collection(db, 'followers');
        const followingQuery = query(followingRef, where('followerId', '==', userData.id));

        const unsubscribeFriends = onSnapshot(friendshipQuery, (snapshot) => {
            setFriendsCount(snapshot.docs.length);
        });

        const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
            setPostsCount(snapshot.docs.length);
        });

        const unsubscribeFollowing = onSnapshot(followingQuery, (snapshot) => {
            setFollowingCount(snapshot.docs.length);
        });

        return () => {
            unsubscribeFriends();
            unsubscribePosts();
            unsubscribeFollowing();
        };
    }, [userData?.id]);
    // END HERE


    // FETCH ALL USERS AND SET THEM TO ALL USERS STATE BASED ON THE ACTIVE TAB
    // START HERE
    const TabButton = ({ active, onClick, children }) => (
        <button
            onClick={onClick}
            className={`flex-1 py-2 text-sm font-medium transition-colors
            ${active ? 'text-greenTheme border-b-2 border-greenTheme' : 'text-gray-500'}`}
        >
            {children}
        </button>
    );

    const fetchAllUsers = async () => {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);

        const usersWithProfiles = await Promise.all(
            snapshot.docs.map(async (userDoc) => {
                const userData = userDoc.data();

                const profileImagesQuery = query(
                    collection(db, 'profileImages'),
                    where('userId', '==', userDoc.id)
                );
                const profileImagesSnapshot = await getDocs(profileImagesQuery);

                const profileSetAsQuery = query(
                    collection(db, 'profileImageSetAs'),
                    where('userId', '==', userDoc.id),
                    where('setAs', '==', 'profile')
                );
                const setAsSnapshot = await getDocs(profileSetAsQuery);

                let profileImageUrl = null;
                if (!setAsSnapshot.empty) {
                    const setAsDoc = setAsSnapshot.docs[0].data();
                    const matchingImage = profileImagesSnapshot.docs
                        .find(img => img.id === setAsDoc.profileImageId);
                    if (matchingImage) {
                        profileImageUrl = matchingImage.data().imageURL;
                    }
                }

                return {
                    id: userDoc.id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    userName: userData.userName,
                    profileImage: profileImageUrl
                };
            })
        );

        setAllUsers(usersWithProfiles);
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);


    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [displayUsers, setDisplayUsers] = useState<SearchUser[]>([]);

    useEffect(() => {
        setDisplayUsers(tabUsers);
    }, [tabUsers]);

    const handleLocalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();
        setLocalSearchTerm(searchTerm);

        if (searchTerm === '') {
            setDisplayUsers(tabUsers);
            return;
        }

        const filtered = tabUsers.filter(user =>
            user?.userName?.toLowerCase().includes(searchTerm) ||
            user?.firstName?.toLowerCase().includes(searchTerm) ||
            user?.lastName?.toLowerCase().includes(searchTerm)
        );
        setDisplayUsers(filtered);
    };




    useEffect(() => {
        if (!userData?.id) return;

        switch (activeTab) {
            case 'discover': {
                const friendshipRef = collection(db, 'friendship');
                const friendshipQuery = query(
                    friendshipRef,
                    where('userId1', '==', userData.id),
                    where('friendshipStatus', '==', 'accepted')
                );

                const unsubscribe = onSnapshot(friendshipQuery, (snapshot) => {
                    const friendIds = snapshot.docs.map(doc => doc.data().userId2);
                    // Filter out friends and current user from discover list
                    const discoverUsers = allUsers.filter(user =>
                        !friendIds.includes(user.id) && user.id !== userData.id
                    );
                    setTabUsers(discoverUsers);
                });

                return () => unsubscribe();
            }
            case 'friends': {
                const friendshipRef = collection(db, 'friendship');
                const friendshipQuery = query(
                    friendshipRef,
                    where('userId1', '==', userData.id),
                    where('friendshipStatus', '==', 'accepted')
                );

                const unsubscribe = onSnapshot(friendshipQuery, (snapshot) => {
                    const friendIds = snapshot.docs.map(doc => doc.data().userId2);
                    const friendUsers = allUsers.filter(user => friendIds.includes(user.id));
                    setTabUsers(friendUsers);
                });

                return () => unsubscribe();
            }
            case 'followers': {
                const followersRef = collection(db, 'followers');
                const followersQuery = query(
                    followersRef,
                    where('followeeId', '==', auth.currentUser?.uid)
                );

                const unsubscribe = onSnapshot(followersQuery, (snapshot) => {
                    const followerIds = snapshot.docs.map(doc => doc.data().followerId);
                    const followerUsers = allUsers.filter(user => followerIds.includes(user.id));
                    setTabUsers(followerUsers);
                });

                return () => unsubscribe();
            }

        }
    }, [userData?.id, allUsers, activeTab]);
    // END HERE


    const handleUnfriend = async (userId: string) => {
        const friendshipRef = collection(db, 'friendship');
        // Add unfriend logic here
    };

    const handleFollowBack = async (userId: string) => {
        const followersRef = collection(db, 'followers');
        // Add follow back logic here
    };


    // ADD A FRIEND LOGIC
    // START HERE

    const handleAddFriend = async () => {
        if (!userData?.id || !selectedUser?.id) return;

        try {
            const friendshipRef = collection(db, 'friendship');
            const timestamp = new Date();

            await addDoc(friendshipRef, {
                userId1: userData.id,
                userId2: selectedUser.id,
                friendshipStatus: 'pending',
                typeOfFriendship: 'friend',
                createdAt: timestamp,
                updatedAt: timestamp
            });

            console.log('Friendship created:', {
                user1: userData.firstName,
                user2: selectedUser.firstName,
                status: 'accepted',
                type: 'friend'
            });

            setIsUserModalVisible(false);
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    // END HERE

    // ADD A FOLLOWING LOGIC
    // START HERE
    const [isFollowing, setIsFollowing] = useState(false);
    useEffect(() => {
        const checkFollowingStatus = async () => {
            if (!selectedUser?.id) return;

            const followingRef = collection(db, 'followers');
            const q = query(
                followingRef,
                where('followerId', '==', auth.currentUser?.uid),
                where('followeeId', '==', selectedUser.id)
            );
            const snapshot = await getDocs(q);
            setIsFollowing(!snapshot.empty);
        };
        checkFollowingStatus();
    }, [selectedUser?.id]);


    const handleFollow = async () => {
        if (!userData?.id || !selectedUser?.id) return;

        try {
            const followersRef = collection(db, 'followers');
            const timestamp = new Date();

            if (isFollowing) {
                const q = query(
                    followersRef,
                    where('followerId', '==', userData.id),
                    where('followeeId', '==', selectedUser.id)
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    await deleteDoc(snapshot.docs[0].ref);
                }
            } else {
                await addDoc(followersRef, {
                    followerId: userData.id,
                    followeeId: selectedUser.id,
                    createdAt: timestamp,
                    updatedAt: timestamp
                });
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        }
    };

    // END HERE

    return (
        <>
            {/* Wrapper for entire section */}
            <section
                className="bg-white rounded-lg shadow-md 
                            p-3 order-2 lg:order-1 sticky top-36
                            h-[calc(100vh-9rem)] overflow-y-auto 
                            scrollbar-thin scrollbar-thumb-gray-200 
                            hidden lg:block w-full"
            >
                {/* Profile Section */}
                <div className="flex flex-col items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                        {profileImage?.imageURL ? (
                            <Image
                                src={profileImage.imageURL}
                                alt={`${userData?.firstName}'s Profile Picture`}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                priority
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200" />
                        )}
                    </div>
                    <h3 className="font-semibold text-base">
                        {userData?.firstName} {userData?.lastName}
                    </h3>
                    <span className="text-xs text-gray-600">@{userData?.userName}</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center mb-3 text-sm">
                    <div className="flex flex-col">
                        <span className="font-bold text-greenTheme">{friendsCount}</span>
                        <span className="text-xs text-gray-600">Friends</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-greenTheme">{postsCount}</span>
                        <span className="text-xs text-gray-600">Posts</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-greenTheme">{followingCount}</span>
                        <span className="text-xs text-gray-600">Following</span>
                    </div>
                </div>

                {/* Search and Users Section */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b mb-3">
                        <TabButton
                            active={activeTab === 'friends'}
                            onClick={() => setActiveTab('friends')}
                        >
                            Friends
                        </TabButton>
                        <TabButton
                            active={activeTab === 'followers'}
                            onClick={() => setActiveTab('followers')}
                        >
                            Followers
                        </TabButton>
                        <TabButton
                            active={activeTab === 'discover'}
                            onClick={() => setActiveTab('discover')}
                        >
                            Discover
                        </TabButton>
                    </div>

                    {/* Search Input */}
                    <div className="relative mb-2">
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            className="w-full px-8 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-greenTheme/20"
                            value={localSearchTerm}
                            onChange={(e) => {
                                setLocalSearchTerm(e.target.value);
                                handleLocalSearch(e);
                            }}
                        />
                        <Search
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={16}
                        />
                    </div>

                    {/* Users List */}
                    <div className="flex-1 overflow-y-auto">
                        {displayUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
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
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-xs text-gray-400">
                                                    {user.firstName?.charAt(0)}
                                                    {user.lastName?.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">
                                            {`${user.firstName} ${user.lastName}`}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            @{user.userName}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Button based on tab */}
                                {activeTab === 'friends' && (
                                    <button
                                        onClick={() => handleUnfriend(user.id)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="unfriend"
                                    >
                                        <UserMinus size={16} />
                                    </button>
                                )}

                                {activeTab === 'followers' && (
                                    <button
                                        onClick={() => handleFollowBack(user.id)}
                                        className="p-1 text-greenTheme hover:bg-green-50 rounded-full transition-colors"
                                        title="follow back"
                                    >
                                        <UserPlus size={16} />
                                    </button>
                                )}

                                {activeTab === 'discover' && (
                                    <button
                                        onClick={() => {
                                            handleUserClick(user);
                                            setIsUserModalVisible(true);
                                        }}
                                        className="p-1 text-greenTheme hover:bg-green-50 rounded-full transition-colors"
                                        title="add user"
                                    >
                                        <Plus size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </section>


            {/* Modal */}
            {isUserModalVisible && selectedUser && (
                <UserModal
                    selectedUser={selectedUser}
                    setShowUserModal={setIsUserModalVisible}
                    onAddFriend={handleAddFriend}
                    onFollow={handleFollow}
                    isFollowing={isFollowing}
                />


            )}
        </>
    );
}
