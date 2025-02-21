import { NextRequest, NextResponse } from 'next/server';
import { MyJobsApplicationService } from '@/lib/job/myJobs/MyJobsApplicationService';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { applicationId: string } }
) {
    try {
        const { status } = await request.json();
        const applicationService = MyJobsApplicationService.getInstance();
        await applicationService.updateApplicationStatus(params.applicationId, status);
        
        return NextResponse.json({
            status: 'success',
            message: 'Application status updated successfully'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to update application status'
        }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { applicationId: string } }
) {
    try {
        const applicationService = MyJobsApplicationService.getInstance();
        await applicationService.deleteApplicationsForJob(params.applicationId);
        
        return NextResponse.json({
            status: 'success',
            message: 'Application deleted successfully'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to delete application'
        }, { status: 500 });
    }
}
