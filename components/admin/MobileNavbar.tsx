'use client';

import { LayoutDashboard, Plus, Settings, XIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import styles from './mobileNavbar.module.css';
export default function MobileNavbar({
	isOpen,
	toggle,
}: {
	isOpen: boolean;
	toggle: () => void;
}) {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	// const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
	// const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
	// const [isProSystemOpen, setIsProSystemOpen] = useState(false);
	// const [isUsersOpen, setIsUsersOpen] = useState(false);
	// const [isToolsOpen, setIsToolsOpen] = useState(false);
	// const [isAPIsOpen, setAPIIsOpen] = useState(false);

	const toggleDropDown = (params: String) => {
		if (params === 'settings') setIsSettingsOpen((prev) => !prev);
		// else if (params === 'features') setIsFeaturesOpen((prev) => !prev);
		// else if(params === 'payments') setIsPaymentsOpen(prev => !prev);
		// else if(params === 'proSystem') setIsProSystemOpen(prev => !prev);
		// else if (params === 'users') setIsUsersOpen((prev) => !prev);
		// else if (params === 'tools') setIsToolsOpen((prev) => !prev);
		// else if (params === 'APIs') setAPIIsOpen((prev) => !prev);
		else alert("List doesn't doesn't");
	};

	return (
		<nav
			className={`fixed left-0 top-0 z-10 h-full transform bg-[#a84849] transition-transform ${
				isOpen ? 'translate-x-0' : '-translate-x-full'
			} w-full md:hidden`}
		>
			<button
				className="absolute right-4 top-4 z-20 bg-none p-4 text-white"
				onClick={toggle}
			>
				<XIcon />
			</button>
			<ul className="p-0">
				<li className={styles.mobileListItem}>
					<LayoutDashboard />
					<Link href="/admin">Dashboard</Link>
				</li>

				<li
					className="relative z-10 flex cursor-pointer list-none flex-row items-center gap-5 p-5 text-white/70"
					onClick={() => toggleDropDown('settings')}
				>
					<Settings />
					<div className="flex w-full items-center justify-between">
						Settings <Plus className="self-end" />
					</div>
				</li>
				<ul
					className={`transition-max-height z-10 max-h-0 w-full overflow-hidden pl-3 duration-1000 ease-out ${isSettingsOpen ? 'transition-max-height max-h-[5000px] duration-1000 ease-in' : ''}`}
				>
					<li className={styles.mobileListItem}>
						<Link href="/admin/settings">General Configuration</Link>
					</li>
					<li className={styles.mobileListItem}>
						<Link href="/admin/settings/website-information">
							Website Information
						</Link>
					</li>
					<li className={styles.mobileListItem}>
						<Link href="/admin/settings/file">File Upload Configuration</Link>
					</li>
					<li className={styles.mobileListItem}>
						<Link href="">E-Mail & SMS Setup (Coming Soon) </Link>
					</li>
					<li className={styles.mobileListItem}>
						<Link href="/admin/settings/chat">Chat & Video/Audio</Link>
					</li>
					<li className={styles.mobileListItem}>
						<Link href="/admin/settings/social-login">
							Social Login Settings
						</Link>
					</li>
					<li className={styles.mobileListItem}>
						<Link href="/admin/settings/ai">AI Settings</Link>
					</li>
				</ul>

				{/* <li className="flex flex-row items-center text-white/70 list-none p-5 gap-5 relative cursor-pointer z-10" onClick={() => toggleDropDown('features')}>
                    <ViewAgendaRoundedIcon />
                    <div className="flex justify-between items-center w-full">
                        Manage Features <AddRoundedIcon className="self-end" />
                    </div>
                </li>
                <ul className={`p-0 max-h-0 overflow-hidden transition-max-height duration-1000 ease-out w-full z-10 ${isFeaturesOpen ? 'max-h-[5000px] transition-max-height duration-1000 ease-in' : ''}`}>
                    <li className={styles.mobileListItem}><Link href="/admin/features/toggle">Enable / Disable Features</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/features/groups">Groups</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/features/posts">Posts</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/features/jobs">Jobs</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/features/articles">Articles</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/features/events">Events</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/features/ai">Social Media</Link></li>
                </ul> */}

				{/* <li className="flex flex-row items-center text-white/70 list-none p-5 gap-5 relative cursor-pointer z-10" onClick={() => toggleDropDown('users')}>
                    <PeopleAltRoundedIcon />
                    Users <AddRoundedIcon className="self-end" />
                </li>
                <ul className={`p-0 max-h-0 overflow-hidden transition-max-height duration-1000 ease-out w-full z-10 ${isUsersOpen ? 'max-h-[5000px] transition-max-height duration-1000 ease-in' : ''}`}>
                    <li className={styles.mobileListItem}><Link href="/admin/users/manage/users">Manage Users</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/users/manage/stories">Manage User Stories / Status</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/users/manage/verification-requests">Manage Verification Requests</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/users/manage/genders">Manage genders</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/users/online">Online Users</Link></li>
                </ul> */}

				{/* <li className="flex flex-row items-center text-white/70 list-none p-5 gap-5 relative cursor-pointer z-10" onClick={() => toggleDropDown('tools')}>
                    <BuildIcon />
                    Tools <AddRoundedIcon className="self-end" />
                </li>
                <ul className={`p-0 max-h-0 overflow-hidden transition-max-height duration-1000 ease-out w-full z-10 ${isToolsOpen ? 'max-h-[5000px] transition-max-height duration-1000 ease-in' : ''}`}>
                    <li className={styles.mobileListItem}><Link href="/admin/tools/manage/emails">Manage Emails</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/tools/send-email">Manage User Stories / Status</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/tools/announcements">Manage Verification Requests</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/tools/genders">Manage genders</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/tools/">Online Users</Link></li>
                </ul> */}
				{/* 
                <li className="flex flex-row items-center text-white/70 list-none p-5 gap-5 relative cursor-pointer z-10 coming-soon">
                    <AttachMoneyRoundedIcon />
                    Payments & Ads (Coming Soon) <AddRoundedIcon className="self-end" />
                </li>
                <ul className="p-0 max-h-0 overflow-hidden transition-max-height duration-1000 ease-out w-full z-10">
                    <li className={styles.mobileListItem}><Link href="/admin/settings">Website Configuration</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/settings/website-information">Website Information</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/settings/file">Social Media</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/settings/email">Social Media</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/settings/chat">Social Media</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/settings/social-login">Social Media</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/settings/ai">Social Media</Link></li>
                    <div className="p-0 max-h-0 overflow-hidden transition-max-height duration-1000 ease-out w-full z-10">
                        <li className={styles.mobileListItem}><Link href="/admin/settings/posts/settings">Posts Settings</Link></li>
                        <li className={styles.mobileListItem}><Link href="/admin/settings/posts/reactions">Post Reactions</Link></li>
                        <li className={styles.mobileListItem}><Link href="/admin/settings/posts/live">Setup Live Streaming</Link></li>
                    </div>
                </ul> */}

				{/* <li className="flex flex-row items-center text-white/70 list-none p-5 gap-5 relative cursor-pointer z-10 coming-soon">
                    <StarsRoundedIcon />
                    Pro System (Coming Soon) <AddRoundedIcon className="self-end" />
                </li>
                <ul className="p-0 max-h-0 overflow-hidden transition-max-height duration-1000 ease-out w-full z-10">
                    <li className={styles.mobileListItem}><Link href="/admin/settings">Website Configuration</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/settings/website-information">Website Information</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/settings/file">Social Media</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/settings/email">Social Media</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/settings/chat">Social Media</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/settings/social-login">Social Media</Link></li>
                    <li className={styles.mobileListItem}><Link href="/admin/settings/ai">Social Media</Link></li>
                    <div className="p-0 max-h-0 overflow-hidden transition-max-height duration-1000 ease-out w-full z-10">
                        <li className={styles.mobileListItem}><Link href="/admin/settings/posts/settings">Posts Settings</Link></li>
                        <li className={styles.mobileListItem}><Link href="/admin/settings/posts/reactions">Post Reactions</Link></li>
                        <li className={styles.mobileListItem}><Link href="/admin/settings/posts/live">Setup Live Streaming</Link></li>
                    </div>
                </ul> */}
			</ul>
		</nav>
	);
}
