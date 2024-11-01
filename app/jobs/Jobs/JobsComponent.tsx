import { Job } from '@/types/global';
import PartTimeJobs from './filteredJobs/PartTimeJobs';
import FullTimeJobs from './filteredJobs/FullTimeJobs';
import AllJobs from './filteredJobs/AllJobs';
import InternshipJobs from './filteredJobs/InternshipJobs';
import VolunteerJobs from './filteredJobs/VolunteerJobs';
import ContractJobs from './filteredJobs/ContractJobs';

interface JobsComponentProp {
	selectedJob: string;
	jobs: Job[];
}

export default function JobsComponent({ selectedJob, jobs }: JobsComponentProp) {
	return (
		<div className="jobs">
			{selectedJob === 'Full time' && <FullTimeJobs job={jobs} />}
			{selectedJob === 'Part time' && <PartTimeJobs job={jobs} />}
			{selectedJob === 'Internship' && <InternshipJobs job={jobs} />}
			{selectedJob === 'Volunteer' && <VolunteerJobs job={jobs} />}
			{selectedJob === 'Contract' && <ContractJobs job={jobs} />}
			{selectedJob === 'All' && <AllJobs allJobs={jobs} />}
		</div>
	);
}
