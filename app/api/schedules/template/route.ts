// app/api/schedules/templates/route.ts
import { NextResponse } from 'next/server';
import { ScheduleService } from '@/lib/schedule/ScheduleService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const scheduleService = ScheduleService.getInstance();
        const templates = await scheduleService.getTemplates(userId);
        return NextResponse.json({ 
            templates: templates || [],
            message: templates.length === 0 ? 'No templates found' : 'Templates retrieved successfully'
        });
    } catch (error) {
        return NextResponse.json({ templates: [], message: 'No templates available yet' });
    }
}


export async function POST(request: Request) {
    const { userId, template } = await request.json();

    if (!userId || !template) {
        return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 });
    }

    try {
        const scheduleService = ScheduleService.getInstance();
        await scheduleService.saveTemplate(userId, template);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save template' }, { status: 500 });
    }
}
