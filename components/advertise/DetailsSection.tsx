import { AdvertiseFormError } from '@/types/advertise';
import { Button, Input, Textarea } from '@nextui-org/react';
import { Dispatch, RefObject, SetStateAction, useEffect, useState } from 'react';

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

	const [isFormValid, setIsFormValid] = useState(false);

	const validateDate = (startDate: Date, endDate: Date) => {
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);  // Set to start of day for fair comparison
	
		if (startDate.getTime() === currentDate.getTime()) {
			return false;
		} else if (endDate.getTime() === currentDate.getTime()) {
			return false;
		} else if (startDate.getTime() === endDate.getTime()) {
			return false;
		} else if (startDate > endDate) {
			return false;
		} else {
			return true;
		}
	};

	const isValid = validateDate(new Date(startDateRef.current?.value), new Date(endDateRef.current?.value));
	
	const validateWebsiteUrl = (url: string) => {
		const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
		return urlPattern.test(url);
	};
	
	const validateCampaignTitle = (title: string) => {
		return title.length > 5;
	};

	const validateCampaignDescription = (description: string) => {
		return description.length > 10;
	};


	const checkFormValidity = () => {
		const titleValid = validateCampaignTitle(campaignTitleRef.current?.value || '');
		const descriptionValid = validateCampaignDescription(campaignDescriptionRef.current?.value || '');
		const dateValid = validateDate(new Date(startDateRef.current?.value || ''), new Date(endDateRef.current?.value || ''));
		const urlValid = validateWebsiteUrl(websiteUrlRef.current?.value || '');
		
		const isValid = titleValid && descriptionValid && dateValid && urlValid;	
		setIsFormValid(isValid);
	};
	
	const saveToSessionStorage = () => {
		sessionStorage.setItem('campaignTitle', campaignTitleRef.current?.value || '');
		sessionStorage.setItem('campaignDescription', campaignDescriptionRef.current?.value || '');
		sessionStorage.setItem('startDate', startDateRef.current?.value || '');
		sessionStorage.setItem('endDate', endDateRef.current?.value || '');
		sessionStorage.setItem('websiteUrl', websiteUrlRef.current?.value || '');
	};
	
	useEffect(() => {
		// Load data from sessionStorage on component mount
		const storedData = {
			campaignTitle: sessionStorage.getItem('campaignTitle'),
			campaignDescription: sessionStorage.getItem('campaignDescription'),
			startDate: sessionStorage.getItem('startDate'),
			endDate: sessionStorage.getItem('endDate'),
			websiteUrl: sessionStorage.getItem('websiteUrl')
		};
	}, []);
	

	return (
		<section className="my-1 flex flex-col gap-3">
			<Input
				type="text"
				size="lg"
				radius="sm"
				name="campaignTitle"
				placeholder="Campaign Title"
				errorMessage="Campaign Title must be more than 5 characters."
				ref={campaignTitleRef}
				isInvalid={!validateCampaignTitle(campaignTitleRef.current?.value || '')}
				onChange={checkFormValidity}
			/>

			<Textarea
				size="lg"
				radius="sm"
				name="campaignDescription"
				placeholder="Campaign description"
				errorMessage="Please enter a description for your Campaign."
				ref={campaignDescriptionRef}
				isInvalid={!validateCampaignDescription(campaignDescriptionRef.current?.value || '')}
				onChange={checkFormValidity}
			/>

			<Input
				type="date"
				size="lg"
				radius="sm"
				name="startDate"
				placeholder="Start date"
				errorMessage="Please enter the start date."
				ref={startDateRef}
				isInvalid={!validateDate(new Date(startDateRef.current?.value || ''), new Date(endDateRef.current?.value || ''))}
				onChange={checkFormValidity}
			/>

			<Input
				type="date"
				size="lg"
				radius="sm"
				name="endDate"
				placeholder="End date"
				errorMessage="Please enter the end date."
				ref={endDateRef}
				isInvalid={!validateDate(new Date(startDateRef.current?.value || ''), new Date(endDateRef.current?.value || ''))}
				onChange={checkFormValidity}
			/>

			<Input
				type="text"
				size="lg"
				radius="sm"
				name="websiteUrl"
				placeholder="Website URL"
				errorMessage="Please enter a valid Website URL."
				ref={websiteUrlRef}
				isInvalid={!validateWebsiteUrl(websiteUrlRef.current?.value || '')}
				onChange={checkFormValidity}
			/>

			<div className="flex flex-row gap-3 px-4">
				<Button
					onClick={() => setFormState('Media')}
					className="mx-auto w-1/2 cursor-pointer bg-none"
				>
					Back
				</Button>

				<Button
				  onClick={() => {
					saveToSessionStorage();
					changeForm();
				  }}
				className={`mx-auto w-1/2 transition-all duration-300 ${
					isFormValid
					? 'cursor-pointer bg-gray-300 hover:bg-gray-400'
					: 'cursor-not-allowed bg-gray-200'
				}`}
				disabled={!isFormValid}
				>
				Next
				</Button>

			</div>
		</section>
	);
}