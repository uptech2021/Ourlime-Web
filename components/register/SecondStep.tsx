'use client';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState, useCallback } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import transparentLogo from 'public/images/transparentLogo.png';



const totalSteps = 5;
const currentStep = 2;
const progressPercentage = (currentStep / totalSteps) * 100;

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
			<div className="step-2 gap- flex flex-col justify-center">
				
				<div className="relative w-full px-4 mb-4 mt-6">
								<div className="w-full bg-gray-300 h-4 rounded-full">
									<div
										className="bg-greenTheme h-full relative rounded-full transition-all duration-300"
										style={{ width: `${progressPercentage}%` }}
									>
										<Image
											src={transparentLogo}
											alt="Logo"
											className="absolute top-1 right-0 transform translate-x-1/2 -translate-y-1/2"
											width={40}
											height={40}
										/>
									</div>
								</div>
							</div>
				<div className="flex flex-col justify-center gap-3 border-1 border-x-0 border-greenTheme bg-black bg-opacity-[50%] px-5 py-4 font-bold text-white sm:border-x-2 lg:px-0  ">
				<h1 className="text-xl text-center font-bold text-white">Select your avatar</h1>
					{/* Avatars & Image Upload*/}
					<div
						className={`${imageUpload ? 'hidden' : 'block'} mx-auto flex flex-wrap justify-center`}
					>
						<div className="relative flex flex-wrap justify-center gap-4 lg:gap-12">
							<div
								onClick={() => handleAvatarSelection('cartoonAvatarBlackBoy')}
								className="relative my-1  sm:w-4/12 lg:w-3/12  cursor-pointer"
							>
								<Image
									width={200}
									height={200}
									className="h-full w-full object-cover opacity-100"
									src="/images/register/cartoonAvatarBlackBoy.svg"
									alt="avatar"
								/>
								<Image
									width={50}
									height={50}
									className={`${selectedCartoonAvatarBlackBoy ? 'block' : 'hidden'} absolute bottom-0 right-0 w-4/12 object-cover opacity-100`}
									src="/images/register/check.svg"
									alt="avatar"
								/>
							</div>
							<div
								onClick={() => handleAvatarSelection('cartoonAvatarWhiteBoy')}
								className="relative my-1  sm:w-4/12  lg:w-3/12 cursor-pointer"
							>
								<Image
									width={200}
									height={200}
									className="h-full w-full object-cover opacity-100"
									src="/images/register/cartoonAvatarWhiteBoy.svg"
									alt="avatar"
								/>
								<Image
									width={50}
									height={50}
									className={`${selectedCartoonAvatarWhiteBoy ? 'block' : 'hidden'} absolute bottom-0 right-0 w-4/12 object-cover opacity-100`}
									src="/images/register/check.svg"
									alt="avatar"
								/>
							</div>
							<div
								onClick={() => handleAvatarSelection('cartoonAvatarBlackGirl')}
								className="relative my-1 sm:w-4/12 lg:w-3/12 cursor-pointer"
							>
								<Image
									width={200}
									height={200}
									className="h-full w-full object-cover opacity-100"
									src="/images/register/cartoonAvatarBlackGirl.svg"
									alt="avatar"
								/>
								<Image
									width={50}
									height={50}
									className={`${selectedCartoonAvatarBlackGirl ? 'block' : 'hidden'} absolute bottom-0 right-0 w-4/12 object-cover opacity-100`}
									src="/images/register/check.svg"
									alt="avatar"
								/>
							</div>
						
						<div
								onClick={() => handleAvatarSelection('cartoonAvatarWhiteGirl')}
								className="relative my-1 sm:w-4/12 lg:w-3/12 cursor-pointer"
							>
								<Image
									width={200}
									height={200}
									className="h-full w-full object-cover opacity-100"
									src="/images/register/cartoonAvatarWhiteGirl.svg"
									alt="avatar"
								/>
								<Image
									width={50}
									height={50}
									className={`${selectedCartoonAvatarWhiteGirl ? 'block' : 'hidden'} absolute bottom-0 right-0 w-4/12 object-cover opacity-100`}
									src="/images/register/check.svg"
									alt="avatar"
								/>
							</div>
							<div
								onClick={() => handleAvatarSelection('realisticAvatarWhiteMan')}
								className="relative my-1 sm:w-4/12 lg:w-3/12 cursor-pointer"
							>
								<Image
									width={200}
									height={200}
									className="h-full w-full object-cover opacity-100"
									src="/images/register/realisticAvatarWhiteMan.svg"
									alt="avatar"
								/>
								<Image
									width={50}
									height={50}
									className={`${selectedRealisticAvatarWhiteMan ? 'block' : 'hidden'} absolute bottom-0 right-0 w-4/12 object-cover opacity-100`}
									src="/images/register/check.svg"
									alt="avatar"
								/>
							</div>
							<div
								onClick={() =>
									handleAvatarSelection('realisticAvatarBlackWoman')
								}
								className="relative my-1 sm:w-4/12 lg:w-3/12 cursor-pointer"
							>
								<Image
									width={200}
									height={200}
									className="h-full w-full object-cover opacity-100"
									src="/images/register/realisticAvatarBlackWoman.svg"
									alt="avatar"
								/>
								<Image
									width={50}
									height={50}
									className={`${selectedRealisticAvatarBlackWoman ? 'block' : 'hidden'} absolute bottom-0 right-0 w-4/12 object-cover opacity-100`}
									src="/images/register/check.svg"
									alt="avatar"
								/>
							</div>
						</div>
					</div>

					{/* <ImageCropper /> */}

					<h3
						onClick={() => setStep(2.1)}
						className="text-bold cursor-pointer text-center text-lg text-greenTheme underline"
					>
						{/* {imageUpload ? 'Select your own avatar' : 'Use your own picture.'} */}
						Use your own picture
					</h3>
				</div>

				<div className="flex w-full flex-col gap-1 md:flex-row md:px-20">
					<Button
						onClick={() => setStep(1)}
						type="button"
						className="submit my-4 w-full rounded-full bg-white px-4 py-2 text-greenTheme hover:bg-gray-300"
					>
						Previous Step
					</Button>
					<Button
						onClick={() => setStep(3)}
						type="button"
						disabled={
							!(
								selectedCartoonAvatarBlackBoy ||
								selectedCartoonAvatarWhiteBoy ||
								selectedCartoonAvatarBlackGirl ||
								selectedCartoonAvatarWhiteGirl ||
								selectedRealisticAvatarWhiteMan ||
								selectedRealisticAvatarBlackWoman
							)
						}
						className="submit my-4 w-full rounded-full bg-greenTheme px-4 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Next Step!
					</Button>
				</div>
			</div>
		);
}
