// components/reminders/GlobalReminders.tsx
'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@/src/store/useProfileStore';

export const GlobalReminders = () => {
    const userData = useProfileStore();

    useEffect(() => {
        const checkSchedules = async () => {
            // Check for upcoming schedules
            // Send notifications if needed
        };

        const interval = setInterval(checkSchedules, 5 * 60 * 1000); // Every 5 minutes
        return () => clearInterval(interval);
    }, []);

    return null; // No visual component needed
};
