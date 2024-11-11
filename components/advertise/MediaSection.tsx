import { AdvertiseFormError } from '@/types/advertise';
import { Button, Input } from '@nextui-org/react';
import { ImageIcon } from 'lucide-react';
import {
	ChangeEvent,
	Dispatch,
	MutableRefObject,
	RefObject,
	SetStateAction,
	useEffect,
	useState,
	useCallback,
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
}: MediaSectionProps) {
    const [isFormValid, setIsFormValid] = useState(false);

    const checkFormValidity = useCallback(() => {
        setIsFormValid(!!companyNameValue && !!selectedFile);
    }, [companyNameValue, selectedFile]);

    useEffect(() => {
        checkFormValidity();
    }, [checkFormValidity]);

    useEffect(() => {
        // Load data from sessionStorage on component mount
        sessionStorage.getItem('companyName');
        sessionStorage.getItem('fileName');
    }, []);

    useEffect(() => {
        // Save company name to sessionStorage whenever it changes
        sessionStorage.setItem('companyName', companyNameValue);
        console.log('Stored company name:', companyNameValue);
    }, [companyNameValue]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        if (file) {
            sessionStorage.setItem('fileName', file.name);
            console.log('Stored file name:', file.name);
        } else {
            sessionStorage.removeItem('fileName');
            console.log('Removed stored file name');
        }
    };

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
				label="Company Name"
				placeholder="Enter your company name"
				value={companyNameValue}
				onChange={(e) => setCompanyNameValue(e.target.value)}
				isInvalid={error.companyName}
				variant="flat"
				labelPlacement="outside"
				classNames={{
					input: "border-0",
					inputWrapper: "border-0",
					label: "text-sm font-medium"
				}}
				data-focus="true"
			/>

			<p className="text-sm">Select an image for your campaign</p>
			<div className="relative h-96 border-b-2 border-b-gray-700 bg-[#f5f5f5]">
				<div 
					className="flex h-full w-full items-center justify-center bg-contain bg-center bg-no-repeat"
					style={{ backgroundImage: selectedFile ? `url(${URL.createObjectURL(selectedFile)})` : 'none' }}
				>
					<Button
						className="mx-auto flex w-auto cursor-pointer flex-row items-center justify-center rounded-lg bg-white bg-opacity-75 p-3 transition-opacity hover:bg-opacity-100"
						startContent={<ImageIcon />}
						onClick={() => fileInputRef.current?.click()}
					>
						<p className="text-sm">
							{selectedFile ? 'Change Photo / Video' : 'Select Photos / Videos'}
						</p>
					</Button>
				</div>
				{selectedFile && (
					<div className="absolute bottom-2 left-2 bg-black bg-opacity-50 p-1 text-xs text-white">
						{selectedFile.name}
					</div>
				)}
				<Input
					ref={fileInputRef}
					type="file"
					name="file"
					accept="image/*,video/*"
					className="hidden"
					onChange={handleFileChange}
					aria-label="File upload"
					title="Upload file"
				/>
			</div>

			{error.file && (
				<p className="text-sm text-red-500">Please upload a file.</p>
			)}
			<Button
				onClick={() => changeForm()}
				className={`mx-auto w-1/2 transition-all duration-300 ${
					isFormValid
					  ? 'cursor-pointer bg-gray-300 hover:bg-gray-400'
					  : 'cursor-not-allowed bg-gray-200'
				  }`}
				disabled={!isFormValid}
			>
				Next
			</Button>
		</section>
	);
}