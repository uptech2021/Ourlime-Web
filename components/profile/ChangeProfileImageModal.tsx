'use client';

import { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ProfileImage } from '@/types/userTypes';

interface ChangeProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingImages: ProfileImage[];
  onSelectImage: (image: ProfileImage) => void;
  onUploadNewImage: (file: File) => void;
}

export default function ChangeProfileImageModal({ 
  isOpen, 
  onClose, 
  existingImages, 
  onSelectImage, 
  onUploadNewImage 
}: ChangeProfileImageModalProps) {
  const [activeTab, setActiveTab] = useState('existing');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedExistingImage, setSelectedExistingImage] = useState<ProfileImage | null>(null);
  const [selectedNewImage, setSelectedNewImage] = useState<File | null>(null);

  const handleExistingImageSelect = (image: ProfileImage) => {
    setSelectedExistingImage(image);
    setSelectedNewImage(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedNewImage(file);
      setSelectedExistingImage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (selectedExistingImage) {
      onSelectImage(selectedExistingImage);
    } else if (selectedNewImage) {
      onUploadNewImage(selectedNewImage);
    }
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl m-auto rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Change Profile Picture</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full" title='Close'>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('existing')}
            className={`flex-1 px-4 py-3 font-medium ${
              activeTab === 'existing' ? 'text-greenTheme border-b-2 border-greenTheme' : 'text-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ImageIcon size={20} />
              Existing Photos
            </div>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-3 font-medium ${
              activeTab === 'upload' ? 'text-greenTheme border-b-2 border-greenTheme' : 'text-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Upload size={20} />
              Upload New
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {activeTab === 'existing' ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {existingImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => handleExistingImageSelect(image)}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedExistingImage?.id === image.id 
                    ? 'ring-2 ring-greenTheme' 
                    : 'hover:ring-2 hover:ring-greenTheme/50'
                  }`}
                >
                  <Image
                    src={image.imageURL}
                    alt="Profile option"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    loader={({ src }) => src}
                    unoptimized={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="profileImage"
                className="inline-flex flex-col items-center gap-2 cursor-pointer"
              >
                {previewImage ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload size={24} className="text-gray-500" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-600">
                  {previewImage ? 'Change photo' : 'Click to upload a new photo'}
                </span>
                <span className="text-xs text-gray-500">
                  JPG, PNG or GIF (max. 5MB)
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedExistingImage && !selectedNewImage}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
              selectedExistingImage || selectedNewImage 
              ? 'bg-greenTheme hover:bg-green-600' 
              : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
