import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: { email: string; photoURL: string | undefined; userName: string | undefined }[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, users }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden'); // Add class to disable scrolling
        } else {
            document.body.classList.remove('overflow-hidden'); // Remove class to enable scrolling
        }

        return () => {
            document.body.classList.remove('overflow-hidden'); // Clean up on unmount
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-5 w-4/5 md:w-1/3 relative">
                <h2 className="text-lg font-bold mb-4">Likes</h2>
                <button onClick={onClose} className="absolute top-2 right-2">
                    <X className="h-6 w-6 text-gray-600" />
                </button>
                <div>
                    {users.map(user => (
                        <div key={user.email} className="flex items-center mb-2">
                            <img src={user.photoURL || "/images/home/userPicture.png"} alt={user.userName} className="h-10 w-10 rounded-full mr-2" />
                            <span>{user.userName}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Modal; 