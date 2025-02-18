// app/api/test/email/route.ts
import { TestReminderService } from '@/lib/schedule/test/TestReminderService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        const testService = TestReminderService.getInstance();
        const result = await testService.testEmail(email);
        
        return NextResponse.json({ 
            status: 'success', 
            result 
        });
    } catch (error) {
        return NextResponse.json({ 
            status: 'error', 
            message: error.message 
        }, { 
            status: 500 
        });
    }
}
