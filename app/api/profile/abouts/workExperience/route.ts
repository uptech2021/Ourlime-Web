import { NextResponse } from 'next/server';
import { WorkExperienceServices } from '@/lib/profile/abouts/workExperience/WorkExperienceServices';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        const workExperienceService = WorkExperienceServices.getInstance();
        const result = await workExperienceService.fetchWorkExperience(userId);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch work experience' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId, workData } = await request.json();
        const workExperienceService = WorkExperienceServices.getInstance();
        const result = await workExperienceService.addWorkExperience(userId, workData);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add work experience' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { userId, id, workData } = await request.json();
        const workExperienceService = WorkExperienceServices.getInstance();
        const result = await workExperienceService.updateWorkExperience(userId, id, workData);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update work experience' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');

    try {
        const workExperienceService = WorkExperienceServices.getInstance();
        await workExperienceService.deleteWorkExperience(userId, id);
        return NextResponse.json({ message: 'Work experience deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete work experience' }, { status: 500 });
    }
}
