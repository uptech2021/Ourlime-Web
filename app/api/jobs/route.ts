import { NextRequest, NextResponse } from 'next/server';
import { JobsService } from '@/lib/job/JobsService';

export async function POST(request: NextRequest) {
    try {
        const jobData = await request.json();
        const jobsService = JobsService.getInstance();

        // Validate required fields
        const requiredFields = ['jobTitle', 'jobDescription', 'jobCategory', 'userId', 'priceRange', 'location'];
        const missingFields = requiredFields.filter(field => !jobData[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json({
                status: 'error',
                message: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 });
        }

        // Validate location data
        if ((jobData.location.type === 'onsite' || jobData.location.type === 'hybrid') 
            && (!jobData.location.address || !jobData.location.city || !jobData.location.country)) {
            return NextResponse.json({
                status: 'error',
                message: 'Location details required for onsite or hybrid jobs'
            }, { status: 400 });
        }

        const jobId = await jobsService.createJob(jobData);
        
        return NextResponse.json({
            status: 'success',
            jobId
        });
    } catch (error) {
        console.error('Job creation error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to create job'
        }, { status: 500 });
    }
}


export async function GET(request: NextRequest) {
    try {
        const jobsService = JobsService.getInstance();
        const jobs = await jobsService.fetchJobs();
        
        return NextResponse.json({
            status: 'success',
            jobs
        }, { 
            headers: {
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
            }
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to fetch jobs'
        }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');
        
        if (!jobId) {
            return NextResponse.json({
                status: 'error',
                message: 'Job ID is required'
            }, { status: 400 });
        }

        const jobData = await request.json();
        const jobsService = JobsService.getInstance();
        await jobsService.updateJob(jobId, jobData);
        
        return NextResponse.json({
            status: 'success',
            message: 'Job updated successfully'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to update job'
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get('jobId');
        
        if (!jobId) {
            return NextResponse.json({
                status: 'error',
                message: 'Job ID is required'
            }, { status: 400 });
        }

        const jobsService = JobsService.getInstance();
        await jobsService.deleteJob(jobId);
        
        return NextResponse.json({
            status: 'success',
            message: 'Job deleted successfully'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to delete job'
        }, { status: 500 });
    }
}
