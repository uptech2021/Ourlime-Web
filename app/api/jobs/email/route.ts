import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/job/email/EmailService';

export async function POST(request: NextRequest) {
    try {
        const { to, from, applicationData } = await request.json();
        const emailService = EmailService.getInstance();
        
        await emailService.sendApplicationNotification(
            to,
            from,
            applicationData
        );
        
        return NextResponse.json({
            status: 'success',
            message: 'Application notification sent successfully'
        });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to send application notification'
        }, { status: 500 });
    }
}
