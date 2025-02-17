import { NextResponse } from 'next/server';
import { EducationService } from '@/lib/profile/abouts/education/EducationService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        const educationService = EducationService.getInstance();
        const result = await educationService.fetchEducation(userId);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId, educationData } = await request.json();
        const educationService = EducationService.getInstance();
        const result = await educationService.addEducation(userId, educationData);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add education' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { userId, id, educationData } = await request.json();
        const educationService = EducationService.getInstance();
        const result = await educationService.updateEducation(userId, id, educationData);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');

    try {
        const educationService = EducationService.getInstance();
        await educationService.deleteEducation(userId, id);
        return NextResponse.json({ message: 'Education deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
    }
}
