// app/api/temp-messaging/[receiverId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { TempMessagingService } from '@/lib/messaging/TempMessagingService';

export async function GET(request: NextRequest, { params }: { params: { receiverId: string } }) {
    try {
        const { searchParams } = new URL(request.url);
        const senderId = searchParams.get('senderId');
        const productId = searchParams.get('productId');

        if (!senderId || !productId) {
            return NextResponse.json({ 
                status: 'error', 
                message: 'Missing required parameters' 
            }, { status: 400 });
        }

        const messagingService = TempMessagingService.getInstance();
        const messages = await messagingService.getMessages(params.receiverId, senderId, productId);

        return NextResponse.json({
            status: 'success',
            messages
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to fetch messages'
        }, { status: 500 });
    }
}
