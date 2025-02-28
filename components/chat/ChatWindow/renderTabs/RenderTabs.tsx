'use client';

import { Users, Globe, Briefcase } from 'lucide-react';
import { Friends } from '../renderContent/friends/Friends';
import { Business } from '../renderContent/business/Business';
import { Discover } from '../renderContent/discover/Discover';

interface RenderTabsProps {
    activeTab: 'friends' | 'business' | 'discover';
    setActiveTab: (tab: 'friends' | 'business' | 'discover') => void;
    setSelectedFriend: (friend: any) => void;
}

export const RenderTabs = ({ activeTab, setActiveTab, setSelectedFriend }: RenderTabsProps) => {
    const renderContent = () => {
        switch (activeTab) {
            case 'friends':
                return <Friends setSelectedFriend={setSelectedFriend} />;
                case 'business':
                    return <Business setSelectedFriend={setSelectedFriend} />;
            case 'discover':
                return <Discover />;
            default:
                return <Friends setSelectedFriend={setSelectedFriend} />;
        }
    };

    return (
        <>
            <div className="grid grid-cols-3 w-full">
                {[
                    { id: 'friends', icon: Users, label: 'Friends' },
                    { id: 'business', icon: Briefcase, label: 'Business' },
                    { id: 'discover', icon: Globe, label: 'Discover' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center justify-center gap-2 py-3 transition-all relative
                            ${activeTab === tab.id ? 'text-greenTheme font-medium' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-greenTheme" />
                        )}
                    </button>
                ))}
            </div>
            {renderContent()}
        </>
    );
};
