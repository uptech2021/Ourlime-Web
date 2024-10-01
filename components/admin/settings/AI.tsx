'use client';
import React, { useState } from 'react';
import SwitchButton from '../SwitchButton';
import styles from './settings.module.css';
import { Input, Select, SelectItem } from '@nextui-org/react';

export default function AI() {
	const [apiKey, setApiKey] = useState('');
	const [textModel, setTextModel] = useState('gpt-3.5-turbo');

	return (
		<div className={styles.layout}>
			<div className="flex flex-row justify-between">
				{/* Left Section */}
				<div className="left w-47">
					{/* Open AI Settings */}
					<div className="other-config mb-5 flex flex-col gap-3 rounded-lg bg-white p-4">
						<h3 className="text-xl font-semibold">Open AI Settings</h3>

						<Input
							label="OpenAI API Key"
							labelPlacement="outside"
							radius="sm"
							type="text"
							placeholder="Application ID"
							value={apiKey}
							onChange={(e) => setApiKey(e.target.value)}
						/>

						<hr />

						<Select
							radius="sm"
							label="OpenAI text model"
							labelPlacement="outside"
							value={textModel}
							onChange={(e) => setTextModel(e.target.value)}
							className="selectTag"
						>
							<SelectItem key="gpt-3.5-turbo" value="gpt-3.5-turbo">
								gpt-3.5-turbo
							</SelectItem>
							<SelectItem key="gpt-4" value="gpt-4">
								gpt-4
							</SelectItem>
						</Select>
					</div>

					{/* AI Settings */}
					<div className="other-config rounded-lg bg-white p-4">
						<h3 className="text-xl font-semibold">AI Settings</h3>

						<div className="wrapper">
							<div className="top mt-4 flex items-center justify-between gap-3">
								<span className="rounded-lg bg-gray-300 px-3 py-1">
									AI Images System
								</span>
								<SwitchButton />
							</div>
							<p className="bottom mt-2 text-sm">
								Allow AI to generate images.
							</p>
						</div>

						<hr className="my-4" />

						<div className="wrapper">
							<div className="top mt-4 flex items-center justify-between gap-3">
								<span className="rounded-lg bg-gray-300 px-3 py-1">
									AI Posts System
								</span>
								<SwitchButton />
							</div>
							<p className="bottom mt-2 text-sm">Allow AI to generate posts.</p>
						</div>
					</div>
				</div>

				{/* Right Section (Not specified in the original CSS, assuming empty) */}
				<div className="right w-47"></div>
			</div>
		</div>
	);
}
