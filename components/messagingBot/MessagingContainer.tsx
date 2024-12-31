'use client';
import { useEffect, useState } from 'react';
import { MessageButton } from './MessageButton';

export default function MessagingContainer() {
  // Initialize state from localStorage on mount
  const [isOpen, setIsOpen] = useState(() => {
    // Check localStorage only after component mounts
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('chatOpen');
      return savedState ? JSON.parse(savedState) : false;
    }
    return false;
  });

  // Update localStorage whenever isOpen changes
  useEffect(() => {
    localStorage.setItem('chatOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  const handleTogglePanel = () => {
    setIsOpen(prev => !prev);
  };

  return <MessageButton onTogglePanel={handleTogglePanel} isOpen={isOpen} />;
}
