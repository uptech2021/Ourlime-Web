import { EmailService } from '@/lib/schedule/email/EmailService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { email, schedule } = await request.json();
    const emailService = EmailService.getInstance();
    const result = await emailService.sendScheduleReminder(email, schedule);
    
    return NextResponse.json({ status: 'success', result });
}
