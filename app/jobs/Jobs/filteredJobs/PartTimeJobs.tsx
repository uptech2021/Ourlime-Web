import { Job } from '@/types/global';
import Link from 'next/link';
import Image from 'next/image';

export default function PartTimeJobs({ job }: { job: Job[] }) {
	const partTimeJob = job.filter((job) => job.type === 'Part time');

	return (
		<div>
			{partTimeJob.length === 0 ? (
				<p className="text-center">No full time jobs found</p>
			) : (
				<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{partTimeJob.map((job) => (
						<div
							key={job.id}
							className="job-card flex flex-col items-center rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-lg"
						>
							<Link href={`/jobs/${job.id}`}>
								<div className="image-container relative mb-4 h-80 w-full">
									<Image
										src={job.imageUrl}
										alt={job.title}
										className="h-full w-full rounded-md"
									/>
								</div>
								<h2 className="mb-2 text-xl font-semibold">{job.title}</h2>
								<p className="text-gray-700">{job.description}</p>
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
