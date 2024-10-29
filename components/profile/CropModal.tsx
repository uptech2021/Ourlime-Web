import React, { useState } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from 'next/image';

interface CropModalProps {
  imageUrl: string | null;
  onCrop: (croppedImageUrl: string) => void;
  onClose: () => void;
  aspect?: number;
}

const CropModal: React.FC<CropModalProps> = ({ imageUrl, onCrop, onClose, aspect }) => {
  const [crop, setCrop] = useState<Crop>();
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }

  const handleCrop = () => {
    if (imgRef && crop) {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.naturalWidth / imgRef.width;
      const scaleY = imgRef.naturalHeight / imgRef.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          imgRef,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const croppedImageUrl = URL.createObjectURL(blob);
            onCrop(croppedImageUrl);
          }
        }, 'image/jpeg');
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Crop Image</h2>
        {imageUrl && (
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            circularCrop
            aspect={1}
          >
            <Image
              ref={setImgRef}
              src={imageUrl}
              alt="Crop me"
              onLoad={onImageLoad}
              style={{ maxHeight: '70vh', maxWidth: '100%' }}
              width={500}
              height={500}
            />
          </ReactCrop>
        )}
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleCrop}
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
