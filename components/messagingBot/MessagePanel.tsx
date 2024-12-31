'use client';

import React from 'react';

interface MessagePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessagePanel: React.FC<MessagePanelProps> = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`fixed bottom-20 right-4 z-50 w-96 rounded-lg border border-gray-300 bg-white shadow-lg 
      transition-all duration-300 ease-in-out
      ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 transform origin-bottom-right'}`}
    >
      {/* Panel content */}
    </div>
  );
};
