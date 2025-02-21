import { NextRequest, NextResponse } from 'next/server';
import { MyJobsManageJobsService } from '@/lib/job/myJobs/MyJobsManageJobsService';
import { MyJobsApplicationService } from '@/lib/job/myJobs/MyJobsApplicationService';
import { EmailRejectService } from '@/lib/job/email/reject/EmailRejectService';
import { EmailAcceptService } from '@/lib/job/email/accept/EmailAcceptService';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface Application {
    id: string;
    answers: Record<string, string | string[]>;
    status: string;
    basic_info: {
        jobId: string;
        status: string;
        userId: string;
        createdAt: {
            seconds: number;
            nanoseconds: number;
        };
        jobType: string;
        updatedAt: {
            seconds: number;
            nanoseconds: number;
        };
    };
    details: {
        portfolioLink: string | null;
        coverLetter: string;
        resumeUrl: string;
    };
    updatedAt: {
        seconds: number;
        nanoseconds: number;
    };
    category_specific: Record<string, unknown>;
}

interface Job {
    id: string;
    basic_info: {
        title: string;
        type: string;
        userId: string;
        createdAt: {
            seconds: number;
            nanoseconds: number;
        };
        location: {
            type: string;
        };
        priceRange: {
            from: number;
            to: number;
        };
    };
}

async function getUserData(userId: string) {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.data();
}

export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get('userId');
    const jobId = request.nextUrl.searchParams.get('jobId');

    if (userId) {
        try {
            const jobsService = MyJobsManageJobsService.getInstance();
            const jobs = await jobsService.fetchUserJobsWithQuestions(userId);
            
            return NextResponse.json({
                status: 'success',
                jobs
            });
        } catch (error) {
            console.log('Error fetching jobs:', error);
            return NextResponse.json({
                status: 'error',
                message: 'Failed to fetch jobs'
            }, { status: 500 });
        }
    }

    if (jobId) {
        try {
            const applicationService = MyJobsApplicationService.getInstance();
            const applications = await applicationService.fetchApplicationsForJob(jobId);
            
            return NextResponse.json({
                status: 'success',
                applications
            });
        } catch (error) {
            console.log('Error fetching applications:', error);
            return NextResponse.json({
                status: 'error',
                message: 'Failed to fetch applications'
            }, { status: 500 });
        }
    }

    return NextResponse.json({
        status: 'error',
        message: 'Either userId or jobId is required'
    }, { status: 400 });
}

export async function PATCH(request: NextRequest) {
    try {
        const { applicationId, status } = await request.json();
        console.log('1. Request received:', { applicationId, status });
        
        const applicationService = MyJobsApplicationService.getInstance();
        const jobsService = MyJobsManageJobsService.getInstance();
        
        const application = await applicationService.getApplicationById(applicationId) as Application;
        console.log('2. Application data:', application);
        
        const job = await jobsService.getJobById(application.basic_info.jobId) as Job;
        console.log('3. Job data:', job);

        // Update status
        await applicationService.updateApplicationStatus(applicationId, status);
        console.log('4. Status updated successfully');

        // Get user data for email
        const userData = await getUserData(application.basic_info.userId);
        console.log('5. User data retrieved:', userData);

        const emailData = {
            jobTitle: job.basic_info.title,
            applicantName: userData.name,
            applicantEmail: userData.email,
            applicationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job.id}/applications/${applicationId}`
        };
        console.log('6. Email data prepared:', emailData);

        if (status === 'accepted') {
            const emailService = EmailAcceptService.getInstance();
            await emailService.sendAcceptanceEmail(
                userData.email,
                process.env.SMTP_FROM_EMAIL || 'noreply@ourlime.com',
                emailData
            );
            console.log('7. Acceptance email sent');
        } else if (status === 'rejected') {
            const emailService = EmailRejectService.getInstance();
            await emailService.sendRejectionEmail(
                userData.email,
                process.env.SMTP_FROM_EMAIL || 'noreply@ourlime.com',
                emailData
            );
            console.log('7. Rejection email sent');
        }

        return NextResponse.json({
            status: 'success',
            message: `Application ${status} and notification sent successfully`
        });
    } catch (error) {
        console.error('Error occurred:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const applicationId = request.nextUrl.searchParams.get('applicationId');
    
    if (!applicationId) {
        return NextResponse.json({
            status: 'error',
            message: 'Application ID is required'
        }, { status: 400 });
    }

    try {
        const applicationService = MyJobsApplicationService.getInstance();
        await applicationService.deleteApplicationsForJob(applicationId);
        
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
