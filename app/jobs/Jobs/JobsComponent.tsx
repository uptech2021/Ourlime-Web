import { Job } from '@/types/global';
import PartTimeJobs from './filteredJobs/PartTimeJobs';
import FullTimeJobs from './filteredJobs/FullTimeJobs';
import AllJobs from './filteredJobs/AllJobs';

export default function JobsComponent({
	selectedJob,
	jobs,
}: {
	selectedJob: string;
	jobs: Job[];
}) {
	return (
		<div className="jobs">
			{selectedJob === 'Full time' && <FullTimeJobs job={jobs} />}
			{selectedJob === 'Part time' && <PartTimeJobs job={jobs} />}
			{selectedJob === 'Internship' && (
				<p className="text-center">There are no {selectedJob} jobs available</p>
			)}
			{selectedJob === 'Volunteer' && (
				<p className="text-center">There are no {selectedJob} jobs available</p>
			)}
			{selectedJob === 'Contract' && (
				<p className="text-center">There are no {selectedJob} jobs available</p>
			)}
			{selectedJob === 'All' && <AllJobs allJobs={jobs} />}
		</div>
	);
}
