import { AdvertiseFormError } from '@/types/advertise';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import {
	Dispatch,
	RefObject,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react';

type TargetingSectionProps = {
	error: AdvertiseFormError;
	campaignNameRef: RefObject<HTMLInputElement>;
	campaignDescriptionRef: RefObject<HTMLTextAreaElement>;
	startDateRef: RefObject<HTMLInputElement>;
	endDateRef: RefObject<HTMLInputElement>;
	websiteUrlRef: RefObject<HTMLInputElement>;
	placementRef: RefObject<HTMLInputElement>;
	biddingRef: RefObject<HTMLInputElement>;
	locationRef: RefObject<HTMLInputElement>;
	genderRef: RefObject<HTMLSelectElement>;
	changeForm: () => void;
	setFormState: Dispatch<SetStateAction<string>>;
	isFormValid: boolean;
	setIsFormValid: Dispatch<SetStateAction<boolean>>;
};

export default function TargetingSection({
	error,
	campaignNameRef,
	campaignDescriptionRef,
	startDateRef,
	endDateRef,
	websiteUrlRef,
	placementRef,
	biddingRef,
	locationRef,
	genderRef,
	changeForm,
	setFormState,
	isFormValid,
	setIsFormValid,
}: TargetingSectionProps) {
	const [gender, setGender] = useState('');
	const [isPublishing, setIsPublishing] = useState(false);


	//TODO aaron review
	const checkFormValidity = useCallback(() => {
		const isValid = !!(
			placementRef.current?.value.trim() &&
			biddingRef.current?.value.trim() &&
			locationRef.current?.value.trim() &&
			gender
		);
		setIsFormValid(isValid);
	}, [placementRef, biddingRef, locationRef, gender, setIsFormValid]);

	useEffect(() => {
		checkFormValidity();
	}, [gender, checkFormValidity]);

	console.log(
		error,
		campaignNameRef,
		campaignDescriptionRef,
		startDateRef,
		endDateRef,
		websiteUrlRef
	);


	const handlePublish = () => {
		setIsPublishing(true);
		setTimeout(() => {
			console.log('Media Session Data:', {
				companyName: sessionStorage.getItem('companyName'),
				fileName: sessionStorage.getItem('fileName')
			});
			console.log('Details Session Data:', {
				campaignTitle: sessionStorage.getItem('campaignTitle'),
				campaignDescription: sessionStorage.getItem('campaignDescription'),
				startDate: sessionStorage.getItem('startDate'),
				endDate: sessionStorage.getItem('endDate'),
				websiteUrl: sessionStorage.getItem('websiteUrl')
			});
			console.log('Targeting Session Data:', {
				placement: placementRef.current?.value,
				bidding: biddingRef.current?.value,
				location: locationRef.current?.value,
				gender: gender
			});
			setIsPublishing(false);
			changeForm();
		}, 2000);
	};

	return (
		<section className="my-1 flex flex-col gap-3">

			<Input
				label="Placement Entire Site (File Format Image)"
				placeholder="Enter placement details"
				type="text"
				size="lg"
				radius="sm"
				name="placement"
				ref={placementRef}
				onChange={checkFormValidity}
				variant="flat"
				labelPlacement="outside"
				classNames={{
					input: "border-0",
					inputWrapper: "border-0",
					label: "text-sm font-medium"
				}}
				data-focus="true"
			/>

			<Input
				label="Bidding  Pay Per click ($0.075)"
				placeholder="Enter bidding details"
				type="text"
				size="lg"
				radius="sm"
				name="bidding"
				ref={biddingRef}
				onChange={checkFormValidity}
				variant="flat"
				labelPlacement="outside"
				classNames={{
					input: "border-0",
					inputWrapper: "border-0",
					label: "text-sm font-medium"
				}}
				data-focus="true"
			/>

			<Input
				type="text"
				label="Location"
				placeholder='Enter location'
				size="lg"
				radius="sm"
				name="location"
				ref={locationRef}
				onChange={checkFormValidity}
				variant="flat"
				labelPlacement="outside"
				classNames={{
					input: "border-0",
					inputWrapper: "border-0",
					label: "text-sm font-medium"
				}}
				data-focus="true"
			/>

			<Select
				ref={genderRef}
				label="Gender"
				placeholder="Select gender"
				size="lg"
				radius="sm"
				className="selectTag bg-none text-white"
				onSelectionChange={(keys) => {
					const selectedValue = Array.from(keys)[0] as string;
					setGender(selectedValue);
					checkFormValidity();
				}}
				classNames={{
					popoverContent: "bg-gray-200",
					trigger: "text-white",
				}}
				variant="flat"
				labelPlacement="outside"
				data-focus="true"
				>
				<SelectItem key="male" value="male" className="text-black hover:bg-gray-200">
					Male
				</SelectItem>
				<SelectItem key="female" value="female" className="text-black hover:bg-gray-200">
					Female
				</SelectItem>
				<SelectItem key="other" value="other" className="text-black hover:bg-gray-200">
					Other
				</SelectItem>
			</Select>


			<div className="flex flex-row gap-3 px-4">
				<Button
					onClick={() => setFormState('Details')}
					className="mx-auto w-1/2 cursor-pointer bg-none"
				>
					Back
				</Button>

				<Button
					onClick={() => {
						handlePublish();
						changeForm()
					}}
					className="mx-auto w-1/2 cursor-pointer"
					isDisabled={!isFormValid || isPublishing}
				>
					{isPublishing ? 'Publishing...' : 'Publish'}
				</Button>
			</div>
		</section>
	);
}