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
				label="Placement"
				type="text"
				size="lg"
				radius="sm"
				name="placement"
				placeholder="Entire Site (File Format Image)"
				ref={placementRef}
				onChange={checkFormValidity}
			/>

			<Input
				label="Bidding"
				type="text"
				size="lg"
				radius="sm"
				name="bidding"
				placeholder="Pay Per click ($0.075)"
				ref={biddingRef}
				onChange={checkFormValidity}
			/>

			<Input
				type="text"
				size="lg"
				radius="sm"
				name="location"
				placeholder="Location"
				ref={locationRef}
				onChange={checkFormValidity}
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
			>
				<SelectItem className="text-white" key="male" value="male">
					Male
				</SelectItem>
				<SelectItem className="text-white" key="female" value="female">
					Female
				</SelectItem>
				<SelectItem className="text-white" key="other" value="other">
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
