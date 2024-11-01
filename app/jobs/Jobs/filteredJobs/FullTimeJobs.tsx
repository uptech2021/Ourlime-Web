import { Job } from '@/types/global';
import Link from 'next/link';

export default function FullTimeJobs({ job }: { job: Job[] }) {
	const fullTimeJob = job.filter((job) => job.type === 'Full time');

	return (
		<div>
			{fullTimeJob.length === 0 ? (
				<p className="text-center">No full time jobs found</p>
			) : (
				<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{fullTimeJob.map((job) => (
						<div
							key={job.id}
							className="rounded-sm border border-gray-300 bg-white shadow-default hover:shadow-lg transition-shadow duration-300"
						>
							<Link href={`/jobs/${job.id}`}>
								<div className="block px-4 py-2">
									<img
										src={job.imageUrl.toString()}
										alt={job.title}
										className="rounded-t-lg h-60 w-full object-cover"
										loading="lazy"
									/>
								</div>
								<div className="p-6">
									<h4 className="mb-3 text-xl font-semibold text-black hover:text-primary">
										{job.title}
									</h4>
									<p className="text-gray-600">{job.description}</p>
								</div>
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
