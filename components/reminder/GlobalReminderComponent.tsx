// components/GlobalReminderComponent.tsx
'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@/src/store/useProfileStore';
import { GlobalReminders } from '@/lib/schedule/reminders/GlobalReminders';

export const GlobalReminderComponent = () => {
    const userData = useProfileStore();
    const globalReminders = GlobalReminders.getInstance();

    useEffect(() => {
        if (!userData.id) return;

        const checkReminders = async () => {
            console.log('Starting reminder check');
            console.log('User data:', userData);
            await globalReminders.checkAndProcessReminders();
        };

        checkReminders();
        const interval = setInterval(checkReminders, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [userData.id]);

    return null;
};
