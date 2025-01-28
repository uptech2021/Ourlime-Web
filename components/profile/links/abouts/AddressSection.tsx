'use client';

import { useState, useEffect } from 'react';
import { MapPinned, Plus, X, Check, Loader2, Edit2, Trash } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseConfig';
import { Address, AddressSectionProps } from '@/types/userTypes';

const addressTypes = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
    { value: 'business', label: 'Business' },
    { value: 'shipping', label: 'Shipping' },
    { value: 'billing', label: 'Billing' }
];

export default function AddressSection({ userData }: AddressSectionProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState<string | null>(null);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [newAddress, setNewAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        zipCode: '',
        type: 'home'
    });

    const [loadingType, setLoadingType] = useState<string | null>(null);
    const [successType, setSuccessType] = useState<string | null>(null);
    const [deleteTypeId, setDeleteTypeId] = useState<string | null>(null);
    const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
    const [deleteCountdown, setDeleteCountdown] = useState(10);
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
    const [isDeletingFullAddress, setIsDeletingFullAddress] = useState(false);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const addressesQuery = query(
            collection(db, 'addresses'),
            where('userId', '==', user.uid)
        );

        const addressesSnapshot = await getDocs(addressesQuery);
        const addressesData = addressesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const addressesWithSettings = await Promise.all(
            addressesData.map(async (address) => {
                const setAsQuery = query(
                    collection(db, 'addressSetAs'),
                    where('addressId', '==', address.id)
                );
                const setAsSnapshot = await getDocs(setAsQuery);

                return {
                    ...address,
                    settings: setAsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        addressId: doc.data().addressId,
                        setAs: doc.data().setAs
                    }))
                } as Address;
            })
        );

        setAddresses(addressesWithSettings);
    };

    const handleAddAddress = async () => {
        const user = auth.currentUser;
        if (!user || !newAddress.address) return;

        try {
            const addressRef = await addDoc(collection(db, 'addresses'), {
                address: newAddress.address,
                city: newAddress.city,
                postalCode: newAddress.postalCode,
                zipCode: newAddress.zipCode,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                userId: user.uid
            });

            await addDoc(collection(db, 'addressSetAs'), {
                addressId: addressRef.id,
                setAs: newAddress.type
            });

            await fetchAddresses();
            setShowAddForm(false);
            setNewAddress({
                address: '',
                city: '',
                postalCode: '',
                zipCode: '',
                type: 'home'
            });
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const handleEditAddress = async () => {
        if (!editingAddress) return;

        try {
            const addressRef = doc(db, 'addresses', editingAddress.id);
            await updateDoc(addressRef, {
                address: editingAddress.address,
                city: editingAddress.city,
                postalCode: editingAddress.postalCode,
                zipCode: editingAddress.zipCode,
                updatedAt: Timestamp.now()
            });

            await fetchAddresses();
            setEditingAddress(null);
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    const handleDeleteFullAddress = async (addressId: string) => {
        setDeletingAddressId(addressId);
        setIsDeletingFullAddress(true);

        const countdownInterval = setInterval(async () => {
            setDeleteCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);

                    // Delete all associated types first
                    const deleteTypes = async () => {
                        const address = addresses.find(a => a.id === addressId);
                        if (address) {
                            await Promise.all(
                                address.settings.map(setting =>
                                    deleteDoc(doc(db, 'addressSetAs', setting.id))
                                )
                            );
                        }
                    };

                    // Then delete the address
                    deleteTypes()
                        .then(() => deleteDoc(doc(db, 'addresses', addressId)))
                        .then(() => {
                            setAddresses(prev => prev.filter(a => a.id !== addressId));
                        })
                        .catch(error => {
                            console.error('Error deleting address:', error);
                        })
                        .finally(() => {
                            setDeletingAddressId(null);
                            setIsDeletingFullAddress(false);
                            setDeleteCountdown(10);
                        });
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleDeleteType = async (addressId: string, typeId: string) => {
        setDeleteTypeId(typeId);
        setDeletingAddressId(addressId);

        const countdownInterval = setInterval(() => {
            setDeleteCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);

                    deleteDoc(doc(db, 'addressSetAs', typeId))
                        .then(async () => {
                            const updatedAddresses = addresses.map(address => {
                                if (address.id === addressId) {
                                    const updatedSettings = address.settings.filter(
                                        setting => setting.id !== typeId
                                    );

                                    // If no types remain, delete the entire address
                                    if (updatedSettings.length === 0) {
                                        handleDeleteFullAddress(addressId);
                                        return null;
                                    }

                                    return {
                                        ...address,
                                        settings: updatedSettings
                                    };
                                }
                                return address;
                            }).filter(Boolean) as Address[];

                            setAddresses(updatedAddresses);
                        })
                        .catch(error => {
                            console.error('Error deleting type:', error);
                        })
                        .finally(() => {
                            setDeleteTypeId(null);
                            setDeletingAddressId(null);
                            setDeleteCountdown(10);
                        });
                }
                return prev - 1;
            });
        }, 1000);
    };

    const cancelDelete = () => {
        if (deleteTimer) {
            clearInterval(deleteTimer);
        }
        setDeleteTypeId(null);
        setDeletingAddressId(null);
        setDeleteCountdown(10);
        setIsDeletingFullAddress(false);
    };

    const handleAddNewType = async (address: Address, newType: string) => {
        const user = auth.currentUser;
        if (!user) return;

        setLoadingType(address.id);
        try {
            await addDoc(collection(db, 'addressSetAs'), {
                addressId: address.id,
                setAs: newType
            });

            await fetchAddresses();
            setSuccessType(address.id);
            setTimeout(() => {
                setSuccessType(null);
                setShowTypeDropdown(null);
            }, 2000);
        } catch (error) {
            console.error('Error adding new type:', error);
        } finally {
            setLoadingType(null);
        }
    };

    const getAvailableTypes = (address: Address) => {
        const usedTypes = address.settings.map(s => s.setAs);
        return addressTypes.filter(type => !usedTypes.includes(type.value));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <MapPinned className="text-greenTheme" />
                    Addresses
                </h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-greenTheme hover:bg-green-50 rounded-lg transition-colors"
                >
                    <Plus size={16} />
                    Add Address
                </button>
            </div>

            <div className="space-y-4">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className="border border-gray-100 rounded-xl overflow-visible" // Changed from overflow-hidden
                    >
                        <div className="bg-gray-50 p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-500">Street Address</label>
                                        <p className="text-gray-900">{address.address}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">City</label>
                                        <p className="text-gray-900">{address.city}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Postal Code</label>
                                        <p className="text-gray-900">{address.postalCode}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">ZIP Code</label>
                                        <p className="text-gray-900">{address.zipCode}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => setEditingAddress(address)}
                                        className="p-2 text-gray-400 hover:text-greenTheme hover:bg-green-50 rounded-lg transition-colors"
                                        title="Edit address"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteFullAddress(address.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete address"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-4">
                                {address.settings.map((setting) => (
                                    <span key={setting.id} className="text-sm px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 flex items-center gap-1">
                                        {setting.setAs}
                                        <button
                                            onClick={() => handleDeleteType(address.id, setting.id)}
                                            className="ml-1 text-red-500"
                                            aria-label={`Delete ${setting.setAs} type`}
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}

                                {(deleteTypeId || isDeletingFullAddress) && deletingAddressId === address.id && (
                                    <div className="fixed transform translate-x-1/2 bg-white shadow-lg rounded-lg px-3 py-2 text-xs flex items-center gap-2 whitespace-nowrap border border-gray-100 z-[999]">
                                        <span className="text-red-500 font-medium">
                                            {isDeletingFullAddress ? 'Deleting address' : 'Deleting type'} in {deleteCountdown}s
                                        </span>
                                        <button
                                            onClick={cancelDelete}
                                            className="text-blue-600 font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}

                                {getAvailableTypes(address).length > 0 && (
                                    <div className="relative inline-block">
                                        <button
                                            onClick={() => setShowTypeDropdown(showTypeDropdown === address.id ? null : address.id)}
                                            className="text-xs text-gray-400 hover:text-greenTheme transition-colors flex items-center gap-1"
                                        >
                                            {loadingType === address.id ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : successType === address.id ? (
                                                <Check size={12} className="text-green-500" />
                                            ) : (
                                                <Plus size={12} />
                                            )}
                                            <span>
                                                {loadingType === address.id ? 'Adding...' :
                                                    successType === address.id ? 'Added!' : 'Add type'}
                                            </span>
                                        </button>

                                        {showTypeDropdown === address.id && (
                                            <div className="absolute left-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-[999]">
                                                {getAvailableTypes(address).map(type => (
                                                    <button
                                                        key={type.value}
                                                        onClick={() => handleAddNewType(address, type.value)}
                                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                                    >
                                                        {type.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}


                {(showAddForm || editingAddress) && (
                    <div className="p-4 bg-green-50 rounded-xl space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-900">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h4>
                            <button
                                title='Close'
                                onClick={() => {
                                    setShowAddForm(false);
                                    setEditingAddress(null);
                                }}
                                className="p-1 hover:bg-green-100 rounded-full transition-colors"
                            >
                                <X size={16} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Street Address</label>
                                <input
                                    aria-label="Street Address"
                                    type="text"
                                    value={editingAddress ? editingAddress.address : newAddress.address}
                                    onChange={(e) => editingAddress
                                        ? setEditingAddress({ ...editingAddress, address: e.target.value })
                                        : setNewAddress({ ...newAddress, address: e.target.value })
                                    }
                                    className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-greenTheme focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">City</label>
                                <input
                                    aria-label="City"
                                    type="text"
                                    value={editingAddress ? editingAddress.city : newAddress.city}
                                    onChange={(e) => editingAddress
                                        ? setEditingAddress({ ...editingAddress, city: e.target.value })
                                        : setNewAddress({ ...newAddress, city: e.target.value })
                                    }
                                    className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-greenTheme focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Postal Code</label>
                                <input
                                    aria-label='postal code'
                                    type="text"
                                    value={editingAddress ? editingAddress.postalCode : newAddress.postalCode}
                                    onChange={(e) => editingAddress
                                        ? setEditingAddress({ ...editingAddress, postalCode: e.target.value })
                                        : setNewAddress({ ...newAddress, postalCode: e.target.value })
                                    }
                                    className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-greenTheme focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">ZIP Code</label>
                                <input
                                    aria-label='zip code'
                                    type="text"
                                    value={editingAddress ? editingAddress.zipCode : newAddress.zipCode}
                                    onChange={(e) => editingAddress
                                        ? setEditingAddress({ ...editingAddress, zipCode: e.target.value })
                                        : setNewAddress({ ...newAddress, zipCode: e.target.value })
                                    }
                                    className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-greenTheme focus:border-transparent"
                                />
                            </div>
                        </div>

                        {!editingAddress && (
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Type</label>
                                <select
                                    title='Type'
                                    value={newAddress.type}
                                    onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                                    className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-greenTheme focus:border-transparent"
                                >
                                    {addressTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setEditingAddress(null);
                                }}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingAddress ? handleEditAddress : handleAddAddress}
                                className="px-4 py-2 text-sm bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                {editingAddress ? 'Save Changes' : 'Save Address'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}