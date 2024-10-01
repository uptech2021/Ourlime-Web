import Input from './Input';
import { Button, Input as NextUiInput } from '@nextui-org/react';
interface SendMoneyModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function SendMoneyModal({
	isOpen,
	onClose,
}: SendMoneyModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="flex flex-col gap-5 rounded-lg bg-white p-8 shadow-xl">
				<h2 className="mb-4 text-left text-xl font-bold">
					Send money to friends
				</h2>

				<p className="bg-orange-100 p-3 text-sm text-orange-500">
					Your current wallet balance is: 0, please top up your wallet to
					continue.
				</p>

				<p className="text-center">Amount</p>

				<Input />

				<NextUiInput
					labelPlacement="outside"
					label="Search by username or email"
					placeholder="To whom do you want to send?"
				/>

				<div className="flex flex-col gap-3">
					<Button onClick={onClose} className="rounded bg-none px-4 py-2">
						Close
					</Button>
					<Button
						isDisabled
						className="rounded bg-blue-500 px-4 py-2 text-white"
					>
						Continue
					</Button>
					<Button
						isDisabled
						className="rounded bg-blue-500 px-4 py-2 text-white"
					>
						Continue
					</Button>
					<Button
						isDisabled
						className="rounded bg-blue-500 px-4 py-2 text-white"
					>
						Continue
					</Button>
					<Button
						isDisabled
						className="rounded bg-blue-500 px-4 py-2 text-white"
					>
						Continue
					</Button>
				</div>
			</div>
		</div>
	);
}
