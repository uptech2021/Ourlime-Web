// app/api/market/actions/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ success: false });
}