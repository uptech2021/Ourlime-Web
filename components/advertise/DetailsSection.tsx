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
    const [isTitleTouched, setIsTitleTouched] = useState(false);
    const [isDescriptionTouched, setIsDescriptionTouched] = useState(false);
    const [isUrlTouched, setIsUrlTouched] = useState(false);
	const [isStartDateTouched, setIsStartDateTouched] = useState(false);
	const [isEndDateTouched, setIsEndDateTouched] = useState(false);

	
	const validateDates = () => {
		const startDate = new Date(startDateRef.current?.value || '');
		const endDate = new Date(endDateRef.current?.value || '');
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);
	
		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			return false;
		}
	
		return startDate > currentDate && endDate > startDate;
	};

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
		const datesValid = validateDates();
		const urlValid = validateWebsiteUrl(websiteUrlRef.current?.value || '');
		
		const isValid = titleValid && descriptionValid && datesValid && urlValid;    
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
        const storedData = {
            campaignTitle: sessionStorage.getItem('campaignTitle'),
            campaignDescription: sessionStorage.getItem('campaignDescription'),
            startDate: sessionStorage.getItem('startDate'),
            endDate: sessionStorage.getItem('endDate'),
            websiteUrl: sessionStorage.getItem('websiteUrl')
        };
        // You can set the initial values here if needed
    }, []);

    return (
        <section className="my-1 flex flex-col gap-3">
            <Input
                type="text"
                size="lg"
                radius="sm"
                name="campaignTitle"
                placeholder="Campaign Title"
                errorMessage={isTitleTouched && !validateCampaignTitle(campaignTitleRef.current?.value || '') 
                    ? "Campaign Title must be more than 5 characters." 
                    : ""}
                ref={campaignTitleRef}
                isInvalid={isTitleTouched && !validateCampaignTitle(campaignTitleRef.current?.value || '')}
                onChange={(e) => {
                    checkFormValidity();
                    if (isTitleTouched) {
                        setIsTitleTouched(!validateCampaignTitle(e.target.value));
                    }
                }}
                onBlur={() => setIsTitleTouched(true)}
            />

            <Textarea
                size="lg"
                radius="sm"
                name="campaignDescription"
                placeholder="Campaign description"
                errorMessage={isDescriptionTouched && !validateCampaignDescription(campaignDescriptionRef.current?.value || '') 
                    ? "Please enter a description for your Campaign (more than 10 characters)." 
                    : ""}
                ref={campaignDescriptionRef}
                isInvalid={isDescriptionTouched && !validateCampaignDescription(campaignDescriptionRef.current?.value || '')}
                onChange={(e) => {
                    checkFormValidity();
                    if (isDescriptionTouched) {
                        setIsDescriptionTouched(!validateCampaignDescription(e.target.value));
                    }
                }}
                onBlur={() => setIsDescriptionTouched(true)}
            />

			<Input
				type="date"
				size="lg"
				radius="sm"
				name="startDate"
				placeholder="Start date"
				errorMessage={isStartDateTouched && !validateDates() 
					? "Please enter a valid start date (after today)." 
					: ""}
				ref={startDateRef}
				isInvalid={isStartDateTouched && !validateDates()}
				onChange={(e) => {
					checkFormValidity();
					if (isStartDateTouched) {
						setIsStartDateTouched(!validateDates());
					}
				}}
				onBlur={() => setIsStartDateTouched(true)}
			/>

			<Input
				type="date"
				size="lg"
				radius="sm"
				name="endDate"
				placeholder="End date"
				errorMessage={isEndDateTouched && !validateDates() 
					? "Please enter a valid end date (after start date)." 
					: ""}
				ref={endDateRef}
				isInvalid={isEndDateTouched && !validateDates()}
				onChange={(e) => {
					checkFormValidity();
					if (isEndDateTouched) {
						setIsEndDateTouched(!validateDates());
					}
				}}
				onBlur={() => setIsEndDateTouched(true)}
			/>


            <Input
                type="text"
                size="lg"
                radius="sm"
                name="websiteUrl"
                placeholder="Website URL"
                errorMessage={isUrlTouched && !validateWebsiteUrl(websiteUrlRef.current?.value || '') 
                    ? "Please enter a valid Website URL." 
                    : ""}
                ref={websiteUrlRef}
                isInvalid={isUrlTouched && !validateWebsiteUrl(websiteUrlRef.current?.value || '')}
                onChange={(e) => {
                    checkFormValidity();
                    if (isUrlTouched) {
                        setIsUrlTouched(!validateWebsiteUrl(e.target.value));
                    }
                }}
                onBlur={() => setIsUrlTouched(true)}
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
