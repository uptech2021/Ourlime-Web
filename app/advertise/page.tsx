'use client';

import Navbar from '@/comm/Navbar';
import AdvertiseHeader from '@/components/advertise/AdvertiseHeader';
import { Button } from '@nextui-org/react';
import { Megaphone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
	const [activeTab, setActiveTab] = useState('Campaigns');

	return (
		<Navbar>
			<AdvertiseHeader activeTab={activeTab} setActiveTab={setActiveTab} />

			<main className="mx-auto flex w-2/3 flex-col items-center gap-5 pt-10">
				
				<Megaphone
					className={`h-14 w-14 rounded-full p-2 
					${activeTab === 'Campaigns' ? 'bg-green-300 text-greenTheme' : 'bg-gray-300 text-gray-500'}`}
				/>

				<p className="text-center">
					No ads found. Create new ad and start getting traffic!
				</p>

				<Link href="/advertise/create">
					<Button>Create advertisement</Button>
				</Link>

			</main>
		</Navbar>
	);
}
