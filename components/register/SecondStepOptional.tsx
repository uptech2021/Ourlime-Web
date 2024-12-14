'use client';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState, useCallback } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import ImageCropper from '../ImageCropper';

type SecondStepProps = {
  setStep: Dispatch<SetStateAction<number>>;
  handleAvatarSelection: (avatar: string) => void;
  selectedCartoonAvatarBlackBoy: boolean;
  selectedCartoonAvatarWhiteBoy: boolean;
  selectedCartoonAvatarBlackGirl: boolean;
  selectedCartoonAvatarWhiteGirl: boolean;
  selectedRealisticAvatarWhiteMan: boolean;
  selectedRealisticAvatarBlackWoman: boolean;
  profilePicture: string | null;
  setProfilePicture: Dispatch<SetStateAction<string | null>>;
};

export default function SecondStep({
  setStep,
  handleAvatarSelection,
  selectedCartoonAvatarBlackBoy,
  selectedCartoonAvatarWhiteBoy,
  selectedCartoonAvatarBlackGirl,
  selectedCartoonAvatarWhiteGirl,
  selectedRealisticAvatarWhiteMan,
  selectedRealisticAvatarBlackWoman,
  profilePicture,
  setProfilePicture,
}: SecondStepProps) {
   const [imageUpload, setImageUpload] = useState(false);

  	return (
			<div className="step-2-optional  ">
			<div className=" flex flex-col justify-center items-center py-40 bg-black bg-opacity-70">
				<h1 className="text-xl font-bold text-white mb-4">Select your photo</h1>
				<div className="relative flex justify-center items-center w-1/3 max-w-md h-80 border-4 border-dashed rounded-lg bg-white">
					{/* Centered "+" icon for photo upload */}
					<div className="absolute flex items-center justify-center w-full h-full">
						<div className="text-greenTheme text-4xl">+</div>
					</div>
				</div>
				</div>
			
				<div className="flex w-full flex-col gap-1 md:flex-row md:px-20 mt-4">
					<Button
						onClick={() => setStep(2)}
						type="button"
						className="submit my-4 w-full rounded-full bg-white px-4 py-2 text-greenTheme hover:bg-gray-300"
					>
						Previous Step
					</Button>
					<Button
						onClick={() => setStep(3)}
						type="button"
						
						className="submit my-4 w-full rounded-full bg-greenTheme px-4 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Next Step!
					</Button>
				</div>
				</div>
			
		);
}
