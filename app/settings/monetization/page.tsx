'use client';
import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react';

export default function Monetization() {
	const [showMoney, setShowMoney] = useState(false);
	const [price, setPrice] = useState('');
	const [duration, setDuration] = useState('');
	const [title, setTitle] = useState('');
	const [currancy, setCurrancy] = useState('');
	const [description, setDescription] = useState('');
	//TODO you used the set function but not the variable, what was the purpose of the variable? consider removing if not needed
	// const [infoSubmitted, setInfoSubmitted] = useState(false);
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const [packageToDeleteIndex, setPackageToDeleteIndex] = useState<number | null>(null);
	const [submittedPackages, setSubmittedPackages] = useState<Array<{ title: string; price: string; currency: string; duration: string; description: string }>>([]);

	const SubmittedInfo = ({ title, price, currency, duration, description, index }: { title: string; price: string; currency: string; duration: string; description: string; index: number }) => (
		<div className="border border-gray-300 p-4 mt-4 rounded text-left">
			<h3 className="font-bold">{title}</h3>
			<p className='text-xl font-bold'>Price: {price} {currency} / {duration}</p>
			<p>Description: {description}</p>
			{editIndex !== index && (
				<div className="flex justify-end mt-2">
					<Button size="sm" onClick={() => handleEdit(index)} className="mr-2">Edit</Button>
					<Button size="sm" onClick={() => handleDelete(index)}>Delete</Button>
				</div>
			)}
		</div>
	);



	const handleEdit = (index: number) => {
		setEditIndex(index);
		const packageToEdit = submittedPackages[index];
		setTitle(packageToEdit.title);
		setPrice(packageToEdit.price);
		setCurrancy(packageToEdit.currency);
		setDuration(packageToEdit.duration);
		setDescription(packageToEdit.description);
		setShowMoney(true);
	};

	const handleDelete = (index: number) => {
		setPackageToDeleteIndex(index);
		setShowDeleteConfirmation(true);
	};

	const confirmDelete = () => {
		if (packageToDeleteIndex !== null) {
			const newPackages = submittedPackages.filter((_, i) => i !== packageToDeleteIndex);
			setSubmittedPackages(newPackages);
			setShowDeleteConfirmation(false);
			setPackageToDeleteIndex(null);
		}
	};

	return (
		<>
			<main className="flex min-h-screen flex-col bg-gray-200 text-center">
				<h1 className="mb-6 pt-2 ml-6 lg:ml-[20%] mt-6 text-left text-2xl font-bold text-gray-800">
					Monetization
				</h1>

				<section className="mx-auto flex w-[95%] lg:w-[60%] flex-col items-center rounded-lg bg-white p-2 shadow-md">

					<section
						className="mx-auto mt-4 h-[8rem] w-[99%] items-center rounded-lg bg-gray-200 p-4"
						onClick={() => setShowMoney(!showMoney)}
					>
						<p className="mt-4 text-sm text-gray-800">Add New</p>
					</section>
					{showMoney && (
						<div
							className="filters-box z-1000 absolute top-[14rem] lg:top-[17rem] w-[90%] lg:mr-[24%] lg:w-[38%] rounded border border-gray-300 bg-white p-4 shadow-md"
						>
							<h2 className="text-ml mb-2 ml-2 mt-2 text-left font-bold text-gray-800">
								Add Package
							</h2>
							<form>
								<Input
									type="text"
									label="Title"
									placeholder=" "
									labelPlacement="outside"
									radius="sm"
									className="mb-6 pt-2 "
									onChange={(e) => setTitle(e.target.value)}
								/>
								<Input
									type="text"
									placeholder="Price"
									label="Price"
									labelPlacement="outside"
									radius="sm"
									className="mb-6 pt-2 "
									onKeyPress={(event) => {
										if (!/[0-9]/.test(event.key)) {
											event.preventDefault();
										}
									}}
									onChange={(event) => {
										const value = event.target.value.replace(/[^0-9]/g, '');
										setPrice(value);
										event.target.value = value;
									}}
								/>
								<Input
									type="text"
									placeholder="USD ($)"
									label="Currency"
									labelPlacement="outside"
									radius="sm"
									className="mb-6 pt-2 "
									onChange={(e) => setCurrancy(e.target.value)}
								/>
								<Input
									type="text"
									placeholder="Daily"
									label="Duration"
									labelPlacement="outside"
									radius="sm"
									className="mb-6 pt-2 "
									onChange={(e) => setDuration(e.target.value)}

								/>
								<Input
									type="text"
									placeholder=" "
									label="Description"
									labelPlacement="outside"
									radius="sm"
									className="mb-6 pt-2 "
									onChange={(e) => setDescription(e.target.value)}
								/>
							</form>
							<Button
								className={`mt-4 mx-auto rounded px-4 py-2 text-white ${!price || !duration || !title || !currancy || !description ? 'bg-none' : ''}`}
								disabled={!price || !duration || !title || !currancy || !description}
								onClick={() => {
									if (editIndex !== null) {
										const newPackages = [...submittedPackages];
										newPackages[editIndex] = { title, price, currency: currancy, duration, description };
										setSubmittedPackages(newPackages);
										setEditIndex(null);
									} else {
										setSubmittedPackages([...submittedPackages, { title, price, currency: currancy, duration, description }]);
									}
									// setInfoSubmitted(true);
									setShowMoney(false);
									// Clear form fields here
								}}
							>					 {editIndex !== null ? 'Save' : 'Add'}
							</Button>
						</div>
					)}

					<div className="flex flex-wrap justify-start gap-4 mt-4">
						{submittedPackages.map((pkg, index) => (
							<SubmittedInfo
								key={index}
								title={pkg.title}
								price={pkg.price}
								currency={pkg.currency}
								duration={pkg.duration}
								description={pkg.description}
								index={index}
							/>
						))}
					</div>


					{submittedPackages.length === 0 && (
						<>
							<button className="mt-10 h-12 w-12 rounded-full bg-purple-200" />
							<p className="mb-20 lg:mb-10 mt-4 text-sm text-gray-600">
								Unlock your earning potential today by offering and selling your
								exclusive content and posts.
							</p>
						</>
					)}
				</section>
			</main>

			{showDeleteConfirmation && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-4 rounded-lg">
						<p>Are you sure you want to delete this package?</p>
						<div className="mt-4 flex justify-end">
							<Button onClick={() => setShowDeleteConfirmation(false)} className="mr-2">Cancel</Button>
							<Button onClick={confirmDelete}>Delete</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
