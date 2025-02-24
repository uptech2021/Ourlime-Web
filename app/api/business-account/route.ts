// app/api/business-account/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BusinessAccountService } from '@/lib/business-account/BusinessAccountService';

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('userId');
        const businessService = BusinessAccountService.getInstance();
        const businessData = await businessService.getBusinessAccount(userId);
        
        return NextResponse.json({
            status: 'success',
            data: businessData,
            isBusinessAccount: businessData.profile !== null
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to fetch business account'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const businessService = BusinessAccountService.getInstance();
        await businessService.createBusinessAccount(data);

        return NextResponse.json({
            status: 'success',
            message: 'Business account created successfully'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to create business account'
        }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();
        const { userId, updates } = data;
        
        const businessService = BusinessAccountService.getInstance();
        await businessService.updateBusinessAccount(userId, updates);

        return NextResponse.json({
            status: 'success',
            message: 'Business account updated successfully'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to update business account'
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
        }

        const businessService = BusinessAccountService.getInstance();
        await businessService.deleteBusinessAccount(userId);

        return NextResponse.json({
            status: 'success',
            message: 'Business account deleted successfully'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to delete business account'
        }, { status: 500 });
    }
}
