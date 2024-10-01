import { AdvertiseFormError } from '@/types/advertise';
import { Button, Input } from '@nextui-org/react';
import { ImageIcon } from 'lucide-react';
import {
	ChangeEvent,
	Dispatch,
	MutableRefObject,
	RefObject,
	SetStateAction,
} from 'react';

type MediaSectionProps = {
	error: AdvertiseFormError;
	companyNameRef: RefObject<HTMLInputElement>;
	companyNameValue: string;
	setCompanyNameValue: Dispatch<SetStateAction<string>>;
	fileInputRef: RefObject<HTMLInputElement>;
	selectedFile: File | null;
	setSelectedFile: Dispatch<SetStateAction<File | null>>;
	changeForm: () => void;
	/* eslint-disable-next-line no-unused-vars */
	handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function MediaSection({
	error,
	companyNameRef,
	companyNameValue,
	setCompanyNameValue,
	fileInputRef,
	selectedFile,
	setSelectedFile,
	changeForm,
	handleFileChange,
}: MediaSectionProps) {
	console.log(setSelectedFile);

	return (
		<section className="my-1 flex flex-col gap-3">
			<p className="bg-orange-100 p-3 text-sm text-orange-500">
				Your current wallet balance is: 0, please top up your wallet to
				continue.
			</p>

			<Input
				ref={companyNameRef as unknown as MutableRefObject<HTMLInputElement>}
				type="text"
				size="lg"
				radius="sm"
				name="companyName"
				placeholder="Company Name"
				errorMessage="Please enter your Company Name."
				value={companyNameValue}
				onChange={(e) => setCompanyNameValue(e.target.value)}
				isInvalid={error.companyName}
			/>

			<p className="text-sm">Select an image for your campaign</p>

			<div className="border-b-2 border-b-gray-700 bg-[#f5f5f5] py-20">
				<Button
					className="mx-auto flex w-auto cursor-pointer flex-row items-center justify-center rounded-lg bg-none p-3"
					startContent={<ImageIcon />}
					onClick={() => fileInputRef.current?.click()}
				>
					<p className="text-sm">
						{selectedFile ? selectedFile.name : 'Select Photos / Videos'}
					</p>
				</Button>
				<input
					ref={fileInputRef}
					type="file"
					name="file"
					accept="image/*,video/*"
					className="hidden"
					onChange={handleFileChange}
				/>
			</div>

			{error.file && (
				<p className="text-sm text-red-500">Please upload a file.</p>
			)}
			<Button
				onClick={() => changeForm()}
				className="mx-auto w-1/2 cursor-pointer"
			>
				Next
			</Button>
		</section>
	);
}
