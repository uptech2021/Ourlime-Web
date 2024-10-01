import { AdvertiseFormError } from '@/types/advertise';
import { Button, Input, Textarea } from '@nextui-org/react';
import { Dispatch, RefObject, SetStateAction } from 'react';

type DetailsSectionProps = {
	error: AdvertiseFormError;
	campaignTitleRef: RefObject<HTMLInputElement>;
	campaignDescriptionRef: RefObject<HTMLTextAreaElement>;
	startDateRef: RefObject<HTMLInputElement>;
	endDateRef: RefObject<HTMLInputElement>;
	websiteUrlRef: RefObject<HTMLInputElement>;
	changeForm: () => void;
	setFormState: Dispatch<SetStateAction<string>>;
};

export default function DetailsSection({
	error,
	campaignTitleRef,
	campaignDescriptionRef,
	startDateRef,
	endDateRef,
	websiteUrlRef,
	changeForm,
	setFormState,
}: DetailsSectionProps) {
	return (
		<section className="my-1 flex flex-col gap-3">
			<Input
				type="text"
				size="lg"
				radius="sm"
				name="campaignTitle"
				placeholder="Campaign Title"
				errorMessage="Please enter your Campaign Title."
				ref={campaignTitleRef}
				isInvalid={error.campaignTitle ? true : false}
			/>

			<Textarea
				size="lg"
				radius="sm"
				name="campaignDescription"
				placeholder="Campaign description"
				errorMessage="Please enter a description for your Campaign."
				ref={campaignDescriptionRef}
				isInvalid={error.campaignDescription ? true : false}
			/>

			<Input
				type="text"
				size="lg"
				radius="sm"
				name="startDate"
				placeholder="Start date"
				errorMessage="Please enter the start date."
				ref={startDateRef}
				isInvalid={error.startDate ? true : false}
			/>

			<Input
				type="text"
				size="lg"
				radius="sm"
				name="endDate"
				placeholder="End date"
				errorMessage="Please enter the end date."
				ref={endDateRef}
				isInvalid={error.endDate ? true : false}
			/>

			<Input
				type="text"
				size="lg"
				radius="sm"
				name="websiteUrl"
				placeholder="Website URL"
				errorMessage="Please enter your Website URL."
				ref={websiteUrlRef}
				isInvalid={error.websiteUrl ? true : false}
			/>

			{/* <p className="text-sm">Select an image for your campaign</p> */}

			<div className="flex flex-row gap-3 px-4">
				<Button
					onClick={() => setFormState('Media')}
					className="mx-auto w-1/2 cursor-pointer bg-none"
				>
					Back
				</Button>

				<Button
					onClick={() => changeForm()}
					className="mx-auto w-1/2 cursor-pointer"
				>
					Next
				</Button>
			</div>
		</section>
	);
}
