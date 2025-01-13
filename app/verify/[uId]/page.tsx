"use client"

import { usePathname } from 'next/navigation';
import { db } from '@/config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect } from 'react';

export default function VerifyPage() {
	const path = usePathname();
	const uId = path.split('/').pop();
	useEffect(() => {
		if (uId) {
			const verifyUser = async () => {
				await updateDoc(doc(db, 'users', uId), {
					verified: true,
				});
			};
			verifyUser();
		}
	}, [uId]);
	return <div>User has been verified</div>;
}

