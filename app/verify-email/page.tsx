// app/verify-email/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EmailVerificationService } from '@/helpers/Auth';
import AnimatedLogo from '@/components/AnimatedLoader';

export default function VerifyEmail() {
    const [isVerifying, setIsVerifying] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token || !userId) {
                router.push('/verify-email/failure');
                return;
            }

            const isVerified = await EmailVerificationService.verifyEmail(userId, token);
            
            // Add a small delay before redirect to ensure DB updates complete
            setTimeout(() => {
                router.push(isVerified ? '/verify-email/success' : '/verify-email/failure');
            }, 1500);
        };

        verifyEmail();
    }, [token, userId, router]);

    return <AnimatedLogo />;
}
