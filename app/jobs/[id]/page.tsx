// app/market/[id]/page.tsx
import Navbar from '@/comm/Navbar';
import car from '@/public/images/home/car.jpg';
import trees from '@/public/images/home/trees.jpg';
import { Job } from '@/types/global';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';

type JobPageProps = {
	params: {
		id: string | undefined;
	};
};

// Mocked job data
const jobs: Job[] = [
	{
		id: '1',
		title: 'Software Engineer',
		description: 'We are looking for a software engineer to join our team.',
		type: 'Full time',
		imageUrl: trees,
	},
	{
		id: '2',
		title: 'Frontend Developer',
		description: 'We are looking for a frontend developer to join our team.',
		type: 'Part time',
		imageUrl: car,
	},
	// Add more jobs or fetch from an API/database
];

export default function ProductPage({ params }: JobPageProps) {

	if (!params?.id) {
		// If id is missing, render a not found page or handle accordingly
		return (
			<div className="product-not-found p-5 text-center">
				<h1 className="mb-4 text-2xl font-bold">Job Not Found</h1>
				<p className="text-lg text-gray-700">
					No Job ID provided. Please check the URL or go back to the market.
				</p>
				<Link href="/jobs" className="text-blue-500 underline">
					Back to Jobs
				</Link>
			</div>
		);
	}

	// Extract and parse the product id from the URL
	const { id } = params;

	// Find the job by ID
	const job = jobs.find((p) => p.id === id);
	// Handle the case where the job is not found
	if (!job) {
		return (
			<div className="job-not-found p-5 text-center">
				<h1 className="mb-4 text-2xl font-bold">Job Not Found</h1>
				<p className="text-lg text-gray-700">
					We couldn&apos;t find the job you&apos;re looking for. Please check the URL or
					go back to the market.
				</p>
				<Link href="/jobs" className="text-blue-500 underline">
					Back to Jobs
				</Link>
			</div>
		);
	}

	return (
		<Navbar>
			<div className="job-detail-page flex flex-col p-5 lg:flex-row">
			{/* Image Gallery */}
			<div className="job-gallery flex-1 p-4">
				<div className="main-image relative mb-4 h-80 w-full overflow-hidden rounded-md border border-gray-300">
					<Image
						src={job.imageUrl}
						alt={job.title}
						layout="fill"
						objectFit="cover"
						className="rounded-md"
					/>
				</div>
				<div className="thumbnail-images flex space-x-2">
					{/* Display additional images if available */}
					<div className="thumbnail relative h-20 w-20 overflow-hidden rounded-md border border-gray-300">
						<Image
							src={job.imageUrl}
							alt={`${job.title} thumbnail`}
							layout="fill"
							objectFit="cover"
							className="rounded-md"
						/>
					</div>
					{/* <div className="thumbnail relative w-20 h-20 border border-gray-300 rounded-md overflow-hidden">
                        <Image src={blackWoman} alt={`${job.title} thumbnail`} layout="fill" objectFit="cover" className="rounded-md" />
                    </div> */}
				</div>
			</div>

			{/* Job Details */}
			<div className="job-info flex-1 p-4">
				<h1 className="mb-2 text-3xl font-bold">{job.title}</h1>
				<p className="mb-2 text-lg text-gray-700">
					Published By <span className="font-bold">root</span>
				</p>
				<div className="job-type mb-4 flex items-center">
					<span className="mr-2 font-bold">Type:</span>
					<span className="text-gray-700">{job.type}</span>
				</div>
				<Button className="edit-job-btn mb-4 rounded-md bg-gray-200 p-2 text-gray-800">
					Edit job
				</Button>
				<div className="job-description">
					<h2 className="mb-2 text-xl font-bold">Details</h2>
					<p className="text-gray-700">{job.description}</p>
				</div>
			</div>
		</div>
		</Navbar>
	);
}

// Generate static params for all jobss
export async function generateStaticParams() {
	// Replace this with your actual product fetching logic
	const paths = jobs.map((jobs) => ({
		id: jobs.id.toString(), // Convert id to string for routing
	}));

	return paths;
}
