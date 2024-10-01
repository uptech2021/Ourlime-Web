'use client';
import { Landmark, Send, Wallet2 } from 'lucide-react';
import { useState } from 'react';
import SendMoneyModal from './SendMoneyModal';
import Link from 'next/link';

type OptionsProps = {
	onAddFundsClick: () => void;
};

export default function Options({ onAddFundsClick }: OptionsProps) {
	const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false);

	return (
		<div className="flex flex-row flex-wrap justify-center gap-3">
			<div
				onClick={onAddFundsClick}
				className="flex cursor-pointer flex-col items-center justify-center gap-3 p-2 hover:rounded-sm hover:bg-gray-100"
			>
				<Wallet2 color="green" />
				<button className="bg-none">Add Funds</button>
			</div>
			<div
				className="flex cursor-pointer flex-col items-center justify-center gap-3 p-2 hover:rounded-sm hover:bg-gray-100"
				onClick={() => setIsSendMoneyModalOpen(true)}
			>
				<Send color="blue" />
				<button className="bg-none">Send Money</button>
			</div>
			<Link href="/settings/payments">
				<div className="flex cursor-pointer flex-col items-center justify-center gap-3 p-2 hover:rounded-sm hover:bg-gray-100">
					<Landmark color="red" />
					<button className="bg-none">Withdrawal</button>
				</div>
			</Link>

			<SendMoneyModal
				isOpen={isSendMoneyModalOpen}
				onClose={() => setIsSendMoneyModalOpen(false)}
			/>
		</div>
	);
}
