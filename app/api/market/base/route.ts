// app/api/market/base/route.ts
import { NextResponse } from 'next/server';
import { MarketService } from '@/lib/services/MarketService';

export async function GET() {
    const result = await MarketService.getBaseData();
    
    if (!result.success) {
        return NextResponse.json(result, { status: 500 });
    }
    
    return NextResponse.json(result);
}