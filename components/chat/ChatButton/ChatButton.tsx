'use client';

import { MessageCircle, X, Minimize2, Maximize2, Video, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChatWindow } from '../ChatWindow/ChatWindow';

type WindowSize = 'closed' | 'compact' | 'full';

export const ChatButton = () => {
    const [windowSize, setWindowSize] = useState<WindowSize>('closed');
    const [hasNotifications, setHasNotifications] = useState(true);

    const getWindowStyles = () => {
        switch (windowSize) {
            case 'compact':
                return 'bottom-6 right-6 w-[400px] h-[500px]';
            case 'full':
                return 'bottom-0 right-0 w-[800px] h-[90vh]';
            default:
                return '';
        }
    };

    const handleClose = () => {
        const element = document.querySelector('.chat-window');
        element?.classList.remove('animate-expand');
        element?.classList.add('animate-collapse');

        setTimeout(() => {
            setWindowSize('closed');
        }, 500); // animation duration from css
    };

    return (
        <div className="fixed bottom-20 right-8 z-50">
            {windowSize === 'closed' && (
                <button
                    onClick={() => setWindowSize('compact')}
                    className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-greenTheme text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 group animate-bounce-subtle"
                >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform duration-300" />
                    {hasNotifications && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full border-[1px] md:border-2 border-white animate-pulse" />
                    )}
                </button>
            )}
            {windowSize !== 'closed' && (
                    <div
                        className={`chat-window fixed bg-white rounded-lg shadow-2xl 
                            ${windowSize === 'compact'
                                ? 'bottom-8 right-8 w-[90vw] md:w-[400px] h-[75vh] md:h-[500px]'
                                : 'bottom-8 right-8 w-[90vw] md:w-[800px] h-[80vh]'
                            }
                            animate-expand origin-bottom-right
                            max-w-[calc(100%-4rem)] max-h-[calc(100vh-4rem)]
                            transition-all duration-300 ease-in-out
                            mx-auto md:mx-0`}
                    >

                    <div className="h-12 border-b border-gray-200 flex justify-between items-center px-2 md:px-4">
                        <div className="text-sm font-medium text-gray-700">Messages</div>
                        <div className="flex gap-2">
                            <button
                                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Voice Call"
                            >
                                <Phone className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Video Call"
                            >
                                <Video className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                                onClick={() => setWindowSize(windowSize === 'compact' ? 'full' : 'compact')}
                                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title={windowSize === 'compact' ? 'Expand' : 'Minimize'}
                            >
                                {windowSize === 'compact' ? (
                                    <Maximize2 className="w-4 h-4 text-gray-600" />
                                ) : (
                                    <Minimize2 className="w-4 h-4 text-gray-600" />
                                )}
                            </button>
                            <button
                                title='Close'
                                onClick={handleClose}
                                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>


                    <div className="h-[calc(100%-3rem)] overflow-hidden">
                        <ChatWindow isCompact={windowSize === 'compact'} />
                    </div>
                </div>
            )}

        </div>
    );

};
