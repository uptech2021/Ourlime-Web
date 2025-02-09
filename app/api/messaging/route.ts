import { NextResponse } from 'next/server';
import { MessagingService } from '@/lib/messaging/MessagingService';

export async function POST(request: Request) {
    console.log('==================');
    console.log('API ROUTE STARTED');
    console.log('==================');
    
    try {
        const { receiverId, message, senderId } = await request.json();
        console.log('Received data:', { receiverId, message, senderId });
        
        const messagingService = MessagingService.getInstance();
        const savedMessage = await messagingService.sendMessage(receiverId, message, senderId);
        
        console.log('Message saved:', savedMessage);
        return NextResponse.json({
            status: 'success',
            data: savedMessage
        });
    } catch (error) {
        console.log('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to save message',
            details: error.message
        }, { status: 500 });
    }
}
