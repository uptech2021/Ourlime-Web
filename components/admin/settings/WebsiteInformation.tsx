'use client';
import React, { useState } from 'react';
import SwitchButton from '../SwitchButton';
import styles from './settings.module.css';
import { Input, Textarea } from '@nextui-org/react';

export default function WebsiteInformation() {
	const [websiteTitle, setWebsiteTitle] = useState(
		'Ourlime Private Communication Network'
	);
	const [websiteName, setWebsiteName] = useState('Ourlime');
	const [websiteKeywords, setWebsiteKeywords] = useState(
		'social, wowonder, social site'
	);
	const [websiteDescription, setWebsiteDescription] = useState(
		'Discover and connect with private communities on Ourlime. Explore shared interests, recipes, and tips with like-minded individuals.'
	);
	const [googleAnalyticsCode, setGoogleAnalyticsCode] = useState('');
	const [googleMapsAPI, setGoogleMapsAPI] = useState(
		'AIzaSyBOfpaMO_tMMsuvS2T4zx4llbtsFqMuT9Y'
	);
	const [googleTranslationAPIKey, setGoogleTranslationAPIKey] = useState('');
	const [youtubeAPIKey, setYoutubeAPIKey] = useState('');
	const [giphyAPIKey, setGiphyAPIKey] = useState(
		'420d477a542b4287b2bf91ac134ae041'
	);

	return (
		<div className={`${styles.layout}`}>
			{/* Left Section */}
			<div className="left lg:w-1/2">
				<div className="other-config flex flex-col gap-3 rounded-lg bg-white p-4">
					<h3 className="text-xl font-semibold">Website Information</h3>

					{/* Website Title */}
					<div className="wrapper Input-data">
						<Input
							label="Website Title"
							labelPlacement="outside"
							radius="sm"
							type="text"
							value={websiteTitle}
							onChange={(e) => setWebsiteTitle(e.target.value)}
						/>
						<p className="bottom text-sm">
							Your website general title, it will appear on Google and on your
							browser tab.
						</p>
					</div>

					{/* Website Name */}
					<div className="wrapper Input-data">
						<Input
							label="Website Name"
							labelPlacement="outside"
							radius="sm"
							type="text"
							value={websiteName}
							onChange={(e) => setWebsiteName(e.target.value)}
						/>
						<p className="bottom text-sm">
							Your website name, it will on website&apos;s footer and E-mails.
						</p>
					</div>

					{/* Website Keywords */}
					<div className="wrapper Input-data">
						<Input
							label="Website Keywords"
							labelPlacement="outside"
							radius="sm"
							type="text"
							value={websiteKeywords}
							onChange={(e) => setWebsiteKeywords(e.target.value)}
						/>
						<p className="bottom text-sm">
							Your website&apos;s keywords, used mostly for SEO and search engines.
						</p>
					</div>

					{/* Website Description */}
					<div className="wrapper Input-data">
						<Textarea
							label="Website Description"
							labelPlacement="outside"
							radius="sm"
							value={websiteDescription}
							onChange={(e) => setWebsiteDescription(e.target.value)}
						/>
						<p className="bottom text-sm">
							Your website&apos;s description, used mostly for SEO and search
							engines. Max of 100 characters is recommended.
						</p>
					</div>

					{/* Google Analytics Code */}
					<div className="wrapper Input-data">
						<Textarea
							label="Google Analytics Code"
							labelPlacement="outside"
							radius="sm"
							style={{ width: '100%', height: '4rem' }}
							value={googleAnalyticsCode}
							onChange={(e) => setGoogleAnalyticsCode(e.target.value)}
						/>
						<p className="bottom text-sm">
							Paste your full Google Analytics Code here to track traffic.
						</p>
					</div>
				</div>
			</div>

			{/* Right Section */}
			<div className="right lg:w-1/2">
				<div className="general-config flex flex-col gap-3 rounded-lg bg-white p-4">
					<h3 className="text-xl font-semibold">
						Features API Key & Information
					</h3>

					{/* Google Maps */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span>Google Maps</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Show Google Map on (Posts, Profile, Settings, Ads).
						</p>
					</div>

					{/* Google Maps API */}
					<div className="wrapper Input-data">
						<Input
							label="Google Maps API"
							labelPlacement="outside"
							radius="sm"
							type="text"
							value={googleMapsAPI}
							onChange={(e) => setGoogleMapsAPI(e.target.value)}
						/>
						<p className="bottom text-sm">
							This key is required for GEO and viewing Google Maps.
						</p>
					</div>

					{/* Google Translation API */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span>Google Translation API</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">Translate post text.</p>
					</div>

					{/* Google Translation API Key */}
					<div className="wrapper Input-data">
						<Input
							label="Google Translation API Key"
							labelPlacement="outside"
							radius="sm"
							type="text"
							value={googleTranslationAPIKey}
							onChange={(e) => setGoogleTranslationAPIKey(e.target.value)}
						/>
						<p className="bottom text-sm">
							This key is required for post translation.
						</p>
					</div>

					{/* Youtube API Key */}
					<div className="wrapper Input-data">
						<Input
							label="Youtube API Key"
							labelPlacement="outside"
							radius="sm"
							type="text"
							value={youtubeAPIKey}
							onChange={(e) => setYoutubeAPIKey(e.target.value)}
						/>
						<p className="bottom text-sm">
							This key is required for importing or posting YouTube videos.
						</p>
					</div>

					{/* Giphy API Key */}
					<div className="wrapper Input-data">
						<Input
							label="Giphy API"
							labelPlacement="outside"
							radius="sm"
							type="text"
							value={giphyAPIKey}
							onChange={(e) => setGiphyAPIKey(e.target.value)}
						/>
						<p className="bottom text-sm">
							This key is required for GIFs in messages, posts and comments.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
