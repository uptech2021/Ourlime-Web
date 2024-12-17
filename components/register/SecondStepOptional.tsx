'use client';
import { Crop } from 'lucide-react';
import { Button } from '@nextui-org/react';
import { Dispatch, SetStateAction, useState } from 'react';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import transparentLogo from 'public/images/transparentLogo.png';
import Images from 'next/image';





type SecondStepProps = {
  setStep: Dispatch<SetStateAction<number>>;
  handleAvatarSelection: (avatar: string) => void;
  profilePicture: string | null;
  setProfilePicture: Dispatch<SetStateAction<string | null>>;
};

export default function SecondStep({
  setStep,
  handleAvatarSelection,
  profilePicture,
  setProfilePicture,
}: SecondStepProps) {
  const [imageUpload, setImageUpload] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>(Array(6).fill(null));
  const [cropperVisible, setCropperVisible] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const totalSteps = 5;
   const currentStep = 2;
   const progressPercentage = (currentStep / totalSteps) * 100;

  const handleImageChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...selectedImages];
        newImages[index] = reader.result as string;
        setSelectedImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropClick = (index: number) => {
    setCropperVisible(index);
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        }
      }, 'image/jpeg');
    });
  };

  return (
    <div className="step-2-optional">
      <div className="relative w-full px-4 mb-4 mt-6">
								<div className="w-full bg-gray-300 h-4 rounded-full">
									<div
										className="bg-greenTheme h-full relative rounded-full transition-all duration-300"
										style={{ width: `${progressPercentage}%` }}
									>
										<Images
											src={transparentLogo}
											alt="Logo"
											className="absolute top-1 right-0 transform translate-x-1/2 -translate-y-1/2"
											width={40}
											height={40}
										/>
									</div>
								</div>
							</div>
      <div className="flex flex-col justify-center items-center py-40 bg-gray-100 bg-opacity-50 rounded-xl lg:py-20">
        <h1 className="text-xl font-bold text-white mb-4">Select your photo</h1>
        
        {imageUpload && (
          <div className="w-1/2 max-w-md self-end mb-2 ">
            <Button 
              onClick={() => handleCropClick(null)}
              className="bg-greenTheme rounded-full p-2 ml-4 md:ml-16 xl:ml-24"
            >
              <Crop className="text-white" size={24} />
            </Button>
          </div>
        )}

        <div className="flex flex-wrap justify-center items-center w-full lg:gap-6 2xl:gap-12 h-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="relative flex justify-center items-center w-2/5 h-64 border-2 border-dashed border-black rounded-xl bg-gray-200 bg-opacity-50 
               lg:w-1/5 xl:h-64 m-2" 
              onClick={() => document.getElementById(`fileInput-${index}`)?.click()}
            >
              {selectedImages[index] ? (
                <>
                  <img src={selectedImages[index]} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute top-0  left-6 md:left-36">
                    <Button onClick={() => handleCropClick(index)} className="bg-greenTheme rounded-full p-2">
                      <Crop className="text-white size-6 lg:size-24"  />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="absolute flex items-center justify-center w-full h-full">
                  <div className="flex justify-center w-12 h-12 bg-greenTheme rounded-full">
                    <div className="text-white text-4xl">+</div>
                  </div>
                </div>
              )}
              <input
                type="file"
                id={`fileInput-${index}`}
                accept="image/*"
                onChange={handleImageChange(index)}
                className="hidden"
              />
            </div>
          ))}
        </div>

        {cropperVisible !== null && (
          <Modal 
            isOpen={true} 
            onRequestClose={() => setCropperVisible(null)} 
            contentLabel="Crop Image"
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              },
              content: {
                position: 'relative',
                inset: 'auto',
                width: '90%',
                maxWidth: '500px',
                height: 'auto',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                margin: '0 auto'
              }
            }}
          >
            <h2 className="text-xl font-bold mb-4">Crop Image</h2>
            <div className="relative w-full h-[320px]">
              <Cropper
                image={selectedImages[cropperVisible]}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                objectFit="contain"
              />
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <Button 
                onClick={() => setCropperVisible(null)} 
                className="bg-gray-500 text-white px-4 py-2"
              >
                Cancel
              </Button>
              <Button 
                onClick={async () => {
                  if (croppedAreaPixels && selectedImages[cropperVisible]) {
                    const croppedImage = await getCroppedImg(
                      selectedImages[cropperVisible],
                      croppedAreaPixels
                    );
                    const newImages = [...selectedImages];
                    newImages[cropperVisible] = croppedImage as string;
                    setSelectedImages(newImages);
                    setCropperVisible(null);
                  }
                }} 
                className="bg-greenTheme text-white px-4 py-2"
              >
                Accept
              </Button>
            </div>
          </Modal>
        )}
      </div>
      <div className="flex w-full flex-col justify-center gap-1 md:flex-row md:px-20 md:gap-8">
					<Button
						onClick={() => setStep(2)}
						type="button"
						className="submit my-4 w-1/4 rounded-full bg-white px-4 py-2 text-greenTheme hover:bg-gray-300"
					>
						Previous Step
					</Button>
					<Button
						onClick={() => setStep(3)}
						type="button"
						
						
						className="submit my-4 w-1/4 rounded-full bg-greenTheme px-4 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Next Step!
					</Button>
				</div>
    </div>
  );
}
