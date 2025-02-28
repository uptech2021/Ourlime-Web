'use client';

import { useState } from 'react';
import { RenderTabs } from './renderTabs/RenderTabs';
import { FriendMessages } from './renderMessages/friends/Friends';
import { Search } from 'lucide-react';
import { BusinessMessages } from './renderMessages/business/Business';

interface ChatWindowProps {
    isCompact: boolean;
}

export const ChatWindow = ({ isCompact }: ChatWindowProps) => {
    const [activeTab, setActiveTab] = useState<'friends' | 'business' | 'discover'>('friends');
    const [selectedFriend, setSelectedFriend] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabChange = (newTab: 'friends' | 'business' | 'discover') => {
        setActiveTab(newTab);
        setSelectedFriend(null); // Clear selected friend when switching tabs
    };

    if (isCompact) {
        return (
            <div className="flex flex-col h-full">
                {!selectedFriend ? (
                    <>
                        <div className="p-2 md:p-4 border-b border-gray-200">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab === 'friends' ? 'friends' : 'rooms'}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 md:px-4 py-1.5 md:py-2 pl-8 md:pl-10 text-sm md:text-base bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                                />
                                <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="border-b border-gray-200">
                            <RenderTabs
                                activeTab={activeTab}
                                setActiveTab={handleTabChange}
                                setSelectedFriend={setSelectedFriend}
                            />

                        </div>

                    </>
                ) : (
                    selectedFriend.isBusinessInquiry ? (
                        <BusinessMessages 
                            selectedFriend={selectedFriend} 
                            isCompact={isCompact} 
                            onBack={() => setSelectedFriend(null)} 
                        />
                    ) : (
                        <FriendMessages 
                            selectedFriend={selectedFriend} 
                            isCompact={isCompact} 
                            onBack={() => setSelectedFriend(null)} 
                        />
                    )
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-full">
            <div className="lg:w-[30%] lg:border-r border-gray-200">
                <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={`Search ${activeTab === 'friends' ? 'friends' : 'rooms'}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-2 py-1.5 pl-8 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenTheme"
                        />
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>
                <div className="border-b border-gray-200">

                    <RenderTabs
                        activeTab={activeTab}
                        setActiveTab={handleTabChange}
                        setSelectedFriend={setSelectedFriend}
                    />

                </div>
            </div>

            <div className="flex-1 lg:w-[70%]">
                {selectedFriend ? (
                    selectedFriend.isBusinessInquiry ? (
                        <BusinessMessages
                            selectedFriend={selectedFriend}
                            isCompact={isCompact}
                            onBack={() => setSelectedFriend(null)}
                        />
                    ) : (
                        <FriendMessages
                            selectedFriend={selectedFriend}
                            isCompact={isCompact}
                            onBack={() => setSelectedFriend(null)}
                        />
                    )
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <p className="text-xs lg:text-sm">Select a chat to start messaging</p>
                    </div>
                )}

            </div>
        </div>
    );
};
