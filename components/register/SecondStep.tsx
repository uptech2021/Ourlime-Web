'use client';
import { Button, Image } from '@nextui-org/react';

const SecondStep: React.FC<{ setStep: (step: number) => void }> = ({
	setStep,
}) => {
	return (
		<div className="step-2 gap- flex flex-col justify-center">
			<h1 className="text-xl font-bold text-white">Show Off Your Looks</h1>

			<div className="flex flex-col justify-center gap-3 border-2 border-x-0 border-greenTheme bg-black bg-opacity-[50%] px-5 py-4 font-bold text-white sm:border-x-2 md:px-40">
				<h3 className="text-lg">Let&apos;s see your style.</h3>
				<div className="w-full">
					<Image
						className="h-full w-full object-cover opacity-100"
						src="/images/register/avatar.svg"
						alt="avatar"
					/>
				</div>

				<h3 className="text-lg">Upload or use Default Avatar</h3>
			</div>

			<div className="flex w-full flex-col gap-1 md:flex-row md:px-20">
				<Button
					onClick={() => setStep(1)}
					type="button"
					className="submit my-4 w-full rounded-full bg-white px-4 py-2 text-greenTheme hover:bg-gray-300"
				>
					Previous Step
				</Button>
				<Button
					onClick={() => setStep(3)}
					type="button"
					className="submit my-4 w-full rounded-full bg-greenTheme px-4 py-2 text-white hover:bg-green-600"
				>
					Next Step!
				</Button>
			</div>
		</div>
	);
};

export default SecondStep;
