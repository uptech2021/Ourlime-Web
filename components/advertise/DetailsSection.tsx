import { AdvertiseFormError } from '@/types/advertise';
import { Button, Input, Textarea, DatePicker } from '@nextui-org/react';
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
    const [startDate, setStartDate] = useState<any | null>(null);
    const [endDate, setEndDate] = useState<any | null>(null);
    const [dateErrorMessage, setDateErrorMessage] = useState<string | null>(null);

    const validateDates = (): string | null => {
        if (!isStartDateTouched && !isEndDateTouched) {
            return null;
        }

        const start = startDateRef.current?.value;
        const end = endDateRef.current?.value;

        if (!start || !end) {
            return "Please select both start and end dates";
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (startDate.getTime() === today.getTime() || endDate.getTime() === today.getTime()) {
            return "Date invalid. Please choose a date that is not today";
        }

        if (startDate < today || endDate < today) {
            return "Only future dates are allowed";
        }

        if (endDate <= startDate) {
            return "End date must be after start date";
        }

        return null;
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
        const urlValid = validateWebsiteUrl(websiteUrlRef.current?.value || '');
        const dateError = validateDates();

        setDateErrorMessage(dateError);

        const isValid = titleValid && descriptionValid && urlValid && !dateError;
        setIsFormValid(isValid);
    };

    const saveToSessionStorage = () => {
        sessionStorage.setItem('campaignTitle', campaignTitleRef.current?.value || '');
        sessionStorage.setItem('campaignDescription', campaignDescriptionRef.current?.value || '');
        sessionStorage.setItem('startDate', startDateRef.current?.value || '');
        sessionStorage.setItem('endDate', endDateRef.current?.value || '');
        sessionStorage.setItem('websiteUrl', websiteUrlRef.current?.value || '');
    };

    return (
        <section className="my-1 flex flex-col gap-3">

            <Input
                type="text"
                size="lg"
                radius="sm"
                name="campaignTitle"
                label="Campaign Title"
                placeholder="Enter your campaign title"
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
                variant="flat"
                labelPlacement="outside"
                classNames={{
                    input: "border-0",
                    inputWrapper: "border-0",
                    label: "text-sm font-medium"
                }}
                data-focus="true"
            />


            <Textarea
                size="lg"
                radius="sm"
                name="campaignDescription"
                label="Campaign description"
                placeholder="Enter your campaign description"
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
                variant="flat"
                labelPlacement="outside"
                classNames={{
                    input: "border-0",
                    inputWrapper: "border-0",
                    label: "text-sm font-medium"
                }}
                data-focus="true"
            />

            <div className="flex gap-3 flex-col">
                <div className="flex gap-3">

                    <DatePicker
                        label="Start Date"
                        variant="flat"
                        showMonthAndYearPickers
                        value={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                            setIsStartDateTouched(true);
                            if (startDateRef.current) {
                                startDateRef.current.value = date ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}` : '';
                            }
                            checkFormValidity();
                        }}
                        onBlur={() => setIsStartDateTouched(true)}
                        ref={startDateRef}
                        labelPlacement='outside'
                        classNames={{
                            input: "border-0",
                            inputWrapper: "border-0",
                            label: "text-sm font-medium"
                        }}
                        data-focus="true"
                    />

                    <DatePicker
                        label="End Date"
                        variant="flat"
                        showMonthAndYearPickers
                        value={endDate}
                        onChange={(date) => {
                            setEndDate(date);
                            setIsEndDateTouched(true);
                            if (endDateRef.current) {
                                endDateRef.current.value = date ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}` : '';
                            }
                            checkFormValidity();
                        }}
                        onBlur={() => setIsEndDateTouched(true)}
                        ref={endDateRef}
                        labelPlacement='outside'
                        classNames={{
                            input: "border-0",
                            inputWrapper: "border-0",
                            label: "text-sm font-medium"
                        }}
                        data-focus="true"
                    />
                </div>
                {dateErrorMessage && (
                    <p className="text-red-500 text-sm">{dateErrorMessage}</p>
                )}
            </div>

            <Input
                type="text"
                size="lg"
                radius="sm"
                name="websiteUrl"
                label="Website URL"
                placeholder="Enter your website URL eg. https://www.example.com"
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
                variant="flat"
				labelPlacement="outside"
                classNames={{
                    input: "border-0",
                    inputWrapper: "border-0",
                    label: "text-sm font-medium"
                }}
                data-focus="true"
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
