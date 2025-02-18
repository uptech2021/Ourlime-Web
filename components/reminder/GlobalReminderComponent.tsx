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
            await globalReminders.checkAndProcessReminders();
        };

        checkReminders();
        /// Check reminders every 5 minutes
        // use this duriing lopmentdeve
        const interval = setInterval(checkReminders, 5 * 60 * 1000);

        // Check reminders every 10 minutes
        // usethis when launched
        // const interval = setInterval(checkReminders, 10 * 60 * 1000);

        return () => clearInterval(interval);
    }, [userData.id]);

    return null;
};
