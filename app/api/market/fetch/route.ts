// app/api/market/fetch/route.ts
import { NextResponse } from 'next/server';
import { MarketService } from '@/lib/services/MarketService';

export async function GET() {
    try {
        const marketService = MarketService.getInstance();
        const data = await marketService.getBaseData();
        
        return NextResponse.json({
            status: 'success',
            data: data
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to fetch market data'
        }, { status: 500 });
    }
}
