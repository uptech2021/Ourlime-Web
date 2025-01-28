'use client';

import { useState } from 'react';
import { User, Edit2, X, Check, Lock, Loader2 } from 'lucide-react';
import { Timestamp, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseConfig';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { UserData } from '@/types/userTypes';
import { useProfileStore } from '@/src/store/useProfileStore';
import { Select, SelectItem } from '@nextui-org/react';
import { countries } from 'countries-list';

interface BasicInformationProps {
    userData: UserData;
}


export default function BasicInformationSection({ userData }: BasicInformationProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { country } = useProfileStore();

    const [editedData, setEditedData] = useState({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        userName: userData.userName || '',
        country: userData.country || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSave = async () => {
        setLoading(true);
        setError('');

        // Required fields validation
        if (!editedData.firstName.trim()) {
            setError('First name is required');
            setLoading(false);
            return;
        }

        if (!editedData.lastName.trim()) {
            setError('Last name is required');
            setLoading(false);
            return;
        }

        if (!editedData.userName.trim()) {
            setError('Username is required');
            setLoading(false);
            return;
        }

        if (editedData.userName.length < 3) {
            setError('Username must be at least 3 characters long');
            setLoading(false);
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                setError('Please login to update information');
                return;
            }

            // Username uniqueness check
            if (editedData.userName.trim() !== userData.userName) {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('userName', '==', editedData.userName));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setError('Username already exists');
                    return;
                }
            }

            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                firstName: editedData.firstName.trim(),
                lastName: editedData.lastName.trim(),
                userName: editedData.userName.trim(),
                country: editedData.country,
                updatedAt: Timestamp.now()
            });

            useProfileStore.getState().setUserName(editedData.userName);
            useProfileStore.getState().setFirstName(editedData.firstName);
            useProfileStore.getState().setLastName(editedData.lastName);
            useProfileStore.getState().setCountry(editedData.country);

            setIsEditing(false);

        } catch (err) {
            console.error('Update error:', err);
            setError('Failed to update information');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        setLoading(true);
        setError('');

        // Password validation checks
        if (passwordData.newPassword === passwordData.currentPassword) {
            setError('New password must be different from current password');
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const user = auth.currentUser;

            // Re-authenticate user before password change
            const credential = EmailAuthProvider.credential(
                user.email,
                passwordData.currentPassword
            );

            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, passwordData.newPassword);

            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

        } catch (err) {
            if (err.code === 'auth/wrong-password') {
                setError('Current password is incorrect');
            } else {
                setError('Failed to update password. Please try again');
                console.error('Password update error:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <User className="text-greenTheme" />
                    Basic Information
                </h3>
                {!isEditing && !isChangingPassword && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-greenTheme hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                        <Edit2 size={16} />
                        Edit Information
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            Email
                            <Lock size={14} className="text-gray-400" />
                        </p>
                        <p className="text-gray-900">{userData.email}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                        {isEditing ? (
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">Username</label>
                                <input
                                    aria-label='Username'
                                    type="text"
                                    value={editedData.userName}
                                    onChange={(e) => setEditedData({ ...editedData, userName: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                />
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-gray-500">Username</p>
                                <p className="text-gray-900">@{userData.userName}</p>
                            </>
                        )}
                    </div>

                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        {isEditing ? (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-gray-500 block mb-1">First Name</label>
                                    <input
                                        aria-label='first-name'
                                        type="text"
                                        value={editedData.firstName}
                                        onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 block mb-1">Last Name</label>
                                    <input
                                        aria-label='last-name'
                                        type="text"
                                        value={editedData.lastName}
                                        onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="text-gray-900">{userData.firstName} {userData.lastName}</p>
                            </>
                        )}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">

                        {isEditing ? (
                            <div>
                                <label className="text-sm text-gray-500 block mb-1">Country</label>
                                <Select
                                    label="Select country"
                                    selectedKeys={editedData.country ? [editedData.country] : []}
                                    onChange={(e) => setEditedData({ ...editedData, country: e.target.value })}
                                >
                                    {Object.entries(countries).map(([code, countryData]) => (
                                        <SelectItem key={code} value={code}>
                                            {countryData.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-gray-500">Country</p>
                                <p className="text-gray-900">
                                    {(country || userData.country) ? countries[country || userData.country].name : 'Not specified'}
                                </p>
                            </>
                        )}


                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500">Joined</p>
                        <p className="text-gray-900">
                            {userData.createdAt instanceof Timestamp
                                ? userData.createdAt.toDate().toLocaleString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                    timeZone: 'UTC'
                                })
                                : 'Not available'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {(isEditing || isChangingPassword) && (
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setIsChangingPassword(false);
                            setError('');
                        }}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={isChangingPassword ? handlePasswordChange : handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check size={16} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            )}

            {!isEditing && !isChangingPassword && (
                <button
                    onClick={() => setIsChangingPassword(true)}
                    className="mt-6 text-sm text-blue-600 hover:text-blue-700"
                >
                    Change Password
                </button>
            )}

            {isChangingPassword && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl space-y-4">
                    <h4 className="font-medium text-gray-900">Change Password</h4>
                    <div className="space-y-3">
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-greenTheme"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
