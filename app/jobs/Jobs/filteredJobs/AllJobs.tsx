import { Job } from '@/types/global';
import Link from 'next/link';
import Image from 'next/image';

export default function AllJobs({ allJobs, isLoading }: { allJobs: Job[], isLoading: boolean }) {
	if (isLoading) {
		return <div className="flex justify-center items-center min-h-[200px]">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
		</div>;
	}

	if (!allJobs || allJobs.length === 0) {
		return <p className="text-center">No available jobs to show</p>;
	}

	return (
		<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{allJobs.map((job) => (
				<div
					key={job.id}
					className="job-card flex flex-col items-center rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-lg"
				>
					<Link href={`/jobs/${job.id}`}>
						<div className="image-container relative mb-4 h-80 w-full">
							<img
								src={job.imageUrl.toString()}
								alt={job.title}
								className="h-full w-full rounded-md object-cover"
							/>
						</div>
						<h2 className="mb-2 text-xl font-semibold">{job.title}</h2>
						<p className="text-gray-700">{job.description}</p>
					</Link>
				</div>
			))}
		</div>
	);
}
