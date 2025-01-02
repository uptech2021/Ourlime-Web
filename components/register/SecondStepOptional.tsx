'use client';

import { Crop } from 'lucide-react';
import { Button } from '@nextui-org/react';
import { Dispatch, SetStateAction, useState } from 'react';
import Modal from 'react-modal';
import transparentLogo from 'public/images/transparentLogo.png';
import NextImage from 'next/image';
import ReactCrop, { type Crop as CropType } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<CropType>({
    unit: '%',
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
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
    setCrop({
      unit: '%',
      x: 0,
      y: 0,
      width: 100,
      height: 100
    });
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });


    const Image = async (imageSrc: string, pixelCrop: any) => {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      // Set canvas size to match crop dimensions
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
  
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
        }, 'image/jpeg', 1);
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
            <NextImage
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

        <div className="flex flex-wrap justify-center items-center w-full lg:gap-6 2xl:gap-12 h-auto">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="relative flex justify-center items-center w-2/5 h-64 border-2 border-dashed border-black rounded-xl bg-gray-200 bg-opacity-50 cursor-pointer hover:opacity-90 transition-opacity lg:w-1/5 xl:h-64 m-2"
              onClick={() => document.getElementById(`fileInput-${index}`)?.click()}
            >
              {selectedImages[index] ? (
                <>
                  <div className="w-full h-full flex items-center justify-center relative">
                    <NextImage
                      src={selectedImages[index]}
                      alt={`Uploaded ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover" // Changed from object-contain
                      fill
                      sizes="(max-width: 768px) 40vw, (max-width: 1200px) 20vw"
                      priority
                    />
                  </div>

                  <div className="absolute top-1 right-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCropClick(index);
                      }}
                      className="bg-greenTheme rounded-full p-1 w-8 h-8 min-w-0"
                    >
                      <Crop className="text-white size-3" />
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
              <label htmlFor={`fileInput-${index}`} className="sr-only">Upload image {index + 1}</label>
              <input
                type="file"
                id={`fileInput-${index}`}
                accept="image/*"
                onChange={handleImageChange(index)}
                className="hidden"
                aria-label={`Upload image ${index + 1}`}
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
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                aspect={undefined}
                className="max-w-full max-h-full"
              >
                <NextImage
                  ref={(img) => setImgRef(img)}
                  src={selectedImages[cropperVisible]}
                  alt="Crop me"
                  style={{ maxHeight: '70vh', width: '100%', objectFit: 'contain' }}
                />
              </ReactCrop>
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
                  if (crop && imgRef && selectedImages[cropperVisible]) {
                    const croppedImage = await Image(
                      selectedImages[cropperVisible],
                      {
                        x: (crop.x * imgRef.width) / 100,
                        y: (crop.y * imgRef.height) / 100,
                        width: (crop.width * imgRef.width) / 100,
                        height: (crop.height * imgRef.height) / 100
                      }
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
