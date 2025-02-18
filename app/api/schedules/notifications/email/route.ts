// app/api/schedules/notifications/email/route.ts
import { NextResponse } from 'next/server';
import { EmailService } from '@/lib/schedule/email/EmailService';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const emailService = EmailService.getInstance();
        const result = await emailService.sendScheduleReminder(data.email, data.schedule);
       
        return NextResponse.json({
            status: 'success',
            message: 'Email notification sent',
            data: data,
            result: result
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            name: error.name,
            stack: error.stack
        }, {
            status: 500
        });
    }
}
