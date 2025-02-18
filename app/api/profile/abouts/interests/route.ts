import { NextResponse } from 'next/server';
import { InterestServices } from '@/lib/profile/abouts/interests/InterestServices';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        const interestService = InterestServices.getInstance();
        const result = await interestService.fetchInterestsAndSkills(userId);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ 
            error: 'Failed to fetch interests and skills' 
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId, type, value } = await request.json();
        const interestService = InterestServices.getInstance();
        const result = await interestService.addInterestOrSkill(userId, type, value);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ 
            error: error.message 
        }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { userId, id, value } = await request.json();
        const interestService = InterestServices.getInstance();
        const result = await interestService.updateInterestOrSkill(userId, id, value);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ 
            error: error.message 
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');

    try {
        const interestService = InterestServices.getInstance();
        await interestService.deleteInterestOrSkill(userId, id);
        return NextResponse.json({ 
            message: 'Item deleted successfully' 
        });
    } catch (error) {
        return NextResponse.json({ 
            error: error.message 
        }, { status: 500 });
    }
}
