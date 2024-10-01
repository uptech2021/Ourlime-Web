import { Button } from '@nextui-org/react';
import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';

type AdvertiseHeaderProps = {
	setActiveTab: Dispatch<SetStateAction<string>>;
	activeTab: string;
};

export default function AdvertiseHeader({
	setActiveTab,
	activeTab,
}: AdvertiseHeaderProps) {
	return (
		<header className="p-10">
			<h1>Advertisement</h1>
			<div className="mt-2 flex flex-row gap-5">
				<Button
					className={`rounded-full border p-2 shadow-sm ${
						activeTab === 'Campaigns' ? 'text-white' : 'cursor-pointer bg-none'
					}`}
					onClick={() => setActiveTab('Campaigns')}
				>
					{' '}
					Campaigns
				</Button>
				<Link href="/wallet">
					<Button
						className={`rounded-full border p-2 shadow-sm ${
							activeTab === 'Wallet & Credits'
								? 'bg-buttonGradientTheme from-theme-start to-theme-end text-white'
								: 'cursor-pointer bg-none'
						}`}
						onClick={() => setActiveTab('Wallet & Credits')}
					>
						{' '}
						Wallet & Credits
					</Button>
				</Link>
			</div>
		</header>
	);
}
