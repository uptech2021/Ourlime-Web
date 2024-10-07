import React from 'react'

export default function ImageCropper() {
  return (
		<>
			<label className="mb-3 block w-full">
				<span className="sr-only">Choose profile photo</span>
				<input
					type="file"
					accept="image/*"
					// onChange={onSelectFile}
					className="block w-full text-sm text-gray-500 file:mr-5 file:rounded-full file:border-0 file:bg-gray-700 file:px-4 file:py-2 file:text-sm file:text-sky-300 hover:file:bg-gray-600"
				/>
			</label>
		</>
	);
}
