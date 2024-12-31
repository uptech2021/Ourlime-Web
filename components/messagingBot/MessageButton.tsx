'use client';

import React, { useEffect, useState } from 'react';
import { FaComments } from 'react-icons/fa';
import { IoAttach, IoClose, IoPaperPlaneOutline, IoHappyOutline } from 'react-icons/io5';

import EmojiPicker, { Theme } from 'emoji-picker-react';
// import { IoAttach, IoPaperPlaneOutline, IoHappyOutline } from 'react-icons/io5';

interface MessageButtonProps {
    onTogglePanel: () => void;
    isOpen: boolean;
}

export const MessageButton: React.FC<MessageButtonProps> = ({ onTogglePanel, isOpen: propIsOpen }) => {
    const [isOpen, setIsOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('chatOpen') === 'true'
        }
        return false
    });

    const [selectedFriend, setSelectedFriend] = useState(() => {
        if (typeof window !== 'undefined') {
            return Number(localStorage.getItem('selectedFriend')) || 1
        }
        return 1
    });

    useEffect(() => {
        const storedChatOpen = localStorage.getItem('chatOpen') === 'true';
        if (storedChatOpen) {
            onTogglePanel();
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('chatOpen', isOpen.toString());
    }, [isOpen]);

    useEffect(() => {
        localStorage.setItem('selectedFriend', selectedFriend.toString());
    }, [selectedFriend]);

    const mockFriends = [
        { id: 1, name: 'John', imageUrl: 'https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1' },
        { id: 2, name: 'Jane', imageUrl: 'https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1' },
        { id: 3, name: 'Mike', imageUrl: 'https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1' },
        { id: 4, name: 'Sarah', imageUrl: 'https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1' },
        { id: 5, name: 'David', imageUrl: 'https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1' },
        { id: 6, name: 'Emily', imageUrl: 'https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1' },
        { id: 7, name: 'Michael', imageUrl: 'https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1' },
        { id: 8, name: 'Olivia', imageUrl: 'https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1' },
        { id: 9, name: 'William', imageUrl: 'https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1' },
        { id: 10, name: 'Sophia', imageUrl: 'https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1' },
    ];

    const messagesByFriend = {
        1: [
            { id: 1, message: "Hey, how are you?", isUser: false },
            { id: 2, message: "I'm good, thanks!", isUser: true },
            { id: 3, message: "Want to hang out?", isUser: false },
            { id: 4, message: "Sure, when?", isUser: true },
            { id: 5, message: "Want to hang out?", isUser: false },
            { id: 6, message: "Hey, how are you?", isUser: false },
            { id: 7, message: "I'm good, thanks!", isUser: true },
            { id: 8, message: "Want to hang out?", isUser: false },
            { id: 9, message: "Sure, when?", isUser: true },
            { id: 10, message: "Want to hang out?", isUser: false },
        ],
        2: [
            { id: 1, message: "Did you see the new movie?", isUser: false },
            { id: 2, message: "Not yet, is it good?", isUser: true },
            { id: 3, message: "Yes, it's amazing!", isUser: false },
            { id: 4, message: "I'll check it out", isUser: true },
        ],
        3: [
            { id: 1, message: "Let's meet tomorrow", isUser: false },
            { id: 2, message: "Sure, what time?", isUser: true },
            { id: 3, message: "How about 2pm?", isUser: false },
            { id: 4, message: "Perfect!", isUser: true },
        ],
    };

    const currentMessages = messagesByFriend[selectedFriend];

    const [updateMessage, setUpdateMessage] = useState('');
    const [messageToUpdate, setMessageToUpdate] = useState(null);

    const handleUpdateClick = (message) => {
        setMessageToUpdate(message.id);
        setUpdateMessage(message.message);
    };

    const handleCancelUpdate = () => {
        setMessageToUpdate(null);
        setUpdateMessage('');
    };

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showEmojiPicker && !(event.target as Element).closest('.emoji-picker-container')) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmojiPicker]);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredFriends = mockFriends.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full bg-primary shadow-lg
                transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform origin-bottom-right hover:bg-primary/90
                ${propIsOpen
                    ? 'sm:w-[350px] md:w-[450px] w-[90vw] sm:h-[500px] h-[80vh] rounded-lg scale-100 translate-y-0 sm:right-4 right-2 sm:bottom-4 bottom-2'
                    : 'w-14 h-14 rounded-full scale-95 translate-y-2 cursor-pointer'
                }`}
            onClick={!propIsOpen ? onTogglePanel : undefined}
        >
            {propIsOpen ? (
                <div className="w-full h-full p-4 flex flex-col transition-opacity duration-300 delay-300 opacity-0 [&:not(:empty)]:opacity-100">

                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-white text-lg font-bold">Messages</h2>
                                <span className="text-white/70">• {mockFriends.find(f => f.id === selectedFriend)?.name}</span>
                            </div>
                            <IoClose className="text-white h-6 w-6 hover:text-gray-200 cursor-pointer" onClick={onTogglePanel} />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search friends..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/10 text-white text-xs rounded-md px-2 py-1 flex-1 outline-none"
                            />
                            <select
                                className="bg-white/10 text-white text-xs rounded-md px-1 py-1 outline-none [&>option]:bg-gray-800"
                                aria-label="Filter messages"
                            >
                                <option value="all">All</option>
                                <option value="read">Read</option>
                                <option value="unread">Unread</option>
                            </select>
                        </div>
                    </div>

                    <div className="h-px bg-white/20 my-4" />

                    {/* Body - adjust height to be dynamic */}
                    <div className="flex gap-2 flex-1 min-h-0">
                        <div
                            className="flex-1 overflow-y-auto pr-2 space-y-6 pt-6 scrollbar-hide"
                            onWheel={(e) => {
                                const element = e.currentTarget;
                                const isAtBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
                                const isAtTop = element.scrollTop === 0;

                                if ((isAtBottom && e.deltaY > 0) || (isAtTop && e.deltaY < 0)) {
                                    e.stopPropagation();
                                }
                            }}
                        >
                            {currentMessages ? (
                                currentMessages.map(msg => (
                                    <div key={msg.id} className={`relative ${msg.isUser ? 'pr-6' : 'pl-6'}`}>
                                        <div className={`absolute -top-4 ${msg.isUser ? 'right-0' : 'left-0'}`}>
                                            <img
                                                src="https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1"
                                                alt="Profile"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className={`max-w-[70%] ${msg.isUser ? 'ml-auto bg-blue-500' : 'bg-white/10'} p-3 rounded-lg`}>
                                                <p className="text-white text-sm">{msg.message}</p>
                                            </div>

                                            {msg.isUser && (
                                                <div className="flex gap-2 mt-1 justify-end">
                                                    <button
                                                        onClick={() => messageToUpdate === msg.id ? handleCancelUpdate() : handleUpdateClick(msg)}
                                                        className="text-[10px] text-white/70 hover:text-white transition-colors"
                                                    >
                                                        {messageToUpdate === msg.id ? 'Cancel' : 'Update'}
                                                    </button>
                                                    <button className="text-[10px] text-red-300 hover:text-red-500 transition-colors">Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-white/70">
                                    <p>No messages yet</p>
                                    <p className="text-sm">Start a conversation!</p>
                                </div>
                            )}
                        </div>

                        <div className="w-12 overflow-y-auto overflow-x-hidden flex flex-col items-center pt-6 scrollbar-hide">
                            
                            {filteredFriends.map(friend => (
                                <div
                                    key={friend.id}
                                    onClick={() => setSelectedFriend(friend.id)}
                                    className="mb-2 flex justify-center cursor-pointer relative"
                                >
                                    <div className="relative">
                                        <img
                                            src={friend.imageUrl}
                                            alt={friend.name}
                                            className={`w-8 h-8 rounded-full object-cover transition-all duration-200
                                                hover:ring-2 hover:ring-blue-400
                                                ${selectedFriend === friend.id
                                                    ? 'ring-2 ring-blue-400 scale-110'
                                                    : 'hover:scale-105'
                                                }`}
                                            title={friend.name}
                                        />

                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">!</span>

                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                    <div className="h-px bg-white/20 mt-4 mb-2" />


                    {/* Footer */}
                    <div className="flex items-center p-2 bg-white/10 rounded-lg relative">
                        <div className="flex items-center gap-2 mr-3">
                            <IoHappyOutline
                                className="h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            />
                            {showEmojiPicker && (
                                <div className="absolute bottom-12 left-0 emoji-picker-container">
                                    <div className="relative">
                                        <IoClose
                                            className="absolute -top-2 -right-2 h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors z-10 bg-gray-800 rounded-full"
                                            onClick={() => setShowEmojiPicker(false)}
                                        />
                                        <EmojiPicker
                                            onEmojiClick={(emojiObject) => {
                                                setUpdateMessage((prev) => prev + emojiObject.emoji);
                                                setShowEmojiPicker(false);
                                            }}
                                            theme={Theme.DARK}
                                            width={300}
                                            height={400}
                                            previewConfig={{
                                                showPreview: false
                                            }}
                                            lazyLoadEmojis
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        {messageToUpdate && (
                            <span className="text-blue-400 select-none mr-1">@update/text/</span>
                        )}
                        <input
                            type="text"
                            value={updateMessage}
                            onChange={(e) => setUpdateMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full bg-transparent text-white placeholder-white/50 outline-none mr-4"
                        />
                        <div className="flex gap-2">
                            <IoPaperPlaneOutline className="h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
                            <IoAttach className="h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>


                </div>
            ) : (
                <FaComments className="h-6 w-6 text-white hover:text-gray-200 transition-colors" />
            )}
        </div>
    );
};
