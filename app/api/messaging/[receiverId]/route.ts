import { NextResponse } from 'next/server';
import { MessagingService } from '@/lib/messaging/MessagingService';

export async function GET(
    request: Request,
    { params }: { params: { receiverId: string } }
) {
    const { searchParams } = new URL(request.url);
    const senderId = searchParams.get('senderId');
    const receiverId = params.receiverId;
    const chatId = [senderId, receiverId].sort().join('_');

    const messagingService = MessagingService.getInstance();
    
    try {
        const messages = await messagingService.getMessages(receiverId, senderId);
        
        return NextResponse.json({
            debug: {
                chatId,
                receiverId,
                senderId,
                url: request.url,
                messagesFound: messages?.length || 0,
                error: null
            },
            status: 'success',
            messages: messages || []
        });
    } catch (error) {
        return NextResponse.json({
            debug: {
                chatId,
                receiverId,
                senderId,
                url: request.url,
                error: error.message
            },
            status: 'error',
            messages: []
        });
    }
}
