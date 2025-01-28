'use client';

import { useState, useEffect } from 'react';
import { Phone, Plus, X, Check, Loader2, PhoneCall, MessageSquare } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import PhoneInput from 'react-phone-number-input';
import { ContactSectionProps, Contact } from '@/types/userTypes';

const contactTypes = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'business', label: 'Business' },
    { value: 'emergency', label: 'Emergency' }
];

export default function ContactSection({ userData }: ContactSectionProps) {
    // Basic states
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState<string | null>(null);
    const [newContact, setNewContact] = useState({
        number: '',
        type: 'personal'
    });
    const [validationError, setValidationError] = useState('');

    // Animation and loading states
    const [loadingType, setLoadingType] = useState<string | null>(null);
    const [successType, setSuccessType] = useState<string | null>(null);

    // Verification states
    const [showVerification, setShowVerification] = useState<string | null>(null);
    const [verificationMethod, setVerificationMethod] = useState<'sms' | 'call' | null>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [timer, setTimer] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [verificationError, setVerificationError] = useState('');

    const [deleteTypeId, setDeleteTypeId] = useState<string | null>(null);
    const [deleteCountdown, setDeleteCountdown] = useState(10);
    const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
    const [deletingContactId, setDeletingContactId] = useState<string | null>(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const contactsQuery = query(
                    collection(db, 'contact'),
                    where('userId', '==', user.uid)
                );
                const contactsSnapshot = await getDocs(contactsQuery);
                const contactsData = contactsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const contactsWithSettings = await Promise.all(
                    contactsData.map(async (contact) => {
                        const contactData = {
                            id: contact.id,
                            ...contact
                        };

                        const setAsQuery = query(
                            collection(db, 'contactSetAs'),
                            where('contactId', '==', contactData.id)
                        );
                        const setAsSnapshot = await getDocs(setAsQuery);

                        return {
                            ...contactData,
                            settings: setAsSnapshot.docs.map(doc => ({
                                id: doc.id,
                                contactId: doc.data().contactId,
                                setAs: doc.data().setAs
                            }))
                        } as Contact;
                    })
                );

                setContacts(contactsWithSettings);
            }
        });

        return () => unsubscribe();
    }, []);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
            setTimer(60);
            setVerificationMethod(null);
            setVerificationError('Verification timeout. Please try again.');
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    const validateNumber = async (number: string) => {
        if (!number) {
            setValidationError('Phone number is required');
            return false;
        }

        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(number)) {
            setValidationError('Invalid phone number format');
            return false;
        }

        const existingNumberQuery = query(
            collection(db, 'contact'),
            where('contactNumber', '==', number),
            where('userId', '==', auth.currentUser?.uid)
        );

        const snapshot = await getDocs(existingNumberQuery);
        if (!snapshot.empty) {
            setValidationError('This number is already registered');
            return false;
        }

        setValidationError('');
        return true;
    };

    const handleAddContact = async () => {
        const user = auth.currentUser;
        if (!user || !newContact.number) return;

        const isValid = await validateNumber(newContact.number);
        if (!isValid) return;

        try {
            const contactRef = await addDoc(collection(db, 'contact'), {
                contactNumber: newContact.number,
                createdAt: new Date(),
                isVerified: false,
                updatedAt: new Date(),
                userId: user.uid
            });

            await addDoc(collection(db, 'contactSetAs'), {
                contactId: contactRef.id,
                setAs: newContact.type
            });

            // Refresh contacts list
            const updatedContactsQuery = query(
                collection(db, 'contact'),
                where('userId', '==', user.uid)
            );
            const updatedSnapshot = await getDocs(updatedContactsQuery);
            const updatedContacts = updatedSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const updatedContactsWithSettings = await Promise.all(
                updatedContacts.map(async (contact) => {
                    const contactData = {
                        id: contact.id,
                        ...contact
                    };

                    const setAsQuery = query(
                        collection(db, 'contactSetAs'),
                        where('contactId', '==', contactData.id)
                    );
                    const setAsSnapshot = await getDocs(setAsQuery);

                    return {
                        ...contactData,
                        settings: setAsSnapshot.docs.map(doc => ({
                            contactId: doc.data().contactId,
                            setAs: doc.data().setAs
                        }))
                    } as Contact;
                })
            );

            setContacts(updatedContactsWithSettings);
            setShowAddForm(false);
            setNewContact({ number: '', type: 'personal' });
            setValidationError('');

        } catch (error) {
            console.error('Error adding contact:', error);
            setValidationError('Failed to add contact. Please try again.');
        }
    };

    const handleAddNewType = async (contact: Contact, newType: string) => {
        const user = auth.currentUser;
        if (!user) return;

        setLoadingType(contact.id);
        try {
            await addDoc(collection(db, 'contactSetAs'), {
                contactId: contact.id,
                setAs: newType
            });

            // Refresh contacts list
            const updatedContactsQuery = query(
                collection(db, 'contact'),
                where('userId', '==', user.uid)
            );
            const updatedSnapshot = await getDocs(updatedContactsQuery);
            const updatedContacts = updatedSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const updatedContactsWithSettings = await Promise.all(
                updatedContacts.map(async (contact) => {
                    const contactData = {
                        id: contact.id,
                        ...contact
                    };

                    const setAsQuery = query(
                        collection(db, 'contactSetAs'),
                        where('contactId', '==', contactData.id)
                    );
                    const setAsSnapshot = await getDocs(setAsQuery);

                    return {
                        ...contactData,
                        settings: setAsSnapshot.docs.map(doc => ({
                            contactId: doc.data().contactId,
                            setAs: doc.data().setAs
                        }))
                    } as Contact;
                })
            );

            setContacts(updatedContactsWithSettings);
            setSuccessType(contact.id);
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

    // Add this function with other functions
    const handleDeleteType = (contactId: string, typeId: string) => {
        console.log('Starting delete process for type:', typeId);
        setDeleteTypeId(typeId);
        setDeletingContactId(contactId);

        const countdownInterval = setInterval(() => {
            setDeleteCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);

                    const typeRef = doc(db, 'contactSetAs', typeId);

                    deleteDoc(typeRef)
                        .then(() => {
                            console.log('Successfully deleted type:', typeId);

                            // Update local state to remove the deleted type
                            setContacts(prevContacts =>
                                prevContacts.map(contact => ({
                                    ...contact,
                                    settings: contact.settings.filter(setting => setting.id !== typeId)
                                }))
                            );
                        })
                        .catch(error => {
                            console.log('Delete operation failed:', error);
                        })
                        .finally(() => {
                            setDeleteTypeId(null);
                            setDeletingContactId(null);
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
        setDeletingContactId(null);
        setDeleteCountdown(10);
    };

    const handleStartVerification = (contactId: string) => {
        setShowVerification(contactId);
        setVerificationError('');
        setVerificationCode('');
        setVerificationMethod(null);
    };

    const handleSelectVerificationMethod = (method: 'sms' | 'call') => {
        setVerificationMethod(method);
        setIsTimerRunning(true);
        setTimer(60);
        // Placeholder for actual verification sending logic
        console.log(`Sending verification via ${method}`);
    };

    const handleVerifyCode = async (contactId: string) => {
        if (!verificationCode) {
            setVerificationError('Please enter verification code');
            return;
        }

        try {
            // Placeholder for actual verification logic
            const isValid = verificationCode === '123456'; // This will be replaced with actual verification

            if (isValid) {
                const contactRef = doc(db, 'contact', contactId);
                await updateDoc(contactRef, {
                    isVerified: true,
                    updatedAt: new Date()
                });

                // Refresh contacts to show verified status
                const user = auth.currentUser;
                if (user) {
                    const updatedContactsQuery = query(
                        collection(db, 'contact'),
                        where('userId', '==', user.uid)
                    );
                    const updatedSnapshot = await getDocs(updatedContactsQuery);
                    const updatedContacts = updatedSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    const updatedContactsWithSettings = await Promise.all(
                        updatedContacts.map(async (contact) => {
                            const contactData = {
                                id: contact.id,
                                ...contact
                            };

                            const setAsQuery = query(
                                collection(db, 'contactSetAs'),
                                where('contactId', '==', contactData.id)
                            );
                            const setAsSnapshot = await getDocs(setAsQuery);

                            return {
                                ...contactData,
                                settings: setAsSnapshot.docs.map(doc => ({
                                    contactId: doc.data().contactId,
                                    setAs: doc.data().setAs
                                }))
                            } as Contact;
                        })
                    );

                    setContacts(updatedContactsWithSettings);
                }

                setShowVerification(null);
                setVerificationMethod(null);
                setVerificationCode('');
                setIsTimerRunning(false);
                setTimer(60);
            } else {
                setVerificationError('Invalid verification code');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            setVerificationError('Failed to verify code. Please try again.');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getAvailableTypes = (contact: Contact) => {
        const usedTypes = contact.settings.map(s => s.setAs);
        return contactTypes.filter(type => !usedTypes.includes(type.value));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                    <Phone className="text-greenTheme" />
                    Contact Numbers
                </h3>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-greenTheme hover:bg-green-50 rounded-lg transition-colors"
                    aria-label="Add new contact number"
                >
                    <Plus size={16} />
                    Add Contact
                </button>
            </div>

            <div className="space-y-3">
                {contacts.map((contact) => (
                    <div
                        key={contact.id}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-all"
                    >
                        <Phone className="w-5 h-5 text-greenTheme" aria-hidden="true" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="text-gray-900">{contact.contactNumber}</p>
                                {contact.isVerified ? (
                                    <span className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1 rounded-full border border-green-100 shadow-sm">
                                        <div className="relative">
                                            <div className="absolute inset-0 animate-ping bg-green-400 rounded-full opacity-20"></div>
                                            <div className="relative w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                                <Check size={10} className="text-white" />
                                            </div>
                                        </div>
                                        <span className="font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
                                            Verified
                                        </span>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleStartVerification(contact.id)}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Verify Now
                                    </button>
                                )}
                            </div>

                            {/* Verification UI */}
                            {showVerification === contact.id && !verificationMethod && (
                                <div className="mt-2 flex items-center gap-2">
                                    <button
                                        onClick={() => handleSelectVerificationMethod('sms')}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <MessageSquare size={12} />
                                        Verify via SMS
                                    </button>
                                    <button
                                        onClick={() => handleSelectVerificationMethod('call')}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <PhoneCall size={12} />
                                        Verify via Call
                                    </button>
                                </div>
                            )}

                            {showVerification === contact.id && verificationMethod && (
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            placeholder="Enter verification code"
                                            className="w-32 px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:ring-2 focus:ring-greenTheme focus:border-transparent"
                                            maxLength={6}
                                        />
                                        <span className="text-xs text-gray-500">{formatTime(timer)}</span>
                                        <button
                                            onClick={() => handleVerifyCode(contact.id)}
                                            className="px-3 py-1.5 text-xs bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                    {verificationError && (
                                        <p className="text-xs text-red-500">{verificationError}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2 mt-1 relative">
                                {contact.settings.map((setting, idx) => (
                                    <span key={idx} className="text-sm px-2 py-0.5 bg-gray-100 rounded-full text-gray-600 flex items-center gap-1">
                                        {setting.setAs}
                                        {setting.setAs !== 'personal' && (
                                            <button
                                                onClick={() => handleDeleteType(contact.id, setting.id)}
                                                className="ml-1 text-red-500"
                                                aria-label={`Delete ${setting.setAs} type`}
                                            >
                                                <X size={12} />
                                            </button>


                                        )}
                                    </span>
                                ))}

                                {/* Delete Notification */}
                                {deleteTypeId && deletingContactId === contact.id && (
                                    <div className="fixed transform translate-x-1/2 bg-white shadow-lg rounded-lg px-3 py-2 text-xs flex items-center gap-2 whitespace-nowrap border border-gray-100 z-50">
                                        <span className="text-red-500 font-medium">Deleting in {deleteCountdown}s</span>
                                        <button
                                            onClick={cancelDelete}
                                            className="text-blue-600 font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}

                                {getAvailableTypes(contact).length > 0 && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowTypeDropdown(showTypeDropdown === contact.id ? null : contact.id)}
                                            className="text-xs text-gray-400 hover:text-greenTheme transition-colors flex items-center gap-1"
                                            aria-label="Add another type"
                                        >
                                            {loadingType === contact.id ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : successType === contact.id ? (
                                                <Check size={12} className="text-green-500" />
                                            ) : (
                                                <Plus size={12} className="transition-transform group-hover:rotate-90" />
                                            )}
                                            <span>
                                                {loadingType === contact.id ? 'Adding...' :
                                                    successType === contact.id ? 'Added!' : 'Add type'}
                                            </span>
                                        </button>
                                        {showTypeDropdown === contact.id && (
                                            <div className="absolute z-10 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100">
                                                {getAvailableTypes(contact).map(type => (
                                                    <button
                                                        key={type.value}
                                                        onClick={() => handleAddNewType(contact, type.value)}
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

                {showAddForm && (
                    <div className="p-4 bg-green-50 rounded-xl space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-900">Add New Contact</h4>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setValidationError('');
                                }}
                                className="p-1 hover:bg-green-100 rounded-full transition-colors"
                                aria-label="Close add contact form"
                            >
                                <X size={16} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <PhoneInput
                                value={newContact.number}
                                onChange={(value) => setNewContact({ ...newContact, number: value || '' })}
                                className="phone rounded-lg overflow-hidden"
                                defaultCountry="TT"
                                international
                                withCountryCallingCode
                                inputClass="w-full border-none text-black placeholder-black focus:outline-none bg-white p-2"
                                autoComplete="off"
                                numberInputProps={{
                                    maxLength: 15,
                                    'aria-label': 'Phone number input'
                                }}
                                placeholder="Enter phone number"
                            />
                            {validationError && (
                                <p className="text-sm text-red-500" role="alert">{validationError}</p>
                            )}
                        </div>

                        <select
                            value={newContact.type}
                            onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
                            className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-greenTheme focus:border-transparent"
                            aria-label="Select contact type"
                        >
                            {contactTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setValidationError('');
                                }}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddContact}
                                className="px-4 py-2 text-sm bg-greenTheme text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Save Contact
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}