'use client';

import { Home } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
export default function TopNav() {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<div className="admin-top-nav-layout rounded-xl bg-[#f4f5fd] pl-8 pr-16">
			<h1 className="text-[23px] font-semibold">
				{pathname === '/admin' && ' Welcome back, Uptech Incorporated Ltd'}
				{pathname === '/admin/settings' && 'General Configuration'}
				{pathname === '/admin/settings/website-information' &&
					'Website Information'}
				{pathname === '/admin/settings/file' && 'File Upload Configuration'}
				{pathname === '/admin/settings/email' && 'E-mail & SMS Setup'}
				{pathname === '/admin/settings/chat' && 'Video & Audio Settings'}
				{pathname === '/admin/settings/social-login' && 'Social Login Settings'}
				{pathname === '/admin/settings/ai' && 'AI Settings'}
			</h1>

			<div className="top-nav mb-2 flex flex-row flex-wrap items-center gap-1">
				<Home />
				<span className="cursor-pointer" onClick={() => router.push('/admin')}>
					{' '}
					Home &gt;{' '}
				</span>
				{pathname === '/admin' && <a className="text-[#c64d53]">DASHBOARD</a>}

				{pathname.includes('/settings') && (
					<React.Fragment>
						<span
							className="cursor-pointer"
							onClick={() => router.push('/admin/settings')}
						>
							Settings &gt;
						</span>
						<a className="text-[#c64d53]">
							{pathname === '/admin/settings' &&
								'General Configuration'}
							{pathname === '/admin/settings/website-information' &&
								'Website Information'}
							{pathname === '/admin/settings/file' &&
								'File Upload Configuration'}
							{pathname === '/admin/settings/email' && 'E-mail & SMS Setup'}
							{pathname === '/admin/settings/chat' && 'Video & Audio Settings'}
							{pathname === '/admin/settings/social-login' &&
								'Social Login Settings'}
							{pathname === '/admin/settings/ai' && 'AI Settings'}
						</a>
					</React.Fragment>
				)}
			</div>
		</div>
	);
}
