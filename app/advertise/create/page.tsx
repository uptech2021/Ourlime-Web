'use client';
//TODO Aaron turn these functions into form actions

import Navbar from '@/comm/Navbar';
import AdvertiseHeader from '@/components/advertise/AdvertiseHeader';
import DetailsSection from '@/components/advertise/DetailsSection';
import MediaSection from '@/components/advertise/MediaSection';
import TargetingSection from '@/components/advertise/TargetingSection';
import { AdvertiseFormError } from '@/types/advertise';
import { useRef, useState } from 'react';

export default function Page() {
	const [activeTab, setActiveTab] = useState<string>('Campaigns');
	const [formState, setFormState] = useState<string>('Media');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	//Media Section
	const fileInputRef = useRef<HTMLInputElement>(null);
	const companyNameRef = useRef<HTMLInputElement>(null);
	const [companyNameValue, setCompanyNameValue] = useState<string>('');
	const campaignNameRef = useRef<HTMLInputElement>(null);
	console.log(campaignNameRef);
	//Details Section
	const campaignTitleRef = useRef<HTMLInputElement>(null);
	const campaignDescriptionRef = useRef<HTMLTextAreaElement>(null);
	const startDateRef = useRef<HTMLInputElement>(null);
	const endDateRef = useRef<HTMLInputElement>(null);
	const websiteUrlRef = useRef<HTMLInputElement>(null);

	//Targeting Section
	const placementRef = useRef<HTMLInputElement>(null);
	const biddingRef = useRef<HTMLInputElement>(null);
	const locationRef = useRef<HTMLInputElement>(null);
	const genderRef = useRef<HTMLSelectElement>(null);

	const [isFormValid, setIsFormValid] = useState(false);
	const [error, setError] = useState<AdvertiseFormError>({
		companyName: false,
		campaignName: false,
		campaignTitle: false,
		campaignDescription: false,
		startDate: false,
		endDate: false,
		websiteUrl: false,
		file: false,
	});

	function changeForm() {
		if (formState === 'Media') {
			const newError = {
				...error,
				companyName: !companyNameRef.current?.value,
				file: !selectedFile,
			};
			setError(newError);

			if (!Object.values(newError).some(Boolean)) {
				setFormState('Details');
				if (companyNameRef.current?.value)
					setCompanyNameValue(companyNameRef.current?.value);
			}
		} else if (formState === 'Details') {
			const newError = {
				...error,
				campaignTitle: !campaignTitleRef.current?.value,
				campaignDescription: !campaignDescriptionRef.current?.value,
				startDate: !startDateRef.current?.value,
				endDate: !endDateRef.current?.value,
				websiteUrl: !websiteUrlRef.current?.value,
			};
			setError(newError);
			console.log(newError);

			if (
				!newError.campaignTitle &&
				!newError.campaignDescription &&
				!newError.startDate &&
				!newError.endDate &&
				!newError.websiteUrl
			) {
				setFormState('Targeting');
			}
		}
	}

	function handleFileChange() {
		const file = fileInputRef.current?.files?.[0] || null;
		setSelectedFile(file);
		setError({
			...error,
			file: !file,
		});

		// Clear the input for the next selection
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}

	function renderSections() {
		switch (formState) {
			case 'Media':
				return (
					<MediaSection
						error={error}
						companyNameRef={companyNameRef}
						companyNameValue={companyNameValue}
						setCompanyNameValue={setCompanyNameValue}
						fileInputRef={fileInputRef}
						selectedFile={selectedFile}
						setSelectedFile={setSelectedFile}
						changeForm={changeForm}
						handleFileChange={handleFileChange}
					/>
				);
			case 'Details':
				return (
					<DetailsSection
						error={error}
						campaignTitleRef={campaignTitleRef}
						campaignDescriptionRef={campaignDescriptionRef}
						startDateRef={startDateRef}
						endDateRef={endDateRef}
						websiteUrlRef={websiteUrlRef}
						changeForm={changeForm}
						setFormState={setFormState}
					/>
				);
			case 'Targeting':
				return (
					<TargetingSection
						error={error}
						campaignNameRef={companyNameRef}
						campaignDescriptionRef={campaignDescriptionRef}
						startDateRef={startDateRef}
						endDateRef={endDateRef}
						websiteUrlRef={websiteUrlRef}
						placementRef={placementRef}
						biddingRef={biddingRef}
						locationRef={locationRef}
						genderRef={genderRef}
						changeForm={changeForm}
						setFormState={setFormState}
						isFormValid={isFormValid}
						setIsFormValid={setIsFormValid}
					/>
				);
			default:
				return null;
		}
	}

	return (
		<Navbar>
			<AdvertiseHeader setActiveTab={setActiveTab} activeTab={activeTab} />

			<main className="mx-auto flex w-[90%] flex-col gap-5 px-4 py-10 shadow-lg lg:w-2/3 2xl:w-1/2">
				<div className="flex flex-row flex-wrap gap-1">
					<div className="relative bg-gray-400 px-4 py-2 text-center text-sm font-semibold">
						Media
						<div className="absolute left-0 top-0 h-full w-4 bg-gray-400">
							<div className="absolute left-0 top-1/2 h-0 w-0 -translate-y-1/2 border-b-4 border-l-4 border-t-4 border-b-transparent border-l-white border-t-transparent"></div>
						</div>
						<div className="absolute right-0 top-0 h-full w-4 bg-gray-400">
							<div className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-b-4 border-r-4 border-t-4 border-b-transparent border-r-gray-200 border-t-transparent"></div>
						</div>
					</div>

					<div
						className={`relative bg-gray-${formState === 'Details' || formState === 'Targeting' ? '400' : '200'} px-4 py-2 text-center text-sm font-semibold`}
					>
						Details
						<div
							className={`absolute left-0 top-0 h-full w-4 bg-gray-${formState === 'Details' || formState === 'Targeting' ? '400' : '200'}`}
						>
							<div className="absolute left-0 top-1/2 h-0 w-0 -translate-y-1/2 border-b-4 border-l-4 border-t-4 border-b-transparent border-l-white border-t-transparent"></div>
						</div>
						<div
							className={`absolute right-0 top-0 h-full w-4 bg-gray-${formState === 'Details' || formState === 'Targeting' ? '400' : '200'}`}
						>
							<div className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-b-4 border-r-4 border-t-4 border-b-transparent border-r-gray-200 border-t-transparent"></div>
						</div>
					</div>

					<div
						className={`relative bg-gray-${formState === 'Targeting' ? '400' : '200'} px-4 py-2 text-center text-sm font-semibold`}
					>
						Targeting
						<div
							className={`absolute left-0 top-0 h-full w-4 bg-gray-${formState === 'Targeting' ? '400' : '200'}`}
						>
							<div className="absolute left-0 top-1/2 h-0 w-0 -translate-y-1/2 border-b-4 border-l-4 border-t-4 border-b-transparent border-l-white border-t-transparent"></div>
						</div>
						<div
							className={`absolute right-0 top-0 h-full w-4 bg-gray-${formState === 'Targeting' ? '400' : '200'}`}
						>
							<div className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-b-4 border-r-4 border-t-4 border-b-transparent border-r-gray-200 border-t-transparent"></div>
						</div>
					</div>
				</div>

				{renderSections()}
			</main>
		</Navbar>
	);
}
