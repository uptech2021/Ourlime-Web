'use client';
import React, { useState } from 'react';

type NotificationItemProps = {
	title: string;
};

function NotificationItem({ title }: NotificationItemProps) {
	const [isActive, setIsActive] = useState(false);

	const handleToggle = () => {
		setIsActive((prev) => !prev);
	};

	return (
		<div className="flex items-center py-2">
			<button
				className={`h-4 w-8 lg:h-6 lg:w-12 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'} p-1`}
				onClick={handleToggle}
			>
				<div
					className={`h-2 lg:h-4 w-2 lg:w-4 transform rounded-full bg-white shadow-md transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`}
				></div>
			</button>
			<span className="ml-2 text-xs lg:text-sm text-gray-700">{title}</span>
		</div>
	);
}

export default function Notification() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gray-200 lg:text-center">
			<h2 className="mb-4 text-2xl font-semibold text-gray-700">
				Notification Settings
			</h2>
			<div className="w-[95%] lg:mx-auto lg:w-2/5 rounded-lg bg-white p-4 shadow-md">
				<span className="text-md lg:text-lg mt-2 pr-10 text-left text-gray-900">
					Notify me when
				</span>
				<div>
					<NotificationItem title="Someone liked my posts" />
					<NotificationItem title="Someone commented on my posts" />
					<NotificationItem title="Someone shared on my posts" />
					<NotificationItem title="Someone followed me" />
					<NotificationItem title="Someone liked my pages" />
					<NotificationItem title="Someone visited my profile" />
					<NotificationItem title="Someone mentioned me " />
					<NotificationItem title="Someone joined my groups" />
					<NotificationItem title="Someone accepted my friend/follow request" />
					<NotificationItem title="Someone posted on my timeline" />
					<NotificationItem title="You have remembrance on this day" />
					<div className="mt-4 flex justify-center">
						<button className="bg-redTheme mt-4 rounded px-4 py-2 text-white shadow hover:bg-red-600">
							Save
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
