import { useState, Dispatch, SetStateAction } from 'react';
import { Plus, Search, X } from 'lucide-react';
import Image from 'next/image';
import { UserData, SearchUser } from '@/types/userTypes';

type LeftSectionProps = {
    profileImage: { imageURL: string } | null;
    userData: UserData | null;
    searchTerm: string;
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filteredUsers: (UserData | SearchUser)[];
    handleUserClick: (user: UserData | SearchUser) => void;
    selectedUser: UserData | null;
};

// Define the props for UserModal
type UserModalProps = {
    selectedUser: UserData; // Ensure UserData is imported
    setShowUserModal: Dispatch<SetStateAction<boolean>>;
};

const UserModal = ({ selectedUser, setShowUserModal }: UserModalProps) => (
    <>
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]" />
        <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                <div className="relative p-6">
                    <button
                        onClick={() => setShowUserModal(false)}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="close"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-greenTheme/20">
                            {selectedUser?.profileImage ? (
                                <Image
                                    src={selectedUser.profileImage}
                                    alt={selectedUser.firstName}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                    loader={({ src }) => src}
                                    unoptimized={true}
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

                        <h3 className="text-2xl font-bold text-gray-900">{selectedUser?.firstName} {selectedUser?.lastName}</h3>
                        <p className="text-gray-500 mb-4">@{selectedUser?.userName}</p>

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

                        <div className="flex gap-3 w-full">
                            <button className="flex-1 py-2.5 bg-greenTheme text-white rounded-xl font-medium hover:bg-green-600 transition-colors">
                                Follow
                            </button>
                            <button className="flex-1 py-2.5 border-2 border-greenTheme text-greenTheme rounded-xl font-medium hover:bg-green-50 transition-colors">
                                Add Friend
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default function LeftSection({
    profileImage,
    userData,
    searchTerm,
    handleSearch,
    filteredUsers,
    handleUserClick,
    selectedUser,
}: LeftSectionProps) {
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);

    return (
        <section className="
						fixed left-0 lg:w-[280px] xl:w-[400px]
						bg-white rounded-lg shadow-md 
						p-3
						order-2 lg:order-1
						top-36
						h-[calc(100vh-9rem)]
						overflow-y-auto
						scrollbar-thin scrollbar-thumb-gray-200
						hidden lg:block
						">
            {/* Profile section - made more compact */}
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
                            unoptimized={true}
                            loader={({ src }) => src}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200" />
                    )}
                </div>
                <h3 className="font-semibold text-base">{userData?.firstName} {userData?.lastName}</h3>
                <span className="text-xs text-gray-600">@{userData?.userName}</span>
            </div>

            {/* Stats Grid - more compact */}
            <div className="grid grid-cols-3 gap-2 text-center mb-3 text-sm">
                <div className="flex flex-col">
                    <span className="font-bold text-greenTheme">245</span>
                    <span className="text-xs text-gray-600">Friends</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-greenTheme">128</span>
                    <span className="text-xs text-gray-600">Posts</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-greenTheme">1.2k</span>
                    <span className="text-xs text-gray-600">Following</span>
                </div>
            </div>

            {/* Search and Users Section */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="relative mb-2">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full px-8 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-greenTheme/20"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredUsers.map((user) => (
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
                                            unoptimized={true}
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
                                    <span className="font-medium text-sm">{`${user.firstName} ${user.lastName}`}</span>
                                    <span className="text-xs text-gray-500">@{user.userName}</span>
                                </div>
                            </div>
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
                        </div>
                    ))}
                </div>
            </div>

            {isUserModalVisible && selectedUser && <UserModal selectedUser={selectedUser} setShowUserModal={setIsUserModalVisible} />}
        </section>
    );
}