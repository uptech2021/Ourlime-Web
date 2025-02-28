// app/api/verify-email/route.ts
import { EmailVerificationService } from '@/helpers/Auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (!token || !userId) {
        return NextResponse.redirect('/verify-email/failure');
    }

    const isVerified = await EmailVerificationService.verifyEmail(userId, token);

    if (isVerified) {
        return NextResponse.redirect('/verify-email/success');
    } else {
        return NextResponse.redirect('/verify-email/failure');
    }
}
