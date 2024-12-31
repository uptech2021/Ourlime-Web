'use client';

import Navbar from '@/comm/Navbar';
import React, { useEffect, useRef, useState } from 'react';
import { BiMessage, BiPhone, BiInfoCircle, BiVideo } from 'react-icons/bi';
import { AiOutlineStar } from 'react-icons/ai';
import { IoClose, IoSettingsOutline } from 'react-icons/io5';

import { BsEmojiSmile } from 'react-icons/bs';
import { IoSendSharp } from 'react-icons/io5';
import { IoIosArrowDown, IoMdAttach } from 'react-icons/io';

import { BsThreeDotsVertical } from 'react-icons/bs';


export default function MessagesPage() {
    const mockFriends = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `Friend ${index + 1}`,
        status: index % 3 === 0 ? 'online' : 'offline',
        lastMessage: `Latest message from Friend ${index + 1}`,
        image: 'https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1'
    }));

    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(true);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        setCanScrollUp(element.scrollTop > 0);
        setCanScrollDown(element.scrollHeight - element.scrollTop > element.clientHeight + 1);
    };


    // Add this inside your component
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleTextareaInput = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const [showCallOptions, setShowCallOptions] = useState(false);
    const [selectedCallType, setSelectedCallType] = useState<'call' | 'video'>('call');

    const useIsMobile = () => {
        const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

        useEffect(() => {
            const handleResize = () => {
                setIsMobile(window.innerWidth < 768);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        return isMobile;
    };

    const isMobile = useIsMobile();

    const mockMessages = {
        1: [
            { id: 1, text: "Hey, how are you?", sender: 'friend', timestamp: new Date(Date.now() - 50 * 60000).toLocaleTimeString() },
            { id: 2, text: "I'm good, thanks!", sender: 'me', timestamp: new Date(Date.now() - 45 * 60000).toLocaleTimeString() },
            { id: 3, text: "Want to hang out?", sender: 'friend', timestamp: new Date(Date.now() - 40 * 60000).toLocaleTimeString() },
            { id: 4, text: "Sure, when?", sender: 'me', timestamp: new Date(Date.now() - 35 * 60000).toLocaleTimeString() },
            { id: 5, text: "How about tomorrow?", sender: 'friend', timestamp: new Date(Date.now() - 30 * 60000).toLocaleTimeString() }
        ],
        2: [
            { id: 1, text: "Did you see the new movie?", sender: 'friend', timestamp: new Date(Date.now() - 25 * 60000).toLocaleTimeString() },
            { id: 2, text: "Not yet, is it good?", sender: 'me', timestamp: new Date(Date.now() - 20 * 60000).toLocaleTimeString() },
            { id: 3, text: "Yes, it's amazing!", sender: 'friend', timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString() },
            { id: 4, text: "I'll check it out", sender: 'me', timestamp: new Date(Date.now() - 10 * 60000).toLocaleTimeString() }
        ],
        3: [
            { id: 1, text: "Let's meet tomorrow", sender: 'friend', timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString() },
            { id: 2, text: "Sure, what time?", sender: 'me', timestamp: new Date(Date.now() - 4 * 60000).toLocaleTimeString() },
            { id: 3, text: "How about 2pm?", sender: 'friend', timestamp: new Date(Date.now() - 3 * 60000).toLocaleTimeString() },
            { id: 4, text: "Perfect!", sender: 'me', timestamp: new Date(Date.now()).toLocaleTimeString() }
        ]
    };

    const [isModalOpen, setIsModalOpen] = useState(false);


    return (
        <Navbar>

            {isMobile ? (
                // Mobile layout

                <main className="h-[calc(100vh-56px)] bg-primary overflow-hidden">
                    <div className="flex flex-col h-full p-4 gap-4 fixed inset-x-0 top-14 bottom-0">

                        {/* Icons Container */}
                        <div className="flex justify-between items-center mb-4">
                            {/* Left Icons */}
                            <div className="flex gap-6">
                                <button className="text-white/70 hover:text-white" title="Messages">
                                    <BiMessage size={24} />
                                </button>
                                <button className="text-white/70 hover:text-white" title="Phone">
                                    <BiPhone size={24} />
                                </button>
                                <button className="text-white/70 hover:text-white" title="Favorites">
                                    <AiOutlineStar size={24} />
                                </button>
                            </div>

                            {/* Right Icons */}
                            <div className="flex items-center gap-6">
                                {selectedCallType === 'call' ? (
                                    <button className="text-white/70 hover:text-white" title="Voice Call">
                                        <BiPhone size={24} />
                                    </button>
                                ) : (
                                    <button className="text-white/70 hover:text-white" title="Video Call">
                                        <BiVideo size={24} />
                                    </button>
                                )}
                                <div className="relative">
                                    <button
                                        className="text-white/70 hover:text-white"
                                        onClick={() => setShowCallOptions(!showCallOptions)}
                                        title="Call Options"
                                    >
                                        <IoIosArrowDown
                                            size={16}
                                            className={`text-white transition-transform duration-200 ${showCallOptions ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                </div>
                                <button className="text-white/70 hover:text-white" title="More">
                                    <BsThreeDotsVertical size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Search and Select Container */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search friends..."
                                    className="w-full bg-white/10 text-white rounded-lg px-4 py-2 outline-none"
                                />
                            </div>
                            <div className="flex-1">
                                <select className="w-full bg-white/10 text-white rounded-lg px-4 py-2 outline-none" aria-label="Friend Status">
                                    <option value="all">All Friends</option>
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                </select>
                            </div>
                        </div>


                        {/* Friends Carousel */}
                        <div className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory h-[30%]">
                            <div className="flex gap-4 w-full py-2 overflow-y-hidden">
                                {Array.from({ length: Math.ceil(mockFriends.length / 4) }).map((_, index) => (
                                    <div key={index} className="min-w-full snap-start">
                                        <div className="grid grid-cols-2 gap-4 max-h-full">
                                            {mockFriends.slice(index * 4, (index + 1) * 4).map((friend) => (
                                                <button
                                                    key={friend.id}
                                                    className="bg-white/5 rounded-lg p-4 flex items-center gap-4"
                                                    title={`Chat with ${friend.name}`}
                                                >
                                                    <div className="relative w-[30%]">
                                                        <img
                                                            src={friend.image}
                                                            alt={friend.name}
                                                            className="w-full aspect-square rounded-full object-cover"
                                                        />
                                                        {friend.status === 'online' && (
                                                            <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-primary" />
                                                        )}
                                                    </div>
                                                    <div className="w-[70%]">
                                                        <h4 className="text-white font-medium text-base md:text-lg truncate">
                                                            {friend.name}
                                                        </h4>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Messages Area */}
                        <div className="h-[50%] bg-white/5 rounded-lg overflow-y-auto">
                            {/* Messages will go here */}
                            <div className="p-4">

                                <div className="h-[50%] bg-white/5 rounded-lg overflow-y-auto">
                                    <div className="p-4 flex flex-col gap-4">
                                        {mockMessages[1].map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'me'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-white/10 text-white'
                                                    }`}>
                                                    <p className="text-sm">{message.text}</p>
                                                    <span className="text-xs opacity-70 mt-1 block">
                                                        {message.timestamp}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="h-[10%] mt-auto pb-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="w-full bg-white/10 text-white rounded-lg px-4 py-3 outline-none cursor-pointer"
                                    onClick={() => setIsModalOpen(true)}
                                    readOnly
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70" title="Send message">
                                    <IoSendSharp size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Message Input Modal */}
                        {isModalOpen && (
                            <div
                                className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50"
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        setIsModalOpen(false);
                                    }
                                }}
                            >
                                <div className="bg-primary w-full rounded-t-xl p-4">
                                    <div className="flex justify-end mb-2">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="text-white/70 hover:text-white"
                                            title="Close modal"
                                        >
                                            <IoClose size={24} />
                                        </button>

                                    </div>
                                    <textarea
                                        autoFocus
                                        placeholder="Type your message..."
                                        className="w-full bg-white/10 text-white rounded-lg p-4 outline-none min-h-[200px] resize-none"
                                    />
                                    <div className="flex justify-start gap-4 mt-4">
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 text-white/70"
                                            title="Cancel message"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                            title="Send message"
                                        >
                                            Send
                                        </button>

                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </main>

            ) : (
                // Desktop layout (your current layout)
                <main className="flex h-[calc(100vh-56px)] bg-primary overflow-hidden">

                    <div className="w-96 border-r border-white/10">
                        <div className="flex h-[calc(100vh-96px)]">
                            {/* Left dark column */}
                            <div className="w-1/4 bg-white/5 h-full flex flex-col">
                                <div className="p-4">
                                    <img
                                        src="https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1"
                                        alt="Profile"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </div>

                                {/* Main Icons - Centered */}
                                <div className="flex-1 flex flex-col justify-center items-center gap-8">
                                    <button className="text-white/70 hover:text-white" title="Messages">
                                        <BiMessage size={24} />
                                    </button>
                                    <button className="text-white/70 hover:text-white" title="Phone">
                                        <BiPhone size={24} />
                                    </button>
                                    <button className="text-white/70 hover:text-white" title="Favorites">
                                        <AiOutlineStar size={24} />
                                    </button>
                                </div>

                                {/* Settings Icon - Bottom */}
                                <div className="p-4 flex justify-center">
                                    <button className="text-white/70 hover:text-white" title="Settings">
                                        <IoSettingsOutline size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Right content */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex h-20">
                                    {/* User Name */}
                                    <div className="w-1/3 flex flex-col p-4">
                                        <h3 className="text-white text-sm font-medium">Your Name</h3>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-white/70 text-xs italic">Online</span>
                                        </div>
                                    </div>

                                    {/* Search */}
                                    <div className="w-2/3 p-4">
                                        <input
                                            type="text"
                                            placeholder="Search friends..."
                                            className="w-full bg-white/10 text-white text-xs rounded-lg px-3 py-2 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Friends list */}

                                <div className="relative h-[calc(100vh-176px)]">
                                    <div
                                        className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] h-full mb-4"
                                        onScroll={handleScroll}
                                    >
                                        {mockFriends.map((friend) => (
                                            <button
                                                key={friend.id}
                                                className="flex items-center gap-3 p-4 hover:bg-white/5 cursor-pointer w-full text-left"
                                                title={`Chat with ${friend.name}`}
                                            >
                                                <img
                                                    src={friend.image}
                                                    alt={friend.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <h4 className="text-white text-sm">{friend.name}</h4>
                                                    <p className="text-white/70 text-xs">{friend.lastMessage}</p>
                                                </div>
                                                {friend.status === 'online' && (
                                                    <div className="w-2 h-2 rounded-full bg-green-500 ml-auto"></div>
                                                )}
                                            </button>
                                        ))}

                                    </div>

                                    {/* Scroll Indicators */}
                                    {canScrollUp && (
                                        <button className="absolute top-2 right-2 text-white/70 animate-pulse" title="Scroll up">
                                            ↑
                                        </button>
                                    )}
                                    {canScrollDown && (
                                        <button className="absolute bottom-2 right-2 text-white/70 animate-pulse" title="Scroll down">
                                            ↓
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="h-[40px] flex items-center border-t border-white/10 bg-white/5">
                            <span className="text-white/50 text-xl font-bold font-serif pl-6">Ourlime Messages</span>
                        </div>

                    </div>

                    {/* Messages Section */}
                    <div className="flex-1 bg-primary flex flex-col">
                        {/* Chat Header */}

                        <div className="h-20 border-b border-white/10 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        src="https://th.bing.com/th/id/OIP.UQ-rux2yo6AeJZqyJ-nzBQHaEo?pid=ImgDet&w=474&h=296&rs=1"
                                        alt="Chat Profile"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="w-3 h-3 bg-green-500 rounded-full absolute top-0 left-0 border-2 border-primary"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Friend's Name</h3>
                                    <span className="text-white/70 text-sm">Online</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {selectedCallType === 'call' ? (
                                    <button className="text-white/70 hover:text-white" title="Voice Call">
                                        <BiPhone size={24} />
                                    </button>
                                ) : (
                                    <button className="text-white/70 hover:text-white" title="Video Call">
                                        <BiVideo size={24} />
                                    </button>
                                )}
                                <div className="relative">
                                    <button
                                        className="text-white/70 hover:text-white"
                                        onClick={() => setShowCallOptions(!showCallOptions)}
                                        title='Call Options'
                                    >
                                        <IoIosArrowDown
                                            size={16}
                                            className={`text-white transition-transform duration-200 ${showCallOptions ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {showCallOptions && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white/10 rounded-lg overflow-hidden">
                                            <button
                                                className="flex items-center gap-2 w-full px-4 py-2 text-white/70 hover:bg-white/5"
                                                onClick={() => {
                                                    setSelectedCallType('call');
                                                    setShowCallOptions(false);
                                                }}
                                                title="Voice Call"
                                            >

                                                <BiPhone size={20} />
                                                <span>Voice Call</span>
                                            </button>
                                            <button
                                                className="flex items-center gap-2 w-full px-4 py-2 text-white/70 hover:bg-white/5"
                                                onClick={() => {
                                                    setSelectedCallType('video');
                                                    setShowCallOptions(false);
                                                }}
                                                title="Video Call"
                                            >
                                                <BiVideo size={20} />
                                                <span>Video Call</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button className="text-white/70 hover:text-white" title="Info" >
                                    <BiInfoCircle size={24} />
                                </button>
                                <button className="text-white/70 hover:text-white" title="More">
                                    <BsThreeDotsVertical size={24} />
                                </button>
                            </div>

                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto p-4">
                            Messages will go here
                        </div>

                        {/* Chat Footer */}
                        <div className="h-20 border-t border-white/10 p-4 flex items-end justify-center">
                            <div className="relative w-[87%]">
                                <button className="absolute left-3 bottom-[18px] text-white/70 hover:text-white" title="Emoji">
                                    <BsEmojiSmile size={20} />
                                </button>
                                <textarea
                                    ref={textareaRef}
                                    placeholder="Type a message..."
                                    className="w-full bg-white/10 text-white rounded-lg pl-12 pr-44 py-3 outline-none resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                                    rows={1}
                                    onInput={handleTextareaInput}
                                />
                                <div className="absolute right-3 bottom-[18px] flex gap-4 mr-8">
                                    <button className="text-white/70 hover:text-white" title="Attach">
                                        <IoMdAttach size={20} />
                                    </button>
                                    <button className="text-white/70 hover:text-white" title="Send">
                                        <IoSendSharp size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>

                </main>
            )}
        </Navbar>
    );
}
