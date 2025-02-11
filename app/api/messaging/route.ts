import { NextResponse } from 'next/server';
import { MessagingService } from '@/lib/messaging/MessagingService';

export async function POST(request: Request) {
    console.log('==================');
    console.log('API ROUTE STARTED');
    console.log('==================');
    
    try {
        const { receiverId, message, senderId } = await request.json();
        
        const messagingService = MessagingService.getInstance();
        const chatId = [senderId, receiverId].sort().join('_');
        const savedMessage = await messagingService.sendMessage(receiverId, message, senderId);
        
        return NextResponse.json({
            status: 'success',
            data: savedMessage,
            chatId
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to save message',
            details: error.message
        }, { status: 500 });
    }
}
