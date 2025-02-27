'use client';
import React, { useState } from 'react';
import SwitchButton from '../SwitchButton';
import styles from './settings.module.css';
import { Input, Select, SelectItem } from '@nextui-org/react';

export default function FileUploadConfiguration() {
	const [allowExtensions, setAllowExtensions] = useState(
		'jpg,png,gif,doc,docx,pdf'
	);
	const [allowedMimeTypes, setAllowedMimeTypes] = useState(
		'image/jpeg,image/png,image/gif,application/pdf,application/msword'
	);
	const [maxUploadSize, setMaxUploadSize] = useState('Medium');

	return (
		<div className={styles.layout}>
			{/* Left Section */}
			<div className="left w-75">
				{/* Upload & File Sharing Configuration */}
				<div className="other-config mb-5 rounded-lg bg-white p-4">
					<h3 className="text-xl font-semibold">
						Upload & File Sharing Configuration
					</h3>

					{/* File Upload & Sharing */}
					<div className="wrapper mt-4">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								File Upload & Sharing
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							By enabling this feature, the user can share and upload files on
							your site.
						</p>
					</div>

					<hr className="my-4" />

					{/* Video Upload & Sharing */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								Video Upload & Sharing
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Turn on the ability for users to share and upload videos.
						</p>
					</div>

					<hr className="my-4" />

					{/* Reels Upload */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								Reels Upload
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Turn on the ability for users to share and upload reels.
						</p>
					</div>

					<hr className="my-4" />

					{/* Audio Upload & Sharing */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								Audio Upload & Sharing
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Turn on the ability for users to share and upload music and audio
							files.
						</p>
					</div>

					<hr className="my-4" />
				</div>
			</div>

			{/* Right Section */}
			<div className="right w-25">
				{/* General Configuration */}
				<div className="general-config rounded-lg bg-white p-4">
					{/* Allow Extensions */}
					<div className="wrapper">
						<Input
							label="Allow Extensions"
							labelPlacement="outside"
							radius="sm"
							type="text"
							value={allowExtensions}
							onChange={(e) => setAllowExtensions(e.target.value)}
						/>
						<p className="bottom mt-2 text-sm">
							Only those types of files users can upload to your site (separated
							with commas).
						</p>
					</div>

					<hr className="my-4" />

					{/* Allowed MIME Types */}
					<div className="wrapper">
						<Input
							label="Allowed MIME Types"
							labelPlacement="outside"
							radius="sm"
							type="text"
							value={allowedMimeTypes}
							onChange={(e) => setAllowedMimeTypes(e.target.value)}
						/>
						<p className="bottom mt-2 text-sm">
							Only those MIME types of files users can upload to your site
							(separated with commas).
						</p>
					</div>

					<hr className="my-4" />

					{/* Max Upload Size */}
					<div className="wrapper">
						<Select
							radius="sm"
							label="Max Upload Size"
							labelPlacement="outside"
							value={maxUploadSize}
							onChange={(e) => setMaxUploadSize(e.target.value)}
							className="selectTag"
						>
							<SelectItem key="low" value="Low">
								Low
							</SelectItem>
							<SelectItem key="medium" value="Medium">
								Medium
							</SelectItem>
							<SelectItem key="high" value="High">
								High
							</SelectItem>
						</Select>
						<p className="bottom mt-2 text-sm">
							Set the maximum upload size for files.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
