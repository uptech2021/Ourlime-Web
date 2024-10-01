'use client';
import Navbar from '@/comm/Navbar';
import Options from '@/components/wallet/Options';
import ReplenishInput from '@/components/wallet/ReplenishInput';
import { useState } from 'react';

export default function Wallet() {
	const [showReplenishInput, setShowReplenishInput] = useState(false);

	const handleAddFundsClick = () => {
		setShowReplenishInput(!showReplenishInput);
	};
	return (
		<Navbar>
			<div className="container pt-5">
			<h1 className="font-semibold">Wallet</h1>

			<section className="container flex flex-col items-center justify-center overflow-x-auto rounded-sm py-5 shadow-lg">
				<p>Current balance</p>
				<div className="flex">
					<span className="text-4xl">$</span>{' '}
					<span className="text-6xl">0.00</span>
				</div>

				<div className="mt-12 flex w-full flex-col gap-3">
					<Options onAddFundsClick={handleAddFundsClick} />

					<div
						className={`overflow-hidden transition-all duration-1000 ease-in-out ${showReplenishInput ? 'max-h-96' : 'max-h-0'}`}
					>
						<ReplenishInput />
					</div>
				</div>
			</section>

			<section className="container flex flex-col rounded-sm py-5 shadow-lg">
				<p className="text-left font-semibold">Transactions</p>

				<div className="mb-8 mt-40 flex flex-col items-center gap-5 text-center">
					<svg
						className="h-16 w-16 rounded-full"
						enableBackground="new 0 0 32 32"
						height="512"
						viewBox="0 0 32 32"
						width="512"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="m26 32h-20c-3.314 0-6-2.686-6-6v-20c0-3.314 2.686-6 6-6h20c3.314 0 6 2.686 6 6v20c0 3.314-2.686 6-6 6z"
							fill="#f5e6fe"
						/>
						<g fill="#d9a4fc">
							<path d="m16 20.667h-2.167c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h1.667v-4c0-.276.224-.5.5-.5s.5.224.5.5v4.5c0 .276-.224.5-.5.5z" />
							<path d="m18.167 20.667h-2.167c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h2.167c.276 0 .5.224.5.5s-.224.5-.5.5z" />
							<circle cx="21.333" cy="19.333" r="1.333" />
							<path d="m22.167 21.333h-1.667c-1.011 0-1.833.822-1.833 1.833v.334c0 .276.224.5.5.5h4.333c.276 0 .5-.224.5-.5v-.333c0-1.011-.822-1.834-1.833-1.834z" />
							<circle cx="10.667" cy="19.333" r="1.333" />
							<path d="m11.5 21.333h-1.667c-1.011 0-1.833.823-1.833 1.834v.333c0 .276.224.5.5.5h4.333c.276 0 .5-.224.5-.5v-.333c0-1.011-.822-1.834-1.833-1.834z" />
						</g>
						<path
							d="m16 8c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm-.083 3.5h.167c.689 0 1.25.561 1.25 1.25 0 .542-.349 1.001-.833 1.173v.243c0 .276-.224.5-.5.5s-.5-.224-.5-.5v-.166h-.333c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h.917c.138 0 .25-.112.25-.25s-.112-.25-.25-.25h-.167c-.689 0-1.25-.561-1.25-1.25 0-.542.349-1.001.833-1.173v-.244c0-.276.224-.5.5-.5s.5.224.5.5v.167h.333c.276 0 .5.224.5.5s-.224.5-.5.5h-.917c-.138 0-.25.112-.25.25s.112.25.25.25z"
							fill="#be63f9"
						/>
					</svg>

					<p className="font-semibold text-gray-500">
						Looks like you don&apos;t have any transactions yet!
					</p>
				</div>
			</section>
		</div>
		</Navbar>
	);
}
