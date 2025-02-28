// app/api/temp-messaging/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { TempMessagingService } from '@/lib/messaging/TempMessagingService';

export async function POST(request: NextRequest) {
    try {
        const { receiverId, message, senderId, productContext } = await request.json();
        const messagingService = TempMessagingService.getInstance();
        
        const result = await messagingService.sendMessage(
            receiverId,
            message,
            senderId,
            {
                productTitle: productContext.productTitle,
                productImage: productContext.productImage,
                colorVariant: productContext.colorVariant,
                sizeVariant: productContext.sizeVariant,
                price: productContext.price
            }
        );

        return NextResponse.json({
            status: 'success',
            data: result
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to send message'
        }, { status: 500 });
    }
}

