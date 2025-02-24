import { NextRequest, NextResponse } from 'next/server';
import { BusinessAccountService } from '@/lib/business-account/BusinessAccountService';

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('userId');
        if (!userId) {
            return NextResponse.json({
                status: 'error',
                message: 'User ID is required'
            }, { status: 400 });
        }

        const businessService = BusinessAccountService.getInstance();
        const businessData = await businessService.getBusinessAccount(userId);
        
        return NextResponse.json({
            status: 'success',
            data: businessData,
            isBusinessAccount: true
        });
    } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to fetch business account'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        if (!data.userId) {
            return NextResponse.json({
                status: 'error',
                message: 'User ID is required'
            }, { status: 400 });
        }

        const businessService = BusinessAccountService.getInstance();
        await businessService.createBusinessAccount({
            userId: data.userId,
            profile: {
                name: data.businessName || '',
                established: '',
                description: '',
                location: '',
                contact: {
                    email: data.email || '',
                    phone: '',
                    website: ''
                }
            },
            metrics: {
                totalProducts: 0,
                totalSales: 0,
                avgRating: 0,
                responseRate: '0%'
            },
            feedback: {
                resolution: 0,
                responseTime: 0,
                satisfaction: 0
            },
            rating: {
                delivery: 0,
                overall: 0,
                product: 0,
                service: 0
            },
            reviews: {
                total: 0,
                positive: 0,
                negative: 0
            },
            categories: [],
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json({
            status: 'success',
            message: 'Business account created successfully'
        });
    } catch (error) {
        console.error('POST Error:', error);
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

        if (!userId) {
            return NextResponse.json({
                status: 'error',
                message: 'User ID is required'
            }, { status: 400 });
        }

        const businessService = BusinessAccountService.getInstance();
        await businessService.updateBusinessAccount(userId, updates);

        return NextResponse.json({
            status: 'success',
            message: 'Business account updated successfully'
        });
    } catch (error) {
        console.error('PUT Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to update business account'
        }, { status: 500 });
    }
}
