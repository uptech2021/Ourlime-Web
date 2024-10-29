'use client';
import Navbar from '@/comm/Navbar';
import car from '@/public/images/home/car.jpg';
import trees from '@/public/images/home/trees.jpg';
import { Job } from '@/types/global';
import { Button, Input } from '@nextui-org/react';
import { EllipsisVertical, MapPin, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import JobsComponent from './Jobs/JobsComponent';
import styles from './jobform.module.css';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';

export default function Jobs() {
	const [selected, setSelected] = useState<string>('All');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [jobs, setJobs] = useState<Job[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchJobs = async () => {
			setIsLoading(true);
			try {
				const querySnapshot = await getDocs(collection(db, 'jobs'));
				const jobsData = querySnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data()
				})) as Job[];
				setJobs(jobsData);
				console.log(jobsData);
			} catch (error) {
				console.error('Error fetching jobs:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchJobs();
	}, []);

	const handleClick = (value: string) => {
		setSelected(value);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	// Filter jobs based on selected type and search query
	const filteredJobs = jobs.filter(
		(job) =>
			(selected === 'All' || job.type === selected) &&
			(job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				job.description.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	return (
		<Navbar>
			<div className="overflow-scroll p-6">
			<div className="business-head mb-6 rounded-md bg-green-100 p-4">
				<h2 className="text-xl font-bold">Nearby Business</h2>
				<p className="text-gray-600">
					Find businesses near to you based on your location and connect with
					them directly.
				</p>
				<Button className="mt-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
					Explore
				</Button>
			</div>
			<div className="jobs-main rounded-md bg-white p-6 shadow-md">
				<header className="jobs-head mb-6">
					<h1 className="text-2xl font-bold">Jobs</h1>
				</header>
				<div className="mb-6 flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
					<div className="flex cursor-pointer items-center space-x-2">
						<MapPin />
						<p className="text-gray-600">Location</p>
					</div>
					<div className="flex cursor-pointer items-center space-x-2">
						<EllipsisVertical />
						<p className="text-gray-600">Categories</p>
					</div>
					<div className="flex w-full flex-grow items-center sm:w-auto">
						<Search className="mr-2 text-gray-400" size={20} />
						<Input
							type="search"
							radius="sm"
							label="Search for jobs"
							labelPlacement="inside"
							className="w-full"
							value={searchQuery}
							onChange={handleSearchChange}
						/>
					</div>
				</div>
				{/* Job Filter */}
				<div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
					<Button
						radius="sm"
						className={`${styles.filterButtons} ${
							selected === 'All' ? styles.active : ''
						}`}
						onClick={() => handleClick('All')}
					>
						All Jobs
					</Button>
					<Button
						radius="sm"
						className={`${styles.filterButtons} ${
							selected === 'Full time' ? styles.active : ''
						}`}
						onClick={() => handleClick('Full time')}
					>
						Full time
					</Button>
					<Button
						radius="sm"
						className={`${styles.filterButtons} ${
							selected === 'Part time' ? styles.active : ''
						}`}
						onClick={() => handleClick('Part time')}
					>
						Part time
					</Button>
					<Button
						radius="sm"
						className={`${styles.filterButtons} ${
							selected === 'Internship' ? styles.active : ''
						}`}
						onClick={() => handleClick('Internship')}
					>
						Internship
					</Button>
					<Button
						radius="sm"
						className={`${styles.filterButtons} ${
							selected === 'Volunteer' ? styles.active : ''
						}`}
						onClick={() => handleClick('Volunteer')}
					>
						Volunteer
					</Button>
					<Button
						radius="sm"
						className={`${styles.filterButtons} ${
							selected === 'Contract' ? styles.active : ''
						}`}
						onClick={() => handleClick('Contract')}
					>
						Contract
					</Button>
				</div>
				<main className="main-content flex flex-col items-center overflow-auto rounded-lg p-5">
					{isLoading ? (
						<div className="flex justify-center items-center min-h-[200px]">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
						</div>
					) : jobs.length > 0 ? (
						<JobsComponent 
							selectedJob={selected} 
							jobs={filteredJobs} 
							isLoading={isLoading}
						/>
					) : (
						<p className="text-gray-500">No available jobs to show.</p>
					)}
				</main>
			</div>
		</div>
		</Navbar>
	);
}
