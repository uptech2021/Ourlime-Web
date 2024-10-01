'use client'
import { StaticImageData } from 'next/image';
import { useState } from 'react';

type Download = {
  title: string,
  image: StaticImageData,
}

type DownloadProps = {
  downloads: Download[]
}

export default function DownloadData({ downloads }: DownloadProps) {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const toggleSelection = (index: number) => {
    setSelectedIndices(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className='grid grid-cols-2 lg:grid-cols-3 gap-6 mx-auto'>
      {downloads.map((download, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg m-[1rem] w-[8rem] lg:w-[9rem] h-[8rem] lg:h-[11rem] transition-colors duration-300 ${selectedIndices.includes(index) ? 'bg-gray-500' : 'bg-gray-400'
            }`}
          onClick={() => toggleSelection(index)}
        >
          <button className="w-12 h-12 rounded-full bg-blue-200 mt-2 lg:mt-6" />
          <p className="mt-2 text-gray-800 text-sm">{download.title}</p>
        </div>
      ))}
    </div>
  );
}
