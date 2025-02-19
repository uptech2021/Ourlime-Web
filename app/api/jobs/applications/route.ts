import { NextRequest, NextResponse } from 'next/server';
import { JobApplicationService } from '@/lib/job/applications/JobApplicationService';

export async function POST(request: NextRequest) {
    try {
        const applicationData = await request.json();
        const applicationService = JobApplicationService.getInstance();
        const applicationId = await applicationService.createApplication(applicationData);
        
        return NextResponse.json({
            status: 'success',
            applicationId
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to submit application'
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');
        const userId = searchParams.get('userId');

        const applicationService = JobApplicationService.getInstance();
        const applications = await applicationService.fetchApplications(jobId, userId);

        return NextResponse.json({
            status: 'success',
            applications
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to fetch applications'
        }, { status: 500 });
    }
}
