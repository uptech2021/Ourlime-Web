'use client';
import dynamic from 'next/dynamic';
import { Input } from '@nextui-org/react';
import React, { useState } from 'react';
import { LatLngLiteral } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import friend from '@/public/images/friend/no_user.png';
import FilterBox from '@/components/settings/friend/filterBox';


const MapContainer = dynamic(
	() => import('react-leaflet').then((mod) => mod.MapContainer),
	{ ssr: false }
);
const TileLayer = dynamic(
	() => import('react-leaflet').then((mod) => mod.TileLayer),
	{ ssr: false }
);

const FindFriendsPage: React.FC = () => {
	const [showFilters, setShowFilters] = useState(false);
	const [gender, setGender] = useState('All');
	const [status, setStatus] = useState('All');
	const [distance, setDistance] = useState(1);
	const [relationship, setRelationship] = useState('All');

	return (
		<div className="find-friends-page m-0 flex h-[100vh] w-full flex-col lg:flex-row lg:items-start lg:justify-between lg:p-5">


			<div className="map-container h-[13rem] w-full bg-gray-200 lg:h-[55rem] lg:w-[45%] lg:top-0">

				<MapContainer
					center={{ lat: 0, lng: 0 } as LatLngLiteral}
					zoom={2}
					style={{ height: '100%', width: '100%' }}
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>
				</MapContainer>
			</div>
			<div className="search-container mx-auto w-[90%] lg:w-[50%] lg:pl-8 lg:bg-white lg:pt-4">

				<h2 className="mb-2 text-xl lg:font-bold lg:text-black">Find friends</h2>
				<p className="ssl-warning mb-4 lg:mb-2 rounded bg-orange-100 p-1 lg:p-2 text-sm font-semibold text-orange-500">
					SSL is required to be able to use this feature. (Just admin can see
					this warning)
				</p>
				<div className="search-bar flex w-full lg:items-center">
					<Input
						type="text"
						label="Search for users"
						labelPlacement='outside'
						placeholder=" "
						className="search-input lg:mr-2 rounded-full p-1 lg:p-2 text-sm lg:flex-1"
					/>
					<div
						className="filter-icon  h-7 w-7 cursor-pointer  rounded-full bg-redTheme p-4 lg:h-8 lg:w-8 lg:p-2.5 text-white mt-8"
						onClick={() => setShowFilters(!showFilters)}
					>
						{/* Add filter icon here */}
					</div>
				</div>
				<FilterBox
					showFilters={showFilters}
					gender={gender}
					setGender={setGender}
					status={status}
					setStatus={setStatus}
					distance={distance}
					setDistance={setDistance}
					relationship={relationship}
					setRelationship={setRelationship}
				/>
				<div className="mb-80 flex flex-col items-center justify-start pt-8 lg:h-screen">
					<Image src={friend} alt="no_friend" />
					<p className="lg:text-gray-700">No users to show</p>
				</div>
			</div>
		</div>
	);
};

export default FindFriendsPage;
