'use client';

import { UserData, ProfileImage } from '@/types/userTypes';

type VideosContentProps = {
  userData: UserData;
  profileImage: ProfileImage;
}

export default function VideosContent({ userData, profileImage }: VideosContentProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Videos grid will go here */}
        </div>
      </div>
    </div>
  );
}
