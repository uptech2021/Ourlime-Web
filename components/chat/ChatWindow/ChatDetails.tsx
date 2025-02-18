'use client';

import { X, Image as ImageIcon, FileText, Link, Bell, Phone, Video } from 'lucide-react';
import Image from 'next/image';

interface ChatDetailsProps {
    activeChat: any;
    onClose: () => void;
}

export const ChatDetails = ({ activeChat, onClose }: ChatDetailsProps) => {
    return (
        <div className="h-full bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold">Chat Details</h3>
                <button
                    title='close' 
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Profile Section */}
                <div className="p-4 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                        <Image
                            src={activeChat?.avatar || 'https://via.placeholder.com/80'}
                            alt={activeChat?.name || 'User'}
                            fill
                            className="object-cover rounded-full"
                        />
                    </div>
                    <h3 className="font-semibold text-lg">{activeChat?.name}</h3>
                    <p className="text-sm text-gray-500">@{activeChat?.username}</p>
                </div>

                {/* Quick Actions */}
                <div className="px-4 py-2 border-t border-b border-gray-200">
                    <div className="grid grid-cols-3 gap-2">
                        <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Phone className="w-5 h-5 text-greenTheme" />
                            <span className="text-xs mt-1">Call</span>
                        </button>
                        <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Video className="w-5 h-5 text-greenTheme" />
                            <span className="text-xs mt-1">Video</span>
                        </button>
                        <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bell className="w-5 h-5 text-greenTheme" />
                            <span className="text-xs mt-1">Mute</span>
                        </button>
                    </div>
                </div>

                {/* Shared Content */}
                <div className="p-4">
                    <h4 className="font-medium mb-3">Shared Content</h4>
                    <div className="space-y-4">
                        {/* Media */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <ImageIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">Media</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="aspect-square relative rounded-lg overflow-hidden bg-gray-200">
                                        <Image
                                            src={`https://picsum.photos/100?random=${item}`}
                                            alt="Shared media"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Files */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">Files</span>
                            </div>
                            <div className="space-y-2">
                                {['Document.pdf', 'Presentation.pptx'].map((file) => (
                                    <div key={file} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm truncate">{file}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Link className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">Links</span>
                            </div>
                            <div className="space-y-2">
                                {['https://example.com', 'https://docs.example.com'].map((link) => (
                                    <div key={link} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                                        <Link className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm truncate">{link}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
