import { RegistrationEmailService } from '@/lib/register/email/EmailService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const data = await request.json();
    const emailService = RegistrationEmailService.getInstance();
    await emailService.sendVerificationEmail(data);
    return NextResponse.json({ success: true });
}
