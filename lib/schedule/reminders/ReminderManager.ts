// lib/schedule/reminders/ReminderManager.ts
import { NotificationService } from '../notifications/NotificationService';
import { WhatsappService } from '../whatsapp/WhatsappService';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export class ReminderManager {
    private static instance: ReminderManager;
    private notificationService: NotificationService;
    private whatsappService: WhatsappService;

    private constructor() {
        this.notificationService = NotificationService.getInstance();
        this.whatsappService = WhatsappService.getInstance();
    }

    public static getInstance(): ReminderManager {
        if (!ReminderManager.instance) {
            ReminderManager.instance = new ReminderManager();
        }
        return ReminderManager.instance;
    }

    private shouldClearSession(schedule: any): boolean {
        const now = new Date();
        const [endHours, endMinutes] = schedule.endTime.split(':');
        const endTime = new Date();
        endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);
        
        return now.getTime() > endTime.getTime();
    }

    private clearSessionIfNeeded(userId: string, schedule: any): void {
        if (this.shouldClearSession(schedule)) {
            const key = `sentReminders_${userId}`;
            localStorage.removeItem(key);
        }
    }

    private hasReminderBeenSent(userId: string, scheduleId: string): boolean {
        const key = `sentReminders_${userId}`;
        const sentReminders = JSON.parse(localStorage.getItem(key) || '{}');
        return !!sentReminders[scheduleId];
    }

    private markReminderAsSent(userId: string, scheduleId: string): void {
        const key = `sentReminders_${userId}`;
        const sentReminders = JSON.parse(localStorage.getItem(key) || '{}');
        sentReminders[scheduleId] = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(sentReminders));
    }

    private determineStatus(schedule: any) {
        const now = new Date();
        const today = now.toLocaleDateString('en-US', { weekday: 'long' });
        
        if (schedule.day !== today) return 'not-due';

        const [hours, minutes] = schedule.startTime.split(':');
        const scheduleTime = new Date();
        scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0);

        const timeDiff = scheduleTime.getTime() - now.getTime();
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));

        if (minutesDiff <= 20 && minutesDiff > 0) {
            return 'upcoming';
        }
        return 'not-due';
    }

    private filterUpcomingSchedules(schedules: any[]) {
        return schedules.filter(schedule => 
            this.determineStatus(schedule) === 'upcoming'
        );
    }

    async processReminders(schedules: any[]) {
        for (const schedule of schedules) {
            const userDoc = await getDoc(doc(db, 'users', schedule.id));
            const userEmail = userDoc.data()?.email;

            if (!userEmail) continue;

            const upcomingSchedules = this.filterUpcomingSchedules(schedule.schedules);
            
            for (const upcomingSchedule of upcomingSchedules) {
                this.clearSessionIfNeeded(schedule.id, upcomingSchedule);
                
                if (this.hasReminderBeenSent(schedule.id, upcomingSchedule.id)) continue;

                if (upcomingSchedule.reminders?.email) {
                    const response = await fetch('/api/reminders/email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            email: userEmail, 
                            schedule: upcomingSchedule 
                        })
                    });

                    if (response.ok) {
                        this.markReminderAsSent(schedule.id, upcomingSchedule.id);
                    }
                }

                if (upcomingSchedule.reminders?.notification) {
                    await this.notificationService.sendReminder(
                        schedule.id,
                        `Your class ${upcomingSchedule.subject} starts in 25 minutes`
                    );
                }

                if (upcomingSchedule.reminders?.whatsapp && userDoc.data()?.phone) {
                    await this.whatsappService.sendReminder(
                        userDoc.data().phone,
                        `Reminder: Your class ${upcomingSchedule.subject} starts at ${upcomingSchedule.startTime}`
                    );
                }
            }
        }
    }
}
