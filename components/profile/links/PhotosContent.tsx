'use client';

import { UserData, ProfileImage } from '@/types/userTypes';
import Image from 'next/image';

type PhotosContentProps = {
  userData: UserData;
  profileImage: ProfileImage;
}

export default function PhotosContent({ userData, profileImage }: PhotosContentProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Photos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Photos grid will go here */}
        </div>
      </div>
    </div>
  );
}
